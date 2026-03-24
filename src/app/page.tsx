"use client";

import { Suspense, useState, useEffect } from "react";
import HomeContent from "./home-content";
import Image from "next/image";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showDonation, setShowDonation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // 1. LOGIKA SPLASH SCREEN (Tampil 3 Detik dengan Fade Out)
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
      setShowDonation(true);
    }, 3000); 
    return () => clearTimeout(splashTimer);
  }, []);

  // 2. LOGIKA TIMER MUNDUR (Berjalan Otomatis di Modal)
  useEffect(() => {
    if (showDonation && !loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showDonation, loading, timeLeft]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      
      {/* --- LAYER 1: SPLASH SCREEN (BRANDING IBOYCLOUD) --- */}
      {loading && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-6">
            
            {/* Logo Favicon dari Folder Public */}
            <div className="relative w-28 h-28 animate-pulse p-3 rounded-[2rem] bg-black shadow-[0_0_50px_rgba(212,175,55,0.2)] border border-primary/10">
              <Image 
                src="/favicon.ico" 
                alt="Logo MentaiDrama" 
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="text-center space-y-3">
                <h1 className="font-display font-black text-4xl italic gradient-text tracking-tighter uppercase animate-in slide-in-from-bottom-4 duration-1000">
                  Mentai<span className="text-white">Drama</span>
                </h1>
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
                <p className="text-[10px] text-white/30 uppercase tracking-[0.7em] font-bold animate-pulse">
                  Premium Experience
                </p>
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER 2: KONTEN UTAMA WEBSITE (DIBUNGKUS SUSPENSE) --- */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
        </div>
      }>
        <HomeContent />
      </Suspense>

      {/* --- LAYER 3: MODAL DONASI (POPUP INTERAKTIF) --- */}
      {showDonation && !loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 animate-in fade-in zoom-in duration-500">
          <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[3.5rem] max-w-sm w-full text-center shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-visible group">
            
            {/* Efek Cahaya Dekoratif */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* TOMBOL SKIP: Fix Z-Index & Pointer Events */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDonation(false);
              }}
              className="absolute -top-3 -right-3 md:top-8 md:right-8 bg-primary text-black hover:bg-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest transition-all z-[100] cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-90"
              style={{ pointerEvents: 'auto' }}
            >
              Skip ✕
            </button>

            <div className="relative z-10">
              <h2 className="text-2xl font-black italic text-white mb-1 tracking-tighter uppercase">
                SUPPORT <span className="gradient-text">IBOYCLOUD</span>
              </h2>
              <p className="text-[10px] text-white/40 mb-8 uppercase tracking-[0.4em] font-semibold">
                Keep the server alive
              </p>
              
              {/* Box QRIS dengan Animasi Hover */}
              <div className="relative w-64 h-64 mx-auto mb-8 bg-white rounded-[2.5rem] overflow-hidden p-4 border-[8px] border-[#151515] shadow-2xl transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]">
                <img 
                  src="https://files.catbox.moe/fcn9de.png" 
                  alt="QRIS Donasi" 
                  className="w-full h-full object-contain" 
                />
              </div>

              {/* Tombol Masuk dengan Logic Disabled */}
              <button
                disabled={timeLeft > 0}
                onClick={() => setShowDonation(false)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-500 ${
                  timeLeft > 0 
                  ? "bg-white/[0.02] text-white/10 border border-white/[0.05] cursor-not-allowed" 
                  : "bg-primary text-black shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:bg-white hover:scale-[1.02]"
                }`}
              >
                {timeLeft > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    Please Wait {timeLeft}s
                  </span>
                ) : "Enter Website"}
              </button>
              
              <p className="mt-8 text-[8px] text-white/10 uppercase tracking-[0.5em] font-medium">
                Indramayu Pride • MentaiDrama v2.0
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
