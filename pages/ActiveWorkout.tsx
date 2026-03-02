import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Save } from 'lucide-react';
import { WorkoutPlan, SetData, Exercise } from '../types';
import { PRESET_PLANS } from '../constants';
import ExerciseCard from '../components/ExerciseCard';
import RestTimer from '../components/RestTimer';

interface ActiveWorkoutProps {
  customPlan?: WorkoutPlan | null;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ customPlan }) => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [restTimer, setRestTimer] = useState<number | null>(null);

  useEffect(() => {
    if (customPlan) {
        setPlan(customPlan);
    } else {
        const found = PRESET_PLANS.find(p => p.id === planId);
        if (found) {
            // Deep copy to prevent mutating the constant directly during session
            setPlan(JSON.parse(JSON.stringify(found)));
        }
    }
  }, [planId, customPlan]);

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setElapsedTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleSetUpdate = (exerciseId: string, setId: string, updates: Partial<SetData>) => {
    if (!plan) return;
    const updatedExercises = plan.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
      };
    });
    setPlan({ ...plan, exercises: updatedExercises });
  };

  const handleExerciseUpdate = (exerciseId: string, updates: Partial<Exercise>) => {
    if (!plan) return;
    const updatedExercises = plan.exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return { ...ex, ...updates };
    });
    setPlan({ ...plan, exercises: updatedExercises });
  };

  const handleSetComplete = (restSeconds: number) => {
    setRestTimer(restSeconds);
  };

  const finishWorkout = () => {
    // In a real app, save to DB/Local Storage here
    alert("Workout finished! Good job.");
    navigate('/');
  };

  if (!plan) return <div className="p-8 text-white">Loading plan...</div>;

  return (
    <div className="min-h-screen pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur z-20 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-white font-bold text-sm">{plan.name}</h2>
          <span className="text-primary text-xs font-mono flex items-center gap-1">
             <Clock size={10} /> {elapsedTime}
          </span>
        </div>
        <button onClick={finishWorkout} className="text-emerald-500 hover:text-emerald-400 font-semibold text-sm">
          Finish
        </button>
      </div>

      <div className="p-4">
        {plan.exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSetUpdate={handleSetUpdate}
            onExerciseUpdate={handleExerciseUpdate}
            onSetComplete={handleSetComplete}
          />
        ))}
      </div>

      {restTimer !== null && (
        <RestTimer
            initialSeconds={restTimer}
            onComplete={() => setRestTimer(null)}
        />
      )}
    </div>
  );
};

export default ActiveWorkout;