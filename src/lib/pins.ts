export const PINS = [
  { pin: "D2 / GPIO5", signal: "DHT22 DATA", note: "4.7 kΩ pull-up to 3V3" },
  { pin: "D3 / GPIO6", signal: "RAIN DO", note: "Optional digital rain module" },
  { pin: "D4 / GPIO7", signal: "LEVEL FLOAT", note: "INPUT_PULLUP, closed = water present" },
  { pin: "D5 / GPIO8", signal: "FLOW YF-S201", note: "Interrupt / pulse count" },
  { pin: "D6 / GPIO9", signal: "RELAY VALVE", note: "Active HIGH → IN1 of relay" },
  { pin: "D7 / GPIO10", signal: "RELAY PUMP", note: "Active HIGH → IN2 of relay" },
  { pin: "A0 / GPIO1", signal: "SOIL 1 analog (if not Qwiic)", note: "ADC1 only while Wi-Fi is on" },
  { pin: "A1 / GPIO2", signal: "SOIL 2 analog", note: "ADC1" },
  { pin: "A4 / SDA", signal: "I²C SDA", note: "MPU-6050 + Qwiic soil 0x37 / 0x68" },
  { pin: "A5 / SCL", signal: "I²C SCL", note: "4.7 kΩ pull-ups if the module has none" },
  { pin: "D0/RX / D1/TX", signal: "GPS UART", note: "NEO-6M TX → D0 RX, 9600 8N1; 3.3 V logic" },
  { pin: "VIN / USB-C", signal: "5 V from PowerBoost or USB", note: "Do not feed 12 V into VIN of the Nano ESP32 beyond spec" },
  { pin: "GND", signal: "Common ground", note: "Star GND between 5 V logic and 12 V power GND" },
] as const;

export const FLASH_STEPS_FR = [
  "Installer Arduino IDE 2.x, puis le paquet « Arduino ESP32 Boards » (Nano ESP32).",
  "Carte : Arduino Nano ESP32. Port : le USB-C qui apparaît à la connexion.",
  "Installer les bibliothèques : DHT sensor library (Adafruit), Adafruit Unified Sensor, TinyGPSPlus, MPU6050_light (ou SparkFun MPU6050), WiFi, PubSubClient.",
  "Ouvrir public/firmware/robofarm_prototype.ino, renseigner WIFI_SSID, WIFI_PASS, MQTT_HOST.",
  "Compiler puis Téléverser. Ouvrir le moniteur série à 115200 bauds.",
];

export const FLASH_STEPS_EN = [
  "Install Arduino IDE 2.x, then the “Arduino ESP32 Boards” package (Nano ESP32).",
  "Board: Arduino Nano ESP32. Port: the USB-C device that appears on plug-in.",
  "Libraries: Adafruit DHT, Adafruit Unified Sensor, TinyGPSPlus, MPU6050_light (or SparkFun), WiFi, PubSubClient.",
  "Open public/firmware/robofarm_prototype.ino and set WIFI_SSID, WIFI_PASS, MQTT_HOST.",
  "Build and Upload. Open the serial monitor at 115200 baud.",
];

export const TEST_STEPS_FR = [
  { name: "Alim 5 V", how: "LED d’alimentation du Nano allumée. Tension 5,0–5,2 V sur le rail breadboard." },
  { name: "DHT22", how: "Série : température plausible (18–40 °C) et HR. Si nan : pull-up ou polarité." },
  { name: "Sol capacitif", how: "Air libre = sec. Dans un verre d’eau (sans noyer l’électronique) = humide. Caler deux seuils." },
  { name: "YF-S201", how: "Souffler dans le compteur : des impulsions. ~450 impulsions/L à calibrer au seau." },
  { name: "Niveau", how: "Flotteur levé = « tank_ok true ». Baissé = pompe interdite." },
  { name: "Pluie", how: "Goutte d’eau sur la plaque : DO passe. Sécher : irrigation autorisée." },
  { name: "MPU-6050", how: "Inclinaison du rover : ax/ay bougent. Adresse I²C 0x68 au scan." },
  { name: "NEO-6M", how: "Ciel ouvert, LED PPS clignote, trames $GNGGA. Dedans : timeout GPS, c’est normal." },
  { name: "Vanne 12 V", how: "Relais claque, vanne s’ouvre. GPIO seul ne doit rien alimenter. Diode de roue libre en parallèle." },
  { name: "MQTT", how: "topic robofarm/telemetry reçoit le JSON toutes les 2 s. Si échec Wi-Fi : file locale (buffer)." },
];

export const TEST_STEPS_EN = [
  { name: "5 V rail", how: "Nano power LED on. 5.0–5.2 V on the breadboard rail." },
  { name: "DHT22", how: "Serial shows a plausible temperature (18–40 °C) and RH. NaN → pull-up or polarity." },
  { name: "Capacitive soil", how: "Open air = dry. Glass of water (electronics dry) = wet. Record two thresholds." },
  { name: "YF-S201", how: "Blow through the meter: pulses. ~450 pulses/L, calibrate with a bucket." },
  { name: "Level", how: "Float up → tank_ok true. Float down → pump inhibited." },
  { name: "Rain", how: "A drop on the plate flips DO. Dry → irrigation allowed." },
  { name: "MPU-6050", how: "Tilt the rover: ax/ay move. I²C scan shows 0x68." },
  { name: "NEO-6M", how: "Open sky, PPS LED blinks, $GNGGA sentences. Indoors a GPS timeout is expected." },
  { name: "12 V valve", how: "Relay clicks, valve opens. A GPIO must never power the coil. Flyback diode across the coil." },
  { name: "MQTT", how: "Topic robofarm/telemetry gets JSON every 2 s. On Wi-Fi fail: local buffer." },
];
