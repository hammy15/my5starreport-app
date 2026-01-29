/**
 * API Route: Training Resources
 *
 * Returns training resources from the database.
 * Query params:
 * - category: Filter by category (staffing, quality_measures, health_inspection, general)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTrainingResources } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;

    const resources = await getTrainingResources(category);

    return NextResponse.json({
      resources,
      count: resources.length,
    });
  } catch (error) {
    console.error('Training API error:', error);
    return NextResponse.json(
      { error: 'Failed to load training resources' },
      { status: 500 }
    );
  }
}
