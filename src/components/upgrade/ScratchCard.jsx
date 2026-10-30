import { useEffect, useRef } from "react";

const REVEAL_AT = 0.45; // share of the foil that must be cleared
const BRUSH = 28;

// Paints a zig-zag foil over its children; scratching (mouse or finger) wipes it away.
export default function ScratchCard({ revealed, onReveal, className = "", children }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const moves = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // offset* is the layout size, unaffected by the card's entrance scale animation.
    const rect = { width: canvas.offsetWidth, height: canvas.offsetHeight };
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#45aded");
    g.addColorStop(1, "#1d6fb8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    for (let y = -10; y < rect.height + 20; y += 16) {
      ctx.beginPath();
      for (let x = -10, up = true; x < rect.width + 20; x += 10, up = !up) ctx.lineTo(x, y + (up ? 0 : 9));
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "700 20px Parkinsans, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scratch here", rect.width / 2, rect.height / 2 - 4);
    ctx.font = "500 14px Parkinsans, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("✨ with your finger or mouse ✨", rect.width / 2, rect.height / 2 + 22);
  }, []);

  const pos = (e) => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.offsetWidth) / r.width, y: ((e.clientY - r.top) * c.offsetHeight) / r.height };
  };

  const clearedShare = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 32) {
      total++;
      if (data[i] === 0) clear++;
    }
    return clear / total;
  };

  const scratch = (e) => {
    if (!drawing.current || revealed) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "#000"; // any opaque colour; destination-out erases by alpha
    ctx.lineWidth = BRUSH * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current?.x ?? p.x, last.current?.y ?? p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (++moves.current % 8 === 0 && clearedShare() >= REVEAL_AT) onReveal();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 size-full touch-none transition-opacity duration-500 ${
          revealed ? "pointer-events-none opacity-0" : "cursor-grab active:cursor-grabbing"
        }`}
        onPointerDown={(e) => {
          drawing.current = true;
          last.current = pos(e);
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={scratch}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
          if (!revealed && clearedShare() >= REVEAL_AT) onReveal();
        }}
      />
    </div>
  );
}
