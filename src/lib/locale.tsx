"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "fr" | "en";

type Dictionary = (typeof copy)[Locale];

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
};

const copy = {
  fr: {
    brand: "RoboFarm Water Saver",
    tag: "Où, quand et combien irriguer.",
    navHome: "Pitch",
    navSim: "Simulation",
    navPrice: "Prix & BOM",
    navHw: "Matériel",
    navComms: "Liaison",
    lang: "FR",
    otherLang: "EN",
    bootcamp: "Bootcamp Idea’Wave · Euromed Fès · 16–17 novembre 2026",
    heroLead:
      "Un robot qui mesure, une application qui décide. Prototype web pour Innov Travel Morocco 2026 — irrigation économe en eau pour les fermes marocaines.",
    ctaSim: "Lancer la simulation",
    ctaPrice: "Voir les nomenclatures",
    contextTitle: "Le Maroc manque d’eau, l’agriculture en consomme l’essentiel",
    stat600: "600 m³",
    stat600c: "d’eau renouvelable par habitant et par an, contre plus de 2 500 m³ dans les années 1960.",
    stat1000: "1 000 m³",
    stat1000c: "seuil international de stress hydrique — le pays reste en dessous.",
    stat87: "~87 %",
    stat87c: "de l’eau mobilisée par l’agriculture (ordre de grandeur, source presse à confirmer).",
    problemTitle: "Aujourd’hui on irrigue à l’œil ou au calendrier",
    solutionTitle: "Cinq gestes",
    step1: "Se déplace",
    step1c: "Le robot parcourt les rangs.",
    step2: "Mesure",
    step2c: "Sol, air, débit, niveau.",
    step3: "Transmet",
    step3c: "Wi-Fi, MQTT ou LoRa.",
    step4: "Estime",
    step4c: "Besoin par zone.",
    step5: "Recommande",
    step5c: "Où, quand, combien.",
    damsTitle: "Les barrages se sont remplis en 2026. Le déficit, lui, reste structurel.",
    damsBody:
      "Taux de remplissage début juin : 39,53 % (2025) contre 75,64 % (2026). Une année pluvieuse ne change pas la structure : économiser l’eau reste une priorité.",
    sources:
      "Sources pitch : HCP et Banque mondiale via Hespress ; Finances News Hebdo (3 juin 2026) ; Dong et al., Frontiers in Water, 2024 (essai tomate, Michigan — 30 % d’eau en moins, pas un résultat RoboFarm).",
    simTitle: "Simulation de parcelle",
    simLead:
      "Choisissez la taille d’exploitation, le sol, la culture et la météo. Le robot suit un trajet en serpentin, la télémétrie est un flux mock (pas de base de données).",
    start: "Démarrer",
    stop: "Pause",
    reset: "Réinitialiser",
    disconnect: "Simuler une panne réseau",
    reconnect: "Reconnecter",
    emptyTitle: "Aucune télémétrie",
    emptyBody: "Démarrez la mission pour voir le robot, l’humidité et les volumes d’eau.",
    loading: "Synchronisation du rover…",
    errorTitle: "Liaison perdue",
    errorBody: "Le robot stocke en local (comme prévu en zone rurale) jusqu’au retour du réseau.",
    farmSize: "Taille d’exploitation",
    soil: "Sol",
    crop: "Culture",
    weather: "Météo",
    waterUsed: "Eau aujourd’hui",
    traditional: "Irrigation traditionnelle",
    robofarm: "RoboFarm (simulé)",
    savings: "Écart simulé",
    savingsNote:
      "Écart de modèle, pas une promesse. La littérature cite ~30 % sur tomate (Dong 2024). Notre preuve = pilote à deux parcelles.",
    moisture: "Humidité moyenne du sol",
    tank: "Citerne",
    valve: "Vanne",
    pump: "Pompe",
    open: "Ouverte",
    closed: "Fermée",
    on: "Marche",
    off: "Arrêt",
    path: "Trajet robot",
    legendDry: "Sec — irriguer",
    legendOk: "OK — aucune action",
    legendWet: "Humide — suspendre",
    live: "Télémétrie live (mock)",
    priceTitle: "Deux nomenclatures, deux modèles commerciaux",
    priceLead:
      "Prototype de bootcamp vs produit de terrain. Prix saisis sur des pages publiques (Arduino, SparkFun, Adafruit, Addicore, Amazon, AliExpress, RS). Convertis en MAD et EUR. Les lignes « approx. » le sont.",
    proto: "Prototype",
    working: "Produit de travail",
    part: "Pièce",
    qty: "Qté",
    role: "Rôle",
    unit: "Prix unit.",
    total: "Total",
    buy: "Achat",
    sensorsTitle: "BOM capteurs",
    navTitle: "GPS et IMU",
    compareTitle: "Location coopérative vs vente directe",
    loanTitle: "Mensualité emprunt / location",
    loanBody:
      "Hypothèses affichées : crédit 24 mois, 8 % l’an (nominal), amortissement du matériel. La coopérative Saiss (exemple) partage le robot entre 8 adhérents. L’abonnement appli est 25 MAD/ha/mois en vente directe, 18 MAD/ha/mois en service mutualisé.",
    hwTitle: "Grille électrique et Arduino",
    commsTitle: "De l’ESP32 au tableau de bord",
    footer:
      "E-prototype Idea’Wave 2026 · Données de parcelle fictives · Prix publics, hors fret et douane marocaine.",
    sample: "Données d’exemple",
  },
  en: {
    brand: "RoboFarm Water Saver",
    tag: "Where, when and how much to irrigate.",
    navHome: "Pitch",
    navSim: "Simulation",
    navPrice: "Pricing & BOM",
    navHw: "Hardware",
    navComms: "Link",
    lang: "EN",
    otherLang: "FR",
    bootcamp: "Idea’Wave bootcamp · Euromed Fès · 16–17 November 2026",
    heroLead:
      "A robot that measures, an app that decides. Web e-prototype for Innov Travel Morocco 2026 — water-saving irrigation for Moroccan farms.",
    ctaSim: "Open the farm sim",
    ctaPrice: "See the BOMs",
    contextTitle: "Morocco is short of water, and farming uses most of it",
    stat600: "600 m³",
    stat600c: "renewable water per person per year, versus more than 2,500 m³ in the 1960s.",
    stat1000: "1,000 m³",
    stat1000c: "international water-stress threshold — the country remains below it.",
    stat87: "~87 %",
    stat87c: "of mobilised water used by agriculture (order of magnitude; press figure to confirm).",
    problemTitle: "Today we irrigate by eye or by calendar",
    solutionTitle: "Five moves",
    step1: "Moves",
    step1c: "The robot walks the crop rows.",
    step2: "Measures",
    step2c: "Soil, air, flow, tank level.",
    step3: "Sends",
    step3c: "Wi-Fi, MQTT or LoRa.",
    step4: "Estimates",
    step4c: "Need per zone.",
    step5: "Recommends",
    step5c: "Where, when, how much.",
    damsTitle: "The dams filled in 2026. The deficit is still structural.",
    damsBody:
      "Reservoir fill in early June: 39.53 % (2025) versus 75.64 % (2026). A wet year does not change the structure: saving water stays a priority.",
    sources:
      "Pitch sources: HCP and World Bank via Hespress; Finances News Hebdo (3 June 2026); Dong et al., Frontiers in Water, 2024 (tomato trial, Michigan — 30 % less water, not a RoboFarm result).",
    simTitle: "Parcel simulation",
    simLead:
      "Pick farm size, soil, crop and weather. The robot follows a serpentine path. Telemetry is a mock feed (no database).",
    start: "Start",
    stop: "Pause",
    reset: "Reset",
    disconnect: "Simulate radio loss",
    reconnect: "Reconnect",
    emptyTitle: "No telemetry yet",
    emptyBody: "Start the mission to see the robot, soil moisture and water volumes.",
    loading: "Syncing the rover…",
    errorTitle: "Link lost",
    errorBody: "The robot stores locally (as designed for rural coverage) until the radio returns.",
    farmSize: "Farm size",
    soil: "Soil",
    crop: "Crop",
    weather: "Weather",
    waterUsed: "Water today",
    traditional: "Traditional irrigation",
    robofarm: "RoboFarm (simulated)",
    savings: "Simulated gap",
    savingsNote:
      "Model gap, not a promise. Literature cites ~30 % on tomato (Dong 2024). Our proof is a two-plot pilot.",
    moisture: "Mean soil moisture",
    tank: "Tank",
    valve: "Valve",
    pump: "Pump",
    open: "Open",
    closed: "Closed",
    on: "On",
    off: "Off",
    path: "Robot path",
    legendDry: "Dry — irrigate",
    legendOk: "OK — no action",
    legendWet: "Wet — hold irrigation",
    live: "Live telemetry (mock)",
    priceTitle: "Two BOMs, two commercial models",
    priceLead:
      "Bootcamp prototype vs field product. Prices taken from public pages (Arduino, SparkFun, Adafruit, Addicore, Amazon, AliExpress, RS), converted to MAD and EUR. Rows marked approx. are estimates.",
    proto: "Prototype",
    working: "Working product",
    part: "Part",
    qty: "Qty",
    role: "Role",
    unit: "Unit price",
    total: "Total",
    buy: "Buy",
    sensorsTitle: "Sensors BOM",
    navTitle: "GPS and IMU",
    compareTitle: "Cooperative lease vs direct sale",
    loanTitle: "Loan / lease monthly figure",
    loanBody:
      "Stated assumptions: 24-month loan, 8 % nominal per year, hardware amortised. The example Saiss cooperative shares one robot among 8 members. App fee is 25 MAD/ha/month on a direct sale, 18 MAD/ha/month on a shared service.",
    hwTitle: "Electrical tree and Arduino",
    commsTitle: "From the ESP32 to the dashboard",
    footer:
      "Idea’Wave 2026 e-prototype · Fictional parcel data · Public prices, excluding Moroccan freight and duty.",
    sample: "Sample data",
  },
} as const;

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem("rf-locale");
    if (saved === "en" || saved === "fr") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("rf-locale", l);
    document.documentElement.lang = l;
  };

  const value = useMemo(
    () => ({ locale, setLocale, t: copy[locale] }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("LocaleProvider missing");
  return ctx;
}
