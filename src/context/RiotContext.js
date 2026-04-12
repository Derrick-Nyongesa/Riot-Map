import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RiotContext = createContext(null);

const REPORTS_KEY = "riot-map-reports-v1";
const PLACES_KEY = "riot-map-places-v1";

const safeRead = (key) => {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const safeWrite = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
};

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function RiotProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setReports(safeRead(REPORTS_KEY));
    setPlaces(safeRead(PLACES_KEY));
  }, []);

  useEffect(() => {
    safeWrite(REPORTS_KEY, reports);
  }, [reports]);

  useEffect(() => {
    safeWrite(PLACES_KEY, places);
  }, [places]);

  const addReport = (payload) => {
    const next = {
      id: makeId(),
      title: payload.title.trim(),
      severity: payload.severity,
      status: payload.status,
      description: payload.description.trim(),
      lat: Number(payload.lat),
      lng: Number(payload.lng),
      createdAt: new Date().toISOString(),
    };

    setReports((current) => [next, ...current]);
    return next;
  };

  const removeReport = (id) => {
    setReports((current) => current.filter((item) => item.id !== id));
  };

  const addPlace = (payload) => {
    const next = {
      id: makeId(),
      label: payload.label.trim(),
      type: payload.type,
      notes: payload.notes.trim(),
      lat: Number(payload.lat),
      lng: Number(payload.lng),
      createdAt: new Date().toISOString(),
    };

    setPlaces((current) => [next, ...current]);
    return next;
  };

  const removePlace = (id) => {
    setPlaces((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      reports,
      places,
      addReport,
      removeReport,
      addPlace,
      removePlace,
    }),
    [reports, places],
  );

  return <RiotContext.Provider value={value}>{children}</RiotContext.Provider>;
}

export function useRiot() {
  return useContext(RiotContext);
}
