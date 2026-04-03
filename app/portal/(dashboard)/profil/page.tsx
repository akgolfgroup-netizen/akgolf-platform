"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { AppleAvatar } from "@/components/portal/apple/apple-avatar";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleCard } from "@/components/portal/apple/apple-card";
import {
  User, Target, Trophy, Activity, BookOpen, Flame,
  TrendingDown, ChevronRight, Info, Crown, Compass,
  Check, Pause, Trash2, Pencil, Plus, Loader2, RefreshCw,
  Mail, Phone,
  Calendar, Flag, Star, Zap, Users, MapIcon, Medal, Dumbbell
} from "lucide-react";
import { SkillLevelBadge } from "@/components/portal/statistikk/skill-level-badge";
import { HandicapChart } from "@/components/portal/analyse/handicap-chart";
import { GoalModal } from "@/components/portal/profil/goal-modal";
import { AvatarUpload } from "@/components/portal/profil/avatar-upload";
import { getMyProfile, getPlayerStats, getHandicapHistory, getAchievements, updateProfile, getPlayerSGData } from "./actions";
import { TourComparison } from "@/components/portal/profil/tour-comparison";
import { getGoals, updateGoal, deleteGoal } from "./goal-actions";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import type { GoalCategory, GoalStatus } from "@prisma/client";

// Types
interface ProfileUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: string;
  subscriptionTier: SubscriptionTier;
  instructorProfile?: {
    specialization?: string | null;
    title?: string | null;
    bio?: string | null;
  } | null;
}

interface PlayerStats {
  currentHandicap: number | null;
  trainingSessions: number;
  coachingSessions: number;
  tournaments: number;
  streak: number;
}

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  targetValue: number | null;
  currentValue: number | null;
  unit: string | null;
  targetDate: Date | null;
  status: GoalStatus;
}

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  sortOrder: number;
}

interface PlayerAchievement {
  achievementDefinitionId: string;
  unlockedAt: Date;
}

interface HandicapEntry {
  id: string;
  date: Date;
  handicapIndex: number;
  source: string;
}

// Config maps
const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrator",
  INSTRUCTOR: "Instruktor",
  STUDENT: "Spiller",
};

const tierConfig: Record<string, { label: string; variant: "dark" | "info" | "neutral" }> = {
  VISITOR: { label: "Visitor", variant: "neutral" },
  ACADEMY: { label: "Academy", variant: "neutral" },
  STARTER: { label: "Starter", variant: "neutral" },
  PRO: { label: "Pro", variant: "info" },
  ELITE: { label: "Elite", variant: "dark" },
};

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; color: string }> = {
  SCORE: { label: "Score", color: "var(--color-grey-900)" },
  PHYSICAL: { label: "Fysisk", color: "#10B981" },
  MENTAL: { label: "Mental", color: "#8B5CF6" },
  TOURNAMENT: { label: "Turnering", color: "#38BDF8" },
  PROCESS: { label: "Prosess", color: "#F59E0B" },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy, flame: Flame, star: Star, zap: Zap,
  calendar: Calendar, flag: Flag, "trending-down": TrendingDown,
  crown: Crown, users: Users, "book-open": BookOpen,
  map: MapIcon, target: Target, medal: Medal, dumbbell: Dumbbell,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface PlayerSGData {
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
  roundCount: number;
}

export default function ProfilPage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<{ definitions: Achievement[]; unlocked: PlayerAchievement[] }>({ definitions: [], unlocked: [] });
  const [handicapHistory, setHandicapHistory] = useState<HandicapEntry[]>([]);
  const [playerSG, setPlayerSG] = useState<PlayerSGData | null>(null);
  const [loading, setLoading] = useState(true);

  // Goal modal state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Focus recommendation state
  const [focusAreas, setFocusAreas] = useState<{ title: string; reason: string; priority: number }[] | null>(null);
  const [focusLoading, setFocusLoading] = useState(false);
  const [focusError, setFocusError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [userData, statsData, goalsData, achievementsData, handicapData, sgData] = await Promise.all([
        getMyProfile(),
        getPlayerStats(),
        getGoals(),
        getAchievements(),
        getHandicapHistory(6),
        getPlayerSGData(),
      ]);

      if (userData) {
        setUser(userData);
        setProfileName(userData.name ?? "");
        setProfilePhone(userData.phone ?? "");
      }
      setStats(statsData);
      setGoals(goalsData);
      setAchievements(achievementsData);
      setHandicapHistory(handicapData);
      setPlayerSG(sgData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !user || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-grey-100)] via-[#F0F4F8] to-[var(--color-grey-100)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-grey-900)]" />
      </div>
    );
  }

  const canCreateGoals = hasTierAccess(user.subscriptionTier, SubscriptionTier.PRO);
  const tier = tierConfig[user.subscriptionTier] ?? tierConfig.VISITOR;
  const initials = user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  // Goal handlers
  async function handleGoalStatusToggle(goal: Goal) {
    const newStatus = goal.status === "ACTIVE" ? "COMPLETED" : "ACTIVE";
    await updateGoal(goal.id, { status: newStatus as GoalStatus });
    setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, status: newStatus as GoalStatus } : g));
  }

  async function handleGoalPause(goal: Goal) {
    await updateGoal(goal.id, { status: "PAUSED" as GoalStatus });
    setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, status: "PAUSED" as GoalStatus } : g));
  }

  async function handleGoalDelete(goalId: string) {
    await deleteGoal(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }

  // Profile handlers
  async function handleProfileSave() {
    setSavingProfile(true);
    await updateProfile({ name: profileName, phone: profilePhone });
    setUser((prev) => prev ? { ...prev, name: profileName, phone: profilePhone } : prev);
    setSavingProfile(false);
    setEditingProfile(false);
  }

  // Focus recommendation handler
  async function fetchFocusRecommendation() {
    setFocusLoading(true);
    setFocusError(null);
    try {
      const res = await fetch("/api/ai/focus-recommendation", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Noe gikk galt");
      }
      const data = await res.json();
      setFocusAreas(data.areas ?? []);
    } catch (e: unknown) {
      setFocusError(e instanceof Error ? e.message : "Noe gikk galt");
    } finally {
      setFocusLoading(false);
    }
  }

  const activeGoals = goals.filter((g) => g.status === "ACTIVE");
  const completedGoals = goals.filter((g) => g.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-grey-100)] via-[#F0F4F8] to-[var(--color-grey-100)] relative">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[var(--color-grey-900)] tracking-tight">
            Min profil
          </h1>
          <p className="text-[var(--color-grey-500)] mt-1">
            Administrer din profil, mål og prestasjoner
          </p>
        </motion.div>

        <BentoGrid gap="md">
          {/* Profile Hero Card */}
          <BentoCard span={4} variant="gradient" hover={false} rowSpan={2}>
            <div className="text-center">
              <div className="mb-4">
                <AppleAvatar
                  src={user.image}
                  name={user.name ?? ""}
                  size="xl"
                  ring
                  className="mx-auto w-24 h-24 text-2xl"
                />
              </div>

              <h2 className="text-xl font-bold text-[var(--color-grey-900)] mb-2">
                {user.name ?? "Ukjent"}
              </h2>

              <div className="flex items-center justify-center gap-2 mb-4">
                <AppleBadge variant="dark" icon={Crown}>
                  {roleLabelMap[user.role] ?? user.role}
                </AppleBadge>
                <AppleBadge variant={tier.variant}>
                  {tier.label}
                </AppleBadge>
              </div>

              {/* Handicap display */}
              {stats.currentHandicap !== null && (
                <div className="bg-gradient-to-br from-[var(--color-grey-100)] to-[var(--color-grey-100)]/50 rounded-2xl p-4 border border-[var(--color-grey-200)]/30 mt-4">
                  <p className="text-[10px] font-semibold text-[var(--color-grey-900)] uppercase tracking-widest mb-1">
                    Handicap
                  </p>
                  <p className="text-4xl font-black text-[var(--color-grey-900)]">
                    {stats.currentHandicap.toFixed(1)}
                  </p>
                  <div className="mt-2">
                    <SkillLevelBadge handicap={stats.currentHandicap} />
                  </div>
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[var(--color-grey-200)]/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-grey-900)]">{stats.trainingSessions}</p>
                  <p className="text-[10px] text-[var(--color-grey-500)] uppercase tracking-wide">Trening</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-grey-900)]">{stats.coachingSessions}</p>
                  <p className="text-[10px] text-[var(--color-grey-500)] uppercase tracking-wide">Coaching</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-grey-900)]">{stats.tournaments}</p>
                  <p className="text-[10px] text-[var(--color-grey-500)] uppercase tracking-wide">Turneringer</p>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Goals Card */}
          <BentoCard span={8} title="Mine mål" icon={Target} action={
            canCreateGoals && (
              <button
                onClick={() => { setEditingGoal(null); setShowGoalModal(true); }}
                className="flex items-center gap-1 text-xs font-medium text-[var(--color-grey-900)] hover:text-[var(--color-grey-900)]"
              >
                <Plus className="w-3.5 h-3.5" />
                Nytt mål
              </button>
            )
          }>
            {goals.length === 0 ? (
              <p className="text-sm text-[var(--color-grey-500)] text-center py-8">
                {canCreateGoals
                  ? "Ingen mål ennå. Sett ditt første mål!"
                  : "Oppgrader til Pro for å sette mål."}
              </p>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggle={() => handleGoalStatusToggle(goal)}
                    onPause={() => handleGoalPause(goal)}
                    onEdit={() => { setEditingGoal(goal); setShowGoalModal(true); }}
                    onDelete={() => handleGoalDelete(goal.id)}
                  />
                ))}
                {completedGoals.length > 0 && (
                  <div className="pt-3">
                    <p className="text-[10px] font-semibold text-[var(--color-grey-500)] uppercase tracking-widest mb-2">
                      Fullfort
                    </p>
                    {completedGoals.slice(0, 3).map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onToggle={() => handleGoalStatusToggle(goal)}
                        onDelete={() => handleGoalDelete(goal.id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </BentoCard>

          {/* Stats Cards */}
          <BentoCard span={3}>
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-[10px] font-medium text-[var(--color-grey-500)] uppercase">Siste 30 dager</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-grey-900)]">{stats.trainingSessions}</p>
            <p className="text-sm text-[var(--color-grey-500)]">Treningsoekter</p>
          </BentoCard>

          <BentoCard span={3}>
            <div className="flex items-center justify-between mb-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-medium text-[var(--color-grey-500)] uppercase">Totalt</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-grey-900)]">{stats.coachingSessions}</p>
            <p className="text-sm text-[var(--color-grey-500)]">Coaching-oekter</p>
          </BentoCard>

          <BentoCard span={3}>
            <div className="flex items-center justify-between mb-3">
              <Trophy className="w-5 h-5 text-[var(--color-grey-900)]" />
              <span className="text-[10px] font-medium text-[var(--color-grey-500)] uppercase">Planlagt</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-grey-900)]">{stats.tournaments}</p>
            <p className="text-sm text-[var(--color-grey-500)]">Turneringer</p>
          </BentoCard>

          <BentoCard span={3}>
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-[10px] font-medium text-[var(--color-grey-500)] uppercase">{stats.streak === 1 ? "Dag" : "Dager"}</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-grey-900)]">{stats.streak}</p>
            <p className="text-sm text-[var(--color-grey-500)]">Streak</p>
          </BentoCard>

          {/* Achievements Card */}
          {achievements.definitions.length > 0 && (
            <BentoCard span={6} title="Prestasjoner" icon={Trophy} subtitle={`${achievements.unlocked.length}/${achievements.definitions.length} opplast`}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-5 gap-3"
              >
                {[...achievements.definitions]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .slice(0, 10)
                  .map((def) => {
                    const isUnlocked = achievements.unlocked.some((u) => u.achievementDefinitionId === def.id);
                    const Icon = ICON_MAP[def.icon] ?? Trophy;

                    return (
                      <motion.div
                        key={def.id}
                        variants={itemVariants}
                        className="group relative flex flex-col items-center text-center"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1.5 transition-[background-color,box-shadow] ${
                            isUnlocked ? "bg-gradient-to-br from-[var(--color-grey-100)] to-[var(--color-grey-200)] shadow-md" : "bg-[var(--color-grey-100)] opacity-40"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isUnlocked ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-400)]"}`} />
                        </div>
                        <span className={`text-[10px] leading-tight ${isUnlocked ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-400)]"}`}>
                          {def.title}
                        </span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                          <div className="px-3 py-2 rounded-xl text-xs bg-white shadow-lg border border-[var(--color-grey-200)] max-w-[160px]">
                            <p className="font-semibold text-[var(--color-grey-900)] mb-0.5">{def.title}</p>
                            <p className="text-[var(--color-grey-500)]">{def.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </motion.div>
            </BentoCard>
          )}

          {/* Focus Recommendation Card */}
          {canCreateGoals && (
            <BentoCard span={6} title="Anbefalt fokus" icon={Compass} variant="gradient">
              {!focusAreas && !focusLoading && (
                <div>
                  {focusError && <p className="text-xs text-red-500 mb-2">{focusError}</p>}
                  <p className="text-sm text-[var(--color-grey-600)] mb-4">
                    Fa personlige anbefalinger basert pa din treningshistorikk, runder og coachingøkter.
                  </p>
                  <AppleButton onClick={fetchFocusRecommendation} icon={Compass} size="sm">
                    Generer anbefaling
                  </AppleButton>
                  <p className="mt-3 text-[10px] text-[var(--color-grey-400)]">Drevet av AI</p>
                </div>
              )}

              {focusLoading && (
                <div className="flex items-center gap-2 py-6 text-[var(--color-grey-500)]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyserer data...</span>
                </div>
              )}

              {focusAreas && (
                <div className="space-y-2">
                  {focusAreas.sort((a, b) => a.priority - b.priority).map((area, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-[var(--color-grey-100)]0 border border-[var(--color-grey-200)]/50">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-grey-100)] text-[var(--color-grey-900)]">
                        {area.priority}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-grey-900)]">{area.title}</p>
                        <p className="text-xs text-[var(--color-grey-500)] mt-0.5">{area.reason}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => { setFocusAreas(null); fetchFocusRecommendation(); }}
                    className="flex items-center gap-1 text-[10px] text-[var(--color-grey-400)] hover:text-[var(--color-grey-600)] mt-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Oppdater
                  </button>
                </div>
              )}
            </BentoCard>
          )}

          {/* Handicap Chart Card */}
          {handicapHistory.length > 0 && (
            <BentoCard span={12} title="Handicap-utvikling" subtitle="Siste 6 maneder" icon={TrendingDown}>
              <div className="h-[200px]">
                <HandicapChart entries={handicapHistory} />
              </div>
            </BentoCard>
          )}

          {/* Tour Comparison Card */}
          <BentoCard span={6} hover={false}>
            <TourComparison
              playerSG={{
                sgTotal: playerSG?.sgTotal ?? null,
                sgOffTheTee: playerSG?.sgOffTheTee ?? null,
                sgApproach: playerSG?.sgApproach ?? null,
                sgAroundTheGreen: playerSG?.sgAroundTheGreen ?? null,
                sgPutting: playerSG?.sgPutting ?? null,
              }}
            />
          </BentoCard>

          {/* Goal Setting Info */}
          <BentoCard span={6} variant="solid">
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer list-none">
                <Info className="w-4 h-4 text-[var(--color-grey-900)]" />
                <span className="text-sm font-medium text-[var(--color-grey-900)]">Slik setter du gode mal</span>
                <ChevronRight className="w-4 h-4 text-[var(--color-grey-400)] ml-auto transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-[var(--color-grey-600)]">
                  {PORTAL_CONTENT.profil.goalSetting.intro}
                </p>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-grey-500)] uppercase tracking-widest mb-2">
                    Eksempler pa mal
                  </p>
                  <div className="space-y-2">
                    {PORTAL_CONTENT.profil.goalSetting.examples.map((example) => (
                      <div key={example.type} className="flex items-start gap-3">
                        <span className="text-xs font-medium text-[var(--color-grey-900)] min-w-[70px]">
                          {example.type}
                        </span>
                        <span className="text-sm text-[var(--color-grey-600)]">
                          {example.example}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </BentoCard>

          {/* Profile Settings Card */}
          <BentoCard span={6} title="Profilinnstillinger" icon={User}>
            <div className="flex flex-col sm:flex-row gap-4">
              <AvatarUpload currentImage={user.image} name={user.name} />

              <div className="flex-1 min-w-0 space-y-3">
                {editingProfile ? (
                  <>
                    <div>
                      <label className="text-xs font-medium text-[var(--color-grey-500)] uppercase tracking-wide">Navn</label>
                      <input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-phone" className="text-xs font-medium text-[var(--color-grey-500)] uppercase tracking-wide">Telefon</label>
                      <input
                        id="profile-phone"
                        type="tel"
                        autoComplete="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+47 xxx xx xxx"
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <AppleButton onClick={handleProfileSave} loading={savingProfile} size="sm">
                        Lagre
                      </AppleButton>
                      <AppleButton onClick={() => setEditingProfile(false)} variant="secondary" size="sm">
                        Avbryt
                      </AppleButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-grey-600)]">
                      <Mail className="w-4 h-4 text-[var(--color-grey-400)]" />
                      <span>{user.email ?? "Ingen e-post"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-grey-600)]">
                      <Phone className="w-4 h-4 text-[var(--color-grey-400)]" />
                      <span>{user.phone ?? "Ikke registrert"}</span>
                    </div>
                    <AppleButton onClick={() => setEditingProfile(true)} variant="secondary" size="sm">
                      Rediger profil
                    </AppleButton>
                  </>
                )}
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <GoalModal
          goal={editingGoal}
          onClose={() => { setShowGoalModal(false); setEditingGoal(null); }}
        />
      )}
    </div>
  );
}

// Goal Card Component
function GoalCard({
  goal,
  onToggle,
  onPause,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  onToggle: () => void;
  onPause?: () => void;
  onEdit?: () => void;
  onDelete: () => void;
}) {
  const config = CATEGORY_CONFIG[goal.category];
  const progress = goal.targetValue && goal.currentValue
    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
    : null;
  const isCompleted = goal.status === "COMPLETED";

  return (
    <motion.div
      variants={itemVariants}
      className="group flex items-start gap-3 p-3 rounded-xl bg-[var(--color-grey-100)]0 border border-[var(--color-grey-200)]/50 hover:border-[var(--color-grey-300)]/50 transition-[border-color]"
    >
      <button
        onClick={onToggle}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-[border-color,background-color]"
        style={{
          borderColor: isCompleted ? "#10B981" : "var(--color-grey-300)",
          background: isCompleted ? "rgba(16,185,129,0.1)" : "white",
        }}
      >
        {isCompleted && <Check className="w-3 h-3 text-green-500" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-sm font-medium ${isCompleted ? "line-through text-[var(--color-grey-400)]" : "text-[var(--color-grey-900)]"}`}>
            {goal.title}
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: `${config.color}15`, color: config.color }}
          >
            {config.label}
          </span>
        </div>

        {goal.description && (
          <p className="text-xs text-[var(--color-grey-500)] mb-1.5 line-clamp-1">{goal.description}</p>
        )}

        {progress !== null && !isCompleted && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 rounded-full bg-[var(--color-grey-200)]">
              <div
                className="h-1.5 rounded-full transition-[width] duration-500"
                style={{ width: `${progress}%`, background: config.color }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-grey-500)] flex-shrink-0">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
        )}

        {goal.targetDate && !isCompleted && (
          <p className="text-[10px] text-[var(--color-grey-400)] mt-1">
            Mal: {new Date(goal.targetDate).toLocaleDateString("nb-NO")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {onEdit && !isCompleted && (
          <button onClick={onEdit} className="p-1 rounded hover:bg-[var(--color-grey-100)] transition-colors">
            <Pencil className="w-3 h-3 text-[var(--color-grey-500)]" />
          </button>
        )}
        {onPause && !isCompleted && (
          <button onClick={onPause} className="p-1 rounded hover:bg-[var(--color-grey-100)] transition-colors">
            <Pause className="w-3 h-3 text-[var(--color-grey-500)]" />
          </button>
        )}
        <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 transition-colors">
          <Trash2 className="w-3 h-3 text-red-400 hover:text-red-500" />
        </button>
      </div>
    </motion.div>
  );
}
