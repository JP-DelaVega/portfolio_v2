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
    page: "bg-[#1e1e1e] text-[#cccccc]",
    header: "border-[#3e3e42] bg-[#252526]/95 backdrop-blur-sm",
    headerText: "text-[#e8e8e8]",
    card: "bg-[#252526] border-[#3e3e42] hover:border-[#4e4e52]",
    cardSoft: "bg-[#2d2d30]/40",
    cardMuted: "text-[#808080]",
    cardText: "text-[#cccccc]",
    cardTitle: "text-[#e8e8e8]",
    border: "border-[#3e3e42]/30",
    borderStrong: "border-[#3e3e42]",
    input:
      "bg-[#3e3e42]/30 border-[#3e3e42] text-[#e8e8e8] placeholder:text-[#6e6e6e] focus:border-[#4fc1ff]/50 focus:ring-1 focus:ring-[#4fc1ff]/20",
    buttonGhost: "text-[#cccccc] hover:bg-[#3e3e42]/40 hover:text-[#e8e8e8]",
    activeButton: "text-[#4fc1ff] bg-[#4fc1ff]/10 border border-[#4fc1ff]/20",
    badge: "bg-[#3e3e42]/60 text-[#a0a0a0]",
    badgeAlt: "bg-[#3e3e42]/60 text-[#cccccc]",
    chip: "bg-[#4fc1ff]/10 text-[#4fc1ff] border border-[#4fc1ff]/20",
    muted: "text-[#6e6e6e]",
    softText: "text-[#a0a0a0]",
    link: "text-[#4fc1ff] hover:text-[#9cdcfe]",
    surface: "bg-[#2d2d30]/30",
    shell: "bg-[#252526]",
    shellAlt: "bg-[#1e1e1e]",
    shellText: "text-[#cccccc]",
    accent: "text-[#4fc1ff]",
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