# Idea’Wave slides — RoboFarm Water Saver

Copier ces puces dans le PowerPoint. Same bullets in English below. Live demo: `npm run dev` → http://127.0.0.1:4371 · FR/EN toggle in the header.

Prices = public list pages, FX **1 EUR ≈ 10,85 MAD · 1 USD ≈ 9,95 MAD** (approx. nov. 2026). Hors fret et douane. Lignes « approx. » = fourchette catalogue.

---

## FR — quoi ajouter au pitch

### Démo (ouvrir dans le navigateur)

- `/` — contexte Maroc (600 m³, barrages 2026) + 5 gestes
- `/simulation` — 2 ha / 20 ha coop Saiss / 80 ha Souss · sol · culture · météo · trajet robot · eau vs calendrier · citerne/vanne · panne radio
- `/prix` — BOM prototype vs produit · capteurs · GPS/IMU · location coop vs vente
- `/materiel` — arbre d’alim, câblage, pins, flash, tests capteurs
- `/liaison` — ESP32 → Wi-Fi/MQTT (repli LoRa) → API mock → dashboard
- Sketch : `/firmware/robofarm_prototype.ino`

### Prix matériel (électronique seule)

- **Prototype (bootcamp)** : **~2 180 MAD / ~201 EUR** — Nano ESP32 + Uno, 2 sondes sol, DHT22, débitmètre, NEO-6M, MPU-6050, vanne 12 V, PowerBoost + LiPo, châssis 4WD
- **Produit de travail (1 robot, panier de base)** : **~3 722 MAD / ~343 EUR** — 4 sondes, NEO-M8N, solaire, IP65, MKR WAN 1310 LoRa
- Échelle ha (page `/prix`) : familiale ×1 · coop ×1,15 (**~4 281 MAD**) · grand domaine ×1,85 (**~6 887 MAD**)

### Capteurs — acheter

- Sol capacitif SparkFun Qwiic — 9,95 USD — https://www.sparkfun.com/sparkfun-qwiic-soil-moisture-sensor-capacitive.html
- DHT22 Addicore — 6,15 USD — https://www.addicore.com/collections/sensors
- Débitmètre Adafruit ½″ (YF-S201) — 9,95 USD — https://www.adafruit.com/product/828
- Niveau flotteur AliExpress — ~5,26 USD *(approx.)* — https://www.aliexpress.com/w/wholesale-water-level-sensors.html
- Pluie (option) Amazon HiLetgo — ~6,50 USD *(approx.)* — https://www.amazon.com/HiLetgo-Raindrops-Detection-Arduino-Weather/dp/B00X9ZBF32

### GPS / IMU — acheter

- **Proto GPS** NEO-6M Addicore — 9,99 USD — https://www.addicore.com/products/neo-6m-gps-module-with-eeprom
- **Produit GPS** NEO-M8N Amazon — 42,38 USD — https://www.amazon.com/dp/B0B6JBNWM8
- Option NEO-M9N SparkFun — 76,50 USD — https://www.sparkfun.com/sparkfun-gps-breakout-neo-m9n-sma-qwiic.html
- **IMU** GY-521 MPU-6050 Addicore — 4,75 USD — https://www.addicore.com/collections/sensors

### Location coop vs vente directe *(crédit 24 mois @ 8 % l’an, 8 adhérents coop, appli 25 MAD/ha/mois vente · 18 MAD/ha/mois service)*

| Exploitation | Matériel (échelle) | Vente, tout compris / mois | Location adhérent / mois |
| --- | --- | --- | --- |
| Familiale 2 ha | ~3 722 MAD | ~218 MAD | ~624 MAD *(pas de partage)* |
| Coop Saiss 20 ha | ~4 281 MAD | ~694 MAD | **~122 MAD** *(robot partagé)* |
| Domaine 80 ha | ~6 887 MAD | ~2 311 MAD | ~2 016 MAD *(2 parts)* |

→ Slide : **commencer par la coopérative** (un robot, plusieurs parcelles).

### Arduino / comms (une ligne)

Nano ESP32 lit sol/DHT/débit/GPS/IMU, pilote vanne 12 V **via relais**, publie du JSON MQTT `robofarm/telemetry` toutes les 2 s ; le dashboard **sonde** `GET /api/telemetry` (mock, pas de base).

### Sources / disclaimer (ne pas promettre 30 %)

- 600 m³ / 1 000 m³ : HCP + Banque mondiale via Hespress
- Barrages début juin 2026 75,64 % vs 39,53 % (2025) : Finances News Hebdo, 3 juin 2026
- ~87 % agriculture : presse, **à confirmer**
- **30 % tomate** = Dong et al., *Frontiers in Water*, 2024 (Michigan) — **repère littérature, pas un résultat RoboFarm**
- La sim montre un écart de **modèle**, pas une économie garantie

---

## EN — what to add to the pitch

### Demo routes

- `/` Morocco water context + five-step solution
- `/simulation` farm size / soil / crop / weather, robot path, water vs calendar, tank/valve, radio-loss
- `/prix` prototype vs working BOM, sensors, GPS/IMU, lease vs sale
- `/materiel` power tree, wiring, pins, flash, sensor tests
- `/liaison` ESP32 → Wi-Fi/MQTT (LoRa fallback) → mock API → dashboard
- Sketch: `/firmware/robofarm_prototype.ino`

### Hardware prices (electronics only)

- **Prototype:** **~2,180 MAD / ~201 EUR**
- **Working product (1 robot):** **~3,722 MAD / ~343 EUR** · scales ×1.15 coop (~4,281 MAD) · ×1.85 large (~6,887 MAD)

### Sensor / GPS / IMU buy links

- Soil SparkFun Qwiic $9.95 — https://www.sparkfun.com/sparkfun-qwiic-soil-moisture-sensor-capacitive.html
- DHT22 Addicore $6.15 — https://www.addicore.com/collections/sensors
- Flow Adafruit $9.95 — https://www.adafruit.com/product/828
- Level AliExpress ~$5.26 approx. — https://www.aliexpress.com/w/wholesale-water-level-sensors.html
- Rain Amazon ~$6.50 approx. — https://www.amazon.com/HiLetgo-Raindrops-Detection-Arduino-Weather/dp/B00X9ZBF32
- GPS NEO-6M $9.99 — https://www.addicore.com/products/neo-6m-gps-module-with-eeprom
- GPS NEO-M8N $42.38 — https://www.amazon.com/dp/B0B6JBNWM8
- GPS NEO-M9N upgrade $76.50 — https://www.sparkfun.com/sparkfun-gps-breakout-neo-m9n-sma-qwiic.html
- IMU MPU-6050 $4.75 — https://www.addicore.com/collections/sensors

### Lease vs sale (24-month loan @ 8%, 8 coop members)

- Family 2 ha: sale ~218 MAD/mo · lease ~624 MAD/mo (no share)
- **Coop 20 ha: sale ~694 MAD/mo · lease ~122 MAD/mo per member**
- Estate 80 ha: sale ~2,311 MAD/mo · lease ~2,016 MAD/mo

### Arduino comms one-liner

Nano ESP32 reads sensors, drives the 12 V valve **only through a relay**, MQTT JSON every 2 s; this web app **polls** `/api/telemetry` (no database).

### Sources / disclaimer

Do **not** say “we save 30%”. Dong 2024 is literature. Dam and m³ figures: Hespress / FNH June 2026. Simulated % is a model gap.
