import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { profile, stats } from '../data/content';
import { CvButton } from '../shared/cv-button';
import { gsap, prefersReducedMotion } from '../shared/gsap';

/** Pastilles qui tournent autour du noyau : rayon en px dans le repère 400×400 du SVG, durée d'un tour en s. */
const planets = [
  { label: 'Java', color: 'var(--warn)', radius: 70, duration: 26, start: 0.55 },
  { label: 'Angular', color: 'var(--angular)', radius: 130, duration: 38, start: 0.05 },
  { label: 'Spring Boot', color: 'var(--accent)', radius: 190, duration: 54, start: 0.7 },
];

@Component({
  selector: 'app-hero',
  imports: [RouterLink, CvButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly profile = profile;
  protected readonly stats = stats;
  protected readonly firstName = [...profile.firstName];
  protected readonly lastName = [...profile.lastName];
  protected readonly planets = planets.map((p) => ({
    ...p,
    // En % de la taille de l'orbite, pour suivre le redimensionnement du SVG.
    size: `${(p.radius / 200) * 100}%`,
    start: `${p.start * 360}deg`,
  }));

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const ctx = gsap.context(() => this.animate(host), host);
      destroyRef.onDestroy(() => ctx.revert());
    });
  }

  private animate(host: HTMLElement): void {
    gsap
      .timeline({ defaults: { ease: 'power4.out' } })
      .from('.letter', { yPercent: 110, duration: 1.1, stagger: 0.035 })
      .from(
        '.fade-in',
        { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
        '-=0.6',
      )
      .from('.orbit', { scale: 0.85, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.3);

    const scrub = { trigger: host, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('h1', { yPercent: -18, ease: 'none', scrollTrigger: scrub });
    gsap.to('.orbit', { yPercent: 25, rotation: 25, ease: 'none', scrollTrigger: { ...scrub } });
  }
}
