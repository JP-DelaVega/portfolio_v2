import React from 'react';
import { useSelector } from 'react-redux';
import { GitHubCalendar } from 'react-github-calendar';
import { LuGithub } from 'react-icons/lu';
import { getThemeTokens } from '../theme';


export default function GitHubActivity({ username="JP-DelaVega" }) {
    const theme = useSelector((state) => state.theme.value);
    const tokens = getThemeTokens(theme);
    const isDark = theme === 'dark';

    return (
        <div className={`p-5 border shadow-sm rounded-xl ${tokens.card}`}>
            <div className="flex items-center gap-2 mb-4">
                <LuGithub size={18} className={tokens.cardTitle} />
                <h2 className={`text-sm font-bold ${tokens.cardTitle}`}>GitHub Activity</h2>
            </div>

            <div className="overflow-x-auto">
                <GitHubCalendar
                    username={username}
                    colorScheme={isDark ? 'dark' : 'light'}
                    fontSize={12}
                    blockSize={11}
                    blockMargin={3}
                />
            </div>
        </div>
    );
}