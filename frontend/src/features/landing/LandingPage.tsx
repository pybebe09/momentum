import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  Shield,
  ArrowRight,
  Zap,
  Target,
  Terminal,
  Activity,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-slate-100">
            MOMENTUM
          </span>
          <Badge variant="blue" pulse className="ml-2 hidden sm:inline-flex">
            v2.4 PROD
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
            Launch Console
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 lg:px-12 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 relative z-10"
        >
          <Badge variant="blue" pulse className="px-4 py-1 text-sm">
            NEXT-GEN MISSION CONTROL PLATFORM
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
            High-Performance Productivity Meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Cybersecurity Precision
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Engineered with zero-trust architecture, deep-work telemetry timers, structured focus journals, and real-time operational analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              leftIcon={<Terminal className="w-5 h-5" />}
            >
              Operator Login
            </Button>
          </div>
        </motion.div>

        {/* Console Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative z-10 max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-cyan-500/20 to-slate-900/40 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)]"
        >
          <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">momentum://console.telemetry</span>
              </div>
              <Badge variant="green" pulse>
                NODE_ONLINE
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <Card glow="blue">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-mono">FOCUS LATENCY</p>
                    <p className="text-xl font-bold text-slate-100">14.2 ms</p>
                  </div>
                </div>
              </Card>

              <Card glow="green">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-mono">EFFICIENCY SCORE</p>
                    <p className="text-xl font-bold text-slate-100">97.8 %</p>
                  </div>
                </div>
              </Card>

              <Card glow="amber">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs text-slate-400 font-mono">AUTH PROTOCOL</p>
                    <p className="text-xl font-bold text-slate-100">JWT / SimpleJWT</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 lg:px-12 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-100">Engineered for Peak Operators</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to orchestrate goals, execute tasks, record journals, and analyze performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card glow="blue" className="p-6 text-left space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Deep Work Engine</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Pomodoro timers and 45-minute focus cycles with ambient noise and distraction-free overlay.
            </p>
          </Card>

          <Card glow="green" className="p-6 text-left space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Strategic Milestone Goals</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Track targets for Japan Relocation, Zero-Trust Cybersecurity Certifications, IELTS & SAT.
            </p>
          </Card>

          <Card glow="amber" className="p-6 text-left space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">AI Neural Telemetry</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Intelligent coaching engine analyzing tasks, focus logs, and reflections for peak performance.
            </p>
          </Card>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs font-mono text-slate-500">
        <p>© 2026 Momentum Platform. Cybersecurity Mission Control Architecture.</p>
      </footer>
    </div>
  );
};
