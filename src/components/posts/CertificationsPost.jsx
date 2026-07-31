import React from 'react';
import PostCard from '../PostCard';
import {
  FaEnvira,      // MongoDB green leaf / database icon alternative
  FaBolt,        // Vantiq event-driven icon
  FaMicrosoft,   // Microsoft
  FaDesktop,     // OutSystems (applied consistently across all 3)
  FaMeta         // Meta
} from 'react-icons/fa6';

export default function CertificationsPost() {
  const certs = [
    {
      title: 'Building GenAI Applications with MongoDB',
      issuer: 'MongoDB',
      year: '2026',
      icon: FaEnvira,
      color: 'text-emerald-600'
    },
    {
      title: 'Event-Driven Applications Foundations Course',
      issuer: 'Vantiq',
      year: '2026',
      icon: FaBolt,
      color: 'text-amber-500'
    },
    {
      title: 'Microsoft Certified: Azure Fundamentals',
      issuer: 'Microsoft',
      year: '2025',
      icon: FaMicrosoft,
      color: 'text-sky-600'
    },
    {
      title: 'Front-end Developer Specialist (OutSystems 11)',
      issuer: 'OutSystems',
      year: '2024',
      icon: FaDesktop,
      color: 'text-red-600'
    },
    {
      title: 'Associate Developer (ODC)',
      issuer: 'OutSystems',
      year: '2024',
      icon: FaDesktop,
      color: 'text-red-600'
    },
    {
      title: 'Associate Reactive Developer (OutSystems 11)',
      issuer: 'OutSystems',
      year: '2023',
      icon: FaDesktop,
      color: 'text-red-600'
    },
    {
      title: 'HTML and CSS in depth',
      issuer: 'Meta',
      year: '2022',
      icon: FaMeta,
      color: 'text-blue-600'
    },
    {
      title: 'Principles of UX/UI Design',
      issuer: 'Meta',
      year: '2022',
      icon: FaMeta,
      color: 'text-blue-600'
    },
  ];

  return (
    <PostCard id="certifications" timestamp="1d ago" initialComments={[{ text: "more on my linkedin profile", timestamp: "Jul 31, 2026, 10:24 AM" }]} initialLikes={3}>
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-700">
          Here are my certifications and credentials—things I've picked up while building and learning.
        </p>

        <div className="space-y-2.5">
          {certs.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`shrink-0 ${c.color}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-snug text-slate-800">{c.title}</p>
                  <p className="text-[11px] text-slate-500">{c.issuer} • {c.year}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PostCard>
  );
}