// Brand images live on Cloudinary as one original upload (lms/brand/logo, 2048x2048 PNG).
// Everything below is a lossless PNG derived from it: trimmed of white margins, with the "LMS" symbol cropped out on its own.
const LOGO_BASE = "https://res.cloudinary.com/f9eelnlk/image/upload";
const TRIM = "e_trim:15";
const SYMBOL = `${TRIM}/c_crop,g_north,w_0.60,h_0.615`;
const ORIGINAL = "lms/brand/logo.png";

export const BRAND = {
  name: "LMS Bank",
  tagline: "Loan Management System",
  logo: { url: `${LOGO_BASE}/${TRIM}/c_scale,w_900/f_png/${ORIGINAL}`, width: 900, height: 719 },
  mark: { url: `${LOGO_BASE}/${SYMBOL}/c_scale,w_400/f_png/${ORIGINAL}`, width: 400, height: 325 },
  iconUrl: `${LOGO_BASE}/${SYMBOL}/c_pad,w_256,h_256,b_white/f_png/${ORIGINAL}`,
} as const;

// Original illustration (lms/landing/hero, SVG) uploaded to Cloudinary
export const LANDING = {
  hero: {
    url: "https://res.cloudinary.com/f9eelnlk/image/upload/lms/landing/hero.svg",
    width: 640,
    height: 520,
    alt: "A loan application on a phone with an approved badge, a salary slip and a stack of coins",
  },
} as const;

export const CONTACT = {
  linkedin: "https://www.linkedin.com/in/ankit-rajpoot01/",
  email: "ankitrajrajpoot5@gmail.com",
  github: "https://github.com/Ankit-Raj5",
} as const;

export const SESSION_COOKIE = "lms_token";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export const PAGE_SIZE = 10;
