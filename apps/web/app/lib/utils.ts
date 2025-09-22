export function formatCurrency(value: number, locale = 'es-AR', currency = 'ARS') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
