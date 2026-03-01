"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
// @ts-ignore
import { Ghost } from "react-kawaii";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [settings, setSettings] = useState<any>(null);
  const [name, setName] = useState("");
  const [spaceName, setSpaceName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showUnpair, setShowUnpair] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSettings(d.data);
          setName(d.data.user?.name || "");
          setSpaceName(d.data.space?.name || "");
        }
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, spaceName }),
    });
    setSaving(false);
    if ((await res.json()).success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleUnpair() {
    const res = await fetch("/api/settings", { method: "DELETE" });
    if ((await res.json()).success) {
      await update({ coupleSpaceId: null });
      window.location.href = "/dashboard";
    }
  }

  const partner = settings?.space?.members?.find(
    (m: any) => m.id !== settings?.user?.id
  );

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Ghost size={32} mood="happy" color="#fda4af" />
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
      </div>

      {/* Profile */}
      <div className="bento-cell space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Your Profile
        </h2>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="cute-input"
            maxLength={50}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            Email
          </label>
          <p className="text-sm text-gray-400 px-4 py-2.5">
            {settings?.user?.email}
          </p>
        </div>
      </div>

      {/* Couple Space */}
      {settings?.space && (
        <div className="bento-cell space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Couple Space
          </h2>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Space Name
            </label>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              className="cute-input"
              maxLength={50}
            />
          </div>
          {partner && (
            <div className="flex items-center gap-3 bg-love-50 rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center text-lg">
                {partner.avatarEmoji || "💕"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {partner.name}
                </p>
                <p className="text-[10px] text-gray-400">{partner.email}</p>
              </div>
            </div>
          )}
          <p className="text-[10px] text-gray-300">
            Joined {new Date(settings.space.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full text-sm font-semibold py-2.5 rounded-xl bg-love-400 text-white hover:bg-love-500 transition-all disabled:opacity-50"
      >
        {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
      </button>

      {/* Danger zone */}
      <div className="bento-cell space-y-3 border-rose-200/50">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Account
        </h2>

        {settings?.space && (
          <>
            {!showUnpair ? (
              <button
                onClick={() => setShowUnpair(true)}
                className="w-full text-xs font-medium py-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
              >
                Unpair from couple space
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-rose-50 rounded-xl p-3 space-y-2"
              >
                <p className="text-xs text-gray-600">
                  This will remove you from the couple space. Your partner will
                  remain. Notes and check-ins are preserved.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUnpair}
                    className="flex-1 text-xs font-semibold py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-all"
                  >
                    Confirm Unpair
                  </button>
                  <button
                    onClick={() => setShowUnpair(false)}
                    className="flex-1 text-xs font-semibold py-2 rounded-lg bg-white text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full text-xs font-medium py-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
