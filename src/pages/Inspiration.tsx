import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Trophy, Filter, ArrowRight, ChevronDown, Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string | null;
  description: string | null;
  technique_tips: string[] | null;
  is_compound: boolean | null;
  is_bodyweight: boolean | null;
}

interface ExerciseConfig {
  weight: number;
  reps: number;
  restSeconds: number;
}

const MUSCLE_GROUPS = ["chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings", "glutes", "calves"];
const EQUIPMENT_LIST = [
  { id: "barbell", label: "Barbell" },
  { id: "dumbbells", label: "Dumbbells" },
  { id: "cables", label: "Cables" },
  { id: "machine", label: "Machine" },
  { id: "bodyweight", label: "Bodyweight" },
];

const REPS_PRESETS = [6, 8, 10, 12, 15];
const REST_PRESETS = [30, 60, 90, 120];

export default function Inspiration() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [exerciseConfigs, setExerciseConfigs] = useState<Record<string, ExerciseConfig>>({});

  // Fetch exercises from database
  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("muscle_group");
      
      if (error) {
        console.error("Error fetching exercises:", error);
      } else {
        setExercises(data || []);
        // Initialize configs for all exercises
        const initialConfigs: Record<string, ExerciseConfig> = {};
        (data || []).forEach((ex) => {
          initialConfigs[ex.id] = { weight: 20, reps: 10, restSeconds: 60 };
        });
        setExerciseConfigs(initialConfigs);
      }
      setLoading(false);
    }
    fetchExercises();
  }, []);

  // Filter exercises based on selections
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const muscleMatch = selectedMuscles.length === 0 || selectedMuscles.includes(ex.muscle_group.toLowerCase());
      const equipmentMatch = selectedEquipment.length === 0 || 
        (ex.equipment && selectedEquipment.includes(ex.equipment.toLowerCase())) ||
        (ex.is_bodyweight && selectedEquipment.includes("bodyweight"));
      return muscleMatch && equipmentMatch;
    });
  }, [exercises, selectedMuscles, selectedEquipment]);

  const toggleMuscle = (m: string) => {
    setSelectedMuscles((prev) => (prev.includes(m) ? prev.filter((i) => i !== m) : [...prev, m]));
  };

  const toggleEquipment = (e: string) => {
    setSelectedEquipment((prev) => (prev.includes(e) ? prev.filter((i) => i !== e) : [...prev, e]));
  };

  const updateConfig = (exerciseId: string, field: keyof ExerciseConfig, value: number) => {
    setExerciseConfigs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [field]: value },
    }));
  };

  const adjustWeight = (exerciseId: string, delta: number) => {
    const current = exerciseConfigs[exerciseId]?.weight || 0;
    const newValue = Math.max(0, Math.min(500, current + delta));
    updateConfig(exerciseId, "weight", newValue);
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl min-h-screen bg-background">
      {/* HEADER */}
      <div className="mb-8 text-center animate-fade-in">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Dashboard
        </Link>
        <h1 className="font-display text-4xl font-bold mb-2">
          THE <span className="text-primary">INSPIRATION</span>
        </h1>
        <p className="text-muted-foreground">Select your gear. Select your target. Configure your sets.</p>
      </div>

      {/* FILTERS */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {/* Equipment Card */}
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
                  className="cursor-pointer px-3 py-2 text-sm transition-all hover:border-primary"
                  onClick={() => toggleEquipment(item.id)}
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target Muscles Card */}
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
                      ? "bg-gradient-to-r from-primary to-destructive text-primary-foreground border-0"
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
          {(selectedMuscles.length > 0 || selectedEquipment.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedMuscles([]);
                setSelectedEquipment([]);
              }}
              className="text-xs text-muted-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading exercises...</div>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
            <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium">No exercises match these filters.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your selection.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {filteredExercises.map((ex) => {
              const config = exerciseConfigs[ex.id] || { weight: 20, reps: 10, restSeconds: 60 };
              
              return (
                <AccordionItem 
                  key={ex.id} 
                  value={ex.id}
                  className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-3 text-left flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base">{ex.name}</h3>
                          {ex.is_compound && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-primary/50 text-primary">
                              Compound
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {ex.muscle_group} {ex.equipment && `• ${ex.equipment}`}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-4 pb-4">
                    {/* Description */}
                    {ex.description && (
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {ex.description}
                      </p>
                    )}

                    {/* Technique Tips */}
                    {ex.technique_tips && ex.technique_tips.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Tips</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {ex.technique_tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Configuration Inputs */}
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border/50">
                      {/* Weight */}
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">
                          Weight (kg)
                        </label>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-primary/20"
                            onClick={() => adjustWeight(ex.id, -2.5)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <input
                            type="number"
                            value={config.weight}
                            onChange={(e) => updateConfig(ex.id, "weight", parseFloat(e.target.value) || 0)}
                            className="w-14 h-8 text-center text-sm font-bold bg-secondary border border-primary/20 rounded-md focus:outline-none focus:border-primary"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-primary/20"
                            onClick={() => adjustWeight(ex.id, 2.5)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Reps */}
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">
                          Reps
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {REPS_PRESETS.map((rep) => (
                            <Button
                              key={rep}
                              variant={config.reps === rep ? "default" : "outline"}
                              size="sm"
                              className={`h-8 px-2 text-xs ${config.reps === rep ? "" : "border-primary/20"}`}
                              onClick={() => updateConfig(ex.id, "reps", rep)}
                            >
                              {rep}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Rest */}
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">
                          Rest (sec)
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {REST_PRESETS.map((rest) => (
                            <Button
                              key={rest}
                              variant={config.restSeconds === rest ? "default" : "outline"}
                              size="sm"
                              className={`h-8 px-2 text-xs ${config.restSeconds === rest ? "" : "border-primary/20"}`}
                              onClick={() => updateConfig(ex.id, "restSeconds", rest)}
                            >
                              {rest}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
