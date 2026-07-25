import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface Props {
  score: number; // 0..100
  size?: number;
}

export function HealthRing({ score, size = 160 }: Props) {
  const value = useCountUp(score, 900, 0);
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    score >= 75 ? "var(--healthy)" : score >= 55 ? "var(--warning)" : "var(--critical)";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(29,43,34,0.08)" strokeWidth="10"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <Leaf className="mx-auto slow-spin" size={20} style={{ color }} />
          <div className="mt-1 font-mono text-3xl font-semibold text-dark-text">
            {value}
            <span className="ml-0.5 text-sm text-light-text">%</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-light-text">Health</div>
        </div>
      </div>
    </div>
  );
}
