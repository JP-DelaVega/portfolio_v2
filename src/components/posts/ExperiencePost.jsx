import React, { useState } from 'react';
import PostCard from '../PostCard';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function ExperiencePost() {
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
        <p>
          A summary of my professional experience, the technologies I've worked with, and the projects I've contributed to throughout my software development career.
        </p>
        {visibleExperiences.map((exp, idx) => (
          <div
            key={idx}
            className={`py-1 pl-4 border-l-2 border-sky-500 transition-all duration-300 ${!expanded && idx === 0 ? '' : ''
              }`}
          >
            <div className="flex flex-col justify-between gap-1 mb-1 sm:flex-row sm:items-center">
              <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                {exp.period}
              </span>
            </div>
            <div className="mb-1 text-xs font-semibold text-sky-600">{exp.company}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
              <MapPin size={12} /> {exp.location}
            </div>
            <ul className="space-y-1 text-xs leading-relaxed list-disc list-inside text-slate-600">
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
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors rounded-lg py-2 px-4"
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