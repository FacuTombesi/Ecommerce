// Currency formatter. It takes a number and converts it to dollars. Example: 1500 => $15.00
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

// Number formatter that converts a string into a number
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}