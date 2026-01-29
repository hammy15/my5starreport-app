/**
 * Plan Builder Component
 *
 * Allows users to create improvement plans by selecting recommendations
 * and setting action items with due dates.
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

export function PlanBuilder({ facility, recommendations, onSavePlan }: PlanBuilderProps) {
  const [selectedRecs, setSelectedRecs] = useState<Set<string>>(new Set());
  const [expandedRecs, setExpandedRecs] = useState<Set<string>>(new Set());
  const [planName, setPlanName] = useState(`${facility.providerName} Improvement Plan`);
  const [targetRating, setTargetRating] = useState(Math.min(5, facility.overallRating + 1));

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Rating
            </label>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setTargetRating(rating)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    targetRating === rating
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {rating} ★
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current vs. Projected Rating</span>
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

      {/* Recommendations by Category */}
      {Object.entries(groupedRecs).map(([category, recs]) => {
        if (recs.length === 0) return null;

        const categoryLabels: Record<string, string> = {
          health_inspection: 'Health Inspection Improvements',
          staffing: 'Staffing Improvements',
          quality_measures: 'Quality Measure Improvements',
        };

        const categoryColors: Record<string, string> = {
          health_inspection: 'blue',
          staffing: 'green',
          quality_measures: 'purple',
        };

        const color = categoryColors[category];

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                {categoryLabels[category]}
              </CardTitle>
              <CardDescription>
                {recs.length} recommendation{recs.length > 1 ? 's' : ''} identified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
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
