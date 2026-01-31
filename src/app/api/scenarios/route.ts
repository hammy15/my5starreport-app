/**
 * API Route: Saved Scenarios
 * GET - List user's scenarios
 * POST - Save new scenario
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveScenario, getUserScenarios, deleteScenario, updateScenario } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const scenarios = await getUserScenarios(parseInt(userId));

    return NextResponse.json({
      scenarios,
      count: scenarios.length,
    });
  } catch (error) {
    console.error('Get scenarios error:', error);
    return NextResponse.json(
      { error: 'Failed to get scenarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, facilityCcn, facilityName, scenarioName, scenarioData, predictedRatings, notes } = await request.json();

    if (!userId || !facilityCcn || !scenarioName || !scenarioData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const scenario = await saveScenario(
      userId,
      facilityCcn,
      facilityName || 'Unknown Facility',
      scenarioName,
      scenarioData,
      predictedRatings,
      notes
    );

    return NextResponse.json({
      success: true,
      scenario,
    });
  } catch (error) {
    console.error('Save scenario error:', error);
    return NextResponse.json(
      { error: 'Failed to save scenario' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, scenarioId, scenarioName, scenarioData, predictedRatings, notes } = await request.json();

    if (!userId || !scenarioId) {
      return NextResponse.json(
        { error: 'User ID and Scenario ID required' },
        { status: 400 }
      );
    }

    const scenario = await updateScenario(userId, scenarioId, {
      scenario_name: scenarioName,
      scenario_data: scenarioData,
      predicted_ratings: predictedRatings,
      notes,
    });

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scenario,
    });
  } catch (error) {
    console.error('Update scenario error:', error);
    return NextResponse.json(
      { error: 'Failed to update scenario' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const scenarioId = request.nextUrl.searchParams.get('scenarioId');

    if (!userId || !scenarioId) {
      return NextResponse.json(
        { error: 'User ID and Scenario ID required' },
        { status: 400 }
      );
    }

    await deleteScenario(parseInt(userId), parseInt(scenarioId));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete scenario error:', error);
    return NextResponse.json(
      { error: 'Failed to delete scenario' },
      { status: 500 }
    );
  }
}
