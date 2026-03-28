"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useDramaDetail, useEpisodes } from "@/hooks/useDramaDetail";
import { ChevronLeft, ChevronRight, Loader2, Settings, List, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DramaDetailDirect, DramaDetailResponseLegacy } from "@/types/drama";

// Helper untuk cek format API
function isDirectFormat(data: unknown): data is DramaDetailDirect {
  return data !== null && typeof data === 'object' && 'bookId' in data && 'coverWap' in data;
}

function isLegacyFormat(data: unknown): data is DramaDetailResponseLegacy {
  return data !== null && typeof data === 'object' && 'data' in data && (data as DramaDetailResponseLegacy).data?.book !== undefined;
}

export default function DramaBoxWatchPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params.bookId;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [quality, setQuality] = useState(720);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { data: detailData, isLoading: detailLoading } = useDramaDetail(bookId || "");
  const { data: episodes, isLoading: episodesLoading } = useEpisodes(bookId || "");

  useEffect(() => {
    const ep = parseInt(searchParams.get("ep") || "0", 10);
    if (ep >= 0) {
      setCurrentEpisode(ep);
    }
  }, [searchParams]);

  const handleEpisodeChange = (index: number, preserveFullscreen = false) => {
    setCurrentEpisode(index);
    setShowEpisodeList(false);
    if (preserveFullscreen) {
      window.history.replaceState(null, '', `/watch/dramabox/${bookId}?ep=${index}`);
    } else {
      router.push(`/watch/dramabox/${bookId}?ep=${index}`);
    }
  };

  const currentEpisodeData = useMemo(() => {
    if (!episodes) return null;
    return episodes[currentEpisode] || null;
  }, [episodes, currentEpisode]);

  const defaultCdn = useMemo(() => {
    if (!currentEpisodeData) return null;
    return (
      currentEpisodeData.cdnList.find((cdn) => cdn.isDefault === 1) || currentEpisodeData.cdnList[0] || null
    );
  }, [currentEpisodeData]);

  const availableQualities = useMemo(() => {
    const list = defaultCdn?.videoPathList
      ?.map((v) => v.quality)
      .filter((q): q is number => typeof q === "number");
    const unique = Array.from(new Set(list && list.length ? list : [720]));
    return unique.sort((a, b) => b - a);
  }, [defaultCdn]);

  // FIX: Fungsi URL Video dipaksa HTTPS agar tidak diblokir Vercel
  const getVideoUrl = () => {
    if (!currentEpisodeData || !defaultCdn) return "";
    const videoPath =
      defaultCdn.videoPathList.find((v) => v.quality === quality) ||
      defaultCdn.videoPathList.find((v) => v.isDefault === 1) ||
      defaultCdn.videoPathList[0];
    
    const url = videoPath?.videoPath || "";
    return url.replace("http://", "https://");
  };

  const handleVideoEnded = () => {
    if (!episodes) return;
    const next = currentEpisode + 1;
    if (next <= episodes.length - 1) {
      handleEpisodeChange(next, true);
    }
  };

  // Logic Subtitle (Tetap dipertahankan)
  const subtitleUrl = useMemo(() => {
    if (!currentEpisodeData || currentEpisodeData.useMultiSubtitle !== 1) return "";
    const indo = currentEpisodeData.subLanguageVoList?.find((s) => s.captionLanguage === "in" && s.url);
    if (indo) return indo.url;
    return currentEpisodeData.subLanguageVoList?.[0]?.url || "";
  }, [currentEpisodeData]);

  const proxiedSubtitleUrl = useMemo(() => {
    if (!subtitleUrl) return "";
    return `/api/proxy/video?url=${encodeURIComponent(subtitleUrl)}`;
  }, [subtitleUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !proxiedSubtitleUrl) return;

    const track = document.createElement('track');
    track.kind = 'subtitles';
    track.label = 'Indonesia';
    track.srclang = 'id';
    track.default = true;
    track.src = proxiedSubtitleUrl;
    video.appendChild(track);

    return () => { if (video.contains(track)) video.removeChild(track); };
  }, [proxiedSubtitleUrl]);

  let book: { bookId: string; bookName: string } | null = null;
  if (isDirectFormat(detailData)) {
    book = { bookId: detailData.bookId, bookName: detailData.bookName };
  } else if (isLegacyFormat(detailData)) {
    book = { bookId: detailData.data.book.bookId, bookName: detailData.data.book.bookName };
  }

  if (detailLoading || episodesLoading) {
    return (
      <main className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </main>
    );
  }

  if (!book || !episodes) return null;

  return (
    <main className="fixed inset-0 bg-black flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-40 h-16 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between px-4">
        <Link href={`/detail/dramabox/${bookId}`} className="text-white p-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-white text-sm font-medium truncate">{book.bookName}</h1>
          <p className="text-white/60 text-xs">Episode {currentEpisode + 1}</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white p-2"><Settings /></DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableQualities.map(q => (
                <DropdownMenuItem key={q} onClick={() => setQuality(q)}>{q}p</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={() => setShowEpisodeList(true)} className="text-white p-2"><List /></button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {currentEpisodeData ? (
          <video
            ref={videoRef}
            src={getVideoUrl()}
            controls
            autoPlay
            playsInline  /* FIX: Agar video bisa jalan di dalam browser HP */
            muted        /* FIX: Agar autoplay tidak diblokir browser mobile */
            onEnded={handleVideoEnded}
            className="w-full h-full object-contain"
            poster={currentEpisodeData.chapterImg?.replace("http://", "https://")}
          />
        ) : <Loader2 className="animate-spin text-primary" />}

        {/* Navigation Controls */}
        <div className="absolute bottom-20 z-40 w-full flex justify-center px-4">
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
            <button onClick={() => handleEpisodeChange(currentEpisode - 1)} disabled={currentEpisode === 0} className="text-white disabled:opacity-30">
              <ChevronLeft />
            </button>
            <span className="text-white text-sm">Ep {currentEpisode + 1} / {episodes.length}</span>
            <button onClick={() => handleEpisodeChange(currentEpisode + 1)} disabled={currentEpisode === episodes.length - 1} className="text-white disabled:opacity-30">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar List Episode (Sederhana) */}
      {showEpisodeList && (
        <div className="fixed inset-0 z-[70] bg-black/80 flex justify-end" onClick={() => setShowEpisodeList(false)}>
          <div className="w-72 bg-zinc-900 h-full p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-bold mb-4">Daftar Episode</h2>
            <div className="grid grid-cols-5 gap-2">
              {episodes.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleEpisodeChange(idx)}
                  className={`p-2 rounded ${idx === currentEpisode ? 'bg-primary' : 'bg-white/10'} text-white text-xs`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
