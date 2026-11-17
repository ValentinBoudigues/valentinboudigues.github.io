import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { contact, profile } from '../data/content';
import { RevealDirective } from '../shared/reveal.directive';
import { sectionInfo } from '../shared/sections';

const COPIED_MS = 2000;

@Component({
  selector: 'app-contact',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section" aria-labelledby="contact-title">
      <div class="wrap">
        <div appReveal>
          <p class="kicker">{{ info.num }} — {{ info.label }}</p>
          <h2 id="contact-title" class="title">
            {{ info.title }}<br />
            <span class="gradient">{{ info.titleEm }}</span>
          </h2>
        </div>

        <div class="body" appReveal [revealStagger]="0.1">
          <p class="intro">{{ contact.intro }}</p>

          <div class="actions">
            <a class="btn primary" [href]="'mailto:' + profile.email">{{ profile.email }}</a>
            <button class="btn" type="button" (click)="copy()">
              {{ copied() ? 'Copié ✓' : 'Copier l’adresse' }}
            </button>
            <span class="sr-only" aria-live="polite">{{ copied() ? 'Adresse copiée' : '' }}</span>
          </div>

          <ul class="links">
            <li>
              <a [href]="profile.linkedin" target="_blank" rel="noopener">LinkedIn <span aria-hidden="true">↗</span></a>
            </li>
            <li>
              <a [href]="profile.github" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <footer class="wrap footer">
      <span>© {{ year }} {{ profile.name }}</span>
      <span>Fait main avec Angular &amp; GSAP</span>
    </footer>
  `,
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly info = sectionInfo('contact');
  protected readonly contact = contact;
  protected readonly profile = profile;
  protected readonly year = new Date().getFullYear();
  protected readonly copied = signal(false);

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Presse-papier refusé (contexte non sécurisé, permission) : l'adresse reste visible dans le bouton mail.
      return;
    }
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), COPIED_MS);
  }
}
