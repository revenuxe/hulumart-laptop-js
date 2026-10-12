import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogStory } from '@/lib/blog-stories';

export function BlogCTA({ buying = false, compact = false, story }: { buying?: boolean; compact?: boolean; story?: BlogStory }) {
  const title = story?.ctaTitle || (buying ? 'Make your next laptop decision with a plan.' : 'Ready for your laptop’s next chapter?');
  const text = story?.ctaText || (buying ? 'Tell our team what you need from your next computer and ask the questions that matter to you.' : 'Choose your model, describe its condition, and discuss assessment and pickup with Hulumart.');
  return <aside aria-label="Your next step" className={`rounded-3xl bg-foreground text-background ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
    <div className={`flex gap-6 ${compact ? 'flex-col' : 'flex-col xl:flex-row xl:items-center xl:justify-between'}`}>
      <div><h2 className={`${compact ? 'text-lg' : 'text-xl sm:text-2xl'} font-bold leading-tight tracking-tight`}>{title}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-background/80">{text}</p></div>
      <div className={`shrink-0 ${compact ? '' : 'xl:max-w-[230px]'}`}><Button asChild className="h-auto min-h-12 w-full whitespace-normal rounded-xl bg-background px-4 py-3 text-sm text-foreground hover:bg-background/90"><Link href={story?.ctaHref || (buying ? '/contact' : '/sell/laptop')}>{story?.ctaLabel || (buying ? 'Talk to our team' : 'Choose my device')}<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4 shrink-0" /></Link></Button><a href="https://wa.me/919886579923?text=Hi%20Hulumart%2C%20I%20have%20a%20question%20after%20reading%20your%20guide." target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 text-xs text-background/85 underline underline-offset-4"><img src="/assets/whatsapp-mark.svg" width={16} height={16} alt="" />Ask on WhatsApp</a></div>
    </div>
  </aside>;
}
