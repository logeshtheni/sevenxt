import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import logo from '../assets/logo.jpg';
import { apiService } from '../services/api';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'forgot' | 'success'>('login');
  const [email, setEmail] = useState('admin@ecommerce.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***' });
      const response = await apiService.login({ email, password });
      console.log('Login successful:', response);
      setIsLoading(true);
      onLogin();
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setResetSent(true);
      setIsLoading(false);
      setView('success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row animate-fadeIn min-h-[600px]">

        {/* Left Branding */}
        <div className="w-full md:w-1/2 bg-black p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black z-0"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-12 right-12 w-32 h-32 bg-blue-600 rounded-full opacity-10 blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <img src={logo} className="w-[250px]  h-[170px]    shadow" />
              {/* <span className="text-2xl font-bold tracking-tight text-white">SEVEN<span className="text-red-600">XT</span></span> */}
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Manage your<br />Digital Empire.</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Complete dashboard for eCommerce, inventory & financial management.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <p className="text-xs text-gray-500">© 2025 Sevenxt Inc. All rights reserved.</p>
          </div>
        </div>

        {/* Right Form UI */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative">

          {/* Login View */}
          {view === 'login' && (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Admin Login</h3>
                <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <p className="text-xs text-red-500 font-medium animate-pulse flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ecommerce.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" defaultChecked />
                    Remember me
                  </label>
                  <button type="button" onClick={() => { setView('forgot'); setError(''); }}
                    className="font-bold text-black hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3.5 rounded-lg font-bold text-sm hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          )}

          {/* Forgot Password View */}
          {view === 'forgot' && (
            <div className="animate-fadeIn">
              <button
                onClick={() => setView('login')}
                className="absolute top-8 left-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-500" />
              </button>

              <div className="mb-8 mt-8">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <KeyRound size={24} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h3>
                <p className="text-sm text-gray-500">Enter your email and we will send reset instructions.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                {error && (
                  <p className="text-xs text-red-500 font-medium animate-pulse flex items-center gap-1">
                    {error}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ecommerce.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3.5 rounded-lg font-bold text-sm hover:bg-gray-900 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
            </div>
          )}

          {/* Reset Success */}
          {view === 'success' && (
            <div className="animate-fadeIn text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h3>
              <p className="text-sm text-gray-500 mb-8">
                We’ve sent a password reset link to <span className="font-bold text-gray-900">{email}</span>
              </p>

              <button
                onClick={() => { setView('login'); setResetSent(false); }}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
