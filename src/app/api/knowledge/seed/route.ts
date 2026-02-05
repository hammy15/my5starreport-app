/**
 * Knowledge Base Seeder - Comprehensive QM Data with Research-Verified Corrections
 *
 * This seeds the FiveStarKnowledge table with accurate, CMS-verified data
 * including all corrections from specialist feedback.
 */

import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Comprehensive knowledge entries with research-verified corrections
const knowledgeEntries = [
  // ============================================
  // QUALITY MEASURES - LONG STAY (17 measures)
  // ============================================
  {
    id: 'qm-ls-antipsychotic',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Antipsychotic Medication Use (N031.04)',
    content: {
      measureCode: 'N031.04',
      description: 'Percent of long-stay residents who received antipsychotic medication',
      numerator: 'Residents with N0415A = 1 (received antipsychotic in 7-day lookback)',
      denominator: 'All long-stay residents with valid target assessment',
      exclusions: [
        { code: 'I6000=1', description: 'Schizophrenia diagnosis' },
        { code: 'I5350=1', description: "Tourette's syndrome diagnosis" },
        { code: 'I5250=1', description: "Huntington's disease diagnosis" }
      ],
      criticalNote: '"Other psychotic disorders" is NOT a valid exclusion - only schizophrenia, Tourette\'s, and Huntington\'s qualify',
      nationalAverage: 14.2,
      benchmarks: { excellent: 8, good: 12, average: 15, poor: 20 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement Gradual Dose Reduction (GDR) protocols for all antipsychotic residents',
        'Document behavioral interventions attempted before medication use',
        'Train staff on non-pharmacological interventions for behavioral symptoms',
        'Review exclusion criteria - ensure only schizophrenia (I6000), Tourette\'s (I5350), Huntington\'s (I5250) are excluded',
        'Conduct monthly pharmacy reviews to identify reduction candidates',
        'Use validated behavioral assessment tools (e.g., NPI-NH, CMAI)',
        'Ensure informed consent is documented for all antipsychotic use'
      ],
      mdsItems: ['N0415A', 'I6000', 'I5350', 'I5250'],
      codingTips: [
        'Verify diagnosis codes are current and accurate before claiming exclusions',
        'Document GDR attempts even if unsuccessful - shows good faith effort',
        'Review PRN medication logs - may trigger inclusion'
      ],
      starImpact: 'High - one of the most scrutinized QMs; affects public perception significantly'
    },
    tags: ['antipsychotic', 'psychotropic', 'behavioral', 'GDR', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0',
    source_url: 'https://www.cms.gov/medicare/quality/nursing-home-improvement/quality-measures'
  },
  {
    id: 'qm-ss-new-antipsychotic',
    category: 'Quality Measures',
    subcategory: 'Short Stay',
    title: 'SS New Antipsychotic Medication (N011.03)',
    content: {
      measureCode: 'N011.03',
      description: 'Percent of short-stay residents who newly received antipsychotic medication',
      numerator: 'Residents with new antipsychotic use (N0415A=1 on current assessment, N0415A≠1 on prior/admission)',
      denominator: 'Short-stay residents without antipsychotic on admission',
      exclusions: [
        { code: 'I6000=1', description: 'Schizophrenia diagnosis' },
        { code: 'I5350=1', description: "Tourette's syndrome diagnosis" },
        { code: 'I5250=1', description: "Huntington's disease diagnosis" }
      ],
      criticalNote: 'Tracks NEW use only - admission assessment must show no prior antipsychotic',
      nationalAverage: 2.1,
      benchmarks: { excellent: 0.5, good: 1.5, average: 2.5, poor: 4 },
      higherIsWorse: true,
      suggestedActions: [
        'Screen for behavioral health needs at admission without defaulting to medications',
        'Implement 72-hour behavioral observation protocol before medication initiation',
        'Train admission staff on non-pharmacological interventions',
        'Create interdisciplinary team review requirement before new antipsychotic orders',
        'Document thorough behavioral assessments justifying any new prescriptions'
      ],
      mdsItems: ['N0415A', 'I6000', 'I5350', 'I5250'],
      starImpact: 'Moderate - watched closely for inappropriate medication initiation'
    },
    tags: ['antipsychotic', 'new-use', 'short-stay', 'admission', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-pressure-ulcers',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Pressure Ulcers (N045.01)',
    content: {
      measureCode: 'N045.01',
      description: 'Percent of long-stay high-risk residents with pressure ulcers',
      numerator: 'Residents with Stage 2, 3, 4, or unstageable pressure ulcers (M0300B1-G1 > 0)',
      denominator: 'High-risk long-stay residents (risk-adjusted)',
      exclusions: [
        'Venous ulcers (M1040D) - NOT included in pressure ulcer QM',
        'Arterial ulcers (M1040E) - NOT included in pressure ulcer QM',
        'Admission assessments (5-day PPS)',
        'Missing M0300 data'
      ],
      criticalNote: 'ONLY pressure ulcers (M0300 items) are counted. Venous and arterial ulcers coded in M1040 are EXCLUDED from this measure.',
      covariates: [
        'Bowel incontinence (H0400)',
        'Diabetes (I2900)',
        'Peripheral vascular disease (I0900)',
        'Low BMI'
      ],
      nationalAverage: 5.5,
      benchmarks: { excellent: 3, good: 5, average: 7, poor: 10 },
      higherIsWorse: true,
      suggestedActions: [
        'Conduct comprehensive skin assessments on admission and weekly',
        'Implement Braden Scale risk assessments for all residents',
        'Establish turning/repositioning schedules with documentation',
        'Use pressure-relieving surfaces (mattresses, cushions) for at-risk residents',
        'Ensure adequate nutrition and hydration protocols',
        'Train CNAs on early skin breakdown identification',
        'Conduct weekly wound rounds with interdisciplinary team',
        'Differentiate venous/arterial ulcers properly in coding (M1040, not M0300)'
      ],
      mdsItems: ['M0300B1', 'M0300C1', 'M0300D1', 'M0300E1', 'M0300F1', 'M0300G1', 'M1040D', 'M1040E'],
      codingTips: [
        'Venous ulcers go in M1040D, arterial in M1040E - these do NOT affect pressure ulcer QM',
        'Unstageable ulcers (M0300E1, F1, G1) ARE counted in this QM',
        'Deep tissue injuries (M0300E1) must be distinguished from Stage 2'
      ],
      starImpact: 'Very High - strongly correlated with quality of care perceptions'
    },
    tags: ['pressure-ulcer', 'skin-integrity', 'wound-care', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ss-pressure-ulcers',
    category: 'Quality Measures',
    subcategory: 'Short Stay',
    title: 'SS Pressure Ulcers New/Worsened (S038.02)',
    content: {
      measureCode: 'S038.02',
      description: 'Percent of short-stay residents with new or worsened pressure ulcers',
      numerator: 'Residents with new Stage 2-4 or worsened pressure ulcers since prior assessment',
      denominator: 'Short-stay residents with valid assessments',
      nationalAverage: 2.0,
      benchmarks: { excellent: 0.5, good: 1.5, average: 2.5, poor: 4 },
      higherIsWorse: true,
      suggestedActions: [
        'Immediate skin assessment within 24 hours of admission',
        'Document all existing wounds thoroughly on admission to establish baseline',
        'Implement aggressive prevention protocols for rehab patients',
        'Daily skin checks during therapy sessions'
      ],
      mdsItems: ['M0300B1', 'M0300C1', 'M0300D1'],
      starImpact: 'High - indicates facility-acquired conditions'
    },
    tags: ['pressure-ulcer', 'short-stay', 'new-worsened', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-uti',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Urinary Tract Infection (N024.02)',
    content: {
      measureCode: 'N024.02',
      description: 'Percent of long-stay residents with a urinary tract infection',
      numerator: 'Residents with I2300 = 1 (UTI in last 30 days)',
      denominator: 'All long-stay residents with valid assessment',
      exclusions: [
        'Admission/5-day assessments',
        'Missing I2300 data'
      ],
      criticalNote: 'This measure is based ONLY on I2300 (UTI). Pneumonia (I2000) is UNRELATED to this measure - there is no UTI/pneumonia connection in MDS coding.',
      nationalAverage: 3.5,
      benchmarks: { excellent: 1.5, good: 3, average: 4, poor: 6 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement comprehensive hydration protocols (target 1500-2000mL daily unless contraindicated)',
        'Establish regular toileting schedules to prevent retention',
        'Train staff on proper perineal hygiene techniques',
        'Review catheter necessity monthly - remove ASAP when not needed',
        'Use bladder scanner before catheterization',
        'Implement cranberry supplementation protocols where appropriate',
        'Monitor for early UTI signs (confusion, fever, odor changes)'
      ],
      mdsItems: ['I2300'],
      codingTips: [
        'I2300 captures UTI regardless of treatment setting',
        'Asymptomatic bacteriuria should NOT be coded as UTI',
        'Document clear UTI diagnosis criteria (dysuria, fever, positive culture)'
      ],
      starImpact: 'Moderate - reflects infection control practices'
    },
    tags: ['uti', 'infection', 'urinary', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-catheter',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Indwelling Catheter (N026.03)',
    content: {
      measureCode: 'N026.03',
      description: 'Percent of long-stay residents with an indwelling catheter',
      numerator: 'Residents with H0100A = 1 (indwelling catheter)',
      denominator: 'Long-stay residents with valid assessment',
      exclusions: [
        { code: 'I1550=1', description: 'Neurogenic bladder diagnosis' },
        { code: 'I1650=1', description: 'Obstructive uropathy diagnosis' },
        'Missing H0100A data',
        'Admission/5-day assessments'
      ],
      covariates: [
        { code: 'H0400=2 or 3', description: 'Frequent bowel incontinence' },
        { code: 'M0300B1-D1>0', description: 'Stage II-IV pressure ulcers present' }
      ],
      nationalAverage: 1.8,
      benchmarks: { excellent: 1, good: 1.5, average: 2, poor: 3 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement catheter removal protocols (CAUTI bundle)',
        'Daily assessment of catheter necessity',
        'Trial of void before catheter insertion',
        'Use bladder scanner to assess retention',
        'Document medical necessity for all catheters',
        'Review exclusion eligibility (neurogenic bladder I1550, obstructive uropathy I1650)',
        'Implement prompted voiding programs',
        'Train staff on alternatives (external catheters, intermittent catheterization)'
      ],
      mdsItems: ['H0100A', 'I1550', 'I1650', 'H0400', 'M0300B1', 'M0300C1', 'M0300D1'],
      codingTips: [
        'Neurogenic bladder (I1550) and obstructive uropathy (I1650) are valid exclusions',
        'Suprapubic catheters count as indwelling (H0100A)',
        'Intermittent catheterization is NOT coded in H0100A'
      ],
      starImpact: 'High - directly linked to infection rates and quality perception'
    },
    tags: ['catheter', 'cauti', 'indwelling', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-falls',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Falls with Major Injury (N043.01)',
    content: {
      measureCode: 'N043.01',
      description: 'Percent of long-stay residents who experienced a fall with major injury',
      numerator: 'Residents with J1900C = 1 (fall with major injury in lookback period)',
      denominator: 'All long-stay residents with valid assessment',
      majorInjuryDefinition: 'Bone fractures, joint dislocations, closed head injuries with altered consciousness, subdural hematoma',
      nationalAverage: 3.2,
      benchmarks: { excellent: 1.5, good: 2.5, average: 3.5, poor: 5 },
      higherIsWorse: true,
      codingImpactNote: 'CRITICAL: Undercoding falls (J1800/J1900) artificially LOWERS this QM rate, making facility appear BETTER. However, undercoding creates significant health inspection risk (F641 - Accuracy of Assessments) and potential survey deficiencies.',
      suggestedActions: [
        'Complete fall risk assessment (Morse Scale) on every resident',
        'Implement individualized fall prevention care plans',
        'Review medications that increase fall risk (sedatives, antihypertensives)',
        'Ensure adequate lighting and clear pathways',
        'Use bed/chair alarms for high-risk residents',
        'Provide proper footwear (non-skid)',
        'Staff training on fall prevention techniques',
        'Post-fall huddles to identify root causes',
        'Implement Tai Chi or balance exercise programs',
        'Hip protectors for high-risk residents'
      ],
      mdsItems: ['J1800', 'J1900A', 'J1900B', 'J1900C'],
      codingTips: [
        'Accurately code ALL falls - undercoding helps QM score but creates survey risk',
        'J1800 = any fall occurred; J1900 = injury level',
        'Document fall investigations thoroughly for survey defense',
        'Minor injuries (J1900A/B) vs major (J1900C) - code appropriately'
      ],
      starImpact: 'Very High - major liability and quality indicator'
    },
    tags: ['falls', 'injury', 'safety', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-restraints',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Physical Restraints (N029.02)',
    content: {
      measureCode: 'N029.02',
      description: 'Percent of long-stay residents who were physically restrained',
      numerator: 'Residents with any P0100 item = 2 (daily restraint use)',
      denominator: 'Long-stay residents with valid assessment',
      nationalAverage: 0.4,
      benchmarks: { excellent: 0, good: 0.2, average: 0.5, poor: 1 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement restraint-free environment policies',
        'Train staff on restraint alternatives',
        'Use low beds, floor mats, and positioning devices',
        'Address underlying causes of behaviors (pain, confusion)',
        'Involve therapy in mobility and positioning assessments',
        'Document thorough assessments justifying any restraint use'
      ],
      mdsItems: ['P0100A', 'P0100B', 'P0100C', 'P0100D', 'P0100E', 'P0100F'],
      starImpact: 'High - restraint-free care is industry standard expectation'
    },
    tags: ['restraints', 'physical-restraints', 'safety', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-adl-decline',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Increased Need for Help with ADLs (N028.03)',
    content: {
      measureCode: 'N028.03',
      description: 'Percent of long-stay residents whose need for help with daily activities has increased',
      numerator: 'Residents with decline in late-loss ADLs (bed mobility, transfer, eating, toileting)',
      denominator: 'Long-stay residents with prior and current assessments',
      nationalAverage: 15.2,
      benchmarks: { excellent: 10, good: 14, average: 17, poor: 22 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement restorative nursing programs',
        'Therapy evaluations for declining residents',
        'Maintain activity levels - avoid bed rest when possible',
        'Proper positioning and mobility programs',
        'Staff training on promoting independence',
        'Monitor for reversible causes of decline (depression, medication effects)'
      ],
      mdsItems: ['G0110A', 'G0110B', 'G0110H', 'G0110I'],
      starImpact: 'Moderate - reflects restorative care quality'
    },
    tags: ['adl', 'functional-decline', 'restorative', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-walking-decline',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Ability to Walk Independently Worsened (N035.04)',
    content: {
      measureCode: 'N035.04',
      description: 'Percent of long-stay residents whose ability to walk independently worsened',
      numerator: 'Residents with decline in GG0170I (walking 10 feet) between assessments',
      denominator: 'Long-stay ambulatory residents with prior and current assessments',
      nationalAverage: 18.5,
      benchmarks: { excellent: 12, good: 16, average: 20, poor: 25 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement walking programs with therapy oversight',
        'Daily ambulation goals for capable residents',
        'Proper assistive device provision and training',
        'Fall prevention that doesn\'t restrict mobility',
        'Monitor for reversible causes (pain, medication effects, depression)',
        'Regular therapy re-evaluations'
      ],
      mdsItems: ['GG0170I'],
      starImpact: 'Moderate - reflects mobility maintenance efforts'
    },
    tags: ['walking', 'mobility', 'functional-decline', 'GG', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-depression',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Depressive Symptoms (N036.01)',
    content: {
      measureCode: 'N036.01',
      description: 'Percent of long-stay residents who have depressive symptoms',
      numerator: 'Residents with PHQ-9 total score ≥ 10 (D0300 ≥ 10)',
      denominator: 'Long-stay residents with valid PHQ-9 assessment',
      nationalAverage: 4.8,
      benchmarks: { excellent: 2, good: 4, average: 6, poor: 8 },
      higherIsWorse: true,
      suggestedActions: [
        'Train staff on PHQ-9 administration techniques',
        'Implement activity and engagement programs',
        'Social work involvement for at-risk residents',
        'Timely psychiatric/psychological referrals',
        'Monitor medication effects on mood',
        'Family involvement in care planning'
      ],
      mdsItems: ['D0300', 'D0150', 'D0160'],
      starImpact: 'Moderate - reflects psychosocial care quality'
    },
    tags: ['depression', 'mental-health', 'PHQ-9', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-weight-loss',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Weight Loss (N041.01)',
    content: {
      measureCode: 'N041.01',
      description: 'Percent of long-stay residents who lose too much weight',
      numerator: 'Residents with K0300 = 1 (5% loss in 30 days or 10% in 180 days)',
      denominator: 'Long-stay residents with valid weight data',
      nationalAverage: 6.2,
      benchmarks: { excellent: 3, good: 5, average: 7, poor: 10 },
      higherIsWorse: true,
      suggestedActions: [
        'Weekly weights with trend monitoring',
        'Dietitian involvement for declining residents',
        'Enhanced meal assistance programs',
        'Calorie count protocols when indicated',
        'Assess for dysphagia with SLP',
        'Address pain, depression, and other appetite factors',
        'Food preferences and texture modifications'
      ],
      mdsItems: ['K0300', 'K0200A', 'K0200B'],
      starImpact: 'High - weight loss is a significant clinical indicator'
    },
    tags: ['weight-loss', 'nutrition', 'malnutrition', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-flu-vaccine',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Influenza Vaccination (N027.01)',
    content: {
      measureCode: 'N027.01',
      description: 'Percent of long-stay residents assessed and given the seasonal influenza vaccine',
      numerator: 'Residents with O0250C = 1 (received vaccine during flu season)',
      denominator: 'Long-stay residents during flu season (Oct-Mar)',
      nationalAverage: 90.5,
      benchmarks: { excellent: 95, good: 92, average: 88, poor: 80 },
      higherIsWorse: false,
      suggestedActions: [
        'Implement standing orders for flu vaccines',
        'Document refusals and contraindications',
        'Staff vaccination programs',
        'Education for residents and families',
        'Track vaccination status in real-time'
      ],
      mdsItems: ['O0250A', 'O0250B', 'O0250C'],
      starImpact: 'Low - baseline expectation for infection control'
    },
    tags: ['influenza', 'vaccine', 'infection-control', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ls-pneumo-vaccine',
    category: 'Quality Measures',
    subcategory: 'Long Stay',
    title: 'LS Pneumococcal Vaccination (N030.01)',
    content: {
      measureCode: 'N030.01',
      description: 'Percent of long-stay residents assessed and given the pneumococcal vaccine',
      numerator: 'Residents with O0300B = 1 (received vaccine)',
      denominator: 'Long-stay residents eligible for vaccine',
      nationalAverage: 92.1,
      benchmarks: { excellent: 96, good: 93, average: 90, poor: 85 },
      higherIsWorse: false,
      suggestedActions: [
        'Review vaccination history on admission',
        'Implement standing orders per CDC guidelines',
        'Track PCV13 and PPSV23 series completion',
        'Document contraindications and refusals'
      ],
      mdsItems: ['O0300A', 'O0300B'],
      starImpact: 'Low - baseline infection control expectation'
    },
    tags: ['pneumococcal', 'vaccine', 'infection-control', 'long-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  // ============================================
  // QUALITY MEASURES - SHORT STAY (11 measures)
  // ============================================
  {
    id: 'qm-ss-rehospitalization',
    category: 'Quality Measures',
    subcategory: 'Short Stay',
    title: 'SS Rehospitalization (S015.01)',
    content: {
      measureCode: 'S015.01',
      description: 'Percent of short-stay residents who were re-hospitalized after SNF admission',
      numerator: 'Residents with unplanned acute hospital admission within 30 days',
      denominator: 'Short-stay residents with valid admission',
      calculationNote: 'Claims-based measure using Medicare claims data, not MDS items',
      nationalAverage: 22.5,
      benchmarks: { excellent: 15, good: 18, average: 22, poor: 28 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement INTERACT (Interventions to Reduce Acute Care Transfers)',
        'Train staff on early warning signs (SBAR communication)',
        'Establish physician/NP availability protocols',
        'Robust care transition processes',
        'Medication reconciliation on admission',
        'Root cause analysis for all readmissions',
        'Chronic disease management programs'
      ],
      starImpact: 'Very High - directly affects reimbursement under VBP'
    },
    tags: ['rehospitalization', 'readmission', 'short-stay', 'INTERACT', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ss-discharge-community',
    category: 'Quality Measures',
    subcategory: 'Short Stay',
    title: 'SS Discharge to Community (S019.02)',
    content: {
      measureCode: 'S019.02',
      description: 'Rate of successful return to home/community from SNF',
      numerator: 'Successful discharges to community without rehospitalization or death within 31 days',
      denominator: 'Short-stay residents discharged',
      calculationNote: 'CLAIMS-BASED measure using Medicare claims data. NOT based on MDS A2100 (this item does not exist in MDS 3.0).',
      criticalCorrection: 'This measure uses claims data to track post-discharge outcomes. MDS item A2100 does not exist. The measure looks at discharge destination from claims AND 31-day post-discharge outcomes.',
      exclusions: [
        'Planned readmissions (e.g., scheduled surgery)',
        'Transfers to another SNF',
        'Hospice admissions',
        'Deaths during stay'
      ],
      nationalAverage: 53.2,
      benchmarks: { excellent: 65, good: 58, average: 52, poor: 45 },
      higherIsWorse: false,
      suggestedActions: [
        'Comprehensive discharge planning starting at admission',
        'Therapy focus on home safety and independence',
        'Caregiver training programs',
        'Home health referrals and follow-up arrangements',
        'Post-discharge phone calls (48-72 hours)',
        'Medication education and reconciliation',
        'DME arrangements before discharge',
        'PCP follow-up scheduling'
      ],
      starImpact: 'High - reflects therapy effectiveness and care coordination'
    },
    tags: ['discharge', 'community', 'home', 'claims-based', 'short-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ss-function-improvement',
    category: 'Quality Measures',
    subcategory: 'Short Stay',
    title: 'SS Functional Improvement (S024.02 / Expected GG Score)',
    content: {
      measureCode: 'S024.02',
      description: 'Percent of short-stay residents who improve in function',
      numerator: 'Residents with improved GG scores (self-care + mobility) at discharge vs. admission',
      denominator: 'Short-stay residents with valid GG assessments',
      ggScoreExplanation: 'GG items measure self-care (GG0130) and mobility (GG0170) on 6-point scale. Total possible is 150 points combined.',
      expectedScoreCalculation: {
        description: 'Expected discharge GG score is risk-adjusted based on:',
        covariates: [
          'Admission GG function score (strongest predictor)',
          'Age',
          'Primary diagnosis/DRG',
          'Comorbidities',
          'Cognitive status',
          'Prior living situation'
        ],
        formula: 'CMS uses regression model: Expected GG = β0 + β1(Admission GG) + β2(Age) + β3(DRG) + Σβn(Covariates)'
      },
      nationalAverage: 74.5,
      benchmarks: { excellent: 85, good: 78, average: 72, poor: 65 },
      higherIsWorse: false,
      suggestedActions: [
        'Maximize therapy intensity (Medicare Part A allows significant therapy)',
        'Accurate GG scoring on admission to establish true baseline',
        'Therapy goals aligned with prior level of function',
        'Early mobilization protocols',
        'Pain management to enable therapy participation',
        'Family involvement in therapy sessions',
        'Discharge GG assessment timing - capture peak function'
      ],
      mdsItems: ['GG0130A-GG0130J', 'GG0170A-GG0170S'],
      codingTips: [
        'Admission GG must accurately reflect true function (don\'t undercode)',
        'Discharge GG should capture actual achieved function',
        'Document barriers to improvement (medical complications, refusals)',
        'Risk adjustment accounts for case mix - accurate coding is essential'
      ],
      starImpact: 'Very High - core measure for therapy effectiveness'
    },
    tags: ['function', 'improvement', 'GG', 'therapy', 'short-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  {
    id: 'qm-ss-ed-visits',
    category: 'Quality Measures',
    subcategory: 'Short Stay',
    title: 'SS Emergency Department Visits (S016.01)',
    content: {
      measureCode: 'S016.01',
      description: 'Percent of short-stay residents who had an outpatient emergency department visit',
      numerator: 'Residents with ED visit not resulting in admission',
      denominator: 'Short-stay residents',
      calculationNote: 'Claims-based measure',
      nationalAverage: 11.2,
      benchmarks: { excellent: 7, good: 10, average: 12, poor: 16 },
      higherIsWorse: true,
      suggestedActions: [
        'Implement INTERACT Stop and Watch tool',
        'On-call physician/NP availability',
        'IV therapy capabilities',
        'Lab and diagnostic capabilities on-site',
        'Staff training on when ED is truly necessary'
      ],
      starImpact: 'Moderate - reflects clinical capabilities'
    },
    tags: ['emergency', 'ED', 'hospital', 'short-stay', 'QM'],
    source: 'CMS MDS 3.0 QM User\'s Manual v15.0'
  },
  // ============================================
  // FIVE-STAR RATING SYSTEM
  // ============================================
  {
    id: 'rating-system-overview',
    category: 'Rating System',
    subcategory: 'Overview',
    title: 'CMS Five-Star Rating System Components & Weights',
    content: {
      overview: 'The Five-Star Quality Rating System combines three domains to create an overall facility rating',
      domains: {
        healthInspections: {
          weight: '53% of overall score (approximately)',
          description: 'Based on deficiency citations from standard surveys and complaint investigations',
          components: ['Standard health surveys (annual)', 'Complaint investigations', 'Revisit surveys'],
          calculation: 'Points assigned per deficiency based on scope (isolated/pattern/widespread) and severity (levels A-L)'
        },
        staffing: {
          weight: '32% of overall score (approximately)',
          description: 'Based on PBJ (Payroll-Based Journal) data for nurse staffing levels',
          components: ['Total nursing HPRD', 'RN HPRD', 'Weekend staffing adjustment', 'Turnover adjustment'],
          thresholds: {
            '5-star': 'Total ≥4.09, RN ≥0.75',
            '4-star': 'Total ≥3.88, RN ≥0.55',
            '3-star': 'Total ≥3.35, RN ≥0.50',
            '2-star': 'Total ≥2.82, RN ≥0.48',
            '1-star': 'Total <2.82, RN <0.48'
          }
        },
        qualityMeasures: {
          weight: '15% of overall score (approximately)',
          description: 'Based on MDS-derived quality measures',
          importantCorrection: 'QM rating does NOT have a fixed 15% weight. Instead, it adjusts the overall rating after staffing adjustment: QM=5 stars adds +1 to overall, QM=1 star subtracts -1 from overall.',
          measures: {
            longStay: 17,
            shortStay: 11
          },
          cap: 'If health inspection rating = 1 star, maximum overall upgrade from QM is +1 star'
        }
      },
      overallCalculation: [
        '1. Start with Health Inspection rating (1-5 stars)',
        '2. Add Staffing adjustment (+1 if staffing 4-5 stars and certain criteria met)',
        '3. Add QM adjustment (+1 if QM=5 stars, -1 if QM=1 star)',
        '4. Apply caps (max 5, min 1; health inspection limits apply)'
      ],
      criticalNote: 'The "15% weight" commonly cited is misleading. QM rating provides a +/- 1 star adjustment to the overall rating, not a weighted average contribution.'
    },
    tags: ['five-star', 'rating-system', 'calculation', 'weights', 'overview'],
    source: 'CMS Five-Star Technical Users\' Guide',
    source_url: 'https://www.cms.gov/medicare/provider-enrollment-and-certification/certificationandcomplianc/downloads/usersguide.pdf'
  },
  // ============================================
  // MDS CODING GUIDANCE
  // ============================================
  {
    id: 'mds-coding-accuracy',
    category: 'MDS Coding',
    subcategory: 'Accuracy',
    title: 'MDS Coding Accuracy and Quality Measure Impact',
    content: {
      overview: 'Understanding how MDS coding affects quality measures, star ratings, and survey outcomes',
      criticalPrinciple: 'MDS accuracy is required by regulation (F641) and impacts multiple areas beyond quality measures',
      codingImpacts: {
        qualityMeasures: {
          description: 'MDS items directly calculate QM numerators and denominators',
          examples: [
            { item: 'J1800/J1900', qm: 'Falls with Major Injury', impact: 'Undercoding falls LOWERS the QM rate (appears better), but creates survey risk' },
            { item: 'N0415A', qm: 'Antipsychotic Use', impact: 'Must accurately reflect 7-day lookback' },
            { item: 'M0300', qm: 'Pressure Ulcers', impact: 'Stage accuracy affects risk-adjustment' },
            { item: 'GG items', qm: 'Functional Improvement', impact: 'Admission underscoring inflates improvement rates' }
          ]
        },
        reimubursement: {
          description: 'PDPM classifications depend on MDS accuracy',
          risk: 'Inaccurate coding can trigger Recovery Audit Contractor (RAC) audits'
        },
        surveys: {
          description: 'Surveyors compare MDS data to medical records and observations',
          fTag: 'F641 - Accuracy of Assessments',
          consequences: [
            'Deficiency citations for inaccurate MDS',
            'Pattern of inaccuracy can trigger Immediate Jeopardy',
            'Affects survey sampling methodology'
          ]
        }
      },
      commonCodingErrors: [
        {
          error: 'Undercoding falls (J1800/J1900)',
          qmImpact: 'Lowers falls QM rate - facility appears better',
          surveyRisk: 'HIGH - surveyors review incident reports against MDS',
          guidance: 'Code all falls accurately; document investigations thoroughly'
        },
        {
          error: 'Overcoding diagnoses for exclusions',
          qmImpact: 'Reduces denominator, improves rate',
          surveyRisk: 'HIGH - diagnosis must be documented by physician',
          guidance: 'Only code confirmed diagnoses with physician documentation'
        },
        {
          error: 'Inaccurate admission GG scores',
          qmImpact: 'Affects functional improvement QM and PDPM',
          surveyRisk: 'MODERATE - therapy documentation must support',
          guidance: 'GG reflects usual performance, not best day'
        }
      ],
      bestPractices: [
        'Train MDS coordinators on QM specifications',
        'Implement triple-check process (MDS, billing, medical record)',
        'Regular accuracy audits with inter-rater reliability testing',
        'Keep current with RAI Manual updates and QSO memos'
      ]
    },
    tags: ['mds', 'coding', 'accuracy', 'F641', 'survey', 'QM'],
    source: 'CMS RAI Manual & State Operations Manual',
    source_url: 'https://www.cms.gov/medicare/quality/nursing-home-improvement/resident-assessment-instrument-rai-mds-30-manual'
  },
  // ============================================
  // POINT RIGHT INSPIRED - MDS SCRUBBER
  // ============================================
  {
    id: 'tool-mds-scrubber',
    category: 'Tools',
    subcategory: 'MDS Validation',
    title: 'MDS Scrubber - Pre-Submission Validation',
    content: {
      description: 'Real-time MDS validation tool to identify errors and optimize quality measures before submission',
      inspired_by: 'PointRight MDS Scrubber functionality',
      capabilities: [
        'Real-time QM preview before submission',
        'Expected GG discharge function score calculator',
        'Diagnosis-exclusion validation',
        'Internal consistency checks',
        'What-If scenarios for coding changes'
      ],
      ggFunctionCalculator: {
        purpose: 'Calculate expected discharge GG score for short-stay QM',
        inputs: [
          'Admission GG self-care score (GG0130)',
          'Admission GG mobility score (GG0170)',
          'Age',
          'Primary diagnosis category',
          'Comorbidities',
          'Cognitive status (BIMS/C0500)'
        ],
        output: 'Risk-adjusted expected discharge score (target for improvement QM)',
        maxScore: 150,
        formula: 'Uses CMS regression coefficients (simplified): Expected = 45 + (0.7 * Admission_GG) + age_adjustment + dx_adjustment'
      },
      qmPreview: {
        description: 'Shows how current MDS will affect facility QM rates',
        features: [
          'Numerator/denominator impact',
          'Rate change prediction',
          'Star rating impact estimate',
          'Comparison to current facility rate'
        ]
      },
      validationRules: [
        { rule: 'Antipsychotic exclusions', check: 'Verify I6000/I5350/I5250 documented if claiming exclusion' },
        { rule: 'Pressure ulcer staging', check: 'M0300 items consistent with wound documentation' },
        { rule: 'Fall coding', check: 'J1800/J1900 consistent with incident reports' },
        { rule: 'GG consistency', check: 'Admission and discharge GG scores supported by therapy notes' },
        { rule: 'Catheter exclusions', check: 'I1550/I1650 documented if claiming exclusion' }
      ]
    },
    tags: ['mds', 'scrubber', 'validation', 'QM', 'preview', 'tool'],
    source: 'PointRight-inspired functionality'
  },
  // ============================================
  // UB WATCH INSPIRED - TRIPLE CHECK
  // ============================================
  {
    id: 'tool-triple-check',
    category: 'Tools',
    subcategory: 'Billing Accuracy',
    title: 'Triple Check Tool - Billing Accuracy & ADR Prevention',
    content: {
      description: 'Automated review of UB-04 claims against MDS and clinical documentation to prevent denials',
      inspired_by: 'UB Watch Triple Check functionality',
      purpose: [
        'Prevent ADR (Additional Documentation Request) denials',
        'Identify MDS/billing mismatches before submission',
        'Reduce takeback risk',
        'Ensure PDPM accuracy'
      ],
      checkPoints: [
        {
          area: 'Therapy minutes',
          mdsItem: 'O0400',
          billingItem: 'Revenue codes 042x-044x',
          check: 'Therapy minutes on MDS match billed therapy services'
        },
        {
          area: 'IV therapy',
          mdsItem: 'O0100K2',
          billingItem: 'Revenue code 026x',
          check: 'IV therapy coded on MDS when billed'
        },
        {
          area: 'Nursing component',
          mdsItem: 'Various (Section G, H, I, J)',
          billingItem: 'PDPM nursing classification',
          check: 'Nursing complexity supported by MDS ADL, behavioral, clinical items'
        },
        {
          area: 'NTA component',
          mdsItem: 'Section O medications',
          billingItem: 'PDPM NTA classification',
          check: 'NTA medications/treatments on MDS match clinical orders'
        }
      ],
      denialPreventionRules: [
        'Prior authorization documentation',
        'Medical necessity criteria met',
        'Therapy certification/recertification timing',
        'Skilled level of care documentation',
        'Discharge planning documentation'
      ],
      workflowIntegration: [
        'Flag mismatches for review before claim submission',
        'Assign items to specific team members for resolution',
        'Track resolution status and patterns',
        'Generate audit trail for compliance'
      ]
    },
    tags: ['billing', 'triple-check', 'ADR', 'UB-04', 'PDPM', 'denial-prevention', 'tool'],
    source: 'UB Watch-inspired functionality'
  },
  // ============================================
  // STAFFING REQUIREMENTS
  // ============================================
  {
    id: 'staffing-hprd-thresholds',
    category: 'Staffing',
    subcategory: 'HPRD Thresholds',
    title: 'CMS Staffing Thresholds for Star Ratings',
    content: {
      overview: 'Hours Per Resident Day (HPRD) thresholds determine the staffing star rating',
      dataSource: 'Payroll-Based Journal (PBJ) submissions',
      thresholds: {
        total_nursing: {
          '5-star': '≥ 4.09 HPRD',
          '4-star': '≥ 3.88 HPRD',
          '3-star': '≥ 3.35 HPRD',
          '2-star': '≥ 2.82 HPRD',
          '1-star': '< 2.82 HPRD'
        },
        rn_only: {
          '5-star': '≥ 0.75 HPRD',
          '4-star': '≥ 0.55 HPRD',
          '3-star': '≥ 0.50 HPRD',
          '2-star': '≥ 0.48 HPRD',
          '1-star': '< 0.48 HPRD'
        }
      },
      adjustments: [
        {
          type: 'Weekend adjustment',
          description: 'Penalty for significantly lower weekend staffing',
          threshold: 'Weekend HPRD < 93% of weekday HPRD triggers adjustment'
        },
        {
          type: 'Turnover adjustment',
          description: 'High turnover reduces effective rating',
          threshold: 'RN turnover > 50% or Total turnover > 55% triggers adjustment'
        },
        {
          type: 'Administrator turnover',
          description: 'Multiple administrator changes indicate instability',
          threshold: 'Multiple DON/Administrator changes in 12 months'
        }
      ],
      calculationSteps: [
        '1. Calculate average daily census',
        '2. Sum all nursing hours by category (RN, LPN, CNA)',
        '3. Divide hours by resident days to get HPRD',
        '4. Apply case-mix adjustment',
        '5. Compare to thresholds',
        '6. Apply adjustments (weekend, turnover)'
      ],
      improvementStrategies: [
        'Optimize scheduling to meet HPRD on all days including weekends',
        'Retention programs to reduce turnover penalties',
        'Accurate PBJ reporting - don\'t leave hours unreported',
        'Cross-train staff to fill gaps',
        'PRN pool development'
      ]
    },
    tags: ['staffing', 'HPRD', 'PBJ', 'thresholds', 'nursing', 'turnover'],
    source: 'CMS Staffing Star Rating Methodology',
    source_url: 'https://www.cms.gov/medicare/quality/nursing-home-improvement/staffing-data-submission-pbj'
  },
  // ============================================
  // HEALTH INSPECTION SCORING
  // ============================================
  {
    id: 'health-inspection-scoring',
    category: 'Health Inspections',
    subcategory: 'Scoring',
    title: 'Health Inspection Point System',
    content: {
      overview: 'Deficiencies are assigned points based on scope and severity; points determine star rating',
      scopeDefinitions: {
        isolated: 'Affects 1-2 residents or limited area',
        pattern: 'Affects 3+ residents or multiple areas',
        widespread: 'Pervasive throughout facility or affects large proportion'
      },
      severityLevels: {
        A: { points: 0, description: 'No actual harm, potential for minimal harm' },
        B: { points: 0, description: 'No actual harm, potential for minimal harm (isolated)' },
        C: { points: 0, description: 'No actual harm, potential for minimal harm (pattern)' },
        D: { points: 4, description: 'No actual harm, potential for more than minimal harm (isolated)' },
        E: { points: 8, description: 'No actual harm, potential for more than minimal harm (pattern)' },
        F: { points: 16, description: 'No actual harm, potential for more than minimal harm (widespread)' },
        G: { points: 20, description: 'Actual harm, not immediate jeopardy (isolated)' },
        H: { points: 35, description: 'Actual harm, not immediate jeopardy (pattern)' },
        I: { points: 45, description: 'Actual harm, not immediate jeopardy (widespread)' },
        J: { points: 50, description: 'Immediate jeopardy (isolated)' },
        K: { points: 100, description: 'Immediate jeopardy (pattern)' },
        L: { points: 150, description: 'Immediate jeopardy (widespread)' }
      },
      starRatingImpact: {
        description: 'Lower total points = higher star rating',
        thresholds: 'Varies by state due to curve grading',
        weighting: 'Recent surveys weighted more heavily; points decay over 3 years'
      },
      commonDeficiencies: [
        { tag: 'F689', description: 'Free from Accident Hazards', frequency: 'Very common' },
        { tag: 'F684', description: 'Quality of Care', frequency: 'Very common' },
        { tag: 'F686', description: 'Treatment/Services for Pressure Ulcers', frequency: 'Common' },
        { tag: 'F880', description: 'Infection Prevention and Control', frequency: 'Very common' },
        { tag: 'F812', description: 'Food Safety', frequency: 'Common' }
      ]
    },
    tags: ['health-inspection', 'deficiency', 'F-tag', 'scoring', 'survey'],
    source: 'CMS State Operations Manual',
    source_url: 'https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/som107ap_pp_guidelines_ltcf.pdf'
  }
];

export async function POST(request: NextRequest) {
  try {
    const results = [];

    for (const entry of knowledgeEntries) {
      try {
        await sql`
          INSERT INTO "FiveStarKnowledge" (id, category, subcategory, title, content, tags, source, source_url, "updatedAt")
          VALUES (
            ${entry.id},
            ${entry.category},
            ${entry.subcategory},
            ${entry.title},
            ${JSON.stringify(entry.content)}::jsonb,
            ${entry.tags},
            ${entry.source},
            ${entry.source_url || null},
            NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            category = EXCLUDED.category,
            subcategory = EXCLUDED.subcategory,
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            tags = EXCLUDED.tags,
            source = EXCLUDED.source,
            source_url = EXCLUDED.source_url,
            "updatedAt" = NOW()
        `;
        results.push({ id: entry.id, status: 'success' });
      } catch (error) {
        results.push({ id: entry.id, status: 'error', error: String(error) });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      message: `Knowledge base seeded: ${successCount} success, ${errorCount} errors`,
      totalEntries: knowledgeEntries.length,
      results
    });
  } catch (error) {
    console.error('Knowledge seed error:', error);
    return NextResponse.json({ error: 'Failed to seed knowledge base', details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed the knowledge base with corrected QM data',
    entriesAvailable: knowledgeEntries.length,
    categories: [...new Set(knowledgeEntries.map(e => e.category))]
  });
}
