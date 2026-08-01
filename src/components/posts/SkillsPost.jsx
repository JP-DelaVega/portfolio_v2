import React from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../PostCard';
import { getThemeTokens } from '../../theme';

export default function SkillsPost() {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  const skills = {
    Languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
    Frontend: ['React', 'Vue.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Figma'],
    'Backend & DB': ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL', 'Oracle'],
    'AI & Data': ['RAG Systems', 'LLM Integration', 'Tool Calling'],
    'Low-Code': ['OutSystems', 'Vantiq'],
    'Cloud & DevOps': ['Microsoft Azure', 'Docker', 'Git & GitHub'],
  };

  return (
    <PostCard id="skills" timestamp="1h ago" theme={theme}>
      <div className={`space-y-4 text-sm leading-relaxed ${tokens.cardText}`}>
        <p>
          Here are my skills. The tools and tech I work with day to day.
          Always learning, always shipping.
        </p>

        <div className="space-y-3">
          {Object.entries(skills).map(([category, tags]) => (
            <p key={category}>
              <span className={`font-semibold ${tokens.cardTitle}`}>{category}:</span>{' '}
              {tags.map((tag, i) => (
                <span key={tag}>
                  <span className={tokens.cardText}>
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