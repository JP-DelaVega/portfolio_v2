import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LuX, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

/**
 * Full-screen "My Day" style story viewer.
 *
 * Props:
 * - isOpen: boolean — whether the viewer is shown
 * - onClose: () => void — called when the viewer should close
 * - stories: [{ id, src, duration }] — list of story slides
 * - name: string — display name in the header
 * - avatarSrc: string — small avatar shown in the header
 */
export default function MyDayStory({ isOpen, onClose, stories = [], name = '', avatarSrc = '' }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(0);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);

    const hasStories = stories.length > 0;

    const resetToStart = useCallback(() => {
        setCurrentIndex(0);
        setProgress(0);
        progressRef.current = 0;
        lastTimeRef.current = null;
    }, []);

    // Reset to first slide every time the viewer opens
    useEffect(() => {
        if (isOpen) resetToStart();
    }, [isOpen, resetToStart]);

    const close = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        onClose?.();
    }, [onClose]);

    const goNext = useCallback(() => {
        setCurrentIndex((i) => {
            if (i < stories.length - 1) {
                setProgress(0);
                progressRef.current = 0;
                lastTimeRef.current = null;
                return i + 1;
            }
            return i; // stays on last story — does not auto-close
        });
    }, [stories.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex((i) => {
            if (i > 0) {
                setProgress(0);
                progressRef.current = 0;
                lastTimeRef.current = null;
                return i - 1;
            }
            return i;
        });
    }, []);

    // Auto-advance with requestAnimationFrame
    useEffect(() => {
        if (!isOpen || !hasStories) return;

        const duration = stories[currentIndex]?.duration ?? 5000;

        const tick = (timestamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const delta = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            progressRef.current += delta;
            const pct = Math.min((progressRef.current / duration) * 100, 100);
            setProgress(pct);

            if (progressRef.current >= duration) {
                goNext();
                lastTimeRef.current = null;
            } else {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isOpen, hasStories, currentIndex, stories, goNext]);

    // Keyboard controls
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, close, goNext, goPrev]);

    if (!isOpen || !hasStories) return null;

    const current = stories[currentIndex];

    return (
        <div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={close}
        >
            {/* Close button */}
            <button
                onClick={(e) => { e.stopPropagation(); close(); }}
                aria-label="Close"
                className="absolute top-4 right-4 z-50 p-2 text-white transition-colors rounded-full hover:bg-white/10"
            >
                <LuX size={28} />
            </button>

            {/* Desktop: buttons on sides | Mobile: buttons below */}
            <div className="flex items-center gap-2 sm:gap-3 w-full max-w-lg px-4 sm:px-0">
                {/* Prev — desktop only (left side) */}
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    disabled={currentIndex === 0}
                    className={`hidden sm:flex p-2.5 rounded-full text-white transition-colors shrink-0 ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                    aria-label="Previous story"
                >
                    <LuChevronLeft size={24} />
                </button>

                {/* Story card */}
                <div
                    className="relative flex-1 aspect-[9/16] sm:aspect-[4/5] max-h-[75vh] sm:max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Progress bars */}
                    <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-30">
                        {stories.map((s, idx) => (
                            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-none"
                                    style={{
                                        width:
                                            idx < currentIndex
                                                ? '100%'
                                                : idx === currentIndex
                                                    ? `${progress}%`
                                                    : '0%',
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="absolute top-7 left-3 right-12 flex items-center gap-2.5 z-30 pointer-events-none">
                        <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white bg-slate-700">
                            <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white leading-tight">{name}</div>
                            <div className="text-[11px] text-white/70">My Day</div>
                        </div>
                    </div>

                    {/* Story image */}
                    <img
                        key={current.id}
                        src={current.src}
                        alt={`Story ${currentIndex + 1}`}
                        className="h-full w-full object-cover animate-fade-in"
                        loading="eager"
                    />

                    {/* Tap zones (mobile-friendly fallback) */}
                    <div className="absolute inset-0 flex z-20 sm:hidden">
                        <div className="w-1/2 h-full" onClick={(e) => { e.stopPropagation(); goPrev(); }} />
                        <div className="w-1/2 h-full" onClick={(e) => { e.stopPropagation(); goNext(); }} />
                    </div>
                </div>

                {/* Next — desktop only (right side) */}
                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    disabled={currentIndex === stories.length - 1}
                    className={`hidden sm:flex p-2.5 rounded-full text-white transition-colors shrink-0 ${currentIndex === stories.length - 1 ? 'opacity-30 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                    aria-label="Next story"
                >
                    <LuChevronRight size={24} />
                </button>
            </div>

            {/* Mobile nav buttons — below the card */}
            <div className="flex sm:hidden items-center gap-6 mt-4">
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    disabled={currentIndex === 0}
                    className={`p-2.5 rounded-full text-white transition-colors ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                    aria-label="Previous story"
                >
                    <LuChevronLeft size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    disabled={currentIndex === stories.length - 1}
                    className={`p-2.5 rounded-full text-white transition-colors ${currentIndex === stories.length - 1 ? 'opacity-30 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                    aria-label="Next story"
                >
                    <LuChevronRight size={24} />
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}