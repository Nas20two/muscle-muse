import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Trophy, Filter, ArrowRight, ArrowLeft, Info, Play, Sparkles, Video, CheckCircle, Clock, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- 1. FULL EQUIPMENT LIST (Now includes Barbell & Machines) ---
const EQUIPMENT_LIST = [
  { id: "bodyweight", label: "Bodyweight" },
  { id: "dumbbell", label: "Dumbbells" },
  { id: "barbell", label: "Barbell" },
  { id: "gym_machine", label: "Machines" },
  { id: "pull_up_bar", label: "Pull-up Bar" },
];

// --- 2. FULL EXERCISE DATABASE (With Video IDs) ---
const EXERCISE_DB = [
  // Bodyweight
  {
    id: 1,
    name: "Push-ups",
    muscles: ["chest", "triceps"],
    equipment: ["bodyweight"],
    difficulty: "Beginner",
    tutorial: "IODxDxX7oi4",
  },
  {
    id: 4,
    name: "Bodyweight Squats",
    muscles: ["legs"],
    equipment: ["bodyweight"],
    difficulty: "Beginner",
    tutorial: "gcNh17Ckjgg",
  },
  {
    id: 7,
    name: "Plank",
    muscles: ["core"],
    equipment: ["bodyweight"],
    difficulty: "Beginner",
    tutorial: "pSHjTRCQxIw",
  },
  {
    id: 10,
    name: "Mountain Climbers",
    muscles: ["core", "cardio"],
    equipment: ["bodyweight"],
    difficulty: "Beginner",
    tutorial: "nmwgirgXLYM",
  },

  // Dumbbells
  {
    id: 2,
    name: "Dumbbell Bench Press",
    muscles: ["chest", "shoulders"],
    equipment: ["dumbbell"],
    difficulty: "Intermediate",
    tutorial: "Y_7aHqEeup4",
  },
  {
    id: 5,
    name: "Goblet Squats",
    muscles: ["legs"],
    equipment: ["dumbbell"],
    difficulty: "Beginner",
    tutorial: "MeIiIdhvXT4",
  },
  {
    id: 6,
    name: "Dumbbell Rows",
    muscles: ["back"],
    equipment: ["dumbbell"],
    difficulty: "Beginner",
    tutorial: "pYcpY20QaE8",
  },
  {
    id: 9,
    name: "Dumbbell Shoulder Press",
    muscles: ["shoulders"],
    equipment: ["dumbbell"],
    difficulty: "Intermediate",
    tutorial: "qEwKCR5JCog",
  },
  {
    id: 12,
    name: "Dumbbell Deadlift",
    muscles: ["legs", "back"],
    equipment: ["dumbbell"],
    difficulty: "Intermediate",
    tutorial: "lHrqS_J66v8",
  },

  // Barbell (NEW)
  {
    id: 13,
    name: "Barbell Back Squat",
    muscles: ["legs", "core"],
    equipment: ["barbell"],
    difficulty: "Advanced",
    tutorial: "SW_C1A-rejs",
  },
  {
    id: 14,
    name: "Barbell Bench Press",
    muscles: ["chest", "triceps"],
    equipment: ["barbell"],
    difficulty: "Intermediate",
    tutorial: "vcBig73ojpE",
  },
  {
    id: 15,
    name: "Deadlift",
    muscles: ["legs", "back"],
    equipment: ["barbell"],
    difficulty: "Advanced",
    tutorial: "ytGaGIn3SjE",
  },

  // Machines / Pull-up (NEW)
  {
    id: 3,
    name: "Pull-ups",
    muscles: ["back", "biceps"],
    equipment: ["pull_up_bar"],
    difficulty: "Intermediate",
    tutorial: "eGo4IYlbE5g",
  },
  {
    id: 16,
    name: "Lat Pulldown",
    muscles: ["back"],
    equipment: ["gym_machine"],
    difficulty: "Beginner",
    tutorial: "CAwf7n6Luuc",
  },
  {
    id: 17,
    name: "Seated Cable Row",
    muscles: ["back"],
    equipment: ["gym_machine"],
    difficulty: "Intermediate",
    tutorial: "GZbfZ033f74",
  },
];

const MUSCLE_GROUPS = ["chest", "back", "legs", "shoulders", "arms", "core"];

export default function Inspiration() {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(["bodyweight"]); // Default to bodyweight
  const navigate = useNavigate();

  // --- LOGIC ENGINE ---
  const filteredExercises = useMemo(() => {
    return EXERCISE_DB.filter((ex) => {
      // Muscle Logic: If none selected, show ALL matches for the equipment
      const muscleMatch = selectedMuscles.length === 0 || ex.muscles.some((m) => selectedMuscles.includes(m));
      // Equipment Logic: Exercise must match at least one selected tool
      const equipmentMatch = ex.equipment.some((eq) => selectedEquipment.includes(eq));
      return muscleMatch && equipmentMatch;
    });
  }, [selectedMuscles, selectedEquipment]);

  // Toggle Helpers
  const toggleMuscle = (m: string) => {
    setSelectedMuscles((prev) => (prev.includes(m) ? prev.filter((i) => i !== m) : [...prev, m]));
  };
  const toggleEquipment = (e: string) => {
    setSelectedEquipment((prev) => (prev.includes(e) ? prev.filter((i) => i !== e) : [...prev, e]));
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl min-h-screen bg-background">
      {/* HEADER */}
      <div className="mb-8 text-center animate-fade-in">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="font-display text-4xl font-bold mb-2">
          THE <span className="text-primary">INSPIRATION</span>
        </h1>
        <p className="text-muted-foreground">Select your gear. Master your form.</p>
      </div>

      {/* FILTERS */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <Card className="border-primary/10 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <h3 className="font-display text-lg mb-3 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-primary" /> Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_LIST.map((item) => (
                <Badge
                  key={item.id}
                  variant={selectedEquipment.includes(item.id) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-2 text-sm transition-all hover:border-primary hover:bg-primary/10"
                  onClick={() => toggleEquipment(item.id)}
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <h3 className="font-display text-lg mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Targets
            </h3>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((m) => (
                <Badge
                  key={m}
                  className={`cursor-pointer px-3 py-2 text-sm uppercase tracking-wide transition-all ${
                    selectedMuscles.includes(m)
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-0"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                  onClick={() => toggleMuscle(m)}
                >
                  {m}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RESULTS */}
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display">
            EXERCISES <span className="text-muted-foreground text-sm ml-2">({filteredExercises.length})</span>
          </h2>
          {selectedMuscles.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMuscles([])}
              className="text-xs text-muted-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {filteredExercises.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl bg-card/50">
            <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium">No exercises match.</p>
            <p className="text-sm text-muted-foreground">Try selecting "Dumbbells" or "Barbell".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((ex) => (
              <Card key={ex.id} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{ex.name}</h3>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                        {ex.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{ex.muscles.join(" • ")}</p>
                  </div>

                  {/* ACTIONS: Video & Quick Log */}
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                          <Video className="w-5 h-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10">
                        <DialogHeader>
                          <DialogTitle className="font-display text-2xl mb-1">{ex.name}</DialogTitle>
                          <DialogDescription>Watch this demo to master your form.</DialogDescription>
                        </DialogHeader>

                        <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden border border-border bg-black mt-2 shadow-2xl">
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${ex.tutorial}?rel=0&autoplay=1&mute=1`}
                            title={ex.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
