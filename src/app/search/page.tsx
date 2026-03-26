'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';

type TypeFilter = 'all' | 'item' | 'tip' | 'location' | 'story' | 'collectible' | 'guide';

const FILTER_OPTIONS: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'item', label: 'Items' },
  { key: 'tip', label: 'Tips' },
  { key: 'location', label: 'Locations' },
  { key: 'story', label: 'Story' },
  { key: 'collectible', label: 'Collectibles' },
  { key: 'guide', label: 'Guides' },
];

const TYPE_BADGE: Record<string, string> = {
  item: 'badge-teal',
  tip: 'badge-yellow',
  location: 'badge-green',
  story: 'badge-purple',
  collectible: 'badge-coral',
  guide: 'badge-pink',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-title">Loading search...</div></div>}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const { search } = useSearch();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return search(query);
  }, [query, search]);

  const filteredResults = useMemo(() => {
    if (typeFilter === 'all') return results;
    return results.filter((r) => r.item.type === typeFilter);
  }, [results, typeFilter]);

  // Count by type for badges
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of results) {
      counts[r.item.type] = (counts[r.item.type] ?? 0) + 1;
    }
    return counts;
  }, [results]);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Search Results</span>
        </nav>

        {/* Page Header */}
        <div className="page-header">
          <h1>Search Results</h1>
          {query.trim() ? (
            <p>
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <p>Use the search bar to find items, tips, locations, and more.</p>
          )}
        </div>

        {/* No query state */}
        {!query.trim() && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">Start searching</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Use the search bar to find items, tips, locations, and more.
            </p>
          </div>
        )}

        {/* Has query */}
        {query.trim() && (
          <>
            {/* Filter Pills */}
            <div className="filter-bar">
              {FILTER_OPTIONS.map((opt) => {
                const count = opt.key === 'all' ? results.length : (typeCounts[opt.key] ?? 0);
                return (
                  <button
                    key={opt.key}
                    className={`filter-pill ${typeFilter === opt.key ? 'active' : ''}`}
                    onClick={() => setTypeFilter(opt.key)}
                  >
                    {opt.label} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
                  </button>
                );
              })}
            </div>

            {/* Results */}
            {filteredResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredResults.map((result) => {
                  const { item } = result;
                  return (
                    <Link
                      key={item.id}
                      href={item.link}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="card card-hoverable" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{item.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                              <span className="card-title" style={{ marginBottom: 0 }}>{item.title}</span>
                              <span className={`badge ${TYPE_BADGE[item.type] ?? 'badge-teal'}`}>
                                {item.type}
                              </span>
                            </div>
                            <p className="card-desc">{item.description}</p>
                          </div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">😕</div>
                <div className="empty-state-title">No results found</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0' }}>
                  Try different keywords, check spelling, or browse by category using the navigation above.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <Link href="/items" className="btn btn-ghost btn-sm">Browse Items</Link>
                  <Link href="/tips" className="btn btn-ghost btn-sm">Browse Tips</Link>
                  <Link href="/locations" className="btn btn-ghost btn-sm">Browse Locations</Link>
                  <Link href="/collectibles" className="btn btn-ghost btn-sm">Browse Collectibles</Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
