import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PostCard from '../PostCard';
import { X } from 'lucide-react';
import { getThemeTokens } from '../../theme';

export default function KeyboardPost() {
    const theme = useSelector((state) => state.theme.value);
    const tokens = getThemeTokens(theme);
    const isDark = theme === 'dark';
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    // Close the expanded photo on Escape key
    useEffect(() => {
        if (!isImageExpanded) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsImageExpanded(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isImageExpanded]);

    return (
        <PostCard id="keyboard-setup" timestamp="Just now">
            <div>
                <p className={`pb-1 text-sm leading-relaxed ${tokens.cardText}`}>
                    My custom mechanical keyboard build breakdown and current daily driver:
                </p>

                {/* Specs List */}
                <p className={tokens.cardText}><span className={`font-semibold ${tokens.cardTitle}`}>Keyboard:</span> Akko MOD005 RGB Mechanical Keyboard</p>
                <p className={tokens.cardText}><span className={`font-semibold ${tokens.cardTitle}`}>Switches:</span> Akko V5 Creamy Yellow Pro Switch</p>
                <p className={tokens.cardText}><span className={`font-semibold ${tokens.cardTitle}`}>Keycaps:</span> Akko Black & Bronze PBT Keycaps Set ASA (158 keys)</p>

                {/* Image Display */}
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
                    <img
                        src="/images/keyboard.jpg"
                        alt="Akko MOD005 Custom Mechanical Keyboard"
                        onClick={() => setIsImageExpanded(true)}
                        className="w-full max-h-100 cursor-pointer object-cover transition-all hover:brightness-95"
                    />
                </div>
            </div>

            {/* Expanded Image Modal */}
            {isImageExpanded && (
                <div
                    onClick={() => setIsImageExpanded(false)}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsImageExpanded(false)}
                        aria-label="Close"
                        className="absolute p-2 text-white transition-colors rounded-full top-4 right-4 hover:bg-white/10"
                    >
                        <X size={28} />
                    </button>

                    {/* Image itself: stop propagation so clicking the photo doesn't close it */}
                    <img
                        src="/images/keyboard.jpg"
                        alt="Akko MOD005 Custom Mechanical Keyboard"
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl animate-image-modal"
                        loading="eager"
                    />
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </PostCard>
    );
}