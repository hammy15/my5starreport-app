'use client';

import { useState, useCallback } from 'react';
import {
  X,
  Calculator,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  Star,
  Sparkles,
  RotateCcw,
  Download,
  Printer,
  HelpCircle,
} from 'lucide-react';
import {
  calculateExpectedGGScore,
  type GGCalculatorInput,
  type GGCalculatorResult,
  ggDischargeFunctionScore,
  qmExclusionsReference,
} from '@/lib/cms-algorithms';

interface MDSScrubberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// GG Item component for input
function GGItemInput({
  label,
  code,
  value,
  onChange,
  isDischarge = false,
}: {
  label: string;
  code: string;
  value: number | null;
  onChange: (val: number | null) => void;
  isDischarge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0">
      <div className="flex-1">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        <span className="text-xs text-[var(--foreground-muted)] ml-2">({code})</span>
      </div>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value))}
        className="w-20 px-2 py-1 text-sm rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      >
        {isDischarge && <option value="">N/A</option>}
        <option value="1">1 - Dependent</option>
        <option value="2">2 - Max Assist</option>
        <option value="3">3 - Mod Assist</option>
        <option value="4">4 - Min Assist</option>
        <option value="5">5 - Setup/CGA</option>
        <option value="6">6 - Independent</option>
      </select>
    </div>
  );
}

// Score display card
function ScoreCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="card-neumorphic p-4 text-center">
      <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-[var(--foreground)]">{value}</div>
      <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide">{title}</div>
      {subtitle && <div className="text-xs text-cyan-600 mt-1">{subtitle}</div>}
    </div>
  );
}

// Expandable section component
function ExpandableSection({
  title,
  icon: Icon,
  children,
  defaultExpanded = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="card-neumorphic overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--background)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-cyan-500" />
          <span className="font-semibold text-[var(--foreground)]">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[var(--foreground-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
        )}
      </button>
      {isExpanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function MDSScrubberModal({ isOpen, onClose }: MDSScrubberModalProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'exclusions' | 'validation'>('calculator');
  const [result, setResult] = useState<GGCalculatorResult | null>(null);

  // Form state for GG Calculator
  const [admissionScores, setAdmissionScores] = useState({
    eating: 2,
    oralHygiene: 2,
    toiletingHygiene: 2,
    sitToLying: 2,
    lyingToSitting: 2,
    sitToStand: 2,
    transfer: 2,
    toiletTransfer: 2,
    walk10ft: 2,
    walk50ft: 2,
  });

  const [dischargeScores, setDischargeScores] = useState<{
    eating: number | null;
    oralHygiene: number | null;
    toiletingHygiene: number | null;
    sitToLying: number | null;
    lyingToSitting: number | null;
    sitToStand: number | null;
    transfer: number | null;
    toiletTransfer: number | null;
    walk10ft: number | null;
    walk50ft: number | null;
  }>({
    eating: null,
    oralHygiene: null,
    toiletingHygiene: null,
    sitToLying: null,
    lyingToSitting: null,
    sitToStand: null,
    transfer: null,
    toiletTransfer: null,
    walk10ft: null,
    walk50ft: null,
  });

  const [patientInfo, setPatientInfo] = useState({
    age: 75,
    primaryDiagnosis: 'Hip Fracture',
    bims: 12,
    lengthOfStay: 21,
    comorbidities: [] as string[],
  });

  const handleCalculate = useCallback(() => {
    const input: GGCalculatorInput = {
      admissionGGScores: admissionScores,
      dischargeGGScores: Object.fromEntries(
        Object.entries(dischargeScores).filter(([, v]) => v !== null)
      ) as Partial<typeof admissionScores>,
      age: patientInfo.age,
      primaryDiagnosis: patientInfo.primaryDiagnosis,
      bims: patientInfo.bims,
      comorbidities: patientInfo.comorbidities,
      lengthOfStay: patientInfo.lengthOfStay,
    };

    const calculatedResult = calculateExpectedGGScore(input);
    setResult(calculatedResult);
  }, [admissionScores, dischargeScores, patientInfo]);

  const handleReset = () => {
    setAdmissionScores({
      eating: 2,
      oralHygiene: 2,
      toiletingHygiene: 2,
      sitToLying: 2,
      lyingToSitting: 2,
      sitToStand: 2,
      transfer: 2,
      toiletTransfer: 2,
      walk10ft: 2,
      walk50ft: 2,
    });
    setDischargeScores({
      eating: null,
      oralHygiene: null,
      toiletingHygiene: null,
      sitToLying: null,
      lyingToSitting: null,
      sitToStand: null,
      transfer: null,
      toiletTransfer: null,
      walk10ft: null,
      walk50ft: null,
    });
    setPatientInfo({
      age: 75,
      primaryDiagnosis: 'Hip Fracture',
      bims: 12,
      lengthOfStay: 21,
      comorbidities: [],
    });
    setResult(null);
  };

  const toggleComorbidity = (comorbidity: string) => {
    setPatientInfo((prev) => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(comorbidity)
        ? prev.comorbidities.filter((c) => c !== comorbidity)
        : [...prev.comorbidities, comorbidity],
    }));
  };

  if (!isOpen) return null;

  const ggItems = [
    { key: 'eating', label: 'Eating', code: 'GG0130A' },
    { key: 'oralHygiene', label: 'Oral Hygiene', code: 'GG0130B' },
    { key: 'toiletingHygiene', label: 'Toileting Hygiene', code: 'GG0130C' },
    { key: 'sitToLying', label: 'Sit to Lying', code: 'GG0170B' },
    { key: 'lyingToSitting', label: 'Lying to Sitting', code: 'GG0170C' },
    { key: 'sitToStand', label: 'Sit to Stand', code: 'GG0170D' },
    { key: 'transfer', label: 'Chair/Bed Transfer', code: 'GG0170E' },
    { key: 'toiletTransfer', label: 'Toilet Transfer', code: 'GG0170F' },
    { key: 'walk10ft', label: 'Walk 10 Feet', code: 'GG0170G' },
    { key: 'walk50ft', label: 'Walk 50 Feet with Turns', code: 'GG0170I' },
  ];

  const comorbidityOptions = [
    'Diabetes',
    'Heart Failure / CHF',
    'COPD / Pulmonary',
    'Renal Disease / Kidney',
    'Dementia / Alzheimers',
  ];

  const diagnosisOptions = [
    'Hip Fracture',
    'Knee Replacement',
    'Joint Replacement',
    'Stroke / CVA',
    'Medical Complex',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden card-neumorphic">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">My5Star Scrubber</h2>
                <p className="text-cyan-100 text-sm">MDS Validation + Expected GG Calculator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'calculator', label: 'GG Calculator', icon: Calculator },
              { id: 'exclusions', label: 'QM Exclusions', icon: Info },
              { id: 'validation', label: 'Validation Rules', icon: CheckCircle2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-cyan-700'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              {/* Result Summary (if calculated) */}
              {result && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                  <ScoreCard
                    title="Observed Score"
                    value={result.observedScore ?? 'N/A'}
                    subtitle="Sum of 10 GG items"
                    icon={Target}
                    color="bg-cyan-500"
                  />
                  <ScoreCard
                    title="Expected Score"
                    value={result.expectedScore}
                    subtitle="OLS Regression"
                    icon={Calculator}
                    color="bg-blue-500"
                  />
                  <ScoreCard
                    title="% Meeting Expected"
                    value={`${result.percentMeetingExpected}%`}
                    subtitle={result.observedScore !== null && result.observedScore >= result.expectedScore ? 'Meeting target' : 'Below target'}
                    icon={TrendingUp}
                    color={result.percentMeetingExpected >= 100 ? 'bg-green-500' : 'bg-orange-500'}
                  />
                  <ScoreCard
                    title="Projected QM Points"
                    value={result.projectedQMPoints}
                    subtitle={result.projectedStarImpact}
                    icon={Star}
                    color={result.projectedQMPoints >= 100 ? 'bg-green-500' : result.projectedQMPoints >= 70 ? 'bg-yellow-500' : 'bg-red-500'}
                  />
                </div>
              )}

              {/* Recommendations */}
              {result && result.recommendations.length > 0 && (
                <div className="card-neumorphic p-4 bg-amber-50 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Recommendations</span>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                        <span className="text-amber-500">-</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Patient Demographics */}
              <ExpandableSection title="Patient Demographics" icon={Info} defaultExpanded={!result}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Age</label>
                    <input
                      type="number"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo((p) => ({ ...p, age: parseInt(e.target.value) || 0 }))}
                      className="input-neumorphic"
                      min="18"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Primary Diagnosis</label>
                    <select
                      value={patientInfo.primaryDiagnosis}
                      onChange={(e) => setPatientInfo((p) => ({ ...p, primaryDiagnosis: e.target.value }))}
                      className="input-neumorphic"
                    >
                      {diagnosisOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">BIMS Score (0-15)</label>
                    <input
                      type="number"
                      value={patientInfo.bims}
                      onChange={(e) => setPatientInfo((p) => ({ ...p, bims: parseInt(e.target.value) || 0 }))}
                      className="input-neumorphic"
                      min="0"
                      max="15"
                    />
                    <div className="text-xs text-[var(--foreground-muted)] mt-1">
                      {patientInfo.bims >= 13 ? 'Cognitively Intact' : patientInfo.bims >= 8 ? 'Moderate Impairment' : 'Severe Impairment'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Length of Stay (days)</label>
                    <input
                      type="number"
                      value={patientInfo.lengthOfStay}
                      onChange={(e) => setPatientInfo((p) => ({ ...p, lengthOfStay: parseInt(e.target.value) || 0 }))}
                      className="input-neumorphic"
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Comorbidities</label>
                    <div className="flex flex-wrap gap-2">
                      {comorbidityOptions.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleComorbidity(c)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            patientInfo.comorbidities.includes(c)
                              ? 'bg-cyan-500 text-white'
                              : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-cyan-100 dark:hover:bg-cyan-900/30'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ExpandableSection>

              {/* GG Scores Entry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admission Scores */}
                <ExpandableSection title="Admission GG Scores (Required)" icon={Target} defaultExpanded={!result}>
                  <div className="mt-2">
                    {ggItems.map((item) => (
                      <GGItemInput
                        key={item.key}
                        label={item.label}
                        code={item.code + '1'}
                        value={admissionScores[item.key as keyof typeof admissionScores]}
                        onChange={(val) =>
                          setAdmissionScores((prev) => ({
                            ...prev,
                            [item.key]: val ?? 1,
                          }))
                        }
                      />
                    ))}
                    <div className="mt-3 p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
                      <div className="text-sm font-medium text-cyan-700 dark:text-cyan-400">
                        Admission Sum: {Object.values(admissionScores).reduce((a, b) => a + b, 0)} / 60
                      </div>
                    </div>
                  </div>
                </ExpandableSection>

                {/* Discharge Scores */}
                <ExpandableSection title="Discharge GG Scores (Optional)" icon={TrendingUp} defaultExpanded={!result}>
                  <div className="mt-2">
                    <div className="text-xs text-[var(--foreground-muted)] mb-3 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Leave blank to use imputed values based on expected improvement
                    </div>
                    {ggItems.map((item) => (
                      <GGItemInput
                        key={item.key}
                        label={item.label}
                        code={item.code + '3'}
                        value={dischargeScores[item.key as keyof typeof dischargeScores]}
                        onChange={(val) =>
                          setDischargeScores((prev) => ({
                            ...prev,
                            [item.key]: val,
                          }))
                        }
                        isDischarge
                      />
                    ))}
                    <div className="mt-3 p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
                      <div className="text-sm font-medium text-cyan-700 dark:text-cyan-400">
                        Discharge Sum:{' '}
                        {Object.values(dischargeScores).filter((v) => v !== null).length > 0
                          ? Object.values(dischargeScores).filter((v) => v !== null).reduce((a, b) => a! + (b ?? 0), 0)
                          : 'Will be calculated'}
                      </div>
                    </div>
                  </div>
                </ExpandableSection>
              </div>

              {/* Item Breakdown (if calculated) */}
              {result && (
                <ExpandableSection title="Item-by-Item Breakdown" icon={FileCheck} defaultExpanded>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-[var(--border-color)]">
                          <th className="py-2 font-medium text-[var(--foreground)]">Item</th>
                          <th className="py-2 font-medium text-[var(--foreground)] text-center">Admission</th>
                          <th className="py-2 font-medium text-[var(--foreground)] text-center">Discharge</th>
                          <th className="py-2 font-medium text-[var(--foreground)] text-center">Change</th>
                          <th className="py-2 font-medium text-[var(--foreground)] text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.itemBreakdown.map((item, idx) => (
                          <tr key={idx} className="border-b border-[var(--border-color)] last:border-0">
                            <td className="py-2 text-[var(--foreground)]">
                              {ggItems.find((g) => g.key === item.item)?.label || item.item}
                              {item.imputed && (
                                <span className="ml-1 text-xs text-amber-500">(imputed)</span>
                              )}
                            </td>
                            <td className="py-2 text-center text-[var(--foreground)]">{item.admission}</td>
                            <td className="py-2 text-center text-[var(--foreground)]">{item.discharge}</td>
                            <td className={`py-2 text-center font-medium ${
                              item.improvement > 0 ? 'text-green-600' : item.improvement < 0 ? 'text-red-600' : 'text-[var(--foreground-muted)]'
                            }`}>
                              {item.improvement > 0 ? '+' : ''}{item.improvement}
                            </td>
                            <td className="py-2 text-center">
                              {item.improvement > 0 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 inline" />
                              ) : item.improvement < 0 ? (
                                <AlertTriangle className="w-4 h-4 text-red-500 inline" />
                              ) : (
                                <span className="text-[var(--foreground-muted)]">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ExpandableSection>
              )}

              {/* Calculate Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleCalculate}
                  className="btn-neumorphic btn-neumorphic-primary px-8 py-3 flex items-center gap-2 text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Calculate Expected GG Score
                </button>
              </div>
            </div>
          )}

          {activeTab === 'exclusions' && (
            <div className="space-y-4">
              <div className="text-sm text-[var(--foreground-muted)] mb-4">
                Reference guide for CMS Quality Measure exclusions based on MDS v18.0 / January 2026 Technical Users Guide.
              </div>

              {Object.entries(qmExclusionsReference).map(([code, data]) => (
                <div key={code} className="card-neumorphic p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded text-xs font-mono mb-1">
                        {code}
                      </span>
                      <h3 className="font-semibold text-[var(--foreground)]">{data.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide mb-1">
                        Exclusions
                      </div>
                      <ul className="space-y-1">
                        {data.exclusions.map((exc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-[var(--foreground)]">
                              <code className="text-xs bg-[var(--background)] px-1 rounded">{exc.code}</code>
                              {' - '}{exc.description}
                              {'note' in exc && (
                                <span className="text-cyan-600 text-xs ml-1">({exc.note})</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {'notExcluded' in data && data.notExcluded && (
                      <div>
                        <div className="text-xs font-medium text-red-500 uppercase tracking-wide mb-1">
                          NOT Excluded
                        </div>
                        <ul className="space-y-1">
                          {(data.notExcluded as string[]).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-[var(--foreground)]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {'covariates' in data && data.covariates && (
                      <div>
                        <div className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1">
                          Covariates
                        </div>
                        <ul className="space-y-1">
                          {(data.covariates as Array<{ code: string; description: string }>).map((cov, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-[var(--foreground)]">
                                <code className="text-xs bg-[var(--background)] px-1 rounded">{cov.code}</code>
                                {' - '}{cov.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {'criticalNote' in data && (
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-700 dark:text-amber-400">
                        <strong>Critical:</strong> {data.criticalNote}
                      </div>
                    )}

                    {'claimsValidation' in data && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
                        <strong>Claims Validation:</strong> {data.claimsValidation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-4">
              <div className="text-sm text-[var(--foreground-muted)] mb-4">
                MDS validation rules to ensure accurate coding and avoid common errors that impact star ratings.
              </div>

              {/* GG Discharge Function Rules */}
              <div className="card-neumorphic p-4">
                <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-cyan-500" />
                  GG Discharge Function Score (S024.02)
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="font-medium text-[var(--foreground)] mb-1">Formula</div>
                    <code className="text-xs text-cyan-600">Expected = {ggDischargeFunctionScore.expectedScoreCalculation.formula}</code>
                    <div className="text-[var(--foreground-muted)] mt-1">
                      Uses {ggDischargeFunctionScore.expectedScoreCalculation.covariateCount} covariates including age, diagnosis, cognitive status, and admission function.
                    </div>
                  </div>
                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="font-medium text-[var(--foreground)] mb-1">Valid GG Codes</div>
                    <div className="flex gap-2 flex-wrap">
                      {ggDischargeFunctionScore.imputationMethod.validCodes.map((code) => (
                        <span key={code} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="font-medium text-[var(--foreground)] mb-1">Invalid Codes (Require Imputation)</div>
                    <div className="flex gap-2 flex-wrap">
                      {ggDischargeFunctionScore.imputationMethod.invalidCodes.map((code) => (
                        <span key={code} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Coding Errors */}
              <div className="card-neumorphic p-4">
                <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Common Coding Errors
                </h3>
                <ul className="space-y-2">
                  {[
                    { error: 'Using 07 (Refused) without documentation', fix: 'Ensure resident refusal is documented; consider if activity was truly offered' },
                    { error: 'Coding 88 (Not Attempted) inappropriately', fix: 'Only use when activity is not applicable to the resident' },
                    { error: 'Missing GG items at discharge', fix: 'All 10 GG items required; missing items trigger imputation with penalty' },
                    { error: 'Inconsistent scores between admission and discharge', fix: 'Review if decline is justified or represents coding error' },
                    { error: 'Not capturing partial improvements', fix: 'Document small gains (e.g., 2 to 3) to show functional improvement' },
                  ].map((item, idx) => (
                    <li key={idx} className="p-3 bg-[var(--background)] rounded-lg">
                      <div className="font-medium text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {item.error}
                      </div>
                      <div className="text-sm text-[var(--foreground)] mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {item.fix}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusion Criteria for GG */}
              <div className="card-neumorphic p-4">
                <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-blue-500" />
                  GG Measure Exclusions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ggDischargeFunctionScore.exclusions.map((exc, idx) => (
                    <div key={idx} className="p-3 bg-[var(--background)] rounded-lg">
                      <code className="text-xs text-cyan-600">{exc.code}</code>
                      <div className="text-sm text-[var(--foreground)] mt-1">{exc.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
