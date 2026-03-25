"use client";

import { Suspense, useState, useEffect } from "react";
import HomeContent from "./home-content";
import Image from "next/image";
import Link from "next/link";
// Pastikan lucide-react sudah di-install
import { Search, Menu, X, MessageSquare, Rss, Video } from "lucide-react"; 

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showDonation, setShowDonation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMaintenance = false; 

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
      if (!isMaintenance) setShowDonation(true);
    }, 3000); 
    return () => clearTimeout(splashTimer);
  }, [isMaintenance]);

  useEffect(() => {
    if (showDonation && !loading && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showDonation, loading, timeLeft]);

  const socialLinks = [
    { name: "WhatsApp Admin", icon: MessageSquare, url: "https://wa.me/6283109105308", color: "hover:bg-green-600/10 hover:text-green-500", iconColor: "text-green-500" },
    { name: "WhatsApp Channel", icon: Rss, url: "https://whatsapp.com/channel/0029VbBsAy17T8bbFQZ9y410", color: "hover:bg-primary/10 hover:text-primary", iconColor: "text-primary" },
    { name: "TikTok Admin", icon: Video, url: "https://www.tiktok.com/@pojokwetan10", color: "hover:bg-white/5 hover:text-white", iconColor: "text-white/80" },
  ];

  if (isMaintenance && !loading) {
    return (
      <main className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black p-6">
        <div className="relative w-32 h-32 animate-pulse mb-8 border border-primary/10 rounded-[2.5rem] p-4 bg-black shadow-[0_0_60px_rgba(212,175,55,0.1)]">
          <Image src="/favicon.ico" alt="Logo iboyCloud" fill className="object-contain" />
        </div>
        <div className="text-center space-y-5">
          <h1 className="text-4xl font-black italic gradient-text uppercase tracking-tighter">System <span className="text-white">Maintenance</span></h1>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.5em] max-w-xs mx-auto leading-relaxed">MentaiDrama sedang ditingkatkan untuk pengalaman nonton yang lebih satset.</p>
          <div className="pt-8">
            <span className="px-8 py-3 border border-primary/20 rounded-full bg-primary/5 text-primary text-[9px] uppercase tracking-[0.4em] font-bold shadow-glow-sm">Back Soon • iboyCloud Ganteng</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      
      {/* --- LAYER 1: SPLASH SCREEN --- */}
      {loading && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black animate-in fade-in duration-700">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-28 h-28 animate-pulse bg-black shadow-[0_0_50px_rgba(212,175,55,0.2)] border border-primary/10 rounded-[2rem] p-3">
              <Image src="/favicon.ico" alt="Logo MentaiDrama" fill className="object-contain" priority />
            </div>
            <div className="space-y-2">
              <h1 className="font-display font-black text-4xl italic gradient-text tracking-tighter uppercase">Mentai<span className="text-white">Drama</span></h1>
              <div className="h-[1px] w-12 bg-primary/30 mx-auto" />
              <p className="text-[9px] text-white/20 uppercase tracking-[0.7em]">Premium Experience</p>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER BAR (FIXED & TOUCHABLE) --- */}
      {!loading && (
        <header className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 py-4 md:px-8">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto h-full">
            
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 border border-primary/20 rounded-xl p-1.5 bg-[#0c0c0c] shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <Image src="/favicon.ico" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="font-black italic text-2xl gradient-text uppercase tracking-tighter leading-none">Mentai<span className="text-white">Drama</span></h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-primary text-[9px]">⚡</span>
                  <p className="text-[8px] text-white/30 uppercase tracking-[0.4em]">FAST STREAMING</p>
                </div>
              </div>
            </div>

            {/* Tombol Kanan: Rapih & Bisa Disentuh */}
            <div className="flex items-center gap-2 relative z-[160]">
              <button 
                type="button"
                className="relative z-[170] p-2.5 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 pointer-events-auto"
                onClick={() => console.log("Cari diklik!")}
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="relative z-[170] p-2.5 bg-primary/10 rounded-full border border-primary/20 text-primary hover:bg-primary/20 transition-all shadow-glow-sm pointer-events-auto"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </header>
      )}

      {/* --- KONTEN UTAMA --- */}
      <div className="pt-[80px]">
        <Suspense fallback={null}>
          <HomeContent />
        </Suspense>
      </div>

      {/* --- MENU DRAWER --- */}
      <div className={`fixed inset-0 z-[2000] ${isMenuOpen ? "visible" : "invisible"}`}>
        <div onClick={() => setIsMenuOpen(false)} className={`absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute inset-x-0 bottom-0 m-6 bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] transition-all duration-300 ease-in-out ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="flex justify-between items-center mb-8 pb-5 border-b border-white/5">
            <h2 className="text-xl font-black italic tracking-tighter uppercase gradient-text">INFO & SOCIAL</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-white/5 rounded-full border border-white/10"><X className="w-4 h-4 text-white/60" /></button>
          </div>
          <div className="space-y-3">
            {socialLinks.map((link) => (
              <Link key={link.name} href={link.url} target="_blank" className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/[0.02] border border-white/5 transition-all ${link.color}`}>
                <link.icon className={`w-5 h-5 ${link.iconColor}`} />
                <span className="flex-1 text-[11px] font-black uppercase tracking-[0.2em] text-white">{link.name}</span>
                <span className="text-white/20 text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODAL DONASI --- */}
      {showDonation && !loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
          <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-[3.5rem] max-w-sm w-full text-center relative shadow-[0_0_100px_rgba(0,0,0,1)]">
            <button onClick={() => setShowDonation(false)} className="absolute -top-3 -right-3 bg-primary text-black font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest z-[100] shadow-glow-sm">Skip ✕</button>
            <div className="relative z-10">
              <h2 className="text-2xl font-black italic text-white mb-1 uppercase tracking-tighter">SUPPORT <span className="gradient-text">IBOYCLOUD</span></h2>
              <p className="text-[9px] text-white/40 mb-8 uppercase tracking-[0.4em] font-semibold">Keep the server alive</p>
              <div className="relative w-64 h-64 mx-auto mb-8 bg-white rounded-[2.5rem] p-4 border-[8px] border-[#151515] shadow-2xl">
                <img src="https://files.catbox.moe/fcn9de.png" alt="QRIS" className="w-full h-full object-contain" />
              </div>
              <button disabled={timeLeft > 0} onClick={() => setShowDonation(false)} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-500 ${timeLeft > 0 ? "bg-white/[0.02] text-white/10 border border-white/[0.05]" : "bg-primary text-black shadow-glow-sm"}`}>
                {timeLeft > 0 ? `Wait ${timeLeft}s` : "Enter Website"}
              </button>
              <p className="mt-8 text-[8px] text-white/10 uppercase tracking-[0.5em] font-medium">Indramayu Pride • MentaiDrama v2.0</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
