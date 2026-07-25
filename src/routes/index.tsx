import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { FIELDS } from "@/lib/farm-data";
import { useLenis } from "@/hooks/useLenis";
import { FarmGrid } from "@/components/farm/FarmGrid";
import { SoilMoistureTube } from "@/components/farm/SoilMoistureTube";
import { Thermometer } from "@/components/farm/Thermometer";
import { NPKTriangle } from "@/components/farm/NPKTriangle";
import { HealthRing } from "@/components/farm/HealthRing";
import { InsightsPanel } from "@/components/farm/InsightsPanel";
import { Timeline } from "@/components/farm/Timeline";
import { StatusBar } from "@/components/farm/StatusBar";
import { MetaStrip } from "@/components/farm/MetaStrip";
import {
  MoistureLine,
  TemperatureArea,
  WeeklyHealthBars,
  MonthlyMoisture,
  NPKRadar,
} from "@/components/farm/Charts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgroVision Analytics — Farm Health Intelligence" },
      {
        name: "description",
        content:
          "Live moisture, NPK and canopy intelligence across 12 farm plots with a scrubbable 24-hour timeline and AI agronomy insights.",
      },
      { property: "og:title", content: "AgroVision Analytics — Farm Health Intelligence" },
      {
        property: "og:description",
        content:
          "A precision agriculture operating system: farm grid, animated soil tube, NPK triangle, and smart insights.",
      },
    ],
  }),
  component: Dashboard,
});

const CHARTS = [
  { key: "moisture", label: "Moisture · 24h", accent: "var(--water)" },
  { key: "temperature", label: "Canopy Temp · 24h", accent: "var(--warning)" },
  { key: "weekly", label: "Weekly Health", accent: "var(--healthy)" },
  { key: "monthly", label: "Monthly Moisture", accent: "var(--forest)" },
  { key: "npk", label: "Soil Signature", accent: "var(--leaf)" },
] as const;

type ChartKey = (typeof CHARTS)[number]["key"];

function Dashboard() {
  useLenis();
  const criticalFields = useMemo(() => FIELDS.filter((f) => f.status === "critical"), []);
  const [selectedId, setSelectedId] = useState(
    (criticalFields[0] ?? FIELDS[0]).id,
  );
  const [hour, setHour] = useState(new Date().getHours());
  const [activeChart, setActiveChart] = useState<ChartKey>("moisture");

  const field = useMemo(
    () => FIELDS.find((f) => f.id === selectedId) ?? FIELDS[0],
    [selectedId],
  );

  const reading = field.hourly[hour] ?? field.hourly[0];
  const liveMoisture = reading.moisture;
  const liveTemperature = reading.temperature;

  const totalHealthy = FIELDS.filter((f) => f.status === "healthy").length;
  const totalWarning = FIELDS.filter((f) => f.status === "warning").length;
  const totalCritical = criticalFields.length;
  const overall = Math.round(FIELDS.reduce((a, f) => a + f.health, 0) / FIELDS.length);

  // Auto-alert: fire the toast for the top critical field within the first
  // 3 seconds so a farmer opening the app sees the problem hands-free.
  useEffect(() => {
    const c = criticalFields[0];
    if (!c) return;
    const t = setTimeout(() => {
      toast.error(`${c.name}: Immediate irrigation required`, {
        description: `Moisture ${c.moisture}% · Canopy ${c.temperature}°C · ${c.action ?? "Begin drip irrigation within 2 hours."}`,
        duration: 8000,
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [criticalFields]);

  return (
    <main className="bg-topo min-h-screen text-dark-text">
      {/* Ambient floating particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-leaf/30"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
              style={{ background: "linear-gradient(140deg, var(--forest), var(--leaf))" }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8 8 6 12 6 15a6 6 0 0 0 12 0c0-3-2-7-6-13Z" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg font-semibold sm:text-xl">AgroVision Analytics</div>
              <div className="truncate text-xs text-light-text">
                Farm Health Intelligence · 12 plots · 48 sensors
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="chip"><span className="blink h-1.5 w-1.5 rounded-full bg-healthy" />Live</span>
            <span className="chip font-mono">Season · Kharif '26</span>
          </div>
        </header>

        {/* Top status */}
        <StatusBar
          totalSensors={48}
          healthy={totalHealthy}
          critical={totalCritical}
          overallHealth={overall}
        />

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* LEFT — Farm visualization */}
          <section className="card-soft p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-light-text">Farm grid</div>
                <div className="font-display text-base font-semibold">12 plot overview</div>
              </div>
              <div className="flex gap-2 text-[10px] uppercase tracking-widest">
                <span className="inline-flex items-center gap-1 text-healthy"><span className="h-2 w-2 rounded-full bg-healthy" />Healthy</span>
                <span className="inline-flex items-center gap-1 text-warning"><span className="h-2 w-2 rounded-full bg-warning" />Watch</span>
                <span className="inline-flex items-center gap-1 text-critical"><span className="h-2 w-2 rounded-full bg-critical" />Critical</span>
              </div>
            </div>
            <FarmGrid fields={FIELDS} selectedId={selectedId} onSelect={setSelectedId} />
          </section>

          {/* CENTER — Analytics */}
          <section className="space-y-6">
            {/* Hero readings */}
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-soft p-6"
            >
              <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-widest text-light-text">
                    {field.id} · {field.crop} · {field.area} ha
                  </div>
                  <div className="truncate font-display text-2xl font-semibold sm:text-3xl">
                    {field.name}
                  </div>
                  <div className="mt-1 text-xs text-light-text">
                    {field.lat.toFixed(3)}°N · {field.lng.toFixed(3)}°E
                  </div>
                </div>
                <HealthRing score={field.health} size={130} />
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <SoilMoistureTube moisture={liveMoisture} />
                <Thermometer temperature={liveTemperature} />
              </div>

              <div className="mt-8 border-t border-border/60 pt-6">
                <div className="mb-2 text-[11px] uppercase tracking-widest text-light-text">
                  Soil nutrient signature
                </div>
                <NPKTriangle n={field.nitrogen} p={field.phosphorus} k={field.potassium} />
              </div>
            </motion.div>

            {/* Chart switcher */}
            <div className="card-soft p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {CHARTS.map((c) => {
                  const active = c.key === activeChart;
                  return (
                    <button
                      key={c.key}
                      onClick={() => setActiveChart(c.key)}
                      className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background: active ? c.accent : "transparent",
                        color: active ? "white" : "var(--light-text)",
                        border: `1px solid ${active ? c.accent : "rgba(29,43,34,0.08)"}`,
                      }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
              <motion.div
                key={`${field.id}-${activeChart}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                {activeChart === "moisture" && <MoistureLine field={field} />}
                {activeChart === "temperature" && <TemperatureArea field={field} />}
                {activeChart === "weekly" && <WeeklyHealthBars field={field} />}
                {activeChart === "monthly" && <MonthlyMoisture field={field} />}
                {activeChart === "npk" && <NPKRadar field={field} />}
              </motion.div>
            </div>
          </section>

          {/* RIGHT — Insights */}
          <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
            <InsightsPanel field={field} hour={hour} />
          </aside>
        </div>

        {/* Meta strip */}
        <div className="mt-6">
          <MetaStrip field={field} hour={hour} />
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <Timeline hour={hour} onChange={setHour} />
        </div>

        <footer className="mt-10 text-center text-[11px] text-light-text">
          AgroVision Analytics · Illustrative agronomic data inspired by public FAO / USDA / ICAR reference ranges.
        </footer>
      </div>
    </main>
  );
}
