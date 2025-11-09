"use client";
import { useState } from 'react';
import { NIFTY50, POPULAR_MIDCAPS, BSE_SAMPLE } from '@lib/tickers';
import type { Exchange, QualitativeInputs, ScanResult } from '@lib/types';

export default function ScannerForm() {
  const [tickers, setTickers] = useState<string[]>(NIFTY50.slice(0, 15));
  const [exchange, setExchange] = useState<Exchange>('AUTO');
  const [results, setResults] = useState<ScanResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState<QualitativeInputs>({ businessQuality: 3, scalability: 3, moatStrength: 3, industryTailwind: 3, capitalAllocation: 3 });

  async function runScan() {
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers, exchange, qualitative: q })
      });
      const json = await res.json();
      setResults(json.results as ScanResult[]);
    } catch (e) {
      console.error(e);
      alert('Scan failed');
    } finally {
      setLoading(false);
    }
  }

  function preset(arr: string[]) {
    setTickers(arr);
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h3>Choose Tickers</h3>
        <div className="grid cols-3">
          <div>
            <label>Exchange</label>
            <select className="input" value={exchange} onChange={e=>setExchange(e.target.value as Exchange)}>
              <option value="AUTO">AUTO (try NSE then BSE)</option>
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
          </div>
          <div>
            <label>Preset Lists</label>
            <div style={{display:'flex', gap:8}}>
              <button className="btn secondary" onClick={()=>preset(NIFTY50)}>NIFTY 50</button>
              <button className="btn secondary" onClick={()=>preset(POPULAR_MIDCAPS)}>Popular Midcaps</button>
              <button className="btn secondary" onClick={()=>preset(BSE_SAMPLE)}>BSE Sample</button>
            </div>
          </div>
          <div>
            <label>Actions</label>
            <button className="btn" onClick={runScan} disabled={loading}>{loading ? 'Scanning?' : 'Run Scanner'}</button>
          </div>
        </div>
        <label style={{display:'block', marginTop:12}}>Tickers (comma separated)</label>
        <input className="input" value={tickers.join(',')} onChange={e=>setTickers(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Guidance</h3>
          <ul>
            <li>Symbols like TCS, RELIANCE, HDFCBANK (exchange suffix auto-handled).</li>
            <li>Governance and moat are critical gates; avoid if below 3.0.</li>
            <li>Qualitative sliders let you encode your assessment for business, scalability, and moat.</li>
          </ul>
        </div>
      </div>

      {results && (
        <div className="card">
          <h3>Results</h3>
          <ResultsTable results={results} />
        </div>
      )}
    </div>
  );
}

function Score({v}:{v:number}){
  const cls = v>=4?'good':v>=3?'ok':'bad';
  return <span className={`score ${cls}`}>{v.toFixed(2)}</span>;
}

function Verdict({d}:{d: ScanResult['score']['decision']}) {
  const map = { CANDIDATE: 'good', WATCHLIST: 'ok', AVOID: 'bad' } as const;
  return <span className={`score ${map[d]}`} style={{fontWeight:800}}>{d}</span>;
}

function ResultsTable({ results }: { results: ScanResult[] }) {
  const sorted = [...results].sort((a,b)=> b.score.overall - a.score.overall);
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Gov</th>
          <th>Business</th>
          <th>Moat</th>
          <th>Fin</th>
          <th>Growth</th>
          <th>Valuation</th>
          <th>Momentum</th>
          <th>Overall</th>
          <th>Decision</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(({data, score, error}) => (
          <tr key={data.symbol}>
            <td>{data.rawSymbol}<span className="badge">{data.exchange}</span></td>
            <td>{data.name || '?'}</td>
            <td><Score v={score.governance}/></td>
            <td><Score v={score.business}/></td>
            <td><Score v={score.moat}/></td>
            <td><Score v={score.financialQuality}/></td>
            <td><Score v={score.growth}/></td>
            <td><Score v={score.valuation}/></td>
            <td><Score v={score.momentumRisk}/></td>
            <td><Score v={score.overall}/></td>
            <td>{error ? <span className="score bad">ERROR</span> : <Verdict d={score.decision}/>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
