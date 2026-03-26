'use client';

import { useState } from 'react';
import Link from 'next/link';
import storyData from '@/content/story.json';
import itemsData from '@/content/items.json';
import locationsData from '@/content/locations.json';
import tipsData from '@/content/tips.json';

type HelpTopic = 'story' | 'item' | 'location' | 'craft' | 'other' | null;

export default function UnstuckPage() {
  const [step, setStep] = useState<number>(1);
  const [topic, setTopic] = useState<HelpTopic>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [itemSearch, setItemSearch] = useState('');
  const [expandedBlocker, setExpandedBlocker] = useState<number | null>(null);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set());

  function startOver() {
    setStep(1);
    setTopic(null);
    setSelectedChapter(null);
    setSelectedLocation(null);
    setItemSearch('');
    setExpandedBlocker(null);
    setRevealedSpoilers(new Set());
  }

  function selectTopic(t: HelpTopic) {
    setTopic(t);
    setStep(2);
  }

  function toggleSpoiler(key: string) {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const filteredItems = itemSearch.trim()
    ? itemsData.filter(
        (item) =>
          item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(itemSearch.toLowerCase())
      )
    : [];

  const craftItems = itemsData.filter(
    (item) => item.category === 'tool' || item.category === 'material' || item.uses.includes('crafting')
  );

  const chapter = storyData.find((ch) => ch.id === selectedChapter);
  const location = locationsData.find((loc) => loc.id === selectedLocation);
  const usefulTips = tipsData.slice(0, 5);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Getting Unstuck</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <h1>Getting Unstuck 🆘</h1>
          <p>Let&apos;s figure out what&apos;s going on!</p>
        </div>

        <div className="unstuck-flow">
          {/* Step 1: Choose Topic */}
          {step === 1 && (
            <>
              <div className="unstuck-question">What do you need help with?</div>
              <div className="unstuck-options">
                <button className="unstuck-option" onClick={() => selectTopic('story')}>
                  <span style={{ fontSize: '1.5rem' }}>📖</span>
                  I&apos;m stuck in the story
                </button>
                <button className="unstuck-option" onClick={() => selectTopic('item')}>
                  <span style={{ fontSize: '1.5rem' }}>🎒</span>
                  I can&apos;t find an item
                </button>
                <button className="unstuck-option" onClick={() => selectTopic('location')}>
                  <span style={{ fontSize: '1.5rem' }}>🗺️</span>
                  I need to reach a location
                </button>
                <button className="unstuck-option" onClick={() => selectTopic('craft')}>
                  <span style={{ fontSize: '1.5rem' }}>🔨</span>
                  I want to craft something
                </button>
                <button className="unstuck-option" onClick={() => selectTopic('other')}>
                  <span style={{ fontSize: '1.5rem' }}>❓</span>
                  Something else
                </button>
              </div>
            </>
          )}

          {/* Step 2: Story */}
          {step === 2 && topic === 'story' && !selectedChapter && (
            <>
              <div className="unstuck-question">Which chapter are you on?</div>
              <div className="unstuck-options">
                {storyData.map((ch) => (
                  <button
                    key={ch.id}
                    className="unstuck-option"
                    onClick={() => setSelectedChapter(ch.id)}
                  >
                    <span style={{ fontSize: '1.5rem' }}>📖</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Chapter {ch.chapter}: {ch.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400, marginTop: '0.2rem' }}>
                        {ch.summary.slice(0, 80)}...
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: '1.5rem' }} onClick={startOver}>
                ← Start Over
              </button>
            </>
          )}

          {/* Step 2: Story - Chapter Selected */}
          {step === 2 && topic === 'story' && selectedChapter && chapter && (
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ marginBottom: '1rem' }}>
                Chapter {chapter.chapter}: {chapter.title}
              </h2>

              {/* Common Blockers */}
              {chapter.commonBlockers.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>Common Problems</h3>
                  {chapter.commonBlockers.map((blocker, idx) => (
                    <div key={idx} className="expandable" style={{ marginBottom: '0.5rem' }}>
                      <button
                        className={`expandable-header ${expandedBlocker === idx ? 'expandable-open' : ''}`}
                        onClick={() => setExpandedBlocker(expandedBlocker === idx ? null : idx)}
                        style={{ width: '100%' }}
                      >
                        <span className="expandable-chevron">▶</span>
                        {blocker.problem}
                      </button>
                      {expandedBlocker === idx && (
                        <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginTop: '0.25rem' }}>
                          <p className="callout callout-tip" style={{ margin: 0 }}>{blocker.solution}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Objectives with spoiler hints */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>Objectives</h3>
                {chapter.objectives.map((obj, idx) => {
                  const spoilerKey = `${chapter.id}-obj-${idx}`;
                  const isRevealed = revealedSpoilers.has(spoilerKey);
                  return (
                    <div key={idx} className="card" style={{ marginBottom: '0.5rem', padding: '1rem' }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{obj.task}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        💡 Hint: {obj.hint}
                      </div>
                      <div
                        className={`spoiler ${isRevealed ? 'spoiler-revealed' : 'spoiler-hidden'}`}
                        onClick={() => toggleSpoiler(spoilerKey)}
                      >
                        <div className="spoiler-content">
                          <p style={{ fontSize: '0.85rem', margin: 0 }}>{obj.spoiler}</p>
                        </div>
                        {!isRevealed && (
                          <div className="spoiler-overlay">🔒 Click to reveal spoiler</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost" onClick={startOver}>
                  ← Start Over
                </button>
                <Link href="/story" className="btn btn-primary">
                  Go to full Story Guide →
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Item */}
          {step === 2 && topic === 'item' && (
            <div style={{ textAlign: 'left' }}>
              <div className="unstuck-question" style={{ textAlign: 'center' }}>
                Search for the item you need
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Type an item name..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    border: '2px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '1rem',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </div>

              {itemSearch.trim() && filteredItems.length === 0 && (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-state-icon">🔍</div>
                  <div className="empty-state-title">No items found</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try a different search term</p>
                </div>
              )}

              {filteredItems.map((item) => {
                const loc = locationsData.find((l) => l.id === item.location);
                return (
                  <div key={item.id} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div className="card-title">{item.name}</div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                          <span className={`badge badge-${item.rarity}`}>{item.rarity}</span>
                          <span className="badge badge-teal">{item.category}</span>
                        </div>
                        <p className="card-desc">{item.description}</p>
                        <div className="callout callout-info" style={{ marginTop: '0.5rem' }}>
                          <strong>How to obtain:</strong> {item.howToObtain}
                        </div>
                        {loc && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                            📍 Found at: {loc.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button className="btn btn-ghost" onClick={startOver}>
                  ← Start Over
                </button>
                <Link href="/items" className="btn btn-primary">
                  Go to full Item Database →
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && topic === 'location' && !selectedLocation && (
            <>
              <div className="unstuck-question">Which location are you trying to reach?</div>
              <div className="unstuck-options">
                {locationsData.map((loc) => (
                  <button
                    key={loc.id}
                    className="unstuck-option"
                    onClick={() => setSelectedLocation(loc.id)}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{loc.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>{loc.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400, marginTop: '0.2rem' }}>
                        {loc.biome}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: '1.5rem' }} onClick={startOver}>
                ← Start Over
              </button>
            </>
          )}

          {/* Step 2: Location Selected */}
          {step === 2 && topic === 'location' && selectedLocation && location && (
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{location.icon}</span>
                <h2>{location.name}</h2>
              </div>

              <p className="card-desc" style={{ marginBottom: '1rem' }}>{location.description}</p>

              <div className="callout callout-warning" style={{ marginBottom: '1rem' }}>
                <strong>🔓 How to unlock:</strong> {location.unlockRequirement}
              </div>

              {location.tips && (
                <div className="callout callout-tip" style={{ marginBottom: '1rem' }}>
                  <strong>💡 Tips:</strong> {location.tips}
                </div>
              )}

              {location.pokemon.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Pokemon Found Here</h4>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {location.pokemon.map((p) => (
                      <span key={p} className="badge badge-purple">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button className="btn btn-ghost" onClick={startOver}>
                  ← Start Over
                </button>
                <Link href="/locations" className="btn btn-primary">
                  Go to full Location Guide →
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Craft */}
          {step === 2 && topic === 'craft' && (
            <div style={{ textAlign: 'left' }}>
              <div className="unstuck-question" style={{ textAlign: 'center' }}>
                Here are all craftable and material items
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {craftItems.map((item) => {
                  const loc = locationsData.find((l) => l.id === item.location);
                  return (
                    <div key={item.id} className="card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <span style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div className="card-title">{item.name}</div>
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                            <span className={`badge badge-${item.rarity}`}>{item.rarity}</span>
                            <span className="badge badge-teal">{item.category}</span>
                          </div>
                          <p className="card-desc">{item.description}</p>
                          <div className="callout callout-info" style={{ marginTop: '0.5rem' }}>
                            <strong>How to obtain:</strong> {item.howToObtain}
                          </div>
                          {loc && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                              📍 Found at: {loc.name}
                            </div>
                          )}
                          {item.relatedItems.length > 0 && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                              Related: {item.relatedItems.map((rid) => {
                                const related = itemsData.find((i) => i.id === rid);
                                return related ? related.name : rid;
                              }).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button className="btn btn-ghost" onClick={startOver}>
                  ← Start Over
                </button>
                <Link href="/items" className="btn btn-primary">
                  Go to full Item Database →
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Other */}
          {step === 2 && topic === 'other' && (
            <div style={{ textAlign: 'left' }}>
              <div className="unstuck-question" style={{ textAlign: 'center' }}>
                Here are some tips that might help
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {usefulTips.map((tip) => (
                  <div key={tip.id} className="card tip-card" data-category={tip.category} style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{tip.icon}</span>
                      <div>
                        <div className="card-title">{tip.title}</div>
                        <p className="card-desc">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost" onClick={startOver}>
                  ← Start Over
                </button>
                <Link href="/tips" className="btn btn-primary">
                  Go to full Tips &amp; Tricks →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
