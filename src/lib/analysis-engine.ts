/**
 * Analysis Engine for 5-Star Nursing Home Improvement
 *
 * This module analyzes facility data and generates actionable
 * recommendations for improving star ratings in a cost-effective way.
 *
 * Key Concepts:
 * - The 5-Star system has 3 components: Health Inspections, Staffing, Quality Measures
 * - Overall rating is a weighted combination of these three
 * - Some improvements are quick wins, others require long-term investment
 */

import type {
  Facility,
  HealthInspection,
  Deficiency,
  StaffingData,
  QualityMeasures,
  ImprovementRecommendation,
  FacilityAnalysis,
} from '@/types/facility';

/**
 * CMS Staffing Thresholds for Star Ratings
 * These are the HPRD (Hours Per Resident Day) thresholds CMS uses
 */
const STAFFING_THRESHOLDS = {
  totalHPRD: {
    5: 4.09,  // 5-star: >= 4.09 total nursing HPRD
    4: 3.88,  // 4-star: >= 3.88
    3: 3.35,  // 3-star: >= 3.35
    2: 2.82,  // 2-star: >= 2.82
    1: 0,     // 1-star: < 2.82
  },
  rnHPRD: {
    5: 0.75,  // 5-star: >= 0.75 RN HPRD
    4: 0.55,  // 4-star: >= 0.55
    3: 0.50,  // 3-star: >= 0.50
    2: 0.48,  // 2-star: >= 0.48
    1: 0,     // 1-star: < 0.48
  },
};

/**
 * Quality Measure Benchmarks (national averages for comparison)
 * Lower is better for most of these measures
 */
const QM_BENCHMARKS = {
  antipsychoticMeds: { excellent: 8, good: 12, average: 15, poor: 20 },
  pressureUlcers: { excellent: 3, good: 5, average: 7, poor: 10 },
  falls: { excellent: 18, good: 22, average: 26, poor: 30 },
  rehospitalization: { excellent: 15, good: 18, average: 22, poor: 28 },
  catheter: { excellent: 1, good: 2, average: 3, poor: 5 },
};

/**
 * Main analysis function - generates comprehensive facility analysis
 */
export function analyzeeFacility(
  facility: Facility,
  healthInspections: HealthInspection[],
  deficiencies: Deficiency[],
  staffing: StaffingData | null,
  qualityMeasures: QualityMeasures | null
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];

  // Analyze each component and add recommendations
  if (staffing) {
    recommendations.push(...analyzeStaffing(staffing, facility));
  }

  if (qualityMeasures) {
    recommendations.push(...analyzeQualityMeasures(qualityMeasures, facility));
  }

  if (healthInspections.length > 0 || deficiencies.length > 0) {
    recommendations.push(...analyzeHealthInspections(healthInspections, deficiencies, facility));
  }

  // Sort recommendations by priority and impact
  return sortRecommendations(recommendations);
}

/**
 * Analyze staffing data and generate recommendations
 */
function analyzeStaffing(staffing: StaffingData, facility: Facility): ImprovementRecommendation[] {
  const recs: ImprovementRecommendation[] = [];
  const currentRating = facility.staffingRating;

  // Check Total Nursing HPRD
  const totalHPRD = staffing.totalNurseHPRD;
  const nextTotalThreshold = getNextThreshold(totalHPRD, STAFFING_THRESHOLDS.totalHPRD);

  if (nextTotalThreshold && nextTotalThreshold.target > totalHPRD) {
    const hoursNeeded = (nextTotalThreshold.target - totalHPRD) * facility.numberOfResidents;
    const fteNeeded = hoursNeeded / 8; // Approximate FTEs needed per day

    recs.push({
      id: `staffing-total-hprd-${Date.now()}`,
      category: 'staffing',
      priority: currentRating <= 2 ? 'high' : 'medium',
      title: 'Increase Total Nursing Hours',
      description: `Current total nursing HPRD is ${totalHPRD.toFixed(2)}. To achieve ${nextTotalThreshold.starLevel}-star staffing, you need ${nextTotalThreshold.target} HPRD.`,
      currentValue: totalHPRD,
      targetValue: nextTotalThreshold.target,
      estimatedImpact: 1,
      estimatedCost: fteNeeded > 5 ? 'high' : fteNeeded > 2 ? 'medium' : 'low',
      timeframe: 'short_term',
      actionSteps: [
        `Hire approximately ${Math.ceil(fteNeeded)} additional nursing staff (CNAs/LPNs)`,
        'Review scheduling to maximize coverage during peak care times',
        'Consider agency staffing as a bridge while recruiting permanent staff',
        'Evaluate current staff retention - turnover may be creating gaps',
        'Ensure accurate PBJ reporting to get credit for all staff hours',
      ],
    });
  }

  // Check RN HPRD specifically
  const rnHPRD = staffing.rnHPRD;
  const nextRNThreshold = getNextThreshold(rnHPRD, STAFFING_THRESHOLDS.rnHPRD);

  if (nextRNThreshold && nextRNThreshold.target > rnHPRD) {
    const rnHoursNeeded = (nextRNThreshold.target - rnHPRD) * facility.numberOfResidents;
    const rnFteNeeded = rnHoursNeeded / 8;

    recs.push({
      id: `staffing-rn-hprd-${Date.now()}`,
      category: 'staffing',
      priority: currentRating <= 2 ? 'high' : 'medium',
      title: 'Increase RN Staffing Hours',
      description: `Current RN HPRD is ${rnHPRD.toFixed(2)}. RN staffing is a critical component. Target: ${nextRNThreshold.target} HPRD for ${nextRNThreshold.starLevel}-star.`,
      currentValue: rnHPRD,
      targetValue: nextRNThreshold.target,
      estimatedImpact: 1,
      estimatedCost: 'high', // RNs are expensive
      timeframe: 'short_term',
      actionSteps: [
        `Recruit ${Math.ceil(rnFteNeeded)} additional RNs`,
        'Offer competitive salary and sign-on bonuses in current market',
        'Partner with local nursing schools for RN recruitment',
        'Consider RN leadership roles to attract experienced nurses',
        'Evaluate if some LPN positions could be upgraded to RN roles',
      ],
    });
  }

  // Check weekend staffing
  if (staffing.weekendTotalNurseHPRD < staffing.totalNurseHPRD * 0.9) {
    recs.push({
      id: `staffing-weekend-${Date.now()}`,
      category: 'staffing',
      priority: 'medium',
      title: 'Improve Weekend Staffing',
      description: 'Weekend staffing is significantly lower than weekday staffing. CMS evaluates weekend staffing separately.',
      currentValue: staffing.weekendTotalNurseHPRD,
      targetValue: staffing.totalNurseHPRD * 0.95,
      estimatedImpact: 0.5,
      estimatedCost: 'medium',
      timeframe: 'immediate',
      actionSteps: [
        'Offer weekend differential pay incentives',
        'Create dedicated weekend-only positions',
        'Rotate weekend coverage fairly among all staff',
        'Use per diem staff to fill weekend gaps',
      ],
    });
  }

  // Check turnover rates
  if (staffing.rnTurnoverRate > 50) {
    recs.push({
      id: `staffing-turnover-rn-${Date.now()}`,
      category: 'staffing',
      priority: 'high',
      title: 'Reduce RN Turnover',
      description: `RN turnover rate of ${staffing.rnTurnoverRate.toFixed(1)}% is high. High turnover affects quality and increases costs.`,
      currentValue: staffing.rnTurnoverRate,
      targetValue: 30,
      estimatedImpact: 0.5,
      estimatedCost: 'low', // Often cultural/management changes
      timeframe: 'long_term',
      actionSteps: [
        'Conduct exit interviews to understand why RNs leave',
        'Review compensation compared to market rates',
        'Improve working conditions and support',
        'Create career advancement opportunities',
        'Implement mentorship programs for new RNs',
        'Address nurse-to-patient ratios',
      ],
    });
  }

  if (staffing.totalNurseTurnoverRate > 60) {
    recs.push({
      id: `staffing-turnover-total-${Date.now()}`,
      category: 'staffing',
      priority: 'high',
      title: 'Reduce Overall Staff Turnover',
      description: `Total nursing turnover of ${staffing.totalNurseTurnoverRate.toFixed(1)}% creates instability. Focus on retention.`,
      currentValue: staffing.totalNurseTurnoverRate,
      targetValue: 40,
      estimatedImpact: 0.5,
      estimatedCost: 'low',
      timeframe: 'long_term',
      actionSteps: [
        'Survey staff to identify pain points',
        'Improve scheduling flexibility',
        'Recognize and reward long-term employees',
        'Create positive workplace culture',
        'Provide adequate training and support',
        'Address staffing levels to reduce burnout',
      ],
    });
  }

  return recs;
}

/**
 * Analyze quality measures and generate recommendations
 */
function analyzeQualityMeasures(qm: QualityMeasures, facility: Facility): ImprovementRecommendation[] {
  const recs: ImprovementRecommendation[] = [];
  const currentRating = facility.qualityMeasureRating;

  // Antipsychotic medication use (major focus area)
  const antipsychotic = qm.longStay.percentAntipsychoticMeds;
  if (antipsychotic > QM_BENCHMARKS.antipsychoticMeds.average) {
    recs.push({
      id: `qm-antipsychotic-${Date.now()}`,
      category: 'quality_measures',
      priority: 'high',
      title: 'Reduce Antipsychotic Medication Use',
      description: `${antipsychotic.toFixed(1)}% of residents receive antipsychotics. This is a high-visibility measure. Target: below ${QM_BENCHMARKS.antipsychoticMeds.good}%.`,
      currentValue: antipsychotic,
      targetValue: QM_BENCHMARKS.antipsychoticMeds.good,
      estimatedImpact: 1,
      estimatedCost: 'low',
      timeframe: 'short_term',
      actionSteps: [
        'Review all residents on antipsychotics for appropriate diagnosis',
        'Implement gradual dose reduction (GDR) program',
        'Train staff in non-pharmacological interventions for behaviors',
        'Use person-centered care approaches',
        'Engage pharmacist in medication reviews',
        'Document behavioral symptoms and interventions thoroughly',
        'Consider music therapy, pet therapy, and activity programs',
      ],
    });
  }

  // Pressure ulcers
  const pressureUlcers = qm.longStay.percentWithPressureUlcers;
  if (pressureUlcers > QM_BENCHMARKS.pressureUlcers.average) {
    recs.push({
      id: `qm-pressure-ulcers-${Date.now()}`,
      category: 'quality_measures',
      priority: 'high',
      title: 'Reduce Pressure Ulcer Incidence',
      description: `${pressureUlcers.toFixed(1)}% of residents have pressure ulcers. Strong correlation with quality of care.`,
      currentValue: pressureUlcers,
      targetValue: QM_BENCHMARKS.pressureUlcers.good,
      estimatedImpact: 1,
      estimatedCost: 'medium',
      timeframe: 'short_term',
      actionSteps: [
        'Implement comprehensive skin assessment on admission',
        'Establish turning/repositioning schedule with documentation',
        'Invest in pressure-relieving mattresses and surfaces',
        'Ensure adequate nutrition and hydration',
        'Train CNAs on early identification of skin breakdown',
        'Conduct weekly wound rounds',
        'Use Braden Scale for risk assessment',
      ],
    });
  }

  // Falls
  const falls = qm.longStay.percentWithFalls;
  if (falls > QM_BENCHMARKS.falls.average) {
    recs.push({
      id: `qm-falls-${Date.now()}`,
      category: 'quality_measures',
      priority: 'medium',
      title: 'Reduce Fall Incidence',
      description: `${falls.toFixed(1)}% of residents experienced falls. Falls can lead to serious injuries and lawsuits.`,
      currentValue: falls,
      targetValue: QM_BENCHMARKS.falls.good,
      estimatedImpact: 0.5,
      estimatedCost: 'medium',
      timeframe: 'short_term',
      actionSteps: [
        'Complete fall risk assessment on every resident',
        'Implement individualized fall prevention plans',
        'Review medications that increase fall risk',
        'Ensure adequate lighting and clear pathways',
        'Use bed/chair alarms for high-risk residents',
        'Provide proper footwear to residents',
        'Staff training on fall prevention',
        'Post-fall huddles to identify root causes',
      ],
    });
  }

  // Catheter use
  const catheter = qm.longStay.percentWithCatheter;
  if (catheter > QM_BENCHMARKS.catheter.average) {
    recs.push({
      id: `qm-catheter-${Date.now()}`,
      category: 'quality_measures',
      priority: 'medium',
      title: 'Reduce Indwelling Catheter Use',
      description: `${catheter.toFixed(1)}% of residents have catheters. Reduces infection risk when removed.`,
      currentValue: catheter,
      targetValue: QM_BENCHMARKS.catheter.good,
      estimatedImpact: 0.5,
      estimatedCost: 'low',
      timeframe: 'immediate',
      actionSteps: [
        'Review all catheter orders for medical necessity',
        'Implement catheter removal protocol',
        'Train on proper catheter care to prevent infections',
        'Establish toileting programs as alternatives',
        'Document clear criteria for catheter use',
      ],
    });
  }

  // Rehospitalization (short-stay)
  const rehospitalization = qm.shortStay.percentRehospitalized;
  if (rehospitalization > QM_BENCHMARKS.rehospitalization.average) {
    recs.push({
      id: `qm-rehospitalization-${Date.now()}`,
      category: 'quality_measures',
      priority: 'high',
      title: 'Reduce Rehospitalization Rate',
      description: `${rehospitalization.toFixed(1)}% rehospitalization affects both quality rating and reimbursement.`,
      currentValue: rehospitalization,
      targetValue: QM_BENCHMARKS.rehospitalization.good,
      estimatedImpact: 1,
      estimatedCost: 'medium',
      timeframe: 'short_term',
      actionSteps: [
        'Improve hospital-to-SNF transition communication',
        'Medication reconciliation on admission',
        'Early identification of declining residents',
        'Develop INTERACT or similar early warning system',
        'Train staff to recognize and respond to changes in condition',
        'Strengthen physician/NP coverage',
        'Consider telehealth for after-hours concerns',
      ],
    });
  }

  // Vaccination rates (higher is better)
  const fluVaccine = qm.longStay.percentWithFluVaccine;
  if (fluVaccine < 90) {
    recs.push({
      id: `qm-flu-vaccine-${Date.now()}`,
      category: 'quality_measures',
      priority: 'low',
      title: 'Improve Flu Vaccination Rate',
      description: `Only ${fluVaccine.toFixed(1)}% of residents received flu vaccine. Easy win for quality measures.`,
      currentValue: fluVaccine,
      targetValue: 95,
      estimatedImpact: 0.25,
      estimatedCost: 'low',
      timeframe: 'immediate',
      actionSteps: [
        'Implement standing orders for flu vaccination',
        'Educate families about vaccine benefits',
        'Coordinate with pharmacy for vaccine supply',
        'Document all vaccinations and refusals properly',
      ],
    });
  }

  return recs;
}

/**
 * Analyze health inspection data and generate recommendations
 */
function analyzeHealthInspections(
  inspections: HealthInspection[],
  deficiencies: Deficiency[],
  facility: Facility
): ImprovementRecommendation[] {
  const recs: ImprovementRecommendation[] = [];
  const currentRating = facility.healthInspectionRating;

  if (inspections.length === 0) return recs;

  const latestInspection = inspections[0];

  // High deficiency count
  if (latestInspection.totalDeficiencies > latestInspection.nationalAvgDeficiencies) {
    recs.push({
      id: `hi-deficiency-count-${Date.now()}`,
      category: 'health_inspection',
      priority: currentRating <= 2 ? 'high' : 'medium',
      title: 'Reduce Deficiency Count',
      description: `${latestInspection.totalDeficiencies} deficiencies vs national average of ${latestInspection.nationalAvgDeficiencies.toFixed(1)}. Focus on systemic issues.`,
      currentValue: latestInspection.totalDeficiencies,
      targetValue: Math.floor(latestInspection.nationalAvgDeficiencies),
      estimatedImpact: 1,
      estimatedCost: 'medium',
      timeframe: 'long_term',
      actionSteps: [
        'Analyze pattern of deficiencies - what areas repeat?',
        'Conduct internal mock surveys regularly',
        'Implement quality assurance and performance improvement (QAPI) program',
        'Train staff on common deficiency areas',
        'Engage DON and Administrator in quality improvement',
        'Address root causes, not just symptoms',
      ],
    });
  }

  // Check for severe deficiencies (G, H, I, J, K, L level)
  const severeDeficiencies = latestInspection.deficiencySeverityLevelG +
    latestInspection.deficiencySeverityLevelH +
    latestInspection.deficiencySeverityLevelI +
    latestInspection.deficiencySeverityLevelJ +
    latestInspection.deficiencySeverityLevelK +
    latestInspection.deficiencySeverityLevelL;

  if (severeDeficiencies > 0) {
    recs.push({
      id: `hi-severe-deficiencies-${Date.now()}`,
      category: 'health_inspection',
      priority: 'high',
      title: 'Eliminate Severe Deficiencies',
      description: `${severeDeficiencies} severe deficiencies (G-L level) significantly impact ratings. These indicate actual harm or immediate jeopardy.`,
      currentValue: severeDeficiencies,
      targetValue: 0,
      estimatedImpact: 2,
      estimatedCost: 'high',
      timeframe: 'immediate',
      actionSteps: [
        'Review all severe deficiencies from recent surveys',
        'Develop immediate corrective action plans',
        'Identify system failures that led to harm',
        'Implement safeguards to prevent recurrence',
        'Consider external consultant for high-risk areas',
        'Board/leadership engagement on quality issues',
      ],
    });
  }

  // Analyze specific deficiency categories
  const deficiencyCategories = new Map<string, number>();
  deficiencies.forEach(d => {
    const count = deficiencyCategories.get(d.category) || 0;
    deficiencyCategories.set(d.category, count + 1);
  });

  // Find most common category
  let maxCategory = '';
  let maxCount = 0;
  deficiencyCategories.forEach((count, category) => {
    if (count > maxCount) {
      maxCount = count;
      maxCategory = category;
    }
  });

  if (maxCategory && maxCount >= 2) {
    recs.push({
      id: `hi-category-${maxCategory.replace(/\s/g, '-')}-${Date.now()}`,
      category: 'health_inspection',
      priority: 'medium',
      title: `Address ${maxCategory} Deficiencies`,
      description: `${maxCount} deficiencies in "${maxCategory}" category suggests a systemic issue requiring focused intervention.`,
      currentValue: maxCount,
      targetValue: 0,
      estimatedImpact: 0.5,
      estimatedCost: 'medium',
      timeframe: 'short_term',
      actionSteps: [
        `Review all ${maxCategory} deficiencies in detail`,
        'Identify common root causes',
        'Develop targeted training for staff',
        'Update policies and procedures if needed',
        'Assign specific accountability for improvement',
        'Monitor with regular audits',
      ],
    });
  }

  // Check for penalties/fines
  if (latestInspection.fineAmount > 0) {
    recs.push({
      id: `hi-fines-${Date.now()}`,
      category: 'health_inspection',
      priority: 'high',
      title: 'Address Issues Leading to Fines',
      description: `$${latestInspection.fineAmount.toLocaleString()} in fines indicates serious compliance issues. Fines heavily impact ratings.`,
      currentValue: latestInspection.fineAmount,
      targetValue: 0,
      estimatedImpact: 1.5,
      estimatedCost: 'high',
      timeframe: 'immediate',
      actionSteps: [
        'Review the specific citations that led to fines',
        'Develop comprehensive corrective action plan',
        'Consider engaging compliance consultant',
        'Implement monitoring systems to catch issues early',
        'Regular leadership rounds to observe care delivery',
      ],
    });
  }

  return recs;
}

/**
 * Helper to find the next star threshold level
 */
function getNextThreshold(
  currentValue: number,
  thresholds: Record<number, number>
): { target: number; starLevel: number } | null {
  // Find current star level
  let currentStar = 1;
  for (let star = 5; star >= 1; star--) {
    if (currentValue >= thresholds[star]) {
      currentStar = star;
      break;
    }
  }

  // If already at 5 stars, no improvement needed
  if (currentStar >= 5) return null;

  // Return next threshold
  const nextStar = currentStar + 1;
  return {
    target: thresholds[nextStar],
    starLevel: nextStar,
  };
}

/**
 * Sort recommendations by priority and estimated impact
 */
function sortRecommendations(recs: ImprovementRecommendation[]): ImprovementRecommendation[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const costOrder = { low: 0, medium: 1, high: 2 };

  return recs.sort((a, b) => {
    // First by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by impact (higher first)
    const impactDiff = b.estimatedImpact - a.estimatedImpact;
    if (impactDiff !== 0) return impactDiff;

    // Then by cost (lower first for same priority/impact)
    return costOrder[a.estimatedCost] - costOrder[b.estimatedCost];
  });
}

/**
 * Calculate potential star improvement from implementing recommendations
 */
export function calculatePotentialImprovement(
  facility: Facility,
  selectedRecommendations: ImprovementRecommendation[]
): {
  currentOverall: number;
  potentialOverall: number;
  healthInspectionImprovement: number;
  staffingImprovement: number;
  qualityMeasuresImprovement: number;
} {
  let healthInspectionImprovement = 0;
  let staffingImprovement = 0;
  let qualityMeasuresImprovement = 0;

  selectedRecommendations.forEach(rec => {
    const impact = rec.estimatedImpact * 0.5; // Conservative estimate

    switch (rec.category) {
      case 'health_inspection':
        healthInspectionImprovement += impact;
        break;
      case 'staffing':
        staffingImprovement += impact;
        break;
      case 'quality_measures':
        qualityMeasuresImprovement += impact;
        break;
    }
  });

  // Cap improvements at realistic levels
  healthInspectionImprovement = Math.min(healthInspectionImprovement, 5 - facility.healthInspectionRating);
  staffingImprovement = Math.min(staffingImprovement, 5 - facility.staffingRating);
  qualityMeasuresImprovement = Math.min(qualityMeasuresImprovement, 5 - facility.qualityMeasureRating);

  // Calculate new ratings
  const newHealthInspection = Math.min(5, facility.healthInspectionRating + healthInspectionImprovement);
  const newStaffing = Math.min(5, facility.staffingRating + staffingImprovement);
  const newQM = Math.min(5, facility.qualityMeasureRating + qualityMeasuresImprovement);

  // Overall is weighted - health inspection is weighted more heavily
  const potentialOverall = Math.round(
    (newHealthInspection * 0.4 + newStaffing * 0.3 + newQM * 0.3)
  );

  return {
    currentOverall: facility.overallRating,
    potentialOverall: Math.min(5, potentialOverall),
    healthInspectionImprovement,
    staffingImprovement,
    qualityMeasuresImprovement,
  };
}

/**
 * Generate a summary of the facility's current state
 */
export function generateFacilitySummary(analysis: FacilityAnalysis): {
  strengths: string[];
  weaknesses: string[];
  criticalIssues: string[];
  quickWins: string[];
} {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const criticalIssues: string[] = [];
  const quickWins: string[] = [];

  const { facility, staffing, qualityMeasures, healthInspections } = analysis;

  // Analyze ratings
  if (facility.overallRating >= 4) strengths.push('Strong overall rating');
  if (facility.overallRating <= 2) criticalIssues.push('Low overall rating requires immediate attention');

  if (facility.healthInspectionRating >= 4) {
    strengths.push('Excellent health inspection performance');
  } else if (facility.healthInspectionRating <= 2) {
    criticalIssues.push('Poor health inspection rating - focus on survey readiness');
  }

  if (facility.staffingRating >= 4) {
    strengths.push('Strong staffing levels');
  } else if (facility.staffingRating <= 2) {
    weaknesses.push('Staffing levels below CMS thresholds');
  }

  if (facility.qualityMeasureRating >= 4) {
    strengths.push('Good clinical quality measures');
  } else if (facility.qualityMeasureRating <= 2) {
    weaknesses.push('Quality measures need improvement');
  }

  // Staffing-specific
  if (staffing) {
    if (staffing.rnTurnoverRate < 30) {
      strengths.push('Low RN turnover indicates stable leadership');
    } else if (staffing.rnTurnoverRate > 60) {
      criticalIssues.push('High RN turnover destabilizes care quality');
    }

    if (staffing.totalNurseHPRD >= 4.0) {
      strengths.push('Exceeds recommended staffing levels');
    }
  }

  // Quality measures
  if (qualityMeasures) {
    if (qualityMeasures.longStay.percentAntipsychoticMeds < 10) {
      strengths.push('Low antipsychotic use - good dementia care practices');
    } else if (qualityMeasures.longStay.percentAntipsychoticMeds > 15) {
      quickWins.push('Antipsychotic reduction is a high-visibility quick win');
    }

    if (qualityMeasures.longStay.percentWithFluVaccine < 90) {
      quickWins.push('Increasing flu vaccination rate is easy improvement');
    }

    if (qualityMeasures.longStay.percentWithCatheter > 3) {
      quickWins.push('Catheter removal program can improve QMs quickly');
    }
  }

  // Health inspections
  if (healthInspections.length > 0) {
    const latest = healthInspections[0];
    if (latest.totalDeficiencies < latest.nationalAvgDeficiencies) {
      strengths.push('Fewer deficiencies than national average');
    }

    const severeDeficiencies = latest.deficiencySeverityLevelG +
      latest.deficiencySeverityLevelH +
      latest.deficiencySeverityLevelI +
      latest.deficiencySeverityLevelJ +
      latest.deficiencySeverityLevelK +
      latest.deficiencySeverityLevelL;

    if (severeDeficiencies > 0) {
      criticalIssues.push(`${severeDeficiencies} severe deficiencies must be addressed immediately`);
    }

    if (latest.fineAmount > 0) {
      criticalIssues.push(`$${latest.fineAmount.toLocaleString()} in fines indicates serious issues`);
    }
  }

  // Abuse icon
  if (facility.abuseIcon) {
    criticalIssues.push('Abuse icon - investigate and address immediately');
  }

  // Special focus
  if (facility.isSpecialFocus) {
    criticalIssues.push('Special Focus Facility status requires intensive improvement plan');
  }

  return { strengths, weaknesses, criticalIssues, quickWins };
}

export const analysisEngine = {
  analyzeeFacility,
  calculatePotentialImprovement,
  generateFacilitySummary,
  STAFFING_THRESHOLDS,
  QM_BENCHMARKS,
};

export default analysisEngine;
