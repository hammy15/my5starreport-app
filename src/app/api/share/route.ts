/**
 * API Route: Share Reports
 * Create shareable links for reports and scenarios
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSharedReport, getSharedReport } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Share token required' },
        { status: 400 }
      );
    }

    const report = await getSharedReport(token);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report: {
        type: report.report_type,
        data: report.report_data,
        created_at: report.created_at,
        expires_at: report.expires_at,
      },
    });
  } catch (error) {
    console.error('Get shared report error:', error);
    return NextResponse.json(
      { error: 'Failed to get shared report' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, reportType, reportData, expiresInHours } = await request.json();

    if (!userId || !reportType || !reportData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const report = await createSharedReport(userId, reportType, reportData, expiresInHours || 168);

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://my5starreport.com'}/share/${report.share_token}`;

    return NextResponse.json({
      success: true,
      shareToken: report.share_token,
      shareUrl,
      expiresAt: report.expires_at,
    });
  } catch (error) {
    console.error('Create share error:', error);
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    );
  }
}
