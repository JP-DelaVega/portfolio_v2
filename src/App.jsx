import React from 'react';
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

export default function App() {
  return (
    <div className="min-h-screen font-sans antialiased bg-slate-100 text-slate-800">
      {/* Top Brand Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 text-lg font-black text-white rounded-lg bg-sky-600">
              JP
            </span>
            <span className="hidden text-sm font-bold tracking-tight text-slate-800 sm:inline">
              John Philip Dela Vega
            </span>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full text-slate-500 bg-slate-100">
            jayplought@gmailcom
          </span>
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
            <KeyboardPost/>
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