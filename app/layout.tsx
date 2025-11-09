import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ultimate Multibagger Stock Screener (India)',
  description: 'Scanner for potential multibagger Indian stocks (NSE & BSE) using a rigorous 7-part framework.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <h1 className="brand">Ultimate Multibagger Screener</h1>
            <nav>
              <a href="/">Home</a>
              <a href="/scan">Run Scanner</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>For education only. Not investment advice.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
