import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, Globe, Check } from 'lucide-react';
import { BiSolidLike } from "react-icons/bi";

export default function PostCard({ id, title, timestamp = 'Just now', children, initialLikes = 1 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLikingAnim, setIsLikingAnim] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setIsLikingAnim(true);
    setTimeout(() => setIsLikingAnim(false), 300);

    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText('https://www.jp-dev.site/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article id={id} className="mb-6 overflow-hidden transition-all bg-white border shadow-sm rounded-xl border-slate-200 hover:border-slate-300">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src="/images/profile.jpg"
            alt="John Philip"
            className="object-cover border rounded-full w-11 h-11 border-slate-200 ring-2 ring-sky-500/20"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold cursor-pointer text-slate-900 hover:underline">
                John Philip Dela Vega
              </h3>
              <span className="bg-sky-100 text-sky-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Author
              </span>
            </div>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <span>Full-Stack & AI Developer</span>
              <span>•</span>
              <span>{timestamp}</span>
              <span>•</span>
              <Globe size={12} className="text-slate-400" />
            </p>
          </div>
        </div>
      </div>

      {/* Post Title */}
      {title && (
        <div className="px-5 pt-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
        </div>
      )}

      {/* Post Body */}
      <div className="p-5 text-sm leading-relaxed text-slate-700">
        {children}
      </div>

      {/* Social Interactions Bar */}
      <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[11px]">
            <BiSolidLike/>
          </span>
          <span>{likes} likes</span>
        </div>
        <div>
          <span>0 comments</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-2 py-1 border-t border-slate-100">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs transition-all active:scale-95 ${hasLiked ? 'text-sky-600 bg-sky-50' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <ThumbsUp
            size={20}
            className={`transition-transform duration-200 ${isLikingAnim ? 'scale-125 -rotate-12' : 'scale-100'
              } ${hasLiked ? 'fill-sky-600' : ''}`}
          />
          <span>{hasLiked ? 'Liked' : 'Like'}</span>
        </button>

        {/* Comment Button (Disabled) */}
        <button
          disabled
          title="Comments are disabled"
          className="flex items-center justify-center flex-1 gap-2 py-2 text-xs font-semibold rounded-lg cursor-not-allowed text-slate-300"
        >
          <MessageSquare size={16} />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="relative flex items-center justify-center flex-1 gap-2 py-2 text-xs font-semibold transition-all rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95"
        >
          {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
          <span className={copied ? 'text-emerald-600' : ''}>
            {copied ? 'Link Copied!' : 'Share'}
          </span>
        </button>
      </div>
    </article>
  );
}