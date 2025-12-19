import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, Dumbbell, Target } from "lucide-react";

interface WorkoutLog {
  id: string;
  workout_day_id: string;
  completed_at: string;
  duration_minutes: number | null;
  workout_day?: {
    name: string;
    muscle_groups: string[];
  };
}

interface WeekData {
  week: string;
  count: number;
}

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const { data } = await supabase
      .from("workout_logs")
      .select(`
        *,
        workout_day:workout_days(name, muscle_groups)
      `)
      .eq("user_id", user?.id)
      .order("completed_at", { ascending: false });

    if (data) {
      const formattedLogs = data.map((log) => ({
        ...log,
        workout_day: log.workout_day as { name: string; muscle_groups: string[] },
      }));
      setLogs(formattedLogs);

      // Calculate weekly data for the last 8 weeks
      const weeks: Record<string, number> = {};
      const now = new Date();
      for (let i = 0; i < 8; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7);
        const weekKey = weekStart.toISOString().split("T")[0];
        weeks[weekKey] = 0;
      }

      formattedLogs.forEach((log) => {
        const logDate = new Date(log.completed_at);
        const weekStart = new Date(logDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split("T")[0];
        if (weeks[weekKey] !== undefined) {
          weeks[weekKey]++;
        }
      });

      setWeeklyData(
        Object.entries(weeks)
          .map(([week, count]) => ({ week, count }))
          .reverse()
      );
    }
    setLoading(false);
  };

  const getTotalWorkouts = () => logs.length;
  const getThisWeekCount = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logs.filter((log) => new Date(log.completed_at) >= weekAgo).length;
  };
  const getMaxWeek = () => Math.max(...weeklyData.map((w) => w.count), 1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
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
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-2xl">PROGRESS</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card variant="energy" className="animate-fade-in">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="font-display text-4xl">{getTotalWorkouts()}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Workouts
              </p>
            </CardContent>
          </Card>
          <Card variant="energy" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="font-display text-4xl">{getThisWeekCount()}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                This Week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card variant="elevated" className="mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg font-display">WEEKLY ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((week, i) => (
                <div
                  key={week.week}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-primary/20 rounded-t-md transition-all duration-500"
                    style={{
                      height: `${(week.count / getMaxWeek()) * 100}%`,
                      minHeight: week.count > 0 ? "8px" : "2px",
                      background:
                        week.count > 0
                          ? "linear-gradient(180deg, hsl(24, 100%, 50%), hsl(36, 100%, 50%))"
                          : undefined,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    W{i + 1}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Last 8 weeks
            </p>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <div>
          <h2 className="font-display text-xl mb-4">RECENT ACTIVITY</h2>
          {logs.length === 0 ? (
            <Card variant="glass" className="animate-fade-in">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No workouts completed yet</p>
                <Button
                  variant="energy"
                  className="mt-4"
                  onClick={() => navigate("/")}
                >
                  Start Your First Workout
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 10).map((log, i) => (
                <Card
                  key={log.id}
                  variant="elevated"
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {log.workout_day?.name || "Workout"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(log.completed_at)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {log.workout_day?.muscle_groups.slice(0, 2).map((group) => (
                        <span
                          key={group}
                          className="text-xs bg-secondary px-2 py-1 rounded capitalize"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
