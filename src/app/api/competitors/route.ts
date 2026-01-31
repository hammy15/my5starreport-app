/**
 * API Route: Competitor Analysis
 * Find and compare nearby facilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const ccn = request.nextUrl.searchParams.get('ccn');
    const state = request.nextUrl.searchParams.get('state');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const radius = parseInt(request.nextUrl.searchParams.get('radius') || '50'); // miles

    if (!ccn && !state) {
      return NextResponse.json(
        { error: 'CCN or state required' },
        { status: 400 }
      );
    }

    let targetFacility: any = null;
    let competitors: any[] = [];

    if (ccn) {
      // Get the target facility first
      const target = await sql`
        SELECT ccn, name, city, state, latitude, longitude,
               "overallRating", "healthRating", "staffingRating", "qmRating",
               beds, "nursingHoursPerResidentDay", "rnHoursPerResidentDay"
        FROM "Facility"
        WHERE ccn = ${ccn}
        LIMIT 1
      `;
      targetFacility = target[0];

      if (!targetFacility) {
        return NextResponse.json(
          { error: 'Facility not found' },
          { status: 404 }
        );
      }

      // Find competitors in same state (simple approach without distance calc for now)
      const results = await sql`
        SELECT ccn, name, city, state, latitude, longitude,
               "overallRating", "healthRating", "staffingRating", "qmRating",
               beds, "nursingHoursPerResidentDay" as "totalHPRD",
               "rnHoursPerResidentDay" as "rnHPRD"
        FROM "Facility"
        WHERE state = ${targetFacility.state}
          AND ccn != ${ccn}
        ORDER BY "overallRating" DESC
        LIMIT ${limit}
      `;
      competitors = results;
    } else if (state) {
      // Get top facilities in state
      const results = await sql`
        SELECT ccn, name, city, state, latitude, longitude,
               "overallRating", "healthRating", "staffingRating", "qmRating",
               beds, "nursingHoursPerResidentDay" as "totalHPRD",
               "rnHoursPerResidentDay" as "rnHPRD"
        FROM "Facility"
        WHERE state = ${state.toUpperCase()}
        ORDER BY "overallRating" DESC, name
        LIMIT ${limit}
      `;
      competitors = results;
    }

    // Calculate state averages
    const stateToUse = targetFacility?.state || state?.toUpperCase();
    const stateAvg = await sql`
      SELECT
        AVG("overallRating") as "avgOverall",
        AVG("healthRating") as "avgHealth",
        AVG("staffingRating") as "avgStaffing",
        AVG("qmRating") as "avgQM",
        AVG(beds) as "avgBeds",
        AVG("nursingHoursPerResidentDay") as "avgHPRD",
        COUNT(*) as "totalFacilities"
      FROM "Facility"
      WHERE state = ${stateToUse}
    `;

    // Calculate percentile ranking for target facility
    let percentileRank = null;
    if (targetFacility) {
      const ranking = await sql`
        SELECT COUNT(*) as "betterCount"
        FROM "Facility"
        WHERE state = ${targetFacility.state}
          AND "overallRating" > ${targetFacility.overallRating}
      `;
      const totalInState = parseInt(stateAvg[0]?.totalFacilities || '1');
      const betterCount = parseInt(ranking[0]?.betterCount || '0');
      percentileRank = Math.round(((totalInState - betterCount) / totalInState) * 100);
    }

    return NextResponse.json({
      targetFacility,
      competitors,
      stateAverages: stateAvg[0],
      percentileRank,
      comparisonMetrics: targetFacility ? {
        vsStateOverall: (targetFacility.overallRating - parseFloat(stateAvg[0]?.avgOverall || '3')).toFixed(2),
        vsStateHealth: (targetFacility.healthRating - parseFloat(stateAvg[0]?.avgHealth || '3')).toFixed(2),
        vsStateStaffing: (targetFacility.staffingRating - parseFloat(stateAvg[0]?.avgStaffing || '3')).toFixed(2),
        vsStateQM: (targetFacility.qmRating - parseFloat(stateAvg[0]?.avgQM || '3')).toFixed(2),
      } : null,
    });
  } catch (error) {
    console.error('Competitor analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to get competitor data' },
      { status: 500 }
    );
  }
}
