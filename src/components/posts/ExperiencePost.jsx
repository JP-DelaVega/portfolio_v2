import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../PostCard';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { getThemeTokens } from '../../theme';

export default function ExperiencePost() {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  const isDark = theme === 'dark';
  const [expanded, setExpanded] = useState(false);

  const experiences = [
    {
      role: 'Full-Stack Developer | Technology Consultant',
      company: 'SGV & Co.',
      period: 'Apr 2023 - Present',
      location: 'Makati City (Hybrid)',
      highlights: [
        'Enhanced and maintained the Bureau of Internal Revenue (BIR) ePERA application, improving system functionality.',
        'Resolved UAT-critical issues in the BIR DEM and eServices forms, ensuring system stability.',
        'Investigated and resolved cross-layer defects involving frontend interfaces, backend services, and database queries.',
        'Developed enterprise applications using OutSystems, including payroll automation, probation tracking, and procurement workflows.',
        'Collaborated with QA testers, designers, and project managers in Agile sprints.'
      ]
    },
    {
      role: 'Junior Software Developer',
      company: 'Direct Sourcing Solutions',
      period: 'Jun 2022 - Mar 2023',
      location: 'Clark, Pampanga (Remote)',
      highlights: [
        'Developed and maintained responsive web applications aligned with business requirements.',
        'Enhanced UI components using CSS and JavaScript, reducing reported UI defects during testing.',
        'Designed wireframes and interactive prototypes in Figma to streamline stakeholder feedback.',
        'Participated in Agile sprints, managing tasks in Jira and consistently delivering features on time.'
      ]
    },
    {
      role: 'Junior Software Developer (Intern)',
      company: 'Direct Sourcing Solutions',
      period: 'Jan 2022 - Jun 2022',
      location: 'Clark, Pampanga (Remote)',
      highlights: [
        'Developed training applications using OutSystems with business logic and responsive UI.',
        'Created wireframes and prototypes in Figma to support feature design.',
        'Assisted developers with testing and issue resolution in an Agile environment.'
      ]
    }
  ];

  const visibleExperiences = expanded ? experiences : experiences.slice(0, 1);
  const hiddenCount = experiences.length - visibleExperiences.length;

  return (
    <PostCard id="experience" timestamp="3h ago">
      <div className="space-y-6">
        <p className={tokens.cardText}>
          A summary of my professional experience, the technologies I've worked with, and the projects I've contributed to throughout my software development career.
        </p>
        {visibleExperiences.map((exp, idx) => (
          <div
            key={idx}
            className={`py-1  transition-all duration-300 ${!expanded && idx === 0 ? '' : ''
              }`}
          >
            <div className="flex flex-col justify-between gap-1 mb-1 sm:flex-row sm:items-center">
              <h3 className={`text-sm font-bold ${tokens.cardTitle}`}>{exp.role}</h3>
              <span className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold ${tokens.badge}`}>
                {exp.period}
              </span>
            </div>
            <div className="mb-1 text-xs font-semibold text-sky-600">{exp.company}</div>
            <div className={`mb-2 flex items-center gap-1 text-[11px] ${tokens.muted}`}>
              <MapPin size={12} /> {exp.location}
            </div>
            <ul className={`list-inside list-disc space-y-1 text-xs leading-relaxed ${tokens.softText}`}>
              {exp.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {experiences.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${isDark ? 'bg-slate-800 text-sky-400 hover:bg-slate-700 hover:text-sky-300' : 'bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700'}`}
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Read more ({hiddenCount} more experience{hiddenCount > 1 ? 's' : ''}) <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </PostCard>
  );
}