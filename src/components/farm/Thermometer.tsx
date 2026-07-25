import { motion } from "framer-motion";

interface Props {
  temperature: number; // °C
  min?: number;
  max?: number;
}

export function Thermometer({ temperature, min = 0, max = 45 }: Props) {
  const pct = Math.max(0, Math.min(1, (temperature - min) / (max - min)));
  const color =
    temperature >= 32 ? "var(--critical)" : temperature >= 26 ? "var(--warning)" : "var(--water)";

  return (
    <div className="flex items-center gap-5">
      <div className="relative flex h-52 w-8 flex-col items-center">
        <div
          className="relative h-44 w-3 overflow-hidden rounded-full"
          style={{
            background: "rgba(29,43,34,0.06)",
            border: "1px solid rgba(29,43,34,0.08)",
          }}
        >
          <motion.div
            className="absolute inset-x-0 bottom-0"
            initial={{ height: 0 }}
            animate={{ height: `${pct * 100}%`, background: color }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <motion.div
          className="mt-[-6px] h-6 w-6 rounded-full"
          animate={{ background: color, boxShadow: `0 0 18px ${color}66` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-light-text">Canopy Temp</div>
        <div className="mt-1 font-mono text-4xl font-semibold text-dark-text">
          {temperature.toFixed(1)}
          <span className="ml-1 text-lg text-light-text">°C</span>
        </div>
        <div className="mt-2 text-xs text-light-text">
          Optimal band: 22–28°C
        </div>
      </div>
    </div>
  );
}
