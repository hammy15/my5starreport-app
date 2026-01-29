/**
 * Database Connection for my5starreport.com
 *
 * Connects to snfinfo database which contains all US SNF data:
 * - 14,732 facilities
 * - 309,141 quality measures
 * - 617,525 health citations
 * - 19,158 penalties
 * - 44,003 surveys
 */

import { neon } from '@neondatabase/serverless';

// Database connection string - snfinfo database
const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_6AGgKOxEZrd2@ep-plain-scene-ahq6yul9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Create Neon SQL client
export const sql = neon(DATABASE_URL);

/**
 * Search facilities in the database
 */
export async function searchFacilitiesDB(query: string, state?: string, limit = 50) {
  let whereConditions = [];

  if (query) {
    whereConditions.push(`(LOWER(name) LIKE LOWER('%${query}%') OR LOWER(city) LIKE LOWER('%${query}%'))`);
  }

  if (state) {
    whereConditions.push(`state = '${state.toUpperCase()}'`);
  }

  const whereClause = whereConditions.length > 0
    ? `WHERE ${whereConditions.join(' AND ')}`
    : '';

  const results = await sql`
    SELECT
      ccn as "federalProviderNumber",
      name as "providerName",
      city as "cityTown",
      state,
      "overallRating",
      beds as "numberOfBeds"
    FROM "Facility"
    ${sql.unsafe(whereClause)}
    ORDER BY name
    LIMIT ${limit}
  `;

  return results;
}

// Type for facility database result
interface FacilityDBResult {
  internalId: string;
  federalProviderNumber: string;
  providerName: string;
  providerAddress: string;
  cityTown: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  countyName: string;
  ownershipType: string;
  numberOfCertifiedBeds: number;
  numberOfResidents: number;
  overallRating: number;
  healthInspectionRating: number;
  staffingRating: number;
  qualityMeasureRating: number;
  sffStatus: string | null;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  totalNurseHPRD: number;
  rnHPRD: number;
  cnaHPRD: number;
  totalFines: number;
  penaltyCount: number;
  lastSurveyDate: string;
  complaintCount: number;
}

/**
 * Get facility by CCN (provider number)
 */
export async function getFacilityByProviderNumber(providerNumber: string) {
  try {
    const results = await sql`
      SELECT
        id as "internalId",
        ccn as "federalProviderNumber",
        name as "providerName",
        address as "providerAddress",
        city as "cityTown",
        state,
        "zipCode",
        phone as "phoneNumber",
        county as "countyName",
        "ownershipType",
        beds as "numberOfCertifiedBeds",
        beds as "numberOfResidents",
        "overallRating",
        "healthRating" as "healthInspectionRating",
        "staffingRating",
        "qmRating" as "qualityMeasureRating",
        "sffStatus",
        latitude,
        longitude,
        "cmsLastUpdated" as "lastUpdated",
        "nursingHoursPerResidentDay" as "totalNurseHPRD",
        "rnHoursPerResidentDay" as "rnHPRD",
        "cnaHoursPerResidentDay" as "cnaHPRD",
        "totalFines",
        "penaltyCount",
        "lastSurveyDate",
        "complaintCount"
      FROM "Facility"
      WHERE ccn = ${providerNumber}
      LIMIT 1
    `;

    if (!results[0]) return null;

    // Transform result with proper typing
    const facility = results[0] as FacilityDBResult;
    return {
      ...facility,
      isSpecialFocus: facility.sffStatus === 'SFF',
      abuseIcon: false,
    };
  } catch (error) {
    console.error('getFacilityByProviderNumber error:', error);
    throw error;
  }
}

/**
 * Get quality measures for a facility
 */
export async function getQualityMeasuresDB(facilityId: string) {
  const results = await sql`
    SELECT
      "measureCode",
      "measureDescription",
      "residentType",
      "averageScore",
      "q1Score",
      "q2Score",
      "q3Score",
      "q4Score",
      "usedInRating",
      "measurePeriod"
    FROM "QualityMeasure"
    WHERE "facilityId" = ${facilityId}
    ORDER BY "residentType", "measureCode"
  `;

  return results;
}

/**
 * Get health citations for a facility
 */
export async function getHealthCitationsDB(facilityId: string) {
  const results = await sql`
    SELECT
      "surveyDate",
      "surveyType",
      "deficiencyTag" as tag,
      "deficiencyCategory" as category,
      "scopeSeverity",
      "deficiencyDescription" as description,
      "correctionDate",
      "corrected"
    FROM "HealthCitation"
    WHERE "facilityId" = ${facilityId}
    ORDER BY "surveyDate" DESC
    LIMIT 100
  `;

  return results;
}

/**
 * Get penalties for a facility
 */
export async function getPenaltiesDB(facilityId: string) {
  const results = await sql`
    SELECT
      "penaltyDate",
      "penaltyType",
      "fineAmount" as amount,
      "paymentDenialDays",
      "paymentDenialStart"
    FROM "Penalty"
    WHERE "facilityId" = ${facilityId}
    ORDER BY "penaltyDate" DESC
    LIMIT 50
  `;

  return results;
}

/**
 * Get survey history for a facility
 */
export async function getSurveyHistoryDB(facilityId: string) {
  const results = await sql`
    SELECT
      "surveyDate",
      "surveyType",
      "deficiencies" as "totalDeficiencies",
      "deficiencies" as "healthDeficiencies",
      0 as "fireDeficiencies",
      "severity"
    FROM "SurveyHistory"
    WHERE "facilityId" = ${facilityId}
    ORDER BY "surveyDate" DESC
    LIMIT 20
  `;

  return results;
}

/**
 * Get rating history for a facility
 */
export async function getRatingHistoryDB(facilityId: string) {
  const results = await sql`
    SELECT
      "recordDate" as "ratingDate",
      "overallRating",
      "healthRating",
      "staffingRating",
      "qmRating"
    FROM "RatingHistory"
    WHERE "facilityId" = ${facilityId}
    ORDER BY "recordDate" DESC
    LIMIT 24
  `;

  return results;
}

/**
 * Get training resources
 */
export async function getTrainingResources(category?: string) {
  // Training resources are in the my5starreport database
  // For now, return static data
  const resources = [
    { id: '1', category: 'staffing', title: 'Understanding HPRD Calculations', description: 'Learn how CMS calculates Hours Per Resident Day', content_type: 'video', duration_minutes: 15, difficulty_level: 'beginner' },
    { id: '2', category: 'staffing', title: 'PBJ Reporting Best Practices', description: 'Ensure accurate Payroll-Based Journal submissions', content_type: 'guide', duration_minutes: 20, difficulty_level: 'intermediate' },
    { id: '3', category: 'staffing', title: 'Reducing Staff Turnover', description: 'Strategies to improve nurse retention', content_type: 'course', duration_minutes: 45, difficulty_level: 'intermediate' },
    { id: '4', category: 'quality_measures', title: 'Antipsychotic Reduction Program', description: 'Implement non-pharmacological interventions', content_type: 'course', duration_minutes: 60, difficulty_level: 'advanced' },
    { id: '5', category: 'quality_measures', title: 'Pressure Ulcer Prevention', description: 'Comprehensive skin care training', content_type: 'course', duration_minutes: 45, difficulty_level: 'intermediate' },
    { id: '6', category: 'quality_measures', title: 'Fall Prevention Best Practices', description: 'Evidence-based fall reduction strategies', content_type: 'video', duration_minutes: 30, difficulty_level: 'beginner' },
    { id: '7', category: 'health_inspection', title: 'Survey Readiness Checklist', description: 'Prepare for state surveys', content_type: 'checklist', duration_minutes: 15, difficulty_level: 'beginner' },
    { id: '8', category: 'health_inspection', title: 'Understanding F-Tags', description: 'Deep dive into common deficiency tags', content_type: 'guide', duration_minutes: 30, difficulty_level: 'intermediate' },
    { id: '9', category: 'health_inspection', title: 'Mock Survey Training', description: 'Conduct effective internal mock surveys', content_type: 'course', duration_minutes: 60, difficulty_level: 'advanced' },
    { id: '10', category: 'general', title: '5-Star Rating System Overview', description: 'Complete introduction to CMS ratings', content_type: 'video', duration_minutes: 20, difficulty_level: 'beginner' },
    { id: '11', category: 'general', title: 'QAPI Program Implementation', description: 'Build an effective QAPI program', content_type: 'course', duration_minutes: 90, difficulty_level: 'advanced' },
  ];

  if (category) {
    return resources.filter(r => r.category === category);
  }

  return resources;
}

/**
 * Get facility count by state
 */
export async function getFacilityCountByState() {
  const results = await sql`
    SELECT state, COUNT(*) as count
    FROM "Facility"
    GROUP BY state
    ORDER BY count DESC
  `;

  return results;
}

/**
 * Get facilities with low ratings (for improvement focus)
 */
export async function getLowRatedFacilities(state?: string, limit = 100) {
  const stateFilter = state ? sql`AND state = ${state}` : sql``;

  const results = await sql`
    SELECT
      ccn as "federalProviderNumber",
      name as "providerName",
      city as "cityTown",
      state,
      "overallRating",
      "healthRating",
      "staffingRating",
      "qmRating",
      beds
    FROM "Facility"
    WHERE "overallRating" <= 2
    ${stateFilter}
    ORDER BY "overallRating", name
    LIMIT ${limit}
  `;

  return results;
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM "Facility") as facilities,
      (SELECT COUNT(*) FROM "QualityMeasure") as quality_measures,
      (SELECT COUNT(*) FROM "HealthCitation") as health_citations,
      (SELECT COUNT(*) FROM "Penalty") as penalties,
      (SELECT COUNT(*) FROM "SurveyHistory") as surveys
  `;

  return stats[0];
}

export default sql;
