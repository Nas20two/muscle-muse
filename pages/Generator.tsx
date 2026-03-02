import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { generateWorkout } from '../services/geminiService';
import { WorkoutPlan } from '../types';

interface GeneratorProps {
  setGeneratedPlan: (plan: WorkoutPlan) => void;
}

const Generator: React.FC<GeneratorProps> = ({ setGeneratedPlan }) => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const plan = await generateWorkout(prompt);
      if (plan) {
        setGeneratedPlan(plan);
        navigate(`/workout/custom`);
      } else {
        setError('Failed to generate a valid plan. Please try again with more details.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "High intensity interval chest workout",
    "Bodyweight only legs and core",
    "Powerlifting deadlift focus day",
    "30 minute dumbbell arms blast"
  ];

  return (
    <div className="min-h-screen p-6 flex flex-col">
       <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white mb-6 w-fit">
          <ArrowLeft size={24} />
       </button>

       <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
         <div className="mb-8 text-center">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
             <Sparkles className="text-white" size={32} />
           </div>
           <h1 className="text-2xl font-bold text-white mb-2">AI Coach</h1>
           <p className="text-slate-400">Describe your goal, available equipment, and time constraints.</p>
         </div>

         <div className="space-y-4">
           <textarea
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder="e.g., 'I want a 45 min back workout using only dumbbells focusing on thickness.'"
             className="w-full h-32 bg-surface border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all"
           />

           {error && <p className="text-rose-500 text-sm text-center">{error}</p>}

           <button
             onClick={handleGenerate}
             disabled={loading || !prompt.trim()}
             className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
               loading
                 ? 'bg-slate-700 cursor-not-allowed'
                 : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-[0.99]'
             }`}
           >
             {loading ? <Loader2 className="animate-spin" /> : 'Generate Plan'}
           </button>
         </div>

         <div className="mt-12">
           <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-3 text-center">Try these</p>
           <div className="flex flex-wrap gap-2 justify-center">
             {suggestions.map(s => (
               <button
                 key={s}
                 onClick={() => setPrompt(s)}
                 className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-full border border-slate-700 transition-colors"
               >
                 {s}
               </button>
             ))}
           </div>
         </div>
       </div>
    </div>
  );
};

export default Generator;