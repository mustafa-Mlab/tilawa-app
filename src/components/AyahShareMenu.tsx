"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check, ExternalLink, X } from "lucide-react";
import { AyahDetail } from "@/lib/quran";

interface AyahShareMenuProps {
  ayah: AyahDetail;
  surahId: number;
  surahName: string;
}

export function AyahShareMenu({ ayah, surahId, surahName }: AyahShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/surah/${surahId}#ayah-${ayah.numberInSurah}`;
    }
    return `https://tilawa-app.vercel.app/surah/${surahId}#ayah-${ayah.numberInSurah}`;
  };

  const getShareText = () =>
    `📖 Quran ${surahId}:${ayah.numberInSurah} (${surahName})\n\n"${ayah.englishText}"\n\n"${ayah.banglaText}"`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surah ${surahName} (${surahId}:${ayah.numberInSurah})`,
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch (err) {
        console.error("Native share error:", err);
      }
    }
  };

  const shareUrl = getShareUrl();
  const shareText = getShareText();

  const socialLinks = [
    {
      name: "Facebook",
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "X",
      color: "#111827",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Surah ${surahName} (${surahId}:${ayah.numberInSurah})\n\n"${ayah.englishText.slice(0, 180)}..."`)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      color: "#25D366",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      color: "#229ED9",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.411-.168.56-.504.745-.84.773-.73.064-1.287-.478-1.994-.942-.985-.646-1.543-1.047-2.497-1.675-1.103-.726-.388-1.125.241-1.778.164-.171 3.018-2.766 3.073-3.003.007-.03.013-.141-.053-.2-.066-.059-.163-.039-.234-.023-.1.023-1.696 1.079-4.787 3.167-.453.311-.863.465-1.23.456-.405-.008-1.185-.229-1.765-.418-.711-.232-1.275-.355-1.226-.75.025-.207.311-.42.857-.639 3.359-1.463 5.6-2.428 6.723-2.896 3.197-1.332 3.861-1.564 4.292-1.572.095 0 .308.023.446.136.117.095.149.224.164.316.015.093.033.308.018.474z" />
        </svg>
      ),
    },
    {
      name: "Reddit",
      color: "#FF4500",
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Surah ${surahName} (${surahId}:${ayah.numberInSurah})`)}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.363.043-.538A1.758 1.758 0 0 1 4.08 12.00c0-.968.786-1.754 1.754-1.754.463 0 .882.18 1.189.477 1.188-.847 2.828-1.405 4.636-1.484l.905-4.242 3.282.694a1.247 1.247 0 0 1 1.167-.947z" />
        </svg>
      ),
    },
    {
      name: "Tumblr",
      color: "#35465C",
      url: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(shareUrl)}&caption=${encodeURIComponent(shareText)}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.648h3.36v6.012h4.526v3.735h-4.526v7.304c0 1.455.787 2.277 2.228 2.277.94 0 1.966-.358 2.658-.801V22.25c-1.034.908-2.677 1.75-3.509 1.75z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      color: "#0A66C2",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-9.5 w-9.5 items-center justify-center rounded-lg transition-all ${
          isOpen
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
            : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
        }`}
        aria-label="Share Ayah"
        title="Share Ayah"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {/* Popover — opens upward so it never clips below the card */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/20 dark:shadow-zinc-950/60 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
              <Share2 className="h-3 w-3 text-emerald-500" />
              Share {surahId}:{ayah.numberInSurah}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* 4-column icon grid */}
          <div className="grid grid-cols-4 gap-px p-3">
            {socialLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                title={platform.name}
                className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-transform group-hover:scale-110 group-active:scale-95"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.icon}
                </span>
                <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 truncate w-full text-center leading-tight">
                  {platform.name}
                </span>
              </a>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="px-3 pb-3 pt-0.5 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                copiedLink
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {copiedLink
                ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                : <Copy className="h-3.5 w-3.5 text-zinc-400 shrink-0" />}
              {copiedLink ? "Link Copied!" : "Copy Verse Link"}
            </button>

            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                More options…
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
