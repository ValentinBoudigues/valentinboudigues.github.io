import { projects } from './content';

describe('content', () => {
  it('donne à chaque projet un slug unique', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('utilise des slugs utilisables tels quels dans une URL', () => {
    const invalid = projects.map((p) => p.slug).filter((s) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s));
    expect(invalid).toEqual([]);
  });
});
