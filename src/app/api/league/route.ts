import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const leagueData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'sport', 'contactEmail', 'contactName'];
    const missingFields = requiredFields.filter(field => !leagueData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leagueData.contactEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Save league data to database
    // 2. Create user account if needed
    // 3. Send welcome email
    // 4. Set up initial dashboard configuration

    // For demo purposes, we'll generate a league ID and return success
    const leagueId = `league_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    return NextResponse.json({
      success: true,
      leagueId,
      message: 'League information saved successfully',
      data: {
        ...leagueData,
        id: leagueId,
        createdAt: new Date().toISOString(),
        status: 'onboarding',
      },
    });

  } catch (error) {
    console.error('League creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('id');

    if (!leagueId) {
      return NextResponse.json(
        { success: false, error: 'League ID is required' },
        { status: 400 }
      );
    }

    // In a real app, you would fetch from database
    // For demo purposes, return mock data
    const mockLeagueData = {
      id: leagueId,
      name: 'Sample Basketball League',
      sport: 'Basketball',
      tier: 'amateur',
      contactEmail: 'contact@sampleleague.com',
      contactName: 'John Smith',
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
      },
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockLeagueData,
    });

  } catch (error) {
    console.error('League fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}