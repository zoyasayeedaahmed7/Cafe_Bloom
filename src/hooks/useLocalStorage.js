import { useState, useEffect, useCallback, useRef } from "react";

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse 
  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Mirrors storedValue so two setValue calls in the same tick chain off each
  // other. Reading the state variable directly would make both compute from the
  // same pre-update value, silently dropping the first (e.g. fast +/+ clicks).
  const latest = useRef(storedValue);
  useEffect(() => {
    latest.current = storedValue;
  }, [storedValue]);

  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(latest.current) : value;
        latest.current = valueToStore;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // We dispatch a custom event so every hook instance knows about the change
        window.dispatchEvent(new Event("local-storage"));
      } catch (error) {
        console.warn(`Error writing localStorage key “${key}”:`, error);
      }
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = () => setStoredValue(readValue());

    // Listen for changes in this tab or other tabs
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
};