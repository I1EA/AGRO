"use client";

import { ArchitectureSvg } from "@/components/diagrams";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/locale";

const PAYLOAD = `{
  "soil": 31.2,
  "air_c": 27.4,
  "rh": 46.0,
  "rain": false,
  "tank_ok": true,
  "valve": true,
  "flow_pulses": 1840,
  "lat": 33.89321,
  "lon": -5.54780,
  "imu": "mpu6050"
}`;

export default function LiaisonPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {fr ? "De l’ESP32 au tableau de bord" : "From the ESP32 to the dashboard"}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {fr
            ? "Le pitch vise GSM ou LoRa en zone rurale. Le prototype web parle Wi-Fi + MQTT, avec un repli BLE/LoRa et un tampon local. Ici, Next.js simule le backend (pas de base, pas d’auth)."
            : "The pitch targets GSM or LoRa in the countryside. This web prototype speaks Wi-Fi + MQTT, with a BLE/LoRa fallback and a local buffer. Next.js mocks the backend (no database, no auth)."}
        </p>
      </div>

      <ArchitectureSvg />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{fr ? "Protocole" : "Protocol"}</CardTitle>
            <CardDescription>MQTT 3.1.1 · QoS 1 · JSON UTF-8</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Broker</span> mqtt.local:1883 (TLS 8883 on the working product)
            </p>
            <p>
              <span className="text-muted-foreground">Publish</span> robofarm/telemetry
            </p>
            <p>
              <span className="text-muted-foreground">Subscribe</span> robofarm/cmd/{`{deviceId}`}
            </p>
            <p>
              {fr
                ? "Push MQTT toutes les 2 s quand le Wi-Fi tient. Le dashboard, lui, interroge GET /api/telemetry toutes les 1,4 s (sondage) pour rester copiable sans broker. En panne radio : code 503, le robot garde la file."
                : "MQTT push every 2 s while Wi-Fi holds. The dashboard polls GET /api/telemetry every 1.4 s so the e-prototype stays copiable without a broker. On radio loss: HTTP 503, the robot keeps a queue."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{fr ? "Exemple de charge utile" : "Payload example"}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{PAYLOAD}</pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{fr ? "Sondage vs poussée" : "Polling vs push"}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          {fr ? (
            <ul className="list-disc space-y-1 pl-5">
              <li>Poussée (MQTT) : le rover publie dès qu’une mesure est prête — bon pour la vanne et les alertes citerne.</li>
              <li>Sondage (cette démo) : le navigateur tire un JSON mock, assez pour un jury sans infrastructure.</li>
              <li>Hybride terrain : LoRa uplink des agrégats (10 min) + Wi-Fi burst au hangar.</li>
            </ul>
          ) : (
            <ul className="list-disc space-y-1 pl-5">
              <li>Push (MQTT): the rover publishes as soon as a sample is ready — right for the valve and tank alarms.</li>
              <li>Poll (this demo): the browser pulls a mock JSON, enough for a jury without infra.</li>
              <li>Field hybrid: LoRa uplink of aggregates (10 min) plus a Wi-Fi burst back at the shed.</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
