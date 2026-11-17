import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { projects } from '../data/content';
import { routes } from '../app.routes';

describe('ProjectDetail', () => {
  async function open(url: string) {
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    await harness.fixture.whenStable();
    return { el: harness.routeNativeElement!, router: TestBed.inject(Router) };
  }

  it('affiche le projet demandé et met à jour le titre de l’onglet', async () => {
    const { el } = await open('/projets/bloom-filter');
    expect(el.querySelector('h1')?.textContent).toBe('Bloom Filter');
    expect(TestBed.inject(Title).getTitle()).toBe('Bloom Filter — Valentin Boudigues');
  });

  it('propose le lien GitHub seulement si le projet a un dépôt', async () => {
    const withRepo = await open('/projets/bloom-filter');
    expect(withRepo.el.querySelector('a[href^="https://github.com"]')).not.toBeNull();

    TestBed.resetTestingModule();
    const withoutRepo = await open('/projets/minishell');
    expect(withoutRepo.el.querySelector('a[href^="https://github.com"]')).toBeNull();
  });

  it('enchaîne sur le premier projet après le dernier', async () => {
    const last = projects[projects.length - 1];
    const { el } = await open(`/projets/${last.slug}`);
    expect(el.querySelector('.next-title')?.textContent).toContain(projects[0].title);
  });

  it('renvoie vers l’accueil pour un slug inconnu', async () => {
    const { router } = await open('/projets/nexiste-pas');
    expect(router.url).toBe('/');
  });
});
