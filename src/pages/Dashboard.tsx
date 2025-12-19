import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Calendar, TrendingUp, LogOut, ChevronRight, Target } from "lucide-react";

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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [recentLogs, setRecentLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [workoutsRes, logsRes] = await Promise.all([
      supabase.from("workout_days").select("*").order("day_number"),
      supabase
        .from("workout_logs")
        .select("*")
        .order("completed_at", { ascending: false })
        .limit(10),
    ]);

    if (workoutsRes.data) setWorkoutDays(workoutsRes.data);
    if (logsRes.data) setRecentLogs(logsRes.data);
    setLoading(false);
  };

  const getCompletedThisWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recentLogs.filter(
      (log) => new Date(log.completed_at) >= weekAgo
    ).length;
  };

  const getDayLabel = (dayNumber: number) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return days[dayNumber - 1] || `Day ${dayNumber}`;
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
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-energy rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl energy-text">FITFORGE</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link to="/progress">
              <Button variant="ghost" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <section className="mb-8 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            WELCOME BACK
          </h1>
          <p className="text-muted-foreground text-lg">
            {user?.email?.split("@")[0]} • {getCompletedThisWeek()}/5 workouts this week
          </p>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "This Week", value: getCompletedThisWeek(), icon: Calendar },
            { label: "Total", value: recentLogs.length, icon: Target },
            { label: "Streak", value: "—", icon: TrendingUp },
            { label: "Week Goal", value: "5", icon: Dumbbell },
          ].map((stat, i) => (
            <Card key={i} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
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
            <span className="workout-badge">5-Day Split</span>
          </div>

          <div className="space-y-3">
            {workoutDays.map((day, index) => (
              <Link key={day.id} to={`/workout/${day.id}`}>
                <Card
                  variant="elevated"
                  className="group cursor-pointer hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">
                      {getMuscleGroupIcon(day.muscle_groups)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          {getDayLabel(day.day_number)}
                        </span>
                      </div>
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
