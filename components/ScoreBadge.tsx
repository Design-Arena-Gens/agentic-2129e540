export default function ScoreBadge({ value, title }: { value: number; title?: string }) {
  const cls = value >= 4 ? 'good' : value >= 3 ? 'ok' : 'bad';
  return (
    <span className={`score ${cls}`} title={title || ''}>{value.toFixed(2)}</span>
  );
}
