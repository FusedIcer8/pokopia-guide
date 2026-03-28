'use client';

import { useState } from 'react';
import Link from 'next/link';
import collectiblesData from '@/content/collectibles.json';
import { useFavorites } from '@/hooks/useFavorites';
import { useChecklist } from '@/hooks/useChecklist';

type CategoryFilter = 'all' | 'fossil' | 'artifact' | 'recipe' | 'outfit' | 'decoration' | 'badge';

const FILTER_OPTIONS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fossil', label: 'Fossil' },
  { key: 'artifact', label: 'Artifact' },
  { key: 'recipe', label: 'Recipe' },
  { key: 'outfit', label: 'Outfit' },
  { key: 'decoration', label: 'Decoration' },
  { key: 'badge', label: 'Badge' },
];

const CATEGORY_BADGE: Record<string, string> = {
  fossil: 'badge-yellow',
  artifact: 'badge-purple',
  recipe: 'badge-teal',
  outfit: 'badge-pink',
  decoration: 'badge-green',
  badge: 'badge-coral',
};

export default function CollectiblesPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set());
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isChecked, toggleCheck, getProgress } = useChecklist();

  const filtered =
    filter === 'all'
      ? collectiblesData
      : collectiblesData.filter((c) => c.category === filter);

  const progress = getProgress('collectibles', collectiblesData.length);

  function toggleSpoiler(id: string) {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Collectibles</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <h1>Collectibles &amp; Special Finds 🏆</h1>
          <p>Track down every hidden treasure in Pokopia.</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-wrap">
          <div className="progress-bar-header">
            <span>Collection Progress</span>
            <span>{progress.checked} / {progress.total} ({progress.percent}%)</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="filter-bar">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`filter-pill ${filter === opt.key ? 'active' : ''}`}
              onClick={() => setFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={() => window.print()}
          >
            🖨️ Print Checklist
          </button>
        </div>

        {/* Grid */}
        <div className="grid-3">
          {filtered.map((col) => {
            const checked = isChecked('collectibles', col.id);
            const spoilerRevealed = revealedSpoilers.has(col.id);

            return (
              <div
                key={col.id}
                className="card"
                style={{
                  opacity: checked ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Top row: checkbox + icon + fav */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      className={`checklist-checkbox ${checked ? 'checked' : ''}`}
                      onClick={() => toggleCheck('collectibles', col.id)}
                      type="button"
                      aria-label={checked ? `Unmark ${col.name}` : `Mark ${col.name} as collected`}
                    >
                      {checked ? '✓' : ''}
                    </button>
                    <span style={{ fontSize: '2rem' }}>{col.icon}</span>
                  </div>
                  <button
                    className={`fav-btn ${isFavorite(col.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(col.id)}
                    aria-label={isFavorite(col.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite(col.id) ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Name + badges */}
                <div className="card-title">{col.name}</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.35rem 0 0.5rem' }}>
                  <span className={`badge ${CATEGORY_BADGE[col.category] ?? 'badge-teal'}`}>
                    {col.category}
                  </span>
                </div>

                {/* Description */}
                <p className="card-desc" style={{ marginBottom: '0.5rem' }}>{col.description}</p>

                {/* Location */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  📍 {col.location}
                </div>

                {/* Hint (always visible) */}
                <div className="callout callout-tip" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  💡 {col.hint}
                </div>

                {/* Spoiler (blur toggle) */}
                <button
                  className={`spoiler ${spoilerRevealed ? 'spoiler-revealed' : 'spoiler-hidden'}`}
                  onClick={() => toggleSpoiler(col.id)}
                  type="button"
                  style={{ fontSize: '0.85rem', width: '100%', textAlign: 'left' }}
                >
                  <div className="spoiler-content">
                    <p style={{ margin: 0 }}>{col.spoiler}</p>
                  </div>
                  {!spoilerRevealed && (
                    <div className="spoiler-overlay">Tap to reveal</div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No collectibles in this category</div>
          </div>
        )}
      </div>
    </div>
  );
}
