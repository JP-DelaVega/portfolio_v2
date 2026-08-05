import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Coins, X, Trophy, Zap } from 'lucide-react';
import { getThemeTokens } from '../theme';

const COMBO_WINDOW_MS = 1200;
const CRIT_CHANCE = 0.15;
const NORMAL_COINS = 1;
const CRIT_COINS = 5;
const COIN_ANIM_MS = 650;
const TOAST_MS = 750;
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
                ? (Math.random() - 0.5) * 12
                : (i - (coinCount - 1) / 2) * 14,
        }));

        setPopups((prev) => [...prev, ...newPopups]);
        newPopups.forEach((p) => {
            const timerId = setTimeout(() => {
                setPopups((prev) => prev.filter((x) => x.id !== p.id));
            }, COIN_ANIM_MS);
            popupTimersRef.current.push(timerId);
        });

        let toastText = null;
        if (isCrit) toastText = 'BURST!';
        else if (nextCombo >= 5) toastText = `x${nextCombo}!`;
        else if (nextCombo >= 3) toastText = 'GREAT!';
        else if (nextCombo === 2) toastText = 'NICE!';

        if (toastText) {
            clearTimeout(toastTimerRef.current);
            setToast({ key: now, text: toastText, crit: isCrit });
            toastTimerRef.current = setTimeout(() => setToast(null), TOAST_MS);
        }
    }, [combo, best]);

    return (
        <div className={`relative overflow-hidden rounded-xl border p-2 text-[10px] h-40 ${tokens.card}`}>
            {/* ===== BACKGROUND ===== */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {isDark ? (
                    <>
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(180deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)'
                        }} />
                        {/* Moon — moved to center-top */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{
                            background: 'radial-gradient(circle, rgba(253,224,71,0.2) 0%, transparent 70%)'
                        }} />
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-100/80 shadow-[0_0_10px_rgba(253,224,71,0.4)]" />
                        {/* Stars */}
                        <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
                        <div className="absolute top-4 left-10 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                        <div className="absolute top-2 left-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
                        <div className="absolute top-5 left-24 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute top-3 right-10 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.9s' }} />
                        <div className="absolute top-6 right-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.1s' }} />
                        <div className="absolute top-4 left-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="absolute top-6 left-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.3s' }} />
                        <div className="absolute top-3 right-24 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                        <div className="absolute top-5 left-20 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
                        <div className="absolute top-2 left-28 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.0s' }} />
                        <div className="absolute top-5 right-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        <div className="absolute top-3 left-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
                        <div className="absolute top-4 left-14 w-0.5 h-0.5 bg-blue-100 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                        <div className="absolute top-2 right-14 w-0.5 h-0.5 bg-blue-100 rounded-full animate-pulse" style={{ animationDelay: '1.0s' }} />
                        {/* Hills */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-indigo-950/70 rounded-t-[50%] scale-x-150 translate-y-3" />
                        <div className="absolute bottom-0 left-[-20%] w-[140%] h-5 bg-indigo-900/50 rounded-t-[100%]" />
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(180deg, #3b82f6 0%, #60a5fa 40%, #93c5fd 75%, #86efac 76%, #4ade80 78%, #22c55e 100%)'
                        }} />
                        {/* Sun — moved to center-top */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
                        {/* Clouds */}
                        <div className="absolute top-2 left-3 opacity-90 scale-75">
                            <div className="relative">
                                <div className="w-8 h-3 bg-white rounded-full" />
                                <div className="absolute -top-1.5 left-1.5 w-4 h-4 bg-white rounded-full" />
                                <div className="absolute -top-1 left-4 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="absolute top-5 right-6 opacity-80 scale-65">
                            <div className="relative">
                                <div className="w-8 h-3 bg-white rounded-full" />
                                <div className="absolute -top-1.5 left-1 w-4 h-4 bg-white rounded-full" />
                                <div className="absolute -top-1 left-3.5 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="absolute top-3 left-20 opacity-60 scale-50">
                            <div className="relative">
                                <div className="w-8 h-3 bg-white rounded-full" />
                                <div className="absolute -top-1.5 left-1.5 w-4 h-4 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="absolute top-4 right-20 opacity-50 scale-45">
                            <div className="relative">
                                <div className="w-7 h-2.5 bg-white rounded-full" />
                                <div className="absolute -top-1 left-1 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                        <div className="absolute top-2 left-32 opacity-40 scale-40">
                            <div className="relative">
                                <div className="w-7 h-2.5 bg-white rounded-full" />
                                <div className="absolute -top-1 left-1 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                        {/* Hills */}
                        <div className="absolute bottom-6 left-[-10%] w-24 h-10 bg-green-500 rounded-t-full opacity-90" />
                        <div className="absolute bottom-6 right-[-10%] w-28 h-12 bg-green-600 rounded-t-full opacity-90" />
                        <div className="absolute bottom-7 left-[20%] w-2.5 h-2.5 bg-green-700 rounded-full opacity-60" />
                        <div className="absolute bottom-7 left-[22%] w-1.5 h-1.5 bg-green-700 rounded-full opacity-60" />
                        {/* Ground */}
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#c2410c]" style={{
                            backgroundImage: 'linear-gradient(90deg, #9a3412 1px, transparent 1px), linear-gradient(0deg, #9a3412 1px, transparent 1px)',
                            backgroundSize: '10px 100%, 100% 50%'
                        }} />
                        <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-green-700/30" />
                        {/* Pipe */}
                        <div className="absolute bottom-4 left-3 flex flex-col items-center opacity-30 scale-75">
                            <div className="w-3 h-0.5 bg-green-700" />
                            <div className="w-2.5 h-2.5 bg-green-600 border-x border-green-800" />
                            <div className="w-2.5 h-2 bg-green-600 border-x border-green-800" />
                        </div>
                    </>
                )}
            </div>

            {/* ===== CONTENT ===== */}
            <div className="relative z-10 flex flex-col h-36">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                    <div className={`flex items-center gap-1.5 font-bold ${tokens.cardTitle}`}>
                        <div className="flex items-center justify-center w-4 h-4 rounded bg-amber-400 border border-amber-600">
                            <span className="text-amber-900 font-black text-[8px] leading-none">?</span>
                        </div>
                        <span className="text-[10px]">Coin Block</span>
                    </div>
                    {isPlaying && (
                        <button
                            onClick={quitGame}
                            aria-label="Quit game"
                            className={`flex items-center justify-center w-5 h-5 rounded-full shadow-sm transition-all hover:scale-110 active:scale-90 ${
                                isDark 
                                    ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-600' 
                                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                            }`}
                        >
                            <X size={10} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Game Stage */}
                <div className="relative flex-1 min-h-0">
                    {/* Idle */}
                    <div
                        className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all duration-500 ${
                            isPlaying ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                        }`}
                    >
                        <p className={`text-center text-[10px] leading-tight font-semibold ${isDark ? tokens.muted : 'text-slate-800'}`}>
                            Hit the block. Build combos.
                        </p>
                        {best > 0 && (
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                <Trophy size={8} />
                                {best}
                            </div>
                        )}
                        <button
                            onClick={startGame}
                            className="flex items-center gap-1 px-3 py-1 rounded-md font-bold text-white text-[10px] shadow-md bg-gradient-to-b from-red-500 to-red-600 border-b-2 border-red-800 active:border-b-0 active:translate-y-0.5 transition-all hover:brightness-110"
                        >
                            <Coins size={10} />
                            PLAY
                        </button>
                    </div>

                    {/* Playing */}
                    <div
                        className={`absolute inset-0 flex flex-col transition-all duration-500 ${
                            isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-bold text-[10px] ${isDark ? 'bg-slate-900/70 text-amber-400 border border-slate-700' : 'bg-white/80 text-amber-700 border border-amber-200'}`}>
                                    <Coins size={9} className="text-amber-500" />
                                    <span className="tabular-nums">{coins}</span>
                                </div>
                                {combo >= 2 && (
                                    <div className={`flex items-center gap-1 px-1 py-0.5 rounded font-bold text-[9px] ${isDark ? 'bg-sky-900/60 text-sky-300 border border-sky-700' : 'bg-sky-100 text-sky-700 border border-sky-200'}`}>
                                        <Zap size={8} />
                                        x{combo}
                                    </div>
                                )}
                            </div>
                            <div className={`text-[9px] font-bold ${isDark ? tokens.muted : 'text-slate-700'}`}>
                                BEST {best}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            {toast && (
                                <div
                                    key={toast.key}
                                    className={`absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap font-black text-[10px] tracking-wide animate-toast-pop ${
                                        toast.crit ? 'text-yellow-300' : 'text-white'
                                    }`}
                                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                                >
                                    {toast.text}
                                </div>
                            )}

                            <div className="relative" style={{ width: '2.75rem', height: '3rem' }}>
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
                                        <div className="mario-block-depth" />
                                    </div>
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
                    width: 2.25rem;
                    height: 2.25rem;
                    animation: sceneBounce 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
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
                    border-radius: 0.25rem;
                }
                .mario-block-face {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
                    border: 2px solid #451a03;
                    border-radius: 0.25rem;
                    box-shadow: inset 1px 1px 0 rgba(255,255,255,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    transition: transform 60ms ease;
                }
                .mario-block-depth {
                    position: absolute;
                    top: 1.5px;
                    left: 1.5px;
                    right: -2px;
                    bottom: -2px;
                    background: #451a03;
                    border-radius: 0.25rem;
                    z-index: -1;
                    pointer-events: none;
                }
                .mario-block-hitbox:active ~ .mario-block-face {
                    transform: translate(1px, 1px);
                }
                .mario-block-hitbox:active ~ .mario-block-depth {
                    transform: translate(0.5px, 0.5px);
                }
                .mario-block-q {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 1.2rem;
                    font-weight: 900;
                    color: #451a03;
                    line-height: 1;
                    user-select: none;
                    text-shadow: 0.5px 0.5px 0 rgba(255,255,255,0.3);
                }
                .mario-block-shine {
                    position: absolute;
                    top: 0.25rem;
                    left: 0.25rem;
                    width: 0.375rem;
                    height: 0.25rem;
                    background: rgba(255,255,255,0.45);
                    border-radius: 0.125rem;
                    transform: rotate(-45deg);
                    pointer-events: none;
                    z-index: 3;
                }
                .mario-block-shadow {
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 1.6rem;
                    height: 0.375rem;
                    background: rgba(0,0,0,0.2);
                    border-radius: 50%;
                    z-index: 1;
                    pointer-events: none;
                    animation: shadowReact 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .mario-coin {
                    position: absolute;
                    top: -2px;
                    left: 50%;
                    font-size: 0.9rem;
                    pointer-events: none;
                    animation: coinPop ${COIN_ANIM_MS}ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
                    z-index: 30;
                }
                @keyframes sceneBounce {
                    0%   { transform: translateY(0); }
                    30%  { transform: translateY(-8px); }
                    55%  { transform: translateY(1px); }
                    100% { transform: translateY(0); }
                }
                @keyframes shadowReact {
                    0%   { transform: translateX(-50%) scale(1);   opacity: 0.2; }
                    30%  { transform: translateX(-50%) scale(0.55);  opacity: 0.08; }
                    55%  { transform: translateX(-50%) scale(1.15);  opacity: 0.25; }
                    100% { transform: translateX(-50%) scale(1);   opacity: 0.2; }
                }
                @keyframes coinPop {
                    0%   { opacity: 0; transform: translate(calc(-50% + var(--tx, 0px)), 0) scale(0.5) rotate(0deg); }
                    20%  { opacity: 1; transform: translate(calc(-50% + var(--tx, 0px)), -12px) scale(1.1) rotate(90deg); }
                    60%  { opacity: 1; transform: translate(calc(-50% + var(--tx, 0px)), -28px) scale(1) rotate(240deg); }
                    100% { opacity: 0; transform: translate(calc(-50% + var(--tx, 0px)), -38px) scale(0.8) rotate(360deg); }
                }
                @keyframes toastPop {
                    0%   { opacity: 0; transform: translate(-50%, 4px) scale(0.85); }
                    15%  { opacity: 1; transform: translate(-50%, -4px) scale(1.05); }
                    40%  { opacity: 1; transform: translate(-50%, -6px) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -16px) scale(0.9); }
                }
                .animate-toast-pop {
                    animation: toastPop ${TOAST_MS}ms ease-out forwards;
                }
            `}</style>
        </div>
    );
}