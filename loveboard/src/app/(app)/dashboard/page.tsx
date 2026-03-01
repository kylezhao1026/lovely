"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CuteCard } from "@/components/ui/CuteCard";
import { HeartButton } from "@/components/ui/HeartButton";
import { PartnerHeader } from "@/components/dashboard/PartnerHeader";
import { QuickNote } from "@/components/dashboard/QuickNote";
import { CheckInWidget } from "@/components/dashboard/CheckInWidget";
import { PetWidget } from "@/components/dashboard/PetWidget";
import { TriviaWidget } from "@/components/dashboard/TriviaWidget";
import { StreaksWidget } from "@/components/dashboard/StreaksWidget";
import { PhotoWidget } from "@/components/dashboard/PhotoWidget";
import { DaysTogetherWidget } from "@/components/dashboard/DaysTogetherWidget";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;
  const [space, setSpace] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [pet, setPet] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    const [spaceRes, notesRes, checkInsRes, petRes, photosRes] =
      await Promise.all([
        fetch("/api/couples"),
        fetch("/api/notes"),
        fetch("/api/checkins"),
        fetch("/api/pet"),
        fetch("/api/photos"),
      ]);
    const [spaceData, notesData, checkInsData, petData, photosData] =
      await Promise.all([
        spaceRes.json(),
        notesRes.json(),
        checkInsRes.json(),
        petRes.json(),
        photosRes.json(),
      ]);
    setSpace(spaceData.data);
    if (notesData.success) setNotes(notesData.data);
    if (checkInsData.success) setCheckIns(checkInsData.data);
    if (petData.success) setPet(petData.data);
    if (photosData.success) setPhotos(photosData.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user?.coupleSpaceId) fetchAll();
    else {
      fetch("/api/couples")
        .then((r) => r.json())
        .then((d) => {
          setSpace(d.data);
          setLoading(false);
        });
    }
  }, [user?.coupleSpaceId, fetchAll]);

  async function createSpace() {
    const res = await fetch("/api/couples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.success) {
      await update({ coupleSpaceId: data.data.id });
      fetchAll();
    }
  }

  async function generateInvite() {
    const res = await fetch("/api/invitations", { method: "POST" });
    const data = await res.json();
    if (data.success) setInviteCode(data.data.code);
  }

  async function joinSpace() {
    setError("");
    const res = await fetch("/api/invitations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode }),
    });
    const data = await res.json();
    if (data.success) {
      await update({ coupleSpaceId: data.data.coupleSpaceId });
      fetchAll();
    } else {
      setError(data.error || "Invalid code");
    }
  }

  async function sendNote(content: string, color: string) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, color }),
    });
    const data = await res.json();
    if (data.success) setNotes([data.data, ...notes]);
  }

  async function deleteNote(id: string) {
    const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    if ((await res.json()).success) setNotes(notes.filter((n) => n.id !== id));
  }

  async function doCheckIn(mood: string, message?: string) {
    const res = await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, message }),
    });
    const data = await res.json();
    if (data.success) setCheckIns([data.data, ...checkIns]);
  }

  async function petAction(action: string) {
    const res = await fetch("/api/pet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (data.success) setPet(data.data);
  }

  async function uploadPhoto(imageData: string, caption?: string) {
    const res = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageData, caption }),
    });
    const data = await res.json();
    if (data.success) setPhotos([data.data, ...photos]);
  }

  async function deletePhoto(id: string) {
    const res = await fetch(`/api/photos?id=${id}`, { method: "DELETE" });
    if ((await res.json()).success) {
      setPhotos(photos.filter((p) => p.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-4xl animate-heart-pulse">💕</div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mt-3 dark:text-slate-100">Welcome, {user?.name}!</h1>
          <p className="text-gray-400 dark:text-slate-400 mt-1">
            Let's get you paired. Create your space, then send your partner an invite code.
          </p>
        </div>

        <CuteCard>
          <h2 className="font-bold text-gray-700 dark:text-slate-100 mb-3">Step 1: Create a Couple Space</h2>
          <HeartButton onClick={createSpace} className="w-full">
            Create Our Space
          </HeartButton>
        </CuteCard>

        <div className="text-center text-sm text-gray-300 dark:text-slate-500 font-semibold">
          or
        </div>

        <CuteCard>
          <h2 className="font-bold text-gray-700 dark:text-slate-100 mb-3">
            Step 1 (alternative): Join with Invite Code
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="cute-input flex-1"
              placeholder="Enter invite code"
              maxLength={8}
            />
            <HeartButton onClick={joinSpace} variant="secondary">
              Join
            </HeartButton>
          </div>
          {error && <p className="text-sm text-love-500 mt-2">{error}</p>}
        </CuteCard>
      </div>
    );
  }

  const partner = space.members?.find((m: any) => m.id !== user?.id);
  const partnerCheckIns = checkIns.filter(
    (ci: any) => ci.author?.id !== user?.id
  );

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PartnerHeader
        spaceName={space.name}
        user={user}
        partner={partner}
        inviteCode={inviteCode}
        onGenerateInvite={generateInvite}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-min">
        <div className="md:col-span-4 md:row-span-2">
          <div className="bento-cell h-full min-h-[420px]">
            <PetWidget pet={pet} onAction={petAction} />
          </div>
        </div>

        <div className="md:col-span-4 md:row-span-2">
          <div className="bento-cell h-full min-h-[420px]">
            <CheckInWidget
              recentCheckIns={partnerCheckIns}
              onCheckIn={doCheckIn}
            />
          </div>
        </div>

        <div className="md:col-span-4 grid grid-rows-2 gap-3">
          <div className="bento-cell min-h-[160px]">
            <DaysTogetherWidget
              startDate={space.startDate || space.createdAt}
              partnerName={partner?.name}
            />
          </div>
          <div className="bento-cell min-h-[160px]">
            <StreaksWidget streaks={space.streaks || []} />
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="bento-cell h-full min-h-[360px]">
            <TriviaWidget />
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="bento-cell h-full min-h-[360px]">
            <PhotoWidget
              photos={photos}
              onUpload={uploadPhoto}
              onDelete={deletePhoto}
              userId={user?.id}
              partnerName={partner?.name}
            />
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="bento-cell min-h-[220px]">
            <QuickNote
              notes={notes}
              onSend={sendNote}
              onDelete={deleteNote}
              userId={user?.id}
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <Link href="/games">
            <div className="bento-cell h-full min-h-[220px] flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-lavender-300 transition-colors">
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-lavender-300 group-hover:text-lavender-400 transition-colors"
                >
                  <rect x="6" y="3" width="12" height="18" rx="2" />
                  <circle cx="12" cy="14" r="2" />
                  <line x1="10" y1="8" x2="14" y2="8" />
                </svg>
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-600 dark:text-slate-200 group-hover:text-lavender-400 transition-colors">
                  Play Games
                </p>
                <p className="text-[10px] text-gray-300 dark:text-slate-400 mt-0.5">
                  Memory Match · Pixel Canvas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
