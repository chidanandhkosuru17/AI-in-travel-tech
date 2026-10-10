import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Chrome,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginCardProps {
  onSwitchToRegister?: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onSwitchToRegister }) => {
  const { user, login, logout, t, setCurrentView } = useTravel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // If user is already logged in, render an active traveler status card
  if (user) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-8 backdrop-blur-xl transition-all">
        <div className="flex items-center gap-4 pb-5 border-b border-[#E4E7EC]">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0057FF] shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#15803D] text-white p-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#101828]">{user.name}</h3>
              <span className="text-[10px] bg-[#EAF0FF] text-[#0057FF] px-2 py-0.5 rounded-full font-bold">
                Verified
              </span>
            </div>
            <p className="text-xs text-[#667085] truncate">{user.email}</p>
            <p className="text-xs text-[#0057FF] font-medium mt-1">RoamAgent Sentinel Active</p>
          </div>
        </div>

        <div className="py-5 space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0057FF] text-white flex items-center justify-center font-bold text-xs">
                HYD
              </div>
              <div>
                <p className="text-xs font-bold text-[#101828]">Upcoming Trip to Goa</p>
                <p className="text-[11px] text-[#667085]">Tomorrow • 06:15 AM (Multimodal)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#15803D] bg-emerald-50 px-2 py-1 rounded-md">
              On Schedule
            </span>
          </div>

          <button
            onClick={() => setCurrentView('my-journeys')}
            className="w-full py-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold shadow-md shadow-[#0057FF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Boarding Pass & Live Tracking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentView('assistant')}
            className="w-full py-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#EAF0FF] text-[#101828] text-xs font-semibold border border-[#E4E7EC] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0057FF]" />
            <span>Ask Travel Assistant</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
          <button
            onClick={() => setCurrentView('safety')}
            className="text-xs text-[#667085] hover:text-[#0057FF] font-medium transition-colors"
          >
            Safety Center
          </button>
          <button
            onClick={logout}
            className="text-xs text-[#DC2626] hover:underline font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Password must contain at your credentials.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(email);
      setSuccessMessage('Successfully signed in!');
    }, 600);
  };

  const handleQuickDemo = () => {
    setEmail('kosuruchidanandh@gmail.com');
    setPassword('RoamAgent2026!');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('kosuruchidanandh@gmail.com', 'Chidanandh Kosuru');
    }, 400);
  };

  const handleGoogleDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login('google.traveler@example.com', 'Google Verified Traveler');
    }, 500);
  };

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-8 backdrop-blur-xl relative transition-all">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#101828] tracking-tight">
              {t.auth.welcomeBack}
            </h2>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0057FF] animate-ping" />
          </div>
          <p className="text-sm text-[#667085] mt-1">{t.auth.journeyStarts}</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] font-medium flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15803D] font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
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
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828] transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#101828]">
                {t.auth.passwordLabel}
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-xs font-semibold text-[#0057FF] hover:underline cursor-pointer"
              >
                {t.auth.forgotPassword}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#667085] hover:text-[#101828] cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-[#0057FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.auth.signingIn}</span>
              </span>
            ) : (
              <span>{t.auth.signInBtn}</span>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#667085]">
            {t.auth.noAccount}{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-bold text-[#0057FF] hover:underline cursor-pointer"
            >
              {t.auth.createAccountLink}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E4E7EC]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-[#667085] font-semibold uppercase tracking-wider text-[10px]">
              {t.auth.orContinueWith}
            </span>
          </div>
        </div>

        {/* Alternative Login Actions */}
        <div className="space-y-2.5">
          {/* Quick Demo Login */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-4 rounded-xl border border-[#0057FF]/30 bg-[#EAF0FF] hover:bg-[#d8e5ff] text-[#0057FF] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.auth.demoOneClick}</span>
          </button>

          {/* Google Demo Login */}
          <button
            type="button"
            onClick={handleGoogleDemo}
            className="w-full py-2.5 px-4 rounded-xl border border-[#E4E7EC] bg-white hover:bg-[#F8F7F4] text-[#101828] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Chrome className="w-4 h-4 text-[#0057FF]" />
            <span>{t.auth.demoGoogle}</span>
          </button>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </>
  );
};
