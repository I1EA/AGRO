"use client";

import { LocaleProvider, useLocale } from "@/lib/locale";
import { SiteHeader } from "@/components/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";

function Footer() {
  const { t } = useLocale();
  return (
    <footer className="mt-auto border-t">
      <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">{t.footer}</p>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <TooltipProvider>
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </TooltipProvider>
    </LocaleProvider>
  );
}
