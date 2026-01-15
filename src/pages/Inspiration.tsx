import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Home, TrendingUp, X, Sparkles, Dumbbell } from "lucide-react";
import Logo from "@/components/Logo";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string | null;
  is_compound: boolean | null;
  is_bodyweight: boolean | null;
  description: string | null;
}

const EQUIPMENT_OPTIONS = ["barbell", "dumbbells", "cables", "machine", "bodyweight"];
const MUSCLE_OPTIONS = ["back", "biceps", "chest", "shoulders", "triceps", "quads", "hamstrings", "glutes", "calves"];

export default function Inspiration() {
  const { signOut } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

  useEffect(() => {
    fetchExercises();
  }, [selectedEquipment, selectedMuscles]);

  const fetchExercises = async () => {
    setLoading(true);
    let query = supabase.from("exercises").select("*").order("muscle_group");

    if (selectedEquipment.length > 0) {
      query = query.in("equipment", selectedEquipment);
    }
    if (selectedMuscles.length > 0) {
      query = query.in("muscle_group", selectedMuscles);
    }

    const { data, error } = await query;

    if (!error && data) {
      setExercises(data);
    }
    setLoading(false);
  };

  const toggleEquipment = (equip: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equip) ? prev.filter((e) => e !== equip) : [...prev, equip]
    );
  };

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const clearFilters = () => {
    setSelectedEquipment([]);
    setSelectedMuscles([]);
  };

  const hasFilters = selectedEquipment.length > 0 || selectedMuscles.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="sm" />
          <nav className="flex items-center gap-0.5 sm:gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/progress">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <TrendingUp className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-5 sm:px-6 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl energy-text">
              FIND YOUR INSPIRATION
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Filter exercises by equipment and muscle groups
          </p>
        </section>

        {/* Equipment Filter */}
        <section className="mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 className="font-display text-lg mb-3 text-muted-foreground uppercase tracking-wider">
            Equipment
          </h2>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((equip) => (
              <button
                key={equip}
                onClick={() => toggleEquipment(equip)}
                className={`px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                  selectedEquipment.includes(equip)
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "workout-badge hover:border-primary/60"
                }`}
              >
                {equip}
              </button>
            ))}
          </div>
        </section>

        {/* Muscle Groups Filter */}
        <section className="mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="font-display text-lg mb-3 text-muted-foreground uppercase tracking-wider">
            Muscle Groups
          </h2>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_OPTIONS.map((muscle) => (
              <button
                key={muscle}
                onClick={() => toggleMuscle(muscle)}
                className={`px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                  selectedMuscles.includes(muscle)
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "workout-badge hover:border-primary/60"
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </section>

        {/* Results Header */}
        <section className="mb-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">
              EXERCISES{" "}
              <span className="text-muted-foreground">({exercises.length} found)</span>
            </h2>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </section>

        {/* Exercises List */}
        <section className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Dumbbell className="w-8 h-8 text-primary animate-pulse" />
            </div>
          ) : exercises.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No exercises found with the selected filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            exercises.map((exercise, index) => (
              <Card
                key={exercise.id}
                variant="elevated"
                className="animate-slide-up"
                style={{ animationDelay: `${(index % 10) * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl mb-1">{exercise.name.toUpperCase()}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-primary capitalize">{exercise.muscle_group}</span>
                        {exercise.equipment && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground capitalize">
                              {exercise.equipment}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {exercise.is_compound && (
                        <span className="workout-badge text-xs">Compound</span>
                      )}
                      {exercise.is_bodyweight && (
                        <span className="workout-badge text-xs">Bodyweight</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
