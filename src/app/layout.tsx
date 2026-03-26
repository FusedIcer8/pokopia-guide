import type { Metadata } from 'next';
import { Quicksand, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Pokopia Guide - Your Cozy Companion',
  description: 'The ultimate companion guide for Pokemon Pokopia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        <div className="page-wrapper">
          <div className="container">
            <div className="page-content">{children}</div>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
