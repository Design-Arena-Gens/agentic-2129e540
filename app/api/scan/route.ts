import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchCompany } from '@lib/providers/yahoo';
import { scoreCompany } from '@lib/scoring';
import type { Exchange, ScanInput, ScanResult } from '@lib/types';

const InputSchema = z.object({
  tickers: z.array(z.string().min(1)).min(1).max(100),
  exchange: z.enum(['NSE','BSE','AUTO']).default('AUTO'),
  qualitative: z.object({
    governanceOverride: z.number().min(0).max(5).nullable().optional(),
    businessQuality: z.number().min(0).max(5).optional(),
    scalability: z.number().min(0).max(5).optional(),
    moatStrength: z.number().min(0).max(5).optional(),
    industryTailwind: z.number().min(0).max(5).optional(),
    capitalAllocation: z.number().min(0).max(5).optional(),
  }).partial().optional(),
});

async function pLimit<T>(concurrency: number, tasks: (()=>Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];
  let i = 0;
  const run = async () => {
    while (i < tasks.length) {
      const cur = i++;
      const r = await tasks[cur]();
      results[cur] = r;
    }
  };
  const runners = Array.from({length: Math.min(concurrency, tasks.length)}, run);
  await Promise.all(runners);
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = InputSchema.parse(raw) as ScanInput;

    const tasks = parsed.tickers.map((t) => async (): Promise<ScanResult> => {
      try {
        const data = await fetchCompany(t, parsed.exchange as Exchange);
        const score = scoreCompany(data, parsed.qualitative || {});
        return { data, score };
      } catch (e: any) {
        // Fallback demo data so the scanner remains usable when upstream blocks
        const seed = [...t].reduce((a,c)=>a + c.charCodeAt(0), 0);
        const r = (min:number, max:number, s:number) => min + ((s % 100) / 100) * (max-min);
        const data = {
          symbol: t,
          rawSymbol: t,
          exchange: parsed.exchange as Exchange,
          name: t + ' (Fallback)',
          sector: 'Unknown',
          industry: 'Unknown',
          marketCap: Math.round(r(2e11, 8e12, seed)),
          currentPrice: r(100, 4000, seed*3),
          fiftyTwoWeekHigh: r(120, 4500, seed*5),
          fiftyTwoWeekLow: r(80, 3000, seed*7),
          insidersPercentHeld: r(0.2, 0.7, seed*11),
          institutionsPercentHeld: r(0.05, 0.3, seed*13),
          revenueHistory: [
            { year: 2021, revenue: r(1e10, 8e11, seed*17) },
            { year: 2022, revenue: r(1.1e10, 9e11, seed*19) },
            { year: 2023, revenue: r(1.2e10, 1e12, seed*23) }
          ],
          netIncomeHistory: [
            { year: 2021, netIncome: r(5e9, 2e11, seed*29) },
            { year: 2022, netIncome: r(6e9, 2.4e11, seed*31) },
            { year: 2023, netIncome: r(7e9, 2.8e11, seed*37) }
          ],
          totalEquityHistory: [
            { year: 2021, totalEquity: r(2e10, 5e11, seed*41) },
            { year: 2022, totalEquity: r(2.2e10, 5.5e11, seed*43) },
            { year: 2023, totalEquity: r(2.5e10, 6e11, seed*47) }
          ],
          totalDebtLatest: r(0, 2e11, seed*53),
          ebitLatest: r(1e9, 1e11, seed*59),
          freeCashFlowLatest: r(-5e9, 1.2e11, seed*61),
          operatingMargin: r(0.08, 0.28, seed*67),
          profitMargin: r(0.05, 0.22, seed*71),
          roe: r(0.10, 0.30, seed*73),
          roceApprox: null,
          peRatio: r(12, 45, seed*79),
          pegRatio: r(0.6, 2.2, seed*83),
          evToEbitda: r(8, 24, seed*89)
        } as const;
        const score = scoreCompany(data as any, parsed.qualitative || {});
        score.notes.push(String(e?.message || e));
        score.notes.push('Used fallback sample data due to provider rate limit or unavailability.');
        return { data: data as any, score, error: String(e?.message||e) };
      }
    });

    const results = await pLimit(5, tasks);
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid input' }, { status: 400 });
  }
}
