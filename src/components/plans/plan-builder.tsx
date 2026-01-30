/**
 * Plan Builder Component
 *
 * Allows users to create improvement plans by selecting recommendations
 * and setting action items with due dates. Includes narrative guidance
 * and facility summaries.
 */

'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Save,
  FileText,
  Target,
  AlertTriangle,
  Star,
  Building2,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StarRating, StarRatingComparison } from '@/components/ui/star-rating';
import type { ImprovementRecommendation, Facility, ActionPlan, ActionPlanItem } from '@/types/facility';

interface PlanBuilderProps {
  facility: Facility;
  recommendations: ImprovementRecommendation[];
  onSavePlan: (plan: Partial<ActionPlan>) => void;
}

// Category narratives for improvement guidance
const CATEGORY_NARRATIVES: Record<string, {
  overview: string;
  importance: string;
  quickWins: string[];
  longTermStrategies: string[];
}> = {
  health_inspection: {
    overview: 'Health inspection ratings are based on the last three years of standard surveys, complaint investigations, and revisit surveys. This is the foundation of your overall rating and carries the most weight.',
    importance: 'Health inspections directly reflect quality of care delivery. Deficiencies at level G or higher indicate actual harm to residents and significantly impact your rating. The severity and scope of deficiencies, not just the count, determine your score.',
    quickWins: [
      'Conduct daily leadership rounds to observe care delivery firsthand',
      'Implement real-time documentation audits for accuracy',
      'Review and address any open grievances or complaints immediately',
      'Ensure all call lights are answered within 5 minutes',
    ],
    longTermStrategies: [
      'Establish a QAPI committee that meets monthly with accountability',
      'Create a culture of continuous survey readiness, not just survey prep',
      'Invest in staff training on high-risk F-Tags',
      'Develop relationships with state surveyors - transparency builds trust',
    ],
  },
  staffing: {
    overview: 'Staffing ratings are calculated from Payroll-Based Journal (PBJ) data submitted quarterly. CMS evaluates total nursing hours per resident day (HPRD), with specific thresholds for RN hours. Weekend staffing is evaluated separately.',
    importance: 'Adequate staffing is the foundation of quality care. Research shows strong correlation between nursing hours and resident outcomes. Low staffing leads to higher fall rates, pressure ulcers, and poor satisfaction. Staffing also directly affects your other ratings.',
    quickWins: [
      'Audit PBJ submissions for accuracy - ensure all hours are captured',
      'Implement weekend differential pay to improve weekend coverage',
      'Use agency staff strategically to fill gaps while recruiting',
      'Review scheduling efficiency to maximize coverage during peak hours',
    ],
    longTermStrategies: [
      'Build a recruitment pipeline with local nursing schools',
      'Focus on retention through competitive pay, benefits, and culture',
      'Develop career ladders to keep talented staff',
      'Address burnout and turnover root causes',
    ],
  },
  quality_measures: {
    overview: 'Quality Measures (QMs) are derived from MDS assessments and reflect clinical outcomes for residents. They are updated quarterly and compare your facility to state and national benchmarks.',
    importance: 'QMs are publicly reported and directly influence consumer choice. Families use these measures when selecting facilities. Many QMs also correlate with reimbursement through value-based purchasing programs.',
    quickWins: [
      'Implement catheter removal protocols - easy QM improvement',
      'Ensure all vaccinations are documented properly',
      'Review antipsychotic medications with consultant pharmacist',
      'Improve MDS coding accuracy to reflect true outcomes',
    ],
    longTermStrategies: [
      'Develop condition-specific care protocols (falls, pressure ulcers, etc.)',
      'Invest in staff education on clinical best practices',
      'Implement INTERACT or similar early warning systems',
      'Create a culture of continuous quality improvement',
    ],
  },
};

// Generate facility narrative summary
function generateFacilitySummary(facility: Facility): {
  summary: string;
  strengths: string[];
  challenges: string[];
  priorityFocus: string;
} {
  const strengths: string[] = [];
  const challenges: string[] = [];

  // Analyze each rating component
  if (facility.healthInspectionRating >= 4) {
    strengths.push('Strong health inspection performance indicates good compliance and care delivery');
  } else if (facility.healthInspectionRating <= 2) {
    challenges.push('Health inspection rating requires immediate attention - focus on survey readiness');
  }

  if (facility.staffingRating >= 4) {
    strengths.push('Staffing levels exceed CMS thresholds');
  } else if (facility.staffingRating <= 2) {
    challenges.push('Staffing levels are below optimal - recruitment and retention should be priorities');
  }

  if (facility.qualityMeasureRating >= 4) {
    strengths.push('Clinical outcomes compare favorably to benchmarks');
  } else if (facility.qualityMeasureRating <= 2) {
    challenges.push('Quality measures need improvement - review clinical protocols and MDS accuracy');
  }

  // Determine priority focus
  let priorityFocus = 'Maintain current performance across all domains';
  if (facility.healthInspectionRating <= 2) {
    priorityFocus = 'Immediate focus on health inspection readiness - this is the foundation of your rating';
  } else if (facility.staffingRating <= 2) {
    priorityFocus = 'Staffing is your limiting factor - invest in recruitment and retention';
  } else if (facility.qualityMeasureRating <= 2) {
    priorityFocus = 'Clinical quality improvement should be your priority';
  }

  // Generate summary
  const summary = `${facility.providerName} is a ${facility.numberOfCertifiedBeds}-bed ${facility.ownershipType?.toLowerCase() || ''} facility located in ${facility.cityTown}, ${facility.state}. ` +
    `Currently rated ${facility.overallRating} stars overall, the facility has a ${facility.healthInspectionRating}-star health inspection rating, ` +
    `${facility.staffingRating}-star staffing rating, and ${facility.qualityMeasureRating}-star quality measures rating. ` +
    (facility.isSpecialFocus ? 'The facility is currently on the Special Focus Facility list, requiring intensive improvement efforts. ' : '') +
    (facility.totalFines ? `The facility has incurred $${facility.totalFines.toLocaleString()} in fines. ` : '');

  return { summary, strengths, challenges, priorityFocus };
}

export function PlanBuilder({ facility, recommendations, onSavePlan }: PlanBuilderProps) {
  const [selectedRecs, setSelectedRecs] = useState<Set<string>>(new Set());
  const [expandedRecs, setExpandedRecs] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['health_inspection', 'staffing', 'quality_measures']));
  const [planName, setPlanName] = useState(`${facility.providerName} Improvement Plan`);
  const [targetRating, setTargetRating] = useState(Math.min(5, facility.overallRating + 1));

  // Generate facility summary
  const facilitySummary = generateFacilitySummary(facility);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Toggle recommendation selection
  const toggleSelection = (recId: string) => {
    const newSelected = new Set(selectedRecs);
    if (newSelected.has(recId)) {
      newSelected.delete(recId);
    } else {
      newSelected.add(recId);
    }
    setSelectedRecs(newSelected);
  };

  // Toggle expanded state
  const toggleExpanded = (recId: string) => {
    const newExpanded = new Set(expandedRecs);
    if (newExpanded.has(recId)) {
      newExpanded.delete(recId);
    } else {
      newExpanded.add(recId);
    }
    setExpandedRecs(newExpanded);
  };

  // Calculate potential improvement
  const selectedRecommendations = recommendations.filter(r => selectedRecs.has(r.id));
  const totalImpact = selectedRecommendations.reduce((sum, r) => sum + r.estimatedImpact, 0);
  const potentialRating = Math.min(5, facility.overallRating + Math.round(totalImpact * 0.5));

  // Group recommendations by category
  const groupedRecs = {
    health_inspection: recommendations.filter(r => r.category === 'health_inspection'),
    staffing: recommendations.filter(r => r.category === 'staffing'),
    quality_measures: recommendations.filter(r => r.category === 'quality_measures'),
  };

  // Handle save plan
  const handleSavePlan = () => {
    const planItems: ActionPlanItem[] = selectedRecommendations.flatMap(rec =>
      rec.actionSteps.map((step, index) => ({
        id: `${rec.id}-step-${index}`,
        recommendationId: rec.id,
        title: step,
        description: `Action step for: ${rec.title}`,
        dueDate: getDefaultDueDate(rec.timeframe, index),
        status: 'pending' as const,
        notes: '',
      }))
    );

    const plan: Partial<ActionPlan> = {
      facilityId: facility.federalProviderNumber,
      name: planName,
      description: `Improvement plan targeting ${targetRating}-star rating`,
      targetRating,
      currentRating: facility.overallRating,
      status: 'draft',
      items: planItems,
    };

    onSavePlan(plan);
  };

  return (
    <div className="space-y-6">
      {/* Facility Summary */}
      <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-600" />
            Facility Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">{facilitySummary.summary}</p>

          {facilitySummary.strengths.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Strengths
              </h4>
              <ul className="space-y-1">
                {facilitySummary.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-6">• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {facilitySummary.challenges.length > 0 && (
            <div>
              <h4 className="font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Challenges
              </h4>
              <ul className="space-y-1">
                {facilitySummary.challenges.map((c, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-6">• {c}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h4 className="font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Target className="w-4 h-4" /> Priority Focus
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">{facilitySummary.priorityFocus}</p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Build Improvement Plan
          </CardTitle>
          <CardDescription>
            Select recommendations to include in your action plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Plan Name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="Enter plan name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Rating
            </label>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setTargetRating(rating)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    targetRating === rating
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {rating} ★
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current vs. Projected Rating</span>
              <StarRatingComparison current={facility.overallRating} potential={potentialRating} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                {selectedRecs.size} of {recommendations.length} recommendations selected
              </p>
              <p className="text-sm text-blue-700">
                Estimated impact: +{(totalImpact * 0.5).toFixed(1)} star improvement potential
              </p>
            </div>
            <Button
              onClick={handleSavePlan}
              disabled={selectedRecs.size === 0}
              icon={<Save className="w-4 h-4" />}
            >
              Save Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations by Category with Narratives */}
      {Object.entries(groupedRecs).map(([category, recs]) => {
        const categoryLabels: Record<string, string> = {
          health_inspection: 'Health Inspection Improvements',
          staffing: 'Staffing Improvements',
          quality_measures: 'Quality Measure Improvements',
        };

        const categoryColors: Record<string, string> = {
          health_inspection: 'border-blue-200 dark:border-blue-800',
          staffing: 'border-green-200 dark:border-green-800',
          quality_measures: 'border-purple-200 dark:border-purple-800',
        };

        const categoryBgColors: Record<string, string> = {
          health_inspection: 'bg-blue-500',
          staffing: 'bg-green-500',
          quality_measures: 'bg-purple-500',
        };

        const narrative = CATEGORY_NARRATIVES[category];
        const isExpanded = expandedCategories.has(category);

        return (
          <Card key={category} className={categoryColors[category]}>
            <div
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className={`w-3 h-3 rounded-full ${categoryBgColors[category]}`} />
                    {categoryLabels[category]}
                  </CardTitle>
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
                <CardDescription>
                  {recs.length} recommendation{recs.length > 1 ? 's' : ''} identified
                </CardDescription>
              </CardHeader>
            </div>

            {isExpanded && (
              <CardContent className="space-y-4">
                {/* Category Narrative Guidance */}
                {narrative && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4" /> Overview
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{narrative.overview}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4" /> Why It Matters
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{narrative.importance}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h5 className="font-medium text-green-700 dark:text-green-400 text-sm mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" /> Quick Wins
                        </h5>
                        <ul className="space-y-1">
                          {narrative.quickWins.map((win, i) => (
                            <li key={i} className="text-xs text-green-600 dark:text-green-300">• {win}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="font-medium text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-1">
                          <Target className="w-4 h-4" /> Long-Term Strategies
                        </h5>
                        <ul className="space-y-1">
                          {narrative.longTermStrategies.map((strategy, i) => (
                            <li key={i} className="text-xs text-blue-600 dark:text-blue-300">• {strategy}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {recs.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Specific Recommendations</h4>
                    {recs.map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        isSelected={selectedRecs.has(rec.id)}
                        isExpanded={expandedRecs.has(rec.id)}
                        onToggleSelect={() => toggleSelection(rec.id)}
                        onToggleExpand={() => toggleExpanded(rec.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p>No specific recommendations in this category - great job!</p>
                    <p className="text-sm">Continue following the best practices above to maintain excellence.</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Quick Actions */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const highPriority = recommendations.filter(r => r.priority === 'high');
                setSelectedRecs(new Set(highPriority.map(r => r.id)));
              }}
            >
              Select All High Priority
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const lowCost = recommendations.filter(r => r.estimatedCost === 'low');
                setSelectedRecs(new Set(lowCost.map(r => r.id)));
              }}
            >
              Select Low Cost Options
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const immediate = recommendations.filter(r => r.timeframe === 'immediate');
                setSelectedRecs(new Set(immediate.map(r => r.id)));
              }}
            >
              Select Quick Wins
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRecs(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Recommendation Card Component
function RecommendationCard({
  recommendation,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand,
}: {
  recommendation: ImprovementRecommendation;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
}) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const costIcons = {
    low: <DollarSign className="w-4 h-4 text-green-500" />,
    medium: <><DollarSign className="w-4 h-4 text-yellow-500" /><DollarSign className="w-4 h-4 text-yellow-500" /></>,
    high: <><DollarSign className="w-4 h-4 text-red-500" /><DollarSign className="w-4 h-4 text-red-500" /><DollarSign className="w-4 h-4 text-red-500" /></>,
  };

  const timeframeLabels = {
    immediate: 'Immediate',
    short_term: '1-3 months',
    long_term: '3-12 months',
  };

  return (
    <div
      className={`border rounded-lg transition-all ${
        isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Selection Checkbox */}
          <button
            onClick={onToggleSelect}
            className="mt-0.5 flex-shrink-0"
          >
            {isSelected ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[recommendation.priority]}`}>
                {recommendation.priority.toUpperCase()}
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {timeframeLabels[recommendation.timeframe]}
              </span>
              <span className="flex items-center text-xs text-gray-500">
                {costIcons[recommendation.estimatedCost]}
              </span>
            </div>

            <h4 className="font-medium text-gray-900 mt-2">{recommendation.title}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recommendation.description}</p>

            {/* Metrics */}
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-gray-500">
                Current: <strong>{recommendation.currentValue.toFixed(1)}</strong>
              </span>
              <span className="text-gray-500">
                Target: <strong>{recommendation.targetValue.toFixed(1)}</strong>
              </span>
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{recommendation.estimatedImpact.toFixed(1)} star potential
              </span>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={onToggleExpand}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Action Steps:</h5>
          <ol className="space-y-2">
            {recommendation.actionSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate default due dates
function getDefaultDueDate(timeframe: string, stepIndex: number): string {
  const now = new Date();
  let daysToAdd = 0;

  switch (timeframe) {
    case 'immediate':
      daysToAdd = 7 + (stepIndex * 3);
      break;
    case 'short_term':
      daysToAdd = 30 + (stepIndex * 14);
      break;
    case 'long_term':
      daysToAdd = 90 + (stepIndex * 30);
      break;
    default:
      daysToAdd = 30 + (stepIndex * 7);
  }

  const dueDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return dueDate.toISOString().split('T')[0];
}

export default PlanBuilder;
