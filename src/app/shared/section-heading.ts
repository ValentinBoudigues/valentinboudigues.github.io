import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SectionId } from '../data/content';
import { RevealDirective } from './reveal.directive';
import { sectionInfo } from './sections';

/** Kicker « 01 — Parcours » + titre de section dont la 2ᵉ partie est atténuée. */
@Component({
  selector: 'app-section-heading',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div appReveal>
      <p class="kicker">{{ info().num }} — {{ info().label }}</p>
      <h2 class="section-title" [id]="info().id + '-title'">
        {{ info().title }} <em>{{ info().titleEm }}</em>
      </h2>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SectionHeading {
  readonly section = input.required<SectionId>();
  protected readonly info = computed(() => sectionInfo(this.section()));
}
