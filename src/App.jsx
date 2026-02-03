import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import PasswordGenerator from './components/PasswordGenerator';

function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <>
      <Analytics />
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#1e293b]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#0f172a]/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px] pointer-events-none"></div>

      <main className="relative w-full max-w-[560px] bg-glass-surface backdrop-blur-[40px] border border-glass-border rounded-2xl shadow-glass overflow-hidden flex flex-col group/design-root z-10 transition-all duration-500 hover:shadow-glow/50">
        <PasswordGenerator />
      </main>

      <div className="absolute bottom-8 text-slate-600 text-[10px] tracking-widest font-mono uppercase opacity-50">
        Titanium Vault • v2.0.4
      </div>
    </>
  );
}

export default App;
