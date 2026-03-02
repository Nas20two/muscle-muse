import { WorkoutPlan, Exercise } from './types';
import { v4 as uuidv4 } from 'uuid'; 

const generateId = () => Math.random().toString(36).substr(2, 9);

const createSet = (reps: number, target: string): any => ({
  id: generateId(),
  reps: reps,
  weight: 0,
  completed: false,
  targetReps: target
});

// PPL Split - Push Day
const pushDay: WorkoutPlan = {
  id: 'ppl-push',
  name: 'Day 1: Push (Strength & Hypertrophy)',
  description: 'Focus on Chest, Shoulders, and Triceps using compound movements.',
  durationMinutes: 60,
  difficulty: 'Intermediate',
  exercises: [
    {
      id: generateId(),
      name: 'Barbell Bench Press',
      muscleGroup: 'Chest',
      variation: 'Flat Barbell',
      availableVariations: ['Flat Barbell', 'Incline Barbell', 'Dumbbell Flat', 'Dumbbell Incline', 'Smith Machine Press'],
      restSeconds: 120,
      note: 'Keep elbows at 45 degrees. Focus on explosive push.',
      sets: [createSet(5, '5'), createSet(5, '5'), createSet(5, '5'), createSet(8, '8-10')]
    },
    {
      id: generateId(),
      name: 'Overhead Press (OHP)',
      muscleGroup: 'Shoulders',
      variation: 'Standing Barbell',
      availableVariations: ['Standing Barbell', 'Seated Dumbbell', 'Military Press', 'Machine Shoulder Press'],
      restSeconds: 90,
      note: 'Brace core, do not arch back excessively.',
      sets: [createSet(8, '8-10'), createSet(8, '8-10'), createSet(8, '8-10')]
    },
    {
      id: generateId(),
      name: 'Incline Dumbbell Press',
      muscleGroup: 'Chest',
      variation: '30 Degree Incline',
      availableVariations: ['30 Degree Incline', '45 Degree Incline', 'Low Incline'],
      restSeconds: 90,
      note: 'Focus on upper chest stretch.',
      sets: [createSet(10, '10-12'), createSet(10, '10-12'), createSet(10, '10-12')]
    },
    {
      id: generateId(),
      name: 'Lateral Raises',
      muscleGroup: 'Shoulders',
      variation: 'Dumbbell',
      availableVariations: ['Dumbbell', 'Cable', 'Machine', 'Seated'],
      restSeconds: 60,
      note: 'Control the eccentric (lowering) phase.',
      sets: [createSet(15, '12-15'), createSet(15, '12-15'), createSet(15, '12-15')]
    },
    {
      id: generateId(),
      name: 'Tricep Dips',
      muscleGroup: 'Triceps',
      variation: 'Bodyweight',
      availableVariations: ['Bodyweight', 'Weighted', 'Assisted Machine', 'Bench Dips'],
      restSeconds: 60,
      note: 'Keep chest up to target triceps.',
      sets: [createSet(12, 'AMRAP'), createSet(12, 'AMRAP'), createSet(12, 'AMRAP')]
    }
  ]
};

// PPL Split - Pull Day
const pullDay: WorkoutPlan = {
  id: 'ppl-pull',
  name: 'Day 2: Pull (Back & Biceps)',
  description: 'Building a wide and thick back with bicep isolation.',
  durationMinutes: 60,
  difficulty: 'Intermediate',
  exercises: [
    {
      id: generateId(),
      name: 'Deadlift',
      muscleGroup: 'Back/Legs',
      variation: 'Conventional',
      availableVariations: ['Conventional', 'Sumo', 'Trap Bar', 'Rack Pulls'],
      restSeconds: 180,
      note: 'Keep spine neutral. Drive through heels.',
      sets: [createSet(5, '5'), createSet(5, '5'), createSet(5, '5')]
    },
    {
      id: generateId(),
      name: 'Pull-Ups',
      muscleGroup: 'Back',
      variation: 'Wide Grip',
      availableVariations: ['Wide Grip', 'Neutral Grip', 'Chin-Ups', 'Assisted Machine'],
      restSeconds: 90,
      note: 'Full range of motion. Chin over bar.',
      sets: [createSet(8, 'AMRAP'), createSet(8, 'AMRAP'), createSet(8, 'AMRAP')]
    },
    {
      id: generateId(),
      name: 'Barbell Rows',
      muscleGroup: 'Back',
      variation: 'Bent Over',
      availableVariations: ['Bent Over', 'Pendlay Row', 'Yates Row', 'Underhand Grip'],
      restSeconds: 90,
      note: 'Squeeze shoulder blades at top.',
      sets: [createSet(10, '8-12'), createSet(10, '8-12'), createSet(10, '8-12')]
    },
    {
      id: generateId(),
      name: 'Face Pulls',
      muscleGroup: 'Rear Delts',
      variation: 'Cable',
      availableVariations: ['Cable', 'Banded', 'Dumbbell Rear Delt Fly'],
      restSeconds: 60,
      note: 'Pull towards forehead, external rotation.',
      sets: [createSet(15, '15-20'), createSet(15, '15-20'), createSet(15, '15-20')]
    },
    {
      id: generateId(),
      name: 'Bicep Curls',
      muscleGroup: 'Biceps',
      variation: 'Barbell',
      availableVariations: ['Barbell', 'EZ Bar', 'Dumbbell Supinating', 'Hammer Curls'],
      restSeconds: 60,
      note: 'No swinging.',
      sets: [createSet(12, '10-12'), createSet(12, '10-12'), createSet(12, '10-12')]
    }
  ]
};

// PPL Split - Legs
const legsDay: WorkoutPlan = {
  id: 'ppl-legs',
  name: 'Day 3: Legs (Lower Body Power)',
  description: 'Quads, Hamstrings, and Glutes focus.',
  durationMinutes: 65,
  difficulty: 'Intermediate',
  exercises: [
    {
      id: generateId(),
      name: 'Barbell Squat',
      muscleGroup: 'Legs',
      variation: 'High Bar',
      availableVariations: ['High Bar', 'Low Bar', 'Front Squat', 'Safety Bar Squat'],
      restSeconds: 180,
      note: 'Depth below parallel if mobility allows.',
      sets: [createSet(5, '5'), createSet(5, '5'), createSet(5, '5'), createSet(5, '5')]
    },
    {
      id: generateId(),
      name: 'Romanian Deadlift (RDL)',
      muscleGroup: 'Hamstrings',
      variation: 'Barbell',
      availableVariations: ['Barbell', 'Dumbbell', 'Single Leg Dumbbell', 'Landmine'],
      restSeconds: 90,
      note: 'Hinge at hips, slight knee bend.',
      sets: [createSet(10, '8-10'), createSet(10, '8-10'), createSet(10, '8-10')]
    },
    {
      id: generateId(),
      name: 'Leg Press',
      muscleGroup: 'Quads',
      variation: 'Machine',
      availableVariations: ['Standard', 'Wide Stance', 'Narrow Stance', 'Single Leg'],
      restSeconds: 90,
      note: 'Do not lock knees at extension.',
      sets: [createSet(12, '10-12'), createSet(12, '10-12'), createSet(12, '10-12')]
    },
    {
      id: generateId(),
      name: 'Standing Calf Raises',
      muscleGroup: 'Calves',
      variation: 'Machine',
      availableVariations: ['Machine', 'Smith Machine', 'Dumbbell Single Leg', 'Seated'],
      restSeconds: 60,
      note: 'Pause at bottom and top.',
      sets: [createSet(15, '15-20'), createSet(15, '15-20'), createSet(15, '15-20'), createSet(15, '15-20')]
    }
  ]
};

// Upper Body Hypertrophy
const upperHypertrophy: WorkoutPlan = {
  id: 'upper-hyper',
  name: 'Day 4: Upper Body (Hypertrophy)',
  description: 'Higher volume upper body session.',
  durationMinutes: 55,
  difficulty: 'Advanced',
  exercises: [
    {
      id: generateId(),
      name: 'Dumbbell Bench Press',
      muscleGroup: 'Chest',
      variation: 'Flat',
      availableVariations: ['Flat', 'Incline', 'Neutral Grip'],
      restSeconds: 90,
      note: 'Full stretch at bottom.',
      sets: [createSet(10, '8-12'), createSet(10, '8-12'), createSet(10, '8-12')]
    },
    {
      id: generateId(),
      name: 'Seated Cable Row',
      muscleGroup: 'Back',
      variation: 'V-Grip',
      availableVariations: ['V-Grip', 'Wide Grip', 'Single Arm'],
      restSeconds: 90,
      note: 'Keep torso stationary.',
      sets: [createSet(12, '10-12'), createSet(12, '10-12'), createSet(12, '10-12')]
    },
    {
      id: generateId(),
      name: 'Arnold Press',
      muscleGroup: 'Shoulders',
      variation: 'Seated Dumbbell',
      availableVariations: ['Seated Dumbbell', 'Standing Dumbbell', 'Kettlebell'],
      restSeconds: 60,
      note: 'Rotate palms as you press up.',
      sets: [createSet(12, '10-12'), createSet(12, '10-12'), createSet(12, '10-12')]
    },
    {
      id: generateId(),
      name: 'Super Set: Bi/Tri',
      muscleGroup: 'Arms',
      variation: 'Hammer Curls + Skullcrushers',
      availableVariations: ['Hammer Curls + Skullcrushers', 'Preacher Curls + Pushdowns', 'Incline Curls + Overhead Ext'],
      restSeconds: 60,
      note: 'Perform back to back with no rest.',
      sets: [createSet(12, '12'), createSet(12, '12'), createSet(12, '12')]
    }
  ]
};

// Lower Body & Abs
const lowerAbs: WorkoutPlan = {
  id: 'lower-abs',
  name: 'Day 5: Lower Body & Core',
  description: 'Leg development details and core stability.',
  durationMinutes: 60,
  difficulty: 'Advanced',
  exercises: [
    {
      id: generateId(),
      name: 'Front Squat',
      muscleGroup: 'Legs',
      variation: 'Barbell',
      availableVariations: ['Barbell', 'Goblet Squat', 'Zombie Squat'],
      restSeconds: 120,
      note: 'Keep elbows high. Targets Quads.',
      sets: [createSet(8, '6-8'), createSet(8, '6-8'), createSet(8, '6-8')]
    },
    {
      id: generateId(),
      name: 'Bulgarian Split Squat',
      muscleGroup: 'Legs',
      variation: 'Dumbbell',
      availableVariations: ['Dumbbell', 'Barbell', 'Bodyweight', 'Smith Machine'],
      restSeconds: 90,
      note: 'The most painful exercise. Enjoy.',
      sets: [createSet(10, '8-10'), createSet(10, '8-10'), createSet(10, '8-10')]
    },
    {
      id: generateId(),
      name: 'Leg Curls',
      muscleGroup: 'Hamstrings',
      variation: 'Seated Machine',
      availableVariations: ['Seated Machine', 'Lying Machine', 'Nordic Hamstring Curl'],
      restSeconds: 60,
      sets: [createSet(15, '12-15'), createSet(15, '12-15'), createSet(15, '12-15')]
    },
    {
      id: generateId(),
      name: 'Hanging Leg Raises',
      muscleGroup: 'Core',
      variation: 'Bar',
      availableVariations: ['Bar', 'Captains Chair', 'Lying Leg Raises'],
      restSeconds: 60,
      note: 'Control the descent.',
      sets: [createSet(12, '10-15'), createSet(12, '10-15'), createSet(12, '10-15')]
    },
    {
      id: generateId(),
      name: 'Plank',
      muscleGroup: 'Core',
      variation: 'Standard',
      availableVariations: ['Standard', 'Weighted', 'Side Plank', 'Plank Jacks'],
      restSeconds: 45,
      note: 'Hold for time.',
      sets: [createSet(60, '60s'), createSet(60, '60s'), createSet(60, '60s')]
    }
  ]
};

export const PRESET_PLANS: WorkoutPlan[] = [pushDay, pullDay, legsDay, upperHypertrophy, lowerAbs];