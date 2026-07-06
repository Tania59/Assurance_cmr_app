import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { COLORS } from '../../../shared/constants/colors';
import type { ApiError } from '../../../lib/api';

export default function LoginScreen() {
  const { user, login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Déjà connecté → le guard redirige vers /
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      // Pas de navigate() ici — le dispatch(LOGIN) déclenche un re-render
      // qui évalue le guard `if (user)` ci-dessus et redirige proprement.
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(160deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}
    >
      {/* En-tête */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M32 4 L60 32 L32 60 L4 32 Z"  fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <path d="M32 12 L52 32 L32 52 L12 32 Z" fill="rgba(255,255,255,0.2)"  stroke="white"                strokeWidth="2" />
          <path d="M32 20 L44 32 L32 44 L20 32 Z" fill="white" />
        </svg>
        <h1 className="font-montserrat font-extrabold text-2xl mt-4" style={{ color: '#fff' }}>
          Assurance CRM
        </h1>
        <p className="font-inter text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Votre portefeuille, partout avec vous
        </p>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 mx-4 mb-6 bg-white rounded-2xl p-6 flex flex-col gap-5"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
      >
        {/* Email */}
        <div>
          <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
            Téléphone / Email
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-3"
            style={{ background: '#F0F2F5', border: `1.5px solid ${email ? COLORS.secondary : COLORS.border}` }}
          >
            <Mail size={16} color={COLORS.muted} />
            <input
              className="font-inter flex-1 py-3 text-sm bg-transparent outline-none"
              style={{ color: COLORS.text }}
              placeholder="agent@assurance-crm.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
            Mot de passe
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-3"
            style={{ background: '#F0F2F5', border: `1.5px solid ${password ? COLORS.secondary : COLORS.border}` }}
          >
            <Lock size={16} color={COLORS.muted} />
            <input
              className="font-inter flex-1 py-3 text-sm bg-transparent outline-none"
              style={{ color: COLORS.text }}
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}>
              {showPw
                ? <EyeOff size={16} color={COLORS.muted} />
                : <Eye    size={16} color={COLORS.muted} />}
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div
            className="font-inter text-sm text-center px-3 py-2.5 rounded-xl"
            style={{ background: '#FEE2E2', color: '#991B1B' }}
          >
            {error}
          </div>
        )}

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="font-montserrat font-bold text-base rounded-xl py-4 mt-1 active:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: COLORS.primary, color: '#fff' }}
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        <div className="text-center">
          <span className="font-inter text-xs" style={{ color: COLORS.muted }}>
            Mot de passe oublié ?{' '}
          </span>
          <span className="font-inter text-xs font-semibold" style={{ color: COLORS.secondary }}>
            Réinitialiser
          </span>
        </div>
      </form>
    </div>
  );
}
