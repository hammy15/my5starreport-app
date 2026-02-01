/**
 * API Route: Competitor Analysis
 * Find and compare nearby facilities within a specified radius
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @returns distance in miles
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

      // Check if target facility has coordinates
      const hasCoordinates = targetFacility.latitude && targetFacility.longitude;

      if (hasCoordinates) {
        // Find competitors within the specified radius using distance calculation
        // First get a broader set of candidates (facilities in nearby states or within a lat/lng box)
        const latDelta = radius / 69; // Approximate miles per degree of latitude
        const lonDelta = radius / (69 * Math.cos(targetFacility.latitude * Math.PI / 180));

        const candidates = await sql`
          SELECT ccn, name, city, state, latitude, longitude,
                 "overallRating", "healthRating", "staffingRating", "qmRating",
                 beds, "nursingHoursPerResidentDay" as "totalHPRD",
                 "rnHoursPerResidentDay" as "rnHPRD"
          FROM "Facility"
          WHERE ccn != ${ccn}
            AND latitude IS NOT NULL
            AND longitude IS NOT NULL
            AND latitude BETWEEN ${targetFacility.latitude - latDelta} AND ${targetFacility.latitude + latDelta}
            AND longitude BETWEEN ${targetFacility.longitude - lonDelta} AND ${targetFacility.longitude + lonDelta}
        `;

        // Calculate actual distance for each candidate and filter by radius
        competitors = candidates
          .map((c: any) => ({
            ...c,
            distance: calculateDistance(
              targetFacility.latitude,
              targetFacility.longitude,
              c.latitude,
              c.longitude
            )
          }))
          .filter((c: any) => c.distance <= radius)
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, limit);
      } else {
        // Fallback: Find competitors in same state if no coordinates available
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
        competitors = results.map((c: any) => ({ ...c, distance: null }));
      }
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
      radiusUsed: radius,
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
