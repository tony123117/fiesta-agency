import { MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

export function WhatsAppButton({ settings }: { settings: SiteSettings | null }) {
  const number = settings?.whatsapp?.replace(/[^0-9]/g, '');
  if (!number) return null;
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gold text-obsidian rounded-full shadow-lg hover:scale-110 transition-transform duration-500 ease-lux"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={22} />
    </a>
  );
}
