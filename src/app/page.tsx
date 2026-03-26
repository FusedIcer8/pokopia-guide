'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import tips from '@/content/tips.json';
import guides from '@/content/guides.json';
import locations from '@/content/locations.json';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const firstFourTips = tips.slice(0, 4);
  const firstGuide = guides[0];
  const firstFourLocations = locations.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to the Pokopia Guide</h1>
        <p>Your cozy companion for everything in the world of Pokopia</p>

        <div className="hero-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search items, locations, tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <div className="hero-quicklinks">
          <Link href="/tips" className="card card-hoverable quicklink-card">
            <span className="card-icon">🌱</span>
            <span className="card-title">Start Here</span>
            <span className="card-desc">Tips and guides for new adventurers</span>
          </Link>
          <Link href="/unstuck" className="card card-hoverable quicklink-card">
            <span className="card-icon">🆘</span>
            <span className="card-title">Stuck?</span>
            <span className="card-desc">Get unstuck with targeted help</span>
          </Link>
          <Link href="/items" className="card card-hoverable quicklink-card">
            <span className="card-icon">🎒</span>
            <span className="card-title">Browse Items</span>
            <span className="card-desc">Every item, resource, and collectible</span>
          </Link>
        </div>
      </section>

      {/* Tips & Tricks Section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Tips & Tricks</h2>
          <Link href="/tips" className="section-link">
            View all tips →
          </Link>
        </div>
        <div className="grid-2">
          {firstFourTips.map((tip) => (
            <div key={tip.id} className="card tip-card" data-category={tip.category}>
              <span className="card-icon">{tip.icon}</span>
              <h3 className="card-title">{tip.title}</h3>
              <p className="card-desc">{tip.description}</p>
              <Link href="/tips" className="card-link">
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started Section */}
      {firstGuide && (
        <section style={{ marginTop: '3rem' }}>
          <div className="section-header">
            <h2 className="section-title">Getting Started</h2>
            <Link href="/tips" className="section-link">
              Full guide →
            </Link>
          </div>
          <div className="card" style={{ padding: '1.75rem' }}>
            <p className="card-desc" style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
              {firstGuide.summary}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {firstGuide.sections.slice(0, 2).map((section) => (
                <div key={section.heading} className="callout callout-tip">
                  <h4>{section.heading}</h4>
                  <p className="card-desc">{section.content}</p>
                </div>
              ))}
            </div>
            <Link href="/tips" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              Read the full guide →
            </Link>
          </div>
        </section>
      )}

      {/* Explore Locations Section */}
      <section style={{ marginTop: '3rem' }}>
        <div className="section-header">
          <h2 className="section-title">Explore Locations</h2>
          <Link href="/locations" className="section-link">
            View all locations →
          </Link>
        </div>
        <div className="grid-2">
          {firstFourLocations.map((loc) => (
            <Link
              key={loc.id}
              href="/locations"
              className="card card-hoverable location-card"
            >
              <span className="card-icon">{loc.icon}</span>
              <div>
                <h3 className="card-title">{loc.name}</h3>
                <span className="badge badge-teal">{loc.biome}</span>
                <p className="card-desc" style={{ marginTop: '0.5rem' }}>
                  {loc.description.length > 120
                    ? `${loc.description.slice(0, 120)}...`
                    : loc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
