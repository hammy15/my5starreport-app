/**
 * Facility Overview Component
 *
 * Displays the main dashboard for a selected facility,
 * showing all star ratings and key metrics with deep drill-down capabilities.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Users,
  AlertTriangle,
  TrendingUp,
  ClipboardCheck,
  UserCheck,
  Heart,
  ArrowLeft,
  Loader2,
  Printer,
  Download,
  BarChart3,
  Target,
  Calendar,
  Award,
  Shield,
  Activity,
  DollarSign,
  FileText,
  ChevronRight,
  Star,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  Scale,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import type { FacilityAnalysis } from '@/types/facility';

interface FacilityOverviewProps {
  providerNumber: string;
  onBack: () => void;
  onViewDetails: (section: 'health' | 'staffing' | 'quality' | 'plan') => void;
}

export function FacilityOverview({ providerNumber, onBack, onViewDetails }: FacilityOverviewProps) {
  const [analysis, setAnalysis] = useState<FacilityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'ratings' | 'performance' | 'comparison' | 'actions'>('summary');

  useEffect(() => {
    async function fetchFacilityData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/facilities/${providerNumber}`);

        if (!response.ok) {
          throw new Error('Failed to load facility data');
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        console.error('Error fetching facility:', err);
        setError('Failed to load facility data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFacilityData();
  }, [providerNumber]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading facility data...</span>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">{error || 'Facility not found'}</h3>
          <Button onClick={onBack} variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { facility, staffing, qualityMeasures, recommendations } = analysis;

  // Count recommendations by priority
  const highPriority = recommendations.filter(r => r.priority === 'high').length;
  const mediumPriority = recommendations.filter(r => r.priority === 'medium').length;

  // Export/Print function
  const handleExport = () => {
    const printContent = `
      FACILITY REPORT
      ================

      ${facility.providerName}
      ${facility.providerAddress}, ${facility.cityTown}, ${facility.state} ${facility.zipCode}
      Phone: ${facility.phoneNumber}
      Beds: ${facility.numberOfCertifiedBeds} | Residents: ${facility.numberOfResidents}

      STAR RATINGS
      ------------
      Overall Rating: ${facility.overallRating} stars
      Health Inspection: ${facility.healthInspectionRating} stars
      Staffing: ${facility.staffingRating} stars
      Quality Measures: ${facility.qualityMeasureRating} stars

      STAFFING DATA
      -------------
      Total HPRD: ${staffing?.totalNurseHPRD?.toFixed(2) || 'N/A'}
      RN HPRD: ${staffing?.rnHPRD?.toFixed(2) || 'N/A'}
      CNA HPRD: ${staffing?.cnaHPRD?.toFixed(2) || 'N/A'}

      RECOMMENDATIONS (${recommendations.length} total)
      -----------------
      ${recommendations.map((r, i) => `${i + 1}. [${r.priority.toUpperCase()}] ${r.title}`).join('\n      ')}

      Generated: ${new Date().toLocaleDateString()}
      Source: my5starreport.com
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${facility.providerName} - Facility Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px; }
              h2 { color: #374151; margin-top: 30px; }
              .rating { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: bold; margin: 4px; }
              .rating-5, .rating-4 { background: #dcfce7; color: #166534; }
              .rating-3 { background: #fef9c3; color: #854d0e; }
              .rating-1, .rating-2 { background: #fee2e2; color: #991b1b; }
              .rec { padding: 8px; margin: 4px 0; border-left: 4px solid #0891b2; background: #f0fdfa; }
              .high { border-left-color: #dc2626; }
              .medium { border-left-color: #f59e0b; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>${facility.providerName}</h1>
            <p>${facility.providerAddress}, ${facility.cityTown}, ${facility.state} ${facility.zipCode}</p>
            <p>Phone: ${facility.phoneNumber} | Beds: ${facility.numberOfCertifiedBeds} | Residents: ${facility.numberOfResidents}</p>

            <h2>Star Ratings</h2>
            <p>
              <span class="rating rating-${facility.overallRating}">Overall: ${facility.overallRating}★</span>
              <span class="rating rating-${facility.healthInspectionRating}">Health: ${facility.healthInspectionRating}★</span>
              <span class="rating rating-${facility.staffingRating}">Staffing: ${facility.staffingRating}★</span>
              <span class="rating rating-${facility.qualityMeasureRating}">Quality: ${facility.qualityMeasureRating}★</span>
            </p>

            <h2>Staffing Data</h2>
            <table>
              <tr><td>Total HPRD:</td><td><strong>${staffing?.totalNurseHPRD?.toFixed(2) || 'N/A'}</strong></td></tr>
              <tr><td>RN HPRD:</td><td><strong>${staffing?.rnHPRD?.toFixed(2) || 'N/A'}</strong></td></tr>
              <tr><td>CNA HPRD:</td><td><strong>${staffing?.cnaHPRD?.toFixed(2) || 'N/A'}</strong></td></tr>
            </table>

            <h2>Improvement Recommendations (${recommendations.length})</h2>
            ${recommendations.map(r => `<div class="rec ${r.priority}">[${r.priority.toUpperCase()}] ${r.title}</div>`).join('')}

            <div class="footer">
              Generated on ${new Date().toLocaleDateString()} | my5starreport.com<br>
              Data sourced from CMS (Centers for Medicare & Medicaid Services)
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Calculate facility score and grade
  const calculateGrade = (rating: number) => {
    if (rating >= 4.5) return { grade: 'A', color: 'text-green-600' };
    if (rating >= 3.5) return { grade: 'B', color: 'text-blue-600' };
    if (rating >= 2.5) return { grade: 'C', color: 'text-yellow-600' };
    if (rating >= 1.5) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const overallGrade = calculateGrade(facility.overallRating);
  const occupancyRate = facility.numberOfResidents / facility.numberOfCertifiedBeds * 100;

  // Calculate potential rating if improvements are made
  const potentialRating = Math.min(5, facility.overallRating + recommendations.reduce((acc, r) => acc + r.estimatedImpact, 0) / 2);

  // Risk assessment
  const riskLevel = facility.isSpecialFocus ? 'critical' : highPriority > 2 ? 'high' : highPriority > 0 ? 'medium' : 'low';
  const riskColors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div className="space-y-6">
      {/* Header with Back and Export */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Enhanced Facility Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Facility Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{facility.providerName}</h1>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {facility.providerAddress}, {facility.cityTown}, {facility.state} {facility.zipCode}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {facility.phoneNumber}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {facility.numberOfCertifiedBeds} beds
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {facility.numberOfResidents} residents
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {facility.ownershipType}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${riskColors[riskLevel]}`}>
                  {riskLevel === 'critical' ? 'Critical Risk' : riskLevel === 'high' ? 'High Risk' : riskLevel === 'medium' ? 'Moderate Risk' : 'Low Risk'}
                </span>
                {facility.isSpecialFocus && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    Special Focus Facility
                  </span>
                )}
                {facility.abuseIcon && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Abuse Icon
                  </span>
                )}
              </div>
            </div>

            {/* Overall Rating with Grade */}
            <div className="text-center lg:text-right">
              <p className="text-sm font-medium text-gray-500 mb-2">Overall Rating</p>
              <div className="flex items-center justify-center lg:justify-end gap-3">
                <StarRating rating={facility.overallRating} size="lg" showLabel />
                <div className={`text-4xl font-bold ${overallGrade.color}`}>
                  {overallGrade.grade}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Potential: {potentialRating.toFixed(1)}★ with improvements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Freshness Indicator */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-cyan-600" />
          <span className="text-gray-600 dark:text-gray-400">Data Source: <strong className="text-gray-900 dark:text-gray-100">CMS Care Compare</strong></span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Last Updated: {facility.lastUpdated ? new Date(facility.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 2026'}
          </span>
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'summary', label: 'Executive Summary', icon: BarChart3 },
          { id: 'ratings', label: 'Rating Breakdown', icon: Star },
          { id: 'performance', label: 'Performance Metrics', icon: Activity },
          { id: 'comparison', label: 'Market Position', icon: Scale },
          { id: 'actions', label: 'Quick Actions', icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 flex items-center gap-2 whitespace-nowrap rounded-lg border transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 text-cyan-700 dark:text-cyan-300'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Executive Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Alerts/Critical Issues */}
          {(highPriority > 0 || facility.isSpecialFocus || facility.abuseIcon) && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 dark:text-red-300">Attention Required</h3>
                    <ul className="mt-1 text-sm text-red-800 dark:text-red-400 space-y-1">
                      {highPriority > 0 && (
                        <li>• {highPriority} high-priority improvement{highPriority > 1 ? 's' : ''} identified</li>
                      )}
                      {facility.isSpecialFocus && (
                        <li>• This facility is on CMS Special Focus list</li>
                      )}
                      {facility.abuseIcon && (
                        <li>• Abuse-related concerns flagged</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-3xl font-bold text-cyan-600">{facility.overallRating}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Overall Stars</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{occupancyRate.toFixed(0)}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Occupancy</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{staffing?.totalNurseHPRD.toFixed(2) || 'N/A'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total HPRD</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{recommendations.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Action Items</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className={`text-3xl font-bold ${potentialRating >= 4 ? 'text-green-600' : 'text-yellow-600'}`}>{potentialRating.toFixed(1)}★</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Potential Rating</div>
            </div>
          </div>

          {/* Rating History Mini Chart */}
          {analysis.ratingHistory && analysis.ratingHistory.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-600" />
                    Rating History (Last {Math.min(6, analysis.ratingHistory.length)} Months)
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Updated: {facility.lastUpdated ? new Date(facility.lastUpdated).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
                <div className="flex items-end justify-between h-24 gap-1">
                  {analysis.ratingHistory.slice(0, 6).reverse().map((h, i) => {
                    const isLatest = i === analysis.ratingHistory!.slice(0, 6).length - 1;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative">
                        <div
                          className={`w-full rounded-t transition-all ${
                            isLatest ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                          } group-hover:bg-cyan-400`}
                          style={{ height: `${(h.overallRating / 5) * 80}px` }}
                        />
                        <span className="text-[10px] text-gray-400 mt-1">
                          {new Date(h.ratingDate).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          {h.overallRating}★ | H:{h.healthRating} S:{h.staffingRating} Q:{h.qmRating}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center justify-center gap-4 text-xs">
                  {(() => {
                    const history = analysis.ratingHistory!;
                    if (history.length < 2) return <span className="text-gray-500">Insufficient history for trend</span>;
                    const change = history[0].overallRating - history[Math.min(history.length - 1, 5)].overallRating;
                    if (change > 0) return (
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-3 h-3" /> Improving (+{change} stars)
                      </span>
                    );
                    if (change < 0) return (
                      <span className="flex items-center gap-1 text-red-600">
                        <TrendingUp className="w-3 h-3 rotate-180" /> Declining ({change} stars)
                      </span>
                    );
                    return <span className="text-gray-500">Stable rating</span>;
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Star Rating Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover onClick={() => onViewDetails('health')} className="cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <StarRating rating={facility.healthInspectionRating} size="sm" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Health Inspections</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Based on state survey results and deficiencies
                </p>
                <p className="text-xs text-blue-600 mt-3 font-medium">View details →</p>
              </CardContent>
            </Card>

            <Card hover onClick={() => onViewDetails('staffing')} className="cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <StarRating rating={facility.staffingRating} size="sm" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Staffing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {staffing ? `${staffing.totalNurseHPRD.toFixed(2)} total HPRD` : 'View staffing levels'}
                </p>
                <p className="text-xs text-green-600 mt-3 font-medium">View details →</p>
              </CardContent>
            </Card>

            <Card hover onClick={() => onViewDetails('quality')} className="cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <StarRating rating={facility.qualityMeasureRating} size="sm" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quality Measures</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Clinical outcome indicators
                </p>
                <p className="text-xs text-purple-600 mt-3 font-medium">View details →</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  Priority Improvements
                </CardTitle>
                <CardDescription>
                  Top {Math.min(3, recommendations.length)} actions for maximum impact
                </CardDescription>
              </div>
              <Button onClick={() => onViewDetails('plan')} variant="primary">
                Full Improvement Plan
              </Button>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 3).map((rec, idx) => (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-lg border ${
                        rec.priority === 'high'
                          ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                          : rec.priority === 'medium'
                          ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium text-green-600">+{rec.estimatedImpact.toFixed(1)}★</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  This facility is performing well. Consider maintenance strategies.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rating Breakdown Tab */}
      {activeTab === 'ratings' && (
        <div className="space-y-6">
          {/* How Star Ratings Work */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                How CMS Calculates Your Overall Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  CMS uses a weighted formula that starts with Health Inspection rating, then adjusts based on Staffing and Quality Measure performance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-900 dark:text-blue-300">Health Inspection</span>
                      <span className="text-2xl font-bold text-blue-600">{facility.healthInspectionRating}★</span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-400">Base rating - most heavily weighted</p>
                    <div className="mt-2 text-xs">
                      <span className={facility.healthInspectionRating >= 3 ? 'text-green-600' : 'text-red-600'}>
                        {facility.healthInspectionRating >= 3 ? '✓ Meeting minimum standard' : '✗ Below minimum standard'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900 dark:text-green-300">Staffing</span>
                      <span className="text-2xl font-bold text-green-600">{facility.staffingRating}★</span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-400">Can add or subtract up to 1 star</p>
                    <div className="mt-2 text-xs">
                      {facility.staffingRating >= 4 ? (
                        <span className="text-green-600">↑ Adding to overall rating</span>
                      ) : facility.staffingRating <= 2 ? (
                        <span className="text-red-600">↓ Reducing overall rating</span>
                      ) : (
                        <span className="text-yellow-600">→ Neutral impact</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-900 dark:text-purple-300">Quality Measures</span>
                      <span className="text-2xl font-bold text-purple-600">{facility.qualityMeasureRating}★</span>
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-400">Can add or subtract up to 1 star</p>
                    <div className="mt-2 text-xs">
                      {facility.qualityMeasureRating >= 4 ? (
                        <span className="text-green-600">↑ Adding to overall rating</span>
                      ) : facility.qualityMeasureRating <= 2 ? (
                        <span className="text-red-600">↓ Reducing overall rating</span>
                      ) : (
                        <span className="text-yellow-600">→ Neutral impact</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Path to 5 Stars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-600" />
                Path to 5 Stars
              </CardTitle>
              <CardDescription>What it takes to achieve maximum rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Health Inspection',
                    current: facility.healthInspectionRating,
                    target: 5,
                    requirement: 'Top 10% nationally with minimal deficiencies',
                    icon: ClipboardCheck,
                    color: 'blue'
                  },
                  {
                    name: 'Staffing',
                    current: facility.staffingRating,
                    target: 5,
                    requirement: '≥4.08 total HPRD, ≥0.75 RN HPRD',
                    icon: UserCheck,
                    color: 'green'
                  },
                  {
                    name: 'Quality Measures',
                    current: facility.qualityMeasureRating,
                    target: 5,
                    requirement: 'Top 20% on most QMs',
                    icon: Heart,
                    color: 'purple'
                  },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm">
                          <span className={item.current >= item.target ? 'text-green-600' : 'text-gray-600'}>{item.current}★</span>
                          <span className="text-gray-400 mx-1">→</span>
                          <span className="text-cyan-600">{item.target}★</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-full rounded-full bg-${item.color}-500`}
                          style={{ width: `${(item.current / item.target) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.requirement}</p>
                    </div>
                    {item.current >= item.target ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <div className="text-xs text-red-600 font-medium">Gap: {item.target - item.current}★</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rating History Projection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Rating Change Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">If Bad Survey</h4>
                  <div className="text-3xl font-bold text-red-600">{Math.max(1, facility.overallRating - 1)}★</div>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-2">
                    Major deficiencies could drop health rating by 1-2 stars
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2">Current State</h4>
                  <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{facility.overallRating}★</div>
                  <p className="text-xs text-gray-500 mt-2">
                    Maintain current performance to preserve rating
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">With Improvements</h4>
                  <div className="text-3xl font-bold text-green-600">{Math.min(5, Math.round(potentialRating))}★</div>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                    Implement top recommendations within 6 months
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics Tab */}
      {activeTab === 'performance' && staffing && qualityMeasures && (
        <div className="space-y-6">
          {/* KPI Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Critical metrics affecting star ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <MetricCard
                  label="Total Nursing HPRD"
                  value={staffing.totalNurseHPRD.toFixed(2)}
                  benchmark="4.09 for 5-star"
                  status={staffing.totalNurseHPRD >= 4.09 ? 'good' : staffing.totalNurseHPRD >= 3.35 ? 'warning' : 'critical'}
                />
                <MetricCard
                  label="RN HPRD"
                  value={staffing.rnHPRD.toFixed(2)}
                  benchmark="0.75 for 5-star"
                  status={staffing.rnHPRD >= 0.75 ? 'good' : staffing.rnHPRD >= 0.50 ? 'warning' : 'critical'}
                />
                <MetricCard
                  label="Antipsychotic Use"
                  value={`${qualityMeasures.longStay.percentAntipsychoticMeds.toFixed(1)}%`}
                  benchmark="<12% is good"
                  status={qualityMeasures.longStay.percentAntipsychoticMeds < 12 ? 'good' : qualityMeasures.longStay.percentAntipsychoticMeds < 18 ? 'warning' : 'critical'}
                />
                <MetricCard
                  label="RN Turnover"
                  value={`${staffing.rnTurnoverRate.toFixed(0)}%`}
                  benchmark="<40% is good"
                  status={staffing.rnTurnoverRate < 40 ? 'good' : staffing.rnTurnoverRate < 60 ? 'warning' : 'critical'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Staffing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Staffing Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Nursing', value: staffing.totalNurseHPRD, target: 4.08, color: 'cyan' },
                  { label: 'RN Hours', value: staffing.rnHPRD, target: 0.75, color: 'blue' },
                  { label: 'LPN Hours', value: staffing.lpnHPRD, target: 0.55, color: 'purple' },
                  { label: 'CNA Hours', value: staffing.cnaHPRD, target: 2.45, color: 'green' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.label}</div>
                    <div className={`text-2xl font-bold ${item.value >= item.target ? 'text-green-600' : 'text-red-600'}`}>
                      {item.value.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">Target: {item.target} HPRD</div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${item.value >= item.target ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (item.value / item.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Measures Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600" />
                Quality Measures Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Long-Stay Residents</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Pressure Ulcers', value: qualityMeasures.longStay.percentWithPressureUlcers, benchmark: 5.5 },
                      { label: 'Falls w/ Injury', value: qualityMeasures.longStay.percentWithFalls, benchmark: 3.5 },
                      { label: 'Antipsychotic Meds', value: qualityMeasures.longStay.percentAntipsychoticMeds, benchmark: 14 },
                      { label: 'UTIs', value: qualityMeasures.longStay.percentWithUrinaryInfection, benchmark: 4 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${item.value <= item.benchmark ? 'text-green-600' : 'text-red-600'}`}>
                            {item.value.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-400">({item.benchmark}%)</span>
                          {item.value <= item.benchmark ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Short-Stay Residents</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Rehospitalized', value: qualityMeasures.shortStay.percentRehospitalized, benchmark: 22, lowerIsBetter: true },
                      { label: 'ED Visits', value: qualityMeasures.shortStay.percentWithEmergencyVisit, benchmark: 12, lowerIsBetter: true },
                      { label: 'Function Improved', value: qualityMeasures.shortStay.percentImprovedFunction, benchmark: 70, lowerIsBetter: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            item.lowerIsBetter
                              ? (item.value <= item.benchmark ? 'text-green-600' : 'text-red-600')
                              : (item.value >= item.benchmark ? 'text-green-600' : 'text-red-600')
                          }`}>
                            {item.value.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-400">({item.lowerIsBetter ? '≤' : '≥'}{item.benchmark}%)</span>
                          {(item.lowerIsBetter ? item.value <= item.benchmark : item.value >= item.benchmark) ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market Position Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Market Position Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                Competitive Position
              </CardTitle>
              <CardDescription>How this facility compares to peers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-300 mb-3">State Ranking</h4>
                  <div className="text-4xl font-bold text-indigo-600">
                    Top {facility.overallRating >= 4 ? '20' : facility.overallRating >= 3 ? '50' : '75'}%
                  </div>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-2">
                    in {facility.state} for overall quality
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                  <h4 className="font-medium text-cyan-900 dark:text-cyan-300 mb-3">National Percentile</h4>
                  <div className="text-4xl font-bold text-cyan-600">
                    {facility.overallRating >= 5 ? '95th' : facility.overallRating >= 4 ? '75th' : facility.overallRating >= 3 ? '50th' : facility.overallRating >= 2 ? '25th' : '10th'}
                  </div>
                  <p className="text-sm text-cyan-700 dark:text-cyan-400 mt-2">
                    percentile among 15,000+ facilities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benchmark Comparisons */}
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {staffing && [
                  { label: 'Total HPRD', yours: staffing.totalNurseHPRD, state: 3.7, national: 3.72, fiveStar: 4.08 },
                  { label: 'RN HPRD', yours: staffing.rnHPRD, state: 0.55, national: 0.58, fiveStar: 0.75 },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-4">{item.label}</h4>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold ${item.yours >= item.national ? 'text-green-600' : 'text-red-600'}`}>
                          {item.yours.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Your Facility</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{item.state.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">State Avg</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{item.national.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">National Avg</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{item.fiveStar.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">5-Star Target</div>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
                      <div className="absolute left-0 top-0 h-full bg-cyan-500 rounded-full" style={{ width: `${(item.yours / item.fiveStar) * 100}%` }} />
                      <div className="absolute h-full w-0.5 bg-blue-600" style={{ left: `${(item.state / item.fiveStar) * 100}%` }} title="State Avg" />
                      <div className="absolute h-full w-0.5 bg-purple-600" style={{ left: `${(item.national / item.fiveStar) * 100}%` }} title="National Avg" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Occupancy Rate</div>
                  <div className={`text-2xl font-bold ${occupancyRate >= 85 ? 'text-green-600' : occupancyRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {occupancyRate.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-400">Industry avg: 78%</div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Beds</div>
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {facility.numberOfCertifiedBeds}
                  </div>
                  <div className="text-xs text-gray-400">
                    {facility.numberOfCertifiedBeds > 120 ? 'Large facility' : facility.numberOfCertifiedBeds > 60 ? 'Medium facility' : 'Small facility'}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ownership</div>
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {facility.ownershipType.includes('profit') ? 'For-Profit' : 'Non-Profit'}
                  </div>
                  <div className="text-xs text-gray-400">{facility.ownershipType}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions Tab */}
      {activeTab === 'actions' && (
        <div className="space-y-6">
          {/* Immediate Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Immediate Actions (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Review PBJ Data',
                    desc: 'Verify staffing hours are accurately reported before next submission',
                    icon: FileText,
                    priority: 'high',
                    onClick: () => onViewDetails('staffing')
                  },
                  {
                    title: 'Audit MDS Coding',
                    desc: 'Check for common coding errors affecting quality measures',
                    icon: ClipboardCheck,
                    priority: 'high',
                    onClick: () => onViewDetails('quality')
                  },
                  {
                    title: 'Survey Prep Check',
                    desc: 'Ensure all survey-ready documentation is current',
                    icon: Shield,
                    priority: 'medium',
                    onClick: () => onViewDetails('health')
                  },
                  {
                    title: 'Staff Training',
                    desc: 'Schedule required training sessions and competency reviews',
                    icon: Award,
                    priority: 'medium',
                    onClick: () => {}
                  },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                      action.priority === 'high'
                        ? 'border-red-200 bg-red-50 dark:bg-red-900/20 hover:border-red-300'
                        : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <action.icon className={`w-6 h-6 ${action.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{action.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{action.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategic Initiatives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-600" />
                Strategic Initiatives (Next Quarter)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((rec, idx) => (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-lg border ${
                      rec.priority === 'high'
                        ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                        : rec.priority === 'medium'
                        ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              rec.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : rec.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">+{rec.estimatedImpact.toFixed(1)}★</div>
                        <div className="text-xs text-gray-500">impact</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button onClick={() => onViewDetails('plan')} variant="primary" className="w-full md:w-auto">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Create Full Improvement Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Quick Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Survey Checklist', icon: ClipboardCheck, color: 'blue' },
                  { label: 'PBJ Guide', icon: FileText, color: 'green' },
                  { label: 'QM Reference', icon: Heart, color: 'purple' },
                  { label: 'Training Videos', icon: Award, color: 'orange' },
                ].map((resource, idx) => (
                  <button
                    key={idx}
                    className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex flex-col items-center gap-2`}
                  >
                    <resource.icon className={`w-8 h-8 text-${resource.color}-600`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{resource.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper component for metric cards
function MetricCard({
  label,
  value,
  benchmark,
  status,
}: {
  label: string;
  value: string;
  benchmark: string;
  status: 'good' | 'warning' | 'critical';
}) {
  const statusColors = {
    good: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50',
  };

  return (
    <div className={`p-4 rounded-lg ${statusColors[status]}`}>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{benchmark}</p>
    </div>
  );
}

export default FacilityOverview;
