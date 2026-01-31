/**
 * Sample Data Generators for Rates & Costs
 * Generates realistic placeholder data for rate letters and cost reports
 */

import type {
  MedicaidRateLetter,
  MedicareRate,
  CostReport,
  RateBenchmark,
  RateTrend,
  PDPMCategory,
  MedicareAdvantageRate,
} from '@/types/facility';

// State base rate lookup (simplified Medicaid rates by state)
function getStateBaseRate(state: string): number {
  const rates: Record<string, number> = {
    'WA': 285, 'OR': 275, 'CA': 320, 'NY': 340, 'TX': 215,
    'FL': 245, 'PA': 290, 'IL': 265, 'OH': 255, 'MI': 270,
    'GA': 235, 'NC': 240, 'NJ': 310, 'VA': 260, 'AZ': 250,
    'MA': 315, 'IN': 248, 'TN': 230, 'MO': 225, 'MD': 295,
    'WI': 268, 'MN': 282, 'CO': 275, 'AL': 218, 'SC': 232,
    'LA': 228, 'KY': 235, 'OK': 210, 'CT': 325, 'IA': 245,
    'MS': 205, 'AR': 212, 'KS': 222, 'NV': 265, 'UT': 255,
    'NE': 238, 'NM': 242, 'WV': 248, 'ID': 235, 'HI': 345,
    'NH': 288, 'ME': 272, 'RI': 298, 'MT': 248, 'DE': 285,
    'SD': 232, 'ND': 245, 'AK': 385, 'VT': 278, 'WY': 252,
  };
  return rates[state] || 265;
}

// Generate sample Medicaid rate letters (historical)
export function generateMedicaidRateLetters(
  facilityId: string,
  state: string,
  beds: number
): MedicaidRateLetter[] {
  const baseRate = getStateBaseRate(state);
  const letters: MedicaidRateLetter[] = [];

  for (let i = 0; i < 5; i++) {
    const year = 2024 - i;
    const annualIncrease = 1 + (Math.random() * 0.04 - 0.01); // -1% to +3%
    const rate = baseRate * Math.pow(annualIncrease, -i);

    // Calculate payer mix with some variation
    const medicaidPct = 50 + Math.floor(Math.random() * 20);
    const medicarePct = 20 + Math.floor(Math.random() * 15);
    const privatePct = Math.max(5, 100 - medicaidPct - medicarePct - 5);
    const otherPct = 100 - medicaidPct - medicarePct - privatePct;

    letters.push({
      facilityId,
      effectiveDate: `${year}-07-01`,
      expirationDate: `${year + 1}-06-30`,
      dailyPerDiemRate: Math.round(rate * 100) / 100,
      ancillaryRate: Math.round(rate * 0.15 * 100) / 100,
      therapyRate: Math.round(rate * 0.12 * 100) / 100,
      nursingComponent: Math.round(rate * 0.45 * 100) / 100,
      careComponent: Math.round(rate * 0.25 * 100) / 100,
      capitalComponent: Math.round(rate * 0.18 * 100) / 100,
      administrativeComponent: Math.round(rate * 0.12 * 100) / 100,
      qualityIncentivePayment: Math.random() > 0.3 ? Math.round(rate * 0.02 * 100) / 100 : 0,
      specialCareFactor: 1.0,
      acuityAdjustment: 0.95 + Math.random() * 0.15,
      previousRate: i < 4 ? Math.round(rate / annualIncrease * 100) / 100 : 0,
      percentChange: i < 4 ? Math.round((annualIncrease - 1) * 10000) / 100 : 0,
      stateCode: state,
      rateType: 'Nursing Facility',
      payerMix: {
        medicaid: medicaidPct,
        medicare: medicarePct,
        private: privatePct,
        other: otherPct,
      },
    });
  }

  return letters;
}

// Generate PDPM payment categories
function generatePDPMCategories(baseRate: number): PDPMCategory[] {
  const categories = [
    { name: 'Nursing - Extensive Services', code: 'ES1', multiplier: 1.8 },
    { name: 'Nursing - Special Care High', code: 'HDE', multiplier: 1.5 },
    { name: 'Nursing - Special Care Low', code: 'LDE', multiplier: 1.2 },
    { name: 'Nursing - Clinically Complex', code: 'CC1', multiplier: 1.1 },
    { name: 'Nursing - Behavioral/Cognitive', code: 'BC1', multiplier: 0.95 },
    { name: 'Nursing - Reduced Physical Function', code: 'PE1', multiplier: 0.85 },
  ];

  return categories.map(cat => ({
    name: cat.name,
    code: cat.code,
    dailyRate: Math.round(baseRate * cat.multiplier * 100) / 100,
    averageLOS: Math.floor(15 + Math.random() * 25),
    caseCount: Math.floor(10 + Math.random() * 50),
    totalPayments: Math.floor(50000 + Math.random() * 200000),
  }));
}

// Generate Medicare Advantage rates
function generateMARates(): MedicareAdvantageRate[] {
  const maPlans = [
    { name: 'UnitedHealthcare', terms: 'Per Diem with PDPM-aligned adjustments' },
    { name: 'Humana', terms: 'Case rate with outlier provisions' },
    { name: 'Aetna', terms: 'Per Diem based on acuity level' },
    { name: 'Cigna', terms: 'Tiered per diem by service category' },
  ];
  const numPlans = 2 + Math.floor(Math.random() * 2);

  return maPlans.slice(0, numPlans).map(plan => ({
    payerName: plan.name,
    dailyRate: 450 + Math.floor(Math.random() * 100),
    effectiveDate: '2024-01-01',
    contractExpiration: '2025-12-31',
    paymentTerms: plan.terms,
  }));
}

// Generate sample Medicare rates
export function generateMedicareRates(
  facilityId: string,
  beds: number
): MedicareRate[] {
  const rates: MedicareRate[] = [];

  for (let i = 0; i < 3; i++) {
    const year = 2024 - i;
    const baseRate = 530 + (3 - i) * 8; // Annual increases

    rates.push({
      facilityId,
      effectiveDate: `${year}-10-01`,
      pdpmBaseRate: baseRate,
      nursingComponent: Math.round(baseRate * 0.35 * 100) / 100,
      therapyComponent: Math.round(baseRate * 0.28 * 100) / 100,
      nta: Math.round(baseRate * 0.22 * 100) / 100,
      rugIVBaseRate: Math.round(baseRate * 0.92 * 100) / 100,
      ptCmi: Math.round((0.95 + Math.random() * 0.3) * 100) / 100,
      otCmi: Math.round((0.90 + Math.random() * 0.25) * 100) / 100,
      slpCmi: Math.round((0.85 + Math.random() * 0.35) * 100) / 100,
      nursingCmi: Math.round((0.95 + Math.random() * 0.2) * 100) / 100,
      ntaCmi: Math.round((1.0 + Math.random() * 0.15) * 100) / 100,
      paymentCategories: generatePDPMCategories(baseRate),
      maRates: generateMARates(),
    });
  }

  return rates;
}

// Generate sample cost report
export function generateCostReport(
  facilityId: string,
  beds: number,
  occupancy: number
): CostReport[] {
  const reports: CostReport[] = [];

  for (let i = 0; i < 3; i++) {
    const year = 2023 - i;
    const patientDays = Math.floor(beds * (occupancy / 100) * 365);
    const costPerDay = 280 + Math.random() * 80;
    const totalExpenses = patientDays * costPerDay;
    const revenuePerDay = costPerDay * (1.02 + Math.random() * 0.08);
    const totalRevenue = patientDays * revenuePerDay;
    const margin = ((totalRevenue - totalExpenses) / totalRevenue) * 100;

    reports.push({
      facilityId,
      fiscalYearEnd: `${year}-12-31`,
      reportPeriodStart: `${year}-01-01`,
      reportPeriodEnd: `${year}-12-31`,
      submissionDate: `${year + 1}-05-31`,
      status: i === 0 ? 'Submitted' : 'Settled',

      totalOperatingRevenue: Math.round(totalRevenue),
      totalOperatingExpenses: Math.round(totalExpenses),
      netPatientRevenue: Math.round(totalRevenue * 0.95),
      operatingMargin: Math.round(margin * 100) / 100,
      totalMargin: Math.round((margin + 0.5) * 100) / 100,

      costPerPatientDay: Math.round(costPerDay * 100) / 100,
      routineCostPerDay: Math.round(costPerDay * 0.65 * 100) / 100,
      ancillaryCostPerDay: Math.round(costPerDay * 0.35 * 100) / 100,

      totalPatientDays: patientDays,
      averageDailyCensus: Math.round(patientDays / 365 * 10) / 10,
      occupancyRate: occupancy,
      licensedBeds: beds,
      certifiedBeds: beds,

      routineCosts: {
        totalRoutine: Math.round(totalExpenses * 0.65),
        directNursing: Math.round(totalExpenses * 0.35),
        indirectNursing: Math.round(totalExpenses * 0.08),
        residentActivities: Math.round(totalExpenses * 0.02),
        socialServices: Math.round(totalExpenses * 0.02),
        dietaryServices: Math.round(totalExpenses * 0.08),
        laundry: Math.round(totalExpenses * 0.02),
        housekeeping: Math.round(totalExpenses * 0.03),
        utilities: Math.round(totalExpenses * 0.03),
        maintenance: Math.round(totalExpenses * 0.02),
      },
      ancillaryCosts: {
        totalAncillary: Math.round(totalExpenses * 0.20),
        physicalTherapy: Math.round(totalExpenses * 0.05),
        occupationalTherapy: Math.round(totalExpenses * 0.04),
        speechTherapy: Math.round(totalExpenses * 0.02),
        pharmacy: Math.round(totalExpenses * 0.05),
        laboratory: Math.round(totalExpenses * 0.015),
        radiology: Math.round(totalExpenses * 0.01),
        medicalSupplies: Math.round(totalExpenses * 0.02),
        dme: Math.round(totalExpenses * 0.005),
      },
      capitalCosts: {
        totalCapital: Math.round(totalExpenses * 0.10),
        buildingDepreciation: Math.round(totalExpenses * 0.04),
        equipmentDepreciation: Math.round(totalExpenses * 0.02),
        interestExpense: Math.round(totalExpenses * 0.02),
        leaseExpense: Math.round(totalExpenses * 0.01),
        insurance: Math.round(totalExpenses * 0.005),
        propertyTax: Math.round(totalExpenses * 0.005),
      },
      administrativeCosts: {
        totalAdministrative: Math.round(totalExpenses * 0.05),
        executiveCompensation: Math.round(totalExpenses * 0.015),
        managementFees: Math.round(totalExpenses * 0.01),
        accounting: Math.round(totalExpenses * 0.005),
        legal: Math.round(totalExpenses * 0.003),
        humanResources: Math.round(totalExpenses * 0.005),
        marketing: Math.round(totalExpenses * 0.003),
        it: Math.round(totalExpenses * 0.004),
        generalAndAdmin: Math.round(totalExpenses * 0.005),
      },

      stateMedianCostPerDay: 295,
      nationalMedianCostPerDay: 305,
      costEfficiencyRatio: Math.round((costPerDay / 305) * 100) / 100,
    });
  }

  return reports;
}

// Generate benchmark data
export function generateBenchmarks(state: string): RateBenchmark[] {
  const baseRate = getStateBaseRate(state);
  const benchmarks: RateBenchmark[] = [];

  for (let i = 0; i < 5; i++) {
    const year = 2024 - i;
    benchmarks.push({
      state,
      year,
      medicaidMedianRate: baseRate - i * 5,
      medicaidP25Rate: Math.round((baseRate - i * 5) * 0.85 * 100) / 100,
      medicaidP75Rate: Math.round((baseRate - i * 5) * 1.15 * 100) / 100,
      medicareMedianRate: 520 - i * 8,
      costPerDayMedian: 305 - i * 3,
      costPerDayP25: 265 - i * 3,
      costPerDayP75: 345 - i * 3,
      marginMedian: Math.round((2.5 - i * 0.3) * 100) / 100,
    });
  }

  return benchmarks;
}

// Generate trend data
export function generateTrends(facilityId: string): RateTrend[] {
  const trends: RateTrend[] = [];

  for (let i = 0; i < 20; i++) {
    const quarter = Math.floor(i / 4);
    const q = (i % 4) + 1;
    const year = 2024 - quarter;

    trends.push({
      period: `Q${q} ${year}`,
      medicaidRate: Math.round((275 + Math.sin(i * 0.5) * 10 + i * 1.5) * 100) / 100,
      medicareRate: Math.round((520 + Math.sin(i * 0.3) * 15 + i * 2) * 100) / 100,
      costPerDay: Math.round((295 + Math.sin(i * 0.4) * 8 + i * 1.2) * 100) / 100,
      margin: Math.round((3.5 + Math.sin(i * 0.6) * 2) * 100) / 100,
      occupancy: Math.round((82 + Math.sin(i * 0.7) * 5) * 10) / 10,
    });
  }

  return trends.reverse();
}
