import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { projectCategories, ProjectCategory, projects } from '../data/content';
import { GlowDirective } from '../shared/glow.directive';
import { gsap, prefersReducedMotion } from '../shared/gsap';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeading } from '../shared/section-heading';

type Filter = 'Tous' | ProjectCategory;

/** Numéro fixe de chaque projet (ordre de content.ts), conservé quand on filtre. */
const numbered = projects.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));

@Component({
  selector: 'app-projets',
  imports: [RouterLink, SectionHeading, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projets.html',
  styleUrl: './projets.scss',
})
export class Projets {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  protected readonly filters: Filter[] = ['Tous', ...projectCategories];
  protected readonly filter = signal<Filter>('Tous');
  protected readonly visible = computed(() => {
    const f = this.filter();
    return f === 'Tous' ? numbered : numbered.filter((p) => p.category === f);
  });

  protected select(f: Filter): void {
    if (f === this.filter()) return;
    this.filter.set(f);
    if (prefersReducedMotion()) return;
    afterNextRender(
      () => {
        gsap.fromTo(
          this.host.querySelectorAll('.card'),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out', overwrite: true },
        );
      },
      { injector: this.injector },
    );
  }
}
