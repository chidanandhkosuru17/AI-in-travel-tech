import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Chrome,
  AlertCircle,
  Database,
  Info,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginCardProps {
  onSwitchToRegister?: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = () => {
  const { user, login, logout, register, t, setCurrentView } = useTravel();

  // Mode: 'signin' or 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // If user is already logged in, render the active traveler passport card
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#101828] truncate">{user.name}</h3>
              <span className="text-[10px] bg-emerald-50 text-[#15803D] border border-emerald-200 px-2 py-0.5 rounded-full font-bold shrink-0">
                Supabase Active
              </span>
            </div>
            <p className="text-xs text-[#667085] truncate">{user.email}</p>
            <p className="text-xs text-[#0057FF] font-medium mt-0.5">RoamAgent Sentinel Guard</p>
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
            className="text-xs text-[#667085] hover:text-[#0057FF] font-medium transition-colors cursor-pointer"
          >
            Safety Center
          </button>
          <button
            onClick={() => logout()}
            className="text-xs text-[#DC2626] hover:underline font-semibold transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Handle Sign In submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid email or password.');
    } else {
      setSuccessMessage('Successfully signed in with Supabase!');
    }
  };

  // Handle Sign Up submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    const result = await register(fullName, email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed.');
    } else {
      setSuccessMessage(
        result.message || 'Account successfully created with Supabase! You can now log in.'
      );
      if (result.message?.includes('confirmation link')) {
        // Clear fields on confirmation sent
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  const handleQuickDemo = async () => {
    setEmail('kosuruchidanandh@gmail.com');
    setPassword('RoamAgent2026!');
    setIsLoading(true);
    await login('kosuruchidanandh@gmail.com', 'RoamAgent2026!', 'Chidanandh Kosuru');
    setIsLoading(false);
  };

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-8 backdrop-blur-xl relative transition-all">
        {/* Supabase Badge Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4E7EC]">
          <div className="flex items-center gap-1.5 text-xs text-[#0057FF] font-bold">
            <Database className="w-3.5 h-3.5 text-[#0057FF]" />
            <span>Supabase Auth: TRAVELTECHAI</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
        </div>

        {/* Mode Toggle Tabs (Sign In vs Create Account) */}
        <div className="flex p-1 bg-[#F8F7F4] rounded-2xl mb-5 border border-[#E4E7EC]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#0057FF] shadow-sm border border-[#E4E7EC]'
                : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#0057FF] shadow-sm border border-[#E4E7EC]'
                : 'text-[#667085] hover:text-[#101828]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Heading Title */}
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#101828] tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            {mode === 'signin'
              ? 'Sign in to access your multimodal journeys and tickets.'
              : 'Sign up with your email to plan and synchronize journeys.'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15803D] font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <span className="leading-tight">{successMessage}</span>
          </div>
        )}

        {/* ================= MODE: SIGN IN FORM ================= */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#101828]">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-xs font-semibold text-[#0057FF] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828] transition-colors"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0057FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in with Supabase...</span>
                </span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        )}

        {/* ================= MODE: SIGN UP FORM ================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chidanandh Kosuru"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1">
                Password (min 6 chars)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#667085] hover:text-[#101828] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#667085]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-[11px] text-[#667085] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-[#E4E7EC] text-[#0057FF] focus:ring-[#0057FF]"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0057FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering with Supabase...</span>
                </span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E4E7EC]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-[#667085] font-semibold uppercase tracking-wider text-[10px]">
              OR TEST DEMO
            </span>
          </div>
        </div>

        {/* Quick Demo Sign-In */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 px-4 rounded-xl border border-[#0057FF]/30 bg-[#EAF0FF] hover:bg-[#d8e5ff] text-[#0057FF] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Quick Demo Traveler (Chidanandh K.)</span>
        </button>

        {/* Supabase Status Footer */}
        <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between text-[11px] text-[#667085]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Supabase Email Auth Enabled</span>
          </span>
          <span className="font-mono text-[10px] text-[#101828]">isjuyszkbxreenmzdfih</span>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </>
  );
};
