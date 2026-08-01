import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LuMail, LuFileDown, LuX } from 'react-icons/lu';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getThemeTokens } from '../theme';

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

    // null when closed, otherwise the src of the image currently expanded
    const [expandedImage, setExpandedImage] = useState(null);

    // Close the expanded photo on Escape key
    useEffect(() => {
        if (!expandedImage) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setExpandedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [expandedImage]);

    return (
        <div className={`mb-6 overflow-hidden border shadow-sm rounded-xl ${cardClasses}`} id="ProfileHeader">
            {/* Background Cover */}
            <div className="relative h-44 sm:h-56 bg-slate-800">
                <img
                    src="/images/background.png"
                    alt="Background Cover"
                    onClick={() => setExpandedImage('/images/background.png')}
                    className="object-cover w-full h-full cursor-pointer "
                />
            </div>

            {/* Profile Details Container */}
            <div className="relative px-6 pb-6">
                <div className="flex flex-col justify-between gap-4 mb-4 -mt-16 sm:flex-row sm:items-end sm:-mt-20">
                    <div className="relative">
                        <img
                            src="/images/profile.jpg"
                            alt="John Philip Dela Vega"
                            onClick={() => setExpandedImage('/images/profile.jpg')}
                            className="object-cover bg-white border-4 border-white rounded-full shadow-md w-28 h-28 sm:w-36 sm:h-36 cursor-pointer transition-transform hover:scale-102"
                        />
                        <span className="absolute w-4 h-4 border-2 border-white rounded-full bottom-2 right-2 bg-emerald-500" title="Available for work"></span>
                    </div>

                    {/* Quick Action CTAs */}
                    <div className="flex flex-wrap gap-4">
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
                    <div className="flex items-center gap-2">
                        <h1 className={`text-2xl font-extrabold ${textPrimary}`}>John Philip Dela Vega</h1>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold border rounded-full ${badgeClasses}`}>
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

                {/* Social Links */}
                <div className={`flex items-center gap-3 pt-4 mt-4 text-xs font-semibold border-t ${borderClasses}`}>

                    <div className="relative inline-block group">
                        <a
                            href="mailto:jayplought@gmail.com"
                            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                            <LuMail size={14} /> Connect / Email
                        </a>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
                            jayplought@gmail.com
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                    <a
                        href="https://drive.google.com/file/d/1l7nx3t_WN7B6VSL3sH9oXmpxTbKBrGOR/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className={`px-4 py-2 rounded-lg border font-semibold text-xs flex items-center gap-1.5 transition-all ${buttonBorder}`}
                    >
                        <LuFileDown size={14} /> Resume
                    </a>
                </div>
            </div>

            {/* Expanded Image Modal (profile picture or background cover) */}
            {expandedImage && (
                <div
                    onClick={() => setExpandedImage(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                >
                    <button
                        onClick={() => setExpandedImage(null)}
                        aria-label="Close"
                        className="absolute p-2 text-white transition-colors rounded-full top-4 right-4 hover:bg-white/10"
                    >
                        <LuX size={28} />
                    </button>

                    <img
                        src={expandedImage}
                        alt="Expanded view"
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
}