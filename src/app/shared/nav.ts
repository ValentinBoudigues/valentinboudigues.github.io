import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { sections, SectionId } from '../data/content';

interface NavLink {
  id: SectionId;
  num: string;
  label: string;
}

const links: NavLink[] = (Object.keys(sections) as SectionId[]).map((id, i) => ({
  id,
  num: String(i + 1).padStart(2, '0'),
  label: sections[id].label,
}));

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'close()',
  },
  template: `
    <header class="nav" [class.scrolled]="scrolled()" [class.open]="open()">
      <div class="wrap bar">
        <a class="logo" routerLink="/" fragment="top" (click)="close()" aria-label="Valentin Boudigues, retour en haut">
          VB<span class="dot" aria-hidden="true">.</span>
        </a>

        <button
          class="burger"
          type="button"
          [attr.aria-expanded]="open()"
          aria-controls="nav-menu"
          (click)="toggle()"
        >
          <span class="sr-only">{{ open() ? 'Fermer le menu' : 'Ouvrir le menu' }}</span>
          <span class="burger-line" aria-hidden="true"></span>
          <span class="burger-line" aria-hidden="true"></span>
        </button>

        <nav id="nav-menu" class="menu" aria-label="Navigation principale">
          <ul>
            @for (link of links; track link.id) {
              <li>
                <a routerLink="/" [fragment]="link.id" (click)="close()">
                  <span class="num" aria-hidden="true">{{ link.num }}</span>{{ link.label }}
                </a>
              </li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './nav.scss',
})
export class Nav {
  protected readonly links = links;
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);

  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 30);
  }

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }
}
