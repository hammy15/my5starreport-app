/**
 * API Documentation Endpoint
 * Returns API documentation in JSON format
 */

import { NextResponse } from 'next/server';

const apiDocumentation = {
  name: 'my5STARreport API',
  version: '1.0.0',
  baseUrl: 'https://my5starreport.com/api',
  description: 'REST API for accessing nursing home 5-star rating data and analysis tools',
  authentication: {
    type: 'none',
    note: 'Public API - no authentication required for read operations. User authentication required for saving scenarios.',
  },
  endpoints: [
    {
      path: '/api/facilities/search',
      method: 'GET',
      description: 'Search for nursing facilities by name, CCN, city, or state',
      parameters: [
        { name: 'q', type: 'string', required: false, description: 'Search query (facility name, city, CCN)' },
        { name: 'state', type: 'string', required: false, description: 'Two-letter state code (e.g., CA, TX)' },
        { name: 'ccns', type: 'string', required: false, description: 'Comma-separated list of CCN numbers' },
        { name: 'limit', type: 'number', required: false, default: 20, description: 'Maximum results to return (max 100)' },
        { name: 'offset', type: 'number', required: false, default: 0, description: 'Offset for pagination' },
      ],
      response: {
        results: 'Array of facility objects',
        total: 'Total count of matching facilities',
      },
      example: '/api/facilities/search?q=sunrise&state=CA&limit=10',
    },
    {
      path: '/api/facilities/{providerId}',
      method: 'GET',
      description: 'Get detailed information about a specific facility',
      parameters: [
        { name: 'providerId', type: 'string', required: true, description: 'Federal Provider Number (CCN)' },
      ],
      response: {
        facility: 'Facility details including ratings, location, and compliance data',
        staffing: 'Staffing metrics including HPRD, turnover, and staff mix',
        qualityMeasures: 'Quality measure scores for short-stay and long-stay residents',
        healthInspections: 'Recent health inspection results and deficiencies',
        ratingHistory: 'Historical rating changes over time',
      },
      example: '/api/facilities/055743',
    },
    {
      path: '/api/competitors',
      method: 'GET',
      description: 'Get competitor analysis for a facility',
      parameters: [
        { name: 'ccn', type: 'string', required: false, description: 'CCN of target facility' },
        { name: 'state', type: 'string', required: false, description: 'State to analyze (if no CCN provided)' },
        { name: 'limit', type: 'number', required: false, default: 10, description: 'Number of competitors to return' },
      ],
      response: {
        targetFacility: 'Target facility details',
        competitors: 'Array of competitor facilities',
        stateAverages: 'State-wide average ratings',
        percentileRank: "Target facility's percentile rank in the state",
        comparisonMetrics: 'How target compares to state averages',
      },
      example: '/api/competitors?ccn=055743&limit=15',
    },
    {
      path: '/api/trends',
      method: 'GET',
      description: 'Get historical rating trends for a facility',
      parameters: [
        { name: 'ccn', type: 'string', required: true, description: 'CCN of facility' },
        { name: 'months', type: 'number', required: false, default: 24, description: 'Number of months of history' },
      ],
      response: {
        facility: 'Current facility details',
        history: 'Array of historical ratings by month',
        surveys: 'Recent survey results',
        trendDirection: 'Overall trend (improving, declining, stable)',
      },
      example: '/api/trends?ccn=055743&months=12',
    },
    {
      path: '/api/stats',
      method: 'GET',
      description: 'Get aggregate statistics',
      response: {
        totalFacilities: 'Total number of facilities in database',
        ratingDistribution: 'Count of facilities by star rating',
        stateStats: 'Statistics by state',
      },
    },
    {
      path: '/api/phil',
      method: 'POST',
      description: 'Ask 5 Star Phil AI assistant a question',
      body: {
        question: 'The question to ask (required)',
        facilityContext: 'Optional facility data for context',
      },
      response: {
        answer: "Phil's response",
        sources: 'Sources referenced',
      },
    },
    {
      path: '/api/auth/signup',
      method: 'POST',
      description: 'Create a new user account',
      body: {
        email: 'User email address',
        password: 'Password (min 6 characters)',
        name: 'Full name (optional)',
        company: 'Company name (optional)',
      },
      response: {
        success: 'Boolean',
        user: 'User object (without password)',
      },
    },
    {
      path: '/api/auth/login',
      method: 'POST',
      description: 'Authenticate a user',
      body: {
        email: 'User email address',
        password: 'User password',
      },
      response: {
        success: 'Boolean',
        user: 'User object',
      },
    },
    {
      path: '/api/scenarios',
      method: 'GET',
      description: 'Get saved Tinker Star scenarios for a user',
      parameters: [
        { name: 'userId', type: 'number', required: true, description: 'User ID' },
      ],
      response: {
        scenarios: 'Array of saved scenarios',
      },
    },
    {
      path: '/api/scenarios',
      method: 'POST',
      description: 'Save a new Tinker Star scenario',
      body: {
        userId: 'User ID',
        facilityCcn: 'Facility CCN',
        facilityName: 'Facility name',
        scenarioName: 'Name for this scenario',
        scenarioData: 'Scenario settings object',
        predictedRatings: 'Predicted ratings object',
      },
    },
    {
      path: '/api/favorites',
      method: 'GET',
      description: 'Get user favorite facilities',
      parameters: [
        { name: 'userId', type: 'number', required: true, description: 'User ID' },
      ],
    },
    {
      path: '/api/favorites',
      method: 'POST',
      description: 'Add a facility to favorites',
      body: {
        userId: 'User ID',
        facilityCcn: 'Facility CCN',
        facilityName: 'Facility name',
      },
    },
    {
      path: '/api/share',
      method: 'POST',
      description: 'Create a shareable report link',
      body: {
        userId: 'User ID',
        reportType: 'Type of report',
        reportData: 'Report data object',
        expiresInHours: 'Expiration time (default 168 hours)',
      },
      response: {
        shareToken: 'Unique share token',
        shareUrl: 'Full shareable URL',
        expiresAt: 'Expiration timestamp',
      },
    },
  ],
  dataModels: {
    Facility: {
      federalProviderNumber: 'string - Unique facility identifier (CCN)',
      providerName: 'string - Facility name',
      cityTown: 'string - City',
      state: 'string - Two-letter state code',
      zipCode: 'string - ZIP code',
      overallRating: 'number - Overall 5-star rating (1-5)',
      healthInspectionRating: 'number - Health inspection rating (1-5)',
      staffingRating: 'number - Staffing rating (1-5)',
      qualityMeasureRating: 'number - Quality measure rating (1-5)',
      numberOfCertifiedBeds: 'number - Bed count',
      numberOfResidents: 'number - Current resident count',
      ownership: 'string - Ownership type',
    },
    Staffing: {
      totalNurseHPRD: 'number - Total nursing hours per resident day',
      rnHPRD: 'number - RN hours per resident day',
      lpnHPRD: 'number - LPN hours per resident day',
      cnaHPRD: 'number - CNA hours per resident day',
      totalNurseTurnover: 'number - Annual nurse turnover percentage',
      rnTurnover: 'number - RN turnover percentage',
    },
    QualityMeasure: {
      measureCode: 'string - CMS measure identifier',
      measureDescription: 'string - Description of the measure',
      score: 'number - Facility score',
      nationalAverage: 'number - National average for comparison',
      stateAverage: 'number - State average for comparison',
    },
  },
  rateLimit: {
    requests: 100,
    period: '1 minute',
    note: 'Excessive requests may be throttled',
  },
  support: {
    website: 'https://my5starreport.com',
    email: 'support@my5starreport.com',
  },
};

export async function GET() {
  return NextResponse.json(apiDocumentation);
}
