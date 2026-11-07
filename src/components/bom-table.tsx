"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { linesFor, lineTotals, type BomKind, type BomLine } from "@/lib/bom";
import { useLocale } from "@/lib/locale";
import { formatEur, formatMad, toEur, toMad } from "@/lib/money";

export function BomTable({ kind, filter }: { kind: BomKind; filter?: (l: BomLine) => boolean }) {
  const { t, locale } = useLocale();
  const rows = linesFor(kind).filter((l) => (filter ? filter(l) : true));
  const totals = rows.reduce(
    (a, l) => {
      const x = lineTotals(l, l.qty);
      a.mad += x.mad;
      a.eur += x.eur;
      return a;
    },
    { mad: 0, eur: 0 },
  );

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.part}</TableHead>
            <TableHead className="text-right">{t.qty}</TableHead>
            <TableHead className="hidden md:table-cell">{t.role}</TableHead>
            <TableHead className="text-right">{t.unit}</TableHead>
            <TableHead className="text-right">{t.total}</TableHead>
            <TableHead>{t.buy}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((l) => {
            const tot = lineTotals(l, l.qty);
            const unitMad = toMad(l.unit, l.currency);
            const unitEur = toEur(l.unit, l.currency);
            return (
              <TableRow key={l.id}>
                <TableCell className="min-w-48">
                  <div className="font-medium">{locale === "fr" ? l.partFr : l.part}</div>
                  {l.approximate && (
                    <Badge variant="outline" className="mt-1">
                      {locale === "fr" ? "approx." : "approx."}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">{l.qty}</TableCell>
                <TableCell className="hidden max-w-xs text-muted-foreground md:table-cell">
                  {locale === "fr" ? l.roleFr : l.role}
                </TableCell>
                <TableCell className="text-right text-xs whitespace-nowrap">
                  {formatMad(unitMad, locale)}
                  <br />
                  {formatEur(unitEur, locale)}
                </TableCell>
                <TableCell className="text-right text-xs whitespace-nowrap font-medium">
                  {formatMad(tot.mad, locale)}
                  <br />
                  {formatEur(tot.eur, locale)}
                </TableCell>
                <TableCell className="min-w-32 text-xs">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {l.vendor}
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="font-medium">
              {t.total}
            </TableCell>
            <TableCell className="text-right text-xs font-semibold">
              {formatMad(totals.mad, locale)}
              <br />
              {formatEur(totals.eur, locale)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
