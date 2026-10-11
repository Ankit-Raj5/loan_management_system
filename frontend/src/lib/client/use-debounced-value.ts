"use client";

import { useEffect, useState } from "react";

// Returns a value that only updates after it has stopped changing for `delay` ms (used for the live loan calculation)
export const useDebouncedValue = <T,>(value: T, delay = 250): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};
