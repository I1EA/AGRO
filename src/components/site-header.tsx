"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", key: "navHome" as const },
  { href: "/simulation", key: "navSim" as const },
  { href: "/prix", key: "navPrice" as const },
  { href: "/materiel", key: "navHw" as const },
  { href: "/liaison", key: "navComms" as const },
];

export function SiteHeader() {
  const { t, locale, setLocale } = useLocale();
  const path = usePathname();

  const nav = (
    <>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
            path === l.href ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {t[l.key]}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            RF
          </span>
          <span className="truncate text-sm font-semibold">{t.brand}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{nav}</nav>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            aria-label="Language"
          >
            {locale === "fr" ? "FR · EN" : "EN · FR"}
          </Button>
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "outline", size: "icon" }), "md:hidden")}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-4">
              <SheetTitle className="mb-4 text-left">{t.brand}</SheetTitle>
              <nav className="flex flex-col gap-1">{nav}</nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
