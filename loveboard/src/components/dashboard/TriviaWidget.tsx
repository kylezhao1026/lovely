"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TriviaWidgetProps {
  coupleSpaceId: string;
}

export function TriviaWidget({ coupleSpaceId }: TriviaWidgetProps) {
  const [question, setQuestion] = useState<any>(null);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const res = await fetch("/api/games/trivia");
    const data = await res.json();
    if (data.success) {
      const all = [
        ...data.data.defaults.map((d: any) => ({ ...d, isDefault: true })),
        ...data.data.custom,
      ];
      setAllQuestions(all);
      if (all.length > 0) {
        // Pick a random question
        const randomIdx = Math.floor(Math.random() * all.length);
        setIdx(randomIdx);
        setQuestion(all[randomIdx]);
      }
    }
  }

  const nextQuestion = useCallback(() => {
    setRevealed(false);
    setAnswer("");
    const next = (idx + 1) % allQuestions.length;
    setIdx(next);
    setQuestion(allQuestions[next]);
  }, [idx, allQuestions]);

  if (!question) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-300">
        <p className="text-sm">No trivia yet</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Daily Trivia
        </h3>
        <button
          onClick={nextQuestion}
          className="text-[10px] text-gray-400 hover:text-love-500 transition-colors font-medium"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-3"
          >
            {/* Question */}
            <div className="bg-lavender-100/60 rounded-2xl p-4">
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                {question.question}
              </p>
            </div>

            {!revealed ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="w-full text-sm px-3 py-2 rounded-xl border border-lavender-200 bg-white/80 focus:outline-none focus:ring-1 focus:ring-lavender-300 placeholder:text-gray-300"
                  onKeyDown={(e) => e.key === "Enter" && setRevealed(true)}
                />
                <button
                  onClick={() => setRevealed(true)}
                  className="w-full text-xs font-semibold text-lavender-400 hover:text-lavender-500 transition-colors py-1"
                >
                  Reveal answer
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {question.answer && (
                  <div className="bg-love-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 mb-0.5">Answer</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {question.answer}
                    </p>
                  </div>
                )}
                <button
                  onClick={nextQuestion}
                  className="w-full text-xs font-semibold text-love-400 hover:text-love-500 py-1 transition-colors"
                >
                  Next question
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-gray-300 text-center mt-2">
        {allQuestions.length} questions
      </p>
    </div>
  );
}
