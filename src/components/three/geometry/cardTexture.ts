import * as THREE from "three";

// Draws the customer's message onto a canvas so it can be mapped onto the card
// mesh and update live as they type. Cached per message string.

const cache = new Map<string, THREE.CanvasTexture>();

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 7);
}

export function getCardTexture(message: string): THREE.CanvasTexture {
  const key = message || "__empty__";
  const existing = cache.get(key);
  if (existing) return existing;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#fbf8f1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // a thin keyline border
  ctx.strokeStyle = "#d8cdb6";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  ctx.fillStyle = "#3a4a3f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const text = message.trim();
  if (text) {
    ctx.font = "italic 34px Georgia, serif";
    const lines = wrapText(ctx, text, canvas.width - 90);
    const lineHeight = 46;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => {
      ctx.fillText(l, canvas.width / 2, startY + i * lineHeight);
    });
  } else {
    ctx.fillStyle = "#b3a98f";
    ctx.font = "italic 30px Georgia, serif";
    ctx.fillText("Your message here", canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  cache.set(key, texture);

  // keep the cache from growing without bound as the user types
  if (cache.size > 40) {
    const firstKey = cache.keys().next().value;
    if (firstKey && firstKey !== key) {
      cache.get(firstKey)?.dispose();
      cache.delete(firstKey);
    }
  }
  return texture;
}
