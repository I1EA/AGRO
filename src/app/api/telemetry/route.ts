import { computeTelemetry, type Crop, type FarmSize, type Soil, type Weather } from "@/lib/simulation";

function asFarm(v: string | null): FarmSize {
  if (v === "small" || v === "coop" || v === "large") return v;
  return "coop";
}
function asSoil(v: string | null): Soil {
  if (v === "sandy" || v === "loam" || v === "clay") return v;
  return "loam";
}
function asCrop(v: string | null): Crop {
  if (v === "tomato" || v === "olive" || v === "wheat") return v;
  return "tomato";
}
function asWeather(v: string | null): Weather {
  if (v === "heat" || v === "season" || v === "rain") return v;
  return "season";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fail = url.searchParams.get("fail") === "1";
  if (fail) {
    return Response.json(
      { error: "radio_timeout", message: "ESP32 unreachable — store-and-forward" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  const tick = Number(url.searchParams.get("tick") ?? "0") || 0;
  const body = computeTelemetry({
    farm: asFarm(url.searchParams.get("farm")),
    soil: asSoil(url.searchParams.get("soil")),
    crop: asCrop(url.searchParams.get("crop")),
    weather: asWeather(url.searchParams.get("weather")),
    tick,
  });
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
