"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Play, Zap } from "lucide-react";
import { useSearchDramas } from "@/hooks/useDramas";
import { useReelShortSearch } from "@/hooks/useReelShort";
import { useNetShortSearch } from "@/hooks/useNetShort";
import { useShortMaxSearch } from "@/hooks/useShortMax";
import { useMeloloSearch } from "@/hooks/useMelolo";
import { useFlickReelsSearch } from "@/hooks/useFlickReels";
import { useFreeReelsSearch } from "@/hooks/useFreeReels";
import { usePlatform } from "@/hooks/usePlatform";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();

  // Platform context
  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();

  // Search based on platform
  const { data: dramaBoxResults, isLoading: isSearchingDramaBox } = useSearchDramas(
    isDramaBox ? normalizedQuery : ""
  );
  const { data: reelShortResults, isLoading: isSearchingReelShort } = useReelShortSearch(
    isReelShort ? normalizedQuery : ""
  );
  const { data: netShortResults, isLoading: isSearchingNetShort } = useNetShortSearch(
    isNetShort ? normalizedQuery : ""
  );
  const { data: shortMaxResults, isLoading: isSearchingShortMax } = useShortMaxSearch(
    isShortMax ? normalizedQuery : ""
  );
  const { data: meloloResults, isLoading: isSearchingMelolo } = useMeloloSearch(
    isMelolo ? normalizedQuery : ""
  );
  const { data: flickReelsResults, isLoading: isSearchingFlickReels } = useFlickReelsSearch(
    isFlickReels ? normalizedQuery : ""
  );
  const { data: freeReelsResults, isLoading: isSearchingFreeReels } = useFreeReelsSearch(
    isFreeReels ? normalizedQuery : ""
  );

  const isSearching = isDramaBox 
    ? isSearchingDramaBox 
    : isReelShort 
      ? isSearchingReelShort 
      : isShortMax
        ? isSearchingShortMax
        : isNetShort 
          ? isSearchingNetShort
          : isMelolo
            ? isSearchingMelolo
            : isFlickReels
              ? isSearchingFlickReels
              : isSearchingFreeReels;

  // Search results processing
  const searchResults = isDramaBox 
    ? dramaBoxResults 
    : isReelShort 
      ? reelShortResults?.data 
      : isShortMax
        ? shortMaxResults?.data
        : isNetShort
          ? netShortResults?.data
          : isMelolo
            ? meloloResults?.data?.search_data?.flatMap((item: any) => item.books || [])
                .filter((book: any) => book.thumb_url && book.thumb_url !== "") || []
            : isFlickReels
              ? flickReelsResults?.data
              : freeReelsResults;

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide header on watch pages for immersive video experience
  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/90 backdrop-blur-xl border-b border-white/5 py-1 shadow-lg" 
          : "glass-strong py-2"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* --- LOGO MENTAIDRAMA --- */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:scale-105 transition-all duration-500 shadow-xl">
              <Image 
                src="/favicon.ico" 
                alt="MentaiDrama" 
                fill
                className="object-contain p-1.5"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex flex-col -space-y-1">
              <span className="font-display font-black text-xl md:text-2xl text-white tracking-tighter uppercase italic group-hover:tracking-normal transition-all duration-300">
                Mentai<span className="text-primary italic">Drama</span>
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3 text-primary fill-primary animate-pulse" />
                <span className="text-[9px] text-white/50 font-bold tracking-[0.2em] uppercase">
                  Fast Streaming
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 shadow-sm"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- SEARCH OVERLAY --- */}
      {searchOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-background/98 backdrop-blur-3xl z-[9999] overflow-hidden animate-in fade-in duration-300">
            <div className="container mx-auto px-4 py-6 h-[100dvh] flex flex-col">
              
              <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <div className="flex-1 relative min-w-0 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:scale-110 transition-transform" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Cari drama di ${platformInfo.name}...`}
                    className="search-input pl-12 bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg py-6 rounded-2xl"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSearchClose}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all flex-shrink-0 border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary fill-primary" />
                <span>Mencari di:</span>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold tracking-wide uppercase text-xs border border-primary/30">
                  {platformInfo.name}
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar pb-10">
                {isSearching && normalizedQuery && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="text-primary/50 text-xs font-bold tracking-widest uppercase animate-pulse">Memasak Hasil...</span>
                  </div>
                )}

                {/* DramaBox Results */}
                {isDramaBox && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((drama: any, index: number) => (
                      <Link
                        key={drama.bookId}
                        href={`/detail/dramabox/${drama.bookId}`}
                        onClick={handleSearchClose}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left animate-fade-up overflow-hidden group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={drama.cover}
                          alt={drama.bookName}
                          className="w-16 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{drama.bookName}</h3>
                          {drama.protagonist && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">{drama.protagonist}</p>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {drama.introduction}
                          </p>
                          {drama.tagNames && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {drama.tagNames.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="tag-pill text-[10px] bg-primary/20 text-primary border border-primary/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ReelShort Results */}
                {isReelShort && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link
                        key={book.book_id}
                        href={`/detail/reelshort/${book.book_id}`}
                        onClick={handleSearchClose}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left animate-fade-up overflow-hidden group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={book.book_pic}
                          alt={book.book_title}
                          className="w-16 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{book.book_title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {book.special_desc}
                          </p>
                          {book.theme && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {book.theme.slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="tag-pill text-[10px] bg-primary/20 text-primary border border-primary/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* NetShort Results */}
                {isNetShort && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((drama: any, index: number) => (
                      <Link
                        key={drama.shortPlayId}
                        href={`/detail/netshort/${drama.shortPlayId}`}
                        onClick={handleSearchClose}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left animate-fade-up overflow-hidden group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={drama.cover}
                          alt={drama.title}
                          className="w-16 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{drama.title}</h3>
                          {drama.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                              {drama.description}
                            </p>
                          )}
                          {drama.labels && drama.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {drama.labels.slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="tag-pill text-[10px] bg-primary/20 text-primary border border-primary/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ShortMax Results */}
                {isShortMax && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((drama: any, index: number) => (
                      <Link
                        key={`${drama.shortPlayId}-${index}`}
                        href={`/detail/shortmax/${drama.shortPlayId}`}
                        onClick={handleSearchClose}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left animate-fade-up overflow-hidden group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={drama.cover}
                          alt={drama.title}
                          className="w-16 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{drama.title}</h3>
                          {drama.genre && drama.genre.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {drama.genre.slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="tag-pill text-[10px] bg-primary/20 text-primary border border-primary/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Melolo Results */}
                {isMelolo && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link
                        key={book.book_id}
                        href={`/detail/melolo/${book.book_id}`}
                        onClick={handleSearchClose}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left animate-fade-up overflow-hidden group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-16 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                          {book.thumb_url ? (
                            <img
                              src={book.thumb_url.includes(".heic") 
                                ? `https://wsrv.nl/?url=${encodeURIComponent(book.thumb_url)}&output=jpg` 
                                : book.thumb_url}
                              alt={book.book_name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-xs text-muted-foreground">No Img</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{book.book_name}</h3>
                          {book.abstract && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                              {book.abstract}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* FlickReels Results */}
                {isFlickReels && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link
                        key={book.playlet_id}
                        href={`/detail/flickreels/${book.playlet_id}`}
                        onClick={handleSearchClose}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left animate-fade-up overflow-hidden group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{book.title}</h3>
                          {book.introduce && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                              {book.introduce}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* FreeReels Results */}
                {isFreeReels && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link
                        key={book.key}
                        href={`/detail/freereels/${book.key}`}
                        onClick={handleSearchClose}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all text-left animate-fade-up overflow-hidden group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">{book.title}</h3>
                          {book.desc && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                              {book.desc}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* INI BAGIAN YANG DIPERBAIKI (Baris 488) */}
                {searchResults && searchResults.length === 0 && normalizedQuery && !isSearching && (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 mt-8">
                    <p className="text-white/60 text-lg italic">Drama "{normalizedQuery}" belum tersedia di {platformInfo.name}.</p>
                  </div>
                )}

                {!normalizedQuery && (
                  <div className="text-center py-24 opacity-30 mt-8">
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">MentaiDrama</h1>
                    <p className="mt-4 tracking-widest uppercase text-sm font-bold">Search Engine</p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
