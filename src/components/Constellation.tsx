import { useEffect, useRef } from 'react';

// Фон: повільно дрейфуючі «вузли», що з'єднуються лініями — метафора мережі AI-сервісів.
export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -999, y: -999 };
    let w = 0, h = 0, raf = 0;
    type N = { x: number; y: number; vx: number; vy: number };
    let nodes: N[] = [];

    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cv.width = w * d; cv.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round((w * h) / 22000);
      nodes = Array.from({ length: Math.min(n, 70) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = () => {
      const rgb = getComputedStyle(document.documentElement).getPropertyValue('--node').trim() || '124,108,255';
      ctx.clearRect(0, 0, w, h);
      for (const a of nodes) {
        if (!still) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }
        const near = Math.hypot(a.x - mouse.x, a.y - mouse.y) < 160;
        ctx.fillStyle = `rgba(${rgb},${near ? 0.9 : 0.45})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, near ? 2.6 : 1.7, 0, 6.283); ctx.fill();
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / 130) * 0.28})`;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    resize(); draw();
    addEventListener('resize', resize);
    addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', move); };
  }, []);

  return <canvas ref={ref} className="bg" aria-hidden="true" />;
}
