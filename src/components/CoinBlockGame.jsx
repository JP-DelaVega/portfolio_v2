import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Coins, X, Trophy, Zap } from 'lucide-react';
import { getThemeTokens } from '../theme';

const COMBO_WINDOW_MS = 1200;
const CRIT_CHANCE = 0.15;
const NORMAL_COINS = 1;
const CRIT_COINS = 5;
const COIN_ANIM_MS = 700;
const TOAST_MS = 800;
const STORAGE_KEY = 'coinBlockBestScore';

function getStoredBest() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
        return 0;
    }
}

function setStoredBest(value) {
    try {
        window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
        /* ignore */
    }
}

export default function CoinBlockGame() {
    const theme = useSelector((state) => state.theme.value);
    const tokens = getThemeTokens(theme);
    const isDark = theme === 'dark';

    const [isPlaying, setIsPlaying] = useState(false);
    const [coins, setCoins] = useState(0);
    const [combo, setCombo] = useState(0);
    const [best, setBest] = useState(0);
    const [bounceTrigger, setBounceTrigger] = useState(0);
    const [toast, setToast] = useState(null);
    const [popups, setPopups] = useState([]);

    const lastClickRef = useRef(0);
    const toastTimerRef = useRef(null);
    const popupTimersRef = useRef([]);
    const popupIdRef = useRef(0);

    useEffect(() => {
        setBest(getStoredBest());
        return () => {
            clearTimeout(toastTimerRef.current);
            popupTimersRef.current.forEach(clearTimeout);
        };
    }, []);

    const startGame = useCallback(() => {
        setCoins(0);
        setCombo(0);
        setToast(null);
        setPopups([]);
        setIsPlaying(true);
    }, []);

    const quitGame = useCallback(() => {
        setIsPlaying(false);
        clearTimeout(toastTimerRef.current);
        popupTimersRef.current.forEach(clearTimeout);
        popupTimersRef.current = [];
        setToast(null);
        setPopups([]);
    }, []);

    const handleHit = useCallback(() => {
        const now = Date.now();
        const withinCombo = now - lastClickRef.current < COMBO_WINDOW_MS;
        lastClickRef.current = now;

        const isCrit = Math.random() < CRIT_CHANCE;
        const nextCombo = withinCombo ? combo + 1 : 1;
        const coinCount = isCrit ? CRIT_COINS : NORMAL_COINS;

        setCombo(nextCombo);
        setCoins((prev) => {
            const next = prev + coinCount;
            if (next > best) {
                setBest(next);
                setStoredBest(next);
            }
            return next;
        });

        setBounceTrigger((k) => k + 1);

        const newPopups = Array.from({ length: coinCount }, (_, i) => ({
            id: `${now}-${i}-${popupIdRef.current++}`,
            offsetX: coinCount === 1
                ? (Math.random() - 0.5) * 16
                : (i - (coinCount - 1) / 2) * 18,
        }));

        setPopups((prev) => [...prev, ...newPopups]);
        newPopups.forEach((p) => {
            const timerId = setTimeout(() => {
                setPopups((prev) => prev.filter((x) => x.id !== p.id));
            }, COIN_ANIM_MS);
            popupTimersRef.current.push(timerId);
        });

        let toastText = null;
        if (isCrit) toastText = 'COIN BURST!!';
        else if (nextCombo >= 5) toastText = `COMBO x${nextCombo}!`;
        else if (nextCombo >= 3) toastText = 'GREAT!';
        else if (nextCombo === 2) toastText = 'NICE!';

        if (toastText) {
            clearTimeout(toastTimerRef.current);
            setToast({ key: now, text: toastText, crit: isCrit });
            toastTimerRef.current = setTimeout(() => setToast(null), TOAST_MS);
        }
    }, [combo, best]);

    return (
        <div className={`relative overflow-hidden rounded-xl border p-3 text-xs ${tokens.card}`}>
            {/* Sky / Night background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={
                    isDark
                        ? {
                            background: `
                                radial-gradient(ellipse 70% 40% at 50% 0%, rgba(234,179,8,0.12) 0%, transparent 60%),
                                linear-gradient(180deg, #0f172a 0%, #1e293b 100%)
                              `,
                        }
                        : {
                            background: `
                                radial-gradient(ellipse 70% 40% at 50% 0%, rgba(234,179,8,0.2) 0%, transparent 60%),
                                linear-gradient(180deg, #60a5fa 0%, #93c5fd 50%, #86efac 50%, #4ade80 100%)
                              `,
                        }
                }
            />

            {/* Clouds or stars */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                {isDark ? (
                    <>
                        <div className="absolute top-3 left-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
                        <div className="absolute top-6 right-10 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
                    </>
                ) : (
                    <>
                        <div className="absolute top-4 left-8 w-6 h-2 bg-white rounded-full opacity-60" />
                        <div className="absolute top-3 left-7 w-3 h-3 bg-white rounded-full opacity-60" />
                        <div className="absolute top-3 left-11 w-3 h-3 bg-white rounded-full opacity-60" />
                        <div className="absolute top-8 right-6 w-5 h-2 bg-white rounded-full opacity-50" />
                        <div className="absolute top-7 right-5 w-2.5 h-2.5 bg-white rounded-full opacity-50" />
                        <div className="absolute top-7 right-8 w-2.5 h-2.5 bg-white rounded-full opacity-50" />
                    </>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-32">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-2 font-bold ${tokens.cardTitle}`}>
                        <div className="flex items-center justify-center w-5 h-5 rounded bg-amber-400 border border-amber-600">
                            <span className="text-amber-900 font-black text-[10px] leading-none">?</span>
                        </div>
                        <span>Coin Block</span>
                    </div>
                    {isPlaying && (
                        <button
                            onClick={quitGame}
                            aria-label="Quit"
                            className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-white/60 text-slate-500'}`}
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Game Stage */}
                <div className="relative flex-1 min-h-0">
                    {/* Idle */}
                    <div
                        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${isPlaying ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                            }`}
                    >
                        <p className={`text-center text-[11px] leading-snug font-bold ${isDark ? tokens.muted : 'text-white'}`} style={!isDark ? { textShadow: '0 1px 2px rgba(0,0,0,0.4)' } : {}}>
                            Hit the block. Build combos. Beat your best!
                        </p>
                        {best > 0 && (
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                <Trophy size={10} />
                                {best}
                            </div>
                        )}
                        <button
                            onClick={startGame}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-white text-[11px] shadow-md bg-gradient-to-b from-red-500 to-red-600 border-b-2 border-red-800 active:border-b-0 active:translate-y-0.5 transition-all hover:brightness-110"
                        >
                            <Coins size={12} />
                            PLAY
                        </button>
                    </div>

                    {/* Playing */}
                    <div
                        className={`absolute inset-0 flex flex-col transition-all duration-500 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                            }`}
                    >
                        {/* HUD */}
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${isDark ? 'bg-slate-800/80 text-amber-400' : 'bg-white/80 text-amber-700'}`}>
                                    <Coins size={11} className="text-amber-500" />
                                    <span className="tabular-nums">{coins}</span>
                                </div>
                                {combo >= 2 && (
                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold text-[10px] ${isDark ? 'bg-sky-900/50 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
                                        <Zap size={10} />
                                        x{combo}
                                    </div>
                                )}
                            </div>
                            <div className={`text-[10px] font-bold ${tokens.muted}`}>
                                BEST {best}
                            </div>
                        </div>

                        {/* Block Area */}
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            {toast && (
                                <div
                                    key={toast.key}
                                    className={`absolute -top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap font-black text-xs tracking-wide animate-toast-pop ${toast.crit ? 'text-yellow-300' : 'text-white'
                                        }`}
                                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                                >
                                    {toast.text}
                                </div>
                            )}

                            <div className="relative" style={{ width: '3.5rem', height: '4rem' }}>
                                {/* Block + Shadow wrapper — key change triggers bounce */}
                                <div key={bounceTrigger} className="mario-block-scene">
                                    <div className="mario-block">
                                        <button
                                            type="button"
                                            onClick={handleHit}
                                            aria-label="Hit block"
                                            className="mario-block-hitbox"
                                        />
                                        <div className="mario-block-face">
                                            <div className="mario-block-q">?</div>
                                        </div>
                                        <div className="mario-block-shine" />
                                        {/* 3D depth layer behind the face */}
                                        <div className="mario-block-depth" />
                                    </div>
                                    {/* Ground shadow that shrinks when block jumps */}
                                    <div className="mario-block-shadow" />
                                </div>

                                {popups.map((p) => (
                                    <span
                                        key={p.id}
                                        className="mario-coin"
                                        style={{ '--tx': `${p.offsetX}px` }}
                                    >
                                        🪙
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .mario-block-scene {
                    position: relative;
                    width: 3rem;
                    height: 3rem;
                    animation: sceneBounce 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .mario-block {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    z-index: 2;
                }

                .mario-block-hitbox {
                    position: absolute;
                    inset: 0;
                    z-index: 10;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    background: transparent;
                    border: none;
                    padding: 0;
                    border-radius: 0.375rem;
                }

                /* The visible yellow face */
                .mario-block-face {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
                    border: 2.5px solid #451a03;
                    border-radius: 0.375rem;
                    box-shadow: inset 1.5px 1.5px 0 rgba(255,255,255,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    transition: transform 60ms ease;
                }

                /* 3D extrusion — the "side" of the block */
                .mario-block-depth {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    right: -3px;
                    bottom: -3px;
                    background: #451a03;
                    border-radius: 0.375rem;
                    z-index: -1;
                    pointer-events: none;
                }

                /* Pressed state: face sinks down, depth stays */
                .mario-block-hitbox:active ~ .mario-block-face {
                    transform: translate(1.5px, 1.5px);
                }
                .mario-block-hitbox:active ~ .mario-block-depth {
                    transform: translate(0.5px, 0.5px);
                }

                .mario-block-q {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 1.6rem;
                    font-weight: 900;
                    color: #451a03;
                    line-height: 1;
                    user-select: none;
                    text-shadow: 0.5px 0.5px 0 rgba(255,255,255,0.3);
                }

                .mario-block-shine {
                    position: absolute;
                    top: 0.375rem;
                    left: 0.375rem;
                    width: 0.5rem;
                    height: 0.375rem;
                    background: rgba(255,255,255,0.45);
                    border-radius: 0.125rem;
                    transform: rotate(-45deg);
                    pointer-events: none;
                    z-index: 3;
                }

                /* Ground shadow — separate from the block so it can animate independently */
                .mario-block-shadow {
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2.2rem;
                    height: 0.5rem;
                    background: rgba(0,0,0,0.18);
                    border-radius: 50%;
                    z-index: 1;
                    pointer-events: none;
                    animation: shadowReact 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .mario-coin {
                    position: absolute;
                    top: -2px;
                    left: 50%;
                    font-size: 1.1rem;
                    pointer-events: none;
                    animation: coinPop ${COIN_ANIM_MS}ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
                    z-index: 30;
                }

                @keyframes sceneBounce {
                    0%   { transform: translateY(0); }
                    30%  { transform: translateY(-12px); }
                    55%  { transform: translateY(2px); }
                    100% { transform: translateY(0); }
                }

                @keyframes shadowReact {
                    0%   { transform: translateX(-50%) scale(1);   opacity: 0.18; }
                    30%  { transform: translateX(-50%) scale(0.55);  opacity: 0.08; }
                    55%  { transform: translateX(-50%) scale(1.15);  opacity: 0.22; }
                    100% { transform: translateX(-50%) scale(1);   opacity: 0.18; }
                }

                @keyframes coinPop {
                    0%   { opacity: 0; transform: translate(calc(-50% + var(--tx, 0px)), 0) scale(0.5) rotate(0deg); }
                    20%  { opacity: 1; transform: translate(calc(-50% + var(--tx, 0px)), -18px) scale(1.1) rotate(90deg); }
                    60%  { opacity: 1; transform: translate(calc(-50% + var(--tx, 0px)), -40px) scale(1) rotate(240deg); }
                    100% { opacity: 0; transform: translate(calc(-50% + var(--tx, 0px)), -56px) scale(0.8) rotate(360deg); }
                }

                @keyframes toastPop {
                    0%   { opacity: 0; transform: translate(-50%, 6px) scale(0.85); }
                    15%  { opacity: 1; transform: translate(-50%, -6px) scale(1.08); }
                    40%  { opacity: 1; transform: translate(-50%, -10px) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -26px) scale(0.9); }
                }
                .animate-toast-pop {
                    animation: toastPop ${TOAST_MS}ms ease-out forwards;
                }
            `}</style>
        </div>
    );
}