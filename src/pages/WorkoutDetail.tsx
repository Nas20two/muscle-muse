import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Target, Info, RefreshCw, Check, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Mock Data (Replace with Supabase fetch later)
const WORKOUT_DATA = {
  id: "1",
  name: "PUSH DAY",
  focus: "chest • shoulders • triceps",
  description: "Chest, shoulders, and triceps focused workout for pressing strength",
  duration: "~45-60 min",
  exercises: [
    { id: 1, name: "Barbell Bench Press", sets: 4, reps: "5-8", rest: "120s", tags: ["COMPOUND", "barbell"] },
    { id: 2, name: "Incline Dumbbell Press", sets: 3, reps: "8-12", rest: "90s", tags: ["COMPOUND", "dumbbells"] },
    { id: 3, name: "Dumbbell Flyes", sets: 3, reps: "8-12", rest: "90s", tags: ["dumbbells"] },
  ],
};

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // STATE: This controls if we are in "Preview" or "Active" mode
  const [isActive, setIsActive] = useState(false);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());

  // Helper to toggle a set as "Done"
  const toggleSet = (exerciseId: number, setIndex: number) => {
    const key = `${exerciseId}-${setIndex}`;
    const newSet = new Set(completedSets);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setCompletedSets(newSet);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="container max-w-lg mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold uppercase tracking-wider">{WORKOUT_DATA.name}</h1>
            <p className="text-xs text-muted-foreground">{WORKOUT_DATA.focus}</p>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto p-4 space-y-4">
        {/* SUMMARY CARD (Only show in Preview Mode) */}
        {!isActive && (
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardContent className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">{WORKOUT_DATA.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-orange-500">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">{WORKOUT_DATA.exercises.length} exercises</span>
                </div>
                <div className="flex items-center gap-2 text-orange-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{WORKOUT_DATA.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* EXERCISES LIST */}
        <div className="space-y-3">
          {WORKOUT_DATA.exercises.map((ex, index) => (
            <Card key={ex.id} className={`border-border ${isActive ? "ring-1 ring-primary/20" : ""}`}>
              <CardContent className="p-4">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none mb-1">{ex.name}</h3>
                      {/* Show summary text ONLY in preview mode */}
                      {!isActive && (
                        <p className="text-sm text-muted-foreground">
                          <RefreshCw className="w-3 h-3 inline mr-1" />
                          {ex.sets} sets <span className="mx-1">•</span> {ex.reps} reps
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {ex.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] uppercase h-5 px-1.5 bg-secondary/50 text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <Info className="w-4 h-4" />
                    </Button>
                    {!isActive && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* ACTIVE LOGGING INTERFACE (Appears when started) */}
                {isActive && (
                  <div className="animate-fade-in space-y-2 mt-2">
                    <div className="grid grid-cols-10 gap-2 text-[10px] text-muted-foreground uppercase tracking-wider text-center mb-1">
                      <div className="col-span-1">Set</div>
                      <div className="col-span-3">Previous</div>
                      <div className="col-span-2">kg</div>
                      <div className="col-span-2">Reps</div>
                      <div className="col-span-2">Done</div>
                    </div>

                    {Array.from({ length: ex.sets }).map((_, i) => {
                      const isDone = completedSets.has(`${ex.id}-${i}`);
                      return (
                        <div key={i} className={`grid grid-cols-10 gap-2 items-center ${isDone ? "opacity-50" : ""}`}>
                          <div className="col-span-1 flex justify-center">
                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                              {i + 1}
                            </div>
                          </div>
                          <div className="col-span-3 text-center text-xs text-muted-foreground">-</div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              placeholder="0"
                              className="h-8 text-center px-1 bg-secondary/20 border-transparent focus:border-primary"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              placeholder={ex.reps.split("-")[1] || ex.reps}
                              className="h-8 text-center px-1 bg-secondary/20 border-transparent focus:border-primary"
                            />
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <Button
                              size="sm"
                              variant={isDone ? "default" : "secondary"} // Turns Green/Orange when clicked
                              className={`h-8 w-8 p-0 rounded-lg transition-all ${isDone ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                              onClick={() => toggleSet(ex.id, i)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* STICKY FOOTER ACTION BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="container max-w-lg mx-auto">
          {!isActive ? (
            <Button
              className="w-full h-12 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
              onClick={() => setIsActive(true)} // THIS IS THE MAGIC SWITCH
            >
              <Play className="w-5 h-5 mr-2 fill-current" /> START WORKOUT
            </Button>
          ) : (
            <Button
              className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground"
              onClick={() => {
                // Here you would save to Supabase
                console.log("Saving workout...");
                navigate("/");
              }}
            >
              <Save className="w-5 h-5 mr-2" /> FINISH WORKOUT
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
