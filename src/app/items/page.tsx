'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import itemsData from '@/content/items.json';
import { useFavorites } from '@/hooks/useFavorites';

interface Item {
  id: string;
  name: string;
  category: string;
  rarity: string;
  description: string;
  howToObtain: string;
  location: string;
  uses: string[];
  gamePhase: string;
  farmingTip: string;
  icon: string;
  relatedItems: string[];
}

const items = itemsData as Item[];

const categories = [
  'All',
  'Material',
  'Food',
  'Tool',
  'Key Item',
  'Decoration',
  'Seed',
  'Berry',
  'Potion',
];

const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary'];

function getRarityBadgeClass(rarity: string): string {
  const map: Record<string, string> = {
    common: 'badge-common',
    uncommon: 'badge-uncommon',
    rare: 'badge-rare',
    legendary: 'badge-legendary',
  };
  return map[rarity.toLowerCase()] ?? 'badge-teal';
}

function getCategoryBadgeClass(category: string): string {
  const map: Record<string, string> = {
    material: 'badge-teal',
    food: 'badge-coral',
    tool: 'badge-purple',
    'key item': 'badge-yellow',
    decoration: 'badge-pink',
    seed: 'badge-green',
    berry: 'badge-coral',
    potion: 'badge-purple',
  };
  return map[category.toLowerCase()] ?? 'badge-teal';
}

export default function ItemsPage() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' ||
        item.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesRarity =
        rarityFilter === 'All' ||
        item.rarity.toLowerCase() === rarityFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [search, categoryFilter, rarityFilter]);

  const getItemNameById = (id: string): string => {
    const found = items.find((i) => i.id === id);
    return found ? found.name : id;
  };

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Items & Resources</span>
      </nav>

      {/* Page Header */}
      <div className="page-header">
        <h1>Items & Resources</h1>
        <p>Every material, berry, tool, and treasure in Pokopia</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hero-search"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rarity Filter */}
      <div className="filter-bar">
        {rarities.map((r) => (
          <button
            key={r}
            className={`filter-pill ${rarityFilter === r ? 'active' : ''}`}
            onClick={() => setRarityFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedItem && (
        <div className="detail-panel">
          <div className="detail-header">
            <span className="detail-icon">{selectedItem.icon}</span>
            <div>
              <h2 className="detail-title">{selectedItem.name}</h2>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
                <span className={`badge ${getRarityBadgeClass(selectedItem.rarity)}`}>
                  {selectedItem.rarity}
                </span>
                <span className={`badge ${getCategoryBadgeClass(selectedItem.category)}`}>
                  {selectedItem.category}
                </span>
                <span className="badge badge-purple">{selectedItem.gamePhase} game</span>
              </div>
            </div>
            <button
              className={`fav-btn ${isFavorite(selectedItem.id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(selectedItem.id)}
              style={{ marginLeft: 'auto' }}
            >
              {isFavorite(selectedItem.id) ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="detail-section">
            <h4>Description</h4>
            <p style={{ fontSize: '0.95rem' }}>{selectedItem.description}</p>
          </div>

          <div className="detail-section">
            <h4>How to Obtain</h4>
            <p style={{ fontSize: '0.95rem' }}>{selectedItem.howToObtain}</p>
          </div>

          {selectedItem.farmingTip && (
            <div className="detail-section">
              <h4>Farming Tip</h4>
              <div className="callout callout-tip">
                <p style={{ fontSize: '0.9rem' }}>{selectedItem.farmingTip}</p>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h4>Uses</h4>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {selectedItem.uses.map((use) => (
                <span key={use} className="badge badge-teal">
                  {use}
                </span>
              ))}
            </div>
          </div>

          {selectedItem.relatedItems.length > 0 && (
            <div className="detail-section">
              <h4>Related Items</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedItem.relatedItems.map((relId) => (
                  <button
                    key={relId}
                    className="badge badge-purple"
                    style={{ cursor: 'pointer', border: 'none' }}
                    onClick={() => {
                      const found = items.find((i) => i.id === relId);
                      if (found) setSelectedItem(found);
                    }}
                  >
                    {getItemNameById(relId)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSelectedItem(null)}
            style={{ marginTop: '0.5rem' }}
          >
            Close details
          </button>
        </div>
      )}

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              className="card card-hoverable item-card"
              onClick={() => setSelectedItem(item)}
              type="button"
              style={{ textAlign: 'center' }}
            >
              <span className="card-icon">{item.icon}</span>
              <h3 className="card-title">{item.name}</h3>
              <div className="item-badges">
                <span className={`badge ${getRarityBadgeClass(item.rarity)}`}>
                  {item.rarity}
                </span>
                <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <p className="card-desc">
                {item.description.length > 80
                  ? `${item.description.slice(0, 80)}...`
                  : item.description}
              </p>
              <span
                className={`fav-btn ${isFavorite(item.id) ? 'active' : ''}`}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }
                }}
                style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
                aria-label={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite(item.id) ? '❤️' : '🤍'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No items found</div>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </>
  );
}
