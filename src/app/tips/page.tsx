'use client';

import { useState } from 'react';
import Link from 'next/link';
import tipsData from '@/content/tips.json';
import guidesData from '@/content/guides.json';
import { useFavorites } from '@/hooks/useFavorites';

type TipCategory = 'all' | 'beginner' | 'efficiency' | 'quality-of-life' | 'mistakes' | 'priorities' | 'guides';

const CATEGORY_BADGE: Record<string, string> = {
  beginner: 'badge-green',
  efficiency: 'badge-teal',
  'quality-of-life': 'badge-purple',
  mistakes: 'badge-coral',
  priorities: 'badge-yellow',
};

const TAB_LABELS: { key: TipCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'efficiency', label: 'Efficiency' },
  { key: 'quality-of-life', label: 'Quality of Life' },
  { key: 'mistakes', label: 'Common Mistakes' },
  { key: 'priorities', label: 'Best Priorities' },
  { key: 'guides', label: 'Guides' },
];

function formatCategory(cat: string): string {
  return cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState<TipCategory>('all');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const filteredTips =
    activeTab === 'all' || activeTab === 'guides'
      ? tipsData
      : tipsData.filter((tip) => tip.category === activeTab);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Tips &amp; Tricks</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <h1>Tips &amp; Tricks 💡</h1>
          <p>Helpful advice for every stage of your Pokopia adventure.</p>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-header">
          {TAB_LABELS.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tips Tab Content */}
        {activeTab !== 'guides' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTips.map((tip) => {
              const isExpanded = expandedTip === tip.id;
              return (
                <button
                  key={tip.id}
                  className="card tip-card"
                  data-category={tip.category}
                  style={{ cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                  type="button"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                      <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{tip.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div className="card-title">{tip.title}</div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
                          <span className={`badge ${CATEGORY_BADGE[tip.category] ?? 'badge-coral'}`}>
                            {formatCategory(tip.category)}
                          </span>
                          <span className="badge badge-purple">{tip.gamePhase}</span>
                        </div>
                        <p className="card-desc">{tip.description}</p>
                        {isExpanded && (
                          <div
                            style={{
                              marginTop: '0.75rem',
                              padding: '0.85rem',
                              background: 'var(--bg-tertiary)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.9rem',
                              lineHeight: 1.65,
                              color: 'var(--text-primary)',
                            }}
                          >
                            {tip.detail}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className={`fav-btn ${isFavorite(tip.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tip.id);
                      }}
                      aria-label={isFavorite(tip.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite(tip.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </button>
              );
            })}
            {filteredTips.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No tips in this category yet</div>
              </div>
            )}
          </div>
        )}

        {/* Guides Tab Content */}
        {activeTab === 'guides' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {guidesData.map((guide) => {
              const isExpanded = expandedGuide === guide.id;
              return (
                <button
                  key={guide.id}
                  className="card card-hoverable"
                  onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                  type="button"
                  style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem', flexShrink: 0 }}>📚</span>
                    <div style={{ flex: 1 }}>
                      <div className="card-title">{guide.title}</div>
                      <span className="badge badge-teal" style={{ marginTop: '0.25rem', marginBottom: '0.5rem', display: 'inline-flex' }}>
                        {guide.type}
                      </span>
                      <p className="card-desc">{guide.summary}</p>

                      {isExpanded && (
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {guide.sections.map((section, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                              }}
                            >
                              <h4 style={{ marginBottom: '0.4rem' }}>{section.heading}</h4>
                              <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                                {section.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
