import { ChangeDetectionStrategy, Component } from '@angular/core';
import { profile } from '../data/content';

/** Bouton « Télécharger mon CV » (hero et contact) ; absent si profile.cv n'est pas défini. */
@Component({
  selector: 'app-cv-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cv; as cv) {
      <a class="btn" [href]="cv.file" [attr.download]="cv.downloadName">
        Télécharger mon CV <span aria-hidden="true">↓</span>
      </a>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class CvButton {
  protected readonly cv = profile.cv;
}
