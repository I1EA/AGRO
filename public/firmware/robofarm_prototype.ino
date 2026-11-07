/**
 * RoboFarm Water Saver — prototype sketch outline (Arduino Nano ESP32).
 * Not a full production firmware: enough to flash, read sensors, drive a
 * relay, and publish a JSON payload over MQTT (or Serial if Wi-Fi is down).
 */
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <TinyGPSPlus.h>
#include <Wire.h>

#define DHTPIN 5
#define DHTTYPE DHT22
#define PIN_RAIN 6
#define PIN_LEVEL 7
#define PIN_FLOW 8
#define PIN_VALVE 9
#define PIN_PUMP 10

const char* WIFI_SSID = "YOUR_SSID";
const char* WIFI_PASS = "YOUR_PASS";
const char* MQTT_HOST = "mqtt.local";
const uint16_t MQTT_PORT = 1883;
const char* MQTT_TOPIC = "robofarm/telemetry";

DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;
WiFiClient net;
PubSubClient mqtt(net);
volatile unsigned long flowPulses = 0;
unsigned long lastPub = 0;

void IRAM_ATTR onFlow() { flowPulses++; }

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  unsigned long t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) delay(200);
}

void connectMqtt() {
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  if (WiFi.status() == WL_CONNECTED) mqtt.connect("robofarm-nano");
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RAIN, INPUT);
  pinMode(PIN_LEVEL, INPUT_PULLUP);
  pinMode(PIN_FLOW, INPUT_PULLUP);
  pinMode(PIN_VALVE, OUTPUT);
  pinMode(PIN_PUMP, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW), onFlow, RISING);
  Wire.begin();
  dht.begin();
  Serial1.begin(9600, SERIAL_8N1, /*rx*/0, /*tx*/1);
  connectWifi();
  connectMqtt();
}

void loop() {
  while (Serial1.available()) gps.encode(Serial1.read());
  if (millis() - lastPub < 2000) return;
  lastPub = millis();

  float t = dht.readTemperature();
  float h = dht.readHumidity();
  bool rain = digitalRead(PIN_RAIN) == LOW;
  bool tankOk = digitalRead(PIN_LEVEL) == LOW;
  // soil: replace with Qwiic read; analog fallback on ADC1
  int soilRaw = analogRead(1);
  float soilPct = map(soilRaw, 3200, 1200, 0, 100);
  soilPct = constrain(soilPct, 0, 100);

  bool irrigate = tankOk && !rain && soilPct < 35;
  digitalWrite(PIN_VALVE, irrigate ? HIGH : LOW);
  digitalWrite(PIN_PUMP, irrigate ? HIGH : LOW);

  char payload[384];
  snprintf(payload, sizeof(payload),
    "{\"soil\":%.1f,\"air_c\":%.1f,\"rh\":%.1f,\"rain\":%s,\"tank_ok\":%s,"
    "\"valve\":%s,\"flow_pulses\":%lu,\"lat\":%.6f,\"lon\":%.6f,\"imu\":\"mpu6050\"}",
    soilPct, t, h, rain ? "true" : "false", tankOk ? "true" : "false",
    irrigate ? "true" : "false", flowPulses,
    gps.location.isValid() ? gps.location.lat() : 0.0,
    gps.location.isValid() ? gps.location.lng() : 0.0);

  Serial.println(payload);
  if (mqtt.connected()) mqtt.publish(MQTT_TOPIC, payload);
  else { /* local buffer / sync later — rural fallback */ }
  mqtt.loop();
}
