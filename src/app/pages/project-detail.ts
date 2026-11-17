import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { profile, projects } from '../data/content';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  /** Fourni par le router (withComponentInputBinding). */
  readonly slug = input.required<string>();

  private readonly index = computed(() => projects.findIndex((p) => p.slug === this.slug()));
  protected readonly project = computed(() => projects[this.index()]);
  protected readonly next = computed(() => projects[(this.index() + 1) % projects.length]);

  constructor() {
    const router = inject(Router);
    const title = inject(Title);

    effect(() => {
      const p = this.project();
      if (!p) {
        router.navigate(['/'], { replaceUrl: true });
        return;
      }
      title.setTitle(`${p.title} — ${profile.name}`);
    });
  }
}
