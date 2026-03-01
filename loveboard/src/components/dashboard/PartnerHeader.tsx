"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface PartnerHeaderProps {
  spaceName: string;
  user: any;
  partner: any;
  inviteCode?: string;
  onGenerateInvite: () => Promise<void>;
}

export function PartnerHeader({
  spaceName,
  user,
  partner,
  inviteCode,
  onGenerateInvite,
}: PartnerHeaderProps) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-gray-800">{spaceName}</h1>
        <p className="text-xs text-gray-400">
          {partner
            ? `${user?.name} & ${partner.name}`
            : "Waiting for your partner..."}
        </p>
      </div>

      {partner ? (
        <div className="flex -space-x-2">
          <div className="w-9 h-9 rounded-full bg-love-100 border-2 border-white flex items-center justify-center text-sm">
            {user?.avatarEmoji || "💕"}
          </div>
          <div className="w-9 h-9 rounded-full bg-lavender-100 border-2 border-white flex items-center justify-center text-sm">
            {partner.avatarEmoji || "💕"}
          </div>
        </div>
      ) : (
        <div>
          {inviteCode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-love-50 rounded-xl px-3 py-1.5 text-center"
            >
              <p className="text-xs text-gray-400">Invite code</p>
              <p className="text-sm font-mono font-bold text-love-500 tracking-widest">
                {inviteCode}
              </p>
            </motion.div>
          ) : (
            <button
              onClick={onGenerateInvite}
              className="text-xs font-semibold text-love-500 hover:text-love-600 bg-love-50 hover:bg-love-100 px-3 py-1.5 rounded-full transition-all"
            >
              Invite partner
            </button>
          )}
        </div>
      )}
    </div>
  );
}
