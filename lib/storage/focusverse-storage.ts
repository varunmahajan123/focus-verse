import { AppData } from "@/types/focusverse";

export const FOCUSVERSE_STORAGE_KEY = "focusverse.app.v4";

export function loadFocusverseData(): AppData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(FOCUSVERSE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppData) : null;
  } catch {
    return null;
  }
}

export function saveFocusverseData(data: AppData) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(FOCUSVERSE_STORAGE_KEY, JSON.stringify(data));
}

export function clearFocusverseData() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(FOCUSVERSE_STORAGE_KEY);
}
