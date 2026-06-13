import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const localAudio: Record<string, string[]> = {
    adhan: [],
    sana: [],
    kalimah: [],
  };

  const baseDir = path.join(process.cwd(), "public", "audio");

  try {
    if (fs.existsSync(baseDir)) {
      const categories = ["adhan", "sana", "kalimah"];
      for (const category of categories) {
        const catDir = path.join(baseDir, category);
        if (fs.existsSync(catDir)) {
          const files = fs.readdirSync(catDir);
          // Only include .mp3 files and sort them naturally (so azan10.mp3 comes after azan9.mp3)
          localAudio[category] = files
            .filter((f) => f.toLowerCase().endsWith(".mp3"))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
        }
      }
    }
  } catch (error) {
    console.error("Error reading local audio directory", error);
  }

  return NextResponse.json(localAudio);
}
