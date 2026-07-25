import { motion } from "framer-motion";

interface Props {
  moisture: number; // 0..100
}

export function SoilMoistureTube({ moisture }: Props) {
  const fill = Math.max(4, Math.min(96, moisture));
  return (
    <div className="flex items-center gap-5">
      <div
        className="relative h-52 w-16 overflow-hidden rounded-[18px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(220,201,164,0.35), rgba(123,90,60,0.35))",
          border: "1px solid rgba(29,43,34,0.08)",
          boxShadow: "inset 0 2px 8px rgba(29,43,34,0.12)",
        }}
      >
        {/* water fill */}
        <motion.div
          className="absolute inset-x-0 bottom-0 overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: `${fill}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "linear-gradient(180deg, rgba(79,163,217,0.85), rgba(40,89,67,0.85))",
          }}
        >
          {/* wave */}
          <svg
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            className="absolute -top-1 left-0 h-3 w-full"
          >
            <motion.path
              d="M0 10 Q 25 0 50 10 T 100 10 V20 H0 Z"
              fill="rgba(255,255,255,0.35)"
              animate={{ x: [-8, 8, -8] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
          {/* bubbles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-white/70"
              style={{ left: `${15 + i * 20}%` }}
              initial={{ bottom: "-10%", opacity: 0 }}
              animate={{ bottom: "110%", opacity: [0, 0.9, 0] }}
              transition={{
                duration: 3 + i * 0.6,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
        {/* roots overlay */}
        <svg
          viewBox="0 0 60 200"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        >
          <g stroke="rgba(29,43,34,0.35)" strokeWidth="1" fill="none">
            <path d="M30 0 V60 Q28 90 22 110 T18 170" />
            <path d="M30 30 Q40 55 38 80" />
            <path d="M30 45 Q22 70 26 95" />
            <path d="M22 110 Q18 130 24 150" />
            <path d="M38 80 Q46 110 42 140" />
          </g>
        </svg>
        {/* tick marks */}
        <div className="pointer-events-none absolute inset-y-0 right-1 flex flex-col justify-between py-1 text-[8px] font-mono text-light-text">
          <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-light-text">Soil Moisture</div>
        <div className="mt-1 font-mono text-4xl font-semibold text-dark-text">
          {moisture.toFixed(1)}
          <span className="ml-1 text-lg text-light-text">%</span>
        </div>
        <div className="mt-2 text-xs text-light-text">
          Field capacity band: 30–55%
        </div>
      </div>
    </div>
  );
}
