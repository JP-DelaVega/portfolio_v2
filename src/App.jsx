import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun } from 'lucide-react';
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
      <header className={`sticky top-0 z-40 border-b px-4 py-2.5 backdrop-blur ${tokens.header}`}>
        <div className="flex items-center justify-between max-w-5xl mx-auto gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('topHeader')}>
            <span className="flex items-center justify-center w-8 h-8 text-lg font-black text-white rounded-lg bg-sky-600">
              JP
            </span>
            <span className={`hidden text-sm font-bold tracking-tight sm:inline ${tokens.headerText}`}>
              John Philip Dela Vega
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tokens.badge}`}>
              jayplought@gmailcom
            </span>
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