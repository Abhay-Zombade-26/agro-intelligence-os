import { motion } from "framer-motion";

interface Props {
  n: number; // kg/ha
  p: number;
  k: number;
}

// Maps a value to a 0..1 saturation (heuristic bands from agronomy references)
const NORM = { n: 200, p: 90, k: 220 };

export function NPKTriangle({ n, p, k }: Props) {
  const cx = 120;
  const cy = 115;
  const R = 96;

  // three vertex angles: top(N), bottom-right(P), bottom-left(K)
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  const values = [
    Math.min(1, n / NORM.n),
    Math.min(1, p / NORM.p),
    Math.min(1, k / NORM.k),
  ];

  const pts = angles.map((a, i) => {
    const r = 24 + values[i] * (R - 24);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });

  const outer = angles.map((a) => [cx + Math.cos(a) * R, cy + Math.sin(a) * R] as const);

  const path = `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]} Z`;
  const outerPath = `M ${outer[0][0]} ${outer[0][1]} L ${outer[1][0]} ${outer[1][1]} L ${outer[2][0]} ${outer[2][1]} Z`;

  const labels = [
    { key: "N", label: "Nitrogen", val: n, unit: "kg/ha", color: "var(--leaf)" },
    { key: "P", label: "Phosphorus", val: p, unit: "kg/ha", color: "var(--water)" },
    { key: "K", label: "Potassium", val: k, unit: "kg/ha", color: "var(--warning)" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <svg viewBox="0 0 240 230" className="h-56 w-56">
        <defs>
          <linearGradient id="npk-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--leaf)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--water)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--warning)" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path d={outerPath} fill="none" stroke="rgba(29,43,34,0.12)" strokeDasharray="3 4" />
        <circle cx={cx} cy={cy} r="24" fill="none" stroke="rgba(29,43,34,0.08)" />
        <motion.path
          d={path}
          fill="url(#npk-fill)"
          stroke="var(--forest)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, d: path }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* vertex labels */}
        {angles.map((a, i) => {
          const [lx, ly] = [cx + Math.cos(a) * (R + 18), cy + Math.sin(a) * (R + 18)];
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-dark-text font-display text-[13px] font-semibold"
            >
              {labels[i].key}
            </text>
          );
        })}
      </svg>

      <div className="flex flex-1 flex-col gap-2 text-sm">
        {labels.map((l) => (
          <div key={l.key} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-dark-text">{l.label}</span>
            </div>
            <span className="font-mono text-dark-text">
              {l.val}
              <span className="ml-1 text-xs text-light-text">{l.unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
