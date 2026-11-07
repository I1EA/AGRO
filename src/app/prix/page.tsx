"use client";

import { useState } from "react";
import { BomTable } from "@/components/bom-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BOM, bomTotals, NAV_IDS, SENSOR_IDS } from "@/lib/bom";
import { useLocale } from "@/lib/locale";
import { formatEur, formatMad, FX } from "@/lib/money";
import { ASSUMPTIONS, commercial } from "@/lib/pricing";
import { FARMS, type FarmSize } from "@/lib/simulation";

export default function PrixPage() {
  const { t, locale } = useLocale();
  const [farm, setFarm] = useState<FarmSize>("coop");
  const proto = bomTotals("prototype");
  const numbers = commercial(farm);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t.priceTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{t.priceLead}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {ASSUMPTIONS.fxNote} {locale === "fr" ? "Hors fret et douane." : "Excluding freight and duty."} FX
          {` EUR/MAD ${FX.EUR_MAD} · USD/MAD ${FX.USD_MAD} (${FX.asOf}).`}
        </p>
      </div>

      <Tabs defaultValue="prototype">
        <TabsList>
          <TabsTrigger value="prototype">{t.proto}</TabsTrigger>
          <TabsTrigger value="working">{t.working}</TabsTrigger>
        </TabsList>
        <TabsContent value="prototype" className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            {t.proto}: {formatMad(proto.mad, locale)} · {formatEur(proto.eur, locale)}
          </p>
          <BomTable kind="prototype" />
        </TabsContent>
        <TabsContent value="working" className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            {t.working} (1 robot, BOM de base): {formatMad(bomTotals("working").mad, locale)} ·{" "}
            {formatEur(bomTotals("working").eur, locale)}
          </p>
          <BomTable kind="working" />
        </TabsContent>
      </Tabs>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t.sensorsTitle}</h2>
        <BomTable kind="prototype" filter={(l) => SENSOR_IDS.includes(l.id as (typeof SENSOR_IDS)[number])} />
        <p className="text-xs text-muted-foreground">
          {locale === "fr"
            ? "Les quantités produit de travail passent à 4 sondes de sol. Voir l’onglet Produit de travail."
            : "Working-product quantities use 4 soil probes. See the Working product tab."}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t.navTitle}</h2>
        <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">{t.part}</th>
                <th className="p-3">{t.role}</th>
                <th className="p-3">{t.unit}</th>
                <th className="p-3">{t.buy}</th>
              </tr>
            </thead>
            <tbody>
              {BOM.filter((l) => NAV_IDS.includes(l.id as (typeof NAV_IDS)[number])).map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3">
                    {locale === "fr" ? l.partFr : l.part}
                    {l.approximate && (
                      <Badge variant="outline" className="ml-2">
                        approx.
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground">{locale === "fr" ? l.roleFr : l.role}</td>
                  <td className="p-3 whitespace-nowrap">
                    {l.unit} {l.currency}
                  </td>
                  <td className="p-3">
                    <a className="text-primary underline" href={l.url} target="_blank" rel="noreferrer">
                      {l.vendor}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t.compareTitle}</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FARMS) as FarmSize[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFarm(k)}
              className={
                farm === k
                  ? "rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
                  : "rounded-full bg-muted px-3 py-1 text-sm"
              }
            >
              {locale === "fr" ? FARMS[k].nameFr : FARMS[k].nameEn} · {FARMS[k].ha} ha
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{t.loanBody}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{locale === "fr" ? "Vente directe à l’exploitant" : "Direct sale to the farmer"}</CardTitle>
              <CardDescription>
                {locale === "fr"
                  ? "Le matériel est acheté (ou financé) par l’exploitation, plus abonnement appli."
                  : "The farm buys (or finances) the kit, plus an app subscription."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Line
                k={locale === "fr" ? "Matériel (échelle ha)" : "Hardware (ha-scaled)"}
                v={formatMad(numbers.working.mad, locale)}
              />
              <Line
                k={locale === "fr" ? "Crédit 24 mois @ 8 %" : "24-month loan @ 8%"}
                v={`${formatMad(numbers.loanDirect, locale)} / ${locale === "fr" ? "mois" : "mo"}`}
              />
              <Line
                k={locale === "fr" ? "Applis / an" : "App / year"}
                v={formatMad(numbers.appDirectYear, locale)}
              />
              <Line
                k={locale === "fr" ? "Charge mensuelle totale" : "All-in monthly"}
                v={formatMad(numbers.directMonthly, locale)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{locale === "fr" ? "Location / service coopérative" : "Cooperative lease / service"}</CardTitle>
              <CardDescription>
                {locale === "fr"
                  ? "Un robot partagé, coût de revient divisé, abonnement plus bas."
                  : "One shared robot, split hardware, lower app fee."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Line
                k={locale === "fr" ? "Quote-part matériel" : "Hardware share"}
                v={formatMad(numbers.leaseShare, locale)}
              />
              <Line
                k={locale === "fr" ? "Crédit sur la quote-part" : "Loan on the share"}
                v={`${formatMad(numbers.loanLease, locale)} / ${locale === "fr" ? "mois" : "mo"}`}
              />
              <Line
                k={locale === "fr" ? "Applis / an (part)" : "App / year (share)"}
                v={formatMad(numbers.appLeaseYear, locale)}
              />
              <Line
                k={locale === "fr" ? "Charge mensuelle adhérent" : "Member monthly"}
                v={formatMad(numbers.leaseMonthly, locale)}
              />
            </CardContent>
          </Card>
        </div>
        <p className="text-xs text-muted-foreground">{t.loanTitle}: PMT = P × r(1+r)^n / ((1+r)^n−1), r = 8 % / 12, n = 24.</p>
      </section>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
