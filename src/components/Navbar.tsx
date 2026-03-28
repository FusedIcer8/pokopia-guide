'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import SearchOverlay from './SearchOverlay';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/story', label: 'Story' },
  { href: '/items', label: 'Items' },
  { href: '/locations', label: 'Locations' },
  { href: '/tips', label: 'Tips' },
  { href: '/unstuck', label: 'Help' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { count } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">
          <Link href="/" className="navbar-logo">
            Pokopia Guide
          </Link>

          <div className="navbar-links">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`navbar-link ${pathname === href ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <button
              className="navbar-action-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              type="button"
            >
              🔍
            </button>

            <button
              className="navbar-action-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              type="button"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <Link href="/favorites" className="navbar-action-btn navbar-favorites">
              ❤️
              {count > 0 && <span className="navbar-badge">{count}</span>}
            </Link>

            <button
              className="navbar-hamburger"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
              type="button"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu - separate from navbar-links so it renders on mobile */}
        <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`navbar-link ${pathname === href ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
