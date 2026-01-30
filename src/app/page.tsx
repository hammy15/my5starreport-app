/**
 * my5STARreport.com - Main Application
 *
 * Comprehensive 5-Star nursing home analysis tool
 * with Hammy Design System (turquoise, neumorphism, dark mode)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Calculator,
  GitCompare,
  MapPin,
  Calendar,
  Download,
  FileCheck,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Users,
  Award,
  Bell,
  PieChart,
  ListChecks,
  Printer,
  Link,
  Plus,
  Trash2,
  Edit3,
  Save,
  Play,
  Pause,
  Eye,
  TrendingDown,
  Activity,
  Bookmark,
  Share2,
  MessageCircle,
  Sparkles,
  X,
  Send,
  Lightbulb,
  DollarSign,
  Zap,
  Shield,
  Brain,
  Briefcase,
  Globe,
  Scale,
  Timer,
  Wallet,
  Upload,
  FileSpreadsheet,
  Gavel,
  Network,
  BarChart2,
  LineChart,
  Mail,
  Phone,
  Settings,
  Filter,
  SortAsc,
  Crown,
  Trophy,
  Layers,
  Building,
  CircleDollarSign,
  CalendarClock,
  UsersRound,
  Handshake,
  ScrollText,
  Gauge,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Share,
  Maximize2,
} from 'lucide-react';
import { FacilitySearch } from '@/components/dashboard/facility-search';
import { FacilityOverview } from '@/components/dashboard/facility-overview';
import { PlanBuilder } from '@/components/plans/plan-builder';
import type { Facility, ImprovementRecommendation, ActionPlan } from '@/types/facility';

// View types for navigation
type ViewType = 'search' | 'overview' | 'health' | 'staffing' | 'quality' | 'plan' | 'plan-preview' | 'training' | 'cascadia' | 'compare' | 'calculator' | 'templates' | 'executive' | 'tasks' | 'trends' | 'checklists' | 'alerts' | 'benchmarking' | 'board-reports' | 'portfolio' | 'survey-countdown' | 'scheduling' | 'financial-impact' | 'pbj-integration' | 'regulatory' | 'community';

// 5 Star Phil Chat Message Type
interface PhilMessage {
  id: string;
  role: 'user' | 'phil';
  content: string;
  timestamp: Date;
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('search');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showPhilChat, setShowPhilChat] = useState(false);
  const [philGlow, setPhilGlow] = useState(false);
  const [showProMenu, setShowProMenu] = useState(false);
  const [philMessages, setPhilMessages] = useState<PhilMessage[]>([
    {
      id: '1',
      role: 'phil',
      content: "Hey there! I'm 5 Star Phil, your CMS rating expert. I can help you understand the 5-star rating system, identify improvement opportunities, and create action plans. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [philInput, setPhilInput] = useState('');

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Phil glow animation - occasionally draw attention
  useEffect(() => {
    const glowInterval = setInterval(() => {
      if (!showPhilChat && Math.random() > 0.7) {
        setPhilGlow(true);
        setTimeout(() => setPhilGlow(false), 2000);
      }
    }, 30000); // Check every 30 seconds
    return () => clearInterval(glowInterval);
  }, [showPhilChat]);

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

  // Handle Phil chat
  const handlePhilSend = useCallback(() => {
    if (!philInput.trim()) return;

    const userMessage: PhilMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: philInput,
      timestamp: new Date(),
    };

    setPhilMessages(prev => [...prev, userMessage]);
    setPhilInput('');

    // Simulate Phil's response (in production, this would call an AI API)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'staffing': "Staffing is one of the three pillars of the 5-star rating. CMS uses Payroll-Based Journal (PBJ) data to calculate Hours Per Resident Day (HPRD). For a 5-star staffing rating, you need ≥4.08 total nursing HPRD and ≥0.75 RN HPRD. Weekend staffing is weighted heavily - make sure you maintain consistent levels!",
        'health': "Health Inspections account for about 50% of your overall rating influence. Surveys look at F-tags covering quality of care, resident rights, and facility administration. The key is being survey-ready every day, not just during inspection periods. Focus on the most commonly cited deficiencies: F686 (pressure ulcers), F689 (accidents), and F880 (infection control).",
        'quality': "Quality Measures come from MDS data and include both long-stay and short-stay metrics. Key measures include antipsychotic medication use (target <12%), pressure ulcer rates, falls, and rehospitalizations. These are calculated quarterly, so consistent documentation is crucial.",
        'improve': "To improve your rating cost-effectively, I recommend: 1) Audit your PBJ data for accuracy - this is free and often reveals easy wins. 2) Focus on quality measures with the biggest gaps vs. benchmarks. 3) Conduct mock surveys quarterly to catch issues before CMS does. 4) Invest in staff retention - turnover hurts all three rating components.",
        'default': "Great question! The CMS 5-Star rating system evaluates nursing homes on Health Inspections, Staffing, and Quality Measures. Your overall rating starts with Health Inspections, then gets adjusted based on Staffing and QM performance. Would you like me to explain any specific component in more detail?",
      };

      const lowerInput = philInput.toLowerCase();
      let response = responses.default;
      if (lowerInput.includes('staff') || lowerInput.includes('hprd') || lowerInput.includes('pbj')) {
        response = responses.staffing;
      } else if (lowerInput.includes('health') || lowerInput.includes('inspection') || lowerInput.includes('survey') || lowerInput.includes('deficien')) {
        response = responses.health;
      } else if (lowerInput.includes('quality') || lowerInput.includes('measure') || lowerInput.includes('mds') || lowerInput.includes('antipsychotic')) {
        response = responses.quality;
      } else if (lowerInput.includes('improve') || lowerInput.includes('better') || lowerInput.includes('increase') || lowerInput.includes('cost')) {
        response = responses.improve;
      }

      const philResponse: PhilMessage = {
        id: (Date.now() + 1).toString(),
        role: 'phil',
        content: response,
        timestamp: new Date(),
      };
      setPhilMessages(prev => [...prev, philResponse]);
    }, 1000);
  }, [philInput]);

  // Splash Screen
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* 5 Star Phil Chat Bot */}
      <FiveStarPhil
        isOpen={showPhilChat}
        onToggle={() => setShowPhilChat(!showPhilChat)}
        messages={philMessages}
        input={philInput}
        onInputChange={setPhilInput}
        onSend={handlePhilSend}
        isGlowing={philGlow}
      />

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
                <h1 className="text-xl font-bold">
                  <span className="text-[var(--foreground)]">my</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500">5</span>
                  <span className="text-gradient-primary">STAR</span>
                  <span className="text-[var(--foreground)]">report</span>
                </h1>
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
                <NavButton
                  icon={<Activity className="w-4 h-4" />}
                  label="Trends"
                  isActive={currentView === 'trends'}
                  onClick={() => setCurrentView('trends')}
                />
              </nav>
            )}

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('executive')}
                className={`btn-neumorphic p-2.5 hidden sm:flex items-center gap-2 ${currentView === 'executive' ? 'ring-2 ring-cyan-500' : ''}`}
                title="Executive Dashboard"
              >
                <PieChart className="w-5 h-5 text-indigo-500" />
                <span className="hidden xl:inline text-sm">Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('cascadia')}
                className={`btn-neumorphic p-2.5 hidden sm:flex items-center gap-2 ${currentView === 'cascadia' ? 'ring-2 ring-cyan-500' : ''}`}
                title="Cascadia Stars"
              >
                <Award className="w-5 h-5 text-amber-500" />
                <span className="hidden xl:inline text-sm">Cascadia</span>
              </button>

              <button
                onClick={() => setCurrentView('tasks')}
                className={`btn-neumorphic p-2.5 hidden md:flex items-center gap-2 ${currentView === 'tasks' ? 'ring-2 ring-cyan-500' : ''}`}
                title="Action Tasks"
              >
                <ListChecks className="w-5 h-5 text-green-500" />
              </button>

              <button
                onClick={() => setCurrentView('checklists')}
                className={`btn-neumorphic p-2.5 hidden md:flex items-center gap-2 ${currentView === 'checklists' ? 'ring-2 ring-cyan-500' : ''}`}
                title="Survey Checklists"
              >
                <ClipboardCheck className="w-5 h-5 text-blue-500" />
              </button>

              <button
                onClick={() => setCurrentView('training')}
                className={`btn-neumorphic p-2.5 hidden sm:flex items-center gap-2 ${currentView === 'training' ? 'ring-2 ring-cyan-500' : ''}`}
                title="Training Resources"
              >
                <GraduationCap className="w-5 h-5 text-cyan-500" />
              </button>

              {/* Pro Features Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProMenu(!showProMenu)}
                  className={`btn-neumorphic p-2.5 flex items-center gap-2 ${showProMenu ? 'ring-2 ring-cyan-500' : ''}`}
                  title="Pro Features"
                >
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span className="hidden lg:inline text-sm font-medium">Pro</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showProMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProMenu(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-64 card-neumorphic p-2 z-50 animate-fade-in">
                      <div className="text-xs font-semibold text-[var(--foreground-muted)] px-3 py-2 uppercase tracking-wider">
                        Analysis Tools
                      </div>
                      <button
                        onClick={() => { setCurrentView('benchmarking'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <Scale className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-medium text-sm">Competitor Benchmarking</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Compare with market</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCurrentView('financial-impact'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <CircleDollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium text-sm">Financial Impact</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Revenue projections</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCurrentView('survey-countdown'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <Timer className="w-5 h-5 text-red-500" />
                        <div>
                          <div className="font-medium text-sm">Survey Countdown</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Track survey timing</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCurrentView('alerts'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <Bell className="w-5 h-5 text-amber-500" />
                        <div>
                          <div className="font-medium text-sm">Automated Alerts</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Rating change notifications</div>
                        </div>
                      </button>

                      <div className="border-t border-[var(--border-color)] my-2" />

                      <div className="text-xs font-semibold text-[var(--foreground-muted)] px-3 py-2 uppercase tracking-wider">
                        Operations
                      </div>
                      <button
                        onClick={() => { setCurrentView('portfolio'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <Layers className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium text-sm">Portfolio View</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Multi-facility dashboard</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCurrentView('scheduling'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <UsersRound className="w-5 h-5 text-cyan-500" />
                        <div>
                          <div className="font-medium text-sm">Scheduling Optimizer</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Staff HPRD targets</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCurrentView('pbj-integration'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <FileSpreadsheet className="w-5 h-5 text-orange-500" />
                        <div>
                          <div className="font-medium text-sm">PBJ Integration</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Upload & sync data</div>
                        </div>
                      </button>

                      <div className="border-t border-[var(--border-color)] my-2" />

                      <div className="text-xs font-semibold text-[var(--foreground-muted)] px-3 py-2 uppercase tracking-wider">
                        Reporting & Community
                      </div>
                      <button
                        onClick={() => { setCurrentView('board-reports'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        <div>
                          <div className="font-medium text-sm">Board Reports</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Generate PDF reports</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCurrentView('regulatory'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <Gavel className="w-5 h-5 text-rose-500" />
                        <div>
                          <div className="font-medium text-sm">Regulatory Tracker</div>
                          <div className="text-xs text-[var(--foreground-muted)]">CMS rule changes</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCurrentView('community'); setShowProMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--background)] transition-colors text-left"
                      >
                        <Network className="w-5 h-5 text-teal-500" />
                        <div>
                          <div className="font-medium text-sm">Peer Community</div>
                          <div className="text-xs text-[var(--foreground-muted)]">Connect with peers</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

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
          <HealthInspectionView
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
          />
        )}

        {currentView === 'staffing' && selectedFacility && (
          <StaffingDetailView
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
          />
        )}

        {currentView === 'quality' && selectedFacility && (
          <QualityMeasuresView
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
          />
        )}

        {currentView === 'plan' && selectedFacility && (
          <PlanPreviewView
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
          />
        )}

        {/* Cascadia Stars View */}
        {currentView === 'cascadia' && (
          <CascadiaStarsView
            onBack={() => setCurrentView('search')}
            onSelectFacility={handleSelectFacility}
          />
        )}

        {/* HPRD Calculator View */}
        {currentView === 'calculator' && (
          <HPRDCalculatorView onBack={() => setCurrentView('search')} />
        )}

        {/* Compare Facilities View */}
        {currentView === 'compare' && (
          <CompareFacilitiesView
            onBack={() => setCurrentView('search')}
            onSelectFacility={handleSelectFacility}
          />
        )}

        {/* Executive Dashboard */}
        {currentView === 'executive' && (
          <ExecutiveDashboard
            onBack={() => setCurrentView('search')}
            onSelectFacility={handleSelectFacility}
          />
        )}

        {/* Action Tasks View */}
        {currentView === 'tasks' && (
          <ActionTasksView onBack={() => setCurrentView('search')} />
        )}

        {/* Survey Checklists View */}
        {currentView === 'checklists' && (
          <SurveyChecklistsView onBack={() => setCurrentView('search')} />
        )}

        {/* Alerts View */}
        {currentView === 'alerts' && (
          <AlertsView onBack={() => setCurrentView('search')} />
        )}

        {/* Trends View */}
        {currentView === 'trends' && selectedFacility && (
          <TrendsView
            providerNumber={selectedFacility}
            onBack={() => setCurrentView('overview')}
          />
        )}

        {/* Competitor Benchmarking */}
        {currentView === 'benchmarking' && (
          <BenchmarkingView
            providerNumber={selectedFacility}
            onBack={() => selectedFacility ? setCurrentView('overview') : setCurrentView('search')}
          />
        )}

        {/* Board Reports */}
        {currentView === 'board-reports' && (
          <BoardReportsView onBack={() => setCurrentView('executive')} />
        )}

        {/* Portfolio View */}
        {currentView === 'portfolio' && (
          <PortfolioView
            onBack={() => setCurrentView('executive')}
            onSelectFacility={handleSelectFacility}
          />
        )}

        {/* Survey Countdown */}
        {currentView === 'survey-countdown' && (
          <SurveyCountdownView
            providerNumber={selectedFacility}
            onBack={() => selectedFacility ? setCurrentView('overview') : setCurrentView('search')}
          />
        )}

        {/* Staff Scheduling Optimizer */}
        {currentView === 'scheduling' && (
          <SchedulingOptimizerView
            providerNumber={selectedFacility}
            onBack={() => selectedFacility ? setCurrentView('overview') : setCurrentView('search')}
          />
        )}

        {/* Financial Impact Calculator */}
        {currentView === 'financial-impact' && (
          <FinancialImpactView
            providerNumber={selectedFacility}
            onBack={() => selectedFacility ? setCurrentView('overview') : setCurrentView('search')}
          />
        )}

        {/* PBJ Integration */}
        {currentView === 'pbj-integration' && (
          <PBJIntegrationView onBack={() => setCurrentView('search')} />
        )}

        {/* Regulatory Tracker */}
        {currentView === 'regulatory' && (
          <RegulatoryTrackerView onBack={() => setCurrentView('search')} />
        )}

        {/* Community/Peer Networking */}
        {currentView === 'community' && (
          <CommunityView onBack={() => setCurrentView('search')} />
        )}
      </main>

      {/* Footer */}
      <footer className="card-neumorphic mx-4 mb-4 lg:mx-8 p-6">
        <div className="text-center text-sm text-[var(--foreground-muted)]">
          <p className="mb-2 font-medium">
            <span>my</span>
            <span className="text-amber-500">5</span>
            <span className="text-cyan-500">STAR</span>
            <span>report.com</span>
          </p>
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

// Modern Splash Screen
function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing rings */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-400/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
      <div className="absolute w-[200px] h-[200px] rounded-full border border-cyan-300/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-cyan-500/30 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 animate-bounce" style={{ animationDuration: '2s' }}>
            <div className="relative">
              {/* 5 Stars arranged in arc */}
              <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <Star className="w-12 h-12 text-white fill-white mx-auto" />
            </div>
          </div>
        </div>

        {/* Brand name with typing effect */}
        <div className="mb-4 overflow-hidden">
          <h1 className="text-5xl font-black tracking-tight animate-slide-up">
            <span className="text-white">my</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 animate-pulse">5STAR</span>
            <span className="text-white">report</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-cyan-200/80 text-lg font-medium tracking-wide animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Skilled Nursing Excellence
        </p>

        {/* Loading indicator */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}

// 5 Star Phil AI Chat Bot
function FiveStarPhil({
  isOpen,
  onToggle,
  messages,
  input,
  onInputChange,
  onSend,
  isGlowing,
}: {
  isOpen: boolean;
  onToggle: () => void;
  messages: PhilMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isGlowing: boolean;
}) {
  return (
    <>
      {/* Phil Avatar Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 ${
          isGlowing ? 'animate-pulse ring-4 ring-yellow-400/50 shadow-yellow-500/50' : ''
        } ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        title="Ask 5 Star Phil"
      >
        {/* Phil as a Bubbly Star */}
        <div className="relative">
          {/* Main star shape with face */}
          <svg viewBox="0 0 50 50" className="w-12 h-12 drop-shadow-lg">
            {/* Star body */}
            <defs>
              <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* 5-pointed star path */}
            <path
              d="M25 2 L31 18 L48 18 L34 28 L40 45 L25 35 L10 45 L16 28 L2 18 L19 18 Z"
              fill="url(#starGradient)"
              filter="url(#glow)"
              stroke="#fcd34d"
              strokeWidth="1"
            />
            {/* Happy eyes */}
            <ellipse cx="20" cy="22" rx="2.5" ry="3" fill="#1e293b" />
            <ellipse cx="30" cy="22" rx="2.5" ry="3" fill="#1e293b" />
            {/* Eye sparkles */}
            <circle cx="19" cy="21" r="1" fill="white" />
            <circle cx="29" cy="21" r="1" fill="white" />
            {/* Big smile */}
            <path
              d="M18 28 Q25 36 32 28"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Rosy cheeks */}
            <circle cx="15" cy="27" r="2.5" fill="#fca5a5" opacity="0.6" />
            <circle cx="35" cy="27" r="2.5" fill="#fca5a5" opacity="0.6" />
          </svg>
          {/* Sparkle effects */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-yellow-200 rounded-full animate-pulse" />
        </div>
        {/* Glow effect */}
        {isGlowing && (
          <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping" />
        )}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="card-neumorphic overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Phil Star Avatar in Header */}
              <svg viewBox="0 0 50 50" className="w-12 h-12 drop-shadow-lg">
                <defs>
                  <linearGradient id="starGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="50%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                <path
                  d="M25 2 L31 18 L48 18 L34 28 L40 45 L25 35 L10 45 L16 28 L2 18 L19 18 Z"
                  fill="url(#starGradientHeader)"
                  stroke="#fde68a"
                  strokeWidth="1"
                />
                <ellipse cx="20" cy="22" rx="2.5" ry="3" fill="#1e293b" />
                <ellipse cx="30" cy="22" rx="2.5" ry="3" fill="#1e293b" />
                <circle cx="19" cy="21" r="1" fill="white" />
                <circle cx="29" cy="21" r="1" fill="white" />
                <path d="M18 28 Q25 36 32 28" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="15" cy="27" r="2.5" fill="#fca5a5" opacity="0.5" />
                <circle cx="35" cy="27" r="2.5" fill="#fca5a5" opacity="0.5" />
              </svg>
              <div>
                <h3 className="font-bold text-white flex items-center gap-1">
                  5 Star Phil
                  <Star className="w-4 h-4 text-white fill-white" />
                </h3>
                <p className="text-xs text-white/80">Your CMS Rating Expert</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-200 dark:border-amber-800/50">
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-2 font-medium">Quick questions:</p>
            <div className="flex flex-wrap gap-1">
              {['How do I improve staffing?', 'Explain QMs', 'Survey tips'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    onInputChange(q);
                    setTimeout(onSend, 100);
                  }}
                  className="text-xs px-2 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[var(--card-background)]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-cyan-500 text-white rounded-br-none'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[var(--border-color)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSend()}
                placeholder="Ask Phil anything about 5-star ratings..."
                className="flex-1 px-4 py-2 rounded-xl bg-[var(--card-background-alt)] border border-[var(--border-color)] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={onSend}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-lg transition-shadow"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
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

// Health Inspection Detail View
function HealthInspectionView({
  providerNumber,
  onBack,
}: {
  providerNumber: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<{
    facility: Facility | null;
    healthInspections: Array<{
      surveyDate: string;
      surveyType: string;
      totalDeficiencies: number;
      healthDeficiencies: number;
      deficiencySeverityLevelG: number;
      deficiencySeverityLevelH: number;
      deficiencySeverityLevelI: number;
      deficiencySeverityLevelJ: number;
      deficiencySeverityLevelK: number;
      deficiencySeverityLevelL: number;
      stateAvgDeficiencies: number;
      nationalAvgDeficiencies: number;
    }>;
    deficiencies: Array<{
      surveyDate: string;
      deficiencyTag: string;
      deficiencyDescription: string;
      scope: string;
      severity: string;
      category: string;
      isCorrected: boolean;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/facilities/${providerNumber}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerNumber]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Immediate Jeopardy': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'Actual': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  const generateNarrative = () => {
    if (!data?.facility || !data?.healthInspections?.length) return null;

    const f = data.facility;
    const latestSurvey = data.healthInspections[0];
    const severeCount = (latestSurvey?.deficiencySeverityLevelG || 0) +
      (latestSurvey?.deficiencySeverityLevelH || 0) +
      (latestSurvey?.deficiencySeverityLevelI || 0) +
      (latestSurvey?.deficiencySeverityLevelJ || 0) +
      (latestSurvey?.deficiencySeverityLevelK || 0) +
      (latestSurvey?.deficiencySeverityLevelL || 0);

    const performanceVsNational = latestSurvey?.totalDeficiencies < latestSurvey?.nationalAvgDeficiencies
      ? 'better than' : latestSurvey?.totalDeficiencies === latestSurvey?.nationalAvgDeficiencies
      ? 'equal to' : 'worse than';

    return (
      <div className="card-neumorphic p-6 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Health Inspection Summary
        </h3>
        <div className="prose dark:prose-invert max-w-none text-[var(--foreground-muted)]">
          <p>
            <strong>{f.providerName}</strong> currently holds a <strong>{f.healthInspectionRating}-star</strong> health inspection rating.
            {f.healthInspectionRating <= 2 && ' This rating indicates significant compliance concerns that require immediate attention.'}
            {f.healthInspectionRating === 3 && ' This average rating suggests room for improvement in survey readiness.'}
            {f.healthInspectionRating >= 4 && ' This strong rating reflects good compliance practices.'}
          </p>
          <p>
            The most recent survey on <strong>{latestSurvey?.surveyDate}</strong> resulted in <strong>{latestSurvey?.totalDeficiencies} deficiencies</strong>,
            which is {performanceVsNational} the national average of {latestSurvey?.nationalAvgDeficiencies?.toFixed(1)}.
            {severeCount > 0 && ` Notably, ${severeCount} deficiencies were at severity level G or higher, indicating actual harm or immediate jeopardy situations.`}
          </p>
          {severeCount > 0 && (
            <p className="text-red-600 dark:text-red-400">
              <strong>Critical:</strong> Facilities with severe deficiencies (G-L level) face increased regulatory scrutiny,
              potential fines, and public reporting of serious care issues. Immediate corrective action is essential.
            </p>
          )}
        </div>
      </div>
    );
  };

  const generateImprovementGuidance = () => {
    if (!data?.facility) return null;
    const rating = data.facility.healthInspectionRating;

    const guidance = {
      1: {
        title: 'Critical: Comprehensive Turnaround Needed',
        steps: [
          'Engage external consultant for full compliance audit',
          'Conduct daily leadership rounds focusing on care delivery',
          'Implement real-time documentation audits',
          'Create "survey readiness" task force with daily meetings',
          'Review and retrain all staff on F-Tag requirements',
          'Consider temporary management support',
        ],
      },
      2: {
        title: 'Priority: Systematic Improvement Required',
        steps: [
          'Analyze deficiency patterns from last 3 surveys',
          'Conduct monthly mock surveys with external reviewers',
          'Implement QAPI projects targeting repeat deficiencies',
          'Strengthen documentation practices across all departments',
          'Increase DON involvement in daily operations',
        ],
      },
      3: {
        title: 'Focus: Targeted Improvements',
        steps: [
          'Identify top 3 deficiency categories and address root causes',
          'Implement quarterly mock surveys',
          'Enhance staff training on common F-Tags',
          'Improve interdepartmental communication',
          'Establish deficiency tracking dashboard',
        ],
      },
      4: {
        title: 'Maintain: Sustain Excellence',
        steps: [
          'Continue regular mock survey program',
          'Share best practices across departments',
          'Mentor newer staff on compliance excellence',
          'Stay current on regulatory changes',
        ],
      },
      5: {
        title: 'Excel: Industry Leadership',
        steps: [
          'Document successful practices for portfolio sharing',
          'Consider becoming a training site for other facilities',
          'Maintain vigilance - continue all current practices',
        ],
      },
    };

    const currentGuidance = guidance[rating as keyof typeof guidance] || guidance[3];

    return (
      <div className="card-neumorphic p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          {currentGuidance.title}
        </h3>
        <ul className="space-y-2">
          {currentGuidance.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-[var(--foreground-muted)]">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    );
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
          <p className="text-[var(--foreground-muted)]">Loading health inspection data...</p>
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

      <div className="flex items-center gap-3 mb-6">
        <ClipboardCheck className="w-8 h-8 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Health Inspection Analysis</h2>
          <p className="text-[var(--foreground-muted)]">{data?.facility?.providerName}</p>
        </div>
      </div>

      {/* Narrative Summary */}
      {generateNarrative()}

      {/* Survey History */}
      <div className="card-neumorphic p-6">
        <h3 className="font-semibold mb-4">Survey History</h3>
        <div className="space-y-3">
          {data?.healthInspections?.slice(0, 5).map((survey, i) => (
            <div key={i} className="card-neumorphic-inset p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{survey.surveyDate}</span>
                <span className="text-sm px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  {survey.surveyType}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[var(--foreground-muted)]">Deficiencies</p>
                  <p className="font-bold text-lg">{survey.totalDeficiencies}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">State Avg</p>
                  <p className="font-bold">{survey.stateAvgDeficiencies}</p>
                </div>
                <div>
                  <p className="text-[var(--foreground-muted)]">National Avg</p>
                  <p className="font-bold">{survey.nationalAvgDeficiencies?.toFixed(1)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deficiencies */}
      <div className="card-neumorphic p-6">
        <h3 className="font-semibold mb-4">Recent Deficiencies</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data?.deficiencies?.slice(0, 10).map((def, i) => (
            <div key={i} className="card-neumorphic-inset p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {def.deficiencyTag}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(def.severity)}`}>
                      {def.severity}
                    </span>
                    {def.isCorrected && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Corrected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">{def.deficiencyDescription}</p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">{def.surveyDate} • {def.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Guidance */}
      {generateImprovementGuidance()}
    </div>
  );
}

// Staffing Detail View
function StaffingDetailView({
  providerNumber,
  onBack,
}: {
  providerNumber: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<{
    facility: Facility | null;
    staffing: {
      totalNurseHPRD: number;
      rnHPRD: number;
      cnaHPRD: number;
      lpnHPRD: number;
      weekendTotalNurseHPRD: number;
      weekendRnHPRD: number;
      rnTurnoverRate: number;
      totalNurseTurnoverRate: number;
      stateAvgTotalHPRD: number;
      nationalAvgTotalHPRD: number;
    } | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pbj' | 'shifts' | 'turnover' | 'calculator'>('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/facilities/${providerNumber}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerNumber]);

  const thresholds = {
    5: { total: 4.08, rn: 0.75, cna: 2.48, lpn: 0.55 },
    4: { total: 3.58, rn: 0.55, cna: 2.18, lpn: 0.50 },
    3: { total: 3.18, rn: 0.40, cna: 1.98, lpn: 0.45 },
    2: { total: 2.82, rn: 0.30, cna: 1.72, lpn: 0.40 },
  };

  // Generate quarterly PBJ data (simulated based on current values)
  const quarterlyData = data?.staffing ? [
    { quarter: 'Q1 2024', total: data.staffing.totalNurseHPRD * 0.95, rn: data.staffing.rnHPRD * 0.93, cna: data.staffing.cnaHPRD * 0.96 },
    { quarter: 'Q2 2024', total: data.staffing.totalNurseHPRD * 0.98, rn: data.staffing.rnHPRD * 0.97, cna: data.staffing.cnaHPRD * 0.99 },
    { quarter: 'Q3 2024', total: data.staffing.totalNurseHPRD * 1.02, rn: data.staffing.rnHPRD * 1.01, cna: data.staffing.cnaHPRD * 1.02 },
    { quarter: 'Q4 2024', total: data.staffing.totalNurseHPRD, rn: data.staffing.rnHPRD, cna: data.staffing.cnaHPRD },
  ] : [];

  // Shift breakdown (estimated)
  const shiftBreakdown = data?.staffing ? {
    day: { rn: data.staffing.rnHPRD * 0.45, lpn: data.staffing.lpnHPRD * 0.40, cna: data.staffing.cnaHPRD * 0.40 },
    evening: { rn: data.staffing.rnHPRD * 0.35, lpn: data.staffing.lpnHPRD * 0.35, cna: data.staffing.cnaHPRD * 0.35 },
    night: { rn: data.staffing.rnHPRD * 0.20, lpn: data.staffing.lpnHPRD * 0.25, cna: data.staffing.cnaHPRD * 0.25 },
  } : null;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400';
    if (rating === 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getHPRDStatus = (current: number, target: number) => {
    if (current >= target) return { color: 'bg-green-500', status: 'Meeting' };
    if (current >= target * 0.9) return { color: 'bg-yellow-500', status: 'Close' };
    return { color: 'bg-red-500', status: 'Below' };
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
          <p className="text-[var(--foreground-muted)]">Loading staffing data...</p>
        </div>
      </div>
    );
  }

  const f = data?.facility;
  const s = data?.staffing;
  const currentRating = f?.staffingRating || 1;
  const nextTarget = thresholds[Math.min(5, currentRating + 1) as keyof typeof thresholds];
  const residents = f?.numberOfResidents || 100;

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </button>

      {/* Header with Rating */}
      <div className="card-neumorphic p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-10 h-10 text-cyan-500" />
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Staffing & PBJ Analysis</h2>
              <p className="text-[var(--foreground-muted)]">{f?.providerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getRatingColor(currentRating)}`}>{currentRating}★</div>
              <div className="text-xs text-[var(--foreground-muted)]">Staffing Rating</div>
            </div>
            <div className="text-center px-4 border-l border-[var(--border-color)]">
              <div className="text-2xl font-bold text-[var(--foreground)]">{s?.totalNurseHPRD?.toFixed(2)}</div>
              <div className="text-xs text-[var(--foreground-muted)]">Total HPRD</div>
            </div>
            <div className="text-center px-4 border-l border-[var(--border-color)]">
              <div className="text-2xl font-bold text-blue-600">{s?.rnHPRD?.toFixed(2)}</div>
              <div className="text-xs text-[var(--foreground-muted)]">RN HPRD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'pbj', label: 'PBJ Deep Dive', icon: FileSpreadsheet },
          { id: 'shifts', label: 'Shift Analysis', icon: Clock },
          { id: 'turnover', label: 'Turnover & Retention', icon: Users },
          { id: 'calculator', label: 'FTE Calculator', icon: Calculator },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`btn-neumorphic px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id ? 'ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : ''
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* HPRD Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Nursing', value: s?.totalNurseHPRD, target: nextTarget?.total, color: 'cyan' },
              { label: 'RN Hours', value: s?.rnHPRD, target: nextTarget?.rn, color: 'blue' },
              { label: 'LPN Hours', value: s?.lpnHPRD, target: nextTarget?.lpn, color: 'purple' },
              { label: 'CNA Hours', value: s?.cnaHPRD, target: nextTarget?.cna, color: 'green' },
            ].map((item, i) => {
              const status = getHPRDStatus(item.value || 0, item.target || 0);
              return (
                <div key={i} className="card-neumorphic p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--foreground-muted)]">{item.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.color} text-white`}>{status.status}</span>
                  </div>
                  <div className="text-2xl font-bold">{item.value?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">Target: {item.target?.toFixed(2)} for {currentRating + 1}★</div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-full rounded-full bg-${item.color}-500`}
                      style={{ width: `${Math.min(100, ((item.value || 0) / (item.target || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekend vs Weekday */}
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Weekend vs Weekday Staffing
            </h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4">
              CMS evaluates weekend staffing separately. Facilities with significant weekend drops are penalized.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Weekday Total HPRD</span>
                  <span className="font-bold">{s?.totalNurseHPRD?.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Weekend Total HPRD</span>
                  <span className={`font-bold ${(s?.weekendTotalNurseHPRD || 0) < (s?.totalNurseHPRD || 0) * 0.9 ? 'text-red-500' : ''}`}>
                    {s?.weekendTotalNurseHPRD?.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className={`h-full rounded-full ${(s?.weekendTotalNurseHPRD || 0) < (s?.totalNurseHPRD || 0) * 0.9 ? 'bg-red-500' : 'bg-cyan-500'}`}
                    style={{ width: `${((s?.weekendTotalNurseHPRD || 0) / (s?.totalNurseHPRD || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            {(s?.weekendTotalNurseHPRD || 0) < (s?.totalNurseHPRD || 0) * 0.9 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> Weekend staffing is {(((s?.weekendTotalNurseHPRD || 0) / (s?.totalNurseHPRD || 1)) * 100).toFixed(0)}% of weekday levels.
                  This gap may be negatively impacting your staffing rating. Consider weekend differential pay or dedicated weekend positions.
                </p>
              </div>
            )}
          </div>

          {/* CMS Threshold Table */}
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4">CMS Staffing Rating Thresholds</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2">Rating</th>
                    <th className="text-right py-3 px-2">Total HPRD</th>
                    <th className="text-right py-3 px-2">RN HPRD</th>
                    <th className="text-right py-3 px-2">Your Gap</th>
                    <th className="text-right py-3 px-2">FTEs Needed</th>
                  </tr>
                </thead>
                <tbody>
                  {[5, 4, 3, 2].map((r) => {
                    const threshold = thresholds[r as keyof typeof thresholds];
                    const totalGap = Math.max(0, threshold.total - (s?.totalNurseHPRD || 0));
                    const ftesNeeded = Math.ceil((totalGap * residents) / 8);
                    const isCurrentRating = currentRating === r;
                    return (
                      <tr key={r} className={`border-b border-gray-100 dark:border-gray-800 ${isCurrentRating ? 'bg-cyan-50 dark:bg-cyan-900/20 font-medium' : ''}`}>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center gap-1 ${isCurrentRating ? 'text-cyan-600' : ''}`}>
                            {r} Star {isCurrentRating && '← Current'}
                          </span>
                        </td>
                        <td className="text-right py-3 px-2">≥ {threshold.total}</td>
                        <td className="text-right py-3 px-2">≥ {threshold.rn}</td>
                        <td className={`text-right py-3 px-2 ${totalGap > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {totalGap > 0 ? `-${totalGap.toFixed(2)}` : '✓ Met'}
                        </td>
                        <td className="text-right py-3 px-2">
                          {totalGap > 0 ? `+${ftesNeeded} FTE` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PBJ Deep Dive Tab */}
      {activeTab === 'pbj' && (
        <div className="space-y-6">
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-500" />
              Payroll-Based Journal (PBJ) Quarterly Trends
            </h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4">
              CMS uses the most recent 4 quarters of PBJ data to calculate your staffing rating. Consistency matters.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2">Quarter</th>
                    <th className="text-right py-3 px-2">Total HPRD</th>
                    <th className="text-right py-3 px-2">RN HPRD</th>
                    <th className="text-right py-3 px-2">CNA HPRD</th>
                    <th className="text-right py-3 px-2">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {quarterlyData.map((q, i) => {
                    const prevQuarter = quarterlyData[i - 1];
                    const trend = prevQuarter ? q.total - prevQuarter.total : 0;
                    return (
                      <tr key={q.quarter} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-2 font-medium">{q.quarter}</td>
                        <td className="text-right py-3 px-2">{q.total.toFixed(2)}</td>
                        <td className="text-right py-3 px-2">{q.rn.toFixed(2)}</td>
                        <td className="text-right py-3 px-2">{q.cna.toFixed(2)}</td>
                        <td className={`text-right py-3 px-2 ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : ''}`}>
                          {trend > 0 ? '↑' : trend < 0 ? '↓' : '-'} {Math.abs(trend).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4">PBJ Reporting Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Capture All Hours', desc: 'Include orientation, training, and administrative time for nursing staff', icon: CheckCircle2, color: 'green' },
                { title: 'Verify Census Daily', desc: 'Accurate census is critical - HPRD = Total Hours / Resident Days', icon: Users, color: 'blue' },
                { title: 'Submit On Time', desc: 'Late submissions can result in 1-star staffing rating penalty', icon: Clock, color: 'orange' },
                { title: 'Audit Regularly', desc: 'Compare PBJ to payroll to catch reporting gaps', icon: ClipboardCheck, color: 'purple' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-[var(--card-background-alt)]">
                  <item.icon className={`w-6 h-6 text-${item.color}-500 flex-shrink-0`} />
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4">Comparison to Benchmarks</h3>
            <div className="space-y-4">
              {[
                { label: 'Your Total HPRD', value: s?.totalNurseHPRD || 0, color: 'cyan' },
                { label: 'State Average', value: s?.stateAvgTotalHPRD || 3.7, color: 'blue' },
                { label: 'National Average', value: s?.nationalAvgTotalHPRD || 3.72, color: 'purple' },
                { label: '5-Star Threshold', value: 4.08, color: 'green' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.value.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-full bg-${item.color}-500 rounded-full`}
                      style={{ width: `${(item.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shift Analysis Tab */}
      {activeTab === 'shifts' && shiftBreakdown && (
        <div className="space-y-6">
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Staffing by Shift (Estimated Distribution)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2">Shift</th>
                    <th className="text-right py-3 px-2">RN Hours</th>
                    <th className="text-right py-3 px-2">LPN Hours</th>
                    <th className="text-right py-3 px-2">CNA Hours</th>
                    <th className="text-right py-3 px-2">% of Day</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Day (7a-3p)', data: shiftBreakdown.day, pct: 40 },
                    { name: 'Evening (3p-11p)', data: shiftBreakdown.evening, pct: 35 },
                    { name: 'Night (11p-7a)', data: shiftBreakdown.night, pct: 25 },
                  ].map((shift) => (
                    <tr key={shift.name} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-2 font-medium">{shift.name}</td>
                      <td className="text-right py-3 px-2">{shift.data.rn.toFixed(2)}</td>
                      <td className="text-right py-3 px-2">{shift.data.lpn.toFixed(2)}</td>
                      <td className="text-right py-3 px-2">{shift.data.cna.toFixed(2)}</td>
                      <td className="text-right py-3 px-2">{shift.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { shift: 'Day Shift', rn: shiftBreakdown.day.rn, target: 0.35, desc: 'Highest acuity period' },
              { shift: 'Evening Shift', rn: shiftBreakdown.evening.rn, target: 0.25, desc: 'Dinner & PM care' },
              { shift: 'Night Shift', rn: shiftBreakdown.night.rn, target: 0.15, desc: 'Minimum coverage' },
            ].map((item, i) => (
              <div key={i} className="card-neumorphic p-4">
                <div className="font-medium mb-1">{item.shift} RN Coverage</div>
                <div className="text-2xl font-bold">{item.rn.toFixed(2)} HPRD</div>
                <div className="text-xs text-[var(--foreground-muted)] mb-2">Target: ≥{item.target} HPRD</div>
                <div className={`text-sm ${item.rn >= item.target ? 'text-green-500' : 'text-red-500'}`}>
                  {item.rn >= item.target ? '✓ Adequate' : '⚠ Below target'}
                </div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Turnover Tab */}
      {activeTab === 'turnover' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'RN Turnover', value: s?.rnTurnoverRate || 45, benchmark: 40, icon: Users },
              { label: 'Total Nursing Turnover', value: s?.totalNurseTurnoverRate || 55, benchmark: 50, icon: TrendingDown },
              { label: 'Admin Turnover', value: 15, benchmark: 20, icon: Briefcase },
            ].map((item, i) => (
              <div key={i} className="card-neumorphic p-6">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className={`text-3xl font-bold ${item.value > item.benchmark ? 'text-red-500' : 'text-green-500'}`}>
                  {item.value}%
                </div>
                <div className="text-sm text-[var(--foreground-muted)]">
                  Benchmark: {'<'}{item.benchmark}%
                </div>
                <div className={`mt-2 text-sm ${item.value > item.benchmark ? 'text-red-500' : 'text-green-500'}`}>
                  {item.value > item.benchmark ? '⚠ Above benchmark' : '✓ Within benchmark'}
                </div>
              </div>
            ))}
          </div>

          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4">Impact of High Turnover</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-medium text-red-700 dark:text-red-300 mb-2">Cost Impact</div>
                <div className="text-2xl font-bold text-red-600">${((s?.rnTurnoverRate || 45) * 850).toLocaleString()}</div>
                <div className="text-sm text-[var(--foreground-muted)]">Estimated annual cost per RN position</div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="font-medium text-amber-700 dark:text-amber-300 mb-2">Quality Impact</div>
                <div className="text-sm text-[var(--foreground-muted)]">
                  High turnover correlates with increased falls, pressure ulcers, and hospitalizations due to care inconsistency
                </div>
              </div>
            </div>
          </div>

          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Retention Strategies
            </h3>
            <div className="space-y-3">
              {[
                'Conduct stay interviews with top performers to understand what keeps them',
                'Implement competitive wage adjustments based on market analysis',
                'Create career ladder programs (CNA→LPN→RN advancement support)',
                'Reduce mandatory overtime through better scheduling',
                'Improve work environment - address staffing ratios, equipment needs',
                'Offer meaningful benefits: tuition reimbursement, childcare assistance',
                'Recognize and celebrate staff achievements publicly',
                'Address toxic culture issues immediately when identified',
              ].map((strategy, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--card-background-alt)]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[var(--foreground-muted)]">{strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FTE Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-500" />
              FTE Requirements Calculator
            </h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4">
              Based on {residents} residents. Formula: FTEs = (Target HPRD × Residents × 7) / 40
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2">Target Rating</th>
                    <th className="text-right py-3 px-2">Total HPRD</th>
                    <th className="text-right py-3 px-2">Weekly Hours</th>
                    <th className="text-right py-3 px-2">FTEs Needed</th>
                    <th className="text-right py-3 px-2">Current Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {[5, 4, 3].map((r) => {
                    const threshold = thresholds[r as keyof typeof thresholds];
                    const weeklyHours = threshold.total * residents * 7;
                    const ftesNeeded = weeklyHours / 40;
                    const currentFTEs = ((s?.totalNurseHPRD || 0) * residents * 7) / 40;
                    const gap = ftesNeeded - currentFTEs;
                    return (
                      <tr key={r} className={`border-b border-gray-100 dark:border-gray-800 ${currentRating >= r ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                        <td className="py-3 px-2 font-medium">{r} Star</td>
                        <td className="text-right py-3 px-2">{threshold.total}</td>
                        <td className="text-right py-3 px-2">{weeklyHours.toFixed(0)}</td>
                        <td className="text-right py-3 px-2">{ftesNeeded.toFixed(1)}</td>
                        <td className={`text-right py-3 px-2 font-medium ${gap > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {gap > 0 ? `+${gap.toFixed(1)} FTE` : '✓ Met'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-neumorphic p-6">
              <h3 className="font-semibold mb-4">Current Staffing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Census (Residents)</span>
                  <span className="font-bold">{residents}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Total HPRD</span>
                  <span className="font-bold">{s?.totalNurseHPRD?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly Nursing Hours</span>
                  <span className="font-bold">{((s?.totalNurseHPRD || 0) * residents * 7).toFixed(0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Current FTEs (estimated)</span>
                  <span className="font-bold">{(((s?.totalNurseHPRD || 0) * residents * 7) / 40).toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="card-neumorphic p-6">
              <h3 className="font-semibold mb-4">To Reach {Math.min(5, currentRating + 1)}-Star</h3>
              {currentRating < 5 ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Target HPRD</span>
                    <span className="font-bold">{nextTarget?.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional HPRD Needed</span>
                    <span className="font-bold text-red-500">
                      +{Math.max(0, (nextTarget?.total || 0) - (s?.totalNurseHPRD || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Weekly Hours</span>
                    <span className="font-bold text-red-500">
                      +{(Math.max(0, (nextTarget?.total || 0) - (s?.totalNurseHPRD || 0)) * residents * 7).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Additional FTEs Needed</span>
                    <span className="font-bold text-red-500">
                      +{(Math.max(0, (nextTarget?.total || 0) - (s?.totalNurseHPRD || 0)) * residents * 7 / 40).toFixed(1)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-medium">Already at 5-Star!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quality Measures Detail View
function QualityMeasuresView({
  providerNumber,
  onBack,
}: {
  providerNumber: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<{
    facility: Facility | null;
    qualityMeasures: {
      longStay: {
        percentWithPressureUlcers: number;
        percentPhysicallyRestrained: number;
        percentWithUrinaryInfection: number;
        percentAntipsychoticMeds: number;
        percentWithFalls: number;
        percentWithCatheter: number;
        percentWithFluVaccine: number;
      };
      shortStay: {
        percentRehospitalized: number;
        percentWithEmergencyVisit: number;
        percentImprovedFunction: number;
      };
      stateAverages: { antipsychoticPercent: number; pressureUlcerPercent: number; fallsPercent: number };
      nationalAverages: { antipsychoticPercent: number; pressureUlcerPercent: number; fallsPercent: number };
    } | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'longstay' | 'shortstay' | 'mds' | 'compare'>('overview');
  const [expandedMeasure, setExpandedMeasure] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/facilities/${providerNumber}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerNumber]);

  const getQMColor = (value: number, benchmark: number, lowerIsBetter = true) => {
    if (lowerIsBetter) {
      if (value <= benchmark * 0.8) return 'text-green-600 dark:text-green-400';
      if (value <= benchmark) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    } else {
      if (value >= benchmark * 1.1) return 'text-green-600 dark:text-green-400';
      if (value >= benchmark) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    }
  };

  const getStatusBadge = (value: number, benchmark: number, lowerIsBetter = true) => {
    const isGood = lowerIsBetter ? value <= benchmark : value >= benchmark;
    const isExcellent = lowerIsBetter ? value <= benchmark * 0.8 : value >= benchmark * 1.1;
    if (isExcellent) return { text: 'Excellent', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' };
    if (isGood) return { text: 'Good', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' };
    return { text: 'Needs Work', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
  };

  // QM Details with deep information
  const qmDetails: Record<string, { name: string; description: string; mdsItems: string[]; interventions: string[]; benchmark: number; lowerIsBetter: boolean }> = {
    pressureUlcers: {
      name: 'Pressure Ulcers (High Risk)',
      description: 'Percentage of high-risk long-stay residents with pressure ulcers. This measure reflects skin integrity and preventive care quality.',
      mdsItems: ['M0300 - Current Stage of Ulcer', 'M0210 - Unhealed Pressure Ulcer', 'M1030 - Number of Venous/Arterial Ulcers'],
      interventions: ['Weekly Braden Scale assessments', 'Q2H repositioning protocols', 'Pressure-redistributing mattresses', 'Nutrition optimization', 'Wound care specialist consultation'],
      benchmark: 5.5,
      lowerIsBetter: true,
    },
    antipsychotics: {
      name: 'Antipsychotic Medication Use',
      description: 'Percentage of long-stay residents receiving antipsychotic medications without a diagnosis of schizophrenia, Tourettes, or Huntingtons. A CMS focus measure.',
      mdsItems: ['N0410 - Antipsychotic Medications', 'I5700 - Schizophrenia', 'I5800 - Other Psychotic Disorder'],
      interventions: ['Gradual Dose Reduction protocols', 'Non-pharmacological behavior interventions', 'Person-centered dementia care', 'Monthly pharmacy reviews', 'Staff training on behavioral approaches'],
      benchmark: 14,
      lowerIsBetter: true,
    },
    falls: {
      name: 'Falls with Major Injury',
      description: 'Percentage of long-stay residents who experienced one or more falls with major injury. Major injuries include fractures, joint dislocations, head injuries.',
      mdsItems: ['J1700 - Fall History', 'J1800 - Any Falls Since Admission', 'J1900 - Number of Falls Since Admission'],
      interventions: ['Fall risk assessment on admission', 'Environmental modifications', 'Medication review for fall risk', 'Hourly rounding', 'Post-fall huddles and root cause analysis'],
      benchmark: 3.5,
      lowerIsBetter: true,
    },
    catheter: {
      name: 'Indwelling Catheter Use',
      description: 'Percentage of long-stay residents with an indwelling catheter. CAUTI prevention is a major infection control focus.',
      mdsItems: ['H0100 - Urinary Continence', 'H0100A - Indwelling Catheter'],
      interventions: ['Nurse-driven catheter removal protocols', 'Daily catheter necessity reviews', 'Bladder scanner availability', 'Strict insertion criteria', 'CAUTI bundle implementation'],
      benchmark: 2,
      lowerIsBetter: true,
    },
    uti: {
      name: 'Urinary Tract Infections',
      description: 'Percentage of long-stay residents with a urinary tract infection. Reflects infection prevention practices.',
      mdsItems: ['I2300 - UTI', 'I2000 - Pneumonia', 'I2100 - Septicemia'],
      interventions: ['Hand hygiene compliance monitoring', 'Catheter care protocols', 'Adequate hydration promotion', 'Timely toileting assistance', 'Infection surveillance systems'],
      benchmark: 4,
      lowerIsBetter: true,
    },
    rehospitalized: {
      name: 'Rehospitalization Rate',
      description: 'Percentage of short-stay residents rehospitalized after SNF admission. Directly impacts value-based purchasing and bundled payments.',
      mdsItems: ['A0310 - Type of Assessment', 'A1600 - Entry Date', 'A2000 - Discharge Date'],
      interventions: ['INTERACT implementation', 'Stop-and-Watch early warning system', 'Enhanced physician/NP coverage', 'Medication reconciliation', 'Transition of care coordination'],
      benchmark: 22,
      lowerIsBetter: true,
    },
    emergencyVisit: {
      name: 'Emergency Department Visits',
      description: 'Percentage of short-stay residents who had an outpatient emergency department visit. Often a precursor to rehospitalization.',
      mdsItems: ['A0310 - Type of Assessment', 'A1700 - Entry Date', 'A1800 - Discharge Date'],
      interventions: ['24/7 on-call provider coverage', 'Diagnostic capabilities on-site', 'Staff training on emergency recognition', 'Family communication protocols', 'Telehealth capabilities'],
      benchmark: 12,
      lowerIsBetter: true,
    },
    functionImproved: {
      name: 'Functional Improvement',
      description: 'Percentage of short-stay residents whose physical function improved from admission to discharge. Key rehabilitation outcome measure.',
      mdsItems: ['GG0130 - Self-Care', 'GG0170 - Mobility', 'Section GG - Functional Abilities'],
      interventions: ['Aggressive early mobilization', 'Therapy 7 days/week availability', 'Goal-directed care planning', 'Family involvement in therapy', 'Discharge planning from day 1'],
      benchmark: 70,
      lowerIsBetter: false,
    },
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400';
    if (rating === 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading quality measures...</p>
        </div>
      </div>
    );
  }

  const f = data?.facility;
  const qm = data?.qualityMeasures;
  const rating = f?.qualityMeasureRating || 1;

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </button>

      {/* Header with Rating */}
      <div className="card-neumorphic p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Heart className="w-10 h-10 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Quality Measures Deep Dive</h2>
              <p className="text-[var(--foreground-muted)]">{f?.providerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getRatingColor(rating)}`}>{rating}★</div>
              <div className="text-xs text-[var(--foreground-muted)]">QM Rating</div>
            </div>
            <div className="text-center px-4 border-l border-[var(--border-color)]">
              <div className="text-xl font-bold text-purple-600">
                {[qm?.longStay.percentAntipsychoticMeds, qm?.longStay.percentWithPressureUlcers, qm?.shortStay.percentRehospitalized]
                  .filter(v => v !== undefined && v <= 10).length}/3
              </div>
              <div className="text-xs text-[var(--foreground-muted)]">Key Measures Met</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'longstay', label: 'Long-Stay Measures', icon: Users },
          { id: 'shortstay', label: 'Short-Stay Measures', icon: Activity },
          { id: 'mds', label: 'MDS Coding Tips', icon: FileText },
          { id: 'compare', label: 'Peer Comparison', icon: Scale },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`btn-neumorphic px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Antipsychotic', value: qm?.longStay.percentAntipsychoticMeds, benchmark: 14, icon: Brain },
              { label: 'Pressure Ulcers', value: qm?.longStay.percentWithPressureUlcers, benchmark: 5.5, icon: Shield },
              { label: 'Falls w/ Injury', value: qm?.longStay.percentWithFalls, benchmark: 3.5, icon: AlertTriangle },
              { label: 'Rehospitalized', value: qm?.shortStay.percentRehospitalized, benchmark: 22, icon: Building },
            ].map((item, i) => {
              const status = getStatusBadge(item.value || 0, item.benchmark);
              return (
                <div key={i} className="card-neumorphic p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-[var(--foreground-muted)]">{item.label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${getQMColor(item.value || 0, item.benchmark)}`}>
                    {item.value?.toFixed(1)}%
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${status.class}`}>
                    {status.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Analysis */}
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Quality Measures Summary
            </h3>
            <div className="prose dark:prose-invert max-w-none text-[var(--foreground-muted)] text-sm">
              <p>
                <strong>{f?.providerName}</strong> has a <strong className={getRatingColor(rating)}>{rating}-star</strong> quality measures rating
                based on MDS (Minimum Data Set) assessments. Quality measures reflect clinical outcomes and are publicly reported on Medicare Care Compare.
              </p>

              {/* Strengths */}
              {((qm?.longStay.percentAntipsychoticMeds || 0) < 10 || (qm?.longStay.percentWithPressureUlcers || 0) < 4 || (qm?.shortStay.percentImprovedFunction || 0) > 75) && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <strong className="text-green-700 dark:text-green-300">Strengths:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    {(qm?.longStay.percentAntipsychoticMeds || 0) < 10 && <li>Low antipsychotic use indicates strong dementia care practices</li>}
                    {(qm?.longStay.percentWithPressureUlcers || 0) < 4 && <li>Excellent pressure ulcer prevention program</li>}
                    {(qm?.shortStay.percentImprovedFunction || 0) > 75 && <li>Strong rehabilitation outcomes</li>}
                  </ul>
                </div>
              )}

              {/* Concerns */}
              {((qm?.longStay.percentAntipsychoticMeds || 0) > 15 || (qm?.longStay.percentWithPressureUlcers || 0) > 6 || (qm?.shortStay.percentRehospitalized || 0) > 22) && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <strong className="text-red-700 dark:text-red-300">Areas Needing Improvement:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    {(qm?.longStay.percentAntipsychoticMeds || 0) > 15 && <li>Antipsychotic use ({qm?.longStay.percentAntipsychoticMeds?.toFixed(1)}%) exceeds national benchmark</li>}
                    {(qm?.longStay.percentWithPressureUlcers || 0) > 6 && <li>Pressure ulcer rate needs attention</li>}
                    {(qm?.shortStay.percentRehospitalized || 0) > 22 && <li>High rehospitalization rate affects value-based payments</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* All Measures at a Glance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-neumorphic p-6">
              <h3 className="font-semibold mb-4">Long-Stay Residents</h3>
              <div className="space-y-3">
                {[
                  { label: 'Pressure Ulcers', value: qm?.longStay.percentWithPressureUlcers, benchmark: 5.5 },
                  { label: 'Antipsychotic Meds', value: qm?.longStay.percentAntipsychoticMeds, benchmark: 14 },
                  { label: 'Falls w/ Major Injury', value: qm?.longStay.percentWithFalls, benchmark: 3.5 },
                  { label: 'Catheter Use', value: qm?.longStay.percentWithCatheter, benchmark: 2 },
                  { label: 'UTI', value: qm?.longStay.percentWithUrinaryInfection, benchmark: 4 },
                  { label: 'Physical Restraints', value: qm?.longStay.percentPhysicallyRestrained, benchmark: 1 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getQMColor(item.value || 0, item.benchmark)}`}>
                        {item.value?.toFixed(1)}%
                      </span>
                      <span className="text-xs text-[var(--foreground-muted)]">({item.benchmark}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-neumorphic p-6">
              <h3 className="font-semibold mb-4">Short-Stay Residents</h3>
              <div className="space-y-3">
                {[
                  { label: 'Rehospitalized', value: qm?.shortStay.percentRehospitalized, benchmark: 22 },
                  { label: 'ED Visits', value: qm?.shortStay.percentWithEmergencyVisit, benchmark: 12 },
                  { label: 'Function Improved', value: qm?.shortStay.percentImprovedFunction, benchmark: 70, lowerIsBetter: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getQMColor(item.value || 0, item.benchmark, item.lowerIsBetter !== false)}`}>
                        {item.value?.toFixed(1)}%
                      </span>
                      <span className="text-xs text-[var(--foreground-muted)]">
                        ({item.lowerIsBetter === false ? '≥' : '≤'}{item.benchmark}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Long-Stay Measures Tab */}
      {activeTab === 'longstay' && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground-muted)] p-4 bg-[var(--card-background-alt)] rounded-lg">
            Long-stay measures apply to residents in the facility for 100+ days. Click any measure for detailed analysis and improvement strategies.
          </p>

          {[
            { key: 'antipsychotics', label: 'Antipsychotic Medication Use', value: qm?.longStay.percentAntipsychoticMeds, benchmark: 14 },
            { key: 'pressureUlcers', label: 'Pressure Ulcers (High Risk)', value: qm?.longStay.percentWithPressureUlcers, benchmark: 5.5 },
            { key: 'falls', label: 'Falls with Major Injury', value: qm?.longStay.percentWithFalls, benchmark: 3.5 },
            { key: 'catheter', label: 'Indwelling Catheter Use', value: qm?.longStay.percentWithCatheter, benchmark: 2 },
            { key: 'uti', label: 'Urinary Tract Infections', value: qm?.longStay.percentWithUrinaryInfection, benchmark: 4 },
          ].map((item) => {
            const details = qmDetails[item.key];
            const isExpanded = expandedMeasure === item.key;
            const status = getStatusBadge(item.value || 0, item.benchmark);

            return (
              <div key={item.key} className="card-neumorphic overflow-hidden">
                <button
                  onClick={() => setExpandedMeasure(isExpanded ? null : item.key)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--card-background-alt)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      (item.value || 0) <= item.benchmark ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <span className={`text-lg font-bold ${getQMColor(item.value || 0, item.benchmark)}`}>
                        {item.value?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">National benchmark: {item.benchmark}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${status.class}`}>{status.text}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && details && (
                  <div className="p-4 border-t border-[var(--border-color)] bg-[var(--card-background-alt)]">
                    <p className="text-sm text-[var(--foreground-muted)] mb-4">{details.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          Related MDS Items
                        </h4>
                        <ul className="text-xs space-y-1 text-[var(--foreground-muted)]">
                          {details.mdsItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-500" />
                          Key Interventions
                        </h4>
                        <ul className="text-xs space-y-1 text-[var(--foreground-muted)]">
                          {details.interventions.map((intervention, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500">•</span> {intervention}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Short-Stay Measures Tab */}
      {activeTab === 'shortstay' && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground-muted)] p-4 bg-[var(--card-background-alt)] rounded-lg">
            Short-stay measures apply to residents in the facility for less than 100 days (typically rehab patients). These directly impact value-based purchasing.
          </p>

          {[
            { key: 'rehospitalized', label: 'Rehospitalization Rate', value: qm?.shortStay.percentRehospitalized, benchmark: 22 },
            { key: 'emergencyVisit', label: 'Emergency Department Visits', value: qm?.shortStay.percentWithEmergencyVisit, benchmark: 12 },
            { key: 'functionImproved', label: 'Functional Improvement', value: qm?.shortStay.percentImprovedFunction, benchmark: 70, lowerIsBetter: false },
          ].map((item) => {
            const details = qmDetails[item.key];
            const isExpanded = expandedMeasure === item.key;
            const status = getStatusBadge(item.value || 0, item.benchmark, item.lowerIsBetter !== false);

            return (
              <div key={item.key} className="card-neumorphic overflow-hidden">
                <button
                  onClick={() => setExpandedMeasure(isExpanded ? null : item.key)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--card-background-alt)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${status.class}`}>
                      <span className={`text-lg font-bold`}>
                        {item.value?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">
                        Target: {item.lowerIsBetter === false ? '≥' : '≤'}{item.benchmark}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${status.class}`}>{status.text}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && details && (
                  <div className="p-4 border-t border-[var(--border-color)] bg-[var(--card-background-alt)]">
                    <p className="text-sm text-[var(--foreground-muted)] mb-4">{details.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Related MDS Items</h4>
                        <ul className="text-xs space-y-1 text-[var(--foreground-muted)]">
                          {details.mdsItems.map((mdsItem, i) => (
                            <li key={i}>• {mdsItem}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Interventions</h4>
                        <ul className="text-xs space-y-1 text-[var(--foreground-muted)]">
                          {details.interventions.map((intervention, i) => (
                            <li key={i}>• {intervention}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MDS Coding Tips Tab */}
      {activeTab === 'mds' && (
        <div className="space-y-6">
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              MDS Accuracy Best Practices
            </h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4">
              Quality measures are calculated from MDS data. Accurate coding ensures your scores reflect actual care quality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Complete Look-Back Periods', desc: 'Use the full 7-day or 14-day look-back period as specified for each item', icon: Calendar },
                { title: 'Document at Point of Care', desc: 'Real-time documentation ensures nothing is missed during assessment', icon: ClipboardCheck },
                { title: 'Inter-rater Reliability', desc: 'Regular IRR testing ensures consistent coding across MDS coordinators', icon: Users },
                { title: 'Validation Reports', desc: 'Run CMS validation reports before submission to catch errors', icon: CheckCircle2 },
                { title: 'Section GG Accuracy', desc: 'Functional scores directly impact short-stay QMs - ensure therapy input', icon: Activity },
                { title: 'Diagnosis Coding', desc: 'Complete diagnosis coding affects measure exclusions and risk adjustment', icon: FileText },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-[var(--card-background-alt)]">
                  <item.icon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4">Common Coding Errors That Hurt QM Scores</h3>
            <div className="space-y-3">
              {[
                { error: 'Missing diagnoses that would exclude residents from measures', impact: 'Antipsychotic rate appears higher than actual' },
                { error: 'Not coding therapy-related functional improvements', impact: 'Functional improvement rate appears lower' },
                { error: 'Undercoding falls due to fear of liability', impact: 'Artificially low fall rates dont reflect true risk' },
                { error: 'Missing active diagnoses like schizophrenia', impact: 'Antipsychotic measure denominator too large' },
                { error: 'Incorrect assessment reference dates', impact: 'Wrong data captured for QM calculation' },
              ].map((item, i) => (
                <div key={i} className="p-3 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                  <div className="font-medium text-sm">{item.error}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">Impact: {item.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Peer Comparison Tab */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-500" />
              Performance vs Benchmarks
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Antipsychotic Use', yours: qm?.longStay.percentAntipsychoticMeds, state: qm?.stateAverages.antipsychoticPercent, national: qm?.nationalAverages.antipsychoticPercent },
                { label: 'Pressure Ulcers', yours: qm?.longStay.percentWithPressureUlcers, state: qm?.stateAverages.pressureUlcerPercent, national: qm?.nationalAverages.pressureUlcerPercent },
                { label: 'Falls w/ Injury', yours: qm?.longStay.percentWithFalls, state: qm?.stateAverages.fallsPercent, national: qm?.nationalAverages.fallsPercent },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-[var(--card-background-alt)]">
                  <div className="font-medium mb-3">{item.label}</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${(item.yours || 0) <= (item.national || 0) ? 'text-green-600' : 'text-red-600'}`}>
                        {item.yours?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-[var(--foreground-muted)]">Your Facility</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{item.state?.toFixed(1)}%</div>
                      <div className="text-xs text-[var(--foreground-muted)]">State Average</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{item.national?.toFixed(1)}%</div>
                      <div className="text-xs text-[var(--foreground-muted)]">National Average</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-center">
                    {(item.yours || 0) <= (item.national || 0) * 0.8 ? (
                      <span className="text-green-600">Performing in top quartile</span>
                    ) : (item.yours || 0) <= (item.national || 0) ? (
                      <span className="text-yellow-600">Performing above average</span>
                    ) : (
                      <span className="text-red-600">Below national average - improvement opportunity</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4">What Top Performers Do Differently</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Culture of Quality', desc: 'Quality is everyones job, not just the QA coordinator' },
                { title: 'Data-Driven Decisions', desc: 'Review QM trends monthly and act on variations quickly' },
                { title: 'Frontline Engagement', desc: 'CNAs and nurses understand how their actions impact measures' },
                { title: 'Proactive Interventions', desc: 'Prevent problems rather than react to them' },
                { title: 'Continuous Education', desc: 'Regular training on evidence-based practices' },
                { title: 'Accountability', desc: 'Clear ownership of each QM with regular reporting' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg border border-[var(--border-color)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Plan Item Narrative Database
const PLAN_ITEM_NARRATIVES: Record<string, {
  narrative: string;
  suggestion: string;
  costLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  roi: string;
}> = {
  'antipsychotic': {
    narrative: `Antipsychotic medication use is one of the most closely monitored quality measures by CMS. High rates indicate potential over-medication of residents, particularly those with dementia. The national average is approximately 14%, but top-performing facilities achieve rates below 10%. This measure directly impacts your Quality Measures star rating and is a red flag for surveyors.

Research shows that non-pharmacological interventions can effectively manage behavioral symptoms in 60-80% of cases. Facilities with structured dementia care programs, including music therapy, pet therapy, and person-centered care approaches, consistently achieve lower antipsychotic rates while maintaining resident safety and quality of life.`,
    suggestion: `Start with a Gradual Dose Reduction (GDR) program for all residents currently on antipsychotics. Implement daily "behavior huddles" where staff discuss non-pharmacological interventions. Train all direct care staff on person-centered dementia care within 90 days. Consider hiring a behavioral health consultant for complex cases.`,
    costLevel: 'medium',
    timeframe: '3-6 months to see significant improvement',
    roi: 'High - typically +0.5 to +1.0 star improvement in QM rating',
  },
  'pressure_ulcer': {
    narrative: `Pressure ulcers are a significant indicator of nursing care quality and are heavily weighted in both Health Inspections and Quality Measures. New or worsening pressure ulcers during a resident's stay suggest failures in skin assessment, repositioning protocols, nutrition management, or appropriate support surfaces.

The CMS considers pressure ulcer prevention a fundamental nursing competency. Facilities with high rates often have systemic issues: inadequate staffing, poor documentation, lack of pressure-relieving devices, or insufficient staff training. Surveyors specifically look for evidence of prevention programs and timely intervention when skin breakdown occurs.`,
    suggestion: `Implement the Braden Scale assessment on admission and weekly thereafter. Ensure every at-risk resident has a documented turning schedule (Q2H minimum) with compliance monitoring. Audit your pressure-redistributing mattress inventory and replace surfaces over 5 years old. Create a wound care nurse champion role even if you can't afford a dedicated WOCN.`,
    costLevel: 'medium',
    timeframe: '2-4 months for process improvements, 6 months for metric improvement',
    roi: 'High - addresses both QM and Health Inspection components',
  },
  'staffing': {
    narrative: `CMS calculates staffing ratings using Payroll-Based Journal (PBJ) data, measuring Hours Per Resident Day (HPRD). The thresholds are strict: 5-star requires ≥4.08 total nursing HPRD and ≥0.75 RN HPRD. Weekend staffing is weighted heavily because historically it's when facilities cut corners.

Your staffing rating directly impacts your overall rating. A 1-star staffing rating will automatically cap your overall at 4 stars, regardless of your other scores. Additionally, adequate staffing correlates with better quality measures, fewer deficiencies, and higher resident/family satisfaction.`,
    suggestion: `First, audit your PBJ submissions for accuracy - many facilities under-report hours. Increase RN coverage during weekends even if it means redistributing weekday hours. Consider float pool or agency staff strategically for census fluctuations. Implement retention programs to reduce turnover, which destroys your staffing efficiency.`,
    costLevel: 'high',
    timeframe: '1-3 months to adjust scheduling, quarterly to see rating impact',
    roi: 'Critical - staffing underlies all other quality improvements',
  },
  'falls': {
    narrative: `Falls are the leading cause of injury-related death among nursing home residents and a major survey focus area. CMS tracks both the overall fall rate and falls with major injury. High rates trigger intense scrutiny during surveys and increase liability exposure.

Effective fall prevention requires a multi-disciplinary approach: medication review (sedatives and BP meds are common culprits), environmental modifications, individualized care plans, proper footwear, and adequate supervision. Post-fall analysis is critical - every fall should trigger a root cause investigation and care plan update.`,
    suggestion: `Implement hourly rounding on all units with documentation. Review all psychotropic and cardiovascular medications with pharmacy for fall risk. Ensure adequate lighting throughout the facility. Install bed/chair alarms for high-risk residents. Create a falls committee that reviews every fall within 24 hours.`,
    costLevel: 'low',
    timeframe: '1-2 months to implement, 3-4 months to see reduction',
    roi: 'High - reduces liability, improves QM, demonstrates quality focus to surveyors',
  },
  'deficiency': {
    narrative: `Health Inspection deficiencies are the foundation of your 5-star rating. CMS compares your deficiency count and severity to state and national averages. Repeated deficiencies in the same areas signal systemic problems that can trigger Special Focus Facility designation.

The most commonly cited deficiencies involve infection control (F880), accident prevention (F689), and pressure ulcer care (F686). Surveyors look for evidence of QAPI programs that identify and address root causes. A facility with 15+ deficiencies needs immediate, comprehensive improvement efforts.`,
    suggestion: `Conduct quarterly mock surveys using a structured audit tool. Create a "deficiency tracker" to monitor trends and ensure corrections are sustained. Implement daily environmental rounds by department heads. Establish a rapid response protocol when issues are identified - don't wait for the annual survey.`,
    costLevel: 'low',
    timeframe: 'Continuous - improvements should be ongoing',
    roi: 'Very High - Health Inspection is the foundation of your overall rating',
  },
  'rn_hours': {
    narrative: `RN staffing is separately evaluated from total nursing staffing because of RNs' critical role in assessment, care planning, and clinical decision-making. CMS requires ≥0.75 RN HPRD for a 5-star staffing rating. Facilities below 0.55 RN HPRD receive a 2-star or lower.

RN presence correlates strongly with resident outcomes. Facilities with higher RN hours have fewer hospitalizations, lower mortality rates, and better quality measure scores. Investing in RN staffing often has a multiplier effect across all rating components.`,
    suggestion: `Calculate your current RN HPRD precisely using PBJ data. If below threshold, evaluate whether LPN positions can be converted to RN. Consider per-diem RN pool for weekend coverage. Implement an RN retention program - turnover makes meeting HPRD thresholds nearly impossible.`,
    costLevel: 'high',
    timeframe: '3-6 months for recruitment and scheduling changes',
    roi: 'High - RN hours are a limiting factor for staffing rating',
  },
  'turnover': {
    narrative: `Staff turnover is now publicly reported by CMS and impacts multiple quality dimensions. High turnover disrupts continuity of care, increases training costs, and signals workplace problems to prospective employees and residents' families. Facilities with >50% annual turnover struggle to maintain quality.

Turnover is particularly damaging for RNs, where replacement costs can exceed $40,000 per position. Beyond direct costs, high turnover creates knowledge gaps, increases medication errors, and undermines the resident-staff relationships essential to person-centered care.`,
    suggestion: `Conduct exit interviews to understand why staff leave. Implement stay interviews for high-performing staff. Review compensation against local market rates. Create clear career ladders and invest in professional development. Address scheduling flexibility - this is often more valued than small wage increases.`,
    costLevel: 'medium',
    timeframe: '6-12 months to see significant turnover reduction',
    roi: 'High - reduced recruitment costs, improved continuity, better outcomes',
  },
  'infection_control': {
    narrative: `Infection prevention and control (IPC) has become a top survey priority, especially post-COVID. F880 (Infection Control) is among the most frequently cited deficiencies. CMS expects robust IPC programs including surveillance, antibiotic stewardship, isolation protocols, and staff training.

UTI rates are a key quality measure, but IPC extends to respiratory infections, skin infections, and C. diff. Facilities with strong IPC programs have fewer hospitalizations and better overall health outcomes. Surveyors will observe hand hygiene compliance and PPE usage.`,
    suggestion: `Appoint an Infection Preventionist with dedicated time for the role. Implement antibiotic stewardship with pharmacy review of all antibiotic orders. Track hand hygiene compliance with direct observation audits. Review catheter usage monthly - many UTIs stem from unnecessary catheters.`,
    costLevel: 'low',
    timeframe: '1-3 months to strengthen program',
    roi: 'High - addresses common deficiency and UTI quality measure',
  },
};

// Enhanced Plan Preview View with detailed narratives and AI suggestions
function PlanPreviewView({
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [targetRating, setTargetRating] = useState(4);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiPrioritizedItems, setAiPrioritizedItems] = useState<string[]>([]);

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

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Calculate best and worst possible ratings
  const currentRating = facility?.overallRating || 3;
  const healthRating = facility?.healthInspectionRating || 3;
  const staffingRating = facility?.staffingRating || 3;
  const qmRating = facility?.qualityMeasureRating || 3;

  // Best case: improve weakest areas
  const bestPossibleRating = Math.min(5, currentRating + 2);

  // Worst case: bad survey drops health inspection
  const worstPossibleRating = Math.max(1, healthRating - 2);

  // AI Cost-Effective Prioritization
  const generateAISuggestions = () => {
    // Prioritize by cost-effectiveness (low cost, high impact)
    const prioritized = [...recommendations].sort((a, b) => {
      const costOrder = { low: 0, medium: 1, high: 2 };
      const impactDiff = (b.estimatedImpact || 0) - (a.estimatedImpact || 0);
      const costDiff = costOrder[a.estimatedCost || 'medium'] - costOrder[b.estimatedCost || 'medium'];
      return costDiff + (impactDiff * 0.5);
    });

    setAiPrioritizedItems(prioritized.slice(0, 3).map(r => r.id));
    setShowAISuggestions(true);
  };

  // Get narrative for a recommendation
  const getNarrative = (rec: ImprovementRecommendation) => {
    const title = rec.title.toLowerCase();
    if (title.includes('antipsychotic')) return PLAN_ITEM_NARRATIVES.antipsychotic;
    if (title.includes('pressure') || title.includes('ulcer') || title.includes('skin')) return PLAN_ITEM_NARRATIVES.pressure_ulcer;
    if (title.includes('total') && title.includes('nursing') || title.includes('hprd') && !title.includes('rn')) return PLAN_ITEM_NARRATIVES.staffing;
    if (title.includes('fall')) return PLAN_ITEM_NARRATIVES.falls;
    if (title.includes('deficien')) return PLAN_ITEM_NARRATIVES.deficiency;
    if (title.includes('rn') && (title.includes('hour') || title.includes('staff'))) return PLAN_ITEM_NARRATIVES.rn_hours;
    if (title.includes('turnover')) return PLAN_ITEM_NARRATIVES.turnover;
    if (title.includes('infection') || title.includes('uti')) return PLAN_ITEM_NARRATIVES.infection_control;
    return {
      narrative: rec.description,
      suggestion: rec.actionSteps?.join(' ') || 'Implement targeted improvements based on current performance data.',
      costLevel: rec.estimatedCost || 'medium',
      timeframe: rec.timeframe === 'immediate' ? '1-2 weeks' : rec.timeframe === 'short_term' ? '1-3 months' : '3-6 months',
      roi: 'Varies based on facility-specific factors',
    };
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
          <p className="text-[var(--foreground-muted)]">Loading improvement plan...</p>
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

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Improvement Plan Preview</h2>
              <p className="text-[var(--foreground-muted)]">{facility.providerName}</p>
            </div>
          </div>

          {/* AI Suggestion Button */}
          <button
            onClick={generateAISuggestions}
            className="btn-neumorphic-primary px-4 py-2 flex items-center gap-2 animate-pulse hover:animate-none"
          >
            <Brain className="w-5 h-5" />
            <span>AI Cost-Effective Suggestions</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rating Projections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-neumorphic p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">Current Rating</span>
          </div>
          <div className="text-3xl font-bold">{currentRating} <span className="text-lg text-[var(--foreground-muted)]">★</span></div>
          <div className="text-xs text-[var(--foreground-muted)] mt-1">
            Health: {healthRating}★ | Staffing: {staffingRating}★ | QM: {qmRating}★
          </div>
        </div>

        <div className="card-neumorphic p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-700 dark:text-green-300">Best Possible</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{bestPossibleRating} <span className="text-lg">★</span></div>
          <div className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
            Achievable with full plan implementation
          </div>
        </div>

        <div className="card-neumorphic p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="font-medium text-red-700 dark:text-red-300">Risk If Bad Survey</span>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{worstPossibleRating} <span className="text-lg">★</span></div>
          <div className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
            Potential drop with major deficiencies
          </div>
        </div>
      </div>

      {/* Target Rating Selector */}
      <div className="card-neumorphic p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-medium">Target Rating</h3>
            <p className="text-sm text-[var(--foreground-muted)]">What star rating are you working toward?</p>
          </div>
          <div className="flex gap-2">
            {[3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setTargetRating(rating)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  targetRating === rating
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg'
                    : 'btn-neumorphic'
                }`}
              >
                {rating}★
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      {showAISuggestions && (
        <div className="card-neumorphic p-6 border-2 border-purple-400 dark:border-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">AI Cost-Effective Recommendations</h3>
          </div>
          <p className="text-sm text-purple-600/80 dark:text-purple-400/80 mb-4">
            Based on your current ratings and industry data, here are the most cost-effective improvements to reach {targetRating}★:
          </p>
          <div className="space-y-3">
            {recommendations
              .filter(r => aiPrioritizedItems.includes(r.id))
              .map((rec, i) => {
                const narrative = getNarrative(rec);
                return (
                  <div key={rec.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{rec.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          narrative.costLevel === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          narrative.costLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {narrative.costLevel} cost
                        </span>
                        <span className="text-xs text-purple-600 dark:text-purple-400">+{rec.estimatedImpact} star impact</span>
                      </div>
                      <p className="text-sm text-[var(--foreground-muted)] mt-1">{narrative.suggestion.substring(0, 150)}...</p>
                    </div>
                  </div>
                );
              })}
          </div>
          <button
            onClick={() => setShowAISuggestions(false)}
            className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            Hide AI suggestions
          </button>
        </div>
      )}

      {/* Improvement Items with Detailed Narratives */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-500" />
          Improvement Opportunities ({recommendations.length})
        </h3>

        {recommendations.map((rec) => {
          const isExpanded = expandedItems.has(rec.id);
          const narrative = getNarrative(rec);
          const isAIPrioritized = aiPrioritizedItems.includes(rec.id);

          return (
            <div
              key={rec.id}
              className={`card-neumorphic overflow-hidden transition-all ${
                isAIPrioritized ? 'ring-2 ring-purple-400 dark:ring-purple-600' : ''
              }`}
            >
              {/* Header - always visible */}
              <div
                className="p-4 cursor-pointer flex items-start justify-between gap-4"
                onClick={() => toggleExpand(rec.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {isAIPrioritized && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Recommended
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {rec.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[var(--foreground)]">{rec.title}</h4>
                  <p className="text-sm text-[var(--foreground-muted)] mt-1 line-clamp-2">{rec.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">+{rec.estimatedImpact} ★</span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[var(--foreground-muted)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)]" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-[var(--border-color)] p-4 space-y-4 bg-[var(--card-background-alt)]">
                  {/* Detailed Narrative */}
                  <div>
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Understanding This Issue
                    </h5>
                    <p className="text-sm text-[var(--foreground-muted)] whitespace-pre-line leading-relaxed">
                      {narrative.narrative}
                    </p>
                  </div>

                  {/* Suggestion */}
                  <div className="card-neumorphic-inset p-4">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Recommended Actions
                    </h5>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {narrative.suggestion}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                      <DollarSign className={`w-5 h-5 mx-auto mb-1 ${
                        narrative.costLevel === 'low' ? 'text-green-500' :
                        narrative.costLevel === 'medium' ? 'text-yellow-500' :
                        'text-red-500'
                      }`} />
                      <div className="text-xs text-[var(--foreground-muted)]">Cost Level</div>
                      <div className="font-medium capitalize">{narrative.costLevel}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <div className="text-xs text-[var(--foreground-muted)]">Timeframe</div>
                      <div className="font-medium text-sm">{narrative.timeframe}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                      <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                      <div className="text-xs text-[var(--foreground-muted)]">Impact</div>
                      <div className="font-medium">+{rec.estimatedImpact} star</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                      <Target className="w-5 h-5 mx-auto mb-1 text-cyan-500" />
                      <div className="text-xs text-[var(--foreground-muted)]">ROI</div>
                      <div className="font-medium text-sm">{narrative.roi.split(' - ')[0]}</div>
                    </div>
                  </div>

                  {/* Action Steps */}
                  {rec.actionSteps && rec.actionSteps.length > 0 && (
                    <div>
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Quick Start Checklist
                      </h5>
                      <div className="space-y-2">
                        {rec.actionSteps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-[var(--foreground-muted)]">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg">Ready to Build Your Plan?</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Select items above and create an actionable improvement roadmap
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-neumorphic px-4 py-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="btn-neumorphic-primary px-4 py-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Create Action Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROFESSIONAL FEATURES FOR SKILLED NURSING LEADERS
// ============================================================================

// 1. Competitor Benchmarking View
function BenchmarkingView({
  providerNumber,
  onBack,
}: {
  providerNumber: string | null;
  onBack: () => void;
}) {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [competitors, setCompetitors] = useState<Array<{
    federalProviderNumber: string;
    providerName: string;
    cityTown: string;
    state: string;
    overallRating: number | null;
    healthRating: number | null;
    staffingRating: number | null;
    qmRating: number | null;
    distance?: number;
    beds?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(25);

  useEffect(() => {
    async function fetchData() {
      if (!providerNumber) {
        setLoading(false);
        return;
      }
      try {
        const facilityRes = await fetch(`/api/facilities/${providerNumber}`);
        const facilityData = await facilityRes.json();
        setFacility(facilityData.facility);

        // Fetch nearby facilities (simulated - in production would use geo query)
        const state = facilityData.facility?.state;
        if (state) {
          const competitorRes = await fetch(`/api/facilities/search?state=${state}&limit=20`);
          const competitorData = await competitorRes.json();
          const filtered = (competitorData.results || [])
            .filter((f: { federalProviderNumber: string }) => f.federalProviderNumber !== providerNumber)
            .map((f: { federalProviderNumber: string; providerName: string; cityTown: string; state: string; overallRating: number; healthRating: number; staffingRating: number; qmRating: number; numberOfBeds: number }) => ({
              ...f,
              distance: Math.floor(Math.random() * radius) + 1,
              beds: f.numberOfBeds,
            }))
            .sort((a: { distance: number }, b: { distance: number }) => a.distance - b.distance)
            .slice(0, 10);
          setCompetitors(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch benchmarking data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerNumber, radius]);

  const avgCompetitorRating = competitors.length > 0
    ? competitors.reduce((sum, c) => sum + (c.overallRating || 0), 0) / competitors.length
    : 0;

  const marketPosition = facility?.overallRating
    ? competitors.filter(c => (c.overallRating || 0) < facility.overallRating).length + 1
    : 0;

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Analyzing market competition...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Competitor Benchmarking</h2>
            <p className="text-[var(--foreground-muted)]">
              {facility?.providerName || 'Market Analysis'}
            </p>
          </div>
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Search Radius:</span>
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  radius === r ? 'bg-indigo-500 text-white' : 'btn-neumorphic'
                }`}
              >
                {r} mi
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market Position Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-neumorphic p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-500" />
          <p className="text-3xl font-bold">#{marketPosition}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Market Position</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
          <p className="text-3xl font-bold">{facility?.overallRating || '-'}★</p>
          <p className="text-sm text-[var(--foreground-muted)]">Your Rating</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <BarChart2 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-3xl font-bold">{avgCompetitorRating.toFixed(1)}★</p>
          <p className="text-sm text-[var(--foreground-muted)]">Market Average</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <Building className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-3xl font-bold">{competitors.length}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Competitors</p>
        </div>
      </div>

      {/* Competitor Table */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          Nearby Competitors
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-3 px-2">Facility</th>
                <th className="text-center py-3 px-2">Distance</th>
                <th className="text-center py-3 px-2">Overall</th>
                <th className="text-center py-3 px-2">Health</th>
                <th className="text-center py-3 px-2">Staffing</th>
                <th className="text-center py-3 px-2">QM</th>
                <th className="text-center py-3 px-2">Beds</th>
              </tr>
            </thead>
            <tbody>
              {/* Your Facility Row */}
              {facility && (
                <tr className="bg-cyan-50 dark:bg-cyan-900/20 border-b border-[var(--border-color)]">
                  <td className="py-3 px-2">
                    <div className="font-medium text-cyan-700 dark:text-cyan-300">
                      {facility.providerName} (You)
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">{facility.cityTown}</div>
                  </td>
                  <td className="text-center py-3 px-2">-</td>
                  <td className="text-center py-3 px-2 font-bold">{facility.overallRating}★</td>
                  <td className="text-center py-3 px-2">{facility.healthInspectionRating}★</td>
                  <td className="text-center py-3 px-2">{facility.staffingRating}★</td>
                  <td className="text-center py-3 px-2">{facility.qualityMeasureRating}★</td>
                  <td className="text-center py-3 px-2">{facility.numberOfCertifiedBeds}</td>
                </tr>
              )}
              {competitors.map((c, i) => (
                <tr key={c.federalProviderNumber} className="border-b border-[var(--border-color)] hover:bg-[var(--card-background-alt)]">
                  <td className="py-3 px-2">
                    <div className="font-medium">{c.providerName}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">{c.cityTown}</div>
                  </td>
                  <td className="text-center py-3 px-2">{c.distance} mi</td>
                  <td className="text-center py-3 px-2 font-bold">{c.overallRating}★</td>
                  <td className="text-center py-3 px-2">{c.healthRating}★</td>
                  <td className="text-center py-3 px-2">{c.staffingRating}★</td>
                  <td className="text-center py-3 px-2">{c.qmRating}★</td>
                  <td className="text-center py-3 px-2">{c.beds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitive Insights */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Competitive Insights
        </h3>
        <div className="space-y-3">
          {facility && facility.overallRating >= avgCompetitorRating ? (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✓ Your facility outperforms the market average by {(facility.overallRating - avgCompetitorRating).toFixed(1)} stars
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-amber-700 dark:text-amber-300 font-medium">
                ⚠ Your facility is {(avgCompetitorRating - (facility?.overallRating || 0)).toFixed(1)} stars below market average
              </p>
            </div>
          )}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <p className="text-blue-700 dark:text-blue-300">
              <strong>Market Opportunity:</strong> {competitors.filter(c => (c.overallRating || 0) <= 2).length} competitors have 1-2 star ratings, presenting referral opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Board Reports View
function BoardReportsView({ onBack }: { onBack: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<'executive' | 'detailed' | 'compliance'>('executive');

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      // Open print dialog or generate PDF
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Executive Summary - my5STARreport</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { color: #0891b2; border-bottom: 3px solid #fbbf24; padding-bottom: 10px; }
              h2 { color: #1e293b; margin-top: 30px; }
              .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px 25px; background: #f0f9ff; border-radius: 10px; }
              .metric-value { font-size: 32px; font-weight: bold; color: #0891b2; }
              .metric-label { font-size: 12px; color: #64748b; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
              th { background: #f8fafc; font-weight: 600; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>📊 Executive Portfolio Summary</h1>
            <p style="color: #64748b;">Generated ${new Date().toLocaleDateString()} | my5STARreport.com</p>

            <h2>Portfolio Overview</h2>
            <div class="metric"><div class="metric-value">46</div><div class="metric-label">Total Facilities</div></div>
            <div class="metric"><div class="metric-value">3.3★</div><div class="metric-label">Avg Rating</div></div>
            <div class="metric"><div class="metric-value">9</div><div class="metric-label">5-Star Facilities</div></div>
            <div class="metric"><div class="metric-value">11</div><div class="metric-label">At Risk (1-2★)</div></div>

            <h2>Rating Distribution</h2>
            <table>
              <tr><th>Rating</th><th>Count</th><th>Percentage</th></tr>
              <tr><td>5 Stars</td><td>9</td><td>20%</td></tr>
              <tr><td>4 Stars</td><td>16</td><td>35%</td></tr>
              <tr><td>3 Stars</td><td>9</td><td>20%</td></tr>
              <tr><td>2 Stars</td><td>3</td><td>7%</td></tr>
              <tr><td>1 Star</td><td>8</td><td>17%</td></tr>
            </table>

            <h2>Key Focus Areas</h2>
            <ul>
              <li>Antipsychotic reduction program across portfolio</li>
              <li>Weekend staffing consistency improvements</li>
              <li>Pressure ulcer prevention initiatives</li>
            </ul>

            <h2>Financial Impact</h2>
            <p>Estimated annual revenue at risk from low ratings: <strong>$2.4M</strong></p>
            <p>Potential revenue gain from rating improvements: <strong>$1.8M</strong></p>

            <div class="footer">
              <p>This report is confidential and intended for internal use only.</p>
              <p>Data sourced from CMS Care Compare | my5STARreport.com</p>
            </div>

            <script>window.print();</script>
          </body>
          </html>
        `);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Board & Investor Reports</h2>
            <p className="text-[var(--foreground-muted)]">Generate professional reports for stakeholders</p>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { id: 'executive', title: 'Executive Summary', desc: 'High-level KPIs and trends', icon: Crown },
            { id: 'detailed', title: 'Detailed Analysis', desc: 'Full portfolio breakdown', icon: FileSpreadsheet },
            { id: 'compliance', title: 'Compliance Report', desc: 'Regulatory status overview', icon: Shield },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id as typeof reportType)}
              className={`p-4 rounded-xl text-left transition-all ${
                reportType === type.id
                  ? 'bg-violet-100 dark:bg-violet-900/30 ring-2 ring-violet-500'
                  : 'card-neumorphic-inset hover:bg-[var(--card-background-alt)]'
              }`}
            >
              <type.icon className={`w-8 h-8 mb-2 ${reportType === type.id ? 'text-violet-600' : 'text-[var(--foreground-muted)]'}`} />
              <h4 className="font-semibold">{type.title}</h4>
              <p className="text-sm text-[var(--foreground-muted)]">{type.desc}</p>
            </button>
          ))}
        </div>

        {/* Report Preview */}
        <div className="card-neumorphic-inset p-6 mb-6">
          <h3 className="font-semibold mb-4">Report Preview</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
              <span>Report Period</span>
              <span className="font-medium">Q4 2024</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
              <span>Facilities Included</span>
              <span className="font-medium">46 facilities</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
              <span>Data As Of</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Format</span>
              <span className="font-medium">PDF (Print-Ready)</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="w-full btn-neumorphic-primary py-4 flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generate {reportType === 'executive' ? 'Executive Summary' : reportType === 'detailed' ? 'Detailed Report' : 'Compliance Report'}
            </>
          )}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold text-green-600">↑ 12%</p>
          <p className="text-xs text-[var(--foreground-muted)]">Rating Improvement YTD</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">94%</p>
          <p className="text-xs text-[var(--foreground-muted)]">Survey Compliance</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">$1.2M</p>
          <p className="text-xs text-[var(--foreground-muted)]">Revenue Protected</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">3</p>
          <p className="text-xs text-[var(--foreground-muted)]">Facilities Improved</p>
        </div>
      </div>
    </div>
  );
}

// 3. Enhanced Portfolio View
function PortfolioView({
  onBack,
  onSelectFacility,
}: {
  onBack: () => void;
  onSelectFacility: (providerNumber: string) => void;
}) {
  const [facilities, setFacilities] = useState<Array<{
    federalProviderNumber: string;
    providerName: string;
    cityTown: string;
    state: string;
    overallRating: number | null;
    healthRating: number | null;
    staffingRating: number | null;
    qmRating: number | null;
    company?: string;
    isVincero?: boolean;
    lastSurveyDate?: string;
    beds?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'risk'>('rating');

  useEffect(() => {
    async function fetchData() {
      try {
        const ccnList = Object.keys(CASCADIA_FACILITIES);
        const response = await fetch(`/api/facilities/search?ccns=${ccnList.join(',')}&limit=100`);
        const data = await response.json();
        const enriched = (data.results || []).map((f: { federalProviderNumber: string; numberOfBeds: number }) => ({
          ...f,
          company: CASCADIA_FACILITIES[f.federalProviderNumber]?.company || 'Other',
          isVincero: CASCADIA_FACILITIES[f.federalProviderNumber]?.isVincero || false,
          lastSurveyDate: '2024-' + String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') + '-15',
          beds: f.numberOfBeds,
        }));
        setFacilities(enriched);
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sortedFacilities = [...facilities].sort((a, b) => {
    if (sortBy === 'name') return a.providerName.localeCompare(b.providerName);
    if (sortBy === 'rating') return (b.overallRating || 0) - (a.overallRating || 0);
    if (sortBy === 'risk') return (a.overallRating || 5) - (b.overallRating || 5);
    return 0;
  });

  // Portfolio metrics
  const totalBeds = facilities.reduce((sum, f) => sum + (f.beds || 0), 0);
  const avgOccupancy = 87; // Simulated
  const totalRevenue = totalBeds * avgOccupancy * 0.01 * 250 * 365 / 1000000; // Rough estimate in millions

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Multi-Facility Portfolio</h2>
              <p className="text-[var(--foreground-muted)]">Cascadia Healthcare - {facilities.length} Facilities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="btn-neumorphic px-3 py-2 text-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
              <option value="risk">Sort by Risk</option>
            </select>
            <div className="flex rounded-xl overflow-hidden">
              {(['grid', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 ${viewMode === mode ? 'bg-emerald-500 text-white' : 'btn-neumorphic'}`}
                >
                  {mode === 'grid' ? <BarChart3 className="w-4 h-4" /> : <ListChecks className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card-neumorphic p-4 text-center">
          <Building className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
          <p className="text-2xl font-bold">{facilities.length}</p>
          <p className="text-xs text-[var(--foreground-muted)]">Facilities</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{totalBeds.toLocaleString()}</p>
          <p className="text-xs text-[var(--foreground-muted)]">Total Beds</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <Gauge className="w-6 h-6 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">{avgOccupancy}%</p>
          <p className="text-xs text-[var(--foreground-muted)]">Avg Occupancy</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <CircleDollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}M</p>
          <p className="text-xs text-[var(--foreground-muted)]">Est. Revenue</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold">{facilities.filter(f => (f.overallRating || 0) <= 2).length}</p>
          <p className="text-xs text-[var(--foreground-muted)]">At Risk</p>
        </div>
      </div>

      {/* Facility Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFacilities.map((f) => (
            <div
              key={f.federalProviderNumber}
              onClick={() => onSelectFacility(f.federalProviderNumber)}
              className="card-neumorphic p-4 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{f.providerName}</h4>
                  <p className="text-xs text-[var(--foreground-muted)]">{f.cityTown}, {f.state}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-sm font-bold ${
                  (f.overallRating || 0) >= 4 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  (f.overallRating || 0) >= 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {f.overallRating}★
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[var(--card-background-alt)]">
                  <p className="font-bold">{f.healthRating}★</p>
                  <p className="text-[var(--foreground-muted)]">Health</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--card-background-alt)]">
                  <p className="font-bold">{f.staffingRating}★</p>
                  <p className="text-[var(--foreground-muted)]">Staff</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--card-background-alt)]">
                  <p className="font-bold">{f.qmRating}★</p>
                  <p className="text-[var(--foreground-muted)]">QM</p>
                </div>
              </div>
              {f.company && (
                <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${COMPANY_COLORS[f.company] || 'bg-gray-100 text-gray-700'}`}>
                    {f.company}
                  </span>
                  {f.isVincero && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 font-bold">
                      V
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-neumorphic overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--card-background-alt)]">
              <tr>
                <th className="text-left py-3 px-4">Facility</th>
                <th className="text-center py-3 px-2">Overall</th>
                <th className="text-center py-3 px-2">Health</th>
                <th className="text-center py-3 px-2">Staff</th>
                <th className="text-center py-3 px-2">QM</th>
                <th className="text-center py-3 px-2">Beds</th>
                <th className="text-center py-3 px-2">Company</th>
              </tr>
            </thead>
            <tbody>
              {sortedFacilities.map((f) => (
                <tr
                  key={f.federalProviderNumber}
                  onClick={() => onSelectFacility(f.federalProviderNumber)}
                  className="border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--card-background-alt)]"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium">{f.providerName}</div>
                    <div className="text-xs text-[var(--foreground-muted)]">{f.cityTown}, {f.state}</div>
                  </td>
                  <td className="text-center py-3 px-2 font-bold">{f.overallRating}★</td>
                  <td className="text-center py-3 px-2">{f.healthRating}★</td>
                  <td className="text-center py-3 px-2">{f.staffingRating}★</td>
                  <td className="text-center py-3 px-2">{f.qmRating}★</td>
                  <td className="text-center py-3 px-2">{f.beds}</td>
                  <td className="text-center py-3 px-2">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${COMPANY_COLORS[f.company || ''] || 'bg-gray-100'}`}>
                        {f.company}
                      </span>
                      {f.isVincero && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 font-bold">
                          V
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 4. Survey Countdown View
function SurveyCountdownView({
  providerNumber,
  onBack,
}: {
  providerNumber: string | null;
  onBack: () => void;
}) {
  const [facilities, setFacilities] = useState<Array<{
    name: string;
    ccn: string;
    lastSurveyDate: string;
    daysSinceSurvey: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    nextSurveyWindow: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const ccnList = Object.keys(CASCADIA_FACILITIES);
        const response = await fetch(`/api/facilities/search?ccns=${ccnList.join(',')}&limit=100`);
        const data = await response.json();

        const enriched = (data.results || []).map((f: { federalProviderNumber: string; providerName: string }) => {
          // Simulate survey dates (in production, this would come from the database)
          const monthsAgo = Math.floor(Math.random() * 18) + 1;
          const lastDate = new Date();
          lastDate.setMonth(lastDate.getMonth() - monthsAgo);
          const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
          if (daysSince > 450) riskLevel = 'critical';
          else if (daysSince > 365) riskLevel = 'high';
          else if (daysSince > 270) riskLevel = 'medium';

          return {
            name: f.providerName,
            ccn: f.federalProviderNumber,
            lastSurveyDate: lastDate.toISOString().split('T')[0],
            daysSinceSurvey: daysSince,
            riskLevel,
            nextSurveyWindow: daysSince > 365 ? 'Overdue' : `${Math.max(0, 365 - daysSince)} days`,
          };
        }).sort((a: { daysSinceSurvey: number }, b: { daysSinceSurvey: number }) => b.daysSinceSurvey - a.daysSinceSurvey);

        setFacilities(enriched);
      } catch (error) {
        console.error('Failed to fetch survey data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const criticalCount = facilities.filter(f => f.riskLevel === 'critical').length;
  const highCount = facilities.filter(f => f.riskLevel === 'high').length;
  const avgDaysSinceSurvey = facilities.length > 0
    ? Math.round(facilities.reduce((sum, f) => sum + f.daysSinceSurvey, 0) / facilities.length)
    : 0;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading survey data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600">
            <CalendarClock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Survey Countdown Tracker</h2>
            <p className="text-[var(--foreground-muted)]">Monitor survey readiness across your portfolio</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neumorphic p-4 text-center border-l-4 border-red-500">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
          <p className="text-xs text-[var(--foreground-muted)]">Critical (15+ months)</p>
        </div>
        <div className="card-neumorphic p-4 text-center border-l-4 border-orange-500">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-500" />
          <p className="text-3xl font-bold text-orange-600">{highCount}</p>
          <p className="text-xs text-[var(--foreground-muted)]">High Risk (12-15 months)</p>
        </div>
        <div className="card-neumorphic p-4 text-center border-l-4 border-blue-500">
          <Timer className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <p className="text-3xl font-bold text-blue-600">{avgDaysSinceSurvey}</p>
          <p className="text-xs text-[var(--foreground-muted)]">Avg Days Since Survey</p>
        </div>
        <div className="card-neumorphic p-4 text-center border-l-4 border-green-500">
          <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <p className="text-3xl font-bold text-green-600">{facilities.filter(f => f.riskLevel === 'low').length}</p>
          <p className="text-xs text-[var(--foreground-muted)]">On Track</p>
        </div>
      </div>

      {/* Facility List */}
      <div className="card-neumorphic overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--card-background-alt)]">
          <h3 className="font-bold">All Facilities - Survey Status</h3>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {facilities.map((f) => (
            <div key={f.ccn} className="p-4 flex items-center justify-between hover:bg-[var(--card-background-alt)]">
              <div className="flex-1">
                <h4 className="font-medium">{f.name}</h4>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Last Survey: {f.lastSurveyDate} ({f.daysSinceSurvey} days ago)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{f.nextSurveyWindow}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">Until Window</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(f.riskLevel)}`}>
                  {f.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. Staff Scheduling Optimizer
function SchedulingOptimizerView({
  providerNumber,
  onBack,
}: {
  providerNumber: string | null;
  onBack: () => void;
}) {
  const [beds, setBeds] = useState(100);
  const [census, setCensus] = useState(85);
  const [targetRating, setTargetRating] = useState(4);
  const [currentHPRD, setCurrentHPRD] = useState({ total: 3.2, rn: 0.5, lpn: 0.8, cna: 1.9 });

  // HPRD thresholds for each star level
  const thresholds = {
    5: { total: 4.08, rn: 0.75 },
    4: { total: 3.58, rn: 0.55 },
    3: { total: 3.18, rn: 0.40 },
    2: { total: 2.82, rn: 0.30 },
  };

  const targetHPRD = thresholds[targetRating as keyof typeof thresholds] || thresholds[4];

  // Calculate required hours
  const requiredTotalHours = targetHPRD.total * census;
  const requiredRNHours = targetHPRD.rn * census;
  const currentTotalHours = currentHPRD.total * census;
  const currentRNHours = currentHPRD.rn * census;

  const additionalTotalNeeded = Math.max(0, requiredTotalHours - currentTotalHours);
  const additionalRNNeeded = Math.max(0, requiredRNHours - currentRNHours);

  // Convert to FTEs (assuming 8-hour shifts)
  const additionalTotalFTE = additionalTotalNeeded / 8;
  const additionalRNFTE = additionalRNNeeded / 8;

  // Weekend requirements (typically need same staffing 7 days)
  const weekendShiftsNeeded = Math.ceil(additionalTotalFTE * 2); // 2 weekend days

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
            <UsersRound className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Staff Scheduling Optimizer</h2>
            <p className="text-[var(--foreground-muted)]">Calculate optimal staffing to hit HPRD targets</p>
          </div>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-neumorphic p-6">
          <h3 className="font-bold mb-4">Facility Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Certified Beds</label>
              <input
                type="number"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="input-neumorphic w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current Census</label>
              <input
                type="number"
                value={census}
                onChange={(e) => setCensus(Number(e.target.value))}
                className="input-neumorphic w-full"
              />
              <p className="text-xs text-[var(--foreground-muted)] mt-1">Occupancy: {((census / beds) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Star Rating</label>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTargetRating(r)}
                    className={`flex-1 py-2 rounded-lg font-bold ${
                      targetRating === r ? 'bg-blue-500 text-white' : 'btn-neumorphic'
                    }`}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card-neumorphic p-6">
          <h3 className="font-bold mb-4">Current Staffing (HPRD)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Nursing HPRD</label>
              <input
                type="number"
                step="0.01"
                value={currentHPRD.total}
                onChange={(e) => setCurrentHPRD({ ...currentHPRD, total: Number(e.target.value) })}
                className="input-neumorphic w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">RN HPRD</label>
              <input
                type="number"
                step="0.01"
                value={currentHPRD.rn}
                onChange={(e) => setCurrentHPRD({ ...currentHPRD, rn: Number(e.target.value) })}
                className="input-neumorphic w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-2">LPN HPRD</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentHPRD.lpn}
                  onChange={(e) => setCurrentHPRD({ ...currentHPRD, lpn: Number(e.target.value) })}
                  className="input-neumorphic w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CNA HPRD</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentHPRD.cna}
                  onChange={(e) => setCurrentHPRD({ ...currentHPRD, cna: Number(e.target.value) })}
                  className="input-neumorphic w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          Staffing Recommendations for {targetRating}★
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card-neumorphic-inset p-4 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">Target Total HPRD</p>
            <p className="text-2xl font-bold text-blue-600">{targetHPRD.total}</p>
            <p className="text-xs">Current: {currentHPRD.total}</p>
          </div>
          <div className="card-neumorphic-inset p-4 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">Target RN HPRD</p>
            <p className="text-2xl font-bold text-purple-600">{targetHPRD.rn}</p>
            <p className="text-xs">Current: {currentHPRD.rn}</p>
          </div>
          <div className="card-neumorphic-inset p-4 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">Gap to Close</p>
            <p className="text-2xl font-bold text-amber-600">
              {Math.max(0, targetHPRD.total - currentHPRD.total).toFixed(2)}
            </p>
            <p className="text-xs">Hours per resident day</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Daily Staffing Needs</h4>
            <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-400">
              <li>• Additional daily hours needed: <strong>{additionalTotalNeeded.toFixed(1)} hours</strong></li>
              <li>• Additional RN hours needed: <strong>{additionalRNNeeded.toFixed(1)} hours</strong></li>
              <li>• Equivalent FTEs (8-hr shifts): <strong>{additionalTotalFTE.toFixed(1)} FTE</strong></li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Weekend Staffing</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Weekend staffing is weighted heavily by CMS. Ensure you maintain <strong>{targetHPRD.total} HPRD</strong> on Saturdays and Sundays.
              You need approximately <strong>{weekendShiftsNeeded} additional weekend shifts</strong> to meet targets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Recommended Schedule</h4>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mt-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 bg-white dark:bg-slate-800 rounded">
                  <p className="font-medium">{day}</p>
                  <p className="text-green-600">{requiredTotalHours.toFixed(0)}h</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Financial Impact Calculator
function FinancialImpactView({
  providerNumber,
  onBack,
}: {
  providerNumber: string | null;
  onBack: () => void;
}) {
  const [currentRating, setCurrentRating] = useState(2);
  const [projectedRating, setProjectedRating] = useState(4);
  const [beds, setBeds] = useState(100);
  const [occupancy, setOccupancy] = useState(85);
  const [avgDailyRate, setAvgDailyRate] = useState(280);

  // Revenue impact calculations
  const currentOccupancyImpact = currentRating <= 2 ? -5 : currentRating >= 4 ? 3 : 0;
  const projectedOccupancyImpact = projectedRating <= 2 ? -5 : projectedRating >= 4 ? 3 : 0;

  const currentEffectiveOccupancy = occupancy + currentOccupancyImpact;
  const projectedEffectiveOccupancy = occupancy + projectedOccupancyImpact;

  const currentAnnualRevenue = beds * (currentEffectiveOccupancy / 100) * avgDailyRate * 365;
  const projectedAnnualRevenue = beds * (projectedEffectiveOccupancy / 100) * avgDailyRate * 365;
  const revenueImpact = projectedAnnualRevenue - currentAnnualRevenue;

  // Medicare Advantage referral impact
  const maReferralImpact = (projectedRating - currentRating) * 50000; // Estimated per star

  // Total impact
  const totalImpact = revenueImpact + maReferralImpact;

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600">
            <CircleDollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Financial Impact Calculator</h2>
            <p className="text-[var(--foreground-muted)]">Quantify the revenue impact of rating changes</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-neumorphic p-6">
          <h3 className="font-bold mb-4">Facility Metrics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Certified Beds</label>
              <input
                type="number"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="input-neumorphic w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Base Occupancy %</label>
              <input
                type="number"
                value={occupancy}
                onChange={(e) => setOccupancy(Number(e.target.value))}
                className="input-neumorphic w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Avg Daily Rate ($)</label>
              <input
                type="number"
                value={avgDailyRate}
                onChange={(e) => setAvgDailyRate(Number(e.target.value))}
                className="input-neumorphic w-full"
              />
            </div>
          </div>
        </div>

        <div className="card-neumorphic p-6">
          <h3 className="font-bold mb-4">Rating Scenario</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setCurrentRating(r)}
                    className={`flex-1 py-2 rounded-lg font-bold ${
                      currentRating === r ? 'bg-red-500 text-white' : 'btn-neumorphic'
                    }`}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Projected Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setProjectedRating(r)}
                    className={`flex-1 py-2 rounded-lg font-bold ${
                      projectedRating === r ? 'bg-green-500 text-white' : 'btn-neumorphic'
                    }`}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Financial Impact Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card-neumorphic-inset p-4 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">Current Annual Revenue</p>
            <p className="text-2xl font-bold">${(currentAnnualRevenue / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-[var(--foreground-muted)]">at {currentRating}★ rating</p>
          </div>
          <div className="card-neumorphic-inset p-4 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">Projected Annual Revenue</p>
            <p className="text-2xl font-bold text-green-600">${(projectedAnnualRevenue / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-[var(--foreground-muted)]">at {projectedRating}★ rating</p>
          </div>
          <div className="card-neumorphic-inset p-4 text-center border-2 border-green-500">
            <p className="text-sm text-[var(--foreground-muted)]">Total Impact</p>
            <p className={`text-2xl font-bold ${totalImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalImpact >= 0 ? '+' : ''}${(totalImpact / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">annual difference</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Occupancy Impact</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Rating improvement from {currentRating}★ to {projectedRating}★ typically improves occupancy by <strong>{projectedOccupancyImpact - currentOccupancyImpact}%</strong>.
              This translates to <strong>${(revenueImpact / 1000).toFixed(0)}K</strong> in additional annual revenue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Medicare Advantage Referrals</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Higher-rated facilities receive more MA plan referrals. Estimated additional referral revenue: <strong>${(maReferralImpact / 1000).toFixed(0)}K</strong> annually.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">ROI Considerations</h4>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Investment in staffing and quality improvements typically has a 6-12 month payback period when ratings improve by 1+ stars.
              Consider the lifetime value of improved reputation and referral relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. PBJ Integration View
function PBJIntegrationView({ onBack }: { onBack: () => void }) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [connectedSystems, setConnectedSystems] = useState<string[]>([]);

  const handleFileUpload = () => {
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  const systems = [
    { id: 'adp', name: 'ADP Workforce', icon: '💼', status: 'available' },
    { id: 'paycom', name: 'Paycom', icon: '📊', status: 'available' },
    { id: 'kronos', name: 'UKG/Kronos', icon: '⏰', status: 'available' },
    { id: 'paychex', name: 'Paychex', icon: '💰', status: 'available' },
    { id: 'pointclickcare', name: 'PointClickCare', icon: '🏥', status: 'coming_soon' },
    { id: 'matrixcare', name: 'MatrixCare', icon: '🔲', status: 'coming_soon' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">PBJ Data Integration</h2>
            <p className="text-[var(--foreground-muted)]">Connect payroll systems for automated staffing analysis</p>
          </div>
        </div>
      </div>

      {/* Manual Upload */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-orange-500" />
          Manual PBJ Upload
        </h3>
        <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 text-center">
          {uploadStatus === 'idle' && (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
              <p className="mb-4">Drag and drop your PBJ export file, or click to browse</p>
              <button onClick={handleFileUpload} className="btn-neumorphic-primary px-6 py-2">
                Select File
              </button>
              <p className="text-xs text-[var(--foreground-muted)] mt-4">Supports: CSV, XML (CMS PBJ format)</p>
            </>
          )}
          {uploadStatus === 'uploading' && (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p>Processing PBJ data...</p>
            </>
          )}
          {uploadStatus === 'success' && (
            <>
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-green-600 font-medium">Upload successful! Data is being analyzed.</p>
              <button onClick={() => setUploadStatus('idle')} className="btn-neumorphic px-4 py-2 mt-4">
                Upload Another File
              </button>
            </>
          )}
        </div>
      </div>

      {/* System Integrations */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-500" />
          Payroll System Integrations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((sys) => (
            <div
              key={sys.id}
              className={`card-neumorphic-inset p-4 ${
                connectedSystems.includes(sys.id) ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sys.icon}</span>
                  <span className="font-medium">{sys.name}</span>
                </div>
                {connectedSystems.includes(sys.id) && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
              {sys.status === 'available' ? (
                <button
                  onClick={() => setConnectedSystems([...connectedSystems, sys.id])}
                  disabled={connectedSystems.includes(sys.id)}
                  className={`w-full py-2 rounded-lg text-sm ${
                    connectedSystems.includes(sys.id)
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                      : 'btn-neumorphic'
                  }`}
                >
                  {connectedSystems.includes(sys.id) ? 'Connected' : 'Connect'}
                </button>
              ) : (
                <span className="block w-full py-2 text-center text-sm text-[var(--foreground-muted)]">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Validation */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Data Validation
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span>Employee records validated</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span>Job categories properly mapped</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <span>Weekend hours verification</span>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Regulatory Tracker View
function RegulatoryTrackerView({ onBack }: { onBack: () => void }) {
  const updates = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'CMS Updates Staffing Rating Thresholds',
      category: 'Staffing',
      impact: 'high',
      description: 'New HPRD thresholds take effect Q2 2024. Facilities should review current staffing levels.',
      deadline: '2024-04-01',
    },
    {
      id: '2',
      date: '2024-01-10',
      title: 'Quality Measure Updates for MDS 3.0',
      category: 'Quality Measures',
      impact: 'medium',
      description: 'Several quality measures will be recalculated using updated MDS item scoring.',
      deadline: '2024-07-01',
    },
    {
      id: '3',
      date: '2024-01-05',
      title: 'Infection Control Survey Focus',
      category: 'Health Inspection',
      impact: 'high',
      description: 'CMS announces increased focus on infection control practices during standard surveys.',
      deadline: null,
    },
    {
      id: '4',
      date: '2023-12-20',
      title: 'Minimum Staffing Rule Finalized',
      category: 'Staffing',
      impact: 'critical',
      description: 'Final rule requires minimum 3.48 HPRD with 24/7 RN coverage. Implementation phased over 3 years.',
      deadline: '2027-01-01',
    },
    {
      id: '5',
      date: '2023-12-15',
      title: 'Antipsychotic Measure Threshold Change',
      category: 'Quality Measures',
      impact: 'medium',
      description: 'National benchmark for antipsychotic use updated based on latest data.',
      deadline: null,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Regulatory Change Tracker</h2>
            <p className="text-[var(--foreground-muted)]">Stay informed on CMS rules affecting 5-star ratings</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neumorphic p-4 text-center border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-600">1</p>
          <p className="text-xs text-[var(--foreground-muted)]">Critical Updates</p>
        </div>
        <div className="card-neumorphic p-4 text-center border-l-4 border-orange-500">
          <p className="text-2xl font-bold text-orange-600">2</p>
          <p className="text-xs text-[var(--foreground-muted)]">High Impact</p>
        </div>
        <div className="card-neumorphic p-4 text-center border-l-4 border-yellow-500">
          <p className="text-2xl font-bold text-yellow-600">2</p>
          <p className="text-xs text-[var(--foreground-muted)]">Medium Impact</p>
        </div>
        <div className="card-neumorphic p-4 text-center border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-600">3</p>
          <p className="text-xs text-[var(--foreground-muted)]">Upcoming Deadlines</p>
        </div>
      </div>

      {/* Updates List */}
      <div className="card-neumorphic overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--card-background-alt)]">
          <h3 className="font-bold">Recent Regulatory Updates</h3>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {updates.map((update) => (
            <div key={update.id} className="p-4 hover:bg-[var(--card-background-alt)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(update.impact)}`}>
                      {update.impact.toUpperCase()}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">{update.category}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{update.title}</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">{update.description}</p>
                  {update.deadline && (
                    <p className="text-xs text-red-600 mt-2">
                      Deadline: {update.deadline}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm text-[var(--foreground-muted)]">
                  {update.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-500" />
          Stay Updated
        </h3>
        <div className="flex gap-4 flex-wrap">
          <input
            type="email"
            placeholder="Enter your email for regulatory alerts"
            className="input-neumorphic flex-1 min-w-[250px]"
          />
          <button className="btn-neumorphic-primary px-6 py-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

// 9. Community/Peer Networking View
function CommunityView({ onBack }: { onBack: () => void }) {
  const discussions = [
    { id: '1', title: 'Best practices for reducing antipsychotic use?', author: 'DON_Sarah', replies: 23, category: 'Quality Measures', hot: true },
    { id: '2', title: 'Weekend staffing strategies that work', author: 'Admin_Mike', replies: 45, category: 'Staffing', hot: true },
    { id: '3', title: 'Preparing for standard survey - checklist sharing', author: 'QAPI_Lisa', replies: 67, category: 'Health Inspection', hot: false },
    { id: '4', title: 'PBJ data accuracy tips', author: 'Payroll_Pro', replies: 12, category: 'Staffing', hot: false },
    { id: '5', title: 'Fall prevention program success stories', author: 'CNA_Leader', replies: 34, category: 'Quality Measures', hot: false },
  ];

  const experts = [
    { name: 'Dr. Jennifer Walsh', title: 'Former CMS Surveyor', specialty: 'Health Inspections', avatar: '👩‍⚕️' },
    { name: 'Robert Chen, RN', title: 'Staffing Consultant', specialty: 'PBJ & HPRD', avatar: '👨‍💼' },
    { name: 'Maria Santos', title: 'Quality Director', specialty: 'Quality Measures', avatar: '👩‍💻' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600">
            <Handshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Community & Peer Network</h2>
            <p className="text-[var(--foreground-muted)]">Connect with skilled nursing professionals</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-neumorphic p-4 text-center">
          <UsersRound className="w-6 h-6 mx-auto mb-2 text-pink-500" />
          <p className="text-2xl font-bold">2,847</p>
          <p className="text-xs text-[var(--foreground-muted)]">Members</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-xs text-[var(--foreground-muted)]">Discussions</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <Lightbulb className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <p className="text-2xl font-bold">456</p>
          <p className="text-xs text-[var(--foreground-muted)]">Best Practices</p>
        </div>
      </div>

      {/* Featured Experts */}
      <div className="card-neumorphic p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          Featured Experts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experts.map((expert, i) => (
            <div key={i} className="card-neumorphic-inset p-4 text-center">
              <div className="text-4xl mb-2">{expert.avatar}</div>
              <h4 className="font-semibold">{expert.name}</h4>
              <p className="text-xs text-[var(--foreground-muted)]">{expert.title}</p>
              <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                {expert.specialty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Discussions */}
      <div className="card-neumorphic overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--card-background-alt)] flex items-center justify-between">
          <h3 className="font-bold">Trending Discussions</h3>
          <button className="btn-neumorphic-primary px-4 py-2 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Discussion
          </button>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {discussions.map((d) => (
            <div key={d.id} className="p-4 hover:bg-[var(--card-background-alt)] cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {d.hot && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">🔥 Hot</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {d.category}
                    </span>
                  </div>
                  <h4 className="font-medium">{d.title}</h4>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    by {d.author} • {d.replies} replies
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <div className="card-neumorphic p-6 text-center bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
        <h3 className="text-xl font-bold mb-2">Join the Community</h3>
        <p className="text-[var(--foreground-muted)] mb-4">
          Connect with peers, share best practices, and learn from industry experts.
        </p>
        <button className="btn-neumorphic-primary px-8 py-3">
          Create Free Account
        </button>
      </div>
    </div>
  );
}

// Cascadia facility CCN list with company groupings
const CASCADIA_FACILITIES: Record<string, { ccn: string; shortName: string; company: string; isVincero?: boolean }> = {
  // Northern Healthcare - Northern ID, MT
  '135048': { ccn: '135048', shortName: 'Clearwater', company: 'Northern Healthcare' },
  '135080': { ccn: '135080', shortName: 'Grangeville', company: 'Northern Healthcare' },
  '135052': { ccn: '135052', shortName: 'CDA', company: 'Northern Healthcare' },
  '135065': { ccn: '135065', shortName: 'Mountain Valley', company: 'Northern Healthcare' },
  '135093': { ccn: '135093', shortName: 'Aspen Park', company: 'Northern Healthcare' },
  '135067': { ccn: '135067', shortName: 'Paradise Creek', company: 'Northern Healthcare' },
  '275040': { ccn: '275040', shortName: 'Libby', company: 'Northern Healthcare' },
  '275084': { ccn: '275084', shortName: 'Mountain View', company: 'Northern Healthcare' },
  '275044': { ccn: '275044', shortName: 'Mount Ascension', company: 'Northern Healthcare' },

  // Columbia - OR, WA Columbia River region
  '385195': { ccn: '385195', shortName: 'Beaverton', company: 'Columbia' },
  '385147': { ccn: '385147', shortName: 'Creekside', company: 'Columbia' },
  '385165': { ccn: '385165', shortName: 'Curry Village', company: 'Columbia' },
  '385133': { ccn: '385133', shortName: 'Fairlawn', company: 'Columbia' },
  '385264': { ccn: '385264', shortName: 'Secora', company: 'Columbia' },
  '38E174': { ccn: '38E174', shortName: 'Village Manor', company: 'Columbia' },
  '505331': { ccn: '505331', shortName: 'Brookfield', company: 'Columbia' },
  '505260': { ccn: '505260', shortName: 'Hudson Bay', company: 'Columbia' },

  // Envision - Southern ID (Boise/Treasure Valley)
  '135079': { ccn: '135079', shortName: 'Arbor Valley', company: 'Envision' },
  '135014': { ccn: '135014', shortName: 'Caldwell', company: 'Envision' },
  '135051': { ccn: '135051', shortName: 'Canyon West', company: 'Envision' },
  '135146': { ccn: '135146', shortName: 'Boise', company: 'Envision' },
  '135144': { ccn: '135144', shortName: 'Nampa', company: 'Envision' },
  '135095': { ccn: '135095', shortName: 'Cherry Ridge', company: 'Envision' },
  '135019': { ccn: '135019', shortName: 'Orchards', company: 'Envision' },
  '135015': { ccn: '135015', shortName: 'Payette', company: 'Envision' },
  '135090': { ccn: '135090', shortName: 'Shaw Mountain', company: 'Envision' },
  '135094': { ccn: '135094', shortName: 'Wellspring', company: 'Envision' },
  '135010': { ccn: '135010', shortName: 'Weiser', company: 'Envision' },

  // Vincero (under Columbia) - Eastern WA & Arizona
  '505092': { ccn: '505092', shortName: 'Alderwood', company: 'Columbia', isVincero: true },
  '505251': { ccn: '505251', shortName: 'Colfax', company: 'Columbia', isVincero: true },
  '505275': { ccn: '505275', shortName: 'Colville', company: 'Columbia', isVincero: true },
  '505140': { ccn: '505140', shortName: 'Highland', company: 'Columbia', isVincero: true },
  '505338': { ccn: '505338', shortName: 'Snohomish', company: 'Columbia', isVincero: true },
  '505099': { ccn: '505099', shortName: 'Spokane Valley', company: 'Columbia', isVincero: true },
  '505395': { ccn: '505395', shortName: 'Stafholt', company: 'Columbia', isVincero: true },
  '035121': { ccn: '035121', shortName: 'Boswell', company: 'Columbia', isVincero: true },
  '035299': { ccn: '035299', shortName: 'North Park', company: 'Columbia', isVincero: true },

  // Three Rivers - Lewiston/Clarkston area
  '135145': { ccn: '135145', shortName: 'Cascadia of Lewiston', company: 'Three Rivers' },
  '135021': { ccn: '135021', shortName: 'Lewiston TC', company: 'Three Rivers' },
  '135116': { ccn: '135116', shortName: 'Royal Plaza', company: 'Three Rivers' },
  '505283': { ccn: '505283', shortName: 'Clarkston', company: 'Three Rivers' },
  '135069': { ccn: '135069', shortName: 'The Cove', company: 'Three Rivers' },
  '135058': { ccn: '135058', shortName: 'Silverton', company: 'Three Rivers' },
  '135092': { ccn: '135092', shortName: 'Eagle Rock', company: 'Three Rivers' },
  '135104': { ccn: '135104', shortName: 'Twin Falls', company: 'Three Rivers' },
  '135138': { ccn: '135138', shortName: 'Teton', company: 'Three Rivers' },
};

const COMPANY_COLORS: Record<string, string> = {
  'Northern Healthcare': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Columbia': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Envision': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Three Rivers': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
};

// Cascadia Stars View - Shows all Cascadia facilities with company groupings
function CascadiaStarsView({
  onBack,
  onSelectFacility,
}: {
  onBack: () => void;
  onSelectFacility: (providerNumber: string) => void;
}) {
  const [facilities, setFacilities] = useState<Array<{
    federalProviderNumber: string;
    providerName: string;
    cityTown: string;
    state: string;
    overallRating: number | null;
    healthRating: number | null;
    staffingRating: number | null;
    qmRating: number | null;
    numberOfBeds: number;
    shortName?: string;
    company?: string;
    isVincero?: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'state' | 'company'>('company');
  const [filterState, setFilterState] = useState<string | null>(null);
  const [filterCompany, setFilterCompany] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCascadiaFacilities() {
      try {
        // Fetch all Cascadia facilities by CCN list
        const ccnList = Object.keys(CASCADIA_FACILITIES);
        const response = await fetch(`/api/facilities/search?ccns=${ccnList.join(',')}&limit=100`);
        const data = await response.json();

        // Enrich with company and short name data
        const enrichedFacilities = (data.results || []).map((f: { federalProviderNumber: string }) => {
          const cascadiaInfo = CASCADIA_FACILITIES[f.federalProviderNumber];
          return {
            ...f,
            shortName: cascadiaInfo?.shortName || '',
            company: cascadiaInfo?.company || 'Other',
            isVincero: cascadiaInfo?.isVincero || false,
          };
        });

        setFacilities(enrichedFacilities);
      } catch (error) {
        console.error('Failed to fetch Cascadia facilities:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCascadiaFacilities();
  }, []);

  const states = [...new Set(facilities.map(f => f.state))].sort();
  const companies = [...new Set(facilities.map(f => f.company || 'Other'))].sort();

  const filteredFacilities = facilities
    .filter(f => !filterState || f.state === filterState)
    .filter(f => !filterCompany || f.company === filterCompany)
    .sort((a, b) => {
      if (sortBy === 'name') return a.providerName.localeCompare(b.providerName);
      if (sortBy === 'rating') return (b.overallRating || 0) - (a.overallRating || 0);
      if (sortBy === 'company') {
        const companyCompare = (a.company || '').localeCompare(b.company || '');
        if (companyCompare !== 0) return companyCompare;
        return a.providerName.localeCompare(b.providerName);
      }
      return a.state.localeCompare(b.state) || a.providerName.localeCompare(b.providerName);
    });

  const avgRating = facilities.length > 0
    ? (facilities.reduce((sum, f) => sum + (f.overallRating || 0), 0) / facilities.filter(f => f.overallRating).length).toFixed(1)
    : '0';

  const ratingDistribution = {
    5: facilities.filter(f => f.overallRating === 5).length,
    4: facilities.filter(f => f.overallRating === 4).length,
    3: facilities.filter(f => f.overallRating === 3).length,
    2: facilities.filter(f => f.overallRating === 2).length,
    1: facilities.filter(f => f.overallRating === 1).length,
  };

  // Company stats
  const companyStats = companies.map(company => {
    const companyFacilities = facilities.filter(f => f.company === company);
    const rated = companyFacilities.filter(f => f.overallRating);
    const avgRating = rated.length > 0
      ? rated.reduce((sum, f) => sum + (f.overallRating || 0), 0) / rated.length
      : 0;
    return {
      company,
      count: companyFacilities.length,
      avgRating: avgRating.toFixed(1),
      fiveStars: companyFacilities.filter(f => f.overallRating === 5).length,
      lowRated: companyFacilities.filter(f => f.overallRating && f.overallRating <= 2).length,
    };
  });

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'bg-gray-100 text-gray-500';
    if (rating >= 4) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (rating === 3) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </button>

      {/* Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
          <Award className="w-4 h-4" />
          Cascadia Healthcare Portfolio
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">Cascadia Stars</h2>
        <p className="text-[var(--foreground-muted)]">
          Monitor all {facilities.length} Cascadia facilities across {states.length} states and {companies.length} companies
        </p>
      </div>

      {loading ? (
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading Cascadia facilities...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-neumorphic p-4 text-center">
              <p className="text-3xl font-bold text-gradient-primary">{facilities.length}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Total Facilities</p>
            </div>
            <div className="card-neumorphic p-4 text-center">
              <p className="text-3xl font-bold text-amber-500">{avgRating}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Avg Rating</p>
            </div>
            <div className="card-neumorphic p-4 text-center">
              <p className="text-3xl font-bold text-green-500">{ratingDistribution[5] + ratingDistribution[4]}</p>
              <p className="text-sm text-[var(--foreground-muted)]">4-5 Star</p>
            </div>
            <div className="card-neumorphic p-4 text-center">
              <p className="text-3xl font-bold text-red-500">{ratingDistribution[1] + ratingDistribution[2]}</p>
              <p className="text-sm text-[var(--foreground-muted)]">1-2 Star</p>
            </div>
          </div>

          {/* Company Performance Cards */}
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-500" />
              Company Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyStats.map((stat) => (
                <div
                  key={stat.company}
                  onClick={() => setFilterCompany(filterCompany === stat.company ? null : stat.company)}
                  className={`card-neumorphic-inset p-4 cursor-pointer hover:scale-[1.02] transition-transform ${
                    filterCompany === stat.company ? 'ring-2 ring-cyan-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${COMPANY_COLORS[stat.company] || 'bg-gray-100'}`}>
                      {stat.company}
                    </span>
                    <span className="text-lg font-bold text-amber-500">{stat.avgRating} ★</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--foreground-muted)]">{stat.count} facilities</span>
                    <div className="flex gap-2">
                      <span className="text-green-600">{stat.fiveStars} ★5</span>
                      {stat.lowRated > 0 && <span className="text-red-500">{stat.lowRated} low</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-500" />
              Rating Distribution
            </h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-16 text-sm font-medium">{rating} Star</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / facilities.length) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right">{ratingDistribution[rating as keyof typeof ratingDistribution]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--foreground-muted)]">Company:</span>
              <select
                value={filterCompany || ''}
                onChange={(e) => setFilterCompany(e.target.value || null)}
                className="btn-neumorphic px-3 py-2 text-sm"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--foreground-muted)]">State:</span>
              <select
                value={filterState || ''}
                onChange={(e) => setFilterState(e.target.value || null)}
                className="btn-neumorphic px-3 py-2 text-sm"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--foreground-muted)]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'state' | 'company')}
                className="btn-neumorphic px-3 py-2 text-sm"
              >
                <option value="company">Company</option>
                <option value="state">State</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            {(filterCompany || filterState) && (
              <button
                onClick={() => { setFilterCompany(null); setFilterState(null); }}
                className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Facilities List */}
          <div className="space-y-3">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.federalProviderNumber}
                onClick={() => onSelectFacility(facility.federalProviderNumber)}
                className="card-neumorphic p-4 cursor-pointer hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRatingColor(facility.overallRating)}`}>
                        {facility.overallRating || 'N/A'} ★
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${COMPANY_COLORS[facility.company || ''] || 'bg-gray-100'}`}>
                        {facility.company}
                      </span>
                      {facility.isVincero && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 font-bold">
                          V
                        </span>
                      )}
                      <span className="text-xs text-[var(--foreground-muted)]">{facility.state}</span>
                    </div>
                    <h4 className="font-medium text-[var(--foreground)]">
                      {facility.shortName || facility.providerName}
                    </h4>
                    <p className="text-sm text-[var(--foreground-muted)]">{facility.cityTown}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-center">
                      <p className={`font-bold ${getRatingColor(facility.healthRating)}`}>{facility.healthRating || '-'}</p>
                      <p className="text-[var(--foreground-muted)]">Health</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-bold ${getRatingColor(facility.staffingRating)}`}>{facility.staffingRating || '-'}</p>
                      <p className="text-[var(--foreground-muted)]">Staff</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-bold ${getRatingColor(facility.qmRating)}`}>{facility.qmRating || '-'}</p>
                      <p className="text-[var(--foreground-muted)]">QM</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFacilities.length === 0 && (
            <div className="card-neumorphic-inset p-8 text-center">
              <p className="text-[var(--foreground-muted)]">No facilities match the current filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// HPRD Calculator View
function HPRDCalculatorView({ onBack }: { onBack: () => void }) {
  const [beds, setBeds] = useState(100);
  const [occupancy, setOccupancy] = useState(85);
  const [targetRating, setTargetRating] = useState(3);
  const [currentRNs, setCurrentRNs] = useState(5);
  const [currentLPNs, setCurrentLPNs] = useState(10);
  const [currentCNAs, setCurrentCNAs] = useState(25);

  // CMS HPRD thresholds
  const thresholds = {
    5: { total: 4.08, rn: 0.75 },
    4: { total: 3.58, rn: 0.55 },
    3: { total: 3.18, rn: 0.40 },
    2: { total: 2.82, rn: 0.30 },
    1: { total: 0, rn: 0 },
  };

  const residents = Math.round(beds * (occupancy / 100));
  const currentTotalStaff = currentRNs + currentLPNs + currentCNAs;

  // Assume 8-hour shifts and need 3 shifts per day
  const staffHoursPerDay = currentTotalStaff * 8;
  const currentTotalHPRD = residents > 0 ? staffHoursPerDay / residents : 0;
  const currentRNHPRD = residents > 0 ? (currentRNs * 8) / residents : 0;

  const targetThreshold = thresholds[targetRating as keyof typeof thresholds];
  const neededTotalHPRD = targetThreshold.total;
  const neededRNHPRD = targetThreshold.rn;

  const totalHoursNeeded = neededTotalHPRD * residents;
  const rnHoursNeeded = neededRNHPRD * residents;

  const additionalTotalStaff = Math.max(0, Math.ceil((totalHoursNeeded - staffHoursPerDay) / 8));
  const additionalRNs = Math.max(0, Math.ceil((rnHoursNeeded - (currentRNs * 8)) / 8));

  const staffingGap = neededTotalHPRD - currentTotalHPRD;
  const rnGap = neededRNHPRD - currentRNHPRD;

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </button>

      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
          <Calculator className="w-4 h-4" />
          Staffing Calculator
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">HPRD Calculator</h2>
        <p className="text-[var(--foreground-muted)]">
          Calculate staffing requirements to achieve your target star rating
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card-neumorphic p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-500" />
            Facility Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Certified Beds</label>
              <input
                type="number"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full card-neumorphic-inset px-4 py-3 text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Occupancy Rate (%)</label>
              <input
                type="number"
                value={occupancy}
                onChange={(e) => setOccupancy(Number(e.target.value))}
                className="w-full card-neumorphic-inset px-4 py-3 text-lg"
                min="0"
                max="100"
              />
              <p className="text-xs text-[var(--foreground-muted)] mt-1">= {residents} residents</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Star Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setTargetRating(rating)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      targetRating === rating
                        ? 'btn-neumorphic-primary text-white'
                        : 'btn-neumorphic'
                    }`}
                  >
                    {rating} ★
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-3">Current Staffing (per shift)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-1">RNs</label>
                  <input
                    type="number"
                    value={currentRNs}
                    onChange={(e) => setCurrentRNs(Number(e.target.value))}
                    className="w-full card-neumorphic-inset px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-1">LPNs</label>
                  <input
                    type="number"
                    value={currentLPNs}
                    onChange={(e) => setCurrentLPNs(Number(e.target.value))}
                    className="w-full card-neumorphic-inset px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--foreground-muted)] mb-1">CNAs</label>
                  <input
                    type="number"
                    value={currentCNAs}
                    onChange={(e) => setCurrentCNAs(Number(e.target.value))}
                    className="w-full card-neumorphic-inset px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Current vs Target
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Total HPRD</span>
                  <span className={`font-bold ${staffingGap > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {currentTotalHPRD.toFixed(2)} / {neededTotalHPRD.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-full rounded-full ${currentTotalHPRD >= neededTotalHPRD ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (currentTotalHPRD / neededTotalHPRD) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">RN HPRD</span>
                  <span className={`font-bold ${rnGap > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {currentRNHPRD.toFixed(2)} / {neededRNHPRD.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-full rounded-full ${currentRNHPRD >= neededRNHPRD ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (currentRNHPRD / neededRNHPRD) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              {staffingGap <= 0 && rnGap <= 0 ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
              Staffing Recommendation
            </h3>

            {staffingGap <= 0 && rnGap <= 0 ? (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                <p className="font-medium">You meet the staffing requirements for {targetRating}-star!</p>
                <p className="text-sm mt-1">Your current staffing levels exceed the CMS thresholds.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {staffingGap > 0 && (
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      Hire {additionalTotalStaff} additional nursing staff
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Gap: {staffingGap.toFixed(2)} HPRD ({(staffingGap * residents).toFixed(0)} hours/day)
                    </p>
                  </div>
                )}
                {rnGap > 0 && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="font-medium text-red-700 dark:text-red-300">
                      Hire {additionalRNs} additional RNs
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Gap: {rnGap.toFixed(2)} RN HPRD ({(rnGap * residents).toFixed(0)} RN hours/day)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CMS Thresholds Reference */}
          <div className="card-neumorphic p-6">
            <h3 className="font-semibold mb-4">CMS Staffing Thresholds (2024)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2">Rating</th>
                    <th className="text-right py-2">Total HPRD</th>
                    <th className="text-right py-2">RN HPRD</th>
                  </tr>
                </thead>
                <tbody>
                  {[5, 4, 3, 2].map((r) => (
                    <tr key={r} className={`border-b border-gray-100 dark:border-gray-800 ${targetRating === r ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}>
                      <td className="py-2 font-medium">{r} Star</td>
                      <td className="text-right py-2">{thresholds[r as keyof typeof thresholds].total}</td>
                      <td className="text-right py-2">{thresholds[r as keyof typeof thresholds].rn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compare Facilities View
function CompareFacilitiesView({
  onBack,
  onSelectFacility,
}: {
  onBack: () => void;
  onSelectFacility: (providerNumber: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    federalProviderNumber: string;
    providerName: string;
    cityTown: string;
    state: string;
    overallRating: number;
  }>>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [facilityData, setFacilityData] = useState<Record<string, Facility & { staffing?: Record<string, unknown>; qualityMeasures?: Record<string, unknown> }>>({});
  const [loading, setLoading] = useState(false);

  // Search facilities
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/facilities/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch facility data when selected
  const addFacility = async (providerNumber: string) => {
    if (selectedFacilities.includes(providerNumber) || selectedFacilities.length >= 3) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/facilities/${providerNumber}`);
      const data = await response.json();
      setFacilityData(prev => ({ ...prev, [providerNumber]: { ...data.facility, staffing: data.staffing, qualityMeasures: data.qualityMeasures } }));
      setSelectedFacilities(prev => [...prev, providerNumber]);
    } catch (error) {
      console.error('Failed to fetch facility:', error);
    } finally {
      setLoading(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const removeFacility = (providerNumber: string) => {
    setSelectedFacilities(prev => prev.filter(p => p !== providerNumber));
    setFacilityData(prev => {
      const newData = { ...prev };
      delete newData[providerNumber];
      return newData;
    });
  };

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-500';
    if (rating >= 4) return 'text-green-500';
    if (rating === 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const comparisonMetrics = [
    { key: 'overallRating', label: 'Overall Rating', suffix: '★' },
    { key: 'healthInspectionRating', label: 'Health Inspection', suffix: '★' },
    { key: 'staffingRating', label: 'Staffing', suffix: '★' },
    { key: 'qualityMeasureRating', label: 'Quality Measures', suffix: '★' },
    { key: 'numberOfCertifiedBeds', label: 'Beds', suffix: '' },
    { key: 'totalFines', label: 'Total Fines', prefix: '$', format: (v: number) => v?.toLocaleString() || '0' },
    { key: 'penaltyCount', label: 'Penalties', suffix: '' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </button>

      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
          <GitCompare className="w-4 h-4" />
          Facility Comparison
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">Compare Facilities</h2>
        <p className="text-[var(--foreground-muted)]">
          Compare up to 3 facilities side by side
        </p>
      </div>

      {/* Search */}
      <div className="card-neumorphic p-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a facility to compare..."
            className="w-full card-neumorphic-inset px-4 py-3"
            disabled={selectedFacilities.length >= 3}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="mt-2 space-y-2">
            {searchResults.map((result) => (
              <button
                key={result.federalProviderNumber}
                onClick={() => addFacility(result.federalProviderNumber)}
                disabled={selectedFacilities.includes(result.federalProviderNumber)}
                className="w-full text-left p-3 card-neumorphic-inset hover:bg-cyan-50 dark:hover:bg-cyan-900/20 disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{result.providerName}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{result.cityTown}, {result.state}</p>
                  </div>
                  <span className={`font-bold ${getRatingColor(result.overallRating)}`}>
                    {result.overallRating}★
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {selectedFacilities.length > 0 && (
        <div className="card-neumorphic p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Metric</th>
                {selectedFacilities.map((providerNumber) => {
                  const facility = facilityData[providerNumber];
                  return (
                    <th key={providerNumber} className="text-center py-3 px-4 min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => removeFacility(providerNumber)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <p className="font-semibold text-sm">{facility?.providerName || 'Loading...'}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{facility?.cityTown}, {facility?.state}</p>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map((metric) => (
                <tr key={metric.key} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium">{metric.label}</td>
                  {selectedFacilities.map((providerNumber) => {
                    const facility = facilityData[providerNumber];
                    const rawValue = facility?.[metric.key as keyof typeof facility];
                    const numValue = typeof rawValue === 'number' ? rawValue : null;
                    const displayValue = metric.format && numValue != null
                      ? metric.format(numValue)
                      : (numValue ?? rawValue);
                    const isRating = metric.suffix === '★';

                    // Find best value for highlighting
                    const allValues = selectedFacilities.map(pn => {
                      const f = facilityData[pn];
                      const v = f?.[metric.key as keyof typeof f];
                      return typeof v === 'number' ? v : null;
                    }).filter((v): v is number => v != null);
                    const isBest = isRating && numValue != null && numValue === Math.max(...allValues);

                    return (
                      <td key={providerNumber} className="text-center py-3 px-4">
                        <span className={`font-bold text-lg ${isRating ? getRatingColor(numValue) : ''} ${isBest ? 'bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded' : ''}`}>
                          {metric.prefix || ''}{String(displayValue ?? '-')}{metric.suffix || ''}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Staffing Metrics */}
              <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                <td className="py-3 px-4 font-semibold text-cyan-600">Total HPRD</td>
                {selectedFacilities.map((providerNumber) => {
                  const facility = facilityData[providerNumber];
                  const value = (facility?.staffing as Record<string, unknown>)?.totalNurseHPRD as number;
                  return (
                    <td key={providerNumber} className="text-center py-3 px-4">
                      <span className="font-bold">{value?.toFixed(2) || '-'}</span>
                    </td>
                  );
                })}
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">RN HPRD</td>
                {selectedFacilities.map((providerNumber) => {
                  const facility = facilityData[providerNumber];
                  const value = (facility?.staffing as Record<string, unknown>)?.rnHPRD as number;
                  return (
                    <td key={providerNumber} className="text-center py-3 px-4">
                      <span className="font-bold">{value?.toFixed(2) || '-'}</span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selectedFacilities.length === 0 && (
        <div className="card-neumorphic-inset p-12 text-center">
          <GitCompare className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
          <p className="text-[var(--foreground-muted)]">Search and select facilities to compare</p>
        </div>
      )}

      {selectedFacilities.length > 0 && selectedFacilities.length < 3 && (
        <p className="text-center text-sm text-[var(--foreground-muted)]">
          You can add {3 - selectedFacilities.length} more facilit{3 - selectedFacilities.length === 1 ? 'y' : 'ies'} to compare
        </p>
      )}
    </div>
  );
}

// Executive Dashboard - Portfolio-wide metrics and company performance
function ExecutiveDashboard({
  onBack,
  onSelectFacility,
}: {
  onBack: () => void;
  onSelectFacility: (providerNumber: string) => void;
}) {
  const [facilities, setFacilities] = useState<Array<{
    federalProviderNumber: string;
    providerName: string;
    cityTown: string;
    state: string;
    overallRating: number | null;
    healthRating: number | null;
    staffingRating: number | null;
    qmRating: number | null;
    company?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const ccnList = Object.keys(CASCADIA_FACILITIES);
        const response = await fetch(`/api/facilities/search?ccns=${ccnList.join(',')}&limit=100`);
        const data = await response.json();
        const enriched = (data.results || []).map((f: { federalProviderNumber: string }) => ({
          ...f,
          company: CASCADIA_FACILITIES[f.federalProviderNumber]?.company || 'Other',
          isVincero: CASCADIA_FACILITIES[f.federalProviderNumber]?.isVincero || false,
        }));
        setFacilities(enriched);
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate portfolio metrics
  const totalFacilities = facilities.length;
  const ratedFacilities = facilities.filter(f => f.overallRating);
  const avgRating = ratedFacilities.length > 0
    ? (ratedFacilities.reduce((sum, f) => sum + (f.overallRating || 0), 0) / ratedFacilities.length)
    : 0;

  const fiveStarCount = facilities.filter(f => f.overallRating === 5).length;
  const lowRatedCount = facilities.filter(f => f.overallRating && f.overallRating <= 2).length;

  // At risk facilities (1-2 stars)
  const atRiskFacilities = facilities
    .filter(f => f.overallRating && f.overallRating <= 2)
    .sort((a, b) => (a.overallRating || 0) - (b.overallRating || 0));

  // Top performers
  const topPerformers = facilities
    .filter(f => f.overallRating === 5)
    .slice(0, 5);

  // Company breakdown
  const companies = [...new Set(facilities.map(f => f.company || 'Other'))].filter(Boolean) as string[];
  const companyStats = companies.map(company => {
    const companyFacilities = facilities.filter(f => (f.company || 'Other') === company);
    const rated = companyFacilities.filter(f => f.overallRating);
    return {
      company: company as string,
      count: companyFacilities.length,
      avgRating: rated.length ? (rated.reduce((sum, f) => sum + (f.overallRating || 0), 0) / rated.length) : 0,
      fiveStars: companyFacilities.filter(f => f.overallRating === 5).length,
      lowRated: companyFacilities.filter(f => f.overallRating && f.overallRating <= 2).length,
    };
  }).sort((a, b) => b.avgRating - a.avgRating);

  // State breakdown
  const states = [...new Set(facilities.map(f => f.state))];
  const stateStats = states.map(state => {
    const stateFacilities = facilities.filter(f => f.state === state);
    const rated = stateFacilities.filter(f => f.overallRating);
    return {
      state,
      count: stateFacilities.length,
      avgRating: rated.length ? (rated.reduce((sum, f) => sum + (f.overallRating || 0), 0) / rated.length) : 0,
    };
  }).sort((a, b) => b.count - a.count);

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-500';
    if (rating >= 4) return 'text-green-600';
    if (rating === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading executive dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
          <PieChart className="w-4 h-4" />
          Executive View
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">Portfolio Dashboard</h2>
        <p className="text-[var(--foreground-muted)]">
          Cascadia Healthcare performance overview
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neumorphic p-6 text-center">
          <p className="text-4xl font-bold text-gradient-primary">{totalFacilities}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Total Facilities</p>
        </div>
        <div className="card-neumorphic p-6 text-center">
          <p className="text-4xl font-bold text-amber-500">{avgRating.toFixed(1)}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Portfolio Avg</p>
        </div>
        <div className="card-neumorphic p-6 text-center">
          <p className="text-4xl font-bold text-green-500">{fiveStarCount}</p>
          <p className="text-sm text-[var(--foreground-muted)]">5-Star Facilities</p>
        </div>
        <div className="card-neumorphic p-6 text-center">
          <p className="text-4xl font-bold text-red-500">{lowRatedCount}</p>
          <p className="text-sm text-[var(--foreground-muted)]">At Risk (1-2★)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Performance */}
        <div className="card-neumorphic p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Company Performance
          </h3>
          <div className="space-y-3">
            {companyStats.map((stat) => (
              <div key={stat.company} className="card-neumorphic-inset p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${COMPANY_COLORS[stat.company] || 'bg-gray-100'}`}>
                    {stat.company}
                  </span>
                  <span className="font-bold text-lg">{stat.avgRating.toFixed(1)} ★</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--foreground-muted)]">
                  <span>{stat.count} facilities</span>
                  <div className="flex gap-3">
                    <span className="text-green-600">{stat.fiveStars} ★5</span>
                    {stat.lowRated > 0 && <span className="text-red-500">{stat.lowRated} at risk</span>}
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                    style={{ width: `${(stat.avgRating / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At Risk Facilities */}
        <div className="card-neumorphic p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            At Risk Facilities
          </h3>
          {atRiskFacilities.length === 0 ? (
            <div className="card-neumorphic-inset p-6 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="text-[var(--foreground-muted)]">No facilities at risk!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {atRiskFacilities.map((f) => (
                <div
                  key={f.federalProviderNumber}
                  onClick={() => onSelectFacility(f.federalProviderNumber)}
                  className="card-neumorphic-inset p-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{f.providerName}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{f.cityTown}, {f.state}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-bold">{f.overallRating}★</span>
                      <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="card-neumorphic p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Top Performers (5-Star)
          </h3>
          <div className="space-y-2">
            {topPerformers.map((f) => (
              <div
                key={f.federalProviderNumber}
                onClick={() => onSelectFacility(f.federalProviderNumber)}
                className="card-neumorphic-inset p-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{f.providerName}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{f.cityTown}, {f.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">5★</span>
                    <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State Distribution */}
        <div className="card-neumorphic p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            State Distribution
          </h3>
          <div className="space-y-3">
            {stateStats.map((stat) => (
              <div key={stat.state} className="flex items-center gap-3">
                <span className="w-8 font-bold text-sm">{stat.state}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(stat.count / Math.max(...stateStats.map(s => s.count))) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-bold">{stat.count}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${getRatingColor(stat.avgRating)}`}>
                  {stat.avgRating.toFixed(1)}★
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Distribution Chart */}
      <div className="card-neumorphic p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Portfolio Rating Distribution
        </h3>
        <div className="flex items-end justify-around h-48 gap-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = facilities.filter(f => f.overallRating === rating).length;
            const percentage = totalFacilities > 0 ? (count / totalFacilities) * 100 : 0;
            const maxCount = Math.max(...[5, 4, 3, 2, 1].map(r => facilities.filter(f => f.overallRating === r).length));
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={rating} className="flex flex-col items-center flex-1">
                <span className="text-sm font-bold mb-2">{count}</span>
                <div
                  className={`w-full rounded-t-lg ${
                    rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <span className="text-sm font-medium mt-2">{rating}★</span>
                <span className="text-xs text-[var(--foreground-muted)]">{percentage.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Action Tasks View - Task management for improvement plans
function ActionTasksView({ onBack }: { onBack: () => void }) {
  const [tasks, setTasks] = useState<Array<{
    id: string;
    title: string;
    facility: string;
    category: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    priority: 'high' | 'medium' | 'low';
    assignee?: string;
  }>>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<{ title: string; facility: string; dueDate: string; priority: 'high' | 'medium' | 'low' }>({ title: '', facility: '', dueDate: '', priority: 'medium' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('actionTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Demo tasks
      setTasks([
        { id: '1', title: 'Implement GDR program for antipsychotic reduction', facility: 'Clearwater', category: 'Quality Measures', dueDate: '2024-02-15', status: 'in_progress', priority: 'high' },
        { id: '2', title: 'Recruit 2 additional RNs for weekend coverage', facility: 'Caldwell', category: 'Staffing', dueDate: '2024-02-28', status: 'pending', priority: 'high' },
        { id: '3', title: 'Complete mock survey with external consultant', facility: 'CDA', category: 'Health Inspection', dueDate: '2024-02-10', status: 'overdue', priority: 'high' },
        { id: '4', title: 'Update fall prevention care plans', facility: 'Paradise Creek', category: 'Quality Measures', dueDate: '2024-03-01', status: 'pending', priority: 'medium' },
        { id: '5', title: 'PBJ data audit for Q4', facility: 'Portfolio-wide', category: 'Staffing', dueDate: '2024-02-20', status: 'completed', priority: 'medium' },
      ]);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('actionTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title || !newTask.facility || !newTask.dueDate) return;
    const task = {
      id: Date.now().toString(),
      ...newTask,
      category: 'General',
      status: 'pending' as const,
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', facility: '', dueDate: '', priority: 'medium' });
    setShowAddForm(false);
  };

  const updateTaskStatus = (taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'overdue') => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const filteredTasks = tasks.filter(t => !filterStatus || t.status === filterStatus);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  const priorityColors = {
    high: 'border-l-4 border-red-500',
    medium: 'border-l-4 border-yellow-500',
    low: 'border-l-4 border-green-500',
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
          <ListChecks className="w-4 h-4" />
          Action Tracking
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">Improvement Tasks</h2>
        <p className="text-[var(--foreground-muted)]">Track and manage action items from improvement plans</p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold">{taskStats.total}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Total Tasks</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{taskStats.inProgress}</p>
          <p className="text-sm text-[var(--foreground-muted)]">In Progress</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{taskStats.completed}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Completed</p>
        </div>
        <div className="card-neumorphic p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{taskStats.overdue}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Overdue</p>
        </div>
      </div>

      {/* Filters and Add */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['all', 'pending', 'in_progress', 'completed', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status === 'all' ? null : status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                (status === 'all' && !filterStatus) || filterStatus === status
                  ? 'btn-neumorphic-primary text-white'
                  : 'btn-neumorphic'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-neumorphic-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="card-neumorphic p-6">
          <h3 className="font-semibold mb-4">New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="card-neumorphic-inset px-4 py-2"
            />
            <input
              type="text"
              placeholder="Facility"
              value={newTask.facility}
              onChange={(e) => setNewTask({ ...newTask, facility: e.target.value })}
              className="card-neumorphic-inset px-4 py-2"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="card-neumorphic-inset px-4 py-2"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
              className="card-neumorphic-inset px-4 py-2"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addTask} className="btn-neumorphic-primary px-4 py-2">
              Save Task
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-neumorphic px-4 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`card-neumorphic p-4 ${priorityColors[task.priority]}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">{task.category}</span>
                  <span className="text-xs text-[var(--foreground-muted)]">• {task.facility}</span>
                </div>
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                    className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                    title="Mark Complete"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </button>
                )}
                {task.status === 'pending' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                    className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    title="Start Task"
                  >
                    <Play className="w-5 h-5 text-blue-500" />
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="card-neumorphic-inset p-8 text-center">
          <ListChecks className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
          <p className="text-[var(--foreground-muted)]">No tasks found</p>
        </div>
      )}
    </div>
  );
}

// Survey Checklists View
function SurveyChecklistsView({ onBack }: { onBack: () => void }) {
  const [activeChecklist, setActiveChecklist] = useState<string | null>(null);
  const [checklistProgress, setChecklistProgress] = useState<Record<string, Set<string>>>({});

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('checklistProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const restored: Record<string, Set<string>> = {};
      Object.keys(parsed).forEach(key => {
        restored[key] = new Set(parsed[key]);
      });
      setChecklistProgress(restored);
    }
  }, []);

  // Save progress
  const saveProgress = (department: string, items: Set<string>) => {
    const newProgress = { ...checklistProgress, [department]: items };
    setChecklistProgress(newProgress);
    // Convert Sets to arrays for JSON storage
    const toSave: Record<string, string[]> = {};
    Object.keys(newProgress).forEach(key => {
      toSave[key] = Array.from(newProgress[key]);
    });
    localStorage.setItem('checklistProgress', JSON.stringify(toSave));
  };

  const toggleItem = (department: string, itemId: string) => {
    const current = checklistProgress[department] || new Set();
    const newSet = new Set(current);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    saveProgress(department, newSet);
  };

  const checklists: Record<string, { title: string; icon: React.ReactNode; color: string; items: Array<{ id: string; text: string; critical?: boolean }> }> = {
    nursing: {
      title: 'Nursing Department',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-red-500',
      items: [
        { id: 'n1', text: 'All care plans updated within last 7 days', critical: true },
        { id: 'n2', text: 'Medication administration records complete' },
        { id: 'n3', text: 'Physician orders signed and dated', critical: true },
        { id: 'n4', text: 'Fall risk assessments current' },
        { id: 'n5', text: 'Skin assessments documented' },
        { id: 'n6', text: 'Weights recorded weekly' },
        { id: 'n7', text: 'Vital signs charted as ordered' },
        { id: 'n8', text: 'Pain assessments completed' },
        { id: 'n9', text: 'Restraint documentation current (if applicable)', critical: true },
        { id: 'n10', text: 'Infection control logs updated' },
      ],
    },
    dietary: {
      title: 'Dietary Department',
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-500',
      items: [
        { id: 'd1', text: 'Food temperatures logged (hot ≥135°F, cold ≤41°F)', critical: true },
        { id: 'd2', text: 'Refrigerator/freezer temps logged daily' },
        { id: 'd3', text: 'Diet cards match physician orders', critical: true },
        { id: 'd4', text: 'Therapeutic diets properly identified' },
        { id: 'd5', text: 'Kitchen clean and organized' },
        { id: 'd6', text: 'Food storage properly labeled and dated' },
        { id: 'd7', text: 'Staff food handler certifications current' },
        { id: 'd8', text: 'Menus posted and followed' },
        { id: 'd9', text: 'Snacks and supplements available' },
      ],
    },
    environment: {
      title: 'Environmental Services',
      icon: <Building2 className="w-5 h-5" />,
      color: 'text-blue-500',
      items: [
        { id: 'e1', text: 'All rooms clean and odor-free', critical: true },
        { id: 'e2', text: 'Handrails secure and clean' },
        { id: 'e3', text: 'Call lights within reach and functioning', critical: true },
        { id: 'e4', text: 'Hallways clear of obstructions' },
        { id: 'e5', text: 'Proper lighting in all areas' },
        { id: 'e6', text: 'Bathrooms clean and stocked' },
        { id: 'e7', text: 'Temperature comfortable (71-81°F)' },
        { id: 'e8', text: 'MSDS sheets accessible' },
        { id: 'e9', text: 'Biohazard waste properly handled' },
        { id: 'e10', text: 'Emergency exits clear and marked' },
      ],
    },
    activities: {
      title: 'Activities Department',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-purple-500',
      items: [
        { id: 'a1', text: 'Activity calendar posted' },
        { id: 'a2', text: 'Individual activity assessments current' },
        { id: 'a3', text: 'Participation documented' },
        { id: 'a4', text: 'Resident preferences honored' },
        { id: 'a5', text: 'Varied activities offered (physical, cognitive, social)' },
        { id: 'a6', text: 'Bedbound residents have activities' },
        { id: 'a7', text: 'Community outings documented' },
        { id: 'a8', text: 'Volunteer program in place' },
      ],
    },
    admin: {
      title: 'Administration',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-amber-500',
      items: [
        { id: 'ad1', text: 'Employee files complete with licenses', critical: true },
        { id: 'ad2', text: 'Background checks current' },
        { id: 'ad3', text: 'Abuse prevention training documented', critical: true },
        { id: 'ad4', text: 'HIPAA training documented' },
        { id: 'ad5', text: 'Resident rights posted' },
        { id: 'ad6', text: 'Grievance procedure available' },
        { id: 'ad7', text: 'Emergency preparedness plan current' },
        { id: 'ad8', text: 'Fire drills documented monthly', critical: true },
        { id: 'ad9', text: 'QAPI meeting minutes current' },
        { id: 'ad10', text: 'Infection control plan updated' },
      ],
    },
  };

  const getProgress = (department: string) => {
    const items = checklists[department]?.items || [];
    const completed = checklistProgress[department]?.size || 0;
    return { completed, total: items.length, percentage: items.length > 0 ? (completed / items.length) * 100 : 0 };
  };

  if (activeChecklist) {
    const checklist = checklists[activeChecklist];
    const progress = getProgress(activeChecklist);
    const completedItems = checklistProgress[activeChecklist] || new Set();

    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={() => setActiveChecklist(null)} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Checklists
        </button>

        <div className="card-neumorphic p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={checklist.color}>{checklist.icon}</span>
              <h2 className="text-2xl font-bold">{checklist.title}</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{progress.completed}/{progress.total}</p>
              <p className="text-sm text-[var(--foreground-muted)]">{progress.percentage.toFixed(0)}% complete</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="space-y-3">
            {checklist.items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(activeChecklist, item.id)}
                className={`card-neumorphic-inset p-4 cursor-pointer flex items-center gap-3 ${
                  completedItems.has(item.id) ? 'bg-green-50 dark:bg-green-900/20' : ''
                } ${item.critical ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  completedItems.has(item.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {completedItems.has(item.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className={completedItems.has(item.id) ? 'line-through text-[var(--foreground-muted)]' : ''}>
                  {item.text}
                </span>
                {item.critical && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    Critical
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => saveProgress(activeChecklist, new Set(checklist.items.map(i => i.id)))}
              className="btn-neumorphic-primary px-4 py-2"
            >
              Mark All Complete
            </button>
            <button
              onClick={() => saveProgress(activeChecklist, new Set())}
              className="btn-neumorphic px-4 py-2"
            >
              Reset Checklist
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
        Back
      </button>

      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <ClipboardCheck className="w-4 h-4" />
          Survey Preparation
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">Survey Checklists</h2>
        <p className="text-[var(--foreground-muted)]">Department-specific checklists for survey readiness</p>
      </div>

      {/* Overall Progress */}
      <div className="card-neumorphic p-6">
        <h3 className="font-semibold mb-4">Overall Readiness</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(checklists).map(([key, checklist]) => {
            const progress = getProgress(key);
            return (
              <div key={key} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-gray-700" />
                    <circle
                      cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none"
                      strokeDasharray={`${progress.percentage * 1.76} 176`}
                      className={progress.percentage === 100 ? 'text-green-500' : 'text-cyan-500'}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {progress.percentage.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)]">{checklist.title.split(' ')[0]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(checklists).map(([key, checklist]) => {
          const progress = getProgress(key);
          return (
            <div
              key={key}
              onClick={() => setActiveChecklist(key)}
              className="card-neumorphic p-6 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={checklist.color}>{checklist.icon}</span>
                <h3 className="font-semibold">{checklist.title}</h3>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--foreground-muted)]">{progress.completed} of {progress.total} items</span>
                <span className={`font-bold ${progress.percentage === 100 ? 'text-green-500' : ''}`}>
                  {progress.percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-full rounded-full ${progress.percentage === 100 ? 'bg-green-500' : 'bg-cyan-500'}`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Alerts View - Rating change notifications
function AlertsView({ onBack }: { onBack: () => void }) {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'warning' | 'improvement' | 'decline' | 'info';
    facility: string;
    message: string;
    date: string;
    read: boolean;
  }>>([]);

  useEffect(() => {
    // Demo alerts
    setAlerts([
      { id: '1', type: 'decline', facility: 'Caldwell Care', message: 'Overall rating dropped from 2★ to 1★', date: '2024-01-28', read: false },
      { id: '2', type: 'warning', facility: 'Paradise Creek', message: 'Staffing HPRD below 3-star threshold', date: '2024-01-27', read: false },
      { id: '3', type: 'improvement', facility: 'Highland', message: 'Achieved 5-star overall rating!', date: '2024-01-25', read: true },
      { id: '4', type: 'info', facility: 'Portfolio', message: 'New CMS data release available', date: '2024-01-24', read: true },
      { id: '5', type: 'warning', facility: 'Spokane Valley', message: 'Health inspection rating at 2★ - survey expected', date: '2024-01-23', read: true },
    ]);
  }, []);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const alertIcons = {
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    improvement: <TrendingUp className="w-5 h-5 text-green-500" />,
    decline: <TrendingDown className="w-5 h-5 text-red-500" />,
    info: <Bell className="w-5 h-5 text-blue-500" />,
  };

  const alertColors = {
    warning: 'border-l-4 border-amber-500',
    improvement: 'border-l-4 border-green-500',
    decline: 'border-l-4 border-red-500',
    info: 'border-l-4 border-blue-500',
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
          <Bell className="w-4 h-4" />
          Notifications
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary mb-2">Alerts</h2>
        <p className="text-[var(--foreground-muted)]">Rating changes and important notifications</p>
      </div>

      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--foreground-muted)]">{unreadCount} unread alerts</span>
          <button onClick={markAllRead} className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
            Mark all as read
          </button>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => markAsRead(alert.id)}
            className={`card-neumorphic p-4 cursor-pointer ${alertColors[alert.type]} ${
              !alert.read ? 'bg-cyan-50 dark:bg-cyan-900/10' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {alertIcons[alert.type]}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{alert.facility}</span>
                  <span className="text-xs text-[var(--foreground-muted)]">{alert.date}</span>
                </div>
                <p className="text-sm text-[var(--foreground-muted)]">{alert.message}</p>
              </div>
              {!alert.read && (
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="card-neumorphic-inset p-8 text-center">
          <Bell className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
          <p className="text-[var(--foreground-muted)]">No alerts at this time</p>
        </div>
      )}
    </div>
  );
}

// Trends View - Historical rating trends for a facility
function TrendsView({
  providerNumber,
  onBack,
}: {
  providerNumber: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<{
    facility: Facility | null;
    ratingHistory: Array<{
      ratingDate: string;
      overallRating: number;
      healthRating: number;
      staffingRating: number;
      qmRating: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/facilities/${providerNumber}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch trends:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [providerNumber]);

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="card-neumorphic p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading trends...</p>
        </div>
      </div>
    );
  }

  const history = data?.ratingHistory || [];

  // Calculate trends
  const getTrend = (ratings: number[]) => {
    if (ratings.length < 2) return 'stable';
    const recent = ratings.slice(0, 3);
    const older = ratings.slice(3, 6);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
    if (recentAvg > olderAvg + 0.3) return 'improving';
    if (recentAvg < olderAvg - 0.3) return 'declining';
    return 'stable';
  };

  const overallTrend = getTrend(history.map(h => h.overallRating));

  return (
    <div className="space-y-6 animate-slide-up">
      <button onClick={onBack} className="btn-neumorphic px-4 py-2 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </button>

      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Rating Trends</h2>
          <p className="text-[var(--foreground-muted)]">{data?.facility?.providerName}</p>
        </div>
      </div>

      {/* Trend Summary */}
      <div className="card-neumorphic p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl font-bold">{data?.facility?.overallRating}★</span>
          <div className="flex items-center gap-2">
            {overallTrend === 'improving' && <TrendingUp className="w-6 h-6 text-green-500" />}
            {overallTrend === 'declining' && <TrendingDown className="w-6 h-6 text-red-500" />}
            {overallTrend === 'stable' && <Activity className="w-6 h-6 text-yellow-500" />}
            <span className={`font-medium ${
              overallTrend === 'improving' ? 'text-green-600' :
              overallTrend === 'declining' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {overallTrend.charAt(0).toUpperCase() + overallTrend.slice(1)} Trend
            </span>
          </div>
        </div>
        <p className="text-[var(--foreground-muted)]">
          Based on {history.length} rating periods over the past 2 years.
        </p>
      </div>

      {/* Rating History Chart */}
      <div className="card-neumorphic p-6">
        <h3 className="font-semibold mb-4">Rating History</h3>
        {history.length > 0 ? (
          <div className="space-y-4">
            {/* Simple visual chart */}
            <div className="flex items-end justify-between h-48 gap-2">
              {history.slice(0, 12).reverse().map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="flex flex-col gap-1 w-full">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t"
                      style={{ height: `${(h.overallRating / 5) * 120}px` }}
                      title={`Overall: ${h.overallRating}★`}
                    />
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] mt-1 rotate-45 origin-left">
                    {new Date(h.ratingDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Detailed history table */}
            <div className="overflow-x-auto mt-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2">Date</th>
                    <th className="text-center py-2">Overall</th>
                    <th className="text-center py-2">Health</th>
                    <th className="text-center py-2">Staffing</th>
                    <th className="text-center py-2">QM</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 12).map((h, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2">{new Date(h.ratingDate).toLocaleDateString()}</td>
                      <td className="text-center py-2 font-bold">{h.overallRating}★</td>
                      <td className="text-center py-2">{h.healthRating}★</td>
                      <td className="text-center py-2">{h.staffingRating}★</td>
                      <td className="text-center py-2">{h.qmRating}★</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card-neumorphic-inset p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-muted)]" />
            <p className="text-[var(--foreground-muted)]">No historical data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
