// Converts rupees to integer paise so money maths never suffers floating point drift
export const toPaise = (rupees: number): number => Math.round(rupees * 100);

// Converts integer paise back to rupees
export const fromPaise = (paise: number): number => paise / 100;

// Checks that a rupee amount has at most 2 decimal places
export const hasMaxTwoDecimals = (rupees: number): boolean =>
  Math.abs(rupees * 100 - Math.round(rupees * 100)) < 1e-6;
