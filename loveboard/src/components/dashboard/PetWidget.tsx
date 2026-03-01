"use client";

import { useState } from "react";
import { motion } from "framer-motion";
// @ts-ignore - react-kawaii doesn't have type defs
import { Planet, Ghost, Cat, IceCream, SpeechBubble } from "react-kawaii";
import { getNextStageXP } from "@/lib/pet";
import type { GrowthStage } from "@prisma/client";

const STAGE_CONFIG: Record<
  string,
  { Component: any; size: number; label: string; color: string }
> = {
  SEED: { Component: Ghost, size: 88, label: "Baby Ghost", color: "#fda4af" },
  SPROUT: { Component: IceCream, size: 96, label: "Little Sprout", color: "#fbcfe8" },
  GROWING: { Component: Cat, size: 104, label: "Growing Kitty", color: "#fde68a" },
  BLOOMING: { Component: Planet, size: 114, label: "Blooming Star", color: "#c4b5fd" },
  FLOURISHING: { Component: SpeechBubble, size: 126, label: "Love Bug", color: "#fda4af" },
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
  const nextStageXP = getNextStageXP(pet.growthStage as GrowthStage);
  const progress = nextStageXP
    ? Math.min(100, Math.round((pet.experience / nextStageXP) * 100))
    : 100;

  async function handleAction(action: string) {
    if (acting) return;
    setActing(true);
    setLastAction(action);
    await onAction(action);
    setActing(false);
    setTimeout(() => setLastAction(null), 2200);
  }

  const actions = [
    { type: "feed", label: "Feed", iconPath: "/icons/action-feed.svg" },
    { type: "play", label: "Play", iconPath: "/icons/action-play.svg" },
    { type: "water", label: "Water", iconPath: "/icons/action-water.svg" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
            {pet.name}
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-slate-400">
            {config.label} • {pet.growthStage.toLowerCase()} stage
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-600 dark:text-slate-200">{pet.experience} XP</p>
          <p className="text-[10px] text-gray-400 dark:text-slate-400">
            {nextStageXP ? `${nextStageXP - pet.experience} to next` : "Max stage"}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-love-300 to-lavender-300"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-2">
        <motion.div
          animate={
            lastAction
              ? { scale: [1, 1.14, 1], rotate: [0, -5, 5, 0] }
              : { y: [0, -6, 0] }
          }
          transition={
            lastAction
              ? { duration: 0.38 }
              : { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }
        >
          <KawaiiComponent size={config.size} mood={mood} color={config.color} />
        </motion.div>
      </div>

      <div className="h-5 mb-2 text-center">
        {lastAction ? (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-love-500 font-medium"
          >
            {lastAction === "feed" && "Nice meal for your lovely bug"}
            {lastAction === "play" && "Playtime makes them sparkle"}
            {lastAction === "water" && "Hydrated and comfy"}
          </motion.p>
        ) : (
          <p className="text-[11px] text-gray-400 dark:text-slate-400">Actions scale down when stats are already high</p>
        )}
      </div>

      <div className="w-full space-y-1.5 mb-3">
        {[
          { label: "Hunger", value: pet.hunger, color: "bg-orange-300" },
          { label: "Happy", value: pet.happiness, color: "bg-yellow-300" },
          { label: "Health", value: pet.health, color: "bg-rose-300" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 dark:text-slate-400 w-10">{stat.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${stat.color}`}
                initial={false}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 0.45 }}
              />
            </div>
            <span className="text-[10px] text-gray-500 dark:text-slate-300 w-7 text-right">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {actions.map((a) => (
          <button
            key={a.type}
            onClick={() => handleAction(a.type)}
            disabled={acting}
            className="flex flex-col items-center gap-0.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-love-200 dark:hover:border-lavender-300 hover:bg-love-50/50 dark:hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-40"
          >
            <img src={a.iconPath} alt={a.label} className="w-7 h-7" />
            <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
