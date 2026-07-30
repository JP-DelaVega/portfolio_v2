import React from 'react';
import PostCard from '../PostCard';
import { Code2, Laptop, Server, Brain, Box, Cloud } from 'lucide-react';

export default function SkillsPost() {
  const skills = {
    Languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
    Frontend: ['React', 'Vue.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Figma'],
    'Backend & DB': ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL', 'Oracle'],
    'AI & Data': ['RAG Systems', 'LLM Integration', 'Tool Calling'],
    'Low-Code': ['OutSystems', 'Vantiq'],
    'Cloud & DevOps': ['Microsoft Azure', 'Docker', 'Git & GitHub'],
  };

  return (
    <PostCard id="skills" timestamp="1h ago">
      <div className="space-y-4 text-sm leading-relaxed text-slate-800">
        <p>
          Here are my skills. The tools and tech I work with day to day. 
          Always learning, always shipping.
        </p>

        <div className="space-y-3">
          {Object.entries(skills).map(([category, tags]) => (
            <p key={category}>
              <span className="font-semibold text-slate-900">{category}:</span>{' '}
              {tags.map((tag, i) => (
                <span key={tag}>
                  <span className="text-slate-700">
                    {tag}
                  </span>
                  {i < tags.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </PostCard>
  );
}