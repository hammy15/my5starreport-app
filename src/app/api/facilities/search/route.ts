/**
 * API Route: Search Facilities
 *
 * Searches the snfinfo database for nursing facilities.
 * Contains all 14,732 US SNFs.
 * Supports: text search, state filter, and CCN list lookup.
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchFacilitiesDB, searchFacilitiesByCCN } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const state = searchParams.get('state') || undefined;
    const ccns = searchParams.get('ccns') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let results;

    // If CCN list provided, search by CCNs
    if (ccns) {
      const ccnList = ccns.split(',').map(c => c.trim()).filter(Boolean);
      results = await searchFacilitiesByCCN(ccnList);
    } else {
      // Otherwise, do text search
      results = await searchFacilitiesDB(query, state, limit);
    }

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
