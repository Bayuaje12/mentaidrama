"use client";

import { Suspense, useState, useEffect } from "react";
import HomeContent from "./home-content";
import Image from "next/image"; // Menggunakan komponen Image Next.js untuk optimasi

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showDonation, setShowDonation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [canSkip, setCanSkip] = useState(false);

  // EFek 1: SPLASH SCREEN (Tampilan Pertama)
  useEffect(() => {
    // Tampilkan logo favicon selama 3 detik
    const splashTimer = setTimeout(() => {
      setLoading(false);
      setShowDonation(true); // Tampilkan donasi setelah loading logo selesai
    }, 3000); 

    return () => clearTimeout(splashTimer);
  }, []);

  // EFek 2: TIMER DONASI (Logika Skip Tepat Detik ke-8)
  useEffect(() => {
    // Hanya jalan jika loading logo selesai dan modal donasi aktif
    if (timeLeft > 0 && showDonation && !loading) {
      const donationTimer = setTimeout(() => {
        const nextTime = timeLeft - 1;
        setTimeLeft(nextTime);

        // PERBAIKAN: Tombol skip muncul TEPAT ketika detik berjalan ke-8 (sisa 2 detik)
        if (nextTime <= 2) {
          setCanSkip(true);
        }
      }, 1000);
      return () => clearTimeout(donationTimer);
    }
  }, [timeLeft, showDonation, loading]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      
      {/* --- 1. ANIMASI LOADING LOGO ASLI (SPLASH SCREEN) --- */}
      {loading && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black animate-out fade-out duration-1000 delay-[2500ms]">
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
            
            {/* MENGGUNAKAN FAVICON.ICO DARI FOLDER PUBLIC */}
            <div className="relative w-24 h-24 animate-logo-pulse p-2 rounded-3xl bg-black shadow-[0_0_60px_rgba(212,175,55,0.2)] border border-primary/20">
              <Image 
                src="/favicon.ico" // Path langsung ke folder public
                alt="Logo MentaiDrama" 
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* TEKS BRANDING */}
            <div className="text-center">
                <h1 className="font-display font-black text-4xl italic gradient-text tracking-tighter uppercase">
                  Mentai<span className="text-white">Drama</span>
                </h1>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] mt-2 font-medium">PREMIUM EXPERIENCE</p>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. KONTEN UTAMA WEBSITE (Muncul di Background) --- */}
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>

      {/* --- 3. MODAL DONASI (Muncul Setelah Splash Screen) --- */}
      {showDonation && !loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-500">
          <div className="bg-[#0a0a0a] border border-primary/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_60px_rgba(212,175,55,0.15)] relative">
            
            {/* TOMBOL SKIP MUNCUL TEPAT DI DETIK KE-8 */}
            {canSkip && (
              <button 
                onClick={() => setShowDonation(false)}
                className="absolute top-6 right-8 text-primary font-bold text-[10px] uppercase tracking-[0.3em] hover:scale-110 transition-transform animate-in zoom-in duration-300 shadow-glow-sm"
              >
                Skip ✕
              </button>
            )}

            <h2 className="text-2xl font-black italic text-white mb-2 tracking-tighter uppercase">
              SUPPORT <span className="gradient-text">IBOYCLOUD</span>
            </h2>
            <p className="text-[11px] text-white/50 mb-6 leading-relaxed uppercase tracking-tighter">
              Bantu kami menjaga server tetap stabil.
            </p>
            
            {/* FOTO QRIS DONASI (Gunakan Link Catbox kamu) */}
            <div className="relative w-64 h-64 mx-auto mb-6 bg-white rounded-2xl overflow-hidden p-2 border-4 border-primary/30 shadow-2xl">
              <img 
                src="https://files.catbox.moe/fcn9de.png" 
                alt="QRIS Donasi iboyCloud" 
                className="w-full h-full object-contain" 
              />
            </div>

            <button
              disabled={timeLeft > 0}
              onClick={() => setShowDonation(false)}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                timeLeft > 0 
                ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                : "bg-primary text-black hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              }`}
            >
              {timeLeft > 0 ? `TUNGGU ${timeLeft} DETIK...` : "MASUK WEBSITE"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
