import { useEffect, useState } from 'react';
import { MessageCircle, Instagram, Facebook, Music, X } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';

export function WhatsAppButton() {
  const { settings, loading } = useSiteSettings();
  const [phone, setPhone] = useState('+250788123456');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (settings?.whatsapp) {
      setPhone(settings.whatsapp.replace(/\D/g, ''));
    } else if (settings?.phone) {
      setPhone(settings.phone.replace(/\D/g, ''));
    }
  }, [settings]);

  if (loading) return null;

  const message = 'Hello! I\'d like to inquire about booking an event with Fiesta Agency.';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const instagram = settings?.instagram;
  const facebook = settings?.facebook;
  const tiktok = settings?.tiktok;

  const socials = [
    instagram && { href: instagram, icon: Instagram, label: 'Instagram' },
    facebook && { href: facebook, icon: Facebook, label: 'Facebook' },
    tiktok && { href: tiktok, icon: Music, label: 'TikTok' },
  ].filter(Boolean) as Array<{ href: string; icon: typeof Instagram; label: string }>;

  return (
    <div className="contact-widget">
      {/* Expanded social links */}
      {expanded && socials.length > 0 && (
        <div className="contact-widget-links">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="contact-widget-link"
            >
              <s.icon size={15} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Close contact options' : 'Contact us'}
        className="contact-widget-main"
        style={{
          background: expanded ? '#151515' : '#D6A856',
          border: expanded ? '1px solid rgba(245,242,234,0.1)' : 'none',
        }}
      >
        {expanded ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* WhatsApp — direct link when collapsed */}
      {!expanded && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="contact-widget-wa-link"
        />
      )}

      <style>{`
        .contact-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .contact-widget-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: cwFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .contact-widget-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #151515;
          border: 1px solid rgba(245,242,234,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F5F2EA;
          transition: border-color 0.3s ease;
        }
        .contact-widget-link:hover {
          border-color: rgba(214,165,74,0.4);
        }
        .contact-widget-main {
          width: 48px;
          height: 48px;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease;
        }
        .contact-widget-main:hover {
          transform: scale(1.1);
        }
        .contact-widget-wa-link {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        @keyframes cwFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
