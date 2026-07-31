import React from 'react';
import PostCard from '../PostCard';

export default function KeyboardPost() {
    return (
        <PostCard id="keyboard-setup" timestamp="Just now">
            <div>
                <p className="text-sm leading-relaxed text-slate-800 pb-1">
                    My custom mechanical keyboard build breakdown and current daily driver:
                </p>

                {/* Specs List */}
                <p><span className="font-semibold text-slate-900">Keyboard:</span> Akko MOD005 RGB Mechanical Keyboard</p>
                <p><span className="font-semibold text-slate-900">Switches:</span> Akko V5 Creamy Yellow Pro Switch</p>
                <p><span className="font-semibold text-slate-900">Keycaps:</span> Akko Black & Bronze PBT Keycaps Set ASA (158 keys)</p>

                {/* Image Display */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 mt-3">
                    <img
                        src="/images/keyboard.jpg"
                        alt="Akko MOD005 Custom Mechanical Keyboard"
                        className="object-cover w-full max-h-100"
                    />
                </div>
            </div>
        </PostCard>
    );
}