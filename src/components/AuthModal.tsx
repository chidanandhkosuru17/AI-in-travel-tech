import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Chrome,
  ArrowRight,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    t,
  } = useTravel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (authModalMode === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      setIsLoading(true);
      const res = await login(email, password);
      setIsLoading(false);

      if (!res.success) {
        setError(res.error || 'Invalid login credentials.');
      } else {
        setIsAuthModalOpen(false);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please complete all required fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!termsAccepted) {
        setError('Please agree to the Terms of Service and Privacy Policy.');
        return;
      }
      setIsLoading(true);
      const res = await register(name, email, password);
      setIsLoading(false);

      if (!res.success) {
        setError(res.error || 'Registration failed.');
      } else if (res.message) {
        setNotice(res.message);
        setPassword('');
        setConfirmPassword('');
      } else {
        setIsAuthModalOpen(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-[#667085] hover:text-[#101828] hover:bg-[#F8F7F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-[#101828]">
              {authModalMode === 'login' ? t.auth.welcomeBack : t.auth.registerTitle}
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              {authModalMode === 'login' ? t.auth.journeyStarts : t.auth.registerSubtitle}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] font-medium">
              {error}
            </div>
          )}

          {notice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15803D] font-medium leading-relaxed">
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                  {t.auth.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chidanandh Kosuru"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                {t.auth.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#101828]">
                  {t.auth.passwordLabel}
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                    className="text-xs font-semibold text-[#0057FF] hover:underline"
                  >
                    {t.auth.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#667085] hover:text-[#101828]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                  {t.auth.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828]"
                    required
                  />
                </div>
              </div>
            )}

            {authModalMode === 'register' && (
              <label className="flex items-start gap-2 text-xs text-[#667085] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-[#E4E7EC] text-[#0057FF] focus:ring-[#0057FF]"
                />
                <span>{t.auth.termsText}</span>
              </label>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-sm font-bold shadow-lg shadow-[#0057FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                <span>{authModalMode === 'login' ? t.auth.signInBtn : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            {authModalMode === 'login' ? (
              <p className="text-xs text-[#667085]">
                {t.auth.noAccount}{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="font-bold text-[#0057FF] hover:underline"
                >
                  {t.auth.createAccountLink}
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#667085]">
                {t.auth.haveAccount}{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="font-bold text-[#0057FF] hover:underline"
                >
                  {t.auth.signInBtn}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </>
  );
};
