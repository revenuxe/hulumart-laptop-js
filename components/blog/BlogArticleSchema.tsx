import { BlogPost, jsonLd } from '@/lib/blog';

export function BlogArticleSchema({ post }: { post: BlogPost }) {
  const url = `https://www.hulumart.com/blog/${post.slug}`;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'BlogPosting', '@id': `${url}#article`, headline: post.title, description: post.excerpt,
      mainEntityOfPage: url, url, datePublished: post.created_at || undefined, dateModified: post.updated_at || post.created_at || undefined,
      author: { '@type': 'Organization', name: post.author || 'Hulumart Editorial Team' },
      publisher: { '@type': 'Organization', name: 'Hulumart', url: 'https://www.hulumart.com', logo: { '@type': 'ImageObject', url: 'https://www.hulumart.com/assets/hulumart-logo.avif' } },
      image: post.featured_image || undefined, keywords: post.keywords?.join(', '), articleSection: post.category,
    }, {
      '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.hulumart.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.hulumart.com/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    }],
  }) }} />;
}
