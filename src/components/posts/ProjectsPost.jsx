import React, { useState, useEffect } from 'react';
import PostCard from '../PostCard';
import { ExternalLink, X } from 'lucide-react';
import { LuGithub } from 'react-icons/lu';

export default function ProjectsPost() {
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
        <p className="text-sm leading-relaxed text-slate-800">
          Here are some of the projects that I built. things I shipped to solve problems I actually had.
        </p>

        {/* Projects with separators */}
        <div>
          {projects.map((proj, idx) => (
            <div key={idx}>
              {/* Separator line (not on first item) */}
              {idx > 0 && <div className="my-4 border-t border-slate-200" />}

              <div className="flex gap-3">
                {/* Small image with border — click to expand */}
                <button
                  type="button"
                  onClick={() => setExpandedProject(proj)}
                  className="block shrink-0"
                >
                  <div className="w-24 h-24 overflow-hidden border rounded-lg bg-slate-500 border-slate-200">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="object-cover w-full h-full transition-all cursor-pointer hover:brightness-95"
                    />
                  </div>
                </button>

                {/* Text on the right */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{proj.description}</p>


                  {/* Casual links */}
                  <p className="text-[12px] text-slate-500 mt-0">
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
                  <p className="text-[11px] text-sky-600 mt-4 leading-relaxed">
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