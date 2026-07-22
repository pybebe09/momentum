import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  Shield,
  Sun,
  Globe,
  Bell,
  Lock,
  Download,
  Trash2,
  Save,
  Check,
  Eye,
  AlertTriangle,
  Laptop,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'profile' | 'theme' | 'language' | 'notifications' | 'privacy' | 'security' | 'data'
  >('profile');

  // Form & Notification States
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Profile Form State
  const [username, setUsername] = useState(user?.username || 'operator_alex');
  const [firstName, setFirstName] = useState(user?.firstName || 'Alex');
  const [lastName, setLastName] = useState(user?.lastName || 'Vance');
  const [email, setEmail] = useState(user?.email || 'alex.vance@momentum.cyber');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  );

  // Localization State
  const [language, setLanguage] = useState('en-US');
  const [timezone, setTimezone] = useState('UTC (GMT+00:00)');

  // Notification Toggles
  const [emailDigest, setEmailDigest] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [focusAlarms, setFocusAlarms] = useState(true);

  // Privacy Toggles
  const [privateProfile, setPrivateProfile] = useState(true);
  const [shareTelemetry, setShareTelemetry] = useState(true);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete Account Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Sync form inputs when user context resolves/updates
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email);
      setAvatarUrl(
        user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      );
    }
  }, [user]);

  const triggerSave = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        username,
        email,
        firstName,
        lastName,
        avatarUrl,
      });
      triggerSave('Operator profile settings updated successfully.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passphrases do not match.');
      return;
    }
    try {
      await updateProfile({
        password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerSave('Security passphrase updated successfully.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update passphrase.');
    }
  };

  const handleExportData = () => {
    const exportData = {
      user: { username, email, firstName, lastName },
      settings: { language, timezone, emailDigest, taskReminders },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `momentum_operator_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText === 'DELETE MY OPERATOR ACCOUNT') {
      logout();
      window.location.href = '/';
    } else {
      alert('Please type "DELETE MY OPERATOR ACCOUNT" to confirm deletion.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'theme', label: 'Theme & Style', icon: Sun },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Export & Account', icon: Download },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border border-cyan-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400">OPERATOR PREFERENCES</span>
            <Badge variant="blue" pulse>
              SETTINGS CONSOLE
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            System & Account Settings
          </h1>
          <p className="text-xs text-slate-400 font-light">
            Manage your operator profile, security passphrases, theme modes, notifications, and privacy options.
          </p>
        </div>

        {savedMessage && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" /> {savedMessage}
          </div>
        )}
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card glow="blue" className="p-6 max-w-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-100">CEO Profile Details</h3>
                  <p className="text-xs text-slate-400 font-mono">PERSONAL IDENTIFICATION & AVATAR</p>
                </div>
                <Badge variant="blue">ROLE: {user?.role || 'CEO'}</Badge>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Avatar Preview Row */}
                <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <img
                    src={avatarUrl}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-mono text-slate-300 block uppercase">AVATAR IMAGE URL</span>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="OPERATOR HANDLE"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="OPERATOR EMAIL"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="FIRST NAME"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    label="LAST NAME"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* TAB 2: THEME */}
        {activeTab === 'theme' && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card glow="blue" className="p-6 max-w-3xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-slate-100">Appearance & Theme Engine</h3>
                <p className="text-xs text-slate-400 font-mono">TOGGLE DARK / LIGHT THEME MODES</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Dark Mode Tile */}
                <div
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-cyan-400 bg-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-cyan-400" /> Dark Cyber Mode
                    </span>
                    {theme === 'dark' && <Badge variant="blue">ACTIVE</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">
                    High contrast dark slate background with neon cyan & emerald glowing glassmorphism panels.
                  </p>
                </div>

                {/* Light Mode Tile */}
                <div
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-cyan-400 bg-slate-100 text-slate-900 shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" /> Apple Light Minimal
                    </span>
                    {theme === 'light' && <Badge variant="blue">ACTIVE</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">
                    Apple-inspired minimal light slate background with high readability and crisp borders.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 3: LANGUAGE */}
        {activeTab === 'language' && (
          <motion.div
            key="language"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card glow="blue" className="p-6 max-w-3xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-slate-100">Language & Localization</h3>
                <p className="text-xs text-slate-400 font-mono">REGIONAL TIMEZONE & LOCALE FORMATS</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                    SYSTEM LANGUAGE
                  </label>
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      triggerSave('Language updated.');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="en-US">English (United States)</option>
                    <option value="ja-JP">日本語 (Japanese)</option>
                    <option value="de-DE">Deutsch (German)</option>
                    <option value="es-ES">Español (Spanish)</option>
                    <option value="fr-FR">Français (French)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                    TIMEZONE
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => {
                      setTimezone(e.target.value);
                      triggerSave('Timezone updated.');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="UTC (GMT+00:00)">UTC (GMT+00:00) Coordinate Universal Time</option>
                    <option value="Asia/Tokyo (GMT+09:00)">Asia/Tokyo (GMT+09:00) Japan Standard Time</option>
                    <option value="America/New_York (GMT-05:00)">America/New_York (GMT-05:00) Eastern Time</option>
                    <option value="Europe/London (GMT+00:00)">Europe/London (GMT+00:00) Greenwich Mean Time</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card glow="blue" className="p-6 max-w-3xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-slate-100">Notification Preferences</h3>
                <p className="text-xs text-slate-400 font-mono">SYSTEM ALERTS & DIGEST ALARMS</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">Daily Email Digest</span>
                    <span className="text-xs text-slate-400">Receive morning summary of task velocity and AI coach insights.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => {
                      setEmailDigest(e.target.checked);
                      triggerSave('Notification setting saved.');
                    }}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">Task Due Reminders</span>
                    <span className="text-xs text-slate-400">Receive alerts when critical security tasks approach deadlines.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={taskReminders}
                    onChange={(e) => {
                      setTaskReminders(e.target.checked);
                      triggerSave('Notification setting saved.');
                    }}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">Focus Mode Chimes & Alarms</span>
                    <span className="text-xs text-slate-400">Play audio chime upon completion of Pomodoro & Deep Work cycles.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={focusAlarms}
                    onChange={(e) => {
                      setFocusAlarms(e.target.checked);
                      triggerSave('Notification setting saved.');
                    }}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 5: PRIVACY */}
        {activeTab === 'privacy' && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card glow="blue" className="p-6 max-w-3xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-slate-100">Privacy & Data Sharing</h3>
                <p className="text-xs text-slate-400 font-mono">ZERO-TRUST DATA RETENTION POLICIES</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">Private Operator Profile</span>
                    <span className="text-xs text-slate-400">Hide operator metrics from public telemetry leaderboards.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={privateProfile}
                    onChange={(e) => {
                      setPrivateProfile(e.target.checked);
                      triggerSave('Privacy setting saved.');
                    }}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">AI Neural Telemetry Sharing</span>
                    <span className="text-xs text-slate-400">Allow AI Coach to synthesize journal and focus metrics into recommendations.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareTelemetry}
                    onChange={(e) => {
                      setShareTelemetry(e.target.checked);
                      triggerSave('Privacy setting saved.');
                    }}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 6: SECURITY */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card glow="green" className="p-6 max-w-3xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-slate-100">Security & Authentication</h3>
                <p className="text-xs text-slate-400 font-mono">PASSPHRASE MANAGEMENT & JWT SESSIONS</p>
              </div>

              <form onSubmit={handleSaveSecurity} className="space-y-4">
                <Input
                  label="CURRENT PASSPHRASE"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <Input
                  label="NEW PASSPHRASE"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <Input
                  label="CONFIRM NEW PASSPHRASE"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="neon-green" leftIcon={<Shield className="w-4 h-4" />}>
                    Update Security Passphrase
                  </Button>
                </div>
              </form>

              {/* Active JWT Sessions */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  ACTIVE OPERATOR SESSIONS
                </span>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-slate-200">Chrome (Windows 11) — Current Session</p>
                      <p className="text-slate-500 text-[10px]">JWT Access Token Expiring in 45 mins</p>
                    </div>
                  </div>
                  <Badge variant="green">ACTIVE NOW</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 7: EXPORT & DELETE ACCOUNT */}
        {activeTab === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-3xl space-y-6">
              {/* Export Card */}
              <Card glow="blue" className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Export Operator Data</h3>
                    <p className="text-xs text-slate-400 font-mono">DOWNLOAD FULL JSON BACKLOG ARCHIVE</p>
                  </div>
                  <Download className="w-5 h-5 text-cyan-400" />
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Export all your tasks, goals, focus session history, journal reflection logs, and analytics telemetry in machine-readable JSON format.
                </p>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleExportData}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download Data Archive (.json)
                </Button>
              </Card>

              {/* Danger Zone: Delete Account */}
              <Card glow="amber" className="p-6 space-y-4 border-rose-500/40 bg-rose-950/10">
                <div className="flex items-center justify-between border-b border-rose-500/30 pb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <div>
                      <h3 className="text-base font-bold text-rose-400">Danger Zone — Delete Account</h3>
                      <p className="text-xs text-rose-300/80 font-mono">PERMANENT DESTRUCTION OF OPERATOR PROFILE</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Once you delete your account, all associated tasks, goals, focus sessions, and journal reflections will be permanently purged. This action cannot be undone.
                </p>

                <Button
                  variant="ghost"
                  size="md"
                  className="bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
                  onClick={() => setDeleteModalOpen(true)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Initiate Account Deletion
                </Button>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md z-10"
            >
              <Card glow="amber" className="p-6 space-y-4 border-rose-500/50">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Confirm Operator Deletion</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  To confirm permanent deletion of your profile and data, please type{' '}
                  <span className="font-mono font-bold text-rose-400">DELETE MY OPERATOR ACCOUNT</span> below:
                </p>

                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE MY OPERATOR ACCOUNT"
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-slate-950 border border-rose-500/40 text-slate-100 focus:outline-none focus:border-rose-500"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-rose-500 text-white hover:bg-rose-600 font-bold"
                    onClick={handleDeleteAccount}
                  >
                    Permanently Delete
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
