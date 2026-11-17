import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './shared/nav';
import { Starfield } from './shared/starfield';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Starfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-starfield />
    <app-nav />
    <main>
      <router-outlet />
    </main>
  `,
})
export class App {}
