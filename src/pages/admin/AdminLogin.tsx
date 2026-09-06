import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function AdminLogin() {
  useDocumentMeta({ title: 'Admin Login | Fiesta Agency' });
  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate('/admin', { replace: true });
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif font-medium text-3xl tracking-tight text-ivory">
            FIESTA
          </h1>
          <p className="text-[0.8rem] text-white/35 mt-2">
            Sign in to your admin account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent border-b border-white/[0.12] px-0 py-3 text-[0.85rem] text-ivory placeholder:text-white/20 focus:border-gold/40 focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent border-b border-white/[0.12] px-0 py-3 text-[0.85rem] text-ivory placeholder:text-white/20 focus:border-gold/40 focus:outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-gold"
              />
              <span className="text-[0.75rem] text-white/35">Remember me</span>
            </label>
            <button
              type="button"
              className="text-[0.75rem] text-gold/70 hover:text-gold transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-[0.8rem] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-obsidian py-3 rounded text-[0.7rem] font-semibold uppercase tracking-[0.15em] border-none cursor-pointer transition-all duration-200 hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

