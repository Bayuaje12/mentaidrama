"use client";

import { Suspense, useState, useEffect } from "react";
import HomeContent from "./home-content";
import Image from "next/image";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showDonation, setShowDonation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // 1. LOGIKA SPLASH SCREEN (Logo Favicon Muncul 3 Detik)
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
      setShowDonation(true);
    }, 3000); 
    return () => clearTimeout(splashTimer);
  }, []);

  // 2. LOGIKA TIMER MUNDUR (Berjalan di Background)
  useEffect(() => {
    if (showDonation && !loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showDonation, loading, timeLeft]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      
      {/* --- LAYER 1: SPLASH SCREEN (LOGO ASLI) --- */}
      {loading && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black animate-in fade-in duration-500">
          <div className="flex flex-col items-center gap-6">
            
            {/* Logo Favicon dari folder Public */}
            <div className="relative w-28 h-28 animate-pulse p-3 rounded-[2rem] bg-black shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-primary/10">
              <Image 
                src="/favicon.ico" 
                alt="Logo MentaiDrama" 
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="text-center space-y-2">
                <h1 className="font-display font-black text-4xl italic gradient-text tracking-tighter uppercase animate-in slide-in-from-bottom-4 duration-700">
                  Mentai<span className="text-white">Drama</span>
                </h1>
                <div className="h-[1px] w-12 bg-primary/30 mx-auto" />
                <p className="text-[10px] text-white/30 uppercase tracking-[0.6em] font-medium">
                  Premium Experience
                </p>
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER 2: KONTEN UTAMA WEBSITE --- */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }>
        <HomeContent />
      </Suspense>

      {/* --- LAYER 3: MODAL DONASI (POPUP) --- */}
      {showDonation && !loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in duration-500">
          <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[3rem] max-w-sm w-full text-center shadow-[0_0_80px_rgba(0,0,0,1)] relative overflow-hidden group">
            
            {/* Efek Cahaya di Belakang Modal */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            
            {/* TOMBOL SKIP: LANGSUNG MUNCUL (Tanpa nunggu) */}
            <button 
              onClick={() => setShowDonation(false)}
              className="absolute top-8 right-8 text-primary/60 hover:text-primary font-bold text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-110 active:scale-95 z-10"
            >
              Skip ✕
            </button>

            <div className="relative z-10">
              <h2 className="text-2xl font-black italic text-white mb-1 tracking-tighter uppercase">
                SUPPORT <span className="gradient-text">IBOYCLOUD</span>
              </h2>
              <p className="text-[10px] text-white/40 mb-8 uppercase tracking-widest font-medium">
                Keep the server alive
              </p>
              
              {/* Box QRIS Donasi */}
              <div className="relative w-64 h-64 mx-auto mb-8 bg-white rounded-[2rem] overflow-hidden p-3 border-[6px] border-[#1a1a1a] shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                <img 
                  src="https://files.catbox.moe/fcn9de.png" 
                  alt="QRIS iboyCloud" 
                  className="w-full h-full object-contain" 
                />
              </div>

              {/* Tombol Masuk dengan Timer */}
              <button
                disabled={timeLeft > 0}
                onClick={() => setShowDonation(false)}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] transition-all duration-500 ${
                  timeLeft > 0 
                  ? "bg-white/[0.03] text-white/10 border border-white/[0.05] cursor-not-allowed" 
                  : "bg-primary text-black shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:bg-white hover:shadow-glow-sm"
                }`}
              >
                {timeLeft > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    Tunggu {timeLeft}s
                  </span>
                ) : "Masuk Sekarang"}
              </button>
              
              <p className="mt-6 text-[9px] text-white/20 uppercase tracking-[0.3em]">
                Your support means everything ❤️
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
