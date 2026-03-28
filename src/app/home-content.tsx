"use client";

import { PlatformSelector } from "@/components/PlatformSelector";
import { DramaSection } from "@/components/DramaSection";
import { ReelShortSection } from "@/components/ReelShortSection";
import { ShortMaxHome } from "@/components/ShortMaxHome";
import { NetShortHome } from "@/components/NetShortHome";
import { MeloloHome } from "@/components/MeloloHome";
import { FlickReelsHome } from "@/components/FlickReelsHome";
import { FreeReelsHome } from "@/components/FreeReelsHome";
import { useLatestDramas, useTrendingDramas, useDubindoDramas } from "@/hooks/useDramas";
import { usePlatform } from "@/hooks/usePlatform";
import { InfiniteDramaSection } from "@/components/InfiniteDramaSection";

export default function HomeContent() {
  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels } = usePlatform();

  // Fetch data hooks
  const { data: latestDramas, isLoading: loadingLatest, error: errorLatest, refetch: refetchLatest } = useLatestDramas();
  const { data: trendingDramas, isLoading: loadingTrending, error: errorTrending, refetch: refetchTrending } = useTrendingDramas();
  const { data: dubindoDramas, isLoading: loadingDubindo, error: errorDubindo, refetch: refetchDubindo } = useDubindoDramas();

  return (
    <main className="min-h-screen pb-20">
      {/* Platform Selector - FIXED 
          Diberi z-30 agar berada di bawah Header (z-500) tapi di atas konten.
          Top-20 disesuaikan agar pas di bawah header saat di-scroll.
      */}
      <div className="sticky top-[72px] z-30 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="container mx-auto">
          <PlatformSelector />
        </div>
      </div>

      {/* Konten DramaBox */}
      {isDramaBox && (
        <div className="container mx-auto px-4 py-8 space-y-12 relative z-10">
          <DramaSection
            title="Terbaru"
            dramas={latestDramas}
            isLoading={loadingLatest}
            error={!!errorLatest}
            onRetry={() => refetchLatest()}
          />
          
          <DramaSection
            title="Terpopuler"
            dramas={trendingDramas}
            isLoading={loadingTrending}
            error={!!errorTrending}
            onRetry={() => refetchTrending()}
          />

          <DramaSection
            title="Dubindo"
            dramas={dubindoDramas}
            isLoading={loadingDubindo}
            error={!!errorDubindo}
            onRetry={() => refetchDubindo()}
          />

          {/* Infinite Scroll Section */}
          <div className="pt-4 border-t border-white/5">
             <InfiniteDramaSection title="Lainnya Untuk Kamu" />
          </div>
        </div>
      )}

      {/* Render Platform Lainnya */}
      <div className="relative z-10">
        {isReelShort && (
          <div className="container mx-auto px-4 py-6 space-y-8">
            <ReelShortSection />
          </div>
        )}

        {isShortMax && (
          <div className="container mx-auto px-4 py-6 space-y-8">
            <ShortMaxHome />
          </div>
        )}

        {isNetShort && (
          <div className="container mx-auto px-4 py-6 space-y-8">
            <NetShortHome />
          </div>
        )}

        {isMelolo && (
          <div className="container mx-auto px-4 py-6 space-y-8">
            <MeloloHome />
          </div>
        )}

        {isFlickReels && (
          <div className="container mx-auto px-4 py-6 space-y-8">
            <FlickReelsHome />
          </div>
        )}

        {isFreeReels && (
          <div className="container mx-auto px-4 py-6 space-y-8">
            <FreeReelsHome />
          </div>
        )}
      </div>
    </main>
  );
}
