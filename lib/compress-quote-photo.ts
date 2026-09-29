import { quotePhotoLimits } from "@/lib/quotes";

const TARGET_BYTES = 380_000;
const MAX_EDGE = 1600;

function canvasToJpeg(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo comprimir la foto."))),
      "image/jpeg",
      quality,
    );
  });
}

async function encodeJpeg(bitmap: ImageBitmap): Promise<Blob> {
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar la foto.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);

  for (const quality of [0.82, 0.7, 0.58, 0.45]) {
    const blob = await canvasToJpeg(canvas, quality);
    if (blob.size <= TARGET_BYTES) return blob;
  }

  canvas.width = Math.max(1, Math.round(width * 0.72));
  canvas.height = Math.max(1, Math.round(height * 0.72));
  const shrink = canvas.getContext("2d");
  if (!shrink) throw new Error("No se pudo preparar la foto.");
  shrink.fillStyle = "#ffffff";
  shrink.fillRect(0, 0, canvas.width, canvas.height);
  shrink.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvasToJpeg(canvas, 0.5);
}

export async function compressQuotePhoto(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    throw new Error("Solo se aceptan fotografías.");
  }
  if (file.size > quotePhotoLimits.maxBytes) {
    throw new Error("Cada foto debe pesar menos de 8 MB.");
  }

  try {
    const bitmap = await createImageBitmap(file);
    const blob = await encodeJpeg(bitmap);
    bitmap.close();
    const base = file.name.replace(/\.[^.]+$/u, "") || "foto";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch (error) {
    if (file.size <= TARGET_BYTES) return file;
    throw error instanceof Error
      ? error
      : new Error("No se pudo preparar la foto. Prueba otra o una más chica.");
  }
}

export async function compressQuotePhotos(files: File[]): Promise<File[]> {
  const next: File[] = [];
  for (const file of files.slice(0, quotePhotoLimits.maxFiles)) {
    next.push(await compressQuotePhoto(file));
  }
  return next;
}
