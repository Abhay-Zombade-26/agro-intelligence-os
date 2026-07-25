import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Droplets, CalendarClock, Activity, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FieldData } from "@/lib/farm-data";

interface Props {
  field: FieldData;
  hour: number;
}

type Tone = {
  label: string;
  heading: string;
  color: string;
  Icon: typeof AlertTriangle;
  bg: string;
};

function toneFor(field: FieldData): Tone {
  if (field.status === "critical")
    return {
      label: "CRITICAL",
      heading: "🚨 Critical Action Required",
      color: "var(--critical)",
      Icon: AlertTriangle,
      bg: "linear-gradient(140deg, rgba(217,76,69,0.14), rgba(217,76,69,0.04))",
    };
  if (field.status === "warning")
    return {
      label: "WARNING",
      heading: "⚠️ Watch This Field",
      color: "var(--warning)",
      Icon: Activity,
      bg: "linear-gradient(140deg, rgba(216,163,26,0.14), rgba(216,163,26,0.04))",
    };
  return {
    label: "ALL CLEAR",
    heading: "✅ Field is Healthy",
    color: "var(--healthy)",
    Icon: CheckCircle2,
    bg: "linear-gradient(140deg, rgba(87,178,106,0.14), rgba(87,178,106,0.04))",
  };
}

function derive(field: FieldData, hour: number) {
  if (field.problem && field.cause && field.action && field.recovery) {
    return {
      problem: field.problem,
      cause: field.cause,
      action: field.action,
      recovery: field.recovery,
    };
  }
  const prev = field.hourly[Math.max(0, hour - 8)]?.moisture ?? field.moisture;
  const now = field.hourly[hour]?.moisture ?? field.moisture;
  const drop = +(prev - now).toFixed(1);
  if (field.status === "critical") {
    return {
      problem: `Soil moisture at ${field.moisture}% — below safe threshold.`,
      cause: `Canopy temperature (${field.temperature}°C) is accelerating water loss.`,
      action: "Begin drip irrigation within the next 2 hours.",
      recovery: "Recovery expected within 9 hours after action.",
    };
  }
  if (field.status === "warning") {
    return {
      problem: `Moisture ${drop > 0 ? "dropped" : "shifted"} ${Math.abs(drop)}% in the last 8 hours.`,
      cause: `Warm afternoon window with limited overnight recovery.`,
      action: "Schedule a light irrigation cycle before sunset.",
      recovery: "Field should stabilise within 12 hours.",
    };
  }
  return {
    problem: "No issues detected.",
    cause: `Moisture, temperature and health readings all within optimal band.`,
    action: "Maintain current irrigation schedule.",
    recovery: "Continue routine monitoring — no intervention needed.",
  };
}

export function InsightsPanel({ field, hour }: Props) {
  const tone = toneFor(field);
  const info = derive(field, hour);
  const [scheduled, setScheduled] = useState(false);
  const [irrigating, setIrrigating] = useState(false);

  const onIrrigate = () => {
    setIrrigating(true);
    toast.success(`Irrigation started · ${field.name}`, {
      description: `Drip cycle engaged. ${info.recovery}`,
    });
    setTimeout(() => setIrrigating(false), 2400);
  };
  const onSchedule = () => {
    setScheduled(true);
    toast(`Scheduled · ${field.name}`, {
      description: "Irrigation queued for the next off-peak window.",
    });
  };

  return (
    <div
      className="card-soft flex h-full flex-col overflow-hidden p-0"
      style={{ borderColor: `${tone.color}33` }}
    >
      {/* Heading strip */}
      <div className="relative p-5" style={{ background: tone.bg }}>
        <div className="flex items-center gap-2">
          <span
            className="chip"
            style={{ color: tone.color, borderColor: `${tone.color}55` }}
          >
            <span className="blink h-1.5 w-1.5 rounded-full" style={{ background: tone.color }} />
            {tone.label}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-light-text">
            {field.id} · {field.crop}
          </span>
        </div>
        <h2
          className="mt-3 font-display text-xl font-semibold leading-tight sm:text-2xl"
          style={{ color: tone.color }}
        >
          {tone.heading}
        </h2>
        <p className="mt-1 text-sm text-dark-text/80">
          {field.name} · {field.area} ha · {field.growthStage}
        </p>
      </div>

      {/* Problem → Cause → Action → Recovery */}
      <div className="scroll-thin flex-1 space-y-3 overflow-y-auto p-5">
        {[
          { label: "Problem", value: info.problem, Icon: AlertTriangle, color: tone.color },
          { label: "Cause", value: info.cause, Icon: Activity, color: "var(--warning)" },
          { label: "Action", value: info.action, Icon: Droplets, color: "var(--water)" },
          { label: "Recovery", value: info.recovery, Icon: Clock, color: "var(--forest)" },
        ].map((row, i) => (
          <motion.div
            key={`${field.id}-${row.label}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="flex gap-3 rounded-2xl border border-border/60 bg-white/80 p-3"
          >
            <div
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl"
              style={{ background: `${row.color}18`, color: row.color }}
            >
              <row.Icon size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-light-text">
                {row.label}
              </div>
              <div className="text-sm leading-snug text-dark-text">{row.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-2 border-t border-border/60 bg-white/60 p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onIrrigate}
          disabled={irrigating}
          className="relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-shadow"
          style={{
            background:
              field.status === "healthy"
                ? "linear-gradient(140deg, var(--forest), var(--leaf))"
                : `linear-gradient(140deg, ${tone.color}, ${tone.color}cc)`,
            boxShadow: `0 10px 24px -12px ${tone.color}88`,
          }}
        >
          <span className="inline-flex items-center gap-2">
            <Droplets size={16} />
            {irrigating ? "Irrigating…" : "Irrigate Now"}
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSchedule}
          className="rounded-2xl border border-border/60 bg-white px-3 py-3 text-sm font-medium text-dark-text hover:bg-surface"
        >
          <span className="inline-flex items-center gap-2">
            <CalendarClock size={16} />
            {scheduled ? "Scheduled" : "Schedule"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
