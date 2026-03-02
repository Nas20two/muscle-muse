import React, { useState, useEffect } from 'react';
import { Timer, SkipForward } from 'lucide-react';

interface RestTimerProps {
  initialSeconds: number;
  onComplete: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ initialSeconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // FIX: Changed type from NodeJS.Timeout to any to avoid "Namespace 'global.NodeJS' has no exported member 'Timeout'" error in browser environments.
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const progress = ((initialSeconds - timeLeft) / initialSeconds) * 100;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-slate-700 p-4 shadow-xl z-50 animate-slide-up">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * progress) / 100}
                className="text-primary transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="text-sm font-bold">{timeLeft}s</span>
          </div>
          <div>
            <p className="text-sm text-slate-400">Resting...</p>
            <p className="font-semibold text-white">Next Set Ready In</p>
          </div>
        </div>
        <button
          onClick={onComplete}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
        >
          <SkipForward size={16} /> Skip
        </button>
      </div>
    </div>
  );
};

export default RestTimer;