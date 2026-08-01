export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

export const THEME_TOKENS = {
  [THEMES.LIGHT]: {
    page: "bg-slate-100 text-slate-800",
    header: "border-slate-200 bg-white/95",
    headerText: "text-slate-800",
    card: "bg-white border-slate-200 hover:border-slate-300",
    cardSoft: "bg-slate-50/50",
    cardMuted: "text-slate-500",
    cardText: "text-slate-700",
    cardTitle: "text-slate-900",
    border: "border-slate-100",
    borderStrong: "border-slate-200",
    input:
      "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400",
    buttonGhost: "text-slate-600 hover:bg-slate-100",
    activeButton: "text-sky-600 bg-sky-50",
    badge: "bg-slate-100 text-slate-500",
    badgeAlt: "bg-slate-100 text-slate-700",
    chip: "bg-sky-100 text-sky-700",
    muted: "text-slate-400",
    softText: "text-slate-600",
    link: "text-sky-600 hover:text-sky-700",
    surface: "bg-slate-50/50",
    shell: "bg-white",
    shellAlt: "bg-slate-100",
    shellText: "text-slate-600",
    accent: "text-sky-600",
  },
  [THEMES.DARK]: {
    page: "bg-slate-950 text-slate-100",
    header: "border-slate-800 bg-slate-900/95",
    headerText: "text-slate-100",
    card: "bg-slate-900 border-slate-800 hover:border-slate-700",
    cardSoft: "bg-slate-800/70",
    cardMuted: "text-slate-400",
    cardText: "text-slate-300",
    cardTitle: "text-slate-100",
    border: "border-slate-800",
    borderStrong: "border-slate-700",
    input:
      "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400",
    buttonGhost: "text-slate-300 hover:bg-slate-800",
    activeButton: "text-sky-400 bg-slate-800",
    badge: "bg-slate-800 text-slate-300",
    badgeAlt: "bg-slate-800 text-slate-200",
    chip: "bg-sky-500/15 text-sky-300",
    muted: "text-slate-500",
    softText: "text-slate-400",
    link: "text-sky-400 hover:text-sky-300",
    surface: "bg-slate-800/70",
    shell: "bg-slate-900",
    shellAlt: "bg-slate-950",
    shellText: "text-slate-300",
    accent: "text-sky-400",
  },
};

export const getThemeTokens = (theme) =>
  THEME_TOKENS[theme] ?? THEME_TOKENS[THEMES.LIGHT];

export const getInitialTheme = () => {
  if (typeof window === "undefined") return THEMES.LIGHT;
  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === THEMES.DARK || savedTheme === THEMES.LIGHT) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
};
