
import React, { useState } from 'react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface LandingPageProps {
  onLogin: (user: User, token: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@salesagent.ai');
  const [password, setPassword] = useState('password');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    
    try {
      const response = await apiService.login(email, password);
      onLogin(response.user, response.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">W</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">SalesAgent<span className="text-emerald-500">.ai</span></span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Pricing</a>
          <button 
            onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-semibold text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-all"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next-Gen WhatsApp CRM
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
          Turn WhatsApp into your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Primary Sales Channel.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          The all-in-one AI CRM for small businesses. Automate customer replies, qualify high-intent leads, and manage conversations with the power of Gemini.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
             onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
             className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            Get Started Free
          </button>
          <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl shadow-md border border-slate-100 hover:bg-slate-50 transition-all">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">AI Magic Suggest</h3>
            <p className="text-slate-500 leading-relaxed">Let Gemini draft human-like responses based on your business FAQs and pricing policies in seconds.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Lead Scoring</h3>
            <p className="text-slate-500 leading-relaxed">Automatically categorize customers into HOT, WARM, or COLD leads using AI sentiment analysis.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Smart Automations</h3>
            <p className="text-slate-500 leading-relaxed">Set up drip campaigns and follow-ups that trigger when a lead goes cold, ensuring no deal slips through.</p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login-section" className="px-6 py-32 flex flex-col items-center bg-slate-50 border-t border-slate-100">
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Sign in to manage your business inbox</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] text-slate-400">
              <p className="font-bold uppercase tracking-wider mb-1">Demo Credentials:</p>
              <p>Email: <span className="text-slate-600">demo@salesagent.ai</span></p>
              <p>Pass: <span className="text-slate-600">password</span></p>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <a href="#" className="font-bold text-emerald-600 hover:underline">Start 14-day free trial</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center text-white font-bold text-[10px]">W</div>
            <span className="text-sm font-bold text-slate-800">SalesAgent.ai</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 SalesAgent AI Inc. Built for high-growth businesses.</p>
          <div className="flex gap-6 text-xs font-medium text-slate-400">
            <a href="#" className="hover:text-slate-600">Privacy</a>
            <a href="#" className="hover:text-slate-600">Terms</a>
            <a href="#" className="hover:text-slate-600">Security</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
