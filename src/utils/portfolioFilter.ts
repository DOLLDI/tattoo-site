export type TattooStyle =
  | 'Black & Grey'
  | 'Realism'
  | 'Fine Line'
  | 'Blackwork'
  | 'Lettering'
  | 'Custom Tattoo';

export const TATTOO_STYLES: readonly TattooStyle[] = [
  'Black & Grey',
  'Realism',
  'Fine Line',
  'Blackwork',
  'Lettering',
  'Custom Tattoo',
] as const;

export interface PortfolioWork {
  id: string;
  title: string;
  style: TattooStyle;
  artistId: string;
  artistName: string;
  placement: string;
  sessionNote: string;
  image: string;
  aspect: 'portrait' | 'landscape' | 'square';
  description: string;
}

export type StyleFilter = 'Все' | TattooStyle;

export function filterPortfolioWorks(
  works: readonly PortfolioWork[],
  styleFilter: StyleFilter,
  artistId?: string | null,
): PortfolioWork[] {
  return works.filter((work) => {
    const matchesStyle = styleFilter === 'Все' || work.style === styleFilter;
    const matchesArtist = !artistId || work.artistId === artistId;
    return matchesStyle && matchesArtist;
  });
}

export function getStyleCounts(
  works: readonly PortfolioWork[],
): Record<StyleFilter, number> {
  const counts: Record<StyleFilter, number> = {
    Все: works.length,
    'Black & Grey': 0,
    Realism: 0,
    'Fine Line': 0,
    Blackwork: 0,
    Lettering: 0,
    'Custom Tattoo': 0,
  };

  for (const work of works) {
    counts[work.style] = (counts[work.style] ?? 0) + 1;
  }

  return counts;
}
