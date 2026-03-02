import React, { useState } from 'react';
import { Check, Info, Play, Loader2, Video as VideoIcon } from 'lucide-react';
import { Exercise, SetData } from '../types';
import { generateExerciseVideo } from '../services/geminiService';

interface ExerciseCardProps {
  exercise: Exercise;
  onSetUpdate: (exerciseId: string, setId: string, updates: Partial<SetData>) => void;
  onExerciseUpdate: (exerciseId: string, updates: Partial<Exercise>) => void;
  onSetComplete: (seconds: number) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSetUpdate, onExerciseUpdate, onSetComplete }) => {
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleGenerateVideo = async () => {
    if (generatingVideo || exercise.videoUrl) {
      if (exercise.videoUrl) setShowVideo(!showVideo);
      return;
    }

    setGeneratingVideo(true);
    try {
      const url = await generateExerciseVideo(exercise.name, exercise.variation || '');
      if (url) {
        onExerciseUpdate(exercise.id, { videoUrl: url });
        setShowVideo(true);
      }
    } catch (e) {
      console.error("Failed to generate video", e);
    } finally {
      setGeneratingVideo(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-4 mb-4 border border-slate-700/50 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {exercise.name}
              {exercise.note && (
                <div className="group relative">
                  <Info size={16} className="text-slate-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 bg-slate-900 text-xs text-slate-300 p-2 rounded border border-slate-700 z-10 shadow-xl">
                    {exercise.note}
                  </div>
                </div>
              )}
            </h3>
            
            <button 
              onClick={handleGenerateVideo}
              disabled={generatingVideo}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                exercise.videoUrl 
                  ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {generatingVideo ? (
                <Loader2 size={12} className="animate-spin" />
              ) : exercise.videoUrl ? (
                <> <Play size={12} /> Watch Demo</>
              ) : (
                <> <VideoIcon size={12} /> AI Demo</>
              )}
            </button>
          </div>

          <div className="mt-1 flex items-center gap-2">
             <span className="text-sm text-primary font-medium">{exercise.muscleGroup}</span>
             <span className="text-slate-600">•</span>
             {exercise.availableVariations && exercise.availableVariations.length > 1 ? (
               <select
                 value={exercise.variation}
                 onChange={(e) => onExerciseUpdate(exercise.id, { variation: e.target.value })}
                 className="bg-transparent text-sm text-slate-300 border-b border-slate-600 focus:border-primary outline-none py-0.5 cursor-pointer hover:text-white transition-colors"
               >
                 {exercise.availableVariations.map(v => (
                   <option key={v} value={v} className="bg-surface text-slate-200">{v}</option>
                 ))}
               </select>
             ) : (
               <span className="text-sm text-slate-400">{exercise.variation}</span>
             )}
          </div>
        </div>
      </div>

      {showVideo && exercise.videoUrl && (
        <div className="mb-4 rounded-lg overflow-hidden border border-slate-700 bg-black aspect-video relative">
          <video 
            src={exercise.videoUrl} 
            controls 
            autoPlay 
            loop 
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-10 gap-2 text-xs text-slate-500 uppercase font-semibold mb-1 px-1">
          <div className="col-span-1 text-center">Set</div>
          <div className="col-span-3 text-center">Goal</div>
          <div className="col-span-2 text-center">kg/lbs</div>
          <div className="col-span-2 text-center">Reps</div>
          <div className="col-span-2 text-center">Done</div>
        </div>
        {exercise.sets.map((set, index) => (
          <div key={set.id} className={`grid grid-cols-10 gap-2 items-center p-1 rounded ${set.completed ? 'bg-emerald-500/10' : ''}`}>
            <div className="col-span-1 text-center text-slate-400 font-mono">{index + 1}</div>
            <div className="col-span-3 text-center text-slate-500 text-xs">{set.targetReps} reps</div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="0"
                value={set.weight || ''}
                onChange={(e) => onSetUpdate(exercise.id, set.id, { weight: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded text-center text-white py-1 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="0"
                value={set.reps || ''}
                onChange={(e) => onSetUpdate(exercise.id, set.id, { reps: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded text-center text-white py-1 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="col-span-2 flex justify-center">
              <button
                onClick={() => {
                   const newState = !set.completed;
                   onSetUpdate(exercise.id, set.id, { completed: newState });
                   if (newState) onSetComplete(exercise.restSeconds);
                }}
                className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                  set.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-600 hover:bg-slate-700'
                }`}
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCard;