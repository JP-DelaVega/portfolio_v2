import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../PostCard';
import { X } from 'lucide-react';
import { getThemeTokens } from '../../theme';

export default function ProjectsPost() {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  const isDark = theme === 'dark';
  // Holds the currently expanded project ({ image, title }) or null when closed
  const [expandedProject, setExpandedProject] = useState(null);

  // Close the expanded photo on Escape key
  useEffect(() => {
    if (!expandedProject) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setExpandedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedProject]);

  const projects = [
    {
      title: 'RAG System',
      description: 'Retrieval-Augmented Generation application for querying context-aware document datasets.',
      image: '/images/rag.png',
      code: 'https://github.com/JP-DelaVega/chat.git',
      link: 'https://chat-hazel-three-68.vercel.app/',
      stacks: ['React.js', 'FastAPI', 'Tailwind', "MongoDB", "GeminiEmbedding"]
    },
    {
      title: 'SwiftCV',
      description: 'AI-powered resume builder with predefined templates and ATS score checker powered by LLMs.',
      image: '/images/swiftCV.png',
      code: 'https://github.com/JP-DelaVega/SwiftCV.git',
      link: 'https://swift-cv-xi.vercel.app/',
      stacks: ['React.js', 'Node.js', 'Tailwind', 'MongoDB', 'Clerk', 'Gemini']
    },
    {
      title: 'Job Application Tracker',
      description: 'Job application pipeline tracker paired with an AI module for practice interview preparation.',
      image: '/images/pocketTrack.png',
      code: 'https://github.com/JP-DelaVega/Job-Application-Tracker.git',
      link: 'https://job-application-tracker-ten-beta.vercel.app/',
      stacks: ['React.js', 'Node.js', 'Tailwind', 'Supabase', 'Gemini']
    }
  ];

  return (
    <PostCard id="projects" timestamp="5h ago">
      <div className="space-y-3">
        {/* Caption */}
        <p className={`text-sm leading-relaxed ${tokens.cardText}`}>
          Here are some of the projects that I built. things I shipped to solve problems I actually had.
        </p>

        {/* Projects with separators */}
        <div>
          {projects.map((proj, idx) => (
            <div key={idx}>
              {/* Separator line (not on first item) */}
              {idx > 0 && <div className={`my-4 border-t ${tokens.borderStrong}`} />}

              <div className="flex gap-3">
                {/* Small image with border — click to expand */}
                <button
                  type="button"
                  onClick={() => setExpandedProject(proj)}
                  className="block shrink-0"
                >
                  <div className={`h-24 w-24 overflow-hidden rounded-lg border bg-slate-500 ${tokens.borderStrong}`}>
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="object-cover w-full h-full transition-all cursor-pointer hover:brightness-95"
                    />
                  </div>
                </button>

                {/* Text on the right */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className={`text-sm font-bold ${tokens.cardTitle}`}>{proj.title}</h3>
                  <p className={`mt-0.5 text-xs leading-relaxed ${tokens.softText}`}>{proj.description}</p>


                  {/* Casual links */}
                  <p className={`mt-0 text-[12px] ${tokens.muted}`}>
                    You can access it{' '}
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sky-600 hover:underline"
                    >
                      here
                    </a>
                    {' '}and here's the{' '}
                    <a
                      href={proj.code}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sky-600 hover:underline"
                    >
                      source code
                    </a>.
                  </p>

                  {/* Hashtag stacks */}
                  <p className={`mt-4 text-[11px] leading-relaxed ${tokens.accent}`}>
                    {proj.stacks.map((stack, i) => (
                      <span key={i} className="cursor-pointer hover:underline">
                        #{stack.replace(/\s+/g, '').replace(/\./g, '')}
                      </span>
                    )).reduce((prev, curr, i) => (
                      i === 0 ? [curr] : [...prev, ' ', curr]
                    ), [])}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Project Image Modal */}
      {expandedProject && (
        <div
          onClick={() => setExpandedProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        >
          {/* Close Button */}
          <button
            onClick={() => setExpandedProject(null)}
            aria-label="Close"
            className="absolute p-2 text-white transition-colors rounded-full top-4 right-4 hover:bg-white/10"
          >
            <X size={28} />
          </button>

          {/* Image + caption: stop propagation so clicking it doesn't close the modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center max-w-[90vw] max-h-[85vh]"
          >
            <img
              src={expandedProject.image}
              alt={expandedProject.title}
              className="max-w-[90vw] max-h-[75vh] rounded-lg object-contain shadow-2xl"
            />
            <p className="mt-3 text-sm font-semibold text-white">{expandedProject.title}</p>
          </div>
        </div>
      )}
    </PostCard>
  );
}