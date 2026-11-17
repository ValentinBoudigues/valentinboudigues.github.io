import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

/**
 * Expose la position du pointeur dans l'élément via --mx / --my, pour un halo qui suit la souris.
 * Écouteur natif : pas de détection de changements à chaque mouvement.
 */
@Directive({ selector: '[appGlow]' })
export class GlowDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      el.addEventListener('pointermove', move, { passive: true });
      destroyRef.onDestroy(() => el.removeEventListener('pointermove', move));
    });
  }
}
