import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalPath?: string;
}

const SITE_NAME = 'Fiesta Agency';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80';

export function useDocumentMeta({ title, description, ogImage, canonicalPath }: MetaOptions) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('og:title', title);
      setMeta('twitter:title', title);
      setMeta('og:site_name', SITE_NAME);
    }
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description);
      setMeta('twitter:description', description);
    }
    const image = ogImage || DEFAULT_OG_IMAGE;
    setMeta('og:image', image);
    setMeta('twitter:image', image);
    setMeta('og:type', 'website');

    if (canonicalPath) {
      const origin = window.location.origin;
      const canonicalUrl = `${origin}${canonicalPath}`;
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
      setMeta('og:url', canonicalUrl);
    }
  }, [title, description, ogImage, canonicalPath]);
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;
  if (!el) el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (el) {
    el.setAttribute('content', content);
  } else {
    const meta = document.createElement('meta');
    meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}
