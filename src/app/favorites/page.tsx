'use client';

import { useState } from 'react';
import Link from 'next/link';
import tipsData from '@/content/tips.json';
import itemsData from '@/content/items.json';
import locationsData from '@/content/locations.json';
import collectiblesData from '@/content/collectibles.json';
import storyData from '@/content/story.json';
import { useFavorites } from '@/hooks/useFavorites';
import { useChecklist } from '@/hooks/useChecklist';

type FavTab = 'bookmarked' | 'story' | 'collectibles';

interface FavoriteEntry {
  id: string;
  type: string;
  icon: string;
  title: string;
  description: string;
}

function lookupFavorite(id: string): FavoriteEntry | null {
  const tip = tipsData.find((t) => t.id === id);
  if (tip) {
    return { id: tip.id, type: 'Tip', icon: tip.icon, title: tip.title, description: tip.description };
  }

  const item = itemsData.find((i) => i.id === id);
  if (item) {
    return { id: item.id, type: 'Item', icon: item.icon, title: item.name, description: item.description };
  }

  const loc = locationsData.find((l) => l.id === id);
  if (loc) {
    return { id: loc.id, type: 'Location', icon: loc.icon, title: loc.name, description: loc.description };
  }

  const col = collectiblesData.find((c) => c.id === id);
  if (col) {
    return { id: col.id, type: 'Collectible', icon: col.icon, title: col.name, description: col.description };
  }

  return null;
}

const TYPE_BADGE: Record<string, string> = {
  Tip: 'badge-yellow',
  Item: 'badge-teal',
  Location: 'badge-green',
  Collectible: 'badge-purple',
};

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<FavTab>('bookmarked');
  const { favorites, toggleFavorite } = useFavorites();
  const { isChecked, toggleCheck, getProgress } = useChecklist();

  // Resolve all favorites
  const resolvedFavorites: FavoriteEntry[] = favorites
    .map(lookupFavorite)
    .filter((entry): entry is FavoriteEntry => entry !== null);

  // Group by type
  const grouped: Record<string, FavoriteEntry[]> = {};
  for (const entry of resolvedFavorites) {
    if (!grouped[entry.type]) {
      grouped[entry.type] = [];
    }
    grouped[entry.type].push(entry);
  }

  // Story progress
  const totalObjectives = storyData.reduce((sum, ch) => sum + ch.objectives.length, 0);
  const storyProgress = getProgress('story', totalObjectives);

  // Collectibles progress by category
  const collectiblesByCategory: Record<string, typeof collectiblesData> = {};
  for (const col of collectiblesData) {
    if (!collectiblesByCategory[col.category]) {
      collectiblesByCategory[col.category] = [];
    }
    collectiblesByCategory[col.category].push(col);
  }
  const collectiblesProgress = getProgress('collectibles', collectiblesData.length);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>My Favorites</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <h1>My Favorites ❤️</h1>
          <p>Your bookmarks, story progress, and collection tracking all in one place.</p>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'bookmarked' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarked')}
          >
            Bookmarked
          </button>
          <button
            className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            Story Progress
          </button>
          <button
            className={`tab-btn ${activeTab === 'collectibles' ? 'active' : ''}`}
            onClick={() => setActiveTab('collectibles')}
          >
            Collectibles Progress
          </button>
        </div>

        {/* Bookmarked Tab */}
        {activeTab === 'bookmarked' && (
          <>
            {resolvedFavorites.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🤍</div>
                <div className="empty-state-title">No favorites yet</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Tap the heart icon on any tip, item, location, or collectible to save it here.
                </p>
              </div>
            ) : (
              Object.entries(grouped).map(([type, entries]) => (
                <div key={type} style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>
                    {type}s ({entries.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {entries.map((entry) => (
                      <div key={entry.id} className="card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                            <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{entry.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <span className="card-title" style={{ marginBottom: 0 }}>{entry.title}</span>
                                <span className={`badge ${TYPE_BADGE[entry.type] ?? 'badge-teal'}`}>
                                  {entry.type}
                                </span>
                              </div>
                              <p className="card-desc">{entry.description}</p>
                            </div>
                          </div>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => toggleFavorite(entry.id)}
                            style={{ flexShrink: 0 }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Story Progress Tab */}
        {activeTab === 'story' && (
          <>
            {/* Overall progress */}
            <div className="progress-bar-wrap" style={{ marginBottom: '2rem' }}>
              <div className="progress-bar-header">
                <span>Overall Story Progress</span>
                <span>{storyProgress.checked} / {storyProgress.total} objectives ({storyProgress.percent}%)</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${storyProgress.percent}%` }} />
              </div>
            </div>

            {/* Per-chapter */}
            {storyData.map((chapter) => {
              const chapterChecked = chapter.objectives.filter((_, idx) =>
                isChecked('story', `${chapter.id}-obj-${idx}`)
              ).length;
              const chapterTotal = chapter.objectives.length;
              const chapterPercent = chapterTotal > 0 ? Math.round((chapterChecked / chapterTotal) * 100) : 0;

              return (
                <div key={chapter.id} className="card" style={{ padding: '1.25rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4>Chapter {chapter.chapter}: {chapter.title}</h4>
                    <span className="badge badge-teal">{chapterChecked}/{chapterTotal}</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ marginBottom: '0.75rem' }}>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${chapterPercent}%` }} />
                    </div>
                  </div>
                  <div>
                    {chapter.objectives.map((obj, idx) => {
                      const objId = `${chapter.id}-obj-${idx}`;
                      const checked = isChecked('story', objId);
                      return (
                        <div key={idx} className="checklist-item">
                          <button
                            className={`checklist-checkbox ${checked ? 'checked' : ''}`}
                            onClick={() => toggleCheck('story', objId)}
                            type="button"
                            aria-label={checked ? `Unmark: ${obj.task}` : `Mark complete: ${obj.task}`}
                          >
                            {checked ? '✓' : ''}
                          </button>
                          <span className={`checklist-label ${checked ? 'checked' : ''}`}>
                            {obj.task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Collectibles Progress Tab */}
        {activeTab === 'collectibles' && (
          <>
            {/* Overall progress */}
            <div className="progress-bar-wrap" style={{ marginBottom: '2rem' }}>
              <div className="progress-bar-header">
                <span>Overall Collection Progress</span>
                <span>{collectiblesProgress.checked} / {collectiblesProgress.total} ({collectiblesProgress.percent}%)</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${collectiblesProgress.percent}%` }} />
              </div>
            </div>

            {/* Per-category */}
            {Object.entries(collectiblesByCategory).map(([category, items]) => {
              const catChecked = items.filter((item) => isChecked('collectibles', item.id)).length;
              const catTotal = items.length;
              const catPercent = catTotal > 0 ? Math.round((catChecked / catTotal) * 100) : 0;

              return (
                <div key={category} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ textTransform: 'capitalize' }}>{category}</h4>
                    <span className="badge badge-teal">{catChecked}/{catTotal}</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ marginBottom: '0.75rem' }}>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${catPercent}%` }} />
                    </div>
                  </div>
                  <div>
                    {items.map((item) => {
                      const checked = isChecked('collectibles', item.id);
                      return (
                        <div key={item.id} className="checklist-item">
                          <button
                            className={`checklist-checkbox ${checked ? 'checked' : ''}`}
                            onClick={() => toggleCheck('collectibles', item.id)}
                            type="button"
                            aria-label={checked ? `Unmark: ${item.name}` : `Mark collected: ${item.name}`}
                          >
                            {checked ? '✓' : ''}
                          </button>
                          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                          <span className={`checklist-label ${checked ? 'checked' : ''}`}>
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
