"use client";

import { motion } from "framer-motion";
import { getStreakEmoji, getStreakMessage } from "@/lib/streaks";

interface StreaksWidgetProps {
  streaks: any[];
}

const STREAK_LABELS: Record<string, string> = {
  checkin: "Check-ins",
  pet_care: "Pet Care",
  notes: "Notes",
};

export function StreaksWidget({ streaks }: StreaksWidgetProps) {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        Streaks
      </h3>

      <div className="flex-1 flex flex-col justify-center gap-3">
        {streaks.map((streak, i) => {
          const emoji = getStreakEmoji(streak.currentCount);
          return (
            <motion.div
              key={streak.id || streak.type}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <motion.span
                className="text-xl w-8 text-center"
                animate={
                  streak.currentCount >= 7
                    ? { rotate: [0, -8, 8, 0] }
                    : undefined
                }
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {emoji}
              </motion.span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">
                    {STREAK_LABELS[streak.type] || streak.type}
                  </p>
                  <p className="text-xs font-bold text-love-500">
                    {streak.currentCount}
                  </p>
                </div>
                <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-love-300 to-love-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        (streak.currentCount / 30) * 100,
                        100
                      )}%`,
                    }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  />
                </div>
                <p className="text-[10px] text-gray-300 mt-0.5">
                  Best: {streak.longestCount} days
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
