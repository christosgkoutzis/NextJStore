import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts a number or a string to price format
export function currencyFormat(
  price: number | string, 
  options: {
    // ? means that they are optional to be declared 
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT',
    notation?: Intl.NumberFormatOptions['notation']
} = {}) {
  // Setting default values for currency and notation 
  const {currency = 'EUR', notation = 'compact'} = options
  // Converts string type price to float (number)
  const convertPrice = typeof price === 'string' ? parseFloat(price) : price
  // Returns converted price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    // This TS syntax means currency: currency
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(convertPrice);

}
