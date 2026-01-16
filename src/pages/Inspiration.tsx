import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Trophy, Filter, ArrowRight, Info, Play, Sparkles, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

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
  { id: 1, name: "Push-ups", muscles: ["chest", "triceps"], equipment: ["bodyweight"], difficulty: "Beginner", tutorial: "IODxDxX7oi4" },
  { id: 4, name: "Bodyweight Squats", muscles: ["legs"], equipment: ["bodyweight"], difficulty: "Beginner", tutorial: "gcNh17Ckjgg" },
  { id: 7, name: "Plank", muscles: ["core"], equipment: ["bodyweight"], difficulty: "Beginner", tutorial: "pSHjTRCQxIw" },
  { id: 10, name: "Mountain Climbers", muscles: ["core", "cardio"], equipment: ["bodyweight"], difficulty: "Beginner", tutorial: "nmwgirgXLYM" },
  
  // Dumbbells
  { id: 2, name: "Dumbbell Bench Press", muscles: ["chest", "shoulders"], equipment: ["dumbbell"], difficulty: "Intermediate", tutorial: "Y_7aHqEeup4" },
  { id: 5, name: "Goblet Squats", muscles: ["legs"], equipment: ["dumbbell"], difficulty: "Beginner", tutorial: "MeIiIdhvXT4" },
  { id: 6, name: "Dumbbell Rows", muscles: ["back"], equipment: ["dumbbell"], difficulty: "Beginner", tutorial: "pYcpY20QaE8" },
  { id: 9, name: "Dumbbell Shoulder Press", muscles: ["shoulders"], equipment: ["dumbbell"], difficulty: "Intermediate", tutorial: "qEwKCR5JCog" },
  { id: 12, name: "Dumbbell Deadlift", muscles: ["legs", "back"], equipment: ["dumbbell"], difficulty: "Intermediate", tutorial: "lHrqS_J66v8" },

  // Barbell (NEW)
  { id: 13, name: "Barbell Back Squat", muscles: ["legs", "core"], equipment: ["barbell"], difficulty: "Advanced", tutorial: "SW_C1A-rejs" },
  { id: 14, name: "Barbell Bench Press", muscles: ["chest", "triceps"], equipment: ["barbell"], difficulty: "Intermediate", tutorial: "vcBig73ojpE" },
  { id: 15, name: "Deadlift", muscles: ["legs", "back"], equipment: ["barbell"], difficulty: "Advanced", tutorial: "ytGaGIn3SjE" },

  // Machines / Pull-up (NEW)
  { id: 3, name: "Pull-ups", muscles: ["back", "biceps"], equipment: ["pull_up_bar"], difficulty: "Intermediate", tutorial: "eGo4IYlbE5g" },
  { id: 16, name: "Lat Pulldown", muscles: ["back"], equipment: ["gym_machine"], difficulty: "Beginner", tutorial: "CAwf7n6Luuc" },
  { id: 17, name: "Seated Cable Row", muscles: ["back"], equipment: ["gym_machine"], difficulty: "Intermediate", tutorial: "GZbfZ033f74" },
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
      const muscleMatch = selectedMuscles.length === 0 || ex.muscles.some(m => selectedMuscles.includes(m));
      // Equipment Logic: Exercise must match at least one selected tool
      const equipmentMatch = ex.equipment.some(eq => selectedEquipment.includes(eq));
      return muscleMatch && equipmentMatch;
    });
  }, [selectedMuscles, selectedEquipment]);

  // Toggle Helpers
  const toggleMuscle = (m: string