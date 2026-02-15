import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Globe, Sparkles, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Session authorized. Welcome back, agent.');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('[Login Error]:', error);
      const message = error.response?.data?.message || error.message || 'Authorization failed. Check credentials.';
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Visual Workspace (Left) - Matching RegisterPage */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-96 -mt-96" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[hsl(var(--teal))]/20 rounded-full blur-[120px] -ml-48 -mb-48" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl rotate-3 transition-transform hover:rotate-0">
              <Zap className="h-6 w-6 text-slate-950 fill-current" />
            </div>
            <span className="text-2xl font-black text-white italic tracking-tighter uppercase">Nexus</span>
          </Link>

          <div className="space-y-12">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-7xl font-black text-white leading-none tracking-tighter italic uppercase">
                Resume <br /> <span className="text-[hsl(var(--teal))]">Command.</span>
              </h2>
              <p className="mt-8 text-xl text-slate-500 font-bold max-w-md leading-relaxed">
                Access the world's most advanced inter-college innovation grid. Your journey continues here.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { label: 'Active Arenas', val: '240+', icon: Globe },
                { label: 'Verified Minds', val: '80K+', icon: User },
                { label: 'Bounty Pool', val: '$2.4M', icon: Sparkles },
                { label: 'Certificates', val: 'Secure', icon: ShieldCheck },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <s.icon className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                  </div>
                  <p className="text-3xl font-black text-white uppercase italic">{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-white/5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Official Control Plane v2.4.0
            </p>
          </div>
        </div>
      </div>

      {/* Login Interface (Right) */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 relative bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-full max-w-[420px] space-y-12"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Identify <span className="text-[hsl(var(--teal))]">Self</span></h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Phase 0: Authorization Protocol</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Communications (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    className="h-16 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs uppercase tracking-widest"
                    placeholder="IDENTIFIER@NEXUS.ID"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Key</label>
                  <Link to="/forgot-password" title="Forgot Password" className="text-[9px] font-black text-[hsl(var(--teal))] uppercase tracking-widest hover:underline decoration-2">Lost key?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    className="h-16 pl-12 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-black text-xs tracking-widest"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[hsl(var(--teal))] transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="h-20 w-full rounded-[1.8rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-lg uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl shadow-slate-200 dark:shadow-none" disabled={isLoading}>
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
              ) : (
                <>AUTHORIZE SESSION <ArrowRight className="ml-3 h-5 w-5" /></>
              )}
            </Button>
          </form>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Unknown Identity? <Link to="/register" className="text-slate-900 dark:text-white underline decoration-[hsl(var(--teal))] decoration-2 underline-offset-4">Register Agent</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
