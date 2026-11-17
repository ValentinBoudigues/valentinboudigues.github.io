import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Nav } from './nav';

describe('Nav', () => {
  async function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Nav);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const burger = el.querySelector<HTMLButtonElement>('.burger')!;
    return { fixture, el, burger };
  }

  it('liste les quatre sections, numérotées dans l’ordre', async () => {
    const { el } = await render();
    const links = [...el.querySelectorAll('#nav-menu a')].map((a) => a.textContent?.trim());
    expect(links).toEqual(['01Parcours', '02Projets', '03Compétences', '04Contact']);
  });

  it('ouvre le menu au clic sur le burger et le ferme avec Échap', async () => {
    const { fixture, burger } = await render();
    expect(burger.getAttribute('aria-expanded')).toBe('false');

    burger.click();
    await fixture.whenStable();
    expect(burger.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(burger.getAttribute('aria-expanded')).toBe('false');
  });
});
