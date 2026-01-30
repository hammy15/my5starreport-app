/**
 * Facility Overview Component
 *
 * Displays the main dashboard for a selected facility,
 * showing all star ratings and key metrics.
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

      {/* Facility Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Facility Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{facility.providerName}</h1>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
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
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                  {facility.ownershipType}
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

            {/* Overall Rating */}
            <div className="text-center lg:text-right">
              <p className="text-sm font-medium text-gray-500 mb-2">Overall Rating</p>
              <StarRating rating={facility.overallRating} size="lg" showLabel />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts/Critical Issues */}
      {(highPriority > 0 || facility.isSpecialFocus || facility.abuseIcon) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Attention Required</h3>
                <ul className="mt-1 text-sm text-red-800 space-y-1">
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

      {/* Star Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Inspection Rating */}
        <Card hover onClick={() => onViewDetails('health')} className="cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
              </div>
              <StarRating rating={facility.healthInspectionRating} size="sm" />
            </div>
            <h3 className="font-semibold text-gray-900">Health Inspections</h3>
            <p className="text-sm text-gray-500 mt-1">
              Based on state survey results and deficiencies
            </p>
            <p className="text-xs text-blue-600 mt-3 font-medium">View details →</p>
          </CardContent>
        </Card>

        {/* Staffing Rating */}
        <Card hover onClick={() => onViewDetails('staffing')} className="cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <StarRating rating={facility.staffingRating} size="sm" />
            </div>
            <h3 className="font-semibold text-gray-900">Staffing</h3>
            <p className="text-sm text-gray-500 mt-1">
              {staffing ? `${staffing.totalNurseHPRD.toFixed(2)} total HPRD` : 'View staffing levels'}
            </p>
            <p className="text-xs text-green-600 mt-3 font-medium">View details →</p>
          </CardContent>
        </Card>

        {/* Quality Measures Rating */}
        <Card hover onClick={() => onViewDetails('quality')} className="cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <StarRating rating={facility.qualityMeasureRating} size="sm" />
            </div>
            <h3 className="font-semibold text-gray-900">Quality Measures</h3>
            <p className="text-sm text-gray-500 mt-1">
              Clinical outcome indicators
            </p>
            <p className="text-xs text-purple-600 mt-3 font-medium">View details →</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Summary */}
      {staffing && qualityMeasures && (
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
      )}

      {/* Improvement Opportunities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Improvement Opportunities
            </CardTitle>
            <CardDescription>
              {recommendations.length} recommendations identified
            </CardDescription>
          </div>
          <Button onClick={() => onViewDetails('plan')} variant="primary">
            Build Improvement Plan
          </Button>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'high'
                      ? 'border-red-200 bg-red-50'
                      : rec.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {rec.category.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mt-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-500">Est. Impact</p>
                      <p className="font-medium text-green-600">+{rec.estimatedImpact.toFixed(1)} star</p>
                    </div>
                  </div>
                </div>
              ))}

              {recommendations.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  + {recommendations.length - 5} more recommendations
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              This facility is performing well. Consider maintenance strategies.
            </p>
          )}
        </CardContent>
      </Card>
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
