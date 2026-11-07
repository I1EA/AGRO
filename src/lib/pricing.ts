import { bomTotals } from "./bom";
import { FARMS, type FarmSize } from "./simulation";

/** Stated assumptions for lease / sale / loan — shown in the UI. */
export const ASSUMPTIONS = {
  loanMonths: 24,
  annualRate: 0.08,
  coopMembers: 8,
  appMadPerHaMonthDirect: 25,
  appMadPerHaMonthLease: 18,
  robotServiceMadMonth: 420,
  fxNote: "1 EUR ≈ 10,85 MAD ; 1 USD ≈ 9,95 MAD (approx. nov. 2026).",
};

export function annuityMonthly(principalMad: number, annualRate: number, months: number): number {
  const r = annualRate / 12;
  if (r === 0) return principalMad / months;
  return (principalMad * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function scaledWorkingCost(farm: FarmSize) {
  const base = bomTotals("working");
  const factor = farm === "small" ? 1 : farm === "coop" ? 1.15 : 1.85;
  return { mad: base.mad * factor, eur: base.eur * factor, factor };
}

export function commercial(farm: FarmSize) {
  const ha = FARMS[farm].ha;
  const proto = bomTotals("prototype");
  const working = scaledWorkingCost(farm);
  const loanDirect = annuityMonthly(working.mad, ASSUMPTIONS.annualRate, ASSUMPTIONS.loanMonths);
  const leaseShare =
    farm === "coop"
      ? working.mad / ASSUMPTIONS.coopMembers
      : farm === "large"
        ? working.mad / 2
        : working.mad;
  const loanLease = annuityMonthly(leaseShare, ASSUMPTIONS.annualRate, ASSUMPTIONS.loanMonths);

  const directMonthly =
    loanDirect + ASSUMPTIONS.appMadPerHaMonthDirect * ha;
  const leaseMonthly =
    loanLease +
    ASSUMPTIONS.appMadPerHaMonthLease * (farm === "coop" ? ha / ASSUMPTIONS.coopMembers : ha) +
    (farm === "coop" ? ASSUMPTIONS.robotServiceMadMonth / ASSUMPTIONS.coopMembers : ASSUMPTIONS.robotServiceMadMonth);

  return {
    ha,
    proto,
    working,
    loanDirect,
    loanLease,
    leaseShare,
    directMonthly,
    leaseMonthly,
    appDirectYear: ASSUMPTIONS.appMadPerHaMonthDirect * ha * 12,
    appLeaseYear:
      ASSUMPTIONS.appMadPerHaMonthLease *
      (farm === "coop" ? ha / ASSUMPTIONS.coopMembers : ha) *
      12,
  };
}
