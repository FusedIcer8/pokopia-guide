'use client';
import { useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import tipsData from '../content/tips.json';
import itemsData from '../content/items.json';
import locationsData from '../content/locations.json';
import storyData from '../content/story.json';
import collectiblesData from '../content/collectibles.json';
import guidesData from '../content/guides.json';

export interface SearchItem {
  type: string;
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  tags: string[];
}

export interface SearchResult {
  item: SearchItem;
}

function buildSearchItems(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const tip of tipsData) {
    items.push({
      type: 'tip',
      id: tip.id,
      title: tip.title,
      description: tip.description,
      icon: tip.icon,
      link: '/tips',
      tags: tip.tags,
    });
  }

  for (const item of itemsData) {
    items.push({
      type: 'item',
      id: item.id,
      title: item.name,
      description: item.description,
      icon: item.icon,
      link: '/items',
      tags: item.uses,
    });
  }

  for (const loc of locationsData) {
    items.push({
      type: 'location',
      id: loc.id,
      title: loc.name,
      description: loc.description,
      icon: loc.icon,
      link: '/locations',
      tags: [loc.biome],
    });
  }

  for (const chapter of storyData) {
    items.push({
      type: 'story',
      id: chapter.id,
      title: `Chapter ${chapter.chapter}: ${chapter.title}`,
      description: chapter.summary,
      icon: '\uD83D\uDCD6',
      link: '/story',
      tags: ['story', `chapter-${chapter.chapter}`],
    });
  }

  for (const col of collectiblesData) {
    items.push({
      type: 'collectible',
      id: col.id,
      title: col.name,
      description: col.description,
      icon: col.icon,
      link: '/collectibles',
      tags: [col.category],
    });
  }

  for (const guide of guidesData) {
    items.push({
      type: 'guide',
      id: guide.id,
      title: guide.title,
      description: guide.summary,
      icon: '\uD83D\uDCDA',
      link: '/tips',
      tags: guide.tags,
    });
  }

  return items;
}

export function useSearch() {
  const allItems = useMemo(() => buildSearchItems(), []);

  const fuse = useMemo(
    () =>
      new Fuse(allItems, {
        threshold: 0.4,
        keys: [
          { name: 'title', weight: 2 },
          { name: 'description', weight: 1 },
          { name: 'tags', weight: 1.5 },
        ],
      }),
    [allItems]
  );

  const search = useCallback(
    (query: string): SearchResult[] => {
      if (!query.trim()) return [];
      return fuse.search(query).map((result) => ({ item: result.item }));
    },
    [fuse]
  );

  return { search, allItems };
}
