/**
 * API Route: Favorite Facilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { addFavorite, removeFavorite, getUserFavorites } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const favorites = await getUserFavorites(parseInt(userId));

    return NextResponse.json({
      favorites,
      count: favorites.length,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to get favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, facilityCcn, facilityName } = await request.json();

    if (!userId || !facilityCcn) {
      return NextResponse.json(
        { error: 'User ID and Facility CCN required' },
        { status: 400 }
      );
    }

    const favorite = await addFavorite(userId, facilityCcn, facilityName || 'Unknown');

    return NextResponse.json({
      success: true,
      favorite,
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const facilityCcn = request.nextUrl.searchParams.get('facilityCcn');

    if (!userId || !facilityCcn) {
      return NextResponse.json(
        { error: 'User ID and Facility CCN required' },
        { status: 400 }
      );
    }

    await removeFavorite(parseInt(userId), facilityCcn);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
