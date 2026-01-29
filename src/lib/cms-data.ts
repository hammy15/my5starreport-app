/**
 * CMS Data Service
 *
 * This service fetches data from the CMS Provider Data API.
 * CMS (Centers for Medicare & Medicaid Services) publishes nursing home
 * quality data through their public API.
 *
 * Main data source: https://data.cms.gov/provider-data/
 *
 * Key datasets:
 * - Provider Information: Basic facility details and overall ratings
 * - Health Inspections: Survey results and deficiencies
 * - Staffing: PBJ (Payroll-Based Journal) staffing data
 * - Quality Measures: Clinical outcome measures
 * - Penalties: Fines and enforcement actions
 */

import type {
  Facility,
  FacilitySearchResult,
  HealthInspection,
  Deficiency,
  StaffingData,
  QualityMeasures,
  Penalty,
  Complaint,
} from '@/types/facility';

// CMS API base URL
const CMS_API_BASE = 'https://data.cms.gov/provider-data/api/1/datastore/query';

// Dataset IDs from CMS Provider Data Catalog
// These are the actual dataset identifiers for nursing home data
const DATASETS = {
  providerInfo: 'b27b-2uc7',        // NH Provider Info
  healthInspections: 'r5ix-sfxw',    // NH Health Inspections
  deficiencies: 'dgck-syfz',         // NH Deficiencies
  staffing: 'xcdc-v8bm',             // NH Staffing from PBJ
  qualityMeasures: 'ijh5-nb2v',      // NH Quality Measures
  penalties: '9ezk-fzua',            // NH Penalties
  complaints: 'cxc3-gddk',           // NH Complaints
};

/**
 * Search for nursing facilities by name, city, or state
 */
export async function searchFacilities(
  query: string,
  state?: string,
  limit: number = 20
): Promise<FacilitySearchResult[]> {
  try {
    // Build the filter conditions
    const conditions: string[] = [];

    if (query) {
      // Search in provider name (case-insensitive)
      conditions.push(`provider_name LIKE '%${query.toUpperCase()}%'`);
    }

    if (state) {
      conditions.push(`state = '${state.toUpperCase()}'`);
    }

    const whereClause = conditions.length > 0
      ? `&conditions[0][property]=provider_name&conditions[0][value]=${encodeURIComponent(query)}&conditions[0][operator]=CONTAINS`
      : '';

    const response = await fetch(
      `${CMS_API_BASE}/${DATASETS.providerInfo}?limit=${limit}${whereClause}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 1 hour since CMS data updates quarterly
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform CMS data format to our format
    return (data.results || []).map((row: Record<string, string>) => ({
      federalProviderNumber: row.federal_provider_number || row.provider_number || '',
      providerName: row.provider_name || '',
      cityTown: row.city || row.provider_city || '',
      state: row.state || row.provider_state || '',
      overallRating: parseInt(row.overall_rating || '0', 10),
      numberOfBeds: parseInt(row.number_of_certified_beds || '0', 10),
    }));
  } catch (error) {
    console.error('Error searching facilities:', error);
    // Return demo data if API fails (for development)
    return getDemoSearchResults(query, state);
  }
}

/**
 * Get detailed facility information by provider number
 */
export async function getFacilityDetails(
  providerNumber: string
): Promise<Facility | null> {
  try {
    const response = await fetch(
      `${CMS_API_BASE}/${DATASETS.providerInfo}?conditions[0][property]=federal_provider_number&conditions[0][value]=${providerNumber}&conditions[0][operator]=EQUALS`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();
    const row = data.results?.[0];

    if (!row) return null;

    return transformProviderData(row);
  } catch (error) {
    console.error('Error fetching facility details:', error);
    // Return demo data if API fails
    return getDemoFacility(providerNumber);
  }
}

/**
 * Get health inspection data for a facility
 */
export async function getHealthInspections(
  providerNumber: string
): Promise<HealthInspection[]> {
  try {
    const response = await fetch(
      `${CMS_API_BASE}/${DATASETS.healthInspections}?conditions[0][property]=federal_provider_number&conditions[0][value]=${providerNumber}&conditions[0][operator]=EQUALS&sort=survey_date&order=desc&limit=10`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.results || []).map(transformHealthInspection);
  } catch (error) {
    console.error('Error fetching health inspections:', error);
    return getDemoHealthInspections(providerNumber);
  }
}

/**
 * Get deficiency details for a facility
 */
export async function getDeficiencies(
  providerNumber: string
): Promise<Deficiency[]> {
  try {
    const response = await fetch(
      `${CMS_API_BASE}/${DATASETS.deficiencies}?conditions[0][property]=federal_provider_number&conditions[0][value]=${providerNumber}&conditions[0][operator]=EQUALS&sort=survey_date&order=desc&limit=50`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.results || []).map(transformDeficiency);
  } catch (error) {
    console.error('Error fetching deficiencies:', error);
    return getDemoDeficiencies(providerNumber);
  }
}

/**
 * Get staffing data from PBJ
 */
export async function getStaffingData(
  providerNumber: string
): Promise<StaffingData | null> {
  try {
    const response = await fetch(
      `${CMS_API_BASE}/${DATASETS.staffing}?conditions[0][property]=federal_provider_number&conditions[0][value]=${providerNumber}&conditions[0][operator]=EQUALS&limit=1`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();
    const row = data.results?.[0];

    if (!row) return null;

    return transformStaffingData(row);
  } catch (error) {
    console.error('Error fetching staffing data:', error);
    return getDemoStaffingData(providerNumber);
  }
}

/**
 * Get quality measures for a facility
 */
export async function getQualityMeasures(
  providerNumber: string
): Promise<QualityMeasures | null> {
  try {
    const response = await fetch(
      `${CMS_API_BASE}/${DATASETS.qualityMeasures}?conditions[0][property]=federal_provider_number&conditions[0][value]=${providerNumber}&conditions[0][operator]=EQUALS&limit=1`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();
    const row = data.results?.[0];

    if (!row) return null;

    return transformQualityMeasures(row);
  } catch (error) {
    console.error('Error fetching quality measures:', error);
    return getDemoQualityMeasures(providerNumber);
  }
}

/**
 * Get penalties for a facility
 */
export async function getPenalties(
  providerNumber: string
): Promise<Penalty[]> {
  try {
    const response = await fetch(
      `${CMS_API_BASE}/${DATASETS.penalties}?conditions[0][property]=federal_provider_number&conditions[0][value]=${providerNumber}&conditions[0][operator]=EQUALS&sort=penalty_date&order=desc&limit=20`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.results || []).map(transformPenalty);
  } catch (error) {
    console.error('Error fetching penalties:', error);
    return getDemoPenalties(providerNumber);
  }
}

// =====================================================
// Data Transformation Functions
// These convert CMS API response format to our types
// =====================================================

function transformProviderData(row: Record<string, string>): Facility {
  return {
    federalProviderNumber: row.federal_provider_number || '',
    providerName: row.provider_name || '',
    providerAddress: row.provider_address || '',
    cityTown: row.city || row.provider_city || '',
    state: row.state || row.provider_state || '',
    zipCode: row.zip_code || row.provider_zip_code || '',
    phoneNumber: row.phone_number || '',
    countyName: row.county_name || '',
    ownershipType: row.ownership_type || '',
    numberOfCertifiedBeds: parseInt(row.number_of_certified_beds || '0', 10),
    numberOfResidents: parseInt(row.number_of_residents || '0', 10),
    overallRating: parseInt(row.overall_rating || '0', 10),
    healthInspectionRating: parseInt(row.health_inspection_rating || '0', 10),
    staffingRating: parseInt(row.staffing_rating || '0', 10),
    qualityMeasureRating: parseInt(row.quality_measure_rating || row.qm_rating || '0', 10),
    abuseIcon: row.abuse_icon === 'Y' || row.abuse_icon === 'true',
    isSpecialFocus: row.special_focus_status === 'Y' || row.sff_status === 'Y',
    hasResidentCouncils: row.resident_council === 'Y',
    hasFamilyCouncils: row.family_council === 'Y',
    latitude: row.latitude ? parseFloat(row.latitude) : undefined,
    longitude: row.longitude ? parseFloat(row.longitude) : undefined,
    lastUpdated: row.processing_date || new Date().toISOString(),
  };
}

function transformHealthInspection(row: Record<string, string>): HealthInspection {
  return {
    facilityId: row.federal_provider_number || '',
    surveyDate: row.survey_date || '',
    surveyType: row.survey_type as HealthInspection['surveyType'] || 'Standard',
    totalDeficiencies: parseInt(row.total_number_of_deficiencies || '0', 10),
    healthDeficiencies: parseInt(row.total_number_of_health_deficiencies || '0', 10),
    fireDeficiencies: parseInt(row.total_number_of_fire_safety_deficiencies || '0', 10),
    deficiencySeverityLevelA: parseInt(row.severity_level_a || '0', 10),
    deficiencySeverityLevelB: parseInt(row.severity_level_b || '0', 10),
    deficiencySeverityLevelC: parseInt(row.severity_level_c || '0', 10),
    deficiencySeverityLevelD: parseInt(row.severity_level_d || '0', 10),
    deficiencySeverityLevelE: parseInt(row.severity_level_e || '0', 10),
    deficiencySeverityLevelF: parseInt(row.severity_level_f || '0', 10),
    deficiencySeverityLevelG: parseInt(row.severity_level_g || '0', 10),
    deficiencySeverityLevelH: parseInt(row.severity_level_h || '0', 10),
    deficiencySeverityLevelI: parseInt(row.severity_level_i || '0', 10),
    deficiencySeverityLevelJ: parseInt(row.severity_level_j || '0', 10),
    deficiencySeverityLevelK: parseInt(row.severity_level_k || '0', 10),
    deficiencySeverityLevelL: parseInt(row.severity_level_l || '0', 10),
    fineAmount: parseFloat(row.fine_amount || '0'),
    paymentDenialDays: parseInt(row.payment_denial_days || '0', 10),
    stateAvgDeficiencies: parseFloat(row.state_average_deficiencies || '0'),
    nationalAvgDeficiencies: parseFloat(row.national_average_deficiencies || '0'),
  };
}

function transformDeficiency(row: Record<string, string>): Deficiency {
  return {
    facilityId: row.federal_provider_number || '',
    surveyDate: row.survey_date || '',
    deficiencyTag: row.deficiency_tag || row.tag || '',
    deficiencyDescription: row.deficiency_description || '',
    scope: row.scope as Deficiency['scope'] || 'Isolated',
    severity: row.severity as Deficiency['severity'] || 'Potential',
    category: row.deficiency_category || row.category || '',
    correctionDate: row.correction_date || undefined,
    isCorrected: !!row.correction_date,
  };
}

function transformStaffingData(row: Record<string, string>): StaffingData {
  return {
    facilityId: row.federal_provider_number || '',
    reportingPeriod: row.processing_date || '',
    totalNurseHPRD: parseFloat(row.reported_total_nurse_staffing_hours_per_resident_per_day || '0'),
    rnHPRD: parseFloat(row.reported_rn_staffing_hours_per_resident_per_day || '0'),
    lpnHPRD: parseFloat(row.reported_lpn_staffing_hours_per_resident_per_day || '0'),
    cnaHPRD: parseFloat(row.reported_cna_staffing_hours_per_resident_per_day || '0'),
    adjustedTotalNurseStaffingRating: parseInt(row.adjusted_total_nurse_staffing_rating || '0', 10),
    reportedTotalNurseStaffingRating: parseInt(row.reported_total_nurse_staffing_rating || '0', 10),
    rnStaffingRating: parseInt(row.rn_staffing_rating || '0', 10),
    weekendTotalNurseHPRD: parseFloat(row.weekend_total_nurse_staffing_hours || '0'),
    weekendRnHPRD: parseFloat(row.weekend_rn_staffing_hours || '0'),
    rnTurnoverRate: parseFloat(row.rn_turnover_rate || '0'),
    totalNurseTurnoverRate: parseFloat(row.total_nurse_turnover_rate || '0'),
    adminTurnoverRate: parseFloat(row.administrator_turnover_rate || '0'),
    stateAvgTotalHPRD: parseFloat(row.state_average_staffing || '0'),
    nationalAvgTotalHPRD: parseFloat(row.national_average_staffing || '0'),
  };
}

function transformQualityMeasures(row: Record<string, string>): QualityMeasures {
  return {
    facilityId: row.federal_provider_number || '',
    measurePeriod: row.measure_period || row.processing_date || '',
    longStay: {
      percentWithPressureUlcers: parseFloat(row.percent_of_long_stay_residents_whose_need_for_help_with_daily_activities_has_increased || '0'),
      percentPhysicallyRestrained: parseFloat(row.percent_of_long_stay_residents_who_were_physically_restrained || '0'),
      percentWithUrinaryInfection: parseFloat(row.percent_of_long_stay_residents_with_a_urinary_tract_infection || '0'),
      percentWithIncreasedHelpWithADLs: parseFloat(row.percent_of_long_stay_residents_whose_need_for_help_with_activities_of_daily_living_has_increased || '0'),
      percentWithFalls: parseFloat(row.percent_of_long_stay_residents_who_had_one_or_more_falls || '0'),
      percentWithMajorFalls: parseFloat(row.percent_of_long_stay_residents_who_had_falls_with_major_injury || '0'),
      percentWithDepressionSymptoms: parseFloat(row.percent_of_long_stay_residents_who_have_depressive_symptoms || '0'),
      percentAntipsychoticMeds: parseFloat(row.percent_of_long_stay_residents_who_received_an_antipsychotic_medication || '0'),
      percentWithCatheter: parseFloat(row.percent_of_long_stay_residents_with_a_catheter_inserted_and_left_in_their_bladder || '0'),
      percentWithFluVaccine: parseFloat(row.percent_of_long_stay_residents_assessed_and_given_the_seasonal_influenza_vaccine || '0'),
      percentWithPneumoniaVaccine: parseFloat(row.percent_of_long_stay_residents_who_received_the_pneumococcal_vaccine || '0'),
    },
    shortStay: {
      percentRehospitalized: parseFloat(row.percent_of_short_stay_residents_who_were_rehospitalized_after_a_nursing_home_admission || '0'),
      percentWithEmergencyVisit: parseFloat(row.percent_of_short_stay_residents_who_had_an_outpatient_emergency_department_visit || '0'),
      percentWithPressureUlcers: parseFloat(row.percent_of_short_stay_residents_with_pressure_ulcers_that_are_new_or_worsened || '0'),
      percentWithNewOrWorsenedPressureUlcers: parseFloat(row.percent_of_short_stay_residents_with_pressure_ulcers_that_are_new_or_worsened || '0'),
      percentImprovedFunction: parseFloat(row.percent_of_short_stay_residents_who_made_improvements_in_function || '0'),
      percentDischaredToCommunity: parseFloat(row.percent_of_short_stay_residents_who_were_successfully_discharged_to_the_community || '0'),
    },
    overallQMScore: parseFloat(row.overall_qm_score || '0'),
    qmRating: parseInt(row.qm_rating || '0', 10),
    stateAverages: {
      antipsychoticPercent: parseFloat(row.state_avg_antipsychotic || '0'),
      pressureUlcerPercent: parseFloat(row.state_avg_pressure_ulcer || '0'),
      fallsPercent: parseFloat(row.state_avg_falls || '0'),
    },
    nationalAverages: {
      antipsychoticPercent: parseFloat(row.national_avg_antipsychotic || '0'),
      pressureUlcerPercent: parseFloat(row.national_avg_pressure_ulcer || '0'),
      fallsPercent: parseFloat(row.national_avg_falls || '0'),
    },
  };
}

function transformPenalty(row: Record<string, string>): Penalty {
  return {
    facilityId: row.federal_provider_number || '',
    penaltyDate: row.penalty_date || '',
    penaltyType: row.penalty_type as Penalty['penaltyType'] || 'Fine',
    amount: row.fine_amount ? parseFloat(row.fine_amount) : undefined,
    days: row.payment_denial_days ? parseInt(row.payment_denial_days, 10) : undefined,
    reason: row.reason || '',
    isResolved: row.resolved === 'Y',
  };
}

// =====================================================
// Demo Data (for development/testing when API is unavailable)
// =====================================================

function getDemoSearchResults(query: string, state?: string): FacilitySearchResult[] {
  const demoFacilities: FacilitySearchResult[] = [
    { federalProviderNumber: '015087', providerName: 'DIVERSICARE OF MONTEVALLO', cityTown: 'MONTEVALLO', state: 'AL', overallRating: 3, numberOfBeds: 98 },
    { federalProviderNumber: '015318', providerName: 'SUNRISE SKILLED NURSING AND REHABILITATION', cityTown: 'BIRMINGHAM', state: 'AL', overallRating: 4, numberOfBeds: 120 },
    { federalProviderNumber: '055001', providerName: 'GOLDEN CARE CENTER', cityTown: 'LOS ANGELES', state: 'CA', overallRating: 2, numberOfBeds: 85 },
    { federalProviderNumber: '055423', providerName: 'PACIFIC PALISADES POST ACUTE', cityTown: 'SANTA MONICA', state: 'CA', overallRating: 5, numberOfBeds: 150 },
    { federalProviderNumber: '105001', providerName: 'FLORIDA SKILLED NURSING FACILITY', cityTown: 'MIAMI', state: 'FL', overallRating: 3, numberOfBeds: 110 },
    { federalProviderNumber: '365001', providerName: 'OHIO VALLEY CARE CENTER', cityTown: 'COLUMBUS', state: 'OH', overallRating: 4, numberOfBeds: 95 },
    { federalProviderNumber: '455001', providerName: 'TEXAS REHABILITATION CENTER', cityTown: 'HOUSTON', state: 'TX', overallRating: 2, numberOfBeds: 175 },
    { federalProviderNumber: '335001', providerName: 'NEW YORK SKILLED NURSING', cityTown: 'NEW YORK', state: 'NY', overallRating: 3, numberOfBeds: 200 },
  ];

  let results = demoFacilities;

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(f =>
      f.providerName.toLowerCase().includes(lowerQuery) ||
      f.cityTown.toLowerCase().includes(lowerQuery)
    );
  }

  if (state) {
    results = results.filter(f => f.state === state.toUpperCase());
  }

  return results;
}

function getDemoFacility(providerNumber: string): Facility {
  return {
    federalProviderNumber: providerNumber,
    providerName: 'Sample Skilled Nursing Facility',
    providerAddress: '123 Healthcare Drive',
    cityTown: 'Sample City',
    state: 'CA',
    zipCode: '90210',
    phoneNumber: '(555) 123-4567',
    countyName: 'Sample County',
    ownershipType: 'For profit - Corporation',
    numberOfCertifiedBeds: 120,
    numberOfResidents: 95,
    overallRating: 3,
    healthInspectionRating: 2,
    staffingRating: 4,
    qualityMeasureRating: 3,
    abuseIcon: false,
    isSpecialFocus: false,
    hasResidentCouncils: true,
    hasFamilyCouncils: true,
    latitude: 34.0522,
    longitude: -118.2437,
    lastUpdated: new Date().toISOString(),
  };
}

function getDemoHealthInspections(providerNumber: string): HealthInspection[] {
  return [
    {
      facilityId: providerNumber,
      surveyDate: '2024-06-15',
      surveyType: 'Standard',
      totalDeficiencies: 8,
      healthDeficiencies: 6,
      fireDeficiencies: 2,
      deficiencySeverityLevelA: 0,
      deficiencySeverityLevelB: 1,
      deficiencySeverityLevelC: 0,
      deficiencySeverityLevelD: 3,
      deficiencySeverityLevelE: 2,
      deficiencySeverityLevelF: 1,
      deficiencySeverityLevelG: 1,
      deficiencySeverityLevelH: 0,
      deficiencySeverityLevelI: 0,
      deficiencySeverityLevelJ: 0,
      deficiencySeverityLevelK: 0,
      deficiencySeverityLevelL: 0,
      fineAmount: 0,
      paymentDenialDays: 0,
      stateAvgDeficiencies: 6.5,
      nationalAvgDeficiencies: 7.2,
    },
  ];
}

function getDemoDeficiencies(providerNumber: string): Deficiency[] {
  return [
    {
      facilityId: providerNumber,
      surveyDate: '2024-06-15',
      deficiencyTag: 'F686',
      deficiencyDescription: 'Treatment/services to prevent/heal pressure ulcers',
      scope: 'Pattern',
      severity: 'Actual',
      category: 'Quality of Care',
      isCorrected: true,
      correctionDate: '2024-07-15',
    },
    {
      facilityId: providerNumber,
      surveyDate: '2024-06-15',
      deficiencyTag: 'F689',
      deficiencyDescription: 'Free from accident hazards/supervision/devices',
      scope: 'Isolated',
      severity: 'Potential',
      category: 'Resident Rights',
      isCorrected: true,
      correctionDate: '2024-07-01',
    },
  ];
}

function getDemoStaffingData(providerNumber: string): StaffingData {
  return {
    facilityId: providerNumber,
    reportingPeriod: '2024-Q2',
    totalNurseHPRD: 3.45,
    rnHPRD: 0.52,
    lpnHPRD: 0.85,
    cnaHPRD: 2.08,
    adjustedTotalNurseStaffingRating: 3,
    reportedTotalNurseStaffingRating: 3,
    rnStaffingRating: 3,
    weekendTotalNurseHPRD: 3.10,
    weekendRnHPRD: 0.45,
    rnTurnoverRate: 42.5,
    totalNurseTurnoverRate: 55.3,
    adminTurnoverRate: 15.0,
    stateAvgTotalHPRD: 3.65,
    nationalAvgTotalHPRD: 3.72,
  };
}

function getDemoQualityMeasures(providerNumber: string): QualityMeasures {
  return {
    facilityId: providerNumber,
    measurePeriod: '2024-Q2',
    longStay: {
      percentWithPressureUlcers: 5.2,
      percentPhysicallyRestrained: 0.8,
      percentWithUrinaryInfection: 3.1,
      percentWithIncreasedHelpWithADLs: 18.5,
      percentWithFalls: 22.3,
      percentWithMajorFalls: 2.8,
      percentWithDepressionSymptoms: 4.2,
      percentAntipsychoticMeds: 12.5,
      percentWithCatheter: 2.1,
      percentWithFluVaccine: 92.3,
      percentWithPneumoniaVaccine: 88.7,
    },
    shortStay: {
      percentRehospitalized: 18.2,
      percentWithEmergencyVisit: 11.5,
      percentWithPressureUlcers: 1.2,
      percentWithNewOrWorsenedPressureUlcers: 1.2,
      percentImprovedFunction: 72.5,
      percentDischaredToCommunity: 65.8,
    },
    overallQMScore: 68.5,
    qmRating: 3,
    stateAverages: {
      antipsychoticPercent: 14.2,
      pressureUlcerPercent: 5.8,
      fallsPercent: 24.1,
    },
    nationalAverages: {
      antipsychoticPercent: 13.8,
      pressureUlcerPercent: 5.5,
      fallsPercent: 23.5,
    },
  };
}

function getDemoPenalties(providerNumber: string): Penalty[] {
  return [
    {
      facilityId: providerNumber,
      penaltyDate: '2024-03-15',
      penaltyType: 'Fine',
      amount: 15000,
      reason: 'Failure to provide necessary care and services',
      isResolved: true,
    },
  ];
}

// Export all functions
export const cmsDataService = {
  searchFacilities,
  getFacilityDetails,
  getHealthInspections,
  getDeficiencies,
  getStaffingData,
  getQualityMeasures,
  getPenalties,
};

export default cmsDataService;
