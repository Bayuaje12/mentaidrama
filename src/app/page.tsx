"use client";

import { Suspense, useState, useEffect } from "react";
import HomeContent from "./home-content";

export default function HomePage() {
  const [showDonation, setShowDonation] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);

  // Logika Timer Modal Donasi
  useEffect(() => {
    if (timeLeft > 0 && showDonation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showDonation]);

  return (
    <main className="relative">
      <Suspense 
        fallback={
          <div className="min-h-screen pt-24 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <HomeContent />
      </Suspense>

      {/* MODAL DONASI IBOYCLOUD (GOLD EDITION) */}
      {showDonation && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-500">
          <div className="bg-[#0c0c0c] border border-primary/30 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(212,175,55,0.15)]">
            <h2 className="text-2xl font-black italic text-white mb-2 tracking-tighter uppercase">
              SUPPORT <span className="gradient-text">IBOYCLOUD</span>
            </h2>
            <p className="text-[11px] text-white/50 mb-6 leading-relaxed uppercase tracking-tighter">
              "Seberapapun dukungan Anda, sangat berharga bagi saya untuk kelangsungan server MentaiDrama."
            </p>
            
            {/* Foto QRIS */}
            <div className="relative w-64 h-64 mx-auto mb-6 bg-white rounded-2xl overflow-hidden p-2 shadow-[0_0_30px_rgba(212,175,55,0.3)] border-2 border-primary/50">
              <img 
                src="https://files.catbox.moe/fcn9de.png" 
                alt="QRIS Donasi" 
                className="w-full h-full object-contain" 
              />
            </div>

            <button
              disabled={timeLeft > 0}
              onClick={() => setShowDonation(false)}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                timeLeft > 0 
                ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                : "bg-primary text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              }`}
            >
              {timeLeft > 0 ? `Tunggu ${timeLeft} Detik...` : "Lanjut ke Website"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
