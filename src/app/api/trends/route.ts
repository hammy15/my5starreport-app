/**
 * API Route: Historical Rating Trends
 * Get rating history for a facility
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const ccn = request.nextUrl.searchParams.get('ccn');
    const months = parseInt(request.nextUrl.searchParams.get('months') || '24');

    if (!ccn) {
      return NextResponse.json(
        { error: 'CCN required' },
        { status: 400 }
      );
    }

    // Get facility ID
    const facility = await sql`
      SELECT id, name, ccn, "overallRating", "healthRating", "staffingRating", "qmRating"
      FROM "Facility"
      WHERE ccn = ${ccn}
      LIMIT 1
    `;

    if (!facility[0]) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      );
    }

    // Get rating history
    const history = await sql`
      SELECT
        "recordDate" as date,
        "overallRating" as overall,
        "healthRating" as health,
        "staffingRating" as staffing,
        "qmRating" as qm
      FROM "RatingHistory"
      WHERE "facilityId" = ${facility[0].id}
      ORDER BY "recordDate" DESC
      LIMIT ${months}
    `;

    // Get survey history
    const surveys = await sql`
      SELECT
        "surveyDate" as date,
        "surveyType" as type,
        "deficiencies",
        "severity"
      FROM "SurveyHistory"
      WHERE "facilityId" = ${facility[0].id}
      ORDER BY "surveyDate" DESC
      LIMIT 10
    `;

    // Calculate trend direction
    let trendDirection = 'stable';
    if (history.length >= 2) {
      const recentAvg = history.slice(0, Math.min(3, history.length)).reduce((sum: number, h: any) => sum + (h.overall || 0), 0) / Math.min(3, history.length);
      const olderAvg = history.slice(-3).reduce((sum: number, h: any) => sum + (h.overall || 0), 0) / 3;
      if (recentAvg > olderAvg + 0.3) trendDirection = 'improving';
      else if (recentAvg < olderAvg - 0.3) trendDirection = 'declining';
    }

    // Generate chart-friendly data
    const chartData = history.reverse().map((h: any) => ({
      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      overall: h.overall,
      health: h.health,
      staffing: h.staffing,
      qm: h.qm,
    }));

    return NextResponse.json({
      facility: {
        name: facility[0].name,
        ccn: facility[0].ccn,
        currentRatings: {
          overall: facility[0].overallRating,
          health: facility[0].healthRating,
          staffing: facility[0].staffingRating,
          qm: facility[0].qmRating,
        },
      },
      history: chartData,
      surveys,
      trendDirection,
      dataPoints: history.length,
    });
  } catch (error) {
    console.error('Trends error:', error);
    return NextResponse.json(
      { error: 'Failed to get trend data' },
      { status: 500 }
    );
  }
}
