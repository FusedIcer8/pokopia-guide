'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import locationsData from '@/content/locations.json';
import { useFavorites } from '@/hooks/useFavorites';

interface Location {
  id: string;
  name: string;
  biome: string;
  description: string;
  unlockRequirement: string;
  keyItems: string[];
  resources: string[];
  storyEvents: string[];
  tips: string;
  pokemon: string[];
  icon: string;
  connected: string[];
}

const locations = locationsData as Location[];

const biomes = [
  'All',
  'Town',
  'Meadow',
  'Forest',
  'Mountain',
  'Coast',
  'Cave',
  'Ruins',
];

function getBiomeBadgeClass(biome: string): string {
  const map: Record<string, string> = {
    town: 'badge-coral',
    meadow: 'badge-green',
    forest: 'badge-teal',
    mountain: 'badge-purple',
    coast: 'badge-teal',
    cave: 'badge-purple',
    ruins: 'badge-yellow',
  };
  return map[biome.toLowerCase()] ?? 'badge-teal';
}

function getLocationNameById(id: string): string {
  const found = locations.find((l) => l.id === id);
  return found ? found.name : id;
}

export default function LocationsPage() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [biomeFilter, setBiomeFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const filteredLocations = useMemo(() => {
    if (biomeFilter === 'All') return locations;
    return locations.filter(
      (loc) => loc.biome.toLowerCase() === biomeFilter.toLowerCase()
    );
  }, [biomeFilter]);

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Locations</span>
      </nav>

      {/* Page Header */}
      <div className="page-header">
        <h1>Maps & Locations</h1>
        <p>Explore every corner of the Pokopia world</p>
      </div>

      {/* Biome Filter */}
      <div className="filter-bar">
        {biomes.map((biome) => (
          <button
            key={biome}
            className={`filter-pill ${biomeFilter === biome ? 'active' : ''}`}
            onClick={() => setBiomeFilter(biome)}
          >
            {biome}
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedLocation && (
        <div className="detail-panel">
          <div className="detail-header">
            <span className="detail-icon">{selectedLocation.icon}</span>
            <div>
              <h2 className="detail-title">{selectedLocation.name}</h2>
              <span className={`badge ${getBiomeBadgeClass(selectedLocation.biome)}`}>
                {selectedLocation.biome}
              </span>
            </div>
            <button
              className={`fav-btn ${isFavorite(selectedLocation.id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(selectedLocation.id)}
              style={{ marginLeft: 'auto' }}
            >
              {isFavorite(selectedLocation.id) ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="detail-section">
            <h4>Description</h4>
            <p style={{ fontSize: '0.95rem' }}>{selectedLocation.description}</p>
          </div>

          {/* Unlock Requirement */}
          <div className="callout callout-info" style={{ marginBottom: '1.25rem' }}>
            <strong>Unlock Requirement:</strong> {selectedLocation.unlockRequirement}
          </div>

          {/* Key Items */}
          {selectedLocation.keyItems.length > 0 && (
            <div className="detail-section">
              <h4>Key Items</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedLocation.keyItems.map((itemId) => (
                  <span key={itemId} className="badge badge-yellow">
                    {itemId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {selectedLocation.resources.length > 0 && (
            <div className="detail-section">
              <h4>Resources</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedLocation.resources.map((resId) => (
                  <span key={resId} className="badge badge-teal">
                    {resId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Story Events */}
          {selectedLocation.storyEvents.length > 0 && (
            <div className="detail-section">
              <h4>Story Events</h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                {selectedLocation.storyEvents.map((event, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem' }}>
                    {event}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {selectedLocation.tips && (
            <div className="detail-section">
              <h4>Tips</h4>
              <div className="callout callout-tip">
                <p style={{ fontSize: '0.9rem' }}>{selectedLocation.tips}</p>
              </div>
            </div>
          )}

          {/* Pokemon */}
          {selectedLocation.pokemon.length > 0 && (
            <div className="detail-section">
              <h4>Pokemon</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedLocation.pokemon.map((poke) => (
                  <span key={poke} className="badge badge-coral">
                    {poke}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Connected Locations */}
          {selectedLocation.connected.length > 0 && (
            <div className="detail-section">
              <h4>Connected Locations</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedLocation.connected.map((connId) => (
                  <button
                    key={connId}
                    className="badge badge-purple"
                    style={{ cursor: 'pointer', border: 'none' }}
                    onClick={() => {
                      const found = locations.find((l) => l.id === connId);
                      if (found) setSelectedLocation(found);
                    }}
                  >
                    {getLocationNameById(connId)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSelectedLocation(null)}
            style={{ marginTop: '0.5rem' }}
          >
            Close details
          </button>
        </div>
      )}

      {/* Locations Grid */}
      {filteredLocations.length > 0 ? (
        <div className="grid-2">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="card card-hoverable location-card"
              onClick={() => setSelectedLocation(loc)}
            >
              <span className="card-icon">{loc.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 className="card-title">{loc.name}</h3>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <span className={`badge ${getBiomeBadgeClass(loc.biome)}`}>
                    {loc.biome}
                  </span>
                </div>
                <p className="card-desc">
                  {loc.description.length > 100
                    ? `${loc.description.slice(0, 100)}...`
                    : loc.description}
                </p>
                {loc.pokemon.length > 0 && (
                  <p
                    className="card-desc"
                    style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
                  >
                    Pokemon: {loc.pokemon.slice(0, 3).join(', ')}
                    {loc.pokemon.length > 3 && ` +${loc.pokemon.length - 3} more`}
                  </p>
                )}
              </div>
              <button
                className={`fav-btn ${isFavorite(loc.id) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(loc.id);
                }}
              >
                {isFavorite(loc.id) ? '❤️' : '🤍'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <div className="empty-state-title">No locations found</div>
          <p>Try selecting a different biome filter</p>
        </div>
      )}
    </>
  );
}
