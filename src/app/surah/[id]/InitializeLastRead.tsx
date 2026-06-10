"use client";

import { useEffect } from "react";
import { useQuran } from "@/context/QuranContext";

interface InitializeLastReadProps {
  surahId: number;
  surahName: string;
}

export function InitializeLastRead({ surahId, surahName }: InitializeLastReadProps) {
  const { updateLastRead } = useQuran();

  useEffect(() => {
    // Save/update this Surah as the last read surah, starting at Ayah 1
    updateLastRead(surahId, surahName, 1);
  }, [surahId, surahName, updateLastRead]);

  return null;
}
