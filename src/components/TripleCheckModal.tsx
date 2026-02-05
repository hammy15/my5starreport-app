'use client';

import { useState, useCallback } from 'react';
import {
  X,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Target,
  DollarSign,
  Calendar,
  Clock,
  Clipboard,
  ClipboardCheck,
  FileText,
  Users,
  Pill,
  Activity,
  Stethoscope,
  Brain,
  Heart,
  Zap,
  Shield,
  RotateCcw,
  Download,
  Printer,
  HelpCircle,
  CircleDollarSign,
  AlertCircle,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';

interface TripleCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Comprehensive PDPM Components
const pdpmComponents = {
  pt: {
    name: 'Physical Therapy (PT)',
    icon: Activity,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    caseMixGroups: ['TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP'],
    mdsItems: ['GG0130', 'GG0170', 'I0020B', 'Primary Diagnosis'],
    checks: [
      { id: 'pt-diagnosis', label: 'Primary diagnosis supports therapy need', critical: true },
      { id: 'pt-function', label: 'GG Function scores align with skilled need', critical: true },
      { id: 'pt-cognitive', label: 'BIMS score considered for therapy approach', critical: false },
      { id: 'pt-orders', label: 'Physician orders match MDS coding', critical: true },
      { id: 'pt-minutes', label: 'Therapy minutes documented accurately', critical: true },
    ]
  },
  ot: {
    name: 'Occupational Therapy (OT)',
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    caseMixGroups: ['TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP'],
    mdsItems: ['GG0130', 'GG0170', 'I0020B', 'Primary Diagnosis'],
    checks: [
      { id: 'ot-diagnosis', label: 'Primary diagnosis supports OT need', critical: true },
      { id: 'ot-adl', label: 'ADL limitations documented in GG items', critical: true },
      { id: 'ot-cognitive', label: 'Cognitive status supports OT approach', critical: false },
      { id: 'ot-orders', label: 'Physician orders match MDS coding', critical: true },
      { id: 'ot-minutes', label: 'Therapy minutes documented accurately', critical: true },
    ]
  },
  slp: {
    name: 'Speech-Language Pathology (SLP)',
    icon: Brain,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    caseMixGroups: ['SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL'],
    mdsItems: ['B0100', 'K0100', 'K0200', 'K0510', 'Primary Diagnosis'],
    checks: [
      { id: 'slp-diagnosis', label: 'Diagnosis supports SLP need (stroke, dysphagia, etc.)', critical: true },
      { id: 'slp-swallow', label: 'Swallowing status (K0100-K0200) documented', critical: true },
      { id: 'slp-cognitive', label: 'Cognitive/communication deficits documented', critical: true },
      { id: 'slp-orders', label: 'SLP orders match clinical presentation', critical: true },
      { id: 'slp-minutes', label: 'SLP minutes accurately captured', critical: true },
    ]
  },
  nursing: {
    name: 'Nursing Component',
    icon: Stethoscope,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    caseMixGroups: ['ES3', 'ES2', 'ES1', 'HDE2', 'HDE1', 'HBC2', 'HBC1', 'CA2', 'CA1', 'BB2', 'BB1', 'PE2', 'PE1', 'PA2', 'PA1'],
    mdsItems: ['G0110', 'H0100-H0600', 'I0020B', 'J0100-J1100', 'M0300', 'O0100'],
    checks: [
      { id: 'nurs-adl', label: 'ADL support levels (G0110) accurate', critical: true },
      { id: 'nurs-continence', label: 'Bladder/bowel continence (H section) coded correctly', critical: true },
      { id: 'nurs-conditions', label: 'Active diagnoses support nursing classification', critical: true },
      { id: 'nurs-treatments', label: 'Special treatments (O0100) match orders', critical: true },
      { id: 'nurs-skin', label: 'Skin conditions (M section) documented accurately', critical: true },
      { id: 'nurs-behaviors', label: 'Behavioral symptoms (E section) captured', critical: false },
    ]
  },
  nta: {
    name: 'Non-Therapy Ancillary (NTA)',
    icon: Pill,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    caseMixGroups: ['NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH', 'NI', 'NJ', 'NK', 'NL'],
    mdsItems: ['O0100', 'J2100', 'N0415', 'Section I diagnoses'],
    checks: [
      { id: 'nta-iv', label: 'IV medications (O0100K2) documented if applicable', critical: true },
      { id: 'nta-trach', label: 'Tracheostomy care (O0100E) coded if present', critical: true },
      { id: 'nta-vent', label: 'Ventilator/respirator (O0100F) coded if applicable', critical: true },
      { id: 'nta-dialysis', label: 'Dialysis (O0100H) documented if receiving', critical: true },
      { id: 'nta-chemo', label: 'Chemotherapy (O0100G) coded if applicable', critical: true },
      { id: 'nta-transfusion', label: 'Blood transfusions (O0100I) documented', critical: false },
      { id: 'nta-meds', label: 'High-cost medications captured in records', critical: true },
    ]
  }
};

// Admission Triple Check Checklist
const admissionChecklist = [
  {
    phase: 'Pre-Admission',
    icon: Search,
    items: [
      { id: 'pre-insurance', label: 'Verify Medicare Part A eligibility and days remaining', critical: true },
      { id: 'pre-auth', label: 'Obtain prior authorization if required by payer', critical: true },
      { id: 'pre-skilled', label: 'Confirm skilled need documentation from hospital', critical: true },
      { id: 'pre-diagnosis', label: 'Review primary diagnosis and ICD-10 codes', critical: true },
      { id: 'pre-therapy', label: 'Therapy screen completed and documented', critical: false },
    ]
  },
  {
    phase: 'Admission (Day 1-3)',
    icon: Clipboard,
    items: [
      { id: 'adm-mds', label: 'MDS started within required timeframe', critical: true },
      { id: 'adm-orders', label: 'Physician orders match clinical presentation', critical: true },
      { id: 'adm-therapy-eval', label: 'Therapy evaluations completed', critical: true },
      { id: 'adm-diagnosis', label: 'Primary diagnosis supports skilled level of care', critical: true },
      { id: 'adm-functional', label: 'Initial functional assessment documented (GG items)', critical: true },
      { id: 'adm-hipps', label: 'HIPPS code generated and reviewed', critical: true },
    ]
  },
  {
    phase: '5-Day Assessment',
    icon: FileText,
    items: [
      { id: '5day-ard', label: 'ARD set appropriately (Days 1-8)', critical: true },
      { id: '5day-pdpm', label: 'All PDPM components coded accurately', critical: true },
      { id: '5day-therapy', label: 'Therapy classification aligns with treatment', critical: true },
      { id: '5day-nursing', label: 'Nursing classification supported by clinical', critical: true },
      { id: '5day-nta', label: 'NTA items captured (IV, trach, vent, etc.)', critical: true },
      { id: '5day-signed', label: 'MDS signed and locked timely', critical: true },
    ]
  }
];

// Common Billing Errors to Check
const commonErrors = [
  {
    category: 'Therapy Classification',
    icon: Activity,
    color: 'text-blue-500',
    errors: [
      { id: 'err-therapy-mode', label: 'Individual vs Group therapy modes accurate', risk: 'High', revenue: '$150-400/day' },
      { id: 'err-therapy-mins', label: 'Therapy minutes match documentation', risk: 'High', revenue: '$100-300/day' },
      { id: 'err-concurrent', label: 'Concurrent therapy appropriately documented', risk: 'Medium', revenue: '$50-150/day' },
      { id: 'err-cmg-mismatch', label: 'CMG classification matches actual treatment', risk: 'High', revenue: '$200-500/day' },
    ]
  },
  {
    category: 'Nursing Classification',
    icon: Stethoscope,
    color: 'text-green-500',
    errors: [
      { id: 'err-adl-coding', label: 'ADL self-performance accurately reflects resident', risk: 'High', revenue: '$75-200/day' },
      { id: 'err-condition-capture', label: 'All active conditions captured in Section I', risk: 'Medium', revenue: '$50-150/day' },
      { id: 'err-restorative', label: 'Restorative nursing documented when provided', risk: 'Low', revenue: '$25-75/day' },
      { id: 'err-depression', label: 'Depression (D0300) screening completed', risk: 'Medium', revenue: '$30-80/day' },
    ]
  },
  {
    category: 'NTA Components',
    icon: Pill,
    color: 'text-orange-500',
    errors: [
      { id: 'err-iv-miss', label: 'IV medications not captured on O0100K2', risk: 'High', revenue: '$100-300/day' },
      { id: 'err-treatments', label: 'Special treatments omitted (wound vac, TPN)', risk: 'High', revenue: '$150-400/day' },
      { id: 'err-resp', label: 'Respiratory treatments not documented', risk: 'Medium', revenue: '$50-150/day' },
      { id: 'err-expensive-meds', label: 'High-cost medications not captured', risk: 'High', revenue: '$100-500/day' },
    ]
  },
  {
    category: 'Diagnosis Coding',
    icon: FileCheck,
    color: 'text-purple-500',
    errors: [
      { id: 'err-primary-dx', label: 'Primary diagnosis does not match reason for SNF stay', risk: 'Critical', revenue: '$200-600/day' },
      { id: 'err-comorbid', label: 'Comorbidities not fully captured', risk: 'Medium', revenue: '$50-150/day' },
      { id: 'err-surgical', label: 'Surgical procedure codes missing', risk: 'High', revenue: '$100-300/day' },
      { id: 'err-icd10', label: 'ICD-10 codes not specific enough', risk: 'Medium', revenue: '$50-200/day' },
    ]
  }
];

// UB-04 Cross-Check Items
const ub04Checks = [
  { field: 'FL 4 - Type of Bill', check: '21x for SNF inpatient', critical: true },
  { field: 'FL 6 - Statement Covers Period', check: 'Dates match MDS ARD and service period', critical: true },
  { field: 'FL 42 - Revenue Codes', check: 'Revenue codes match services provided', critical: true },
  { field: 'FL 44 - HCPCS/Rates', check: 'HIPPS code matches MDS classification', critical: true },
  { field: 'FL 47 - Total Charges', check: 'Charges align with documented services', critical: true },
  { field: 'FL 67 - Principal Diagnosis', check: 'ICD-10 matches MDS primary diagnosis', critical: true },
  { field: 'FL 69 - Admitting Diagnosis', check: 'Reason for admission documented', critical: true },
  { field: 'FL 74 - Principal Procedure', check: 'Procedure codes if applicable', critical: false },
  { field: 'FL 76 - Attending Physician', check: 'Attending NPI verified', critical: true },
];

// Checklist Item Component
function ChecklistItem({
  id,
  label,
  checked,
  onChange,
  critical,
  note,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
  critical?: boolean;
  note?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
        checked
          ? 'bg-green-50 dark:bg-green-900/20'
          : critical
          ? 'bg-red-50 dark:bg-red-900/20'
          : 'bg-[var(--background)]'
      }`}
    >
      <button
        onClick={() => onChange(id, !checked)}
        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? 'bg-green-500 border-green-500 text-white'
            : critical
            ? 'border-red-400 hover:border-red-500'
            : 'border-[var(--border-color)] hover:border-cyan-500'
        }`}
      >
        {checked && <CheckCircle2 className="w-4 h-4" />}
      </button>
      <div className="flex-1">
        <div className={`text-sm font-medium ${checked ? 'text-green-700 dark:text-green-400 line-through' : 'text-[var(--foreground)]'}`}>
          {label}
        </div>
        {note && <div className="text-xs text-[var(--foreground-muted)] mt-1">{note}</div>}
        {critical && !checked && (
          <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Critical - Required for billing compliance
          </div>
        )}
      </div>
    </div>
  );
}

// Error Check Item Component
function ErrorCheckItem({
  id,
  label,
  risk,
  revenue,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  risk: string;
  revenue: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}) {
  const riskColors = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
        checked ? 'bg-green-50 dark:bg-green-900/20' : 'bg-[var(--background)]'
      }`}
    >
      <button
        onClick={() => onChange(id, !checked)}
        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
          checked ? 'bg-green-500 border-green-500 text-white' : 'border-[var(--border-color)] hover:border-cyan-500'
        }`}
      >
        {checked && <CheckCircle2 className="w-4 h-4" />}
      </button>
      <div className="flex-1">
        <div className={`text-sm ${checked ? 'text-green-700 dark:text-green-400 line-through' : 'text-[var(--foreground)]'}`}>
          {label}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${riskColors[risk as keyof typeof riskColors] || riskColors.Medium}`}>
            {risk} Risk
          </span>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            <DollarSign className="w-3 h-3 inline" />
            {revenue}
          </span>
        </div>
      </div>
    </div>
  );
}

// Expandable Section Component
function ExpandableSection({
  title,
  icon: Icon,
  children,
  defaultExpanded = false,
  badge,
  badgeColor = 'bg-cyan-500',
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  badge?: string | number;
  badgeColor?: string;
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
          {badge !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${badgeColor}`}>
              {badge}
            </span>
          )}
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

// Progress Summary Card
function ProgressCard({
  title,
  completed,
  total,
  icon: Icon,
  color,
}: {
  title: string;
  completed: number;
  total: number;
  icon: React.ElementType;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="card-neumorphic p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-[var(--foreground)]">{title}</div>
          <div className="text-xs text-[var(--foreground-muted)]">
            {completed} of {total} verified
          </div>
        </div>
      </div>
      <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            percentage === 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs font-medium text-[var(--foreground-muted)] mt-1">
        {percentage}%
      </div>
    </div>
  );
}

export function TripleCheckModal({ isOpen, onClose }: TripleCheckModalProps) {
  const [activeTab, setActiveTab] = useState<'admission' | 'pdpm' | 'errors' | 'ub04'>('admission');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheck = useCallback((id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleReset = useCallback(() => {
    setCheckedItems({});
  }, []);

  // Calculate progress for each section
  const getAdmissionProgress = () => {
    let completed = 0;
    let total = 0;
    admissionChecklist.forEach((phase) => {
      phase.items.forEach((item) => {
        total++;
        if (checkedItems[item.id]) completed++;
      });
    });
    return { completed, total };
  };

  const getPdpmProgress = () => {
    let completed = 0;
    let total = 0;
    Object.values(pdpmComponents).forEach((component) => {
      component.checks.forEach((check) => {
        total++;
        if (checkedItems[check.id]) completed++;
      });
    });
    return { completed, total };
  };

  const getErrorProgress = () => {
    let completed = 0;
    let total = 0;
    commonErrors.forEach((category) => {
      category.errors.forEach((error) => {
        total++;
        if (checkedItems[error.id]) completed++;
      });
    });
    return { completed, total };
  };

  const getUB04Progress = () => {
    let completed = 0;
    let total = ub04Checks.length;
    ub04Checks.forEach((check) => {
      if (checkedItems[`ub-${check.field}`]) completed++;
    });
    return { completed, total };
  };

  const admissionProgress = getAdmissionProgress();
  const pdpmProgress = getPdpmProgress();
  const errorProgress = getErrorProgress();
  const ub04Progress = getUB04Progress();
  const totalProgress = {
    completed: admissionProgress.completed + pdpmProgress.completed + errorProgress.completed + ub04Progress.completed,
    total: admissionProgress.total + pdpmProgress.total + errorProgress.total + ub04Progress.total,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden card-neumorphic">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Triple Check Tool</h2>
                <p className="text-emerald-100 text-sm">Pre-Billing Verification & Revenue Integrity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                <span className="text-white text-sm font-medium">
                  {totalProgress.completed}/{totalProgress.total} Complete
                </span>
                <span className="text-emerald-100 text-sm">
                  ({Math.round((totalProgress.completed / totalProgress.total) * 100)}%)
                </span>
              </div>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                title="Reset All"
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
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {[
              { id: 'admission', label: 'Admission Check', icon: Clipboard, progress: admissionProgress },
              { id: 'pdpm', label: 'PDPM Components', icon: Target, progress: pdpmProgress },
              { id: 'errors', label: 'Error Prevention', icon: AlertTriangle, progress: errorProgress },
              { id: 'ub04', label: 'UB-04 Alignment', icon: FileText, progress: ub04Progress },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-700'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  activeTab === tab.id
                    ? tab.progress.completed === tab.progress.total ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'
                    : 'bg-white/20 text-white'
                }`}>
                  {tab.progress.completed}/{tab.progress.total}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Progress Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <ProgressCard
              title="Admission"
              completed={admissionProgress.completed}
              total={admissionProgress.total}
              icon={Clipboard}
              color="bg-blue-500"
            />
            <ProgressCard
              title="PDPM"
              completed={pdpmProgress.completed}
              total={pdpmProgress.total}
              icon={Target}
              color="bg-purple-500"
            />
            <ProgressCard
              title="Errors"
              completed={errorProgress.completed}
              total={errorProgress.total}
              icon={Shield}
              color="bg-orange-500"
            />
            <ProgressCard
              title="UB-04"
              completed={ub04Progress.completed}
              total={ub04Progress.total}
              icon={FileText}
              color="bg-teal-500"
            />
          </div>

          {activeTab === 'admission' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-700 dark:text-blue-400">Admission Triple Check Process</div>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      Complete verification at each phase to ensure accurate PDPM classification and billing compliance from day one.
                    </p>
                  </div>
                </div>
              </div>

              {admissionChecklist.map((phase) => (
                <ExpandableSection
                  key={phase.phase}
                  title={phase.phase}
                  icon={phase.icon}
                  defaultExpanded
                  badge={`${phase.items.filter((i) => checkedItems[i.id]).length}/${phase.items.length}`}
                  badgeColor={
                    phase.items.every((i) => checkedItems[i.id])
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }
                >
                  <div className="space-y-2 mt-2">
                    {phase.items.map((item) => (
                      <ChecklistItem
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        checked={!!checkedItems[item.id]}
                        onChange={handleCheck}
                        critical={item.critical}
                      />
                    ))}
                  </div>
                </ExpandableSection>
              ))}
            </div>
          )}

          {activeTab === 'pdpm' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-purple-700 dark:text-purple-400">PDPM Component Verification</div>
                    <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                      Verify each PDPM component (PT, OT, SLP, Nursing, NTA) aligns with clinical documentation and MDS coding.
                    </p>
                  </div>
                </div>
              </div>

              {Object.entries(pdpmComponents).map(([key, component]) => {
                const Icon = component.icon;
                const completedCount = component.checks.filter((c) => checkedItems[c.id]).length;
                return (
                  <ExpandableSection
                    key={key}
                    title={component.name}
                    icon={Icon}
                    defaultExpanded={key === 'nursing'}
                    badge={`${completedCount}/${component.checks.length}`}
                    badgeColor={
                      completedCount === component.checks.length
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }
                  >
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="text-xs text-[var(--foreground-muted)]">
                          <span className="font-medium">MDS Items:</span>{' '}
                          {component.mdsItems.join(', ')}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {component.checks.map((check) => (
                          <ChecklistItem
                            key={check.id}
                            id={check.id}
                            label={check.label}
                            checked={!!checkedItems[check.id]}
                            onChange={handleCheck}
                            critical={check.critical}
                          />
                        ))}
                      </div>
                    </div>
                  </ExpandableSection>
                );
              })}
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-orange-700 dark:text-orange-400">Common Billing Error Prevention</div>
                    <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                      Check for common errors that lead to underbilling, overbilling, or audit risk. Estimated daily revenue impact shown for each item.
                    </p>
                  </div>
                </div>
              </div>

              {commonErrors.map((category) => {
                const Icon = category.icon;
                const completedCount = category.errors.filter((e) => checkedItems[e.id]).length;
                return (
                  <ExpandableSection
                    key={category.category}
                    title={category.category}
                    icon={Icon}
                    defaultExpanded
                    badge={`${completedCount}/${category.errors.length}`}
                    badgeColor={
                      completedCount === category.errors.length
                        ? 'bg-green-500'
                        : 'bg-orange-500'
                    }
                  >
                    <div className="space-y-2 mt-2">
                      {category.errors.map((error) => (
                        <ErrorCheckItem
                          key={error.id}
                          id={error.id}
                          label={error.label}
                          risk={error.risk}
                          revenue={error.revenue}
                          checked={!!checkedItems[error.id]}
                          onChange={handleCheck}
                        />
                      ))}
                    </div>
                  </ExpandableSection>
                );
              })}

              {/* Revenue Impact Summary */}
              <div className="card-neumorphic p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CircleDollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-[var(--foreground)]">Potential Revenue at Risk</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-500">$450-1,200</div>
                    <div className="text-xs text-[var(--foreground-muted)]">Per day if unchecked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">$13,500-36,000</div>
                    <div className="text-xs text-[var(--foreground-muted)]">Per month estimate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">$162,000-432,000</div>
                    <div className="text-xs text-[var(--foreground-muted)]">Annual exposure</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {errorProgress.completed === errorProgress.total ? 'Protected' : `${Math.round((errorProgress.completed / errorProgress.total) * 100)}%`}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">Verification status</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ub04' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-teal-700 dark:text-teal-400">UB-04 Cross-Check</div>
                    <p className="text-sm text-teal-600 dark:text-teal-300 mt-1">
                      Verify UB-04 claim form fields align with MDS data and clinical documentation before submission.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-neumorphic overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--background)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                        Verified
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                        UB-04 Field
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                        Verification Check
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                        Priority
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {ub04Checks.map((check) => (
                      <tr
                        key={check.field}
                        className={`transition-colors ${
                          checkedItems[`ub-${check.field}`]
                            ? 'bg-green-50 dark:bg-green-900/10'
                            : 'hover:bg-[var(--background)]'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleCheck(`ub-${check.field}`, !checkedItems[`ub-${check.field}`])}
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                              checkedItems[`ub-${check.field}`]
                                ? 'bg-green-500 border-green-500 text-white'
                                : check.critical
                                ? 'border-red-400 hover:border-red-500'
                                : 'border-[var(--border-color)] hover:border-cyan-500'
                            }`}
                          >
                            {checkedItems[`ub-${check.field}`] && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${checkedItems[`ub-${check.field}`] ? 'text-green-700 dark:text-green-400' : 'text-[var(--foreground)]'}`}>
                            {check.field}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
                          {check.check}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {check.critical ? (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              Critical
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              Standard
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* HIPPS Code Reference */}
              <ExpandableSection title="HIPPS Code Structure Reference" icon={Info} defaultExpanded={false}>
                <div className="mt-2 space-y-3">
                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="font-medium text-[var(--foreground)] mb-2">HIPPS Code Format: XXXXX (5 characters)</div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="font-bold text-blue-600">Position 1</div>
                        <div className="text-xs text-[var(--foreground-muted)]">PT/OT CMG (T/U)</div>
                      </div>
                      <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                        <div className="font-bold text-pink-600">Position 2</div>
                        <div className="text-xs text-[var(--foreground-muted)]">SLP CMG (S)</div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="font-bold text-green-600">Position 3</div>
                        <div className="text-xs text-[var(--foreground-muted)]">Nursing CMG</div>
                      </div>
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="font-bold text-orange-600">Position 4</div>
                        <div className="text-xs text-[var(--foreground-muted)]">NTA CMG (N)</div>
                      </div>
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="font-bold text-purple-600">Position 5</div>
                        <div className="text-xs text-[var(--foreground-muted)]">Assessment Type</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    Example: TASES1 = PT/OT Group TA, SLP Group SA, Nursing ES, NTA Group NA, 5-Day Assessment
                  </div>
                </div>
              </ExpandableSection>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="sticky bottom-0 bg-[var(--background-elevated)] border-t border-[var(--border-color)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--foreground-muted)]">
              {totalProgress.completed === totalProgress.total ? (
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  All checks complete - Ready for billing
                </span>
              ) : (
                <span>
                  {totalProgress.total - totalProgress.completed} items remaining
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const unchecked = Object.entries(checkedItems)
                    .filter(([, v]) => !v)
                    .map(([k]) => k);
                  console.log('Unchecked items:', unchecked);
                  alert(`${totalProgress.total - totalProgress.completed} items need review before billing submission.`);
                }}
                className="btn-neumorphic px-4 py-2 flex items-center gap-2 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                Review Unchecked
              </button>
              <button
                className={`px-4 py-2 flex items-center gap-2 text-sm rounded-lg font-medium transition-all ${
                  totalProgress.completed === totalProgress.total
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                disabled={totalProgress.completed !== totalProgress.total}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve for Billing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
