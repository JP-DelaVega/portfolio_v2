import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Mail, Copy, Check } from 'lucide-react';
import ProfileHeader from './components/ProfileHeader';
import NavigationSidebar from './components/NavigationSidebar';
import HeroPost from './components/posts/HeroPost';
import SkillsPost from './components/posts/SkillsPost';
import ExperiencePost from './components/posts/ExperiencePost';
import ProjectsPost from './components/posts/ProjectsPost';
import CertificationsPost from './components/posts/CertificationsPost';
import ContactPost from './components/posts/ContactPost';
import ChatWidget from './components/ChatWidget';
import KeyboardPost from './components/posts/KeyboardPost';
import { toggleTheme } from './store';
import { getThemeTokens, THEMES } from './theme';

export default function App() {
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  const tokens = getThemeTokens(theme);
  const isDark = theme === THEMES.DARK;

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jayplought@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;
  }, [theme, isDark]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${tokens.page}`}
      id="topHeader"
    >
      {/* Top Brand Bar */}
      <header
        className={`sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-xl transition-colors duration-300 ${isDark
          ? 'border-slate-800/60 bg-slate-950/75'
          : 'border-slate-200/70 bg-white/80'
          }`}
      >
        <div className="flex items-center justify-between max-w-5xl mx-auto gap-3">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => scrollToSection('topHeader')}>
  <div className="flex items-center justify-center w-9 h-9 text-base font-black text-white rounded-xl bg-slate-800 border-2 border-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:scale-105">
    JP
  </div>
  <span className={`hidden text-sm font-bold tracking-tight sm:inline transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
    John Philip Dela Vega
  </span>
</div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className={`relative flex items-center w-12 h-7 rounded-full border transition-colors duration-300 ${isDark
                ? 'border-slate-600 bg-slate-800'
                : 'border-slate-300 bg-sky-100'
                }`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`absolute left-0.5 flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 ${isDark ? 'translate-x-5 bg-slate-950' : 'translate-x-0 bg-white'
                  }`}
              >
                {isDark ? (
                  <Moon size={12} className="text-amber-400" />
                ) : (
                  <Sun size={12} className="text-orange-500" />
                )}
              </span>
            </button>
            {/* Email - Copy to Clipboard */}
            <button
              onClick={handleCopyEmail}
              className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${isDark
                ? 'border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100'
                : 'border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                }`}
              title="Copy email"
            >
              <Mail size={12} />
              <span className="hidden sm:inline">jayplought@gmail.com</span>
              <span className="sm:hidden">Email</span>

              {copied && (
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-medium rounded-md whitespace-nowrap animate-fade-in-up shadow-lg">
                  Copied!
                  {/* Tiny arrow pointing up to the button */}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 rounded-[1px]"></span>
                </span>
              )}
            </button>


          </div>
        </div>

      </header>

      {/* Main Social Feed Layout */}
      <main className="max-w-5xl px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Social Feed Column (Left / Center) */}
          <div className="lg:col-span-2">
            <ProfileHeader />
            <HeroPost />
            <SkillsPost />
            <ExperiencePost />
            <ProjectsPost />
            <CertificationsPost />
            <KeyboardPost />
            <ContactPost />
          </div>

          {/* Social Navigation Panel (Right Sidebar) */}
          <div className="hidden lg:block lg:col-span-1">
            <NavigationSidebar />
          </div>
        </div>
      </main>

      {/* Embedded Social Media Chat Widget */}
      <ChatWidget />
    </div>
  );
}