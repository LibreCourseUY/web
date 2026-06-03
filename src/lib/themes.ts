export type Theme = "default";

export const THEMES: Theme[] = ["default"];
const STORAGE_KEY = "theme";

export function getTheme(): Theme {
  if (typeof localStorage === "undefined") return "default";
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? "default";
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}