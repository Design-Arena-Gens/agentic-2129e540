import dynamic from 'next/dynamic';
const ScannerForm = dynamic(() => import('@components/ScannerForm'), { ssr: false });
import QualitativePanel from '@components/QualitativePanel';

export const dynamicParams = true;

export default function ScanPage() {
  return (
    <div className="grid" style={{gap:16}}>
      <h2>Run Scanner</h2>
      <ScannerForm />
      <div className="card">
        <h3>Disclaimer</h3>
        <p>Data is sourced server-side from public Yahoo endpoints and may be delayed or incomplete. Do your own research. This is not investment advice.</p>
      </div>
    </div>
  );
}
