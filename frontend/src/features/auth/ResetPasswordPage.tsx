import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('NewPassphrase2026!');
  const [confirmPassword, setConfirmPassword] = useState('NewPassphrase2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password strength calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passphrases do not match.');
      return;
    }
    if (!token) {
      setError('Security token missing in request URL.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired security reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-slate-100 uppercase">
            UPDATE PASSPHRASE
          </h1>
          <p className="text-xs font-mono text-slate-400">
            PROVIDE NEW SECURITY CLEARANCE PASSPHRASE
          </p>
        </div>

        <Card glow="green" className="p-8">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="p-3 w-fit mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">Passphrase Updated</h3>
              <p className="text-xs text-slate-400">
                Your operator security clearance passphrase has been updated successfully.
              </p>
              <Button
                variant="neon-green"
                size="md"
                className="w-full mt-2"
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In Now
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
                label="NEW SECURITY PASSPHRASE"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="CONFIRM PASSPHRASE"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {/* Strength Indicator */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>STRENGTH SCORE:</span>
                  <span className={strengthScore >= 3 ? 'text-emerald-400' : 'text-amber-400'}>
                    {strengthScore}/4 {strengthScore === 4 ? 'STRONG' : 'WEAK'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      strengthScore >= 3 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="neon-green"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                CONFIRM NEW PASSPHRASE
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link to="/login" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              Return to Operator Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
