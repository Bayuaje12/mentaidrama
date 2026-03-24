"use client";

import { Suspense, useState, useEffect } from "react";
import HomeContent from "./home-content";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showDonation, setShowDonation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [canSkip, setCanSkip] = useState(false);

  // Efek 1: Splash Screen selama 3 detik
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
      setShowDonation(true);
    }, 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  // Efek 2: Timer Donasi (Skip muncul di detik ke-8)
  useEffect(() => {
    if (timeLeft > 0 && showDonation && !loading) {
      const timer = setTimeout(() => {
        const nextTime = timeLeft - 1;
        setTimeLeft(nextTime);
        if (nextTime <= 2) setCanSkip(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showDonation, loading]);

  return (
    <main className="relative min-h-screen">
      
      {/* --- SPLASH SCREEN LOADING --- */}
      {loading && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700">
            <div className="w-32 h-32 animate-logo-pulse">
              <img 
                src="https://files.catbox.moe/fcn9de.png" 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                MENTAI<span className="gradient-text">DRAMA</span>
              </h1>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] mt-2">Premium Experience</p>
            </div>
          </div>
        </div>
      )}

      {/* --- KONTEN UTAMA --- */}
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>

      {/* --- MODAL DONASI --- */}
      {showDonation && !loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#0a0a0a] border border-primary/20 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_60px_rgba(212,175,55,0.1)] relative">
            
            {canSkip && (
              <button 
                onClick={() => setShowDonation(false)}
                className="absolute top-6 right-8 text-primary font-bold text-[10px] uppercase tracking-widest hover:scale-110 transition-all"
              >
                Skip ✕
              </button>
            )}

            <h2 className="text-xl font-black italic text-white mb-1 uppercase">
              SUPPORT <span className="gradient-text">IBOYCLOUD</span>
            </h2>
            <p className="text-[10px] text-white/40 mb-6 uppercase tracking-tighter">
              Bantu kami menjaga server tetap stabil.
            </p>
            
            <div className="relative w-64 h-64 mx-auto mb-6 bg-white rounded-2xl overflow-hidden p-2 border-4 border-primary/30 shadow-2xl">
              <img 
                src="https://files.catbox.moe/fcn9de.png" 
                alt="QRIS" 
                className="w-full h-full object-contain" 
              />
            </div>

            <button
              disabled={timeLeft > 0}
              onClick={() => setShowDonation(false)}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                timeLeft > 0 
                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                : "bg-primary text-black shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110"
              }`}
            >
              {timeLeft > 0 ? `Tunggu ${timeLeft}s...` : "Masuk Website"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
