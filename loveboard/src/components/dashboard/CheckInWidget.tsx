"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import { Ghost, Cat, Planet, IceCream, SpeechBubble, Mug } from "react-kawaii";

const MOODS = [
  { value: "HAPPY", Component: Cat, color: "#fde68a", label: "Happy", mood: "happy" },
  { value: "SAD", Component: Ghost, color: "#bae6fd", label: "Sad", mood: "sad" },
  { value: "EXCITED", Component: Planet, color: "#fda4af", label: "Excited", mood: "blissful" },
  { value: "TIRED", Component: Mug, color: "#e9d5ff", label: "Tired", mood: "sad" },
  { value: "LOVING", Component: SpeechBubble, color: "#fecdd3", label: "Loving", mood: "lovestruck" },
  { value: "NEUTRAL", Component: IceCream, color: "#bbf7d0", label: "Chill", mood: "happy" },
];

interface CheckInWidgetProps {
  recentCheckIns: any[];
  onCheckIn: (mood: string, message?: string) => Promise<void>;
}

export function CheckInWidget({ recentCheckIns, onCheckIn }: CheckInWidgetProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!selected || sending) return;
    setSending(true);
    await onCheckIn(selected, message || undefined);
    setSubmitted(true);
    setSending(false);
  }

  const partnerCheckIn = recentCheckIns[0];
  const partnerMoodDef = partnerCheckIn
    ? MOODS.find((m) => m.value === partnerCheckIn.mood)
    : null;

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        How are you?
      </h3>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-2"
          >
            {(() => {
              const m = MOODS.find((m) => m.value === selected);
              if (!m) return null;
              const C = m.Component;
              return <C size={48} mood={m.mood} color={m.color} />;
            })()}
            <p className="text-xs text-gray-400">Checked in!</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelected(null);
                setMessage("");
              }}
              className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors mt-1"
            >
              Change
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" className="flex-1 flex flex-col">
            {/* Mood grid with kawaii characters */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {MOODS.map((m) => {
                const C = m.Component;
                return (
                  <motion.button
                    key={m.value}
                    onClick={() => setSelected(m.value)}
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center py-2.5 rounded-xl text-xs transition-all ${
                      selected === m.value
                        ? "ring-2 ring-love-300 shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor:
                        selected === m.value ? `${m.color}40` : "transparent",
                    }}
                  >
                    <C size={28} mood={m.mood} color={m.color} />
                    <span className="text-[10px] text-gray-500 mt-1">
                      {m.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Message + send */}
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A little note... (optional)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-love-300 placeholder:text-gray-300"
                  maxLength={140}
                />
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-full text-xs font-semibold py-2 rounded-xl bg-love-400 text-white hover:bg-love-500 transition-colors disabled:opacity-50"
                >
                  {sending ? "..." : "Check in"}
                </button>
              </motion.div>
            )}

            {/* Partner's mood */}
            {partnerMoodDef && partnerCheckIn && (
              <div className="mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <partnerMoodDef.Component
                    size={24}
                    mood={partnerMoodDef.mood}
                    color={partnerMoodDef.color}
                  />
                  <div>
                    <p className="text-[11px] font-medium text-gray-600">
                      {partnerCheckIn.author?.name} is feeling{" "}
                      {partnerMoodDef.label.toLowerCase()}
                    </p>
                    {partnerCheckIn.message && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        &ldquo;{partnerCheckIn.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
