import React, { useState } from 'react';
import { LogIn, UserPlus, BookOpen, AlertCircle, ArrowRight, Mail, Lock, User, ShieldCheck, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function AuthLanding({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: 'Computer Science'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unregisteredPrompt, setUnregisteredPrompt] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnregisteredPrompt(null);

    // Validate Confirm Password for Signup
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match. Please ensure both password fields are identical.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            department: formData.department
          };

      const res = await axios.post(endpoint, payload);
      onAuthSuccess(res.data.user, res.data.token);
    } catch (err) {
      console.error('Auth error:', err);
      const resData = err.response?.data;

      // Handle unregistered email case specially
      if (err.response?.status === 404 && resData?.code === 'USER_NOT_REGISTERED') {
        setUnregisteredPrompt({
          email: resData.unregisteredEmail || formData.email,
          message: resData.message
        });
      } else {
        setError(resData?.message || 'An error occurred during authentication. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToSignup = (emailToPrefill) => {
    setFormData(prev => ({
      ...prev,
      email: emailToPrefill || prev.email
    }));
    setUnregisteredPrompt(null);
    setError('');
    setMode('signup');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Glow Orbs in Background */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl z-10 space-y-8 animate-fadeIn">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 cursor-pointer mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-2xl shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-indigo-400" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Edu<span className="gradient-text">Portal</span>
          </h1>
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            MongoDB Connected (`course_enrollment_db`)
          </div>

          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Please log in or sign up first to unlock course enrollment, progress tracking, and your dashboard.
          </p>
        </div>

        {/* Card Box */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-8">
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setUnregisteredPrompt(null);
              }}
              className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Log In
            </button>

            <button
              onClick={() => {
                setMode('signup');
                setError('');
                setUnregisteredPrompt(null);
              }}
              className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Unregistered User Alert */}
          {unregisteredPrompt && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 animate-slideDown">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Account Not Found</h4>
                  <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                    No account is registered under <span className="font-semibold text-white underline">{unregisteredPrompt.email}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSwitchToSignup(unregisteredPrompt.email)}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow transition-all"
                  >
                    Proceed to Signup Form
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password Field for Signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-[11px] text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">I am a...</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="Web Engineering">Web Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Business & Tech">Business & Tech</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Log In to Portal
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account & Enter Portal
                </>
              )}
            </button>
          </form>

          {/* Test Account Banner */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">Quick Demo Test Credentials:</span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
              <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                Student: <code className="text-indigo-300">alex@example.com</code> / <code className="text-slate-300">student123</code>
              </span>
              <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                Instructor: <code className="text-indigo-300">sarah@university.edu</code> / <code className="text-slate-300">instructor123</code>
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
