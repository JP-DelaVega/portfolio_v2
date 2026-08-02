import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { LuMail, LuFileDown, LuX } from 'react-icons/lu';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getThemeTokens } from '../theme';
import MyDayStory from './MyDayStory';

const STORIES = [
    { id: 1, src: '/images/myday1.jpg', duration: 5000 },
    { id: 2, src: '/images/myday2.jpg', duration: 5000 },
];

export default function ProfileHeader() {
    const theme = useSelector((state) => state.theme.value);
    const tokens = getThemeTokens(theme);
    const isDark = theme === 'dark';
    const cardClasses = tokens.card;
    const borderClasses = tokens.border;
    const textPrimary = tokens.cardTitle;
    const textSecondary = tokens.softText;
    const textMuted = tokens.muted;
    const hoverClasses = isDark ? 'hover:bg-slate-800 hover:text-slate-100' : 'hover:bg-sky-50 hover:text-slate-900';
    const buttonBorder = isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-50 text-slate-700';
    const badgeClasses = isDark ? 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30' : 'text-emerald-700 bg-emerald-50 border-emerald-200';

    const [storyOpen, setStoryOpen] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);

    const hasStories = STORIES.length > 0;

    const openStory = () => {
        if (hasStories) setStoryOpen(true);
    };

    const closeStory = () => setStoryOpen(false);

    return (
        <div className={`mb-6 overflow-hidden border shadow-sm rounded-xl ${cardClasses}`} id="ProfileHeader">
            {/* Background Cover */}
            <div className="relative h-44 sm:h-56 bg-slate-800">
                <img
                    src="/images/background.png"
                    alt="Background Cover"
                    onClick={() => setExpandedImage('/images/background.png')}
                    className="h-full w-full cursor-pointer object-cover"
                />
            </div>

            {/* Profile Details Container */}
            <div className="relative px-4 sm:px-6 pb-6">
                <div className="flex flex-col justify-between gap-4 mb-4 -mt-16 sm:flex-row sm:items-end sm:-mt-20">
                    <div className="relative self-start">
                        {/* Profile Picture — opens My Day story on click */}
                        <div
                            className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-md sm:h-36 sm:w-36 cursor-pointer group"
                            onClick={openStory}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openStory();
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            title={hasStories ? 'View My Day' : ''}
                        >
                            <img
                                src="/images/profile.jpg"
                                alt="John Philip Dela Vega"
                                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                            />
                        </div>

                        <span className="absolute w-4 h-4 border-2 border-white rounded-full bottom-2 right-2 bg-emerald-500" title="Available for work"></span>
                    </div>

                    {/* Quick Action CTAs */}
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <a
                            href="https://github.com/JP-DelaVega"
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-1.5 px-1 rounded-2xl transition-colors ${isDark ? 'text-slate-300 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'} ${hoverClasses}`}
                        >
                            <FaGithub size={15} /> GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/john-philip-dela-vega-29b51820a/"
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-1.5 px-1 rounded-2xl transition-colors ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'} ${hoverClasses}`}
                        >
                            <FaLinkedin size={15} /> LinkedIn
                        </a>
                    </div>
                </div>

                <div>
                    {/* Name + badge: wraps to its own line on narrow screens instead of overflowing */}
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className={`text-xl sm:text-2xl font-extrabold ${textPrimary}`}>John Philip Dela Vega</h1>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-bold border rounded-full whitespace-nowrap ${badgeClasses}`}>
                            Open to New Opportunities
                        </div>
                    </div>
                    <p className={`font-medium text-sm mt-0.5 ${textSecondary}`}>
                        Full-Stack Developer • Technology Consultant
                    </p>
                    <p className={`mt-1 text-xs ${textMuted}`}>
                        Pampanga, Philippines
                    </p>
                </div>

                {/* Social Links — wraps and goes full-width per button on mobile, inline on larger screens */}
                <div className={`flex flex-wrap items-center gap-2 sm:gap-3 pt-4 mt-4 text-xs font-semibold border-t ${borderClasses}`}>
                    <div className="relative group flex-1 sm:flex-none min-w-[160px] sm:min-w-0">
                        <a
                            href="mailto:jayplought@gmail.com"
                            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center justify-center sm:justify-start gap-1.5 shadow-sm transition-all"
                        >
                            <LuMail size={14} /> Connect / Email
                        </a>

                        {/* Tooltip — hidden on touch/mobile since there's no hover state there */}
                        <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
                            jayplought@gmail.com
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                    <a
                        href="https://drive.google.com/file/d/1l7nx3t_WN7B6VSL3sH9oXmpxTbKBrGOR/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className={`flex-1 sm:flex-none min-w-[120px] sm:min-w-0 px-4 py-2 rounded-lg border font-semibold text-xs flex items-center justify-center sm:justify-start gap-1.5 transition-all ${buttonBorder}`}
                    >
                        <LuFileDown size={14} /> Resume
                    </a>
                </div>
            </div>

            {/* Expanded Image Modal (background cover) */}
            {expandedImage && (
                <div
                    onClick={() => setExpandedImage(null)}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                >
                    <button
                        onClick={() => setExpandedImage(null)}
                        aria-label="Close"
                        className="absolute top-4 right-4 z-50 p-2 text-white rounded-full transition-colors hover:bg-white/10"
                    >
                        <LuX size={28} />
                    </button>

                    <img
                        src={expandedImage}
                        alt="Expanded view"
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl animate-image-modal"
                        loading="eager"
                    />
                </div>
            )}

            {/* My Day story viewer */}
            <MyDayStory
                isOpen={storyOpen}
                onClose={closeStory}
                stories={STORIES}
                name="John Philip Dela Vega"
                avatarSrc="/images/profile.jpg"
            />
        </div>
    );
}