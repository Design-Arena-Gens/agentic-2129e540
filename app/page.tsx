import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid" style={{gap: 24}}>
      <section className="card">
        <h2>Ultimate Multibagger Stock Screener</h2>
        <p>
          Rigorously score Indian equities (NSE & BSE) across 7 dimensions: Governance, Business Engine,
          Moat, Financial Quality, Growth, Valuation, and Momentum/Risk. Critical gates enforce quality
          so weak candidates are automatically filtered out.
        </p>
        <div style={{display:'flex', gap:12, marginTop:12}}>
          <Link href="/scan" className="btn">Run Scanner</Link>
          <a className="btn secondary" href="https://github.com" target="_blank" rel="noreferrer">Docs</a>
        </div>
      </section>

      <section className="grid cols-3">
        <div className="card"><h3>CRITICAL: Governance</h3><p>Promoter integrity, zero pledges, stable management, capital allocation discipline.</p></div>
        <div className="card"><h3>HIGH: Business Engine</h3><p>Clarity, focus, scalability, asset-light growth levers, diversification.</p></div>
        <div className="card"><h3>CRITICAL: Moat</h3><p>Durability through IP, switching costs, network effects; leadership & tailwinds.</p></div>
      </section>

      <section className="grid cols-3">
        <div className="card"><h3>Financial Quality</h3><p>ROE/ROCE, margin profile, cash generation, prudent leverage.</p></div>
        <div className="card"><h3>Growth & Efficiency</h3><p>Revenue/earnings CAGR, operating leverage, reinvestment runway.</p></div>
        <div className="card"><h3>Valuation & Momentum</h3><p>Reasonable multiples vs. quality; positive trends with controlled volatility.</p></div>
      </section>
    </div>
  );
}
