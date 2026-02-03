import { useState, useCallback, useMemo } from 'react';
import StrengthMeter, { calculateStrength } from './StrengthMeter';

const PasswordGenerator = () => {
    // State
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        mixed: false,
        lowercase: false,
        numbers: false,
        symbols: false,
    });
    const [complexity, setComplexity] = useState('unique'); // unique, easy-read, easy-say
    const [keyword, setKeyword] = useState('');
    const [copied, setCopied] = useState(false);
    const [showHistoryBanner, setShowHistoryBanner] = useState(false);
    const [showComplexityWarning, setShowComplexityWarning] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Helpers
    const CHARSETS = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
        ambiguous: '1lI0O',
    };

    const handleOptionChange = (key) => {
        // If Easy to Say is active, prevent enabling numbers/symbols and show warning
        if (complexity === 'easy-say' && (key === 'numbers' || key === 'symbols')) {
            setShowComplexityWarning(true);
            setTimeout(() => setShowComplexityWarning(false), 3000);
            return;
        }

        setOptions(prev => {
            const newOptions = { ...prev, [key]: !prev[key] };

            // Mutual exclusion for casing
            if (key === 'mixed' && newOptions.mixed) {
                newOptions.lowercase = false;
            }
            if (key === 'lowercase' && newOptions.lowercase) {
                newOptions.mixed = false;
            }

            // Allowed to have all unchecked as per "By default don't select any option"
            return newOptions;
        });
    };

    const handleComplexityChange = (newComplexity) => {
        setComplexity(newComplexity);
        if (newComplexity === 'easy-say') {
            if (options.numbers || options.symbols) {
                setOptions(prev => ({ ...prev, numbers: false, symbols: false }));
                setShowComplexityWarning(true);
                setTimeout(() => setShowComplexityWarning(false), 3000);
            }
        }
    };

    const generatePassword = useCallback(() => {
        let charset = '';
        let currentOptions = { ...options };

        // Complexity Logic Overrides
        if (complexity === 'easy-say') {
            currentOptions.numbers = false;
            currentOptions.symbols = false;
            // Respect user's casing choice (or fallback below)
        }

        if (currentOptions.mixed) {
            charset += CHARSETS.uppercase;
            charset += CHARSETS.lowercase;
        } else if (currentOptions.lowercase) {
            charset += CHARSETS.lowercase;
        }

        if (currentOptions.numbers) charset += CHARSETS.numbers;
        if (currentOptions.symbols) charset += CHARSETS.symbols;

        if (complexity === 'easy-read') {
            // Remove ambiguous characters
            charset = charset.split('').filter(c => !CHARSETS.ambiguous.includes(c)).join('');
        }

        if (!charset) {
            // Fallback if nothing selected to avoid infinite loops or errors
            charset = CHARSETS.lowercase;
        }

        // Generation
        let generated = '';
        const tempLength = keyword ? Math.max(0, length - keyword.length) : length;

        for (let i = 0; i < tempLength; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            generated += charset[randomIndex];
        }

        // Keyword Insertion (Random Position)
        let newPassword = generated;
        if (keyword) {
            const insertPos = Math.floor(Math.random() * (generated.length + 1));
            newPassword = generated.slice(0, insertPos) + keyword + generated.slice(insertPos);
        }

        setPassword(newPassword);
        setCopied(false);
        setHasGenerated(true);

    }, [length, options, complexity, keyword]);

    const copyToClipboard = () => {
        if (!hasGenerated || !password) return;
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-white/5 relative">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-300 text-[20px]">lock</span>
                    <h4 className="text-slate-500 text-xs font-bold leading-normal tracking-[0.2em]">TITANIUM KEY</h4>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setShowHistoryBanner(true);
                            setTimeout(() => setShowHistoryBanner(false), 3000);
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-200"
                        title="History"
                    >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                    </button>
                </div>

                {/* History Coming Soon Banner */}
                {showHistoryBanner && (
                    <div className="absolute top-16 right-8 bg-matte-navy border border-glass-border shadow-lg rounded px-3 py-2 text-xs text-slate-300 z-50 animate-fade-in">
                        Feature coming soon
                    </div>
                )}

                {/* Complexity Warning Banner */}
                {showComplexityWarning && (
                    <div className="absolute top-16 left-8 bg-red-900/90 border border-red-500/30 shadow-lg rounded px-3 py-2 text-xs text-white z-50 animate-fade-in">
                        Numbers & Symbols disabled in 'Easy to Say' mode
                    </div>
                )}
            </div>

            <div className="p-8 flex flex-col gap-8">
                {/* Display */}
                <div className="relative group">
                    <div className="flex w-full items-stretch rounded-lg bg-matte-navy shadow-inset-screen border-b border-white/5 overflow-hidden ring-1 ring-white/5 transition-all group-hover:ring-white/10">
                        <input
                            className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none h-20 px-6 text-2xl md:text-3xl font-mono text-slate-200 placeholder:text-slate-700 focus:ring-0 focus:outline-none tracking-wider"
                            readOnly
                            value={hasGenerated ? password : ''}
                            placeholder="Generate to view..."
                        />
                        <div className="flex items-center pr-4 gap-1">
                            <button
                                onClick={copyToClipboard}
                                className={`text-slate-500 hover:text-slate-200 transition-colors p-2 rounded-md hover:bg-white/5 active:scale-95 flex items-center justify-center relative ${!hasGenerated ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Copy"
                                disabled={!hasGenerated}
                            >
                                <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
                            </button>
                            <button
                                onClick={generatePassword}
                                className="text-slate-500 hover:text-slate-200 transition-colors p-2 rounded-md hover:bg-white/5 active:scale-95 flex items-center justify-center"
                                title="Regenerate"
                            >
                                <span className="material-symbols-outlined text-[20px]">refresh</span>
                            </button>
                        </div>
                    </div>
                    {/* Strength Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0f172a] flex gap-[1px]">
                        <StrengthMeter password={hasGenerated ? password : ''} simple />
                    </div>
                </div>

                {/* Strength Label */}
                {hasGenerated && (
                    <div className="flex justify-end -mt-6">
                        <span className={`text-xs font-bold uppercase tracking-widest ${calculateStrength(password).label === 'Strong' ? 'text-emerald-400' :
                                calculateStrength(password).label === 'Good' ? 'text-teal-400' :
                                    calculateStrength(password).label === 'Fair' ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                            Strength: {calculateStrength(password).label}
                        </span>
                    </div>
                )}

                {/* Controls */}
                <div className="flex flex-col gap-8">
                    {/* Length */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <label className="text-slate-500 text-xs font-bold tracking-widest uppercase">Length</label>
                            <span className="text-slate-200 font-mono text-lg font-medium">{length}</span>
                        </div>
                        <div className="relative h-6 flex items-center">
                            <input
                                className="w-full z-10 focus:outline-none accent-slate-200"
                                type="range"
                                min="8"
                                max="64"
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        {/* Character Sets */}
                        <div className="flex flex-col gap-4">
                            <label className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Character Sets</label>
                            <div className="flex flex-col gap-3">
                                {[
                                    { id: 'mixed', label: 'Mixed Case (Aa)' },
                                    { id: 'lowercase', label: 'Only Lowercase (aa)' },
                                    { id: 'numbers', label: 'Numbers (0-9)' },
                                    { id: 'symbols', label: 'Symbols (!@#)' },
                                ].map(opt => (
                                    <label key={opt.id} className="cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="switch-check sr-only"
                                            checked={options[opt.id]}
                                            onChange={() => handleOptionChange(opt.id)}
                                        // disabled={complexity === 'easy-say' && (opt.id === 'numbers' || opt.id === 'symbols')}
                                        />
                                        <div className={`flex items-center justify-between p-3 rounded bg-white/[0.03] border border-transparent hover:border-white/10 transition-all duration-200 ${options[opt.id] ? '!bg-white/[0.08] !border-glass-border !text-white' : ''}`}>
                                            <span className={`text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors ${options[opt.id] ? '!text-white' : ''}`}>{opt.label}</span>
                                            <div className={`indicator w-1.5 h-1.5 rounded-full transition-all duration-300 ${options[opt.id] ? 'bg-emerald-400 shadow-glow' : 'bg-slate-700'}`}></div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Complexity */}
                        <div className="flex flex-col gap-4">
                            <label className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Complexity</label>
                            <div className="flex flex-col gap-3">
                                {[
                                    { id: 'unique', label: 'All Characters', sub: 'Standard generation.' },
                                    { id: 'easy-read', label: 'Easy to Read', sub: 'No ambiguous chars (1, l, I, 0, O).' },
                                    { id: 'easy-say', label: 'Easy to Say', sub: 'No numbers or symbols.' },
                                ].map(c => (
                                    <label key={c.id} className="cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="complexity"
                                            className="radio-select sr-only"
                                            checked={complexity === c.id}
                                            onChange={() => handleComplexityChange(c.id)}
                                        />
                                        <div className={`flex flex-row-reverse items-start gap-4 p-3 rounded border border-white/5 bg-transparent hover:bg-white/[0.03] transition-all duration-200 min-h-[80px] ${complexity === c.id ? '!bg-white/[0.03] !border-white/20' : ''}`}>
                                            <div className={`w-4 h-4 rounded-full border border-slate-600 group-hover:border-slate-400 flex items-center justify-center mt-1 shrink-0 transition-colors ${complexity === c.id ? '!border-emerald-400' : ''}`}>
                                                <div className={`radio-dot w-2 h-2 rounded-full transform transition-all duration-200 ${complexity === c.id ? 'bg-emerald-400 scale-100 opacity-100 shadow-glow' : 'scale-0 opacity-0'}`}></div>
                                            </div>
                                            <div className="flex flex-col grow">
                                                <span className={`text-sm font-medium text-slate-300 mb-1 group-hover:text-white transition-colors ${complexity === c.id ? '!text-white' : ''}`}>{c.label}</span>
                                                <span className="text-xs text-slate-500 leading-relaxed">{c.sub}</span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Custom Keyword */}
                    <div className="flex flex-col gap-4">
                        <label className="text-slate-500 text-xs font-bold tracking-widest uppercase">Custom Keyword</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="e.g. Dog"
                                className="w-full bg-matte-navy/50 border border-white/5 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="p-8 pt-0 mt-2">
                <button
                    onClick={generatePassword}
                    className="w-full relative group overflow-hidden rounded-lg bg-gradient-to-b from-white/10 to-white/5 p-[1px] shadow-lg active:shadow-none active:scale-[0.99] transition-all duration-150"
                >
                    <div className="relative h-14 bg-[#111827] group-hover:bg-[#1f2937] rounded-[7px] flex items-center justify-center transition-colors">
                        <span className="text-slate-300 group-hover:text-white text-sm font-bold tracking-[0.15em] uppercase transition-colors">Generate New Key</span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </button>
            </div>
        </>
    );
};

export default PasswordGenerator;
