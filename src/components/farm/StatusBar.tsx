import { motion } from "framer-motion";
import { Cloud, Droplets, Sun, Wind, Sunrise, Sunset } from "lucide-react";
import { WEATHER } from "@/lib/farm-data";
import { useEffect, useState } from "react";

interface Props {
  totalSensors: number;
  healthy: number;
  critical: number;
  overallHealth: number;
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Chip({
  color,
  label,
  value,
  icon,
  suffix,
}: {
  color: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-soft flex items-center gap-3 px-4 py-3"
    >
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-light-text">{label}</div>
        <div className="truncate font-mono text-sm font-semibold text-dark-text">
          {value}
          {suffix && <span className="ml-1 text-xs text-light-text">{suffix}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export function StatusBar({ totalSensors, healthy, critical, overallHealth }: Props) {
  const now = useNow();
  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";
  const date = now
    ? now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
    : "";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Chip
        color="var(--forest)"
        label={date || "Farm time"}
        value={time}
        icon={<Sun size={16} />}
      />
      <Chip
        color="var(--water)"
        label={WEATHER.condition}
        value={`${WEATHER.temperature}°C · ${WEATHER.humidity}%`}
        icon={<Cloud size={16} />}
      />
      <Chip
        color="var(--warning)"
        label="Wind"
        value={`${WEATHER.windKph} kph ${WEATHER.windDir}`}
        icon={<Wind size={16} />}
      />
      <Chip
        color="var(--healthy)"
        label="Overall Health"
        value={`${overallHealth}%`}
        icon={<Droplets size={16} />}
      />
      <Chip
        color="var(--leaf)"
        label="Active Sensors"
        value={`${totalSensors}`}
        suffix={`· ${healthy} healthy`}
        icon={<Sunrise size={16} />}
      />
      <Chip
        color="var(--critical)"
        label="Critical Fields"
        value={critical}
        icon={<Sunset size={16} />}
      />
    </div>
  );
}
