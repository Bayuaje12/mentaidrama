"use client";

import { ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on watch pages for immersive video experience
  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm pt-8 pb-6">
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* WhatsApp Channel Call to Action */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <p className="text-[10px] text-primary/60 uppercase tracking-[0.4em] font-bold">Join Community</p>
          <a 
            href="https://whatsapp.com/channel/0029VbBsAy17T8bbFQZ9y410"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 hover:border-primary transition-all duration-300 group shadow-[0_0_20px_rgba(212,175,55,0.1)]"
          >
            <MessageCircle className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Saluran WhatsApp MentaiDrama
            </span>
          </a>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-muted-foreground text-center">
            API yang digunakan:{" "}
            <a 
                  href="https://api.sansekai.my.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                >
                  SΛNSΞKΛI API
                  <ExternalLink className="w-3 h-3" />
                </a>
          </p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/80 text-center font-medium">
            © {new Date().getFullYear()} Made with ❤️ by iboyCloud
          </p>
        </div>
      </div>
    </footer>
  );
}
