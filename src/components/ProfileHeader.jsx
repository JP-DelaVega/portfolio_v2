import React from 'react';
import { LuMail, LuFileDown, LuCheck } from 'react-icons/lu';
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function ProfileHeader() {
    return (
        <div className="mb-6 overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
            {/* Background Cover */}
            <div className="relative h-44 sm:h-56 bg-slate-800">
                <img
                    src="./public/images/background.png"
                    alt="Background Cover"
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Profile Details Container */}
            <div className="relative px-6 pb-6">
                <div className="flex flex-col justify-between gap-4 mb-4 -mt-16 sm:flex-row sm:items-end sm:-mt-20">
                    <div className="relative">
                        <img
                            src="./public/images/profile.jpg"
                            alt="John Philip Dela Vega"
                            className="object-cover bg-white border-4 border-white rounded-full shadow-md w-28 h-28 sm:w-36 sm:h-36"
                        />
                        <span className="absolute w-4 h-4 border-2 border-white rounded-full bottom-2 right-2 bg-emerald-500" title="Available for work"></span>
                    </div>

                    {/* Quick Action CTAs */}
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="https://github.com/JP-DelaVega"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-slate-600 px-1 rounded-2xl hover:bg-sky-50 hover:text-slate-900 transition-colors"
                        >
                            <FaGithub size={15} /> GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/john-philip-dela-vega-29b51820a/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-sky-600 px-1 rounded-2xl hover:bg-sky-50 hover:text-sky-700 transition-colors"
                        >
                            <FaLinkedin size={15} /> LinkedIn
                        </a>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-extrabold text-slate-900">John Philip Dela Vega</h1>
                        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold border rounded-full text-emerald-700 bg-emerald-50 border-emerald-200">
                            {/**<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> */}
                            Open to New Opportunities
                        </div>
                    </div>
                    <p className="text-slate-600 font-medium text-sm mt-0.5">
                        Full-Stack & AI Developer • Technology Consultant
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        San Fernando, Pampanga, Philippines
                    </p>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-4 mt-4 text-xs font-semibold border-t border-slate-100">

                    <div className="relative group inline-block">
                        <a
                            href="mailto:jayplought@gmail.com"
                            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                            <LuMail size={14} /> Connect / Email
                        </a>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
                            jayplought@gmail.com
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                    <a
                        href="https://drive.google.com/file/d/1l7nx3t_WN7B6VSL3sH9oXmpxTbKBrGOR/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                        <LuFileDown size={14} /> Resume
                    </a>
                </div>
            </div>
        </div>
    );
}