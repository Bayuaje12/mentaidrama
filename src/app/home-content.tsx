"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Search, Menu, X, Star, Clock } from "lucide-react"; // Pastikan lucide-react sudah di-install

// Daftar Channel sesuai screenshot kamu
const CHANNELS = [
  { id: "all", name: "Semua Channel", color: "text-white" },
  { id: "dramabox", name: "DramaBox", color: "text-red-500" },
  { id: "reelshort", name: "ReelShort", color: "text-red-400" },
  { id: "shortmax", name: "ShortMax", color: "text-orange-500" },
  { id: "netshort", name: "NetShort", color: "text-orange-400" },
  { id: "melolo", name: "Melolo", color: "text-yellow-400" },
  { id: "flickreels", name: "FlickReels", color: "text-yellow-500" },
  { id: "freereels", name: "FreeReels", color: "text-red-600" },
];

// Data Dummy Drama (Bisa kamu sesuaikan dengan data aslimu)
const DRAMA_LIST = [
  { id: 1, title: "Memilih Iblis Pemikat Terendah", eps: "60 Ep", image: "https://files.catbox.moe/fcn9de.png", channel: "dramabox", views: "3.5K" },
  { id: 2, title: "Rahasia Sang Pewaris Tunggal", eps: "66 Ep", image: "https://files.catbox.moe/fcn9de.png", channel: "dramabox", views: "2.7K" },
  { id: 3, title: "Pernikahan Kedua Si OB", eps: "56 Ep", image: "https://files.catbox.moe/fcn9de.png", channel: "reelshort", views: "5.1K" },
  { id: 4, title: "Raja Zombie Level FFF", eps: "40 Ep", image: "https://files.catbox.moe/fcn9de.png", channel: "shortmax", views: "1.2K" },
];

export default function HomeContent() {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter drama berdasarkan channel yang dipilih
  const filteredDrama = DRAMA_LIST.filter(drama => 
    selectedChannel === "all" ? true : drama.channel === selectedChannel
  );

  return (
    <div className="relative min-h-screen pb-24">
      {/* --- HEADER & PENCARIAN --- */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 pt-4 pb-4 px-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Cari drama atau anime..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* TOMBOL BUKA SIDEBAR (Pengganti Dropdown Lama) */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/10 transition-all active:scale-95"
          >
            <Menu className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {CHANNELS.find(c => c.id === selectedChannel)?.name || "Pilih Channel"}
            </span>
          </button>
          
          <span className="text-[10px] text-primary/80 uppercase tracking-widest font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Terbaru
          </span>
        </div>
      </div>

      {/* --- GRID KONTEN DRAMA --- */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredDrama.map((drama) => (
            <Link href={`/drama/${drama.id}`} key={drama.id} className="group flex flex-col gap-2">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all">
                <Image src={drama.image} alt={drama.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Badge Episode & Views */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                  <Play className="w-3 h-3 text-white fill-white" />
                  <span className="text-[9px] font-bold text-white">{drama.eps}</span>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary/90 backdrop-blur-md px-2 py-1 rounded-md shadow-glow-sm">
                  <span className="text-[9px] font-black text-black">{drama.views}</span>
                </div>
              </div>
              <h3 className="text-xs font-bold text-white/90 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {drama.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* ========================================= */}
      {/* 🟢 SIDEBAR DRAWER (MENU CHANNEL) 🟢 */}
      {/* ========================================= */}
      <div className={`fixed inset-0 z-[1000] transition-all duration-500 ${isSidebarOpen ? "visible" : "invisible"}`}>
        {/* Overlay Hitam (Klik untuk tutup) */}
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`} 
        />

        {/* Panel Sidebar */}
        <div className={`absolute left-0 top-0 bottom-0 w-[280px] bg-[#0c0c0c] border-r border-white/5 p-6 flex flex-col transition-transform duration-500 ease-in-out shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
            <h2 className="text-lg font-black italic tracking-tighter uppercase gradient-text">
              CHANNELS
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* List Channel (Scrollable jika kepanjangan) */}
          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pr-2">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch.id);
                  setIsSidebarOpen(false); // Otomatis tutup drawer setelah milih
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all border ${
                  selectedChannel === ch.id 
                  ? "bg-primary/10 border-primary/50 shadow-glow-sm" 
                  : "bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${selectedChannel === ch.id ? "bg-primary shadow-glow-sm" : "bg-white/20"}`} />
                <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${selectedChannel === ch.id ? "text-primary" : "text-white/70"}`}>
                  {ch.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 text-center">
            <p className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-medium">
              MentaiDrama v2.0
            </p>
            <p className="text-[8px] text-primary/40 uppercase tracking-[0.3em] font-bold mt-1">
              Powered by iboyCloud
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
