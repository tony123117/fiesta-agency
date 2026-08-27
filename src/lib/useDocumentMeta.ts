import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  ogImage?: string;
}

export function useDocumentMeta({ title, description, ogImage }: MetaOptions) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('og:title', title);
      setMeta('twitter:title', title);
    }
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description);
      setMeta('twitter:description', description);
    }
    if (ogImage) {
      setMeta('og:image', ogImage);
      setMeta('twitter:image', ogImage);
    }
  }, [title, description, ogImage]);
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
