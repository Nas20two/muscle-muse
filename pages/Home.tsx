import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Flame, Zap, BrainCircuit, ChevronRight } from 'lucide-react';
import { PRESET_PLANS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <header className="px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-1">IronFocus.</h1>
        <p className="text-slate-400">Distraction-free progressive overload.</p>
      </header>

      <section className="px-6 mb-8">
        <div
            onClick={() => navigate('/generator')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-indigo-500/20 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BrainCircuit size={20} /> AI Workout Generator
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                Custom routines tailored to your equipment and goals.
              </p>
            </div>
            <ChevronRight className="text-white opacity-50" />
          </div>
        </div>
      </section>

      <section className="px-6">
        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-4">5-Day Split Presets</h3>
        <div className="grid gap-4">
          {PRESET_PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => navigate(`/workout/${plan.id}`)}
              className="bg-surface rounded-xl p-5 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                  {plan.name}
                </h4>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  plan.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500' :
                  plan.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-rose-500/10 text-rose-500'
                }`}>
                  {plan.difficulty}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{plan.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1"><Dumbbell size={12} /> {plan.exercises.length} Exercises</span>
                <span className="flex items-center gap-1"><Flame size={12} /> {plan.durationMinutes} min</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;