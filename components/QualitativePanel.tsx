"use client";
import { useState } from 'react';
import type { QualitativeInputs } from '@lib/types';

export default function QualitativePanel({ value, onChange }: { value: QualitativeInputs; onChange: (v: QualitativeInputs)=>void }) {
  const [local, setLocal] = useState<QualitativeInputs>(value);
  function set<K extends keyof QualitativeInputs>(k: K, v: number | null) {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange(next);
  }
  const Row = ({label, k}:{label:string;k:keyof QualitativeInputs}) => (
    <label style={{display:'grid', gridTemplateColumns:'1fr auto', gap:8, alignItems:'center'}}>
      <span>{label}</span>
      <input
        className="input"
        type="range" min={0} max={5} step={0.5}
        value={(local[k] as number|undefined) ?? 3}
        onChange={(e)=>set(k, parseFloat(e.target.value))}
      />
    </label>
  );
  return (
    <div className="card">
      <h3>Qualitative Inputs</h3>
      <div className="grid" style={{gap:12}}>
        <Row label="Governance override (optional)" k="governanceOverride" />
        <Row label="Business quality" k="businessQuality" />
        <Row label="Scalability" k="scalability" />
        <Row label="Moat strength" k="moatStrength" />
        <Row label="Industry tailwind" k="industryTailwind" />
        <Row label="Capital allocation quality" k="capitalAllocation" />
      </div>
      <small className="muted">Tip: Use governance override only if you verified promoter holdings/pledges.</small>
    </div>
  );
}
