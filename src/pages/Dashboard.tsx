import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dumbbell, Calendar, TrendingUp, LogOut, ChevronRight, Target, Settings, User, Loader2, Bell, Coffee, MessageSquare } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/1dAQOsawhRdmvRBAMEHrSJSGDK4xWjW4-ygQ6OZjp4FQ/viewform";
const DONATE_URL = ""; // TODO: Add donation URL
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

interface Profile {
  display_name: string | null;
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
      supabase
        .from("workout_logs")
        .select("*")
        .order("completed_at", { ascending: false })
        .limit(10),
      supabase.from("user_schedules").select("schedule_type").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    ]);

    if (workoutsRes.data) setWorkoutDays(workoutsRes.data);
    if (logsRes.data) setRecentLogs(logsRes.data);
    
    if (scheduleRes.data) {
      setUserSchedule(scheduleRes.data as UserSchedule);
    } else {
      // Redirect to onboarding if no schedule set
      navigate("/onboarding");
      return;
    }

    // Get display name from profile or user metadata
    const name = profileRes.data?.display_name || 
      user.user_metadata?.display_name || 
      user.email?.split("@")[0] || 
      "Warrior";
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
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: editName.trim() })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update display name. Please try again.",
        variant: "destructive",
      });
    } else {
      setDisplayName(editName.trim());
      toast({
        title: "Success",
        description: "Your display name has been updated.",
      });
      setProfileDialogOpen(false);
    }
    setSavingName(false);
  };

  const getFilteredWorkouts = () => {
    if (!userSchedule) return workoutDays;
    
    switch (userSchedule.schedule_type) {
      case "3-day":
        return workoutDays.filter(day => [1, 3, 5].includes(day.day_number));
      case "4-day":
        return workoutDays.filter(day => [1, 2, 4, 5].includes(day.day_number));
      case "5-day":
      default:
        return workoutDays;
    }
  };

  const getScheduleLabel = () => {
    if (!userSchedule) return "5-Day Split";
    return `${userSchedule.schedule_type.charAt(0)}-Day Split`;
  };

  const getWeeklyGoal = () => {
    if (!userSchedule) return 5;
    return parseInt(userSchedule.schedule_type.charAt(0));
  };

  const getCompletedThisWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recentLogs.filter(
      (log) => new Date(log.completed_at) >= weekAgo
    ).length;
  };

  const getMuscleGroupIcon = () => {
    return "🏋️";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Dumbbell className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  const filteredWorkouts = getFilteredWorkouts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="sm" />
          <nav className="flex items-center gap-0.5 sm:gap-2">
            <Link to="/progress">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <TrendingUp className="w-4 h-4" />
              </Button>
            </Link>
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <User className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Profile & Support</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* Display Name Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Display Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your display name"
                      maxLength={50}
                    />
                    <Button
                      variant="energy"
                      className="w-full"
                      onClick={handleUpdateDisplayName}
                      disabled={savingName || editName.trim().length < 2}
                    >
                      {savingName ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* App Support Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">App Support</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(FEEDBACK_FORM_URL, "_blank")}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Send Feedback
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => DONATE_URL && window.open(DONATE_URL, "_blank")}
                        disabled={!DONATE_URL}
                      >
                        <Coffee className="w-4 h-4" />
                        Donate a coffee
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Link to="/onboarding">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-5 sm:px-6 py-8 max-w-4xl">
        {/* Welcome Section */}
        <section className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-2 break-words">
            WELCOME BACK, {displayName.toUpperCase()}
          </h1>
          <p className="text-muted-foreground text-lg">
            {getCompletedThisWeek()}/{getWeeklyGoal()} workouts this week
          </p>
        </section>

        {/* Message Board */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Card variant="elevated" className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-display text-sm text-amber-500 uppercase tracking-wider mb-1">Latest Updates</h3>
                <p className="text-sm text-foreground/90">
                  Muscle Muse is now live! I've added a new 'Progress' tab to track your journey. Have a feature idea? Use the feedback button in your profile!
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "This Week", value: getCompletedThisWeek(), icon: Calendar },
            { label: "Total", value: recentLogs.length, icon: Target },
            { label: "Streak", value: "—", icon: TrendingUp },
            { label: "Goal", value: getWeeklyGoal(), icon: Dumbbell },
          ].map((stat, i) => (
            <Card key={i} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
              <CardContent className="p-4 text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="font-display text-3xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Workout Schedule */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">YOUR SCHEDULE</h2>
            <span className="workout-badge">{getScheduleLabel()}</span>
          </div>

          <div className="space-y-3">
            {filteredWorkouts.map((day, index) => (
              <Link key={day.id} to={`/workout/${day.id}`}>
                <Card
                  variant="elevated"
                  className="group cursor-pointer hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">
                      {getMuscleGroupIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl group-hover:text-primary transition-colors">
                        {day.name.toUpperCase()}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {day.muscle_groups.join(" • ")}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
