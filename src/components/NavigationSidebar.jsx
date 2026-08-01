import React from 'react';
import { useSelector } from 'react-redux';
import { Home, Code, Briefcase, FolderGit2, Award, Mail, Bookmark } from 'lucide-react';
import { getThemeTokens } from '../theme';

export default function NavigationSidebar() {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  const cardClasses = `${tokens.card} shadow-sm`;
  const buttonClasses = `${tokens.buttonGhost} ${theme === 'dark' ? 'hover:text-sky-400' : 'hover:text-sky-600'}`;
  const iconClasses = theme === 'dark' ? 'text-slate-500 group-hover:text-sky-400' : 'text-slate-400 group-hover:text-sky-600';
  const textClasses = tokens.softText;
  const headingClasses = tokens.cardTitle;
  const mutedClasses = tokens.muted;

  const navItems = [
    { id: 'hero', label: 'Home / Overview', icon: Home },
    { id: 'skills', label: 'Technical Skills', icon: Code },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'projects', label: 'Featured Projects', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'contact', label: 'Get in Touch', icon: Mail },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="sticky space-y-4 top-20">
      {/* Navigation Widget */}
      <div className={`rounded-xl border p-4 ${cardClasses}`}>
        <h2 className={`px-2 mb-3 text-xs font-bold tracking-wider uppercase ${textClasses}`}>
          Navigation
        </h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-xs transition-all text-left group ${buttonClasses}`}
              >
                <Icon size={16} className={`transition-colors ${iconClasses}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Bio / Widget */}
      <div className={`rounded-xl border p-4 text-xs ${cardClasses} ${textClasses}`}>
        <div className={`mb-2 flex items-center gap-2 font-bold ${headingClasses}`}>
          <Bookmark size={14} className="text-sky-600" />
          <span>Quick Summary</span>
        </div>
        <p className={`leading-relaxed ${mutedClasses}`}>
          Interested in Full Stack Development, AI Engineering, and Low-Code Development. Seeking full-time remote or hybrid opportunities.
        </p>
      </div>
    </aside>
  );
}