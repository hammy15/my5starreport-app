/**
 * Types for CMS Nursing Home Data
 *
 * The 5-Star Rating System has three main components:
 * 1. Health Inspections - Based on state survey findings
 * 2. Staffing - Based on Payroll-Based Journal (PBJ) data
 * 3. Quality Measures - Based on clinical outcomes
 */

// Main facility information from CMS Provider Info
export interface Facility {
  // Unique identifier from CMS
  federalProviderNumber: string;
  providerName: string;
  providerAddress: string;
  cityTown: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  countyName: string;

  // Ownership info
  ownershipType: string;
  numberOfCertifiedBeds: number;
  numberOfResidents: number;

  // Overall ratings (1-5 stars)
  overallRating: number;
  healthInspectionRating: number;
  staffingRating: number;
  qualityMeasureRating: number;

  // Abuse icon (indicates potential issues)
  abuseIcon: boolean;

  // Special designations
  isSpecialFocus: boolean;
  hasResidentCouncils: boolean;
  hasFamilyCouncils: boolean;

  // Location coordinates (for mapping)
  latitude?: number;
  longitude?: number;

  // Last updated
  lastUpdated: string;

  // Penalty data
  totalFines?: number;
  penaltyCount?: number;
  lastSurveyDate?: string;
}

// Health Inspection Details
export interface HealthInspection {
  facilityId: string;

  // Survey information
  surveyDate: string;
  surveyType: 'Standard' | 'Complaint' | 'Revisit';

  // Deficiency counts by severity
  totalDeficiencies: number;
  healthDeficiencies: number;
  fireDeficiencies: number;

  // Deficiency severity breakdown
  deficiencySeverityLevelA: number; // Potential for minimal harm
  deficiencySeverityLevelB: number; // Isolated actual harm
  deficiencySeverityLevelC: number; // Pattern of actual harm
  deficiencySeverityLevelD: number; // Widespread actual harm
  deficiencySeverityLevelE: number; // Potential for more than minimal harm
  deficiencySeverityLevelF: number; // Widespread potential for more than minimal harm
  deficiencySeverityLevelG: number; // Isolated actual harm - not immediate jeopardy
  deficiencySeverityLevelH: number; // Pattern of actual harm - not immediate jeopardy
  deficiencySeverityLevelI: number; // Widespread actual harm - not immediate jeopardy
  deficiencySeverityLevelJ: number; // Isolated immediate jeopardy
  deficiencySeverityLevelK: number; // Pattern immediate jeopardy
  deficiencySeverityLevelL: number; // Widespread immediate jeopardy

  // Fines and penalties
  fineAmount: number;
  paymentDenialDays: number;

  // Comparison to state/national averages
  stateAvgDeficiencies: number;
  nationalAvgDeficiencies: number;
}

// Individual deficiency detail
export interface Deficiency {
  facilityId: string;
  surveyDate: string;
  deficiencyTag: string; // F-tag like "F686"
  deficiencyDescription: string;
  scope: 'Isolated' | 'Pattern' | 'Widespread';
  severity: 'Potential' | 'Actual' | 'Immediate Jeopardy';
  category: string;
  correctionDate?: string;
  isCorrected: boolean;
}

// Staffing data from PBJ (Payroll-Based Journal)
export interface StaffingData {
  facilityId: string;
  reportingPeriod: string;

  // Total hours per resident per day (HPRD)
  totalNurseHPRD: number;
  rnHPRD: number;
  lpnHPRD: number;
  cnaHPRD: number;

  // Staffing ratings
  adjustedTotalNurseStaffingRating: number; // Case-mix adjusted
  reportedTotalNurseStaffingRating: number;
  rnStaffingRating: number;

  // Weekend staffing (important metric)
  weekendTotalNurseHPRD: number;
  weekendRnHPRD: number;

  // Staff turnover (key quality indicator)
  rnTurnoverRate: number;
  totalNurseTurnoverRate: number;
  adminTurnoverRate: number;

  // Comparison to thresholds
  stateAvgTotalHPRD: number;
  nationalAvgTotalHPRD: number;

  // CMS staffing thresholds for ratings
  // 5-star: >= 4.09 total HPRD and >= 0.75 RN HPRD
  // 4-star: >= 3.88 total HPRD and >= 0.55 RN HPRD
  // 3-star: >= 3.35 total HPRD and >= 0.50 RN HPRD
  // 2-star: >= 2.82 total HPRD and >= 0.48 RN HPRD
  // 1-star: < 2.82 total HPRD or < 0.48 RN HPRD
}

// Quality Measures (QMs)
export interface QualityMeasures {
  facilityId: string;
  measurePeriod: string;

  // Long-stay measures (residents 100+ days)
  longStay: {
    // Higher is worse for these
    percentWithPressureUlcers: number;
    percentPhysicallyRestrained: number;
    percentWithUrinaryInfection: number;
    percentWithIncreasedHelpWithADLs: number;
    percentWithFalls: number;
    percentWithMajorFalls: number;
    percentWithDepressionSymptoms: number;
    percentAntipsychoticMeds: number; // Key measure - lower is better
    percentWithCatheter: number;

    // Lower is worse for these (higher is better)
    percentWithFluVaccine: number;
    percentWithPneumoniaVaccine: number;
  };

  // Short-stay measures (residents < 100 days, usually rehab)
  shortStay: {
    percentRehospitalized: number;
    percentWithEmergencyVisit: number;
    percentWithPressureUlcers: number;
    percentWithNewOrWorsenedPressureUlcers: number;
    percentImprovedFunction: number;
    percentDischaredToCommunity: number;
  };

  // Overall QM score (used for rating calculation)
  overallQMScore: number;
  qmRating: number;

  // Comparison
  stateAverages: {
    antipsychoticPercent: number;
    pressureUlcerPercent: number;
    fallsPercent: number;
  };
  nationalAverages: {
    antipsychoticPercent: number;
    pressureUlcerPercent: number;
    fallsPercent: number;
  };
}

// Penalty history
export interface Penalty {
  facilityId: string;
  penaltyDate: string;
  penaltyType: 'Fine' | 'Payment Denial' | 'State Monitor' | 'Directed Plan';
  amount?: number;
  days?: number;
  reason: string;
  isResolved: boolean;
}

// Complaint information
export interface Complaint {
  facilityId: string;
  complaintDate: string;
  complaintType: string;
  isSubstantiated: boolean;
  deficienciesFound: number;
  severity?: string;
}

// Improvement recommendation
export interface ImprovementRecommendation {
  id: string;
  category: 'health_inspection' | 'staffing' | 'quality_measures';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  estimatedImpact: number; // Potential star improvement
  estimatedCost: 'low' | 'medium' | 'high';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  actionSteps: string[];
}

// Action Plan (user-created)
export interface ActionPlan {
  id: string;
  facilityId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  targetRating: number;
  currentRating: number;
  status: 'draft' | 'active' | 'completed';
  items: ActionPlanItem[];
}

export interface ActionPlanItem {
  id: string;
  recommendationId: string;
  title: string;
  description: string;
  dueDate: string;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  notes: string;
  completedAt?: string;
}

// Search results
export interface FacilitySearchResult {
  federalProviderNumber: string;
  providerName: string;
  cityTown: string;
  state: string;
  overallRating: number;
  numberOfBeds: number;
}

// Full facility analysis combining all data
export interface FacilityAnalysis {
  facility: Facility;
  healthInspections: HealthInspection[];
  deficiencies: Deficiency[];
  staffing: StaffingData;
  qualityMeasures: QualityMeasures;
  penalties: Penalty[];
  complaints: Complaint[];
  recommendations: ImprovementRecommendation[];
}

// ==========================================
// RATE LETTER & COST REPORT TYPES
// ==========================================

// Medicaid Rate Letter Data
export interface MedicaidRateLetter {
  facilityId: string;
  effectiveDate: string;
  expirationDate: string;
  dailyPerDiemRate: number;
  ancillaryRate: number;
  therapyRate: number;
  nursingComponent: number;
  careComponent: number;
  capitalComponent: number;
  administrativeComponent: number;
  qualityIncentivePayment: number;
  specialCareFactor: number;
  acuityAdjustment: number;
  previousRate: number;
  percentChange: number;
  stateCode: string;
  rateType: 'Nursing Facility' | 'ICF/IID' | 'Specialized';
  payerMix: {
    medicaid: number;
    medicare: number;
    private: number;
    other: number;
  };
}

// Medicare PDPM/RUG Rate Data
export interface MedicareRate {
  facilityId: string;
  effectiveDate: string;
  pdpmBaseRate: number;
  nursingComponent: number;
  therapyComponent: number;
  nta: number;
  rugIVBaseRate: number;
  ptCmi: number;
  otCmi: number;
  slpCmi: number;
  nursingCmi: number;
  ntaCmi: number;
  paymentCategories: PDPMCategory[];
  maRates: MedicareAdvantageRate[];
}

export interface PDPMCategory {
  name: string;
  code: string;
  dailyRate: number;
  averageLOS: number;
  caseCount: number;
  totalPayments: number;
}

export interface MedicareAdvantageRate {
  payerName: string;
  dailyRate: number;
  effectiveDate: string;
  contractExpiration: string;
  paymentTerms: string;
}

// CMS-2540 Cost Report Data
export interface CostReport {
  facilityId: string;
  fiscalYearEnd: string;
  reportPeriodStart: string;
  reportPeriodEnd: string;
  submissionDate: string;
  status: 'Submitted' | 'Accepted' | 'Settled' | 'Reopened';
  totalOperatingRevenue: number;
  totalOperatingExpenses: number;
  netPatientRevenue: number;
  operatingMargin: number;
  totalMargin: number;
  costPerPatientDay: number;
  routineCostPerDay: number;
  ancillaryCostPerDay: number;
  totalPatientDays: number;
  averageDailyCensus: number;
  occupancyRate: number;
  licensedBeds: number;
  certifiedBeds: number;
  routineCosts: RoutineCosts;
  ancillaryCosts: AncillaryCosts;
  capitalCosts: CapitalCosts;
  administrativeCosts: AdministrativeCosts;
  stateMedianCostPerDay: number;
  nationalMedianCostPerDay: number;
  costEfficiencyRatio: number;
}

export interface RoutineCosts {
  totalRoutine: number;
  directNursing: number;
  indirectNursing: number;
  residentActivities: number;
  socialServices: number;
  dietaryServices: number;
  laundry: number;
  housekeeping: number;
  utilities: number;
  maintenance: number;
}

export interface AncillaryCosts {
  totalAncillary: number;
  physicalTherapy: number;
  occupationalTherapy: number;
  speechTherapy: number;
  pharmacy: number;
  laboratory: number;
  radiology: number;
  medicalSupplies: number;
  dme: number;
}

export interface CapitalCosts {
  totalCapital: number;
  buildingDepreciation: number;
  equipmentDepreciation: number;
  interestExpense: number;
  leaseExpense: number;
  insurance: number;
  propertyTax: number;
}

export interface AdministrativeCosts {
  totalAdministrative: number;
  executiveCompensation: number;
  managementFees: number;
  accounting: number;
  legal: number;
  humanResources: number;
  marketing: number;
  it: number;
  generalAndAdmin: number;
}

// Rate & Cost Benchmarks
export interface RateBenchmark {
  state: string;
  year: number;
  medicaidMedianRate: number;
  medicaidP25Rate: number;
  medicaidP75Rate: number;
  medicareMedianRate: number;
  costPerDayMedian: number;
  costPerDayP25: number;
  costPerDayP75: number;
  marginMedian: number;
}

// Historical Trends
export interface RateTrend {
  period: string;
  medicaidRate: number;
  medicareRate: number;
  costPerDay: number;
  margin: number;
  occupancy: number;
}
