// src/components/ui/PageLoader.jsx
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast start, slow finish — realistic loading feel
    const steps = [
      { target: 30, duration: 200 },
      { target: 60, duration: 400 },
      { target: 80, duration: 600 },
      { target: 95, duration: 800 },
    ];

    let current = 0;
    const timers = [];

    steps.forEach(({ target, duration }) => {
      const t = setTimeout(() => {
        setProgress(target);
      }, duration);
      timers.push(t);
      current = target;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-[#fef9f2]">

      {/* Logo mark */}
      

      {/* App title */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#3d0c02]">
          Hey Laban
        </h1>
        <p className="mt-1 text-sm text-[#54433f]">Confectionery POS</p>
      </div>

      {/* Spinner */}
      

      {/* Progress bar */}
      <div className="w-64">
        <div className="mb-2 flex justify-between text-xs font-semibold text-[#54433f]">
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ece7e1]">
          <div
            className="h-full rounded-full bg-[#E8A020] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  );
}