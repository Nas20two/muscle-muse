import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActiveWorkout from './pages/ActiveWorkout';
import Generator from './pages/Generator';
import { WorkoutPlan } from './types';

const App: React.FC = () => {
  // Simple state management for the custom generated plan
  const [customPlan, setCustomPlan] = useState<WorkoutPlan | null>(null);

  return (
    <HashRouter>
      <div className="bg-background min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout/custom" element={<ActiveWorkout customPlan={customPlan} />} />
          <Route path="/workout/:planId" element={<ActiveWorkout />} />
          <Route path="/generator" element={<Generator setGeneratedPlan={setCustomPlan} />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;