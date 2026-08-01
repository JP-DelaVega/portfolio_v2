import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ThumbsUp, MessageSquare, Share2, Globe, Check, Send } from 'lucide-react';
import { BiSolidLike } from "react-icons/bi";
import { getThemeTokens } from '../theme';

export default function PostCard({
  id,
  title,
  timestamp = 'Just now',
  children,
  initialLikes = 1,
  initialComments = [],
}) {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  const isDark = theme === 'dark';
  const surfaceClass = tokens.card;
  const borderClass = tokens.border;
  const mutedText = tokens.muted;
  const primaryText = tokens.cardTitle;
  const secondaryText = tokens.cardText;
  const subtleSurface = tokens.cardSoft;
  const inputClass = tokens.input;
  const buttonGhost = tokens.buttonGhost;
  const activeButton = tokens.activeButton;
 const commentBubble = isDark
  ? 'bg-slate-800/80 border-slate-600/50 text-slate-200'
  : 'bg-white border-slate-200 text-slate-800';

  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLikingAnim, setIsLikingAnim] = useState(false);
  const [copied, setCopied] = useState(false);

  const [comments, setComments] = useState(() =>
    initialComments.map((c, i) => ({
      id: c.id ?? Date.now() + i,
      text: c.text,
      timestamp:
        c.timestamp ??
        new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
    }))
  );
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(initialComments.length > 0);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLike = () => {
    setIsLikingAnim(true);
    setTimeout(() => setIsLikingAnim(false), 300);

    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText('https://www.jp-dev.site/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText('');
    setShowComments(true);
  };

  return (
    <article
      id={id}
      className={`mb-6 overflow-hidden border shadow-sm rounded-xl transition-all ${surfaceClass}`}
    >
      {/* Post Header */}
      <div className={`flex items-center justify-between p-4 border-b ${borderClass}`} onClick={() => scrollToSection('topHeader')}>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-200 ring-2 ring-sky-500/20">
            <img src="/images/profile.jpg" alt="John Philip" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className={`text-sm font-bold cursor-pointer hover:underline ${primaryText}`} onClick={() => scrollToSection('topHeader')}>
                John Philip Dela Vega
              </h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
                Author
              </span>
            </div>
            <p className={`flex items-center gap-1 text-xs ${mutedText}`}>
              <span>Full-Stack Developer</span>
              <span>•</span>
              <span>{timestamp}</span>
              <span>•</span>
              <Globe size={12} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            </p>
          </div>
        </div>
      </div>

      {/* Post Title */}
      {title && (
        <div className="px-5 pt-4">
          <h2 className={`text-xl font-bold tracking-tight ${secondaryText}`}>
            {title}
          </h2>
        </div>
      )}

      {/* Post Body */}
      <div className={`p-5 text-sm leading-relaxed ${secondaryText}`}>{children}</div>

      {/* Social Interactions Bar */}
      <div className={`flex items-center justify-between border-t px-5 py-2.5 text-xs font-medium ${borderClass} ${subtleSurface} ${mutedText}`}>
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[11px] text-white">
            <BiSolidLike />
          </span>
          <span>{likes} likes</span>
        </div>
        <button onClick={() => setShowComments((s) => !s)} className="hover:underline">
          {comments.length} comments
        </button>
      </div>

      {/* Action Buttons */}
      <div className={`flex items-center justify-between border-t px-2 py-1 ${borderClass}`}>
        <button
          onClick={handleLike}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${hasLiked ? activeButton : `${buttonGhost}`
            }`}
        >
          <ThumbsUp
            size={20}
            className={`transition-transform duration-200 ${isLikingAnim ? 'scale-125 -rotate-12' : 'scale-100'} ${hasLiked ? 'fill-sky-600' : ''}`}
          />
          <span>{hasLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={() => setShowComments((s) => !s)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${showComments ? activeButton : `${buttonGhost}`
            }`}
        >
          <MessageSquare size={16} />
          <span>Comment</span>
        </button>

        <button
          onClick={handleShare}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all active:scale-95 ${buttonGhost}`}
        >
          {copied ? (
            <Check size={16} className="text-emerald-600" />
          ) : (
            <Share2 size={16} />
          )}
          <span className={copied ? 'text-emerald-600' : ''}>
            {copied ? 'Link Copied!' : 'Share'}
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t transition-all duration-300 ease-out ${borderClass} ${subtleSurface} ${showComments ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="space-y-4 p-4">
          {comments.length === 0 ? (
            <p className={`text-center text-xs ${mutedText}`}>
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200">
                    <img src="/images/profile.jpg" alt="John Philip" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-xl rounded-tl-sm border px-3 py-2 shadow-sm ${commentBubble}`}>
                      <div className="mb-0.5 flex items-center gap-2">
                        <span className={`text-xs font-bold ${primaryText}`}>
                          John Philip Dela Vega
                        </span>
                        <span className={`text-[10px] ${mutedText}`}>
                          • {comment.timestamp}
                        </span>
                      </div>
                      <p className={`text-[13px] leading-relaxed ${secondaryText}`}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200">
              <img src="/images/profile.jpg" alt="John Philip" className="h-full w-full object-cover" />
            </div>
            <div className={`flex flex-1 items-center rounded-full border px-3 py-1.5 transition-all focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-300 ${inputClass}`}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent text-[13px] outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`rounded-full p-1.5 transition-colors ${commentText.trim()
                  ? 'text-sky-600 hover:bg-sky-50'
                  : 'text-slate-300 cursor-default'
                  }`}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </article>
  );
}