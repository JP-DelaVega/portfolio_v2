import React from 'react';
import PostCard from '../PostCard';
import { Mail } from 'lucide-react';

export default function ContactPost() {
  return (
    <PostCard id="contact" title="Let's Connect!" timestamp="2d ago">
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-800">
          You've reached the end of my posts. If you want to connect, collaborate, or just talk tech, you can contact me here. 📩
        </p>

        <p className="text-sm text-slate-700">
          I'm open to discussing Full-Stack, Low-Code, or AI Engineering opportunities. Always happy to hear about interesting projects!
        </p>

        <a
          href="mailto:jayplought@gmail.com"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
        >
          <Mail size={14} /> jayplought@gmail.com
        </a>
      </div>
    </PostCard>
  );
}