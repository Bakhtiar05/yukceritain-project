"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the event link
    e.stopPropagation();

    // Get the base URL securely without depending on environment variables which might be missing on client
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${baseUrl}/events/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Yukceritain Event: ${title}`,
          text: `Ayo ikuti event "${title}" di YukceritaIN!`,
          url: shareUrl,
        });
      } catch (error) {
        // user aborted or error
        console.log("Share failed", error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link disalin!",
          description: "Link event berhasil disalin ke clipboard.",
        });
      } catch (err) {
        toast({
          title: "Gagal menyalin",
          description: "Silakan salin link secara manual: " + shareUrl,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center p-2 text-slate-500 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors shadow-sm focus:outline-none"
      title="Bagikan Event"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}
