"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/lib/locale";
import { formatNum } from "@/lib/money";
import {
  CROP_LABEL,
  FARMS,
  SOIL_LABEL,
  WEATHER,
  type Crop,
  type FarmSize,
  type Soil,
  type Telemetry,
  type Weather,
  type ZoneState,
} from "@/lib/simulation";

const ZONE_FILL: Record<ZoneState, string> = {
  dry: "#c45c26",
  ok: "#6b8f3d",
  wet: "#2a6f8f",
};

export function FarmSim() {
  const { t, locale } = useLocale();
  const [farm, setFarm] = useState<FarmSize>("coop");
  const [soil, setSoil] = useState<Soil>("loam");
  const [crop, setCrop] = useState<Crop>("tomato");
  const [weather, setWeather] = useState<Weather>("season");
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [fail, setFail] = useState(false);
  const [status, setStatus] = useState<"empty" | "loading" | "live" | "error">("empty");
  const [data, setData] = useState<Telemetry | null>(null);

  const load = useCallback(
    async (nextTick: number) => {
      setStatus((s) => (s === "empty" ? "loading" : s));
      try {
        const q = new URLSearchParams({
          farm,
          soil,
          crop,
          weather,
          tick: String(nextTick),
          fail: fail ? "1" : "0",
        });
        const res = await fetch(`/api/telemetry?${q}`, { cache: "no-store" });
        if (!res.ok) throw new Error("radio");
        const json = (await res.json()) as Telemetry;
        setData(json);
        setStatus("live");
      } catch {
        setStatus("error");
      }
    },
    [farm, soil, crop, weather, fail],
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTick((n) => {
        const next = n + 1;
        void load(next);
        return next;
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [running, load]);

  useEffect(() => {
    if (running) void load(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm, soil, crop, weather, fail]);

  const cell = 28;
  const pad = 8;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{t.sample}</Badge>
        <Badge variant="outline">{t.live}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.simTitle}</CardTitle>
          <CardDescription>{t.simLead}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t.farmSize}>
            {(Object.keys(FARMS) as FarmSize[]).map((k) => (
              <Chip key={k} active={farm === k} onClick={() => setFarm(k)}>
                {locale === "fr" ? FARMS[k].nameFr : FARMS[k].nameEn} · {FARMS[k].ha} ha
              </Chip>
            ))}
          </Field>
          <Field label={t.soil}>
            {(Object.keys(SOIL_LABEL) as Soil[]).map((k) => (
              <Chip key={k} active={soil === k} onClick={() => setSoil(k)}>
                {SOIL_LABEL[k][locale]}
              </Chip>
            ))}
          </Field>
          <Field label={t.crop}>
            {(Object.keys(CROP_LABEL) as Crop[]).map((k) => (
              <Chip key={k} active={crop === k} onClick={() => setCrop(k)}>
                {CROP_LABEL[k][locale]}
              </Chip>
            ))}
          </Field>
          <Field label={t.weather}>
            {(Object.keys(WEATHER) as Weather[]).map((k) => (
              <Chip key={k} active={weather === k} onClick={() => setWeather(k)}>
                {locale === "fr" ? WEATHER[k].labelFr : WEATHER[k].labelEn}
              </Chip>
            ))}
          </Field>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => { setRunning(true); void load(tick); }} disabled={running && status === "live"}>
          {t.start}
        </Button>
        <Button variant="secondary" onClick={() => setRunning(false)}>
          {t.stop}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setRunning(false);
            setTick(0);
            setData(null);
            setFail(false);
            setStatus("empty");
          }}
        >
          {t.reset}
        </Button>
        <Button
          variant={fail ? "default" : "destructive"}
          onClick={() => setFail((v) => !v)}
        >
          {fail ? t.reconnect : t.disconnect}
        </Button>
      </div>

      {status === "empty" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>{t.emptyTitle}</CardTitle>
            <CardDescription>{t.emptyBody}</CardDescription>
          </CardHeader>
        </Card>
      )}
      {status === "loading" && (
        <Card>
          <CardHeader>
            <CardTitle>{t.loading}</CardTitle>
            <Progress value={35} className="w-full" />
          </CardHeader>
        </Card>
      )}
      {status === "error" && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>{t.errorTitle}</CardTitle>
            <CardDescription>{t.errorBody}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {data && status === "live" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>{t.path}</CardTitle>
              <CardDescription>
                {locale === "fr" ? FARMS[farm].placeFr : FARMS[farm].placeEn} · MQTT mock 1,4 s
              </CardDescription>
            </CardHeader>
            <CardContent>
              <svg
                viewBox={`0 0 ${data.cols * cell + pad * 2} ${data.rows * cell + pad * 2}`}
                className="h-auto w-full max-w-full"
                role="img"
                aria-label={t.path}
              >
                <rect
                  x={0}
                  y={0}
                  width={data.cols * cell + pad * 2}
                  height={data.rows * cell + pad * 2}
                  fill="#e7efe0"
                  rx={8}
                />
                {data.zones.map((z, i) => {
                  const r = Math.floor(i / data.cols);
                  const c = i % data.cols;
                  return (
                    <rect
                      key={i}
                      x={pad + c * cell + 2}
                      y={pad + r * cell + 2}
                      width={cell - 4}
                      height={cell - 4}
                      rx={4}
                      fill={ZONE_FILL[z]}
                      opacity={0.88}
                    />
                  );
                })}
                {(() => {
                  const pts = [];
                  for (let r = 0; r < data.rows; r++) {
                    for (let c = 0; c < data.cols; c++) {
                      const cc = r % 2 === 0 ? c : data.cols - 1 - c;
                      pts.push(`${pad + cc * cell + cell / 2},${pad + r * cell + cell / 2}`);
                    }
                  }
                  return (
                    <polyline
                      fill="none"
                      stroke="#1f3d2b"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      points={pts.join(" ")}
                    />
                  );
                })()}
                <circle
                  cx={pad + data.robot.c * cell + cell / 2}
                  cy={pad + data.robot.r * cell + cell / 2}
                  r={7}
                  fill="#14261a"
                  stroke="#f4f1e8"
                  strokeWidth="2"
                />
              </svg>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <Legend color={ZONE_FILL.dry} label={t.legendDry} />
                <Legend color={ZONE_FILL.ok} label={t.legendOk} />
                <Legend color={ZONE_FILL.wet} label={t.legendWet} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.waterUsed}</CardTitle>
                <CardDescription>{t.savingsNote}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Row
                  k={t.traditional}
                  v={`${formatNum(data.traditionalM3, locale, 0)} m³`}
                />
                <Row k={t.robofarm} v={`${formatNum(data.robofarmM3, locale, 0)} m³`} />
                <Row k={t.savings} v={`${formatNum(data.savingsPct, locale, 0)} %`} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 pt-6">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{t.moisture}</span>
                    <span>{formatNum(data.moistureAvg, locale, 0)} %</span>
                  </div>
                  <Progress value={data.moistureAvg} />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{t.tank}</span>
                    <span>{formatNum(data.tankPct, locale, 0)} %</span>
                  </div>
                  <Progress value={data.tankPct} />
                </div>
                <Row k={t.valve} v={data.valveOpen ? t.open : t.closed} />
                <Row k={t.pump} v={data.pumpOn ? t.on : t.off} />
                <Row k="GPS" v={`${data.lat.toFixed(5)}, ${data.lon.toFixed(5)}`} />
                <Row k="IMU" v={`${data.heading}° · MPU-6050`} />
                <Row k={locale === "fr" ? "Débit" : "Flow"} v={`${formatNum(data.flowLpm, locale, 1)} L/min`} />
                <Row k={locale === "fr" ? "Air" : "Air"} v={`${data.airC} °C · HR ${data.rh} %`} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground"
          : "rounded-full bg-muted px-2.5 py-1 text-xs text-foreground hover:bg-muted/80"
      }
    >
      {children}
    </button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
