import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  UserCheck,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AuthScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('faculty'); // Default role on sign up: 'faculty' | 'student'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Supabase is not configured. Please check your .env file or use Developer Bypass.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up with Email and Password
        const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;
        const sanitizedRole = ['faculty', 'student'].includes(selectedRole) ? selectedRole : 'student';

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              role: sanitizedRole
            }
          }
        });

        if (error) throw error;

        // If user is created, also upsert profile record
        if (data?.user) {
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              role: sanitizedRole,
              updated_at: new Date().toISOString()
            });
          } catch {
            // Profile trigger handles server-side profile creation
          }

          if (data.session) {
            onLogin(sanitizedRole);
          } else {
            setSuccessMsg('Account created successfully! Check your email if confirmation is enabled, or sign in.');
            setIsSignUp(false);
          }
        }
      } else {
        // Sign In with Email and Password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) throw error;

        if (data?.session) {
          const userId = data.session.user?.id;
          let userRole = data.session.user?.user_metadata?.role || 'faculty';

          // Check profiles table for user role
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', userId)
              .maybeSingle();

            if (profile?.role) {
              userRole = profile.role;
            }
          } catch {
            // Silent fallback to metadata role
          }

          onLogin(userRole);
        }
      }
    } catch (err) {
      const rawMsg = err.message || 'Authentication failed. Please verify credentials.';
      if (rawMsg.toLowerCase().includes('confirmation email') || rawMsg.toLowerCase().includes('error sending')) {
        setErrorMsg('Supabase email confirmation failed or rate limit reached. Please verify SMTP settings in your Supabase Dashboard.');
      } else {
        setErrorMsg(rawMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-8 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
              Academia
            </h1>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              Enterprise Attendance &amp; Academic Suite
            </span>
          </div>
        </div>

        {/* Form Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp
              ? 'Register with your institutional credentials to get started.'
              : 'Sign in with your email and password to access your portal.'}
          </p>
        </div>

        {/* Role Toggle for Sign Up */}
        {isSignUp && (
          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRole('faculty')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'faculty'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Student
              </button>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="faculty@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors"
          >
            {isSignUp
              ? 'Already have an institutional account? Sign In'
              : "Don't have an account yet? Sign Up"}
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-4 flex items-start gap-2 text-xs font-semibold rounded-xl p-3 bg-rose-950/40 text-rose-300 border border-rose-800/60 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="mt-4 flex items-start gap-2 text-xs font-semibold rounded-xl p-3 bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
