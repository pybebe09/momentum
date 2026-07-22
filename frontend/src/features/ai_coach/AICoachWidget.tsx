import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { aiCoachApi, type AIDailyInsight, type AIWeeklyReport } from '../../api/aiCoachApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Bot,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Send,
  RefreshCw,
  FileText,
  X,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AICoachWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Greetings, Operator. I have analyzed your telemetry across Tasks, Goals, Focus, Journal, and Analytics. How can I assist your operational performance today?',
    },
  ]);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  // TanStack Queries
  const { data: dailyInsight, refetch: refetchDaily, isFetching: isFetchingDaily } = useQuery({
    queryKey: ['ai_daily_insight'],
    queryFn: aiCoachApi.getDailyInsight,
  });

  const { data: weeklyReport } = useQuery({
    queryKey: ['ai_weekly_report'],
    queryFn: aiCoachApi.getWeeklyReport,
  });

  // Chat Mutation
  const askMutation = useMutation({
    mutationFn: (q: string) => aiCoachApi.askCoach(q),
    onSuccess: (res) => {
      setChatHistory((prev) => [...prev, { sender: 'ai', text: res.answer }]);
    },
  });

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const text = query.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text }]);
    setQuery('');
    askMutation.mutate(text);
  };

  const defaultDaily: AIDailyInsight = dailyInsight || {
    title: 'Optimal Night Focus Detected',
    insight: 'You study and execute code better at night between 20:00 - 23:00. Your focus efficiency index is 19% higher during evening cycles.',
    type: 'TIMING',
    recommendation: 'Schedule high-complexity tasks for evening focus sessions.',
    actionable: true,
  };

  const defaultWeekly: AIWeeklyReport = weeklyReport || {
    weeklyScore: 95,
    summary: 'Outstanding operational output this week.',
    strengths: ['Exceptional focus endurance in 45-minute deep work cycles.'],
    areasForImprovement: ['Skipped 2 recovery break sessions during peak Wednesday cycle.'],
    actionItems: ['Schedule 15m recovery breaks between consecutive 45m sessions.'],
    productivityForecast: '+12% forecasted velocity boost for next week.',
  };

  return (
    <div className="space-y-6">
      {/* AI Coach Daily Insight & Weekly Report Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Insight Card */}
        <Card glow="green" className="lg:col-span-2 p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  AI Coach Daily Insight
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                  NEURAL TELEMETRY SYNTHESIS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="green" pulse>
                AI_ONLINE
              </Badge>
              <button
                onClick={() => refetchDaily()}
                disabled={isFetchingDaily}
                className="p-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                title="Regenerate Daily Insight"
              >
                <RefreshCw className={`w-4 h-4 ${isFetchingDaily ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-100">{defaultDaily.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {defaultDaily.type}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              "{defaultDaily.insight}"
            </p>
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> {defaultDaily.recommendation}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-mono">
              Analyzed across Tasks, Goals, Focus & Reflections
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWeeklyModal(true)}
              leftIcon={<FileText className="w-4 h-4 text-emerald-400" />}
            >
              View Full Weekly Report
            </Button>
          </div>
        </Card>

        {/* Weekly Summary Widget */}
        <Card glow="blue" className="p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Weekly Score</h3>
            </div>
            <Badge variant="blue">{defaultWeekly.weeklyScore} / 100</Badge>
          </div>

          <div className="my-2 space-y-2">
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {defaultWeekly.summary}
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 block">PRODUCTIVITY FORECAST:</span>
              <span className="text-xs text-emerald-400 font-bold">{defaultWeekly.productivityForecast}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => setShowWeeklyModal(true)}
          >
            Inspect Weekly Analysis
          </Button>
        </Card>
      </div>

      {/* Interactive AI Assistant Chat Console */}
      <Card glow="none" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Interactive AI Performance Coach</h3>
              <p className="text-xs text-slate-400 font-mono">ASK AI ADVICE FOR STUDY, FOCUS, & TASK VELOCITY</p>
            </div>
          </div>
          <Badge variant="green">PLUGGABLE PROVIDER ENGINE</Badge>
        </div>

        {/* Chat History Box */}
        <div className="space-y-3 max-h-64 overflow-y-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-lg ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-slate-100 font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 font-light'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {askMutation.isPending && (
            <div className="flex gap-2 text-xs font-mono text-cyan-400 items-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> AI Coach analyzing telemetry...
            </div>
          )}
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleSendQuery} className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Ask AI Coach (e.g. 'How can I optimize my IELTS study hours?' or 'You study better at night')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={askMutation.isPending}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Ask AI
          </Button>
        </form>
      </Card>

      {/* Weekly Report Modal */}
      <AnimatePresence>
        {showWeeklyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWeeklyModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <Card glow="green" className="p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">AI Weekly Performance Audit</h3>
                      <p className="text-xs text-slate-400 font-mono">SYNTHESIZED WEEKLY TELEMETRY REPORT</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWeeklyModal(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 block">SUMMARY STATEMENT:</span>
                    <p className="text-slate-200 leading-relaxed font-light">{defaultWeekly.summary}</p>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      KEY STRENGTHS
                    </span>
                    <div className="space-y-1.5">
                      {defaultWeekly.strengths.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      AREAS FOR IMPROVEMENT
                    </span>
                    <div className="space-y-1.5">
                      {defaultWeekly.areasForImprovement.map((a, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200"
                        >
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      ACTIONABLE RECOMMENDATIONS
                    </span>
                    <div className="space-y-1.5">
                      {defaultWeekly.actionItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 font-mono"
                        >
                          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setShowWeeklyModal(false)}>
                    Close Audit
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
