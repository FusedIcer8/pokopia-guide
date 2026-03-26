'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearch, SearchResult } from '../hooks/useSearch';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { search } = useSearch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setResults(search(debouncedQuery));
  }, [debouncedQuery, search]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setDebouncedQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-overlay-content" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="search-overlay-input"
          placeholder="Search items, locations, tips, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="search-results">
          {results.length > 0 &&
            results.map((result) => (
              <Link
                key={result.item.id}
                href={result.item.link}
                className="search-result-item"
                onClick={onClose}
              >
                <span className="search-result-icon">{result.item.icon}</span>
                <div className="search-result-text">
                  <span className="search-result-title">
                    {result.item.title}
                    <span className="search-result-badge">{result.item.type}</span>
                  </span>
                  <span className="search-result-description">
                    {result.item.description}
                  </span>
                </div>
              </Link>
            ))}

          {debouncedQuery && results.length === 0 && (
            <div className="search-empty">No results found for &ldquo;{debouncedQuery}&rdquo;</div>
          )}

          {!debouncedQuery && (
            <div className="search-hint">
              Type to search items, locations, tips, and more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
