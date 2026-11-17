import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Competences } from '../sections/competences';
import { Contact } from '../sections/contact';
import { Hero } from '../sections/hero';
import { Parcours } from '../sections/parcours';
import { Projets } from '../sections/projets';

@Component({
  selector: 'app-home',
  imports: [Hero, Parcours, Projets, Competences, Contact],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-parcours />
    <app-projets />
    <app-competences />
    <app-contact />
  `,
})
export class Home {}
