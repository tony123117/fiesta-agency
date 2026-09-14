import { useEffect, useRef, useState } from 'react';

export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px', ...optionsRef.current });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
