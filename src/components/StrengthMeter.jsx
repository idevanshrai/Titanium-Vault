import { useEffect, useState } from 'react';

export const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-800' };

    let score = 0;
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (/[A-Z]/.test(password)) score += 0.5;
    if (/[0-9]/.test(password)) score += 0.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const finalScore = Math.min(4, Math.floor(score));

    let label = 'Weak';
    let color = 'bg-red-500';

    if (finalScore === 0) {
        label = 'Very Weak';
        color = 'bg-red-900/50';
    } else if (finalScore === 1) {
        label = 'Weak';
        color = 'bg-red-500';
    } else if (finalScore === 2) {
        label = 'Fair';
        color = 'bg-yellow-500';
    } else if (finalScore === 3) {
        label = 'Good';
        color = 'bg-teal-500';
    } else {
        label = 'Strong';
        color = 'bg-emerald-400';
    }

    return { score: finalScore, label, color };
};

const StrengthMeter = ({ password }) => {
    const [strengthInfo, setStrengthInfo] = useState({ score: 0, label: '', color: '' });

    useEffect(() => {
        setStrengthInfo(calculateStrength(password));
    }, [password]);

    const { score, color } = strengthInfo;

    return (
        <>
            {Array(4).fill(0).map((_, i) => (
                <div
                    key={i}
                    className={`h-full flex-1 transition-colors duration-500 ${i < score ? color : 'bg-slate-800'} ${i === 3 && score >= 3 ? 'shadow-[0_-2px_6px_rgba(203,213,225,0.5)]' : ''}`}
                ></div>
            ))}
        </>
    );
};

export default StrengthMeter;
