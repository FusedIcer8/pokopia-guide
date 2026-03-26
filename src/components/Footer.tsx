'use client';
import Link from 'next/link';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/story', label: 'Story' },
  { href: '/items', label: 'Items' },
  { href: '/locations', label: 'Locations' },
  { href: '/tips', label: 'Tips' },
  { href: '/collectibles', label: 'Collectibles' },
  { href: '/unstuck', label: 'Help' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        {footerLinks.map(({ href, label }) => (
          <Link key={href} href={href} className="footer-link">
            {label}
          </Link>
        ))}
      </div>
      <p className="footer-tagline">Made with ❤️ for Pokopia adventurers</p>
    </footer>
  );
}
