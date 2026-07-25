import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, AlertTriangle, Droplets, ArrowRight } from "lucide-react";
import type { FieldData } from "@/lib/farm-data";
import { insightsFor } from "@/lib/farm-data";

interface Props {
  field: FieldData;
  hour: number;
}

export function InsightsPanel({ field, hour }: Props) {
  const lines = insightsFor(field, hour);
  const severity =
    field.status === "critical" ? "var(--critical)" : field.status === "warning" ? "var(--warning)" : "var(--healthy)";

  return (
    <div className="card-soft flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ background: "linear-gradient(140deg, var(--forest), var(--leaf))" }}
          >
            <Sparkles className="text-white" size={16} />
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Smart Insights</div>
            <div className="text-[11px] text-light-text">Agronomy engine · v2.4</div>
          </div>
        </div>
        <span
          className="chip"
          style={{ color: severity, borderColor: `${severity}55` }}
        >
          <span className="blink h-1.5 w-1.5 rounded-full" style={{ background: severity }} />
          {field.status.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 rounded-2xl p-4"
        style={{ background: "linear-gradient(140deg, rgba(106,168,79,0.10), rgba(168,213,229,0.15))" }}>
        <div className="text-[11px] uppercase tracking-widest text-light-text">Focus field</div>
        <div className="mt-0.5 font-display text-lg font-semibold text-dark-text">{field.name}</div>
        <div className="text-xs text-light-text">
          {field.crop} · {field.area} ha · {field.growthStage}
        </div>
      </div>

      <div className="scroll-thin mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {lines.map((l, i) => (
            <motion.div
              key={`${field.id}-${i}-${l.slice(0, 8)}`}
              layout
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex gap-3 rounded-xl border border-border/60 bg-white/70 p-3 text-sm text-dark-text"
            >
              <div className="mt-0.5 shrink-0">
                {i === 0 ? (
                  <Droplets size={16} style={{ color: "var(--water)" }} />
                ) : l.toLowerCase().includes("deficiency") || l.toLowerCase().includes("low") ? (
                  <AlertTriangle size={16} style={{ color: "var(--warning)" }} />
                ) : (
                  <ArrowRight size={16} style={{ color: "var(--forest)" }} />
                )}
              </div>
              <p className="leading-relaxed">{l}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary/95 px-4 py-3 text-primary-foreground">
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-70">Recommended</div>
          <div className="font-display text-sm font-semibold">{field.irrigation}</div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
        >
          Schedule
        </motion.button>
      </div>
    </div>
  );
}
