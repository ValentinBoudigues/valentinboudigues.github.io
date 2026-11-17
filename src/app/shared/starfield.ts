import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from './gsap';

interface Star {
  x: number;
  /** Position verticale relative (0 → 1) : reste valide quand la hauteur de la fenêtre change. */
  y: number;
  /** Profondeur entre 0.2 (loin) et 1 (proche) : règle taille, opacité et parallaxe. */
  z: number;
  phase: number;
  twinkle: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const AREA_PER_STAR = 4500;
const MAX_COMETS = 2;
const COMET_CHANCE = 0.004;
const COMET_LIFE = 70;
const MOUSE_RANGE = 24;
const SCROLL_FACTOR = 0.12;

function createStars(width: number, height: number): Star[] {
  const count = Math.round((width * height) / AREA_PER_STAR);
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random(),
    z: 0.2 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    twinkle: 0.6 + Math.random() * 1.6,
  }));
}

function createComet(width: number, height: number): Comet {
  const speed = 9 + Math.random() * 6;
  const angle = Math.PI * (0.15 + Math.random() * 0.1);
  return {
    x: Math.random() * width * 0.8,
    y: Math.random() * height * 0.4,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: COMET_LIFE,
  };
}

/** Fond étoilé fixe derrière tout le site : parallaxe souris + scroll, scintillement, étoiles filantes. */
@Component({
  selector: 'app-starfield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        radial-gradient(60rem 40rem at 85% -10%, rgba(157, 140, 255, 0.13), transparent 60%),
        radial-gradient(50rem 36rem at 0% 110%, rgba(124, 245, 196, 0.08), transparent 60%),
        var(--bg);
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `,
  host: { 'aria-hidden': 'true' },
})
export class Starfield {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stop = this.start(this.canvas().nativeElement);
      destroyRef.onDestroy(stop);
    });
  }

  /** Lance le rendu et renvoie la fonction qui l'arrête. */
  private start(canvas: HTMLCanvasElement): () => void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    const still = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let comets: Comet[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Sur mobile, la barre d'adresse change seulement la hauteur : on garde alors les mêmes étoiles.
      const widthChanged = window.innerWidth !== width;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged) stars = createStars(width, height);
      if (still) draw(0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const scroll = window.scrollY;
      for (const s of stars) {
        const y = (((s.y * height - scroll * SCROLL_FACTOR * s.z) % height) + height) % height;
        const x = s.x + mouse.x * MOUSE_RANGE * s.z;
        const flicker = still ? 1 : 0.65 + 0.35 * Math.sin(time * 0.001 * s.twinkle + s.phase);
        ctx.globalAlpha = s.z * 0.85 * flicker;
        ctx.fillStyle = '#eceef6';
        ctx.beginPath();
        ctx.arc(x, y + mouse.y * MOUSE_RANGE * s.z, s.z * 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawComets = () => {
      if (comets.length < MAX_COMETS && Math.random() < COMET_CHANCE) {
        comets.push(createComet(width, height));
      }
      for (const c of comets) {
        c.x += c.vx;
        c.y += c.vy;
        c.life--;
        const alpha = Math.min(1, c.life / 20);
        const tail = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 9, c.y - c.vy * 9);
        tail.addColorStop(0, `rgba(124, 245, 196, ${alpha})`);
        tail.addColorStop(1, 'rgba(124, 245, 196, 0)');
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - c.vx * 9, c.y - c.vy * 9);
        ctx.stroke();
      }
      comets = comets.filter((c) => c.life > 0);
    };

    const loop = (time: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw(time);
      drawComets();
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / width) * 2 - 1;
      mouse.ty = (e.clientY / height) * 2 - 1;
    };

    resize();
    window.addEventListener('resize', resize);
    if (!still) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }
}
