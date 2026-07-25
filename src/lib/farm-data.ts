// AgroVision — realistic agronomic mock data for 12 plots.
// Ranges inspired by common agronomy references (FAO / USDA / ICAR).
// These are illustrative values, not live measurements.

export type FieldStatus = "healthy" | "warning" | "critical";

export interface HourlyReading {
  hour: number; // 0..23
  moisture: number; // %
  temperature: number; // °C
  humidity: number; // %
}

export interface FieldData {
  id: string;
  name: string;
  crop: string;
  area: number; // hectares
  lat: number;
  lng: number;
  moisture: number; // %
  temperature: number; // °C
  humidity: number; // %
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  ph: number;
  ec: number; // dS/m
  rainfall24h: number; // mm
  health: number; // 0..100
  status: FieldStatus;
  irrigation: string;
  growthStage: string;
  sensorUptime: number; // %
  waterToday: number; // liters
  timestamp: string;
  problem?: string;
  cause?: string;
  action?: string;
  recovery?: string;
  hourly: HourlyReading[];
  weekly: { day: string; health: number; moisture: number }[];
  monthly: { week: string; moisture: number }[];
}

const CROPS = [
  "Rice",
  "Wheat",
  "Cotton",
  "Sugarcane",
  "Soybean",
  "Maize",
  "Groundnut",
  "Pearl Millet",
];

const STAGES = ["Germination", "Vegetative", "Flowering", "Fruiting", "Maturity"];

const FIELD_NAMES = [
  "North Ridge",
  "Willow Bend",
  "Sun Terrace",
  "Copper Row",
  "Amber Flats",
  "Cedar Hollow",
  "Mica Basin",
  "Pine Meadow",
  "Iron Plateau",
  "Silver Creek",
  "Golden Vale",
  "Ash Grove",
];

// Deterministic pseudo-random so re-renders are stable.
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function statusFrom(health: number, moisture: number): FieldStatus {
  if (health < 55 || moisture < 22) return "critical";
  if (health < 75 || moisture < 32) return "warning";
  return "healthy";
}

function buildHourly(rand: () => number, baseMoisture: number, baseTemp: number): HourlyReading[] {
  const arr: HourlyReading[] = [];
  for (let h = 0; h < 24; h++) {
    // Temperature: cooler at night, hotter mid-afternoon
    const diurnal = -Math.cos(((h - 4) / 24) * Math.PI * 2) * 6;
    const temp = baseTemp + diurnal + (rand() - 0.5) * 1.2;
    // Moisture: slowly drops during hot hours, recovers overnight
    const evap = Math.max(0, diurnal) * 0.35;
    const moisture = Math.max(8, baseMoisture - evap * (0.6 + rand() * 0.4) + (rand() - 0.5) * 1.4);
    const humidity = Math.min(96, Math.max(28, 70 - diurnal * 2 + (rand() - 0.5) * 6));
    arr.push({
      hour: h,
      moisture: +moisture.toFixed(1),
      temperature: +temp.toFixed(1),
      humidity: +humidity.toFixed(0),
    });
  }
  return arr;
}

function buildWeekly(rand: () => number, baseHealth: number, baseMoisture: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => ({
    day: d,
    health: Math.max(35, Math.min(98, baseHealth + (rand() - 0.5) * 14)),
    moisture: Math.max(15, Math.min(75, baseMoisture + (rand() - 0.5) * 12)),
  }));
}

function buildMonthly(rand: () => number, baseMoisture: number) {
  return ["W1", "W2", "W3", "W4"].map((w) => ({
    week: w,
    moisture: Math.max(18, Math.min(72, baseMoisture + (rand() - 0.5) * 18)),
  }));
}

export const FIELDS: FieldData[] = FIELD_NAMES.map((name, i) => {
  const rand = mulberry32(i * 977 + 31);
  const crop = CROPS[i % CROPS.length];
  const moisture = +(22 + rand() * 45).toFixed(1); // 22–67%
  const temperature = +(20 + rand() * 16).toFixed(1); // 20–36°C
  const humidity = +(45 + rand() * 40).toFixed(0);
  const nitrogen = +(60 + rand() * 130).toFixed(0); // 60–190 kg/ha
  const phosphorus = +(20 + rand() * 60).toFixed(0);
  const potassium = +(80 + rand() * 140).toFixed(0);
  const ph = +(5.8 + rand() * 2.2).toFixed(1);
  const ec = +(0.4 + rand() * 2.4).toFixed(2);
  const rainfall24h = +(rand() * 12).toFixed(1);
  const health = +Math.max(38, Math.min(97, 50 + rand() * 50)).toFixed(0);
  const status = statusFrom(health, moisture);
  return {
    id: `F${(i + 1).toString().padStart(2, "0")}`,
    name,
    crop,
    area: +(2 + rand() * 10).toFixed(1),
    lat: +(28.4 + rand() * 0.4).toFixed(4),
    lng: +(77.0 + rand() * 0.4).toFixed(4),
    moisture,
    temperature,
    humidity,
    nitrogen,
    phosphorus,
    potassium,
    ph,
    ec,
    rainfall24h,
    health,
    status,
    irrigation:
      moisture < 30 ? "Irrigate within 2h" : moisture < 40 ? "Monitor closely" : "No action needed",
    growthStage: STAGES[Math.floor(rand() * STAGES.length)],
    sensorUptime: +(96 + rand() * 4).toFixed(1),
    waterToday: Math.floor(400 + rand() * 2600),
    timestamp: new Date().toISOString(),
    hourly: buildHourly(rand, moisture, temperature),
    weekly: buildWeekly(rand, health, moisture),
    monthly: buildMonthly(rand, moisture),
  };
});

export const WEATHER = {
  condition: "Partly Cloudy",
  temperature: 28,
  humidity: 62,
  windKph: 12,
  windDir: "NE",
  rainProbability: 34, // %
  sunrise: "05:48",
  sunset: "18:42",
};

export function insightsFor(field: FieldData, hour: number): string[] {
  const drop =
    field.hourly[Math.max(0, hour - 8)]?.moisture !== undefined
      ? +(
          field.hourly[Math.max(0, hour - 8)].moisture -
          field.hourly[hour].moisture
        ).toFixed(1)
      : 0;
  const lines: string[] = [];
  lines.push(
    `${field.name} — moisture ${drop > 0 ? "dropped" : "rose"} by ${Math.abs(drop)}% in the last 8 hours.`,
  );
  if (field.temperature > 30)
    lines.push(`High canopy temperature (${field.temperature}°C) is accelerating evaporation.`);
  else lines.push(`Canopy temperature stable at ${field.temperature}°C.`);
  if (field.nitrogen > 90) lines.push(`Nitrogen reserves remain healthy at ${field.nitrogen} kg/ha.`);
  else lines.push(`Nitrogen is trending low (${field.nitrogen} kg/ha) — consider top-dressing.`);
  if (field.potassium < 120)
    lines.push(`Potassium deficiency detected — leaf pallor risk in 48h window.`);
  if (field.moisture < 30) lines.push(`Recommended action: begin drip irrigation within 2 hours.`);
  else if (field.moisture > 55)
    lines.push(`Soil saturation elevated — pause scheduled irrigation cycle.`);
  lines.push(
    `Expected recovery window: ${Math.max(6, 24 - Math.round(field.health / 6))} hours after action.`,
  );
  return lines;
}
