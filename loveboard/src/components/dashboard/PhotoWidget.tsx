"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoWidgetProps {
  photos: any[];
  onUpload: (imageData: string, caption?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  userId: string;
}

export function PhotoWidget({ photos, onUpload, onDelete, userId }: PhotoWidgetProps) {
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      await onUpload(dataUri, caption || undefined);
      setCaption("");
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        Photos
      </h3>

      {/* Upload area */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-love-300 placeholder:text-gray-300"
          maxLength={200}
        />
        <label className="flex items-center gap-1 text-xs font-semibold text-love-500 hover:text-love-600 bg-love-50 hover:bg-love-100 px-3 py-2 rounded-xl cursor-pointer transition-all">
          {uploading ? "..." : "Upload"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Photo grid */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
        {photos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-gray-300">Share your first photo together</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            <AnimatePresence>
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setViewingIdx(i)}
                >
                  <img
                    src={photo.imageData}
                    alt={photo.caption || "Shared photo"}
                    className="w-full h-full object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] text-white truncate">{photo.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {viewingIdx !== null && photos[viewingIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setViewingIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[viewingIdx].imageData}
                alt={photos[viewingIdx].caption || "Photo"}
                className="w-full max-h-[60vh] object-contain bg-gray-50"
              />
              <div className="p-4 flex items-center justify-between">
                <div>
                  {photos[viewingIdx].caption && (
                    <p className="text-sm text-gray-600">{photos[viewingIdx].caption}</p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-1">
                    {new Date(photos[viewingIdx].createdAt).toLocaleDateString()}
                  </p>
                </div>
                {photos[viewingIdx].authorId === userId && (
                  <button
                    onClick={() => {
                      onDelete(photos[viewingIdx].id);
                      setViewingIdx(null);
                    }}
                    className="text-xs text-gray-300 hover:text-rose-400 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
