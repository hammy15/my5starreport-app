/**
 * Staffing Details Component
 *
 * Shows detailed breakdown of staffing data from PBJ (Payroll-Based Journal).
 * Explains how staffing affects star ratings.
 */

'use client';

import {
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { StaffingData } from '@/types/facility';

// CMS thresholds for reference
const THRESHOLDS = {
  totalHPRD: { 5: 4.09, 4: 3.88, 3: 3.35, 2: 2.82 },
  rnHPRD: { 5: 0.75, 4: 0.55, 3: 0.50, 2: 0.48 },
};

interface StaffingDetailsProps {
  staffing: StaffingData;
  currentRating: number;
}

export function StaffingDetails({ staffing, currentRating }: StaffingDetailsProps) {
  // Prepare chart data
  const hprdData = [
    {
      name: 'Total HPRD',
      value: staffing.totalNurseHPRD,
      target: THRESHOLDS.totalHPRD[5],
      color: staffing.totalNurseHPRD >= THRESHOLDS.totalHPRD[5] ? '#22c55e' : staffing.totalNurseHPRD >= THRESHOLDS.totalHPRD[3] ? '#eab308' : '#ef4444',
    },
    {
      name: 'RN HPRD',
      value: staffing.rnHPRD,
      target: THRESHOLDS.rnHPRD[5],
      color: staffing.rnHPRD >= THRESHOLDS.rnHPRD[5] ? '#22c55e' : staffing.rnHPRD >= THRESHOLDS.rnHPRD[3] ? '#eab308' : '#ef4444',
    },
    {
      name: 'LPN HPRD',
      value: staffing.lpnHPRD,
      target: 0.75, // Typical target
      color: '#3b82f6',
    },
    {
      name: 'CNA HPRD',
      value: staffing.cnaHPRD,
      target: 2.25, // Typical target
      color: '#8b5cf6',
    },
  ];

  // Calculate gap to next star
  const totalGap = getGapToNextStar(staffing.totalNurseHPRD, THRESHOLDS.totalHPRD);
  const rnGap = getGapToNextStar(staffing.rnHPRD, THRESHOLDS.rnHPRD);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Total Nursing HPRD"
          value={staffing.totalNurseHPRD.toFixed(2)}
          subtext={`Target for 5★: ${THRESHOLDS.totalHPRD[5]}`}
          trend={staffing.totalNurseHPRD >= staffing.stateAvgTotalHPRD ? 'up' : 'down'}
          trendText={`${staffing.totalNurseHPRD >= staffing.stateAvgTotalHPRD ? 'Above' : 'Below'} state avg`}
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="RN Hours/Day"
          value={staffing.rnHPRD.toFixed(2)}
          subtext={`Target for 5★: ${THRESHOLDS.rnHPRD[5]}`}
          trend={staffing.rnHPRD >= THRESHOLDS.rnHPRD[3] ? 'up' : 'down'}
        />
        <MetricCard
          icon={<Calendar className="w-5 h-5" />}
          label="Weekend HPRD"
          value={staffing.weekendTotalNurseHPRD.toFixed(2)}
          subtext={`Weekday: ${staffing.totalNurseHPRD.toFixed(2)}`}
          trend={staffing.weekendTotalNurseHPRD >= staffing.totalNurseHPRD * 0.9 ? 'up' : 'down'}
          trendText={staffing.weekendTotalNurseHPRD >= staffing.totalNurseHPRD * 0.9 ? 'Good coverage' : 'Needs attention'}
        />
        <MetricCard
          icon={<TrendingDown className="w-5 h-5" />}
          label="RN Turnover"
          value={`${staffing.rnTurnoverRate.toFixed(0)}%`}
          subtext="Annual turnover rate"
          trend={staffing.rnTurnoverRate <= 40 ? 'up' : 'down'}
          trendText={staffing.rnTurnoverRate <= 40 ? 'Healthy' : 'High turnover'}
        />
      </div>

      {/* HPRD Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Hours Per Resident Day (HPRD) Breakdown</CardTitle>
          <CardDescription>
            HPRD measures how many hours of nursing care each resident receives daily
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hprdData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 'auto']} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip
                  formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {hprdData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Star Rating Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Staffing Star Ratings</CardTitle>
          <CardDescription>
            CMS uses these HPRD thresholds to calculate staffing ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total HPRD Thresholds */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Total Nursing HPRD Thresholds</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const threshold = THRESHOLDS.totalHPRD[star as keyof typeof THRESHOLDS.totalHPRD];
                  const isCurrent = staffing.totalNurseHPRD >= (threshold || 0) &&
                    (star === 5 || staffing.totalNurseHPRD < THRESHOLDS.totalHPRD[(star + 1) as keyof typeof THRESHOLDS.totalHPRD]);

                  return (
                    <div
                      key={star}
                      className={`flex items-center justify-between p-2 rounded ${
                        isCurrent ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {'★'.repeat(star)}{'☆'.repeat(5 - star)}
                        {isCurrent && <span className="text-xs text-blue-600 font-medium">Current</span>}
                      </span>
                      <span className="font-mono text-sm">
                        {threshold ? `≥ ${threshold}` : '< 2.82'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RN HPRD Thresholds */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">RN HPRD Thresholds</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const threshold = THRESHOLDS.rnHPRD[star as keyof typeof THRESHOLDS.rnHPRD];
                  const isCurrent = staffing.rnHPRD >= (threshold || 0) &&
                    (star === 5 || staffing.rnHPRD < THRESHOLDS.rnHPRD[(star + 1) as keyof typeof THRESHOLDS.rnHPRD]);

                  return (
                    <div
                      key={star}
                      className={`flex items-center justify-between p-2 rounded ${
                        isCurrent ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {'★'.repeat(star)}{'☆'.repeat(5 - star)}
                        {isCurrent && <span className="text-xs text-blue-600 font-medium">Current</span>}
                      </span>
                      <span className="font-mono text-sm">
                        {threshold ? `≥ ${threshold}` : '< 0.48'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Path */}
      {(totalGap || rnGap) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Path to Next Star Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {totalGap && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Increase Total HPRD by {totalGap.gap.toFixed(2)} hours
                    </p>
                    <p className="text-sm text-gray-600">
                      Reach {totalGap.threshold.toFixed(2)} HPRD to achieve {totalGap.starLevel}★ in total staffing
                    </p>
                  </div>
                </div>
              )}
              {rnGap && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Increase RN HPRD by {rnGap.gap.toFixed(2)} hours
                    </p>
                    <p className="text-sm text-gray-600">
                      Reach {rnGap.threshold.toFixed(2)} RN HPRD to achieve {rnGap.starLevel}★ in RN staffing
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Turnover Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Turnover Analysis</CardTitle>
          <CardDescription>
            High turnover impacts quality and increases costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TurnoverCard
              label="RN Turnover"
              value={staffing.rnTurnoverRate}
              benchmark={40}
            />
            <TurnoverCard
              label="Total Nurse Turnover"
              value={staffing.totalNurseTurnoverRate}
              benchmark={50}
            />
            <TurnoverCard
              label="Administrator Turnover"
              value={staffing.adminTurnoverRate}
              benchmark={20}
            />
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Understanding Staffing Ratings</h4>
          <div className="prose prose-sm text-gray-600">
            <p className="mb-3">
              <strong>HPRD (Hours Per Resident Day)</strong> measures the average hours of nursing care
              each resident receives daily. It&apos;s calculated by dividing total nursing hours by the number
              of residents.
            </p>
            <p className="mb-3">
              <strong>Case-Mix Adjustment:</strong> CMS adjusts staffing ratings based on resident acuity.
              Facilities with sicker residents need more staff to achieve the same rating.
            </p>
            <p>
              <strong>Weekend Staffing:</strong> CMS now evaluates weekend staffing separately. Lower weekend
              staffing can negatively impact your rating even if weekday staffing is strong.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components
function MetricCard({
  icon,
  label,
  value,
  subtext,
  trend,
  trendText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down';
  trendText?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">{icon}</div>
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        {trend && trendText && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {trendText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function TurnoverCard({
  label,
  value,
  benchmark,
}: {
  label: string;
  value: number;
  benchmark: number;
}) {
  const isGood = value <= benchmark;

  return (
    <div className={`p-4 rounded-lg ${isGood ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${isGood ? 'text-green-600' : 'text-red-600'}`}>
        {value.toFixed(0)}%
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {isGood ? `✓ Below ${benchmark}% benchmark` : `↑ Above ${benchmark}% benchmark`}
      </p>
    </div>
  );
}

function getGapToNextStar(
  currentValue: number,
  thresholds: Record<number, number>
): { gap: number; threshold: number; starLevel: number } | null {
  for (let star = 5; star >= 2; star--) {
    const threshold = thresholds[star];
    if (currentValue < threshold) {
      return {
        gap: threshold - currentValue,
        threshold,
        starLevel: star,
      };
    }
  }
  return null;
}

export default StaffingDetails;
