import { ChangeDetectionStrategy, Component } from '@angular/core';
import { skills } from '../data/content';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeading } from '../shared/section-heading';

const allSkills = skills.flatMap((g) => g.items);

@Component({
  selector: 'app-competences',
  imports: [SectionHeading, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="competences" class="section" aria-labelledby="competences-title">
      <div class="wrap">
        <app-section-heading section="competences" />

        <div class="groups" appReveal [revealStagger]="0.1">
          @for (g of skills; track g.group; let i = $index) {
            <div class="group">
              <h3><span class="num">{{ num(i) }}</span> {{ g.group }}</h3>
              <ul>
                @for (s of g.items; track s) {
                  <li>{{ s }}</li>
                }
              </ul>
            </div>
          }
        </div>
      </div>

      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          @for (copy of [0, 1]; track copy) {
            <div class="marquee-set">
              @for (s of allSkills; track s; let odd = $odd) {
                <span class="word" [class.outline]="odd">{{ s }}</span>
                <span class="star">✦</span>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './competences.scss',
})
export class Competences {
  protected readonly skills = skills;
  protected readonly allSkills = allSkills;

  protected num(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
}
