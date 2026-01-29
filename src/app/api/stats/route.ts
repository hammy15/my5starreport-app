/**
 * API Route: Database Statistics
 *
 * Returns counts of all data in the snfinfo database.
 */

import { NextResponse } from 'next/server';
import { getDatabaseStats, getFacilityCountByState } from '@/lib/db';

export async function GET() {
  try {
    const [stats, stateBreakdown] = await Promise.all([
      getDatabaseStats(),
      getFacilityCountByState(),
    ]);

    return NextResponse.json({
      totals: stats,
      byState: stateBreakdown,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
