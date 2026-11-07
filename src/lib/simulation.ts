export type FarmSize = "small" | "coop" | "large";
export type Soil = "sandy" | "loam" | "clay";
export type Crop = "tomato" | "olive" | "wheat";
export type Weather = "heat" | "season" | "rain";

export const FARMS: Record<
  FarmSize,
  { ha: number; nameFr: string; nameEn: string; placeFr: string; placeEn: string }
> = {
  small: {
    ha: 2,
    nameFr: "Exploitation familiale",
    nameEn: "Family holding",
    placeFr: "Haouz · 2 ha",
    placeEn: "Haouz · 2 ha",
  },
  coop: {
    ha: 20,
    nameFr: "Coopérative Saiss",
    nameEn: "Saiss cooperative",
    placeFr: "Meknès · 20 ha (exemple du pitch)",
    placeEn: "Meknès · 20 ha (pitch example)",
  },
  large: {
    ha: 80,
    nameFr: "Domaine agrumes",
    nameEn: "Citrus estate",
    placeFr: "Souss-Massa · 80 ha",
    placeEn: "Souss-Massa · 80 ha",
  },
};

/** Traditional calendar irrigation, m³/ha/day — order of magnitude, not a promise. */
const TRAD_M3_HA: Record<Crop, number> = {
  tomato: 55,
  olive: 22,
  wheat: 35,
};

const SOIL_HOLD: Record<Soil, number> = {
  sandy: 0.72,
  loam: 1,
  clay: 1.18,
};

const WEATHER: Record<Weather, { et: number; rainMm: number; labelFr: string; labelEn: string }> = {
  heat: { et: 1.28, rainMm: 0, labelFr: "Canicule sèche", labelEn: "Dry heatwave" },
  season: { et: 1, rainMm: 1.5, labelEn: "Seasonal Saiss spring", labelFr: "Printemps Saiss de saison" },
  rain: { et: 0.55, rainMm: 12, labelFr: "Passage pluvieux", labelEn: "Rain event" },
};

export const CROP_LABEL: Record<Crop, { fr: string; en: string }> = {
  tomato: { fr: "Tomate", en: "Tomato" },
  olive: { fr: "Olivier", en: "Olive" },
  wheat: { fr: "Blé irrigué", en: "Irrigated wheat" },
};

export const SOIL_LABEL: Record<Soil, { fr: string; en: string }> = {
  sandy: { fr: "Sableux", en: "Sandy" },
  loam: { fr: "Limon", en: "Loam" },
  clay: { fr: "Argile", en: "Clay" },
};

export type ZoneState = "dry" | "ok" | "wet";

export type Telemetry = {
  t: number;
  farm: FarmSize;
  ha: number;
  soil: Soil;
  crop: Crop;
  weather: Weather;
  traditionalM3: number;
  robofarmM3: number;
  savingsPct: number;
  literatureNote: boolean;
  moistureAvg: number;
  tankPct: number;
  valveOpen: boolean;
  pumpOn: boolean;
  rainMm: number;
  airC: number;
  rh: number;
  flowLpm: number;
  lat: number;
  lon: number;
  heading: number;
  pathIndex: number;
  zones: ZoneState[];
  robot: { r: number; c: number };
  cols: number;
  rows: number;
};

function grid(size: FarmSize): { cols: number; rows: number } {
  if (size === "small") return { cols: 4, rows: 3 };
  if (size === "coop") return { cols: 6, rows: 4 };
  return { cols: 8, rows: 5 };
}

export function serpentine(cols: number, rows: number): { r: number; c: number }[] {
  const path: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < cols; c++) path.push({ r, c });
    } else {
      for (let c = cols - 1; c >= 0; c--) path.push({ r, c });
    }
  }
  return path;
}

export function computeTelemetry(opts: {
  farm: FarmSize;
  soil: Soil;
  crop: Crop;
  weather: Weather;
  tick: number;
}): Telemetry {
  const { farm, soil, crop, weather, tick } = opts;
  const ha = FARMS[farm].ha;
  const { cols, rows } = grid(farm);
  const path = serpentine(cols, rows);
  const pathIndex = tick % path.length;
  const robot = path[pathIndex];
  const w = WEATHER[weather];

  const traditionalM3 = TRAD_M3_HA[crop] * ha * w.et;
  const skipRain = weather === "rain" ? 0.45 : 1;
  const zoneEfficiency = 0.78 + (soil === "sandy" ? 0.04 : 0) - (soil === "clay" ? 0.03 : 0);
  const robofarmM3 = traditionalM3 * zoneEfficiency * skipRain * SOIL_HOLD[soil];
  const savingsPct = ((traditionalM3 - robofarmM3) / traditionalM3) * 100;

  const n = cols * rows;
  const zones: ZoneState[] = Array.from({ length: n }, (_, i) => {
    const wave = Math.sin((i + tick * 0.35) / 2.2);
    const rainBias = weather === "rain" ? 0.35 : weather === "heat" ? -0.25 : 0;
    const v = wave + rainBias + (soil === "sandy" ? -0.1 : 0.05);
    if (v < -0.35) return "dry";
    if (v > 0.45) return "wet";
    return "ok";
  });

  const moistureAvg =
    zones.reduce((s, z) => s + (z === "wet" ? 78 : z === "ok" ? 52 : 28), 0) / n;

  const valveOpen = zones[robot.r * cols + robot.c] === "dry" && weather !== "rain";
  const pumpOn = valveOpen;
  const tankPct = Math.max(18, 92 - (tick % 40) * (pumpOn ? 1.4 : 0.15));

  return {
    t: Date.now(),
    farm,
    ha,
    soil,
    crop,
    weather,
    traditionalM3,
    robofarmM3,
    savingsPct,
    literatureNote: true,
    moistureAvg,
    tankPct,
    valveOpen,
    pumpOn,
    rainMm: w.rainMm,
    airC: weather === "heat" ? 38 : weather === "rain" ? 18 : 26,
    rh: weather === "rain" ? 78 : weather === "heat" ? 22 : 48,
    flowLpm: pumpOn ? 8.4 + (tick % 5) * 0.3 : 0,
    lat: 33.89 + robot.r * 0.0008,
    lon: -5.55 + robot.c * 0.0008,
    heading: robot.c >= cols - 1 ? 180 : robot.c <= 0 ? 0 : tick % 2 === 0 ? 90 : 270,
    pathIndex,
    zones,
    robot,
    cols,
    rows,
  };
}

export { WEATHER };
