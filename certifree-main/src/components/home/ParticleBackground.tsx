import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0;
    let height = 0;

    let NUM_PARTICLES = 80; // default
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];

    const tuneForViewport = () => {
      const w = window.innerWidth;
      if (w < 380) NUM_PARTICLES = 35;
      else if (w < 640) NUM_PARTICLES = 50;
      else if (w < 1024) NUM_PARTICLES = 70;
      else NUM_PARTICLES = 80;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const init = () => {
      particles.length = 0;
      tuneForViewport();
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const r = Math.random() * 2 + 0.5;
        const speed = 0.12 + Math.random() * 0.32; // slightly slower for subtlety
        const dir = Math.random() * Math.PI * 2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(dir) * speed,
          vy: Math.sin(dir) * speed,
          r,
          a: 0.5 + Math.random() * 0.5,
        });
      }
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      // subtle radial gradient to blend particles
      const grd = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.4, Math.max(width, height) * 0.8);
      grd.addColorStop(0, "rgba(255,214,10,0.03)");
      grd.addColorStop(1, "rgba(255,214,10,0.0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        glow.addColorStop(0, `rgba(255,214,10,${0.16 * p.a})`);
        glow.addColorStop(1, "rgba(255,214,10,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,214,10,${0.65 * p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(step);
    };

    const onResize = () => {
      resize();
      init();
    };

    resize();
    init();
    step();
    window.addEventListener("resize", onResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[0] opacity-70"
    />
  );
} 