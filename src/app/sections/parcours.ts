import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { timeline, timelineKinds } from '../data/content';
import { gsap, prefersReducedMotion } from '../shared/gsap';
import { SectionHeading } from '../shared/section-heading';

@Component({
  selector: 'app-parcours',
  imports: [SectionHeading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="parcours" class="section" aria-labelledby="parcours-title">
      <div class="wrap">
        <app-section-heading section="parcours" />

        <div class="timeline">
          <div class="track" aria-hidden="true"><div class="fill"></div></div>
          <ol>
            @for (item of timeline; track item.title) {
              <li class="entry" [attr.data-kind]="item.kind">
                <div class="meta">
                  <span class="period">{{ item.period }}</span>
                  <span class="kind">{{ kinds[item.kind] }}</span>
                </div>
                <span class="dot" aria-hidden="true"></span>
                <article class="card">
                  <h3>{{ item.title }}</h3>
                  <p class="org">{{ item.org }}</p>
                  <p class="text">{{ item.text }}</p>
                  @if (item.bullets?.length) {
                    <ul class="bullets">
                      @for (b of item.bullets; track $index) {
                        <li>{{ b }}</li>
                      }
                    </ul>
                  }
                  @if (item.tags?.length) {
                    <ul class="tags" aria-label="Technologies">
                      @for (t of item.tags; track t) {
                        <li class="tag">{{ t }}</li>
                      }
                    </ul>
                  }
                </article>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
  styleUrl: './parcours.scss',
})
export class Parcours {
  protected readonly timeline = timeline;
  protected readonly kinds = timelineKinds;

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
    const list = host.querySelector('.timeline')!;
    gsap.from('.fill', {
      scaleY: 0,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true },
    });

    for (const entry of gsap.utils.toArray<HTMLElement>('.entry')) {
      const once = { trigger: entry, start: 'top 85%', once: true };
      gsap
        .timeline({ scrollTrigger: once, defaults: { duration: 0.8, ease: 'power3.out' } })
        .from(entry.querySelector('.dot'), { scale: 0, duration: 0.6, ease: 'back.out(3)' })
        .from(entry.querySelector('.meta'), { x: -40, opacity: 0 }, 0)
        .from(entry.querySelector('.card'), { x: 40, opacity: 0 }, 0.08);
    }
  }
}
