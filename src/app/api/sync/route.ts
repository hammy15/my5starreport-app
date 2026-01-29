/**
 * API Route: Data Sync Status
 *
 * Since we're connected to the snfinfo database which has all CMS data,
 * this route just reports the current data status.
 */

import { NextResponse } from 'next/server';
import { getDatabaseStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getDatabaseStats();

    return NextResponse.json({
      status: 'synced',
      database: 'snfinfo',
      lastSync: new Date().toISOString(),
      data: {
        facilities: stats.facilities,
        qualityMeasures: stats.quality_measures,
        healthCitations: stats.health_citations,
        penalties: stats.penalties,
        surveys: stats.surveys,
      },
      message: 'Database contains all US SNF data from CMS',
    });
  } catch (error) {
    console.error('Sync status error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
