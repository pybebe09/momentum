import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Shield, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const token = searchParams.get('token') || '';

  const [statusState, setStatusState] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying security token clearance...');

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        setStatusState('error');
        setMessage('Missing email verification security token in URL.');
        return;
      }

      try {
        const isVerified = await verifyEmail(token);
        if (isVerified) {
          setStatusState('success');
          setMessage('Your operator email clearance has been verified successfully!');
        } else {
          setStatusState('error');
          setMessage('Email verification token invalid or already processed.');
        }
      } catch (err: any) {
        setStatusState('error');
        setMessage(err.response?.data?.error || 'Invalid or expired email verification token.');
      }
    };

    handleVerify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6 relative z-10 text-center"
      >
        <div className="space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-slate-100 uppercase">
            EMAIL CLEARANCE VERIFICATION
          </h1>
          <p className="text-xs font-mono text-slate-400">
            SECURITY PROTOCOL VERIFICATION CHALLENGE
          </p>
        </div>

        <Card glow={statusState === 'success' ? 'green' : statusState === 'error' ? 'amber' : 'blue'} className="p-8 space-y-6">
          {statusState === 'verifying' && (
            <div className="space-y-4">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-300 font-mono">{message}</p>
            </div>
          )}

          {statusState === 'success' && (
            <div className="space-y-4">
              <div className="p-3 w-fit mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <Badge variant="green" pulse className="mx-auto">
                CLEARANCE VERIFIED
              </Badge>
              <p className="text-sm text-slate-200">{message}</p>
              <Button
                variant="neon-green"
                size="lg"
                className="w-full mt-2"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Access Mission Control
              </Button>
            </div>
          )}

          {statusState === 'error' && (
            <div className="space-y-4">
              <div className="p-3 w-fit mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertCircle className="w-10 h-10" />
              </div>
              <Badge variant="red" className="mx-auto">
                VERIFICATION FAILED
              </Badge>
              <p className="text-xs text-rose-300 font-medium">{message}</p>
              <Button
                variant="outline"
                size="md"
                className="w-full mt-2"
                onClick={() => navigate('/login')}
              >
                Return to Operator Sign In
              </Button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link to="/login" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
              Return to Operator Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
