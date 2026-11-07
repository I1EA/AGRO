"use client";

import { ArchitectureSvg, PowerTree, WiringSvg } from "@/components/diagrams";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FLASH_STEPS_EN, FLASH_STEPS_FR, PINS, TEST_STEPS_EN, TEST_STEPS_FR } from "@/lib/pins";
import { useLocale } from "@/lib/locale";

export default function MaterielPage() {
  const { t, locale } = useLocale();
  const flash = locale === "fr" ? FLASH_STEPS_FR : FLASH_STEPS_EN;
  const tests = locale === "fr" ? TEST_STEPS_FR : TEST_STEPS_EN;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t.hwTitle}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {locale === "fr"
            ? "Arduino Nano ESP32 (Wi-Fi/BLE) + Uno Rev3 pour les essais 5 V. La vanne et la pompe ont leur propre 12 V. Esquisse de firmware : /firmware/robofarm_prototype.ino"
            : "Arduino Nano ESP32 (Wi-Fi/BLE) plus Uno Rev3 for 5 V bench tests. Valve and pump have their own 12 V rail. Firmware sketch: /firmware/robofarm_prototype.ino"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Arbre d’alimentation" : "Power tree"}</CardTitle>
          <CardDescription>
            {locale === "fr"
              ? "USB et solaire chargent la LiPo. Le 12 V n’entre jamais dans un GPIO."
              : "USB and solar charge the LiPo. 12 V never enters a GPIO."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PowerTree />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Câblage breadboard" : "Breadboard wiring"}</CardTitle>
        </CardHeader>
        <CardContent>
          <WiringSvg />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Carte des broches" : "Pin map"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pin</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>{locale === "fr" ? "Note" : "Note"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PINS.map((p) => (
                <TableRow key={p.pin}>
                  <TableCell className="font-mono text-xs">{p.pin}</TableCell>
                  <TableCell>{p.signal}</TableCell>
                  <TableCell className="text-muted-foreground">{p.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Comment flasher" : "How to flash"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {flash.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm">
            <a className="text-primary underline" href="/firmware/robofarm_prototype.ino" download>
              robofarm_prototype.ino
            </a>
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 text-xl font-semibold">
          {locale === "fr" ? "Tester chaque capteur" : "Test each sensor"}
        </h2>
        <Accordion multiple>
          {tests.map((s) => (
            <AccordionItem key={s.name} value={s.name}>
              <AccordionTrigger>{s.name}</AccordionTrigger>
              <AccordionContent>{s.how}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Architecture (rappel)" : "Architecture (reminder)"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ArchitectureSvg />
        </CardContent>
      </Card>
    </div>
  );
}
