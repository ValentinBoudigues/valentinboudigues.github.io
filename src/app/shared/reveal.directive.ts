import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { gsap, prefersReducedMotion } from './gsap';

/**
 * Fait apparaître l'élément (ou ses enfants directs avec revealStagger) en fondu montant
 * quand il entre dans l'écran. Sans effet en reduced-motion : le contenu reste visible.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  /** Décalage entre les enfants directs, en secondes ; 0 = anime l'élément lui-même. */
  readonly revealStagger = input(0);
  readonly revealDelay = input(0);
  readonly revealY = input(40);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const stagger = this.revealStagger();
      const ctx = gsap.context(() => {
        gsap.from(stagger ? el.children : el, {
          y: this.revealY(),
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: this.revealDelay(),
          stagger,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      }, el);
      destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
