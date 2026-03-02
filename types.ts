export interface SetData {
  id: string;
  reps: number;
  weight: number; // in kg or lbs
  completed: boolean;
  targetReps?: string; // e.g. "8-12"
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: SetData[];
  restSeconds: number;
  note?: string; // Technique tips
  variation?: string; // Currently selected variation
  availableVariations?: string[]; // List of selectable variations
  videoUrl?: string; // URL for AI generated demo video
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export enum AppRoute {
  HOME = '/',
  WORKOUT = '/workout/:planId',
  GENERATOR = '/generator',
}