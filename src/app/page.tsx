"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/locale";

export default function HomePage() {
  const { t } = useLocale();
  const steps = [
    { t: t.step1, c: t.step1c },
    { t: t.step2, c: t.step2c },
    { t: t.step3, c: t.step3c },
    { t: t.step4, c: t.step4c },
    { t: t.step5, c: t.step5c },
  ];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">{t.bootcamp}</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">{t.brand}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t.tag}</p>
        <p className="max-w-2xl text-sm leading-relaxed">{t.heroLead}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/simulation" className={cn(buttonVariants())}>
            {t.ctaSim}
          </Link>
          <Link href="/prix" className={cn(buttonVariants({ variant: "outline" }))}>
            {t.ctaPrice}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t.contextTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat n={t.stat600} c={t.stat600c} />
          <Stat n={t.stat1000} c={t.stat1000c} />
          <Stat n={t.stat87} c={t.stat87c} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t.problemTitle}</h2>
        <ProblemCards />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t.solutionTitle}</h2>
        <ol className="grid gap-3 sm:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <p className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 font-medium">{s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.c}</p>
            </li>
          ))}
        </ol>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t.damsTitle}</CardTitle>
          <CardDescription>{t.damsBody}</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">{t.sources}</CardContent>
      </Card>
    </div>
  );
}

function Stat({ n, c }: { n: string; c: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{n}</CardTitle>
        <CardDescription>{c}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function ProblemCards() {
  const { locale } = useLocale();
  const items =
    locale === "fr"
      ? [
          { t: "Calendrier fixe", c: "Mêmes volumes aux mêmes heures, quel que soit le sol." },
          { t: "Sol hétérogène", c: "Sur 20 ha, deux zones voisines n’ont pas le même besoin." },
          { t: "Aucune mesure", c: "Sans données, on ne sait ni où l’on gaspille ni où ça manque." },
        ]
      : [
          { t: "Fixed calendar", c: "The same volumes at the same hours, whatever the soil is doing." },
          { t: "Patchy soil", c: "On 20 ha, two neighbouring zones rarely need the same water." },
          { t: "No measurement", c: "Without data nobody can say where water is wasted or missing." },
        ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((i) => (
        <Card key={i.t}>
          <CardHeader>
            <CardTitle>{i.t}</CardTitle>
            <CardDescription>{i.c}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
