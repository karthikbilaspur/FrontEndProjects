// src/lib/utils.ts

// --- General Helpers ---
export function isValidNumber(value: unknown): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

// --- Unit Conversions for BMI ---
export function convertLbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

export function convertCmToInches(cm: number): number {
  return cm / 2.54;
}

export function convertInchesToCm(inches: number): number {
  return inches * 2.54;
}

// --- Temperature Conversions ---
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

export function kelvinToFahrenheit(kelvin: number): number {
  return celsiusToFahrenheit(kelvinToCelsius(kelvin));
}

export function fahrenheitToKelvin(fahrenheit: number): number {
  return celsiusToKelvin(fahrenheitToCelsius(fahrenheit));
}