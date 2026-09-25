import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { evaluatePasswordStrength } from '../../utils/security';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'RESET';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    requestPasswordReset, 
    continueAsGuest,
    error, 
    clearError 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    let success = false;

    if (mode === 'LOGIN') {
      success = await loginWithEmail(email, password);
    } else if (mode === 'REGISTER') {
      success = await registerWithEmail(email, password, displayName);
    } else if (mode === 'RESET') {
      success = await requestPasswordReset(email);
      if (success) {
        setResetSent(true);
      }
    }

    setIsSubmitting(false);

    if (success && mode !== 'RESET') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 }
      });
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    clearError();
    const success = await loginWithGoogle();
    setIsSubmitting(false);
    if (success) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 }
      });
      onClose();
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                {mode === 'LOGIN' && 'Iniciar Sesión'}
                {mode === 'REGISTER' && 'Crear Cuenta Segura'}
                {mode === 'RESET' && 'Recuperar Contraseña'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                FINHOME • Seguridad Bancaria & Datos Aislados
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de modo Login / Registro */}
        {mode !== 'RESET' && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); clearError(); }}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  mode === 'LOGIN'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => { setMode('REGISTER'); clearError(); }}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  mode === 'REGISTER'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Registrarme
              </button>
            </div>
          </div>
        )}

        {/* Cuerpo del formulario */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Mensaje de error general */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Mensaje de éxito reseteo */}
          {resetSent && mode === 'RESET' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Enviamos un enlace de recuperación a <strong>{email}</strong>. Revisa tu casilla o carpeta de spam.</span>
            </div>
          )}

          {/* Botón Google Auth */}
          {mode !== 'RESET' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-3 transition shadow-sm active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">o con correo</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Nombre (sólo en registro) */}
            {mode === 'REGISTER' && (
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Nombre o Apodo
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej: Nico"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Contraseña (login o registro) */}
            {mode !== 'RESET' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Contraseña
                  </label>
                  {mode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => { setMode('RESET'); clearError(); }}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>

                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete={mode === 'LOGIN' ? 'current-password' : 'new-password'}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Medidor de fortaleza (en registro) */}
                {mode === 'REGISTER' && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${
                        strength.score <= 1 ? 'w-1/4 bg-rose-500' :
                        strength.score === 2 ? 'w-2/4 bg-amber-500' :
                        strength.score === 3 ? 'w-3/4 bg-blue-500' :
                        'w-full bg-emerald-500'
                      }`} />
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Fortaleza: {strength.label}
                      </span>
                      <span className="text-slate-400">{strength.feedback}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isSubmitting || (mode === 'RESET' && resetSent)}
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <span>
                    {mode === 'LOGIN' && 'Iniciar Sesión'}
                    {mode === 'REGISTER' && 'Crear mi Cuenta'}
                    {mode === 'RESET' && (resetSent ? 'Enlace Enviado' : 'Enviar Enlace de Recuperación')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Volver a Login si está en reset */}
          {mode === 'RESET' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setResetSent(false); clearError(); }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          )}

          {/* Footer de Modo Invitado / Seguridad */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={handleGuest}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
            >
              Continuar como Invitado (Modo Local Offline)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
