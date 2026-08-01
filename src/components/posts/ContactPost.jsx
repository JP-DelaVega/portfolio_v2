import React from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../PostCard';
import { Mail } from 'lucide-react';
import { getThemeTokens } from '../../theme';

export default function ContactPost() {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  return (
    <PostCard id="contact" title="Let's Connect!" timestamp="2d ago">
      <div className="space-y-3">
        <p className={`text-sm leading-relaxed ${tokens.cardText}`}>
          You've reached the end of my posts. If you want to connect, collaborate, or just talk tech, you can contact me here. 📩
        </p>

        <p className={`text-sm ${tokens.cardText}`}>
          I'm open to discussing Full-Stack, Low-Code, or AI Engineering opportunities. Always happy to hear about interesting projects!
        </p>

        <a
          href="mailto:jayplought@gmail.com"
          className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline ${tokens.link}`}
        >
          <Mail size={14} /> jayplought@gmail.com
        </a>
      </div>
    </PostCard>
  );
}