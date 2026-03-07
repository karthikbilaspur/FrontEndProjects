// conversionRates.js

export const lengthMeterRates = {
    m: 1,
    km: 1000,
    mile: 1609.34,
    ft: 0.3048,
    yard: 0.9144,
    cm: 0.01,
    in: 0.0254
};

export const weightKgRates = {
    kg: 1,
    g: 0.001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000, // Metric Ton
    mg: 0.000001
};

export const dataByteRates = {
    b: 1,
    kb: 1 / 1024,
    mb: 1 / (1024 * 1024),
    gb: 1 / (1024 * 1024 * 1024),
    tb: 1 / (1024 * 1024 * 1024 * 1024),
    pb: 1 / (1024 * 1024 * 1024 * 1024 * 1024)
};

export const areaSqMeterRates = {
    sqm: 1,
    sqkm: 1000000,
    sqmile: 2589988.11,
    sqft: 0.092903,
    sqyard: 0.836127,
    acre: 4046.86,
    hectare: 10000
};

export const volumeLitreRates = {
    ml: 0.001,
    l: 1,
    cuin: 0.0163871, // 1 cubic inch = 0.0163871 liters
    cuft: 28.3168, // 1 cubic foot = 28.3168 liters
    gal: 3.78541, // 1 US gallon = 3.78541 liters
    qt: 0.946353, // 1 US quart = 0.946353 liters
    cup: 0.236588 // 1 US cup = 0.236588 liters
};

export const speedMpsRates = {
    mps: 1, // Meters per second
    kmph: 1 / 3.6, // 1 km/h = 1/3.6 m/s
    mph: 0.44704, // 1 mph = 0.44704 m/s
    knot: 0.514444, // 1 knot = 0.514444 m/s
    fps: 0.3048 // 1 foot/second = 0.3048 m/s
};

export const timeSecondRates = {
    sec: 1,
    min: 60,
    hr: 3600,
    day: 86400,
    week: 604800,
    month: 2629746, // Average month (365.25/12 days)
    year: 31556952 // Average year (365.25 days)
};

export const resolutionPixelRates = {
    px: 1,
    mp: 1000000 // 1 Megapixel = 1,000,000 pixels
};