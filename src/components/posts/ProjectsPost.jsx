import React from 'react';
import PostCard from '../PostCard';
import { ExternalLink } from 'lucide-react';
import { LuGithub } from 'react-icons/lu';

export default function ProjectsPost() {
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
                {/* Small image with border */}
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block shrink-0"
                >
                  <div className="w-24 h-24 overflow-hidden border rounded-lg bg-slate-500 border-slate-200">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="object-cover w-full h-full transition-all hover:brightness-95"
                    />
                  </div>
                </a>

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
    </PostCard>
  );
}