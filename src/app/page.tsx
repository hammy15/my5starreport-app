/**
 * my5starreport.com - Main Application
 *
 * Comprehensive 5-Star nursing home analysis tool
 * with Hammy Design System (turquoise, neumorphism, dark mode)
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Star,
  TrendingUp,
  ClipboardCheck,
  UserCheck,
  Heart,
  FileText,
  ArrowLeft,
  Moon,
  Sun,
  GraduationCap,
  RefreshCw,
  Database,
  Clock,
} from 'lucide-react';
import { FacilitySearch } from '@/components/dashboard/facility-search';
import { FacilityOverview } from '@/components/dashboard/facility-overview';
import { PlanBuilder } from '@/components/plans/plan-builder';
import type { Facility, ImprovementRecommendation, ActionPlan } from '@/types/facility';

// View types for navigation
type ViewType = 'search' | 'overview' | 'health' | 'staffing' | 'quality' | 'plan' | 'training';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('search');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleSelectFacility = (providerNumber: string) => {
    setSelectedFacility(providerNumber);
    setCurrentView('overview');
  };

  const handleBackToSearch = () => {
    setSelectedFacility(null);
    setCurrentView('search');
  };

  const handleViewDetails = (section: 'health' | 'staffing' | 'quality' | 'plan') => {
    setCurrentView(section);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="card-neumorphic sticky top-0 z-50 mx-4 mt-4 mb-6 lg:mx-8">
        <div className="px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setSelectedFacility(null);
                setCurrentView('search');
              }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-primary">my5starreport</h1>
                <p className="text-xs text-[var(--foreground-muted)]">Skilled Nursing Excellence</p>
              </div>
            </div>

            {/* Navigation when facility is selected */}
            {selectedFacility && currentView !== 'search' && (
              <nav className="hidden md:flex items-center gap-2">
                <NavButton
                  icon={<Building2 className="w-4 h-4" />}
                  label="Overview"
                  isActive={currentView === 'overview'}
                  onClick={() => setCurrentView('overview')}
                />
                <NavButton
                  icon={<ClipboardCheck className="w-4 h-4" />}
                  label="Inspections"
                  isActive={currentView === 'health'}
                  onClick={() => setCurrentView('health')}
                />
                <NavButton
                  icon={<UserCheck className="w-4 h-4" />}
                  label="Staffing"
                  isActive={currentView === 'staffing'}
                  onClick={() => setCurrentView('staffing')}
                />
                <NavButton
                  icon={<Heart className="w-4 h-4" />}
                  label="Quality"
                  isActive={currentView === 'quality'}
                  onClick={() => setCurrentView('quality')}
                />
                <NavButton
                  icon={<FileText className="w-4 h-4" />}
                  label="Plan"
                  isActive={currentView === 'plan'}
                  onClick={() => setCurrentView('plan')}
                />
              </nav>
            )}

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('training')}
                className="btn-neumorphic p-2.5 hidden sm:flex items-center gap-2"
                title="Training Resources"
              >
                <GraduationCap className="w-5 h-5 text-cyan-500" />
                <span className="hidden lg:inline text-sm">Training</span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="btn-neumorphic p-2.5"
                title="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
        {/* Search View */}
        {currentView === 'search' && (
          <div className="space-y-8 animate-slide-up">
            {/* Hero Section */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-medium mb-6">
                <Database className="w-4 h-4" />
                Powered by CMS Data • Auto-Synced
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-gradient-primary">Improve Your</span>
                <br />
                <span className="text-[var(--foreground)]">5-Star Rating</span>
              </h2>

              <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                Get comprehensive analysis of your nursing facility&apos;s CMS ratings
                with personalized improvement recommendations and training resources.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <FeatureCard
                icon={<ClipboardCheck className="w-6 h-6" />}
                title="Health Inspections"
                description="Survey analysis & deficiency tracking"
                color="blue"
              />
              <FeatureCard
                icon={<UserCheck className="w-6 h-6" />}
                title="Staffing Analysis"
                description="PBJ data & HPRD optimization"
                color="cyan"
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Quality Measures"
                description="Clinical outcomes & benchmarks"
                color="purple"
              />
              <FeatureCard
                icon={<GraduationCap className="w-6 h-6" />}
                title="Training"
                description="Resources to improve ratings"
                color="green"
              />
            </div>

            {/* Search Component */}
            <FacilitySearch onSelectFacility={handleSelectFacility} />

            {/* Data Sync Info */}
            <div className="card-neumorphic p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm font-medium">Auto-Sync Active</p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Data updates when CMS releases new reports
                  </p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Synced
              </span>
            </div>
          </div>
        )}

        {/* Facility Overview */}
        {currentView === 'overview' && selectedFacility && (
          <FacilityOverview
            providerNumber={selectedFacility}
            onBack={handleBackToSearch}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Training View */}
        {currentView === 'training' && (
          <TrainingView onBack={() => setCurrentView('search')} />
        )}

        {/* Detail Views */}
        {currentView === 'health' && selectedFacility && (
          <DetailView
            title="Health Inspection Analysis"
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
            icon={<ClipboardCheck className="w-6 h-6 text-blue-500" />}
          />
        )}

        {currentView === 'staffing' && selectedFacility && (
          <DetailView
            title="Staffing Analysis"
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
            icon={<UserCheck className="w-6 h-6 text-cyan-500" />}
          />
        )}

        {currentView === 'quality' && selectedFacility && (
          <DetailView
            title="Quality Measures"
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
            icon={<Heart className="w-6 h-6 text-purple-500" />}
          />
        )}

        {currentView === 'plan' && selectedFacility && (
          <PlanView
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="card-neumorphic mx-4 mb-4 lg:mx-8 p-6">
        <div className="text-center text-sm text-[var(--foreground-muted)]">
          <p className="mb-2 font-medium">my5starreport.com</p>
          <p>Data sourced from CMS (Centers for Medicare & Medicaid Services)</p>
          <p className="mt-2 text-xs">
            This tool is for informational purposes. Always verify with official CMS sources.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Navigation button with neumorphic style
function NavButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'btn-neumorphic-primary text-white'
          : 'btn-neumorphic'
      }`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

// Feature card with neumorphic style
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'cyan' | 'purple' | 'green';
}) {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    cyan: 'from-cyan-400 to-cyan-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-green-400 to-green-600',
  };

  return (
    <div className="card-neumorphic p-6 hover:scale-[1.02] transition-transform cursor-pointer">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="font-semibold text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
    </div>
  );
}

// Training resource type
interface TrainingResource {
  id: string;
  category: string;
  title: string;
  description: string;
  content_type: string;
  duration_minutes: number;
  difficulty_level: string;
  content?: string;
  video_url?: string;
  checklist?: string[];
}

// Training content database
const trainingContent: Record<string, { content: string; checklist?: string[]; keyPoints?: string[] }> = {
  '1': {
    content: `Hours Per Resident Day (HPRD) is the primary staffing metric used by CMS to calculate your staffing rating.

**How HPRD is Calculated:**
HPRD = Total Staff Hours Worked / Total Resident Days

**Example:**
- If your facility has 100 residents
- And your nursing staff worked a combined 400 hours in one day
- Your HPRD = 400 / 100 = 4.0 HPRD

**CMS Staffing Thresholds (2024):**
- 5-Star: Total ≥4.08 HPRD, RN ≥0.75 HPRD
- 4-Star: Total ≥3.58 HPRD, RN ≥0.55 HPRD
- 3-Star: Total ≥3.18 HPRD, RN ≥0.40 HPRD
- 2-Star: Total ≥2.82 HPRD, RN ≥0.30 HPRD
- 1-Star: Below 2-star thresholds`,
    keyPoints: [
      'HPRD includes RNs, LPNs, and CNAs',
      'Weekend staffing is weighted heavily',
      'Staffing adjustments based on case-mix are applied',
      'PBJ data must be submitted accurately and on time',
    ],
  },
  '2': {
    content: `Payroll-Based Journal (PBJ) reporting is mandatory for all Medicare/Medicaid certified nursing homes.

**Submission Requirements:**
- Submit staffing data quarterly
- Deadline: 45 days after quarter end
- Include all direct care staff hours

**Best Practices:**
1. Use electronic time tracking systems
2. Ensure proper job category coding
3. Reconcile PBJ data with payroll records
4. Review before submission for accuracy
5. Keep documentation for audits`,
    checklist: [
      'Verify all staff are properly coded by job category',
      'Ensure agency/contract staff hours are included',
      'Check for missing shifts or incomplete entries',
      'Validate census data matches MDS submissions',
      'Review weekend staffing entries carefully',
      'Submit at least 5 days before deadline',
    ],
  },
  '4': {
    content: `Reducing antipsychotic medication use is a key quality measure that affects your star rating.

**Why It Matters:**
- Antipsychotics carry serious risks for elderly residents
- CMS tracks this as a priority quality measure
- High rates trigger additional scrutiny

**Non-Pharmacological Interventions:**
1. Person-centered care approaches
2. Environmental modifications
3. Structured activities programs
4. Music and art therapy
5. Staff training on dementia care

**Gradual Dose Reduction (GDR):**
- Required for all residents on antipsychotics
- Must attempt reduction unless clinically contraindicated
- Document all attempts and outcomes`,
    keyPoints: [
      'National average is approximately 14%',
      'Target should be below 10%',
      'Exclusions exist for certain diagnoses',
      'Documentation of medical necessity is critical',
    ],
  },
  '5': {
    content: `Pressure ulcers are a critical quality measure and a major focus during surveys.

**Prevention Protocol:**
1. Risk assessment on admission (Braden Scale)
2. Regular repositioning schedule
3. Proper nutrition and hydration
4. Moisture management
5. Pressure-redistributing surfaces

**Staging:**
- Stage 1: Non-blanchable erythema
- Stage 2: Partial thickness skin loss
- Stage 3: Full thickness skin loss
- Stage 4: Full thickness tissue loss
- Unstageable: Obscured by slough/eschar
- DTPI: Deep tissue pressure injury`,
    checklist: [
      'Complete Braden Scale on admission',
      'Reassess weekly and with condition changes',
      'Implement turning schedule (Q2H minimum)',
      'Document skin checks daily',
      'Ensure adequate protein intake',
      'Use appropriate support surfaces',
      'Keep skin clean and dry',
      'Protect bony prominences',
    ],
  },
  '6': {
    content: `Falls are the leading cause of injury in nursing homes and heavily impact your quality measures.

**Fall Prevention Program Components:**
1. Comprehensive fall risk assessment
2. Individualized interventions
3. Environmental safety rounds
4. Staff education
5. Post-fall analysis

**High-Risk Factors:**
- History of falls
- Cognitive impairment
- Gait/balance problems
- Medications (sedatives, BP meds)
- Environmental hazards`,
    checklist: [
      'Complete fall risk assessment on admission',
      'Review medications for fall risk',
      'Ensure proper footwear',
      'Install grab bars and handrails',
      'Adequate lighting in all areas',
      'Clear pathways of obstacles',
      'Bed alarms for high-risk residents',
      'Conduct post-fall huddles',
      'Update care plan after each fall',
    ],
  },
  '7': {
    content: `Being survey-ready at all times is essential for maintaining good inspection results.

**Daily Readiness:**
- Mock surveys quarterly
- Documentation audits weekly
- Environment rounds daily
- Staff competency validation

**Key Focus Areas:**
- Infection control practices
- Medication management
- Resident rights
- Quality of care
- Staffing levels`,
    checklist: [
      'Emergency preparedness plan current',
      'Fire drills documented monthly',
      'Infection control supplies stocked',
      'Staff licenses verified and current',
      'Care plans updated within 7 days',
      'Medication carts secured',
      'Call lights answered promptly',
      'Dining room supervision adequate',
      'Activities calendar posted',
      'Resident grievance process in place',
    ],
  },
  '8': {
    content: `Understanding F-Tags is essential for survey preparation and compliance.

**F-Tag Structure:**
- F-Tags are regulatory requirements
- Each has a specific scope and severity grid
- Deficiencies are cited with F-Tag numbers

**Common High-Impact F-Tags:**
- F686: Treatment/Services to Prevent/Heal Pressure Ulcers
- F689: Free of Accident Hazards/Supervision/Devices
- F880: Infection Prevention & Control
- F812: Food Procurement, Storage & Preparation
- F684: Quality of Care

**Severity Levels:**
- A-C: No actual harm, potential for minimal harm
- D-F: No actual harm, potential for more than minimal harm
- G-I: Actual harm
- J-L: Immediate jeopardy`,
    keyPoints: [
      'Focus on most frequently cited F-Tags',
      'Train staff on prevention strategies',
      'Document thoroughly to show compliance',
      'Immediate jeopardy requires immediate correction',
    ],
  },
  '10': {
    content: `The CMS 5-Star Rating System helps consumers compare nursing homes.

**Five Domains:**
1. Health Inspections (surveys, complaints, revisits)
2. Staffing (HPRD from PBJ data)
3. Quality Measures (MDS-derived)
4. Overall Rating (weighted combination)

**How Overall Rating is Calculated:**
- Starts with Health Inspection rating
- Add 1 star if Staffing ≥ 4 AND QM ≥ 4
- Subtract 1 star if Staffing = 1 OR QM = 1
- Maximum 5 stars, minimum 1 star

**Update Schedule:**
- Health Inspections: Monthly
- Staffing: Quarterly
- Quality Measures: Quarterly`,
    keyPoints: [
      'Health inspection is the foundation',
      'All three components matter',
      'Special Focus Facility status impacts rating',
      'Abuse icon affects public perception',
    ],
  },
  '11': {
    content: `Quality Assurance and Performance Improvement (QAPI) is required for all nursing homes.

**QAPI Elements:**
1. Design and Scope
2. Governance and Leadership
3. Feedback, Data Systems & Monitoring
4. Performance Improvement Projects (PIPs)
5. Systematic Analysis and Action

**Building Your QAPI Program:**
- Establish QAPI committee
- Define quality indicators
- Set measurable goals
- Track data consistently
- Implement PIPs with PDSA cycles

**PDSA Cycle:**
- Plan: Identify problem and solution
- Do: Implement on small scale
- Study: Analyze results
- Act: Standardize or modify`,
    checklist: [
      'QAPI plan written and approved',
      'QAPI committee meets monthly',
      'Quality indicators defined and tracked',
      'At least 2 active PIPs at all times',
      'Staff aware of current PIPs',
      'Data displayed for staff visibility',
      'Root cause analysis for adverse events',
      'Annual QAPI program evaluation',
    ],
  },
};

// Training View
function TrainingView({ onBack }: { onBack: () => void }) {
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<TrainingResource | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch('/api/training');
        const data = await response.json();
        setResources(data.resources || []);
      } catch (error) {
        console.error('Failed to fetch training resources:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  const categories = [
    { id: 'staffing', title: 'Staffing Optimization', icon: <UserCheck className="w-5 h-5" />, color: 'cyan' },
    { id: 'quality_measures', title: 'Quality Improvement', icon: <Heart className="w-5 h-5" />, color: 'purple' },
    { id: 'health_inspection', title: 'Health Inspection', icon: <ClipboardCheck className="w-5 h-5" />, color: 'blue' },
    { id: 'general', title: 'General Training', icon: <GraduationCap className="w-5 h-5" />, color: 'green' },
  ];

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'guide': return '📖';
      case 'course': return '📚';
      case 'checklist': return '✅';
      default: return '📄';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Course detail view
  if (selectedResource) {
    const content = trainingContent[selectedResource.id];
    return (
      <div className="space-y-6 animate-slide-up">
        <button
          onClick={() => setSelectedResource(null)}
          className="btn-neumorphic px-4 py-2 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Training
        </button>

        <div className="card-neumorphic p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getContentTypeIcon(selectedResource.content_type)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(selectedResource.difficulty_level)}`}>
                  {selectedResource.difficulty_level}
                </span>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {selectedResource.duration_minutes} min
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">{selectedResource.title}</h2>
              <p className="text-[var(--foreground-muted)] mt-2">{selectedResource.description}</p>
            </div>
          </div>

          {content ? (
            <div className="space-y-6">
              <div className="card-neumorphic-inset p-6">
                <div className="prose dark:prose-invert max-w-none">
                  {content.content.split('\n\n').map((paragraph, idx) => (
                    <div key={idx} className="mb-4">
                      {paragraph.startsWith('**') ? (
                        <h3 className="font-semibold text-lg text-[var(--foreground)] mb-2">
                          {paragraph.replace(/\*\*/g, '')}
                        </h3>
                      ) : paragraph.startsWith('-') || paragraph.startsWith('1.') ? (
                        <ul className="list-disc list-inside space-y-1 text-[var(--foreground-muted)]">
                          {paragraph.split('\n').map((item, i) => (
                            <li key={i}>{item.replace(/^[-\d.]\s*/, '')}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[var(--foreground-muted)]">{paragraph}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {content.keyPoints && (
                <div className="card-neumorphic p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {content.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-500 mt-1">•</span>
                        <span className="text-[var(--foreground-muted)]">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {content.checklist && (
                <div className="card-neumorphic p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-green-500" />
                    Checklist
                  </h3>
                  <ul className="space-y-2">
                    {content.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                        <span className="text-[var(--foreground-muted)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="card-neumorphic-inset p-8 text-center">
              <p className="text-[var(--foreground-muted)]">
                Course content is being developed. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </button>

      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gradient-primary mb-4">Training Resources</h2>
        <p className="text-[var(--foreground-muted)]">
          Access courses and guides to improve your facility&apos;s 5-star rating
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === null ? 'btn-neumorphic-primary text-white' : 'btn-neumorphic'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === cat.id ? 'btn-neumorphic-primary text-white' : 'btn-neumorphic'
            }`}
          >
            {cat.icon}
            <span className="hidden sm:inline">{cat.title}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading training resources...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources
            .filter(r => !activeCategory || r.category === activeCategory)
            .map((resource) => (
            <div
              key={resource.id}
              onClick={() => setSelectedResource(resource)}
              className="card-neumorphic p-6 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{getContentTypeIcon(resource.content_type)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(resource.difficulty_level)}`}>
                  {resource.difficulty_level}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">{resource.title}</h3>
              <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">{resource.description}</p>
              <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {resource.duration_minutes} min
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-medium">Start →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Detail view placeholder
function DetailView({
  title,
  providerNumber,
  onBack,
  icon,
}: {
  title: string;
  providerNumber: string;
  onBack: () => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </button>

      <div className="card-neumorphic p-8">
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h2 className="text-2xl font-bold text-[var(--foreground)]">{title}</h2>
        </div>

        <p className="text-[var(--foreground-muted)] mb-6">
          Detailed analysis for facility: {providerNumber}
        </p>

        <div className="card-neumorphic-inset p-6 text-center">
          <p className="text-cyan-600 dark:text-cyan-400">
            Detailed {title.toLowerCase()} data and analysis is available.
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            Components are connected to the database for real-time data.
          </p>
        </div>
      </div>
    </div>
  );
}

// Plan View - fetches data and renders PlanBuilder
function PlanView({
  providerNumber,
  onBack,
}: {
  providerNumber: string;
  onBack: () => void;
}) {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [recommendations, setRecommendations] = useState<ImprovementRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedPlan, setSavedPlan] = useState<Partial<ActionPlan> | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/facilities/${providerNumber}`);
        if (!response.ok) throw new Error('Failed to fetch facility data');
        const data = await response.json();
        setFacility(data.facility);
        setRecommendations(data.recommendations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerNumber]);

  const handleSavePlan = (plan: Partial<ActionPlan>) => {
    setSavedPlan(plan);
    // In a full implementation, this would save to the database
    console.log('Plan saved:', plan);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading improvement plan builder...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <div className="card-neumorphic p-8 text-center">
          <p className="text-red-500">{error || 'Failed to load facility data'}</p>
        </div>
      </div>
    );
  }

  if (savedPlan) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <div className="card-neumorphic p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Plan Saved!</h2>
              <p className="text-[var(--foreground-muted)]">{savedPlan.name}</p>
            </div>
          </div>

          <div className="card-neumorphic-inset p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--foreground-muted)]">Current Rating:</span>
                <span className="ml-2 font-bold">{savedPlan.currentRating} ★</span>
              </div>
              <div>
                <span className="text-[var(--foreground-muted)]">Target Rating:</span>
                <span className="ml-2 font-bold text-cyan-600">{savedPlan.targetRating} ★</span>
              </div>
              <div>
                <span className="text-[var(--foreground-muted)]">Action Items:</span>
                <span className="ml-2 font-bold">{savedPlan.items?.length || 0}</span>
              </div>
              <div>
                <span className="text-[var(--foreground-muted)]">Status:</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs">
                  {savedPlan.status}
                </span>
              </div>
            </div>
          </div>

          <h3 className="font-semibold mb-3">Action Items ({savedPlan.items?.length || 0})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {savedPlan.items?.map((item, index) => (
              <div key={item.id} className="card-neumorphic-inset p-3 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Due: {item.dueDate}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setSavedPlan(null)}
              className="btn-neumorphic px-4 py-2"
            >
              Edit Plan
            </button>
            <button className="btn-neumorphic-primary px-4 py-2">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </button>

      <PlanBuilder
        facility={facility}
        recommendations={recommendations}
        onSavePlan={handleSavePlan}
      />
    </div>
  );
}
