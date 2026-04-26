"use client";

import { getScoreColor, getScoreLabel } from "@/lib/ats-scoring";
import type { ATSScoreResult } from "@/types/ai";

interface ATSScoreRingProps {
  result: ATSScoreResult;
}

export function ATSScoreRing({ result }: ATSScoreRingProps) {
  const { total, layers } = result;
  const color = getScoreColor(total);
  const label = getScoreLabel(total);

  const R = 42;
  const circumference = 2 * Math.PI * R;
  const progress = (total / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Daire */}
      <div className="relative flex items-center justify-center">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={R} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="55"
            cy="55"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            transform="rotate(-90 55 55)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold" style={{ color }}>{total}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>

      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {label}
      </span>

      {/* Katman çubukları */}
      <div className="w-full space-y-2">
        {Object.values(layers).map((layer) => {
          const pct = Math.round((layer.score / layer.maxScore) * 100);
          return (
            <div key={layer.label}>
              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                <span>{layer.label}</span>
                <span className="font-medium">{layer.score}/{layer.maxScore}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: layer.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
