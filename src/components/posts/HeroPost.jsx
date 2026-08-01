import React from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../PostCard';
import { getThemeTokens } from '../../theme';
export default function HeroPost() {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  return (
    <PostCard id="hero" title="👋 Hello World!" timestamp="Pinned Post" initialLikes={6}>
      <div className="space-y-4">
        <p className={`leading-relaxed ${tokens.cardText}`}>
          Im a Software Engineer with <strong className={`font-semibold ${tokens.cardTitle}`}>4 years of professional experience</strong> in Full-Stack Development and enterprise Low-Code platforms. I build scalable, user-focused applications, solve complex cross-layer challenges, and am expanding my expertise into AI development by creating intelligent, LLM-powered solutions.
        </p>
      </div>
    </PostCard>
  );
}