export type Money = {
  amount: string;
  currencyCode: string;
};

export function formatMoney(money: Money): string {
  const amount = Number(money.amount);
  if (Number.isNaN(amount)) return money.amount;

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
