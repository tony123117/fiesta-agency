import { Link } from 'react-router-dom';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function NotFound() {
  useDocumentMeta({ title: 'Page Not Found — Fiesta Agency' });
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="text-center">
        <span className="label-gold mb-6 block">404</span>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-ivory mb-6">This page doesn't exist.</h1>
        <p className="text-ivory-muted mb-10">The page you're looking for may have been moved or removed.</p>
        <Link to="/" className="btn-gold">Return Home</Link>
      </div>
    </div>
  );
}
