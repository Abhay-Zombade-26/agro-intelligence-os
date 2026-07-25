import { motion } from "framer-motion";
import { CloudRain, Droplet, Gauge, Sprout, Sunrise, Sunset } from "lucide-react";
import { WEATHER, type FieldData } from "@/lib/farm-data";

// Where the sun is between sunrise and sunset right now.
function sunProgress(hour: number) {
  const [sh, sm] = WEATHER.sunrise.split(":").map(Number);
  const [eh, em] = WEATHER.sunset.split(":").map(Number);
  const start = sh + sm / 60;
  const end = eh + em / 60;
  return Math.max(0, Math.min(1, (hour - start) / (end - start)));
}

export function MetaStrip({ field, hour }: { field: FieldData; hour: number }) {
  const sp = sunProgress(hour);
  const x = 20 + sp * 260; // svg width band
  const y = 60 - Math.sin(sp * Math.PI) * 42;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {/* Sun arc */}
      <div className="card-soft p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-widest text-light-text">
          <span>Solar arc</span>
          <span className="font-mono">{Math.round(sp * 100)}%</span>
        </div>
        <svg viewBox="0 0 300 80" className="h-16 w-full">
          <path
            d="M 20 60 Q 150 -20 280 60"
            fill="none"
            stroke="rgba(216,163,26,0.35)"
            strokeWidth="2"
            strokeDasharray="4 5"
          />
          <motion.circle
            cx={x}
            cy={y}
            r="7"
            fill="var(--warning)"
            animate={{ cx: x, cy: y }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 10px rgba(216,163,26,0.6))" }}
          />
          <text x="20" y="76" className="fill-light-text text-[10px] font-mono">
            {WEATHER.sunrise}
          </text>
          <text x="280" y="76" textAnchor="end" className="fill-light-text text-[10px] font-mono">
            {WEATHER.sunset}
          </text>
        </svg>
        <div className="mt-1 flex items-center justify-between text-[11px] text-light-text">
          <span className="flex items-center gap-1">
            <Sunrise size={12} /> Sunrise
          </span>
          <span className="flex items-center gap-1">
            Sunset <Sunset size={12} />
          </span>
        </div>
      </div>

      {/* Rain probability */}
      <div className="card-soft relative overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-0">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-3 w-[2px] rounded-full"
              style={{ left: `${(i * 7) % 100}%`, background: "rgba(79,163,217,0.35)" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 120, opacity: [0, 0.7, 0] }}
              transition={{
                duration: 2 + (i % 4) * 0.5,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
        <div className="relative flex items-center justify-between text-[11px] uppercase tracking-widest text-light-text">
          <span>Rain probability</span>
          <CloudRain size={14} />
        </div>
        <div className="relative mt-2 font-mono text-3xl font-semibold text-dark-text">
          {WEATHER.rainProbability}%
        </div>
        <div className="relative mt-1 text-xs text-light-text">
          Last 24h: {field.rainfall24h} mm on {field.name}
        </div>
      </div>

      {/* Irrigation / water today */}
      <div className="card-soft p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-light-text">
          <span>Water dispensed today</span>
          <Droplet size={14} className="text-water" />
        </div>
        <div className="mt-2 font-mono text-3xl font-semibold text-dark-text">
          {field.waterToday.toLocaleString()}
          <span className="ml-1 text-sm text-light-text">L</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (field.waterToday / 3000) * 100)}%` }}
            transition={{ duration: 0.9 }}
            style={{ background: "linear-gradient(90deg, var(--water), var(--forest))" }}
          />
        </div>
        <div className="mt-2 text-xs text-light-text">Irrigation: {field.irrigation}</div>
      </div>

      {/* Sensor + growth */}
      <div className="card-soft p-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-light-text">
          <span>Sensor mesh</span>
          <Gauge size={14} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="font-mono text-3xl font-semibold text-dark-text">
            {field.sensorUptime.toFixed(1)}%
          </div>
          <div className="text-xs text-healthy">uptime</div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-light-text">
          <Sprout size={14} className="text-leaf" />
          Stage: <span className="text-dark-text">{field.growthStage}</span>
        </div>
        <div className="mt-1 text-xs text-light-text">
          pH {field.ph} · EC {field.ec} dS/m
        </div>
      </div>
    </div>
  );
}
