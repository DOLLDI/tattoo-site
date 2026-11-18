import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPortfolioWorks, getStyleCounts, type PortfolioWork } from './portfolioFilter';

const SAMPLE_WORKS: PortfolioWork[] = [
  {
    id: '1',
    title: 'Sculpture I',
    style: 'Black & Grey',
    artistId: 'a1',
    artistName: 'Artist One',
    placement: 'Предплечье',
    sessionNote: '1 сеанс',
    image: '/assets/stills/statue-black-grey.jpg',
    aspect: 'landscape',
    description: 'Demo',
  },
  {
    id: '2',
    title: 'Portrait II',
    style: 'Realism',
    artistId: 'a2',
    artistName: 'Artist Two',
    placement: 'Плечо',
    sessionNote: '2 сеанса',
    image: '/assets/stills/portrait-realism.jpg',
    aspect: 'portrait',
    description: 'Demo',
  },
  {
    id: '3',
    title: 'Biomech Sleeve',
    style: 'Blackwork',
    artistId: 'a1',
    artistName: 'Artist One',
    placement: 'Рукав',
    sessionNote: '4 сеанса',
    image: '/assets/stills/biomech-sleeve.jpg',
    aspect: 'landscape',
    description: 'Demo',
  },
];

test('filterPortfolioWorks filters by style and artist accurately', () => {
  assert.equal(filterPortfolioWorks(SAMPLE_WORKS, 'Все').length, 3);
  assert.equal(filterPortfolioWorks(SAMPLE_WORKS, 'Black & Grey').length, 1);
  assert.equal(filterPortfolioWorks(SAMPLE_WORKS, 'Fine Line').length, 0);
  assert.equal(filterPortfolioWorks(SAMPLE_WORKS, 'Все', 'a1').length, 2);
  assert.equal(filterPortfolioWorks(SAMPLE_WORKS, 'Blackwork', 'a1').length, 1);
});

test('getStyleCounts aggregates counts across all styles', () => {
  const counts = getStyleCounts(SAMPLE_WORKS);
  assert.equal(counts['Все'], 3);
  assert.equal(counts['Black & Grey'], 1);
  assert.equal(counts['Realism'], 1);
  assert.equal(counts['Blackwork'], 1);
  assert.equal(counts['Fine Line'], 0);
});
