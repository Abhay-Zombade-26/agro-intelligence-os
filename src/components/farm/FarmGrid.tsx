import { motion } from "framer-motion";
import type { FieldData } from "@/lib/farm-data";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<FieldData["status"], string> = {
  healthy: "var(--healthy)",
  warning: "var(--warning)",
  critical: "var(--critical)",
};

const STATUS_LABEL: Record<FieldData["status"], string> = {
  healthy: "Healthy",
  warning: "Watch",
  critical: "Critical",
};

interface Props {
  fields: FieldData[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function FarmGrid({ fields, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
      {fields.map((f, i) => {
        const selected = f.id === selectedId;
        const color = STATUS_COLOR[f.status];
        const ring = (f.health / 100) * 100;
        return (
          <motion.button
            key={f.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(f.id)}
            aria-pressed={selected}
            className={cn(
              "group relative aspect-square text-left overflow-hidden",
              "rounded-[22px] p-3 sm:p-4 focus:outline-none",
              "transition-shadow",
            )}
            style={{
              background:
                "linear-gradient(140deg, rgba(255,255,255,0.95), rgba(247,248,243,0.9))",
              border: `1px solid ${selected ? color : "rgba(29,43,34,0.06)"}`,
              boxShadow: selected
                ? `0 10px 30px -12px ${color}80, 0 0 0 3px ${color}22`
                : "0 4px 14px -8px rgba(29,43,34,0.18)",
            }}
          >
            {/* status pulse */}
            <span
              className="absolute right-3 top-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider"
              style={{ color }}
            >
              <span
                className="blink inline-block h-2 w-2 rounded-full"
                style={{ background: color, boxShadow: `0 0 12px ${color}` }}
              />
              {STATUS_LABEL[f.status]}
            </span>

            <div className="mt-6">
              <div className="text-[11px] font-mono uppercase tracking-widest text-light-text">
                {f.id} · {f.crop}
              </div>
              <div className="mt-0.5 font-display text-base font-semibold text-dark-text sm:text-lg">
                {f.name}
              </div>
            </div>

            <div className="mt-auto flex items-end justify-between pt-4">
              <div className="space-y-0.5">
                <div className="font-mono text-lg font-semibold text-dark-text">
                  {f.moisture.toFixed(0)}
                  <span className="ml-0.5 text-xs text-light-text">%</span>
                </div>
                <div className="font-mono text-[11px] text-light-text">
                  {f.temperature.toFixed(1)}°C
                </div>
              </div>

              {/* health ring */}
              <div className="relative h-10 w-10">
                <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(29,43,34,0.08)" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke={color} strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${(ring / 100) * 94.25} 94.25`}
                    initial={{ strokeDasharray: "0 94.25" }}
                    animate={{ strokeDasharray: `${(ring / 100) * 94.25} 94.25` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center font-mono text-[10px] font-semibold text-dark-text">
                  {f.health}
                </div>
              </div>
            </div>

            {/* selected glow bar */}
            <motion.span
              layout
              className="absolute inset-x-3 bottom-1 h-0.5 rounded-full"
              style={{ background: color, opacity: selected ? 1 : 0 }}
              animate={{ opacity: selected ? 1 : 0 }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
