import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Play,
  RefreshCw,
  Clock,
  Repeat,
  Target,
  Check,
  Info,
  Dumbbell,
} from "lucide-react";

interface WorkoutDay {
  id: string;
  name: string;
  description: string;
  muscle_groups: string[];
}

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string | null;
  is_compound: boolean;
  is_bodyweight: boolean;
  description: string;
  technique_tips: string[];
}

interface WorkoutExercise {
  id: string;
  exercise_id: string;
  sets: number;
  reps_min: number;
  reps_max: number;
  rest_seconds: number;
  order_index: number;
  exercise: Exercise;
}

interface ExerciseAlternative {
  id: string;
  alternative_exercise_id: string;
  alternative: Exercise;
}

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [alternatives, setAlternatives] = useState<Record<string, ExerciseAlternative[]>>({});
  const [userPreferences, setUserPreferences] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [startingWorkout, setStartingWorkout] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (id) fetchWorkoutData();
  }, [id]);

  const fetchWorkoutData = async () => {
    const [workoutRes, exercisesRes, preferencesRes] = await Promise.all([
      supabase.from("workout_days").select("*").eq("id", id).single(),
      supabase
        .from("workout_exercises")
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq("workout_day_id", id)
        .order("order_index"),
      supabase
        .from("user_exercise_preferences")
        .select("workout_exercise_id, selected_exercise_id")
        .eq("user_id", user?.id),
    ]);

    if (workoutRes.data) setWorkout(workoutRes.data);
    if (exercisesRes.data) {
      const formattedExercises = exercisesRes.data.map((e) => ({
        ...e,
        exercise: e.exercise as Exercise,
      }));
      setExercises(formattedExercises);

      // Fetch alternatives for each exercise
      const exerciseIds = formattedExercises.map((e) => e.exercise_id);
      const altsRes = await supabase
        .from("exercise_alternatives")
        .select(`
          *,
          alternative:exercises!exercise_alternatives_alternative_exercise_id_fkey(*)
        `)
        .in("primary_exercise_id", exerciseIds);

      if (altsRes.data) {
        const altsMap: Record<string, ExerciseAlternative[]> = {};
        altsRes.data.forEach((alt) => {
          if (!altsMap[alt.primary_exercise_id]) {
            altsMap[alt.primary_exercise_id] = [];
          }
          altsMap[alt.primary_exercise_id].push({
            ...alt,
            alternative: alt.alternative as Exercise,
          });
        });
        setAlternatives(altsMap);
      }
    }

    if (preferencesRes.data) {
      const prefsMap: Record<string, string> = {};
      preferencesRes.data.forEach((p) => {
        prefsMap[p.workout_exercise_id] = p.selected_exercise_id;
      });
      setUserPreferences(prefsMap);
    }

    setLoading(false);
  };

  const handleSwapExercise = async (
    workoutExerciseId: string,
    newExerciseId: string
  ) => {
    const { error } = await supabase.from("user_exercise_preferences").upsert({
      user_id: user?.id,
      workout_exercise_id: workoutExerciseId,
      selected_exercise_id: newExerciseId,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save preference",
        variant: "destructive",
      });
    } else {
      setUserPreferences((prev) => ({
        ...prev,
        [workoutExerciseId]: newExerciseId,
      }));
      toast({
        title: "Exercise swapped",
        description: "Your preference has been saved",
      });
    }
  };

  const getDisplayExercise = (workoutExercise: WorkoutExercise): Exercise => {
    const preferredId = userPreferences[workoutExercise.id];
    if (preferredId && preferredId !== workoutExercise.exercise_id) {
      const alt = alternatives[workoutExercise.exercise_id]?.find(
        (a) => a.alternative_exercise_id === preferredId
      );
      if (alt) return alt.alternative;
    }
    return workoutExercise.exercise;
  };

  const startWorkout = async () => {
    setStartingWorkout(true);
    const { error } = await supabase.from("workout_logs").insert({
      user_id: user?.id,
      workout_day_id: id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start workout",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Workout started!",
        description: "Crush it today! 💪",
      });
    }
    setStartingWorkout(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Dumbbell className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Workout not found</p>
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
          <div className="flex-1">
            <h1 className="font-display text-2xl">{workout.name.toUpperCase()}</h1>
            <p className="text-sm text-muted-foreground">
              {workout.muscle_groups.join(" • ")}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Workout Info */}
        <Card variant="energy" className="mb-6 animate-fade-in">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              {workout.description}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>{exercises.length} exercises</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>~45-60 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercises List */}
        <div className="space-y-3 mb-8">
          {exercises.map((workoutExercise, index) => {
            const exercise = getDisplayExercise(workoutExercise);
            const hasAlternatives = alternatives[workoutExercise.exercise_id]?.length > 0;
            const isSwapped = userPreferences[workoutExercise.id] && 
              userPreferences[workoutExercise.id] !== workoutExercise.exercise_id;

            return (
              <Card
                key={workoutExercise.id}
                variant="elevated"
                className={`animate-slide-up ${isSwapped ? "border-primary/30" : ""}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-display text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{exercise.name}</h3>
                        {isSwapped && (
                          <span className="text-xs text-primary">swapped</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Repeat className="w-3 h-3" />
                          {workoutExercise.sets} sets
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {workoutExercise.reps_min}-{workoutExercise.reps_max} reps
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {workoutExercise.rest_seconds}s rest
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exercise.is_compound && (
                          <span className="workout-badge text-[10px]">Compound</span>
                        )}
                        {exercise.is_bodyweight && (
                          <span className="workout-badge text-[10px]">Bodyweight</span>
                        )}
                        {exercise.equipment && !exercise.is_bodyweight && (
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {exercise.equipment}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle className="font-display text-2xl">
                              {selectedExercise?.name.toUpperCase()}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-muted-foreground">
                              {selectedExercise?.description}
                            </p>
                            {selectedExercise?.technique_tips && (
                              <div>
                                <h4 className="font-semibold mb-2 text-primary">
                                  Technique Tips
                                </h4>
                                <ul className="space-y-2">
                                  {selectedExercise.technique_tips.map((tip, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm"
                                    >
                                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {hasAlternatives && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="font-display text-xl">
                                SWAP EXERCISE
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <button
                                onClick={() =>
                                  handleSwapExercise(
                                    workoutExercise.id,
                                    workoutExercise.exercise_id
                                  )
                                }
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                  !isSwapped
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <span className="font-medium">
                                  {workoutExercise.exercise.name}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  (original)
                                </span>
                              </button>
                              {alternatives[workoutExercise.exercise_id]?.map(
                                (alt) => (
                                  <button
                                    key={alt.id}
                                    onClick={() =>
                                      handleSwapExercise(
                                        workoutExercise.id,
                                        alt.alternative_exercise_id
                                      )
                                    }
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                      userPreferences[workoutExercise.id] ===
                                      alt.alternative_exercise_id
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                  >
                                    <span className="font-medium">
                                      {alt.alternative.name}
                                    </span>
                                  </button>
                                )
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Start Workout Button */}
        <div className="sticky bottom-4">
          <Button
            variant="energy"
            size="xl"
            className="w-full"
            onClick={startWorkout}
            disabled={startingWorkout}
          >
            <Play className="w-5 h-5 mr-2" />
            {startingWorkout ? "Starting..." : "Start Workout"}
          </Button>
        </div>
      </main>
    </div>
  );
}
