/**
 * API Route: Search Facilities
 *
 * Searches the snfinfo database for nursing facilities.
 * Contains all 14,732 US SNFs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchFacilitiesDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const state = searchParams.get('state') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Search the database
    const results = await searchFacilitiesDB(query, state, limit);

    return NextResponse.json({
      results,
      count: results.length,
      query,
      state,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search facilities' },
      { status: 500 }
    );
  }
}
