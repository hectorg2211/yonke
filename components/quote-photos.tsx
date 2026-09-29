"use client";

import { useEffect, useId, useState } from "react";

import { quotePhotoLimits } from "@/lib/quotes";

const MAX_FILES = quotePhotoLimits.maxFiles;
const MAX_BYTES = quotePhotoLimits.maxBytes;

export function QuotePhotos({
  files,
  onChange,
  variant = "compact",
  hint = "Opcional. Una foto ayuda a cotizar.",
}: {
  files: File[];
  onChange: (files: File[]) => void;
  variant?: "compact" | "hero";
  hint?: string;
}) {
  const cameraId = useId();
  const galleryId = useId();
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const full = files.length >= MAX_FILES;

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [files]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const next: File[] = [...files];
    let message: string | null = null;

    for (const file of incoming) {
      if (next.length >= MAX_FILES) {
        message = `Máximo ${MAX_FILES} fotos.`;
        break;
      }
      if (!file.type.startsWith("image/")) {
        message = "Solo se aceptan fotografías.";
        continue;
      }
      if (file.size > MAX_BYTES) {
        message = "Cada foto debe pesar menos de 8 MB.";
        continue;
      }
      next.push(file);
    }

    setError(message);
    onChange(next);
  }

  function removeAt(index: number) {
    setError(null);
    onChange(files.filter((_, current) => current !== index));
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-end justify-between gap-3">
        <p className="stamp text-[11px] text-steel">Fotografía</p>
        <span className="text-xs text-steel">
          {files.length}/{MAX_FILES}
        </span>
      </div>
      <p className="text-sm text-steel">{hint}</p>

      {full ? null : (
        <div className={`stagger grid gap-2 ${variant === "hero" ? "" : "sm:grid-cols-2"}`}>
          <label
            htmlFor={cameraId}
            className="stamp grid min-h-24 cursor-pointer place-items-center border border-rust bg-rust text-[11px] text-paper hover:bg-paper hover:text-ink"
          >
            Tomar foto
          </label>
          <label
            htmlFor={galleryId}
            className="stamp grid min-h-12 cursor-pointer place-items-center border border-line text-[11px] text-steel hover:border-rust hover:text-rust sm:min-h-24"
          >
            Elegir de la galería
          </label>
        </div>
      )}

      <input
        id={cameraId}
        type="file"
        accept="image/*"
        capture="environment"
        disabled={full}
        className="sr-only"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <input
        id={galleryId}
        type="file"
        accept="image/*"
        multiple
        disabled={full}
        className="sr-only"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {previews.length > 0 ? (
        <ul className="stagger grid grid-cols-3 gap-2">
          {previews.map((src, index) => {
            const file = files[index];
            if (!file) return null;
            return (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="stamp absolute top-1 right-1 bg-paper px-2 py-1 text-[10px] text-cream hover:text-rust"
                >
                  Quitar
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </div>
  );
}
