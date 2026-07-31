import React from 'react';
import { Home, Code, Briefcase, FolderGit2, Award, Mail, Bookmark } from 'lucide-react';

export default function NavigationSidebar() {
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
      <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
        <h2 className="px-2 mb-3 text-xs font-bold tracking-wider uppercase text-slate-400">
          Navigation
        </h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-sky-50 hover:text-sky-600 font-medium text-xs transition-all text-left group"
              >
                <Icon size={16} className="transition-colors text-slate-400 group-hover:text-sky-600" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Bio / Widget */}
      <div className="p-4 text-xs bg-white border shadow-sm rounded-xl border-slate-200 text-slate-600">
        <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
          <Bookmark size={14} className="text-sky-600" />
          <span>Quick Summary</span>
        </div>
        <p className="leading-relaxed text-slate-500">
          Interested in Full Stack Development, AI Engineering, and Low-Code Development. Seeking full-time remote or hybrid opportunities.
        </p>
      </div>
    </aside>
  );
}