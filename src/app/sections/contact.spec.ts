import { TestBed } from '@angular/core/testing';
import { profile } from '../data/content';
import { Contact } from './contact';

describe('Contact', () => {
  afterEach(() => vi.useRealTimers());

  async function render(writeText: (s: string) => Promise<void>) {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    const button = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Copier'),
    )!;
    return { fixture, button };
  }

  it('copie l’adresse, affiche « Copié ✓ » puis revient au libellé après 2 s', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    const { fixture, button } = await render(writeText);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    button.click();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(button.textContent?.trim()).toBe('Copié ✓');

    await vi.advanceTimersByTimeAsync(1999);
    fixture.detectChanges();
    expect(button.textContent?.trim()).toBe('Copié ✓');

    await vi.advanceTimersByTimeAsync(1);
    fixture.detectChanges();
    expect(button.textContent?.trim()).toBe('Copier l’adresse');
  });

  it('ne prétend pas avoir copié si le presse-papier refuse', async () => {
    const { fixture, button } = await render(() => Promise.reject(new Error('refusé')));
    button.click();
    await fixture.whenStable();
    expect(button.textContent?.trim()).toBe('Copier l’adresse');
  });

  it('propose le CV en téléchargement', async () => {
    const { fixture } = await render(() => Promise.resolve());
    const link = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('a[download]');
    expect(link?.getAttribute('href')).toBe(profile.cv?.file);
    expect(link?.getAttribute('download')).toBe(profile.cv?.downloadName);
  });

  it('n’affiche aucun numéro de téléphone', async () => {
    const { fixture } = await render(() => Promise.resolve());
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toMatch(/(\+33|0[1-9])([\s.-]?\d{2}){4}/);
  });
});
