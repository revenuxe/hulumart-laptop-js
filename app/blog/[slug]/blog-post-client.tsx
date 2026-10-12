"use client";

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Clock, Link2, List, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articleSections, BlogPost, BlogSummary, formatBlogDate, readingMinutes } from '@/lib/blog';
import { BlogCTA } from '@/components/blog/BlogCTA';
import { BlogServiceLinks } from "@/components/blog/BlogServiceLinks";
import { BlogCover } from '@/components/blog/BlogCover';
import { blogStory } from '@/lib/blog-stories';

export function BlogPostClient({ post, relatedPosts = [] }: { post: BlogPost; relatedPosts?: BlogSummary[] }) {
  const story = blogStory(post.slug);
  const articleRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const sections = articleSections(post.content);
  const buying = post.category === 'Buying Guide' || post.category === 'Comparison';
  const date = formatBlogDate(post.updated_at || post.created_at);
  const content = post.content.replace(/^\s*#\s+[^\n]+\n/, '');
  let headingIndex = 0;
  const blocks: string[] = [];
  let fenced = false;
  for (const line of content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (!blocks.length || (!fenced && /^##\s/.test(line))) blocks.push(line);
    else blocks[blocks.length - 1] += `\n${line}`;
  }

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight + 120);
      setProgress(Math.min(100, Math.max(0, (120 - rect.top) / distance * 100)));
      const headings = Array.from(articleRef.current.querySelectorAll<HTMLHeadingElement>('h2[id]'));
      const current = headings.filter(heading => heading.getBoundingClientRect().top <= 160).pop();
      setActiveSection(current?.id || headings[0]?.id || '');
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [post.content]);

  useEffect(() => {
    if (copyStatus === 'idle') return;
    const timer = setTimeout(() => setCopyStatus('idle'), 3000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); setCopyStatus('copied'); }
    catch { setCopyStatus('failed'); }
  }

  const contentsLinks = <ol className="space-y-1">{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} aria-current={activeSection === section.id ? 'location' : undefined} className={`flex gap-3 rounded-lg px-3 py-2 text-sm leading-snug transition-colors hover:bg-primary/5 hover:text-primary ${activeSection === section.id ? 'bg-primary/5 font-semibold text-primary' : 'text-muted-foreground'}`}><span className="min-w-4 text-xs tabular-nums opacity-60">{String(index + 1).padStart(2, '0')}</span>{section.title}</a></li>)}</ol>;

  return <div className="flex min-h-screen flex-col"><Header />
    <div aria-hidden="true" className="sticky top-14 z-40 h-1 bg-primary/10 sm:top-16 md:top-20"><div className="h-full bg-secondary" style={{ width: `${progress}%` }} /></div>
    <main className="flex-1">
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-secondary/10"><div className="container py-8 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/blog" className="inline-flex items-center gap-2 hover:text-primary"><ArrowLeft className="h-4 w-4" />All guides</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
        <div className="grid items-center gap-7 lg:grid-cols-[1.3fr_0.7fr]"><div className="min-w-0"><h1 className="text-[30px] font-bold leading-[1.16] tracking-tight sm:text-4xl lg:text-[44px]">{post.title}</h1><p className="mt-5 max-w-3xl text-sm leading-7 sm:text-base text-muted-foreground">{post.excerpt}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><User className="h-4 w-4" />{post.author || 'Hulumart Editorial Team'}</span><span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{readingMinutes(post.content)} min read</span>{date && <time dateTime={post.updated_at || post.created_at || undefined}>Updated {date}</time>}<button onClick={copyLink} className="inline-flex items-center gap-2 rounded-lg px-2 py-1 font-medium text-primary hover:bg-primary/5">{copyStatus === 'copied' ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}{copyStatus === 'copied' ? 'Link copied' : 'Copy link'}</button><span role="status" className="sr-only">{copyStatus === 'copied' ? 'Article link copied' : copyStatus === 'failed' ? 'Unable to copy. Copy the address from your browser.' : ''}</span></div>
          {sections[0] && <a href={`#${sections[0].id}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Start reading<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>}
        </div><div className="overflow-hidden rounded-3xl border shadow-sm"><BlogCover category={post.category} image={post.featured_image} large /></div></div>
      </div></section>
      <div className="container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-16 lg:py-14">
        <div className="min-w-0">
          {story && <section className="mb-8 rounded-3xl border bg-card p-5 sm:p-7" aria-labelledby="story-opening"><h2 id="story-opening" className="text-xl font-bold tracking-tight sm:text-2xl">{story.heading}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{story.opening}</p><h3 className="mt-6 text-sm font-semibold">What you’ll take away</h3><ul className="mt-3 space-y-3">{story.takeaways.map(takeaway => <li key={takeaway} className="flex gap-3 text-sm leading-6 text-muted-foreground"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-secondary" />{takeaway}</li>)}</ul></section>}
          {!!sections.length && <details className="mb-8 rounded-xl border bg-muted/30 p-4 lg:hidden"><summary className="cursor-pointer text-sm font-semibold"><List className="mr-2 inline h-4 w-4" />In this guide · {sections.length} sections</summary><nav aria-label="Article contents" className="mt-4">{contentsLinks}</nav></details>}
          <article aria-label={post.title} ref={articleRef} className="blog-article max-w-[760px]">
            {blocks.map((block, index) => {
              const section = /^##\s/.test(block) ? sections[headingIndex++] : undefined;
              return <div key={index}>
              <div className="blog-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                h1: ({ children }) => <h2>{children}</h2>,
                h2: ({ children }) => <h2 id={section?.id}>{children}</h2>,
                a: ({ href, children }) => href?.startsWith('/') && !href.startsWith('//') ? <Link href={href}>{children}</Link> : <a href={href} rel="noopener noreferrer">{children}</a>,
                img: ({ src, alt }) => <img src={src} alt={alt || ''} loading="lazy" className="my-8 h-auto max-w-full rounded-xl" />,
                table: ({ children }) => <div className="overflow-x-auto"><table>{children}</table></div>,
              }}>{block}</ReactMarkdown></div>
            </div>; })}
          </article>
          <BlogServiceLinks slug={post.slug} />
          <div className="mt-10"><BlogCTA buying={buying} story={story} /></div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-sm"><Link href="/blog" className="inline-flex items-center gap-2 font-medium text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Explore all guides</Link><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })} className="text-muted-foreground hover:text-primary">Back to top ↑</button></div>
        </div>
        <aside className="hidden lg:block"><div className="sticky top-28 space-y-6">
          {!!sections.length && <nav aria-label="Article contents" className="rounded-2xl border p-4"><p className="mb-3 flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wider"><List className="h-4 w-4 text-primary" />In this guide</p><div className="max-h-[45vh] overflow-y-auto">{contentsLinks}</div></nav>}
          <BlogCTA compact buying={buying} story={story} />
        </div></aside>
      </div>
      {!!relatedPosts.length && <section className="border-t bg-muted/25 py-12 md:py-16"><div className="container"><h2 className="mb-7 text-3xl font-bold tracking-tight">Continue your next chapter</h2><div className="grid gap-5 md:grid-cols-3">{relatedPosts.map(related => <Link key={related.slug} href={`/blog/${related.slug}`} className="group flex flex-col rounded-2xl border bg-background p-6 transition-shadow hover:shadow-md"><span className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">{related.category}</span><h3 className="text-xl font-bold leading-snug group-hover:text-primary">{related.title}</h3><p className="mb-5 mt-3 text-sm leading-relaxed text-muted-foreground">{related.excerpt}</p><span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">Read the guide <ArrowRight className="h-4 w-4" /></span></Link>)}</div></div></section>}
    </main><Footer /></div>;
}
