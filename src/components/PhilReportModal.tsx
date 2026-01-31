'use client';

import { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ExternalLink,
  FileText,
  Star,
  Building2,
  Users,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PhilReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    response: string;
    recommendations: Array<{
      action: string;
      impact: string;
      cost: string;
      timeline: string;
      priority: string;
    }>;
    metrics?: {
      nationalAvg?: Record<string, number>;
      stateAvg?: Record<string, number>;
      nationalFacilityCount?: number;
      stateFacilityCount?: number;
    };
    facilityData?: {
      name: string;
      city: string;
      state: string;
      ccn: string;
      beds: number;
      overallRating: number;
      healthRating: number;
      staffingRating: number;
      qmRating: number;
      nursingHoursPerResidentDay?: number;
      rnHoursPerResidentDay?: number;
      totalNurseTurnover?: number;
      totalFines?: number;
      citations?: number;
    };
    gammaPrompt?: string;
    query: string;
    timestamp: string;
  };
}

export function PhilReportModal({ isOpen, onClose, data }: PhilReportModalProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'ratings', 'recommendations', 'executive', 'domains', 'benchmarks', 'roadmap', 'investment']));

  if (!isOpen) return null;

  const facility = data.facilityData;
  const metrics = data.metrics;
  const recommendations = data.recommendations || [];

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const facilityName = facility?.name || 'Quality Improvement';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Generate comprehensive 350+ word narrative
    const generateNarrative = () => {
      const natCount = metrics?.nationalFacilityCount?.toLocaleString() || '14,000+';
      const natAvg = metrics?.nationalAvg?.avg_overall || '2.96';

      if (!facility) {
        return `This comprehensive quality improvement report provides strategic guidance for skilled nursing facilities seeking to enhance their CMS Five-Star Quality Rating System performance. The analysis is based on current data from ${natCount} Medicare and Medicaid-certified nursing homes nationwide, incorporating evidence-based improvement strategies that have proven effective across diverse facility types and sizes.

The CMS Five-Star Quality Rating System serves as the primary benchmark for evaluating nursing home quality in the United States. This system assesses facilities across three critical domains: Health Inspections, which examines survey deficiency history and the severity of cited violations; Staffing, which evaluates nurse staffing levels based on Payroll-Based Journal (PBJ) data submissions; and Quality Measures, which tracks clinical outcomes derived from Minimum Data Set (MDS) assessments. Each domain contributes to the overall star rating, with Health Inspections weighted most heavily in the calculation methodology.

Understanding the interrelationship between these three domains is essential for developing an effective improvement strategy. Facilities that achieve consistent 4 and 5-star ratings typically demonstrate strong performance across all three areas, with particular attention to maintaining adequate RN staffing levels (minimum 0.55 HPRD for 5-star) and total nursing hours (minimum 4.08 HPRD for 5-star). Research indicates that higher staffing levels correlate directly with improved quality measure outcomes and reduced deficiency citations.

This report outlines a systematic 90-day improvement roadmap designed to produce measurable results within the first survey cycle. The prioritized recommendations include specific action items, cost-benefit analysis, and expected return on investment calculations. Implementation of these evidence-based strategies typically yields visible improvements within 60-90 days, with sustained gains achievable through consistent execution and ongoing monitoring systems.

The financial implications of star rating improvements are substantial. A one-star increase typically generates $100,000 to $500,000 in annual value for a 100-bed facility through increased occupancy, improved payer mix, reduced regulatory burden, and enhanced community reputation. Facilities achieving 4 or 5-star ratings experience occupancy rates 5-15% higher than lower-rated competitors.`;
      }

      const overallAssess = facility.overallRating >= 4 ? 'performing above the national average' : facility.overallRating >= 3 ? 'performing at the national average' : 'positioned below the national average and requiring focused improvement efforts';
      const healthAssess = facility.healthRating <= 2 ? 'indicates significant compliance concerns requiring immediate attention' : facility.healthRating >= 4 ? 'demonstrates strong survey readiness and compliance protocols' : 'suggests moderate compliance with targeted improvement opportunities';
      const staffGap = facility.nursingHoursPerResidentDay ? Math.max(0, 4.08 - facility.nursingHoursPerResidentDay).toFixed(2) : '0';
      const rnGap = facility.rnHoursPerResidentDay ? Math.max(0, 0.55 - facility.rnHoursPerResidentDay).toFixed(2) : '0';

      return `This comprehensive quality improvement analysis has been prepared for ${facility.name}, located in ${facility.city}, ${facility.state}. The facility currently maintains an overall CMS Five-Star rating of ${facility.overallRating} stars, ${overallAssess} of ${natAvg} stars across ${natCount} Medicare-certified nursing homes. This report provides a detailed assessment of current performance, identifies specific improvement opportunities, and outlines a strategic 90-day implementation roadmap.

<strong>Current Performance Analysis</strong>

The Health Inspection rating of ${facility.healthRating} stars ${healthAssess}. Health Inspections carry the heaviest weight in the overall star calculation, making this domain critical for overall rating improvement. ${facility.healthRating <= 3 ? 'Implementing robust survey readiness protocols, conducting regular mock surveys, and addressing root causes of previous citations should be immediate priorities.' : 'Maintaining current compliance programs while continuously improving documentation and care processes will help sustain this strong performance.'}

The Staffing rating of ${facility.staffingRating} stars reflects current nurse staffing levels as reported through Payroll-Based Journal (PBJ) data. Current total nursing HPRD stands at ${facility.nursingHoursPerResidentDay?.toFixed(2) || 'N/A'} hours, ${Number(staffGap) > 0 ? `which is ${staffGap} hours below the 5-star threshold of 4.08 HPRD` : 'meeting or exceeding the 5-star threshold'}. RN-specific hours of ${facility.rnHoursPerResidentDay?.toFixed(2) || 'N/A'} HPRD ${Number(rnGap) > 0 ? `require an increase of ${rnGap} hours to achieve 5-star status (threshold: 0.55 HPRD)` : 'meet 5-star requirements'}. Nurse turnover currently stands at ${facility.totalNurseTurnover?.toFixed(0) || 'N/A'}%, ${(facility.totalNurseTurnover || 0) > 40 ? 'which exceeds industry benchmarks and negatively impacts both staffing stability and quality outcomes' : 'which is within acceptable industry benchmarks'}.

The Quality Measures rating of ${facility.qmRating} stars reflects clinical outcomes derived from MDS assessments across multiple indicators including falls, pressure ulcers, antipsychotic medication use, and rehospitalization rates. ${facility.qmRating <= 3 ? 'Focused clinical interventions targeting the lowest-performing measures can yield significant improvements within 60-90 days.' : 'Continued vigilance in maintaining strong clinical outcomes through evidence-based care protocols is recommended.'}

${facility.totalFines && facility.totalFines > 0 ? `<strong>Enforcement History:</strong> The facility has incurred $${facility.totalFines.toLocaleString()} in civil monetary penalties. Addressing the root causes of cited deficiencies is critical to avoiding future enforcement actions and protecting the facility's Medicare and Medicaid certification status.` : ''}

<strong>Strategic Improvement Path</strong>

Based on this comprehensive analysis, ${facility.name} should prioritize the following strategic initiatives: First, ${facility.healthRating <= 3 ? 'implement intensive survey readiness protocols including weekly mock surveys and F-tag competency training' : 'maintain current compliance excellence while focusing on continuous improvement'}. Second, ${facility.staffingRating <= 3 ? 'optimize staffing through PBJ data auditing, scheduling efficiency improvements, and retention program development' : 'sustain current staffing levels while reducing turnover through engagement initiatives'}. Third, ${facility.qmRating <= 3 ? 'deploy targeted quality measure interventions focusing on the highest-impact clinical indicators' : 'continue evidence-based clinical protocols that have produced strong outcomes'}.

The following sections detail specific action items with associated costs, expected impact, implementation timelines, and a visual process flowchart for achieving measurable star rating improvements.`;
    };

    // Calculate progress bar percentages
    const hprdProgress = facility ? Math.min(100, ((facility.nursingHoursPerResidentDay || 0) / 4.08) * 100) : 0;
    const rnProgress = facility ? Math.min(100, ((facility.rnHoursPerResidentDay || 0) / 0.55) * 100) : 0;
    const turnoverProgress = facility ? Math.max(0, 100 - ((facility.totalNurseTurnover || 0) / 60) * 100) : 50;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>5-Star Quality Report - ${facilityName}</title>
  <style>
    @page { size: letter portrait; margin: 0.5in; }
    @media print { .no-print { display: none !important; } body { padding: 0; } .page-break { page-break-before: always; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', -apple-system, sans-serif; font-size: 10px; color: #1e293b; line-height: 1.5; padding: 15px; background: #fff; }
    .toolbar { position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, #0891b2, #0e7490); padding: 8px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 100; }
    .toolbar h1 { color: white; font-size: 14px; }
    .toolbar-btns { display: flex; gap: 8px; }
    .toolbar button { background: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 11px; }
    .content { margin-top: 45px; }

    /* Header */
    .header { text-align: center; border-bottom: 3px solid #0891b2; padding-bottom: 10px; margin-bottom: 15px; }
    .header h2 { color: #0891b2; font-size: 20px; margin-bottom: 2px; }
    .header .sub { color: #64748b; font-size: 11px; }

    /* Star Display */
    .star-banner { display: flex; justify-content: center; gap: 30px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .star-box { text-align: center; }
    .star-box .value { font-size: 36px; font-weight: 700; color: #0891b2; }
    .star-box .value span { color: #fbbf24; }
    .star-box .label { font-size: 10px; color: #64748b; font-weight: 500; }

    /* Narrative */
    .narrative { background: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; text-align: justify; line-height: 1.6; }
    .narrative strong { color: #0891b2; }

    /* Progress Bars */
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
    .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .metric-title { font-weight: 600; color: #0891b2; margin-bottom: 8px; font-size: 11px; }
    .progress-item { margin-bottom: 10px; }
    .progress-label { display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 3px; }
    .progress-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .progress-fill.green { background: linear-gradient(90deg, #10b981, #059669); }
    .progress-fill.yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .progress-fill.red { background: linear-gradient(90deg, #ef4444, #dc2626); }

    /* Flowchart */
    .flowchart { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .flowchart-title { font-weight: 600; color: #0891b2; margin-bottom: 12px; font-size: 12px; text-align: center; }
    .flow-steps { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 5px; }
    .flow-step { background: linear-gradient(135deg, #0891b2, #0e7490); color: white; padding: 8px 12px; border-radius: 6px; font-size: 9px; font-weight: 500; text-align: center; min-width: 80px; }
    .flow-arrow { color: #0891b2; font-size: 16px; font-weight: bold; }
    .flow-row { display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 8px; width: 100%; }

    /* Tables */
    .section { margin-bottom: 15px; }
    .section-title { background: linear-gradient(135deg, #0891b2, #0e7490); color: white; padding: 8px 12px; font-weight: 600; font-size: 11px; border-radius: 6px 6px 0 0; }
    .section-content { border: 1px solid #e2e8f0; border-top: none; padding: 12px; border-radius: 0 0 6px 6px; }
    table { width: 100%; border-collapse: collapse; font-size: 9px; }
    th { background: #f1f5f9; padding: 6px 8px; text-align: left; font-weight: 600; color: #475569; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
    .priority { padding: 2px 6px; border-radius: 3px; font-size: 8px; font-weight: 600; }
    .priority.critical { background: #fee2e2; color: #dc2626; }
    .priority.high { background: #fef3c7; color: #d97706; }
    .priority.medium { background: #dbeafe; color: #2563eb; }

    /* Timeline */
    .timeline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .phase { background: #f8fafc; border-radius: 6px; padding: 10px; border-left: 4px solid #0891b2; }
    .phase-header { font-weight: 600; color: #0891b2; font-size: 10px; margin-bottom: 6px; }
    .phase ul { margin: 0; padding-left: 15px; font-size: 8px; }
    .phase li { margin: 3px 0; }

    /* Footer */
    .footer { text-align: center; padding-top: 10px; border-top: 1px solid #e2e8f0; margin-top: 15px; color: #94a3b8; font-size: 9px; }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <h1>⭐ 5-Star Phil Quality Report</h1>
    <div class="toolbar-btns">
      <button onclick="window.print()">🖨️ Print Report</button>
      <button onclick="window.print()">📥 Save as PDF</button>
      <button onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="content">
    <div class="header">
      <h2>⭐ CMS Five-Star Quality Improvement Report</h2>
      <div class="sub">${facilityName} | ${dateStr} | Prepared by my5starreport.com</div>
    </div>

    ${facility ? `
    <div class="star-banner">
      <div class="star-box"><div class="value">${facility.overallRating}<span>★</span></div><div class="label">OVERALL</div></div>
      <div class="star-box"><div class="value">${facility.healthRating}<span>★</span></div><div class="label">HEALTH</div></div>
      <div class="star-box"><div class="value">${facility.staffingRating}<span>★</span></div><div class="label">STAFFING</div></div>
      <div class="star-box"><div class="value">${facility.qmRating}<span>★</span></div><div class="label">QUALITY</div></div>
    </div>
    ` : ''}

    <div class="narrative">
      ${generateNarrative()}
    </div>

    ${facility ? `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-title">📊 Staffing Performance vs 5-Star Targets</div>
        <div class="progress-item">
          <div class="progress-label"><span>Total Nursing HPRD</span><span>${facility.nursingHoursPerResidentDay?.toFixed(2) || '-'} / 4.08</span></div>
          <div class="progress-bar"><div class="progress-fill ${hprdProgress >= 100 ? 'green' : hprdProgress >= 75 ? 'yellow' : 'red'}" style="width: ${hprdProgress}%"></div></div>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span>RN HPRD</span><span>${facility.rnHoursPerResidentDay?.toFixed(2) || '-'} / 0.55</span></div>
          <div class="progress-bar"><div class="progress-fill ${rnProgress >= 100 ? 'green' : rnProgress >= 75 ? 'yellow' : 'red'}" style="width: ${rnProgress}%"></div></div>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span>Turnover Control</span><span>${facility.totalNurseTurnover?.toFixed(0) || '-'}% (target: &lt;40%)</span></div>
          <div class="progress-bar"><div class="progress-fill ${turnoverProgress >= 70 ? 'green' : turnoverProgress >= 40 ? 'yellow' : 'red'}" style="width: ${turnoverProgress}%"></div></div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-title">📈 Benchmark Comparison</div>
        <table>
          <tr><th>Metric</th><th>You</th><th>State</th><th>National</th></tr>
          <tr><td>Overall Rating</td><td><strong>${facility.overallRating}★</strong></td><td>${metrics?.stateAvg?.avg_overall || '-'}★</td><td>${metrics?.nationalAvg?.avg_overall || '-'}★</td></tr>
          <tr><td>Total HPRD</td><td>${facility.nursingHoursPerResidentDay?.toFixed(2) || '-'}</td><td>${metrics?.stateAvg?.avg_total_hprd || '-'}</td><td>${metrics?.nationalAvg?.avg_total_hprd || '-'}</td></tr>
          <tr><td>RN HPRD</td><td>${facility.rnHoursPerResidentDay?.toFixed(2) || '-'}</td><td>${metrics?.stateAvg?.avg_rn_hprd || '-'}</td><td>${metrics?.nationalAvg?.avg_rn_hprd || '-'}</td></tr>
        </table>
      </div>
    </div>
    ` : ''}

    <div class="flowchart">
      <div class="flowchart-title">🔄 Quality Improvement Process Flow</div>
      <div class="flow-row">
        <div class="flow-step">1. ASSESS<br><small>Baseline Data</small></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">2. ANALYZE<br><small>Gap Analysis</small></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">3. PLAN<br><small>QAPI Project</small></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">4. IMPLEMENT<br><small>Execute Plan</small></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">5. MONITOR<br><small>Track KPIs</small></div>
      </div>
      <div class="flow-row" style="margin-top:8px;">
        <div class="flow-step" style="background:#059669;">6. EVALUATE<br><small>Mock Survey</small></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step" style="background:#059669;">7. ADJUST<br><small>Refine Approach</small></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step" style="background:#059669;">8. SUSTAIN<br><small>Institutionalize</small></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step" style="background:#7c3aed;">✓ IMPROVED<br><small>Higher Rating</small></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🎯 Priority Action Items</div>
      <div class="section-content">
        <table>
          <tr><th>Priority</th><th>Action</th><th>Expected Impact</th><th>Investment</th><th>Timeline</th></tr>
          ${recommendations.slice(0, 8).map(r => `
          <tr>
            <td><span class="priority ${r.priority.toLowerCase()}">${r.priority}</span></td>
            <td>${r.action}</td>
            <td>${r.impact}</td>
            <td>${r.cost}</td>
            <td>${r.timeline}</td>
          </tr>`).join('')}
        </table>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📅 90-Day Implementation Timeline</div>
      <div class="section-content">
        <div class="timeline">
          <div class="phase">
            <div class="phase-header">Phase 1: Foundation (Days 1-30)</div>
            <ul>
              <li>Complete comprehensive baseline assessment</li>
              <li>Audit PBJ and MDS data for accuracy</li>
              <li>Implement daily safety huddles</li>
              <li>Identify top deficiency patterns</li>
              <li>Train charge nurses on F-tag hotspots</li>
              <li>Establish QAPI committee structure</li>
            </ul>
          </div>
          <div class="phase">
            <div class="phase-header">Phase 2: Intervention (Days 31-60)</div>
            <ul>
              <li>Deploy targeted QM protocols</li>
              <li>Optimize staffing schedules for HPRD</li>
              <li>Conduct comprehensive mock survey</li>
              <li>Launch performance improvement project</li>
              <li>Implement behavior tracking systems</li>
              <li>Address identified compliance gaps</li>
            </ul>
          </div>
          <div class="phase">
            <div class="phase-header">Phase 3: Sustainability (Days 61-90)</div>
            <ul>
              <li>Evaluate progress via KPI dashboard</li>
              <li>Institutionalize successful interventions</li>
              <li>Conduct second mock survey</li>
              <li>Develop ongoing monitoring systems</li>
              <li>Prepare continuous survey readiness</li>
              <li>Document lessons learned</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">💰 Investment & ROI Analysis</div>
      <div class="section-content">
        <table>
          <tr><th>Investment Level</th><th>Annual Cost</th><th>Expected Impact</th><th>Typical ROI</th><th>Payback Period</th></tr>
          <tr><td>Minimal (Process Only)</td><td>$0 - $10,000</td><td>+0.5 stars average</td><td>10-20x return</td><td>3-6 months</td></tr>
          <tr><td>Moderate</td><td>$10,000 - $50,000</td><td>+1 star average</td><td>5-10x return</td><td>6-12 months</td></tr>
          <tr><td>Significant</td><td>$50,000 - $150,000</td><td>+1-2 stars</td><td>3-5x return</td><td>12-18 months</td></tr>
          <tr><td>Major Transformation</td><td>$150,000+</td><td>+2 stars possible</td><td>2-3x return</td><td>18-24 months</td></tr>
        </table>
        <p style="margin-top:10px; font-size:9px; color:#64748b;">
          <strong>Value Drivers:</strong> Higher star ratings correlate with 5-15% increased occupancy, improved Medicare Advantage and managed care contract rates, reduced survey-related costs, lower staff turnover, and enhanced community reputation. A one-star improvement typically generates $100,000-$500,000 in annual value for a 100-bed facility.
        </p>
      </div>
    </div>

    <div class="footer">
      <strong>5-Star Phil Quality Analysis</strong> | my5starreport.com | Based on CMS data and industry best practices | ${dateStr}<br>
      <small>This report is for informational purposes. Results may vary based on implementation quality and market conditions.</small>
    </div>
  </div>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleOpenGamma = () => {
    if (data.gammaPrompt) {
      const encodedPrompt = encodeURIComponent(data.gammaPrompt);
      window.open(`https://gamma.app/create?prompt=${encodedPrompt}`, '_blank');
    }
  };

  const handlePreview = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const facilityName = facility?.name || 'Quality Improvement';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Generate preview content (same as PDF but without print trigger)
    const generateNarrative = () => {
      const natCount = metrics?.nationalFacilityCount?.toLocaleString() || '14,000+';
      const natAvg = metrics?.nationalAvg?.avg_overall || '2.96';

      if (!facility) {
        return `This comprehensive quality improvement report provides strategic guidance for skilled nursing facilities seeking to enhance their CMS Five-Star Quality Rating System performance. The analysis is based on current data from ${natCount} Medicare and Medicaid-certified nursing homes nationwide, incorporating evidence-based improvement strategies.`;
      }

      const overallAssess = facility.overallRating >= 4 ? 'performing above the national average' : facility.overallRating >= 3 ? 'performing at the national average' : 'positioned below the national average';
      return `This comprehensive quality improvement analysis has been prepared for ${facility.name}, located in ${facility.city}, ${facility.state}. The facility currently maintains an overall CMS Five-Star rating of ${facility.overallRating} stars, ${overallAssess} of ${natAvg} stars across ${natCount} Medicare-certified nursing homes.`;
    };

    const hprdProgress = facility ? Math.min(100, ((facility.nursingHoursPerResidentDay || 0) / 4.08) * 100) : 0;
    const rnProgress = facility ? Math.min(100, ((facility.rnHoursPerResidentDay || 0) / 0.55) * 100) : 0;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Preview - ${facilityName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', -apple-system, sans-serif; font-size: 12px; color: #1e293b; line-height: 1.6; padding: 20px; background: #f8fafc; }
    .header { text-align: center; border-bottom: 3px solid #0891b2; padding-bottom: 15px; margin-bottom: 20px; }
    .header h2 { color: #0891b2; font-size: 24px; margin-bottom: 5px; }
    .header .sub { color: #64748b; font-size: 12px; }
    .star-banner { display: flex; justify-content: center; gap: 40px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
    .star-box { text-align: center; }
    .star-box .value { font-size: 42px; font-weight: 700; color: #0891b2; }
    .star-box .value span { color: #fbbf24; }
    .star-box .label { font-size: 11px; color: #64748b; font-weight: 500; }
    .narrative { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: justify; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .metric-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .metric-title { font-weight: 600; color: #0891b2; margin-bottom: 10px; font-size: 13px; }
    .progress-item { margin-bottom: 12px; }
    .progress-label { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 4px; }
    .progress-bar { height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 5px; }
    .progress-fill.green { background: linear-gradient(90deg, #10b981, #059669); }
    .progress-fill.yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .progress-fill.red { background: linear-gradient(90deg, #ef4444, #dc2626); }
    .footer { text-align: center; padding-top: 15px; border-top: 1px solid #e2e8f0; margin-top: 20px; color: #94a3b8; font-size: 10px; }
    .close-btn { position: fixed; top: 20px; right: 20px; background: #0891b2; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
  </style>
</head>
<body>
  <button class="close-btn" onclick="window.close()">✕ Close Preview</button>
  <div class="header">
    <h2>⭐ CMS Five-Star Quality Report Preview</h2>
    <div class="sub">${facilityName} | ${dateStr}</div>
  </div>
  ${facility ? `
  <div class="star-banner">
    <div class="star-box"><div class="value">${facility.overallRating}<span>★</span></div><div class="label">OVERALL</div></div>
    <div class="star-box"><div class="value">${facility.healthRating}<span>★</span></div><div class="label">HEALTH</div></div>
    <div class="star-box"><div class="value">${facility.staffingRating}<span>★</span></div><div class="label">STAFFING</div></div>
    <div class="star-box"><div class="value">${facility.qmRating}<span>★</span></div><div class="label">QUALITY</div></div>
  </div>
  ` : ''}
  <div class="narrative">${generateNarrative()}</div>
  ${facility ? `
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-title">📊 Staffing Performance</div>
      <div class="progress-item">
        <div class="progress-label"><span>Total Nursing HPRD</span><span>${facility.nursingHoursPerResidentDay?.toFixed(2) || '-'} / 4.08</span></div>
        <div class="progress-bar"><div class="progress-fill ${hprdProgress >= 100 ? 'green' : hprdProgress >= 75 ? 'yellow' : 'red'}" style="width: ${hprdProgress}%"></div></div>
      </div>
      <div class="progress-item">
        <div class="progress-label"><span>RN HPRD</span><span>${facility.rnHoursPerResidentDay?.toFixed(2) || '-'} / 0.55</span></div>
        <div class="progress-bar"><div class="progress-fill ${rnProgress >= 100 ? 'green' : rnProgress >= 75 ? 'yellow' : 'red'}" style="width: ${rnProgress}%"></div></div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-title">📋 Facility Info</div>
      <p><strong>Location:</strong> ${facility.city}, ${facility.state}</p>
      <p><strong>CCN:</strong> ${facility.ccn}</p>
      <p><strong>Beds:</strong> ${facility.beds}</p>
      ${facility.totalFines ? `<p><strong>Total Fines:</strong> $${facility.totalFines.toLocaleString()}</p>` : ''}
    </div>
  </div>
  ` : ''}
  <div class="footer">Preview generated by my5starreport.com | Download or print for full report</div>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const StarRating = ({ rating }: { rating: number | undefined }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-5 h-5 ${i <= (rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">5 Star Phil | Expert Analysis</h2>
                <p className="text-cyan-100 text-sm">
                  {facility ? facility.name : 'Quality Improvement Report'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Preview report in browser"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Download as PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={handleOpenGamma}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Create presentation in Gamma.app"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Create Slides</span>
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Facility Overview Cards */}
          {facility && (
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl p-4 text-center border border-cyan-200 dark:border-cyan-800">
                  <div className="text-3xl font-bold text-cyan-600">{facility.overallRating}★</div>
                  <div className="text-sm text-cyan-700 dark:text-cyan-300">Overall Rating</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-4 text-center border border-green-200 dark:border-green-800">
                  <div className="text-3xl font-bold text-green-600">{facility.healthRating}★</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Health Inspection</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-800">
                  <div className="text-3xl font-bold text-purple-600">{facility.staffingRating}★</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Staffing</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-4 text-center border border-amber-200 dark:border-amber-800">
                  <div className="text-3xl font-bold text-amber-600">{facility.qmRating}★</div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">Quality Measures</div>
                </div>
              </div>

              {/* Facility Info Bar */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>{facility.city}, {facility.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>CCN: {facility.ccn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>{facility.beds} Beds</span>
                </div>
                {facility.totalFines && facility.totalFines > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <DollarSign className="w-4 h-4" />
                    <span>${facility.totalFines.toLocaleString()} in fines</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Executive Summary - Phil's Analysis */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection('executive')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl mb-4"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Phil&apos;s Executive Summary</span>
              </div>
              {expandedSections.has('executive') ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedSections.has('executive') && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                    {data.response ? data.response : facility ? (
                      <>
                        <p className="mb-4">Based on comprehensive analysis of CMS Five-Star Quality Rating data, {facility.name} requires a strategic improvement approach focused on the three core domains.</p>

                        <p className="font-bold mb-2">Current Performance Assessment:</p>
                        <ul className="list-disc ml-4 mb-4">
                          <li>Overall Rating: {facility.overallRating} stars {facility.overallRating >= 4 ? '(Above Average)' : facility.overallRating >= 3 ? '(Average)' : '(Below Average)'}</li>
                          <li>Health Inspection: {facility.healthRating} stars</li>
                          <li>Staffing: {facility.staffingRating} stars</li>
                          <li>Quality Measures: {facility.qmRating} stars</li>
                        </ul>

                        <p className="font-bold mb-2">Key Staffing Metrics:</p>
                        <ul className="list-disc ml-4 mb-4">
                          <li>Total Nursing HPRD: {facility.nursingHoursPerResidentDay?.toFixed(2) || 'N/A'} (Target: 4.08 for 5-star)</li>
                          <li>RN HPRD: {facility.rnHoursPerResidentDay?.toFixed(2) || 'N/A'} (Target: 0.55 for 5-star)</li>
                          <li>Nurse Turnover: {facility.totalNurseTurnover?.toFixed(0) || 'N/A'}%</li>
                        </ul>

                        <p className="font-bold mb-2">Financial Impact:</p>
                        <p>A one-star improvement typically generates $100,000-$500,000 in annual value through increased occupancy, improved payer mix, and reduced regulatory costs.</p>
                      </>
                    ) : (
                      <>
                        <p className="mb-4">This analysis provides guidance for skilled nursing facility quality improvement based on the CMS Five-Star Rating System methodology.</p>

                        <p className="font-bold mb-2">The Three Domains:</p>
                        <ul className="list-disc ml-4 mb-4">
                          <li>Health Inspections (53% weight) - Based on survey deficiencies</li>
                          <li>Staffing (32% weight) - Based on PBJ data submissions</li>
                          <li>Quality Measures (15% weight) - Based on MDS clinical outcomes</li>
                        </ul>

                        <p className="font-bold mb-2">Key Improvement Strategies:</p>
                        <ul className="list-disc ml-4">
                          <li>Implement robust survey readiness protocols</li>
                          <li>Optimize staffing through PBJ data auditing</li>
                          <li>Deploy targeted QM improvement interventions</li>
                          <li>Establish continuous monitoring dashboards</li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Domain Analysis */}
          {facility && (
            <div className="mb-8">
              <button
                onClick={() => toggleSection('domains')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl mb-4"
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5" />
                  <span className="font-semibold">Domain-by-Domain Analysis</span>
                </div>
                {expandedSections.has('domains') ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedSections.has('domains') && (
                <div className="space-y-4">
                  {/* Health Inspection Domain */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <ClipboardCheck className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Health Inspections</h4>
                        <p className="text-sm text-slate-500">53% of overall rating weight</p>
                      </div>
                      <div className="ml-auto text-2xl font-bold text-red-600">{facility.healthRating}★</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Status:</strong> {facility.healthRating >= 4 ? 'Strong survey performance' : facility.healthRating >= 3 ? 'Average - improvement opportunities exist' : 'Below average - immediate intervention required'}</p>
                      <p><strong>Key Actions:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                        <li>Conduct weekly mock surveys focusing on F-tag hot spots</li>
                        <li>Implement daily compliance rounds by department heads</li>
                        <li>Review and address root causes of previous deficiencies</li>
                        <li>Train all staff on survey readiness within 30 days</li>
                      </ul>
                    </div>
                  </div>

                  {/* Staffing Domain */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Staffing</h4>
                        <p className="text-sm text-slate-500">32% of overall rating weight</p>
                      </div>
                      <div className="ml-auto text-2xl font-bold text-purple-600">{facility.staffingRating}★</div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                          <p className="text-slate-500 text-xs">Total Nursing HPRD</p>
                          <p className="text-xl font-bold">{facility.nursingHoursPerResidentDay?.toFixed(2) || 'N/A'}</p>
                          <p className="text-xs text-slate-500">Target: 4.08 for 5★</p>
                          <div className="w-full h-2 bg-slate-200 rounded mt-2">
                            <div
                              className={`h-full rounded ${(facility.nursingHoursPerResidentDay || 0) >= 4.08 ? 'bg-green-500' : (facility.nursingHoursPerResidentDay || 0) >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(100, ((facility.nursingHoursPerResidentDay || 0) / 4.08) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                          <p className="text-slate-500 text-xs">RN HPRD</p>
                          <p className="text-xl font-bold">{facility.rnHoursPerResidentDay?.toFixed(2) || 'N/A'}</p>
                          <p className="text-xs text-slate-500">Target: 0.55 for 5★</p>
                          <div className="w-full h-2 bg-slate-200 rounded mt-2">
                            <div
                              className={`h-full rounded ${(facility.rnHoursPerResidentDay || 0) >= 0.55 ? 'bg-green-500' : (facility.rnHoursPerResidentDay || 0) >= 0.45 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(100, ((facility.rnHoursPerResidentDay || 0) / 0.55) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p><strong>Key Actions:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                        <li>Audit PBJ submissions for accuracy and completeness</li>
                        <li>Optimize scheduling to maximize HPRD during peak hours</li>
                        <li>Implement nurse retention programs to reduce turnover</li>
                        <li>Consider PRN pool expansion for census fluctuations</li>
                      </ul>
                    </div>
                  </div>

                  {/* Quality Measures Domain */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Quality Measures</h4>
                        <p className="text-sm text-slate-500">15% of overall rating weight</p>
                      </div>
                      <div className="ml-auto text-2xl font-bold text-green-600">{facility.qmRating}★</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Status:</strong> {facility.qmRating >= 4 ? 'Strong clinical outcomes' : facility.qmRating >= 3 ? 'Average QM performance' : 'QM improvement interventions needed'}</p>
                      <p><strong>Priority QM Focus Areas:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-slate-600 dark:text-slate-400">
                        <li>Falls with major injury prevention program</li>
                        <li>Antipsychotic medication reduction initiative</li>
                        <li>Pressure ulcer prevention protocols</li>
                        <li>UTI reduction through catheter management</li>
                        <li>Rehospitalization reduction program</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Benchmarking Section */}
          {metrics && (
            <div className="mb-8">
              <button
                onClick={() => toggleSection('benchmarks')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl mb-4"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">National & State Benchmarks</span>
                </div>
                {expandedSections.has('benchmarks') ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedSections.has('benchmarks') && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-3">National Comparison</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Based on {metrics.nationalFacilityCount?.toLocaleString() || '14,000+'} facilities
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Average Overall:</span>
                          <span className="font-bold">{metrics.nationalAvg?.avg_overall?.toFixed(2) || '2.96'}★</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Health:</span>
                          <span className="font-bold">{metrics.nationalAvg?.avg_health?.toFixed(2) || '2.94'}★</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Staffing:</span>
                          <span className="font-bold">{metrics.nationalAvg?.avg_staffing?.toFixed(2) || '2.98'}★</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average QM:</span>
                          <span className="font-bold">{metrics.nationalAvg?.avg_qm?.toFixed(2) || '3.02'}★</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-3">State Comparison</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Based on {metrics.stateFacilityCount?.toLocaleString() || 'state'} facilities
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>State Avg Overall:</span>
                          <span className="font-bold">{metrics.stateAvg?.avg_overall?.toFixed(2) || 'N/A'}★</span>
                        </div>
                        <div className="flex justify-between">
                          <span>State Avg Health:</span>
                          <span className="font-bold">{metrics.stateAvg?.avg_health?.toFixed(2) || 'N/A'}★</span>
                        </div>
                        <div className="flex justify-between">
                          <span>State Avg Staffing:</span>
                          <span className="font-bold">{metrics.stateAvg?.avg_staffing?.toFixed(2) || 'N/A'}★</span>
                        </div>
                        <div className="flex justify-between">
                          <span>State Avg QM:</span>
                          <span className="font-bold">{metrics.stateAvg?.avg_qm?.toFixed(2) || 'N/A'}★</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => toggleSection('recommendations')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl mb-4"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold">Priority Recommendations ({recommendations.length})</span>
                </div>
                {expandedSections.has('recommendations') ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedSections.has('recommendations') && (
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              rec.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              rec.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {rec.priority}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white">{rec.action}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Impact:</span>
                              <span className="ml-2 text-green-600 font-medium">{rec.impact}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Cost:</span>
                              <span className="ml-2 font-medium">{rec.cost}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Timeline:</span>
                              <span className="ml-2 font-medium">{rec.timeline}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 90-Day Roadmap */}
          <div className="mb-8">
            <button
              onClick={() => toggleSection('roadmap')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl mb-4"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">90-Day Implementation Roadmap</span>
              </div>
              {expandedSections.has('roadmap') ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedSections.has('roadmap') && (
              <div className="space-y-4">
                {[
                  {
                    phase: 'Phase 1: Foundation',
                    days: 'Days 1-30',
                    color: 'green',
                    items: [
                      'Complete comprehensive baseline assessment',
                      'Audit PBJ and MDS data for accuracy',
                      'Implement daily safety huddles',
                      'Identify top 3 deficiency patterns',
                      'Train charge nurses on F-tag hot spots'
                    ]
                  },
                  {
                    phase: 'Phase 2: Intervention',
                    days: 'Days 31-60',
                    color: 'amber',
                    items: [
                      'Deploy targeted QM improvement protocols',
                      'Optimize staffing schedules for HPRD',
                      'Conduct comprehensive mock survey',
                      'Launch QAPI performance improvement project',
                      'Implement behavior tracking'
                    ]
                  },
                  {
                    phase: 'Phase 3: Sustainability',
                    days: 'Days 61-90',
                    color: 'blue',
                    items: [
                      'Evaluate progress with data dashboard',
                      'Institutionalize successful interventions',
                      'Conduct second mock survey',
                      'Develop ongoing monitoring systems',
                      'Prepare for continuous survey readiness'
                    ]
                  }
                ].map((phase, i) => (
                  <div
                    key={i}
                    className={`bg-${phase.color}-50 dark:bg-${phase.color}-900/20 rounded-xl p-4 border-l-4 border-${phase.color}-500`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{phase.phase}</h4>
                      <span className={`text-sm px-2 py-1 bg-${phase.color}-100 dark:bg-${phase.color}-800 text-${phase.color}-700 dark:text-${phase.color}-300 rounded`}>
                        {phase.days}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className={`w-4 h-4 text-${phase.color}-500 mt-0.5 flex-shrink-0`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investment Analysis */}
          <div>
            <button
              onClick={() => toggleSection('investment')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl mb-4"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Investment & ROI Analysis</span>
              </div>
              {expandedSections.has('investment') ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedSections.has('investment') && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="text-left p-3 font-semibold">Investment Level</th>
                      <th className="text-left p-3 font-semibold">Annual Cost</th>
                      <th className="text-left p-3 font-semibold">Expected Impact</th>
                      <th className="text-left p-3 font-semibold">Typical ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { level: 'Minimal', cost: '$0-10K', impact: '+0.5 stars avg', roi: '10-20x' },
                      { level: 'Moderate', cost: '$10-50K', impact: '+1 star avg', roi: '5-10x' },
                      { level: 'Significant', cost: '$50-150K', impact: '+1-2 stars', roi: '3-5x' },
                      { level: 'Major', cost: '$150K+', impact: '+2 stars possible', roi: '2-3x' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                        <td className="p-3 font-medium">{row.level}</td>
                        <td className="p-3">{row.cost}</td>
                        <td className="p-3 text-green-600 font-medium">{row.impact}</td>
                        <td className="p-3">{row.roi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Generated by 5 Star Phil | my5starreport.com</span>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700"
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
              <button
                onClick={handleOpenGamma}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="w-4 h-4" />
                Create Presentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
