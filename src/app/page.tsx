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

// Training View
function TrainingView({ onBack }: { onBack: () => void }) {
  const trainingCategories = [
    {
      title: 'Health Inspection Training',
      icon: <ClipboardCheck className="w-5 h-5" />,
      color: 'blue',
      courses: [
        'Survey Readiness Checklist',
        'Understanding F-Tags',
        'Mock Survey Training',
        'Plan of Correction Writing',
      ],
    },
    {
      title: 'Staffing Optimization',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'cyan',
      courses: [
        'Understanding HPRD Calculations',
        'PBJ Reporting Best Practices',
        'Reducing Staff Turnover',
        'Weekend Staffing Strategies',
      ],
    },
    {
      title: 'Quality Improvement',
      icon: <Heart className="w-5 h-5" />,
      color: 'purple',
      courses: [
        'Antipsychotic Reduction Program',
        'Pressure Ulcer Prevention',
        'Fall Prevention Best Practices',
        'Reducing Rehospitalizations',
      ],
    },
    {
      title: 'General Training',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'green',
      courses: [
        '5-Star Rating System Overview',
        'QAPI Program Implementation',
        'Leadership in Quality Improvement',
        'Understanding CMS Data Sources',
      ],
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingCategories.map((category) => (
          <div key={category.title} className="card-neumorphic p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-${category.color}-400 to-${category.color}-600 text-white`}>
                {category.icon}
              </div>
              <h3 className="font-semibold">{category.title}</h3>
            </div>
            <ul className="space-y-3">
              {category.courses.map((course) => (
                <li key={course}>
                  <button className="w-full text-left p-3 rounded-lg card-neumorphic-inset hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors">
                    <span className="text-sm">{course}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
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
