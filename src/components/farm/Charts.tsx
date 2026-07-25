import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { FieldData } from "@/lib/farm-data";

const AXIS = { stroke: "rgba(29,43,34,0.15)", fontSize: 11, fill: "#6d756f" };
const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid rgba(29,43,34,0.08)",
    background: "#ffffff",
    fontSize: 12,
    boxShadow: "0 10px 24px -12px rgba(29,43,34,0.25)",
  },
  labelStyle: { color: "#6d756f", fontSize: 11 },
};

export function MoistureLine({ field }: { field: FieldData }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={field.hourly}>
        <CartesianGrid stroke="rgba(29,43,34,0.06)" vertical={false} />
        <XAxis dataKey="hour" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} domain={[0, 80]} />
        <Tooltip {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey="moisture"
          stroke="var(--water)"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TemperatureArea({ field }: { field: FieldData }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={field.hourly}>
        <defs>
          <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--warning)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--warning)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(29,43,34,0.06)" vertical={false} />
        <XAxis dataKey="hour" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} domain={[10, 40]} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="var(--warning)"
          fill="url(#tempFill)"
          strokeWidth={2.5}
          isAnimationActive
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WeeklyHealthBars({ field }: { field: FieldData }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={field.weekly}>
        <CartesianGrid stroke="rgba(29,43,34,0.06)" vertical={false} />
        <XAxis dataKey="day" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} domain={[0, 100]} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="health" fill="var(--healthy)" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyMoisture({ field }: { field: FieldData }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={field.monthly}>
        <defs>
          <linearGradient id="moFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--forest)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--forest)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(29,43,34,0.06)" vertical={false} />
        <XAxis dataKey="week" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} domain={[0, 80]} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="moisture"
          stroke="var(--forest)"
          strokeWidth={2.5}
          fill="url(#moFill)"
          isAnimationActive
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function NPKRadar({ field }: { field: FieldData }) {
  const data = [
    { k: "N", v: Math.min(100, (field.nitrogen / 200) * 100) },
    { k: "P", v: Math.min(100, (field.phosphorus / 90) * 100) },
    { k: "K", v: Math.min(100, (field.potassium / 220) * 100) },
    { k: "pH", v: Math.min(100, (field.ph / 9) * 100) },
    { k: "EC", v: Math.min(100, (field.ec / 3) * 100) },
  ];
  return (
    <ResponsiveContainer width="100%" height={180}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(29,43,34,0.1)" />
        <PolarAngleAxis dataKey="k" tick={AXIS} />
        <Radar
          dataKey="v"
          stroke="var(--forest)"
          fill="var(--leaf)"
          fillOpacity={0.35}
          isAnimationActive
          animationDuration={800}
        />
        <Tooltip {...tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
