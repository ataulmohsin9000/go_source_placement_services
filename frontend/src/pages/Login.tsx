import React, { useState } from 'react';
import api from '../api';
import { ArrowRight, Globe2, Plane, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@gosource.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result: any = await api.post('/auth/login', { email, password });
      onLogin(result.data.user);
    } catch (loginError: unknown) {
      const message =
        typeof loginError === 'object' &&
        loginError !== null &&
        'message' in loginError &&
        typeof loginError.message === 'string'
          ? loginError.message
          : 'Unable to sign in. Check the API connection and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="login-brand">
          <div className="login-brand-mark">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">Go Source</p>
            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.16em] text-teal-100/70">Placement Services</p>
          </div>
        </div>

        <div className="login-hero-copy">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200">Client journeys, made clearer</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
            Every application.
            <br />
            One connected workspace.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-slate-300">
            Keep enquiries, visa cases, client records, and collections moving with a calmer view of your operations.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-[11px] font-medium text-slate-200">
            <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-teal-300" /> Multi-country workflows</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-300" /> Team-ready client records</span>
          </div>
        </div>

        <p className="relative z-10 hidden text-[10px] text-slate-400 sm:block">
          Go Source Placement Services · Internal workspace
        </p>
      </section>

      <section className="login-form-panel">
        <form onSubmit={handleSubmit} className="login-form-card space-y-5">
          <div>
            <p className="page-eyebrow">Secure workspace</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-1.5 text-xs text-slate-500">Sign in to continue to your visa services dashboard.</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {error && <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-700" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-[10px] leading-5 text-slate-400">
              Seeded development account: <span className="font-medium text-slate-500">admin@gosource.com / Admin@123</span>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};
