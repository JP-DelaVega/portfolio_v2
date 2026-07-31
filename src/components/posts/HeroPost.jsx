import React from 'react';
import PostCard from '../PostCard';
export default function HeroPost() {
  return (
    <PostCard id="hero" title="👋 Hello World!" timestamp="Pinned Post" initialLikes={6}> 
      <div className="space-y-4">
        <p className="leading-relaxed text-slate-700">
          Im a Software Engineer with <strong className="font-semibold text-slate-900">4 years of professional experience</strong> in Full-Stack Development and enterprise Low-Code platforms. I build scalable, user-focused applications, solve complex cross-layer challenges, and am expanding my expertise into AI development by creating intelligent, LLM-powered solutions.
        </p>


      </div>
    </PostCard>
  );
}