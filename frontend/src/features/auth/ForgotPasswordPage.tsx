import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('alex.vance@momentum.cyber');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; resetUrl?: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await forgotPassword(email);
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to dispatch security passphrase reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-slate-100 uppercase">
            RECOVER PASSPHRASE
          </h1>
          <p className="text-xs font-mono text-slate-400">
            DISPATCH RESET SECURITY CHALLENGE TO REGISTERED EMAIL
          </p>
        </div>

        <Card glow="blue" className="p-8">
          {result ? (
            <div className="space-y-4 text-center">
              <div className="p-3 w-fit mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-slate-200">{result.message}</p>

              {result.resetUrl && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-left space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 block">SIMULATED EMAIL DISPATCH LINK:</span>
                  <button
                    onClick={() => navigate(result.resetUrl!)}
                    className="text-xs font-mono text-cyan-400 hover:underline break-all text-left"
                  >
                    {window.location.origin}{result.resetUrl}
                  </button>
                </div>
              )}

              <Button
                variant="outline"
                size="md"
                className="w-full mt-2"
                onClick={() => navigate('/login')}
              >
                Return to Operator Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <Input
                label="REGISTERED OPERATOR EMAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@momentum.cyber"
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                DISPATCH RESET CHALLENGE
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Operator Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
