import { Prisma } from '@prisma/client';

export interface SaleTotals {
  subtotal: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
}

export function calculateSaleTotals(
  items: {
    total: Prisma.Decimal;
  }[],
  discount: Prisma.Decimal,
): SaleTotals {
  let subtotal = new Prisma.Decimal(0);

  for (const item of items) {
    subtotal = subtotal.plus(item.total);
  }

  const grandTotal = subtotal.minus(discount);

  return {
    subtotal,
    grandTotal,
  };
}
