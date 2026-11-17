import { sections, SectionId } from '../data/content';

export interface SectionInfo {
  id: SectionId;
  /** Numéro affiché (« 01 »), déduit de l'ordre des sections dans content.ts. */
  num: string;
  label: string;
  title: string;
  titleEm: string;
}

export const sectionList: SectionInfo[] = (Object.keys(sections) as SectionId[]).map((id, i) => ({
  id,
  num: String(i + 1).padStart(2, '0'),
  ...sections[id],
}));

export function sectionInfo(id: SectionId): SectionInfo {
  return sectionList.find((s) => s.id === id)!;
}
