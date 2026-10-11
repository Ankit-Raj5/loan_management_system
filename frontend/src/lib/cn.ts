type ClassValue = string | false | null | undefined;

// Joins class names, skipping falsy values
export const cn = (...classes: ClassValue[]): string => classes.filter(Boolean).join(" ");
