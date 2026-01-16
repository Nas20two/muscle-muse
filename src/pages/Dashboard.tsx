import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Dumbbell,
  Calendar,
  TrendingUp,
  LogOut,
  ChevronRight,
  Target,
  Settings,
  User,
  Loader2,
  Bell,
  Coffee,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkoutDay {
  id: string;
  name: string;
  description: string;
  day_number: number;
  muscle_groups: string[];
}

interface WorkoutLog {
  id: string;
  workout_day_id: string;
  completed_at: string;
}

interface UserSchedule {
  schedule_type: "3-day" | "4-day" | "5-day";
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [recentLogs, setRecentLogs] = useState<WorkoutLog[]>([]);
  const [userSchedule, setUserSchedule] = useState<UserSchedule | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [workoutsRes, logsRes, scheduleRes, profileRes] = await Promise.all([
      supabase.from("workout_days").select("*").order("day_number"),
      supabase.from("workout_logs").select("*").order("completed_at", { ascending: false }).limit(10),
      supabase.from("user_schedules").select("schedule_type").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    ]);

    if (workoutsRes.data) setWorkoutDays(workoutsRes.data);
    if (logsRes.data) setRecentLogs(logsRes.data);

    if (scheduleRes.data) {
      setUserSchedule(scheduleRes.data as UserSchedule);
    } else {
      navigate("/onboarding");
      return;
    }

    const name =
      profileRes.data?.display_name || user.user_metadata?.display_name || user.email?.split("@")[0] || "Warrior";
    setDisplayName(name);
    setEditName(name);

    setLoading(false);
  };

  const handleUpdateDisplayName = async () => {
    if (!user || editName.trim().length < 2) {
      toast({
        title: "Error",
        description: "Display name must be at least 2 characters.",
        variant: "destructive",
      });
      return;
    }

    setSavingName(true);
    const { error } = await supabase.from("profiles").update({ display_name: editName.trim() }).eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update. Try again.",
        variant: "destructive",
      });
    } else {
      setDisplayName(editName.trim());
      toast({ title: "Success", description: "Profile updated." });
      setProfileDialogOpen(false);
    }
    setSavingName(false);
  };

  const getFilteredWorkouts = () => {
    if (!userSchedule) return workoutDays;
    switch (userSchedule.schedule_type) {
      case "3-day":
        return workoutDays.filter((day) => [1, 3, 5].includes(day.day_number));
      case "4-day":
        return workoutDays.filter((day) => [1, 2, 4, 5].includes(day.day_number));
      default:
        return workoutDays;
    }
  };

  const getScheduleLabel = () => {
    if (!userSchedule) return "5-Day Split";
    return `${userSchedule.schedule_type.charAt(0)}-Day Split`;
  };

  const getCompletedThisWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recentLogs.filter((log) => new Date(log.completed_at) >= weekAgo).length;
  };

  const getMuscleGroupIcon = (groups: string[]) => {
    if (groups.includes("chest") || groups.includes("shoulders")) return "💪";
    if (groups.includes("back")) return "🔙";
    if (groups.includes("quads") || groups.includes("hamstrings")) return "🦵";
    return "🏋️";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Dumbbell className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-sm"
              >
                <rect width="40" height="40" rx="10" fill="url(#energy-gradient)" />
                <path
                  d="M8 24H14L17 12L21 28L24 20C24 20 25 15 29 15C33 15 33 20 33 20L33 24M33 24L30 21M33 24L36 21"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="energy-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f97316" />
                    <stop offset="1" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-display text-2xl energy-text tracking-wide hidden sm:block">MUSCLE MUSE</span>
          </div>

          {/* NAV BUTTONS */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link to="/inspiration">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/progress">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <TrendingUp className="w-4 h-4" />
              </Button>
            </Link>

            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Profile & Support</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                    <div className="flex gap-2">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={50} />
                      <Button variant="energy" onClick={handleUpdateDisplayName} disabled={savingName}>
                        {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">App Support</p>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => window.open("YOUR_GOOGLE_FORM_LINK", "_blank")}
                    >
                      <MessageSquare className="w-4 h-4 text-primary" /> Send Feedback
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 border-orange-200 hover:bg-orange-50"
                      onClick={() => window.open("YOUR_COFFEE_LINK", "_blank")}
                    >
                      <Coffee className="w-4 h-4 text-orange-500" /> Donate a coffee
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Link to="/onboarding">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <section className="mb-8 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl mb-2">WELCOME BACK, {displayName.toUpperCase()}</h1>
          <p className="text-muted-foreground text-lg">{getCompletedThisWeek()} workouts this week</p>
        </section>

        {/* UPDATES SECTION */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Card className="bg-primary/5 border-primary/20 border-dashed">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg text-primary tracking-wide">LATEST UPDATES</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the Dashboard to log your days.Use the Inspiration tab to learn new forms! Videos added".
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "This Week", value: getCompletedThisWeek(), icon: Calendar },
            { label: "Total", value: recentLogs.length, icon: Target },
            { label: "Streak", value: "—", icon: TrendingUp },
            { label: "Goal", value: parseInt(userSchedule?.schedule_type.charAt(0) || "5"), icon: Dumbbell },
          ].map((stat, i) => (
            <Card
              key={i}
              variant="elevated"
              className="animate-slide-up"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <CardContent className="p-4 text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="font-display text-3xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* SCHEDULE SECTION (FIXED CLICKABILITY) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">YOUR SCHEDULE</h2>
            <Link to="/onboarding">
              <span className="workout-badge hover:bg-primary/20 cursor-pointer transition-colors">
                {getScheduleLabel()}
              </span>
            </Link>
          </div>
          <div className="space-y-3">
            {getFilteredWorkouts().map((day, index) => (
              /* FIX: Replaced Link with onClick on the Card itself */
              <Card
                key={day.id}
                variant="elevated"
                className="group cursor-pointer hover:border-primary/50 transition-all animate-slide-up"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
                onClick={() => navigate(`/workout/${day.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors">
                    {getMuscleGroupIcon(day.muscle_groups)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl group-hover:text-primary transition-colors">
                      {day.name.toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground">{day.muscle_groups.join(" • ")}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
