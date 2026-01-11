import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Calendar, Loader2, Check } from "lucide-react";

type ScheduleType = "3-day" | "4-day" | "5-day";

interface ScheduleOption {
  type: ScheduleType;
  title: string;
  description: string;
  days: string;
  icon: string;
}

const scheduleOptions: ScheduleOption[] = [
  {
    type: "3-day",
    title: "3-Day Split",
    description: "Full body workouts for balanced training",
    days: "Mon, Wed, Fri",
    icon: "🏃",
  },
  {
    type: "4-day",
    title: "4-Day Split",
    description: "Upper/Lower split for more focus",
    days: "Mon, Tue, Thu, Fri",
    icon: "💪",
  },
  {
    type: "5-day",
    title: "5-Day Split",
    description: "Push/Pull/Legs for maximum gains",
    days: "Mon - Fri",
    icon: "🔥",
  },
];

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType | null>(null);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState<string>("Warrior");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      
      const name = data?.display_name || 
        user.user_metadata?.display_name || 
        user.email?.split("@")[0] || 
        "Warrior";
      setDisplayName(name);
    };

    fetchProfile();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Dumbbell className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSaveSchedule = async () => {
    if (!selectedSchedule || !user) return;

    setSaving(true);
    const { error } = await supabase.from("user_schedules").upsert(
      {
        user_id: user.id,
        schedule_type: selectedSchedule,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save your schedule. Please try again.",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    toast({
      title: "Schedule saved!",
      description: `You're all set with the ${selectedSchedule} workout split.`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dark">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl animate-scale-in relative">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-energy rounded-2xl flex items-center justify-center shadow-glow mb-4">
            <Calendar className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl energy-text mb-2">
            WELCOME, {displayName.toUpperCase()}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your workout schedule to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {scheduleOptions.map((option) => (
            <Card
              key={option.type}
              variant="elevated"
              className={`cursor-pointer transition-all duration-300 ${
                selectedSchedule === option.type
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedSchedule(option.type)}
            >
              <CardContent className="p-6 text-center relative">
                {selectedSchedule === option.type && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="text-4xl mb-3">{option.icon}</div>
                <h3 className="font-display text-xl mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                <span className="text-xs text-primary font-medium uppercase tracking-wider">
                  {option.days}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="energy"
          size="lg"
          className="w-full"
          onClick={handleSaveSchedule}
          disabled={!selectedSchedule || saving}
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Start Training"
          )}
        </Button>
      </div>
    </div>
  );
}
