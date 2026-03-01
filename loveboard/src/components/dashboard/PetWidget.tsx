"use client";

import { useState } from "react";
import { motion } from "framer-motion";
// @ts-ignore - react-kawaii doesn't have type defs
import { Planet, Ghost, Cat, IceCream, SpeechBubble } from "react-kawaii";
import { getStageEmoji } from "@/lib/pet";
import type { GrowthStage } from "@prisma/client";

const STAGE_CONFIG: Record<
  string,
  { Component: any; size: number; label: string }
> = {
  SEED: { Component: Ghost, size: 80, label: "Baby Ghost" },
  SPROUT: { Component: IceCream, size: 90, label: "Little Sprout" },
  GROWING: { Component: Cat, size: 100, label: "Growing Kitty" },
  BLOOMING: { Component: Planet, size: 110, label: "Blooming Star" },
  FLOURISHING: { Component: SpeechBubble, size: 120, label: "Love Bug" },
};

const MOOD_MAP: Record<string, string> = {
  happy: "blissful",
  ok: "happy",
  sad: "sad",
  low: "shocked",
};

function getPetMood(health: number): string {
  if (health >= 80) return "blissful";
  if (health >= 60) return "happy";
  if (health >= 40) return "sad";
  return "shocked";
}

interface PetWidgetProps {
  pet: any;
  onAction: (action: string) => Promise<void>;
}

export function PetWidget({ pet, onAction }: PetWidgetProps) {
  const [acting, setActing] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  if (!pet) return null;

  const config = STAGE_CONFIG[pet.growthStage] || STAGE_CONFIG.SEED;
  const KawaiiComponent = config.Component;
  const mood = getPetMood(pet.health);

  async function handleAction(action: string) {
    if (acting) return;
    setActing(true);
    setLastAction(action);
    await onAction(action);
    setActing(false);
    setTimeout(() => setLastAction(null), 2000);
  }

  const actions = [
    { type: "feed", label: "Feed", icon: "🍎" },
    { type: "play", label: "Play", icon: "🎾" },
    { type: "water", label: "Water", icon: "💧" },
  ];

  return (
    <div className="h-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          {pet.name}
        </h3>
        <span className="text-[10px] text-gray-300 capitalize">
          {pet.growthStage.toLowerCase()} &middot; {pet.experience} xp
        </span>
      </div>

      {/* Pet character */}
      <div className="flex-1 flex items-center justify-center py-2">
        <motion.div
          animate={
            lastAction
              ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
              : { y: [0, -6, 0] }
          }
          transition={
            lastAction
              ? { duration: 0.4 }
              : { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }
        >
          <KawaiiComponent size={config.size} mood={mood} color="#fda4af" />
        </motion.div>
      </div>

      {/* Feedback text */}
      <div className="h-5 mb-2">
        {lastAction && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-love-500 font-medium text-center"
          >
            {lastAction === "feed" && "Yum yum!"}
            {lastAction === "play" && "So fun!"}
            {lastAction === "water" && "Refreshing!"}
          </motion.p>
        )}
      </div>

      {/* Stat bars */}
      <div className="w-full space-y-1.5 mb-3">
        {[
          { label: "Hunger", value: pet.hunger, color: "bg-orange-300" },
          { label: "Happy", value: pet.happiness, color: "bg-yellow-300" },
          { label: "Health", value: pet.health, color: "bg-rose-300" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-10">{stat.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${stat.color}`}
                initial={false}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] text-gray-400 w-6 text-right">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 w-full">
        {actions.map((a) => (
          <button
            key={a.type}
            onClick={() => handleAction(a.type)}
            disabled={acting}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl bg-white border border-gray-100 hover:border-love-200 hover:bg-love-50/50 transition-all active:scale-95 disabled:opacity-40"
          >
            <span className="text-base">{a.icon}</span>
            <span className="text-[10px] text-gray-500">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
