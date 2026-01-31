import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

interface KnowledgeItem {
  category: string;
  subcategory: string;
  title: string;
  content: Record<string, unknown>;
}

interface FacilityData {
  id: string;
  name: string;
  ccn: string;
  city: string;
  state: string;
  beds: number | null;
  overallRating: number | null;
  healthRating: number | null;
  staffingRating: number | null;
  qmRating: number | null;
  nursingHoursPerResidentDay: number | null;
  rnHoursPerResidentDay: number | null;
  cnaHoursPerResidentDay: number | null;
  lpnHoursPerResidentDay: number | null;
  totalNurseTurnover: number | null;
  rnTurnover: number | null;
  adminTurnover: number | null;
  totalFines: number | null;
  penaltyCount: number | null;
  complaintCount: number | null;
  sffStatus: string | null;
  ownerName: string | null;
  ownershipType: string | null;
}

interface Citation {
  deficiencyTag: string;
  deficiencyDescription: string;
  scopeSeverity: string;
  surveyDate: string;
  deficiencyCategory: string;
}

interface Penalty {
  penaltyDate: string;
  penaltyType: string;
  fineAmount: number;
  paymentDenialDays: number | null;
}

interface QualityMeasure {
  measureCode: string;
  measureDescription: string;
  residentType: string;
  averageScore: number;
}

// Phil - Expert SNF Quality Consultant with Full Database Access
async function generatePhilResponse(query: string, facilityId?: string): Promise<{
  response: string;
  recommendations: Array<{ action: string; impact: string; cost: string; timeline: string; priority: string }>;
  metrics?: Record<string, unknown>;
  facilityData?: Record<string, unknown>;
  reportAvailable: boolean;
  gammaPrompt?: string;
}> {
  const queryLower = query.toLowerCase();

  // ============================================================================
  // STEP 1: GATHER ALL RELEVANT DATA
  // ============================================================================

  // Fetch facility data if provided
  let facility: FacilityData | null = null;
  let citations: Citation[] = [];
  let penalties: Penalty[] = [];
  let qualityMeasures: QualityMeasure[] = [];
  let stateAvg: Record<string, number> = {};
  let nationalAvg: Record<string, number> = {};
  let stateFacilityCount = 0;
  let nationalFacilityCount = 0;
  let stateRatingDistribution: Record<string, number> = {};
  let topDeficiencies: Array<{tag: string; description: string; count: number}> = [];

  // Get national statistics
  const nationalStats = await sql`
    SELECT
      COUNT(*)::int as total_facilities,
      AVG("overallRating")::numeric(3,2) as avg_overall,
      AVG("healthRating")::numeric(3,2) as avg_health,
      AVG("staffingRating")::numeric(3,2) as avg_staffing,
      AVG("qmRating")::numeric(3,2) as avg_qm,
      AVG("nursingHoursPerResidentDay")::numeric(4,2) as avg_total_hprd,
      AVG("rnHoursPerResidentDay")::numeric(4,2) as avg_rn_hprd,
      AVG("cnaHoursPerResidentDay")::numeric(4,2) as avg_cna_hprd,
      AVG("totalNurseTurnover")::numeric(4,1) as avg_turnover,
      AVG("totalFines")::numeric(12,2) as avg_fines,
      SUM(CASE WHEN "overallRating" = 5 THEN 1 ELSE 0 END)::int as five_star_count,
      SUM(CASE WHEN "overallRating" = 1 THEN 1 ELSE 0 END)::int as one_star_count
    FROM "Facility"
  `;
  if (nationalStats.length > 0) {
    nationalAvg = nationalStats[0] as Record<string, number>;
    nationalFacilityCount = Number(nationalAvg.total_facilities) || 0;
  }

  // Get top deficiencies nationally
  const deficiencyStats = await sql`
    SELECT "deficiencyTag" as tag, "deficiencyDescription" as description, COUNT(*)::int as count
    FROM "HealthCitation"
    WHERE "deficiencyTag" IS NOT NULL
    GROUP BY "deficiencyTag", "deficiencyDescription"
    ORDER BY count DESC
    LIMIT 15
  `;
  topDeficiencies = deficiencyStats as Array<{tag: string; description: string; count: number}>;

  if (facilityId) {
    // Get facility details
    const facilityResult = await sql`
      SELECT id, name, ccn, city, state, beds, "overallRating", "healthRating", "staffingRating", "qmRating",
             "nursingHoursPerResidentDay", "rnHoursPerResidentDay", "cnaHoursPerResidentDay", "lpnHoursPerResidentDay",
             "totalNurseTurnover", "rnTurnover", "adminTurnover", "totalFines", "penaltyCount", "complaintCount",
             "sffStatus", "ownerName", "ownershipType"
      FROM "Facility" WHERE ccn = ${facilityId} OR id = ${facilityId}
      LIMIT 1
    `;
    if (facilityResult.length > 0) {
      facility = facilityResult[0] as FacilityData;

      // Get state statistics
      const stateStats = await sql`
        SELECT
          COUNT(*)::int as total_facilities,
          AVG("overallRating")::numeric(3,2) as avg_overall,
          AVG("healthRating")::numeric(3,2) as avg_health,
          AVG("staffingRating")::numeric(3,2) as avg_staffing,
          AVG("qmRating")::numeric(3,2) as avg_qm,
          AVG("nursingHoursPerResidentDay")::numeric(4,2) as avg_total_hprd,
          AVG("rnHoursPerResidentDay")::numeric(4,2) as avg_rn_hprd,
          AVG("totalNurseTurnover")::numeric(4,1) as avg_turnover,
          SUM(CASE WHEN "overallRating" = 5 THEN 1 ELSE 0 END)::int as five_star_count,
          SUM(CASE WHEN "overallRating" = 4 THEN 1 ELSE 0 END)::int as four_star_count,
          SUM(CASE WHEN "overallRating" = 3 THEN 1 ELSE 0 END)::int as three_star_count,
          SUM(CASE WHEN "overallRating" = 2 THEN 1 ELSE 0 END)::int as two_star_count,
          SUM(CASE WHEN "overallRating" = 1 THEN 1 ELSE 0 END)::int as one_star_count
        FROM "Facility" WHERE state = ${facility.state}
      `;
      if (stateStats.length > 0) {
        stateAvg = stateStats[0] as Record<string, number>;
        stateFacilityCount = Number(stateAvg.total_facilities) || 0;
        stateRatingDistribution = {
          '5': Number(stateAvg.five_star_count) || 0,
          '4': Number(stateAvg.four_star_count) || 0,
          '3': Number(stateAvg.three_star_count) || 0,
          '2': Number(stateAvg.two_star_count) || 0,
          '1': Number(stateAvg.one_star_count) || 0,
        };
      }

      // Get facility citations
      const citationResult = await sql`
        SELECT "deficiencyTag", "deficiencyDescription", "scopeSeverity", "surveyDate", "deficiencyCategory"
        FROM "HealthCitation"
        WHERE "facilityId" = ${facility.id}
        ORDER BY "surveyDate" DESC
        LIMIT 25
      `;
      citations = citationResult as Citation[];

      // Get facility penalties
      const penaltyResult = await sql`
        SELECT "penaltyDate", "penaltyType", "fineAmount", "paymentDenialDays"
        FROM "Penalty"
        WHERE "facilityId" = ${facility.id}
        ORDER BY "penaltyDate" DESC
        LIMIT 10
      `;
      penalties = penaltyResult as Penalty[];

      // Get facility quality measures
      const qmResult = await sql`
        SELECT "measureCode", "measureDescription", "residentType", "averageScore"
        FROM "QualityMeasure"
        WHERE "facilityId" = ${facility.id}
        ORDER BY "averageScore" ASC
        LIMIT 20
      `;
      qualityMeasures = qmResult as QualityMeasure[];
    }
  }

  // Fetch ALL relevant knowledge
  const allKnowledge = await sql`
    SELECT category, subcategory, title, content, tags
    FROM "FiveStarKnowledge"
    ORDER BY category, subcategory
  ` as KnowledgeItem[];

  // ============================================================================
  // STEP 2: BUILD PROFESSIONAL CONSULTANT RESPONSE
  // ============================================================================

  let response = '';
  const recommendations: Array<{ action: string; impact: string; cost: string; timeline: string; priority: string }> = [];

  // Determine query intent
  const isImprovementQuery = /improve|increase|better|raise|boost|go from|move from|\d\s*(to|→|->)\s*\d|star/i.test(queryLower);
  const isStaffingQuery = /staff|hprd|nurse|rn|lpn|cna|pbj|turnover|retention|schedule/i.test(queryLower);
  const isHealthQuery = /health|inspection|survey|deficien|f-tag|citation|compliance/i.test(queryLower);
  const isQMQuery = /quality|qm|measure|fall|pressure|ulcer|antipsychotic|rehospital|uti|catheter/i.test(queryLower);
  const isCostQuery = /cost|roi|invest|budget|money|expense|save|afford/i.test(queryLower);
  const isReportQuery = /report|pdf|presentation|slide|gamma|board|executive/i.test(queryLower);
  const isCompareQuery = /compare|benchmark|rank|percentile|vs|versus/i.test(queryLower);

  // ============================================================================
  // HEADER
  // ============================================================================
  response += `# 5 Star Phil | Expert Analysis Report\n`;
  response += `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;

  // ============================================================================
  // FACILITY PROFILE (if provided)
  // ============================================================================
  if (facility) {
    response += `---\n## FACILITY PROFILE\n\n`;
    response += `**${facility.name}**\n`;
    response += `📍 ${facility.city}, ${facility.state} | CCN: ${facility.ccn} | Beds: ${facility.beds || 'N/A'}\n`;
    response += `🏢 Owner: ${facility.ownerName || 'N/A'} (${facility.ownershipType || 'N/A'})\n`;
    if (facility.sffStatus) {
      response += `⚠️ **Special Focus Facility Status:** ${facility.sffStatus}\n`;
    }
    response += `\n`;

    // Rating comparison table
    response += `### Current Star Ratings vs. Benchmarks\n\n`;
    response += `| Domain | Your Rating | ${facility.state} Avg | National Avg | Your Percentile |\n`;
    response += `|--------|-------------|----------|--------------|----------------|\n`;

    const calcPercentile = (rating: number | null, avgRating: number) => {
      if (!rating) return '-';
      const diff = rating - avgRating;
      if (diff >= 1.5) return 'Top 10%';
      if (diff >= 0.5) return 'Top 25%';
      if (diff >= -0.5) return 'Middle 50%';
      if (diff >= -1.5) return 'Bottom 25%';
      return 'Bottom 10%';
    };

    response += `| **Overall** | ${facility.overallRating || '-'}★ | ${stateAvg.avg_overall || '-'}★ | ${nationalAvg.avg_overall || '-'}★ | ${calcPercentile(facility.overallRating, Number(nationalAvg.avg_overall))} |\n`;
    response += `| Health Inspection | ${facility.healthRating || '-'}★ | ${stateAvg.avg_health || '-'}★ | ${nationalAvg.avg_health || '-'}★ | ${calcPercentile(facility.healthRating, Number(nationalAvg.avg_health))} |\n`;
    response += `| Staffing | ${facility.staffingRating || '-'}★ | ${stateAvg.avg_staffing || '-'}★ | ${nationalAvg.avg_staffing || '-'}★ | ${calcPercentile(facility.staffingRating, Number(nationalAvg.avg_staffing))} |\n`;
    response += `| Quality Measures | ${facility.qmRating || '-'}★ | ${stateAvg.avg_qm || '-'}★ | ${nationalAvg.avg_qm || '-'}★ | ${calcPercentile(facility.qmRating, Number(nationalAvg.avg_qm))} |\n\n`;

    // Staffing metrics
    response += `### Staffing Metrics (Hours Per Resident Day)\n\n`;
    response += `| Metric | Your Facility | ${facility.state} Avg | National Avg | 5-Star Threshold |\n`;
    response += `|--------|---------------|----------|--------------|------------------|\n`;
    response += `| Total Nursing HPRD | ${facility.nursingHoursPerResidentDay?.toFixed(2) || '-'} | ${stateAvg.avg_total_hprd || '-'} | ${nationalAvg.avg_total_hprd || '-'} | ≥4.08 |\n`;
    response += `| RN HPRD | ${facility.rnHoursPerResidentDay?.toFixed(2) || '-'} | ${stateAvg.avg_rn_hprd || '-'} | ${nationalAvg.avg_rn_hprd || '-'} | ≥0.55 |\n`;
    response += `| CNA HPRD | ${facility.cnaHoursPerResidentDay?.toFixed(2) || '-'} | - | ${nationalAvg.avg_cna_hprd || '-'} | ≥2.80 |\n`;
    response += `| Total Nurse Turnover | ${facility.totalNurseTurnover?.toFixed(1) || '-'}% | ${stateAvg.avg_turnover || '-'}% | ${nationalAvg.avg_turnover || '-'}% | <40% |\n`;
    if (facility.rnTurnover) {
      response += `| RN Turnover | ${facility.rnTurnover.toFixed(1)}% | - | - | <30% |\n`;
    }
    response += `\n`;

    // Financial/Penalty info
    if (facility.totalFines || facility.penaltyCount || penalties.length > 0) {
      response += `### Enforcement History\n\n`;
      response += `| Metric | Your Facility | National Avg |\n`;
      response += `|--------|---------------|-------------|\n`;
      response += `| Total Fines | $${(facility.totalFines || 0).toLocaleString()} | $${Number(nationalAvg.avg_fines || 0).toLocaleString()} |\n`;
      response += `| Penalty Count | ${facility.penaltyCount || 0} | - |\n`;
      response += `| Complaint Count | ${facility.complaintCount || 0} | - |\n\n`;

      if (penalties.length > 0) {
        response += `**Recent Penalties:**\n`;
        penalties.slice(0, 5).forEach(p => {
          response += `- ${new Date(p.penaltyDate).toLocaleDateString()}: ${p.penaltyType} - $${p.fineAmount?.toLocaleString() || 0}`;
          if (p.paymentDenialDays) response += ` (${p.paymentDenialDays} day payment denial)`;
          response += `\n`;
        });
        response += `\n`;
      }
    }

    // Recent deficiencies
    if (citations.length > 0) {
      response += `### Recent Deficiencies (${citations.length} total)\n\n`;

      // Group by severity
      const highSeverity = citations.filter(c => ['G', 'H', 'I', 'J', 'K', 'L'].some(s => c.scopeSeverity?.includes(s)));
      const medSeverity = citations.filter(c => ['D', 'E', 'F'].some(s => c.scopeSeverity?.includes(s)) && !highSeverity.includes(c));

      if (highSeverity.length > 0) {
        response += `**⚠️ HIGH SEVERITY (Actual Harm/Immediate Jeopardy):** ${highSeverity.length}\n`;
        highSeverity.slice(0, 5).forEach(c => {
          response += `- **${c.deficiencyTag}** (${c.scopeSeverity}): ${c.deficiencyDescription?.slice(0, 80)}...\n`;
        });
        response += `\n`;
      }

      if (medSeverity.length > 0) {
        response += `**⚡ MODERATE SEVERITY (Potential for Harm):** ${medSeverity.length}\n`;
        medSeverity.slice(0, 5).forEach(c => {
          response += `- **${c.deficiencyTag}** (${c.scopeSeverity}): ${c.deficiencyDescription?.slice(0, 80)}...\n`;
        });
        response += `\n`;
      }

      // Identify patterns
      const tagCounts: Record<string, number> = {};
      citations.forEach(c => {
        if (c.deficiencyTag) {
          tagCounts[c.deficiencyTag] = (tagCounts[c.deficiencyTag] || 0) + 1;
        }
      });
      const repeatTags = Object.entries(tagCounts).filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);

      if (repeatTags.length > 0) {
        response += `**🔄 Repeat Citations (Pattern Issues):**\n`;
        repeatTags.slice(0, 5).forEach(([tag, count]) => {
          response += `- ${tag}: ${count} occurrences\n`;
        });
        response += `\n`;
      }
    }

    // Quality Measures
    if (qualityMeasures.length > 0) {
      response += `### Quality Measures Analysis\n\n`;

      const worstMeasures = qualityMeasures.filter(qm => qm.averageScore !== null).slice(0, 8);
      if (worstMeasures.length > 0) {
        response += `**Areas Needing Improvement (lowest scores):**\n`;
        worstMeasures.forEach(qm => {
          response += `- **${qm.measureCode}** (${qm.residentType}): ${qm.averageScore?.toFixed(1)}% - ${qm.measureDescription?.slice(0, 60)}\n`;
        });
        response += `\n`;
      }
    }
  }

  // ============================================================================
  // NATIONAL/STATE INTELLIGENCE
  // ============================================================================
  response += `---\n## MARKET INTELLIGENCE\n\n`;
  response += `**National Overview** (${nationalFacilityCount.toLocaleString()} facilities analyzed)\n`;
  response += `- 5-Star Facilities: ${Number(nationalAvg.five_star_count || 0).toLocaleString()} (${((Number(nationalAvg.five_star_count) / nationalFacilityCount) * 100).toFixed(1)}%)\n`;
  response += `- 1-Star Facilities: ${Number(nationalAvg.one_star_count || 0).toLocaleString()} (${((Number(nationalAvg.one_star_count) / nationalFacilityCount) * 100).toFixed(1)}%)\n`;
  response += `- Average Overall Rating: ${nationalAvg.avg_overall}★\n\n`;

  if (facility && stateFacilityCount > 0) {
    response += `**${facility.state} Market** (${stateFacilityCount} facilities)\n`;
    response += `- 5-Star: ${stateRatingDistribution['5']} | 4-Star: ${stateRatingDistribution['4']} | 3-Star: ${stateRatingDistribution['3']} | 2-Star: ${stateRatingDistribution['2']} | 1-Star: ${stateRatingDistribution['1']}\n`;
    response += `- State Average: ${stateAvg.avg_overall}★\n\n`;
  }

  // Top deficiencies nationally
  if (topDeficiencies.length > 0) {
    response += `### Most Common Deficiencies Nationally\n\n`;
    response += `| Rank | F-Tag | Description | Citation Count |\n`;
    response += `|------|-------|-------------|----------------|\n`;
    topDeficiencies.slice(0, 10).forEach((d, i) => {
      response += `| ${i + 1} | ${d.tag} | ${d.description?.slice(0, 50)}... | ${d.count.toLocaleString()} |\n`;
    });
    response += `\n`;
  }

  // ============================================================================
  // KNOWLEDGE-BASED ANALYSIS
  // ============================================================================
  response += `---\n## EXPERT ANALYSIS & RECOMMENDATIONS\n\n`;

  // Find relevant knowledge based on query
  const relevantKnowledge = allKnowledge.filter(k => {
    const contentStr = JSON.stringify(k.content).toLowerCase();
    if (isStaffingQuery && k.category === 'Staffing') return true;
    if (isHealthQuery && k.category === 'Health Inspections') return true;
    if (isQMQuery && k.category === 'Quality Measures') return true;
    if (isImprovementQuery && k.category === 'Improvement Strategies') return true;
    if (isCostQuery && k.category === 'Cost-Effective Tactics') return true;
    if (queryLower.split(' ').some(word => contentStr.includes(word) && word.length > 3)) return true;
    return false;
  });

  // Add improvement strategies
  if (isImprovementQuery) {
    const strategies = allKnowledge.filter(k => k.category === 'Improvement Strategies');
    strategies.forEach(s => {
      response += `### ${s.title}\n`;
      response += `${(s.content as Record<string, string>).summary}\n\n`;

      const details = s.content.details as Record<string, unknown>;
      if (details?.priority_actions) {
        (details.priority_actions as Array<{ action: string; impact: string; cost: string; timeline: string }>).forEach((action, i) => {
          response += `**${i + 1}. ${action.action}**\n`;
          response += `   - Expected Impact: ${action.impact}\n`;
          response += `   - Investment Required: ${action.cost}\n`;
          response += `   - Timeline: ${action.timeline}\n\n`;

          recommendations.push({
            action: action.action,
            impact: action.impact,
            cost: action.cost,
            timeline: action.timeline,
            priority: i < 2 ? 'Critical' : i < 4 ? 'High' : 'Medium'
          });
        });
      }
    });
  }

  // Add staffing knowledge
  if (isStaffingQuery) {
    const staffingKnowledge = allKnowledge.filter(k => k.category === 'Staffing');
    staffingKnowledge.forEach(k => {
      response += `### ${k.title}\n`;
      response += `${(k.content as Record<string, string>).summary}\n\n`;
    });

    response += `### CMS Staffing Star Thresholds (Current)\n\n`;
    response += `| Star | RN HPRD | Total Nursing HPRD |\n`;
    response += `|------|---------|--------------------|\n`;
    response += `| 5★ | ≥0.55 | ≥4.08 |\n`;
    response += `| 4★ | 0.45-0.54 | 3.48-4.07 |\n`;
    response += `| 3★ | 0.35-0.44 | 3.00-3.47 |\n`;
    response += `| 2★ | 0.25-0.34 | 2.68-2.99 |\n`;
    response += `| 1★ | <0.25 | <2.68 |\n\n`;

    recommendations.push(
      { action: 'Audit PBJ data for accuracy', impact: 'Often reveals 0.1-0.2 HPRD underreporting', cost: '$0', timeline: 'Immediate', priority: 'Critical' },
      { action: 'Implement predictive scheduling software', impact: '+0.1-0.2 HPRD through optimization', cost: '$15-30K/year', timeline: '30-60 days', priority: 'High' },
      { action: 'Develop internal PRN pool', impact: 'Reduce agency 30-50%, improve consistency', cost: '$10-20K setup', timeline: '60-90 days', priority: 'High' },
      { action: 'Launch nurse residency program', impact: 'Reduce turnover 25-40%', cost: '$25-40K/year', timeline: '90 days', priority: 'Medium' }
    );
  }

  // Add health inspection knowledge
  if (isHealthQuery) {
    const healthKnowledge = allKnowledge.filter(k => k.category === 'Health Inspections');
    healthKnowledge.forEach(k => {
      response += `### ${k.title}\n`;
      response += `${(k.content as Record<string, string>).summary}\n\n`;
    });

    response += `### Deficiency Point System\n\n`;
    response += `| Severity Level | Isolated | Pattern | Widespread |\n`;
    response += `|----------------|----------|---------|------------|\n`;
    response += `| D - Potential harm | 4 | 8 | 16 |\n`;
    response += `| E - Potential harm | 8 | 16 | 24 |\n`;
    response += `| F - Potential harm | 16 | 32 | 48 |\n`;
    response += `| G - Actual harm | 20 | 40 | 80 |\n`;
    response += `| H - Actual harm | 35 | 70 | 140 |\n`;
    response += `| I-L - Immediate Jeopardy | 50-150 | 100-150 | 150 |\n\n`;

    recommendations.push(
      { action: 'Implement weekly leadership safety rounds', impact: 'Identify 60-80% of issues before survey', cost: '$0', timeline: 'Immediate', priority: 'Critical' },
      { action: 'F-tag specific competency training', impact: 'Reduce citations 20-40%', cost: '$2-5K', timeline: '30 days', priority: 'High' },
      { action: 'Hire survey readiness consultant', impact: 'External perspective on blind spots', cost: '$5-15K', timeline: '60 days', priority: 'Medium' }
    );
  }

  // Add QM knowledge
  if (isQMQuery) {
    const qmKnowledge = allKnowledge.filter(k => k.category === 'Quality Measures');
    qmKnowledge.forEach(k => {
      response += `### ${k.title}\n`;
      response += `${(k.content as Record<string, string>).summary}\n\n`;
    });

    response += `### High-Impact QM Interventions\n\n`;
    response += `| Measure | National Avg | 5-Star Target | Proven Intervention |\n`;
    response += `|---------|--------------|---------------|---------------------|\n`;
    response += `| Falls w/Major Injury | 3.2% | <2.0% | Post-fall huddles, hourly rounding |\n`;
    response += `| Antipsychotic Use | 14% | <10% | GDR protocol, behavior tracking |\n`;
    response += `| Pressure Ulcers | 5.5% | <3.0% | WOCN protocols, turn teams |\n`;
    response += `| UTI | 2.5% | <1.5% | Catheter removal protocol |\n`;
    response += `| Rehospitalization | 22% | <18% | INTERACT program |\n\n`;

    recommendations.push(
      { action: 'Audit MDS coding accuracy', impact: '+20-50 QM points often found', cost: '$0-500', timeline: 'Immediate', priority: 'Critical' },
      { action: 'Implement falls prevention bundle', impact: 'Reduce falls 15-25%', cost: '$1-3K', timeline: '30 days', priority: 'High' },
      { action: 'Launch antipsychotic reduction program', impact: 'Improve measure 3-5 percentage points', cost: '$0-1K', timeline: '60-90 days', priority: 'High' }
    );
  }

  // ============================================================================
  // COST-EFFECTIVE TACTICS
  // ============================================================================
  if (isCostQuery || isImprovementQuery) {
    const tactics = allKnowledge.filter(k => k.category === 'Cost-Effective Tactics');
    if (tactics.length > 0) {
      response += `---\n## COST-EFFECTIVE IMPROVEMENT TACTICS\n\n`;
      tactics.forEach(t => {
        response += `### ${t.title}\n`;
        const details = t.content.details as { tactics: Array<{ name: string; cost: string; impact: string; domain: string; roi: string; description: string }> };
        if (details?.tactics) {
          details.tactics.forEach(tactic => {
            response += `**${tactic.name}** (${tactic.domain})\n`;
            response += `- Investment: ${tactic.cost}\n`;
            response += `- Impact: ${tactic.impact}\n`;
            response += `- ROI: ${tactic.roi}\n`;
            response += `- How: ${tactic.description}\n\n`;
          });
        }
      });
    }
  }

  // ============================================================================
  // 90-DAY ACTION PLAN
  // ============================================================================
  response += `---\n## 90-DAY IMPLEMENTATION ROADMAP\n\n`;

  response += `### Phase 1: Foundation (Days 1-30)\n`;
  response += `- [ ] Complete comprehensive baseline assessment\n`;
  response += `- [ ] Audit PBJ and MDS data for accuracy\n`;
  response += `- [ ] Implement daily safety huddles (falls, skin, infection)\n`;
  response += `- [ ] Identify top 3 deficiency patterns from recent surveys\n`;
  response += `- [ ] Train charge nurses on F-tag hot spots\n\n`;

  response += `### Phase 2: Intervention (Days 31-60)\n`;
  response += `- [ ] Deploy targeted QM improvement protocols\n`;
  response += `- [ ] Optimize staffing schedules for HPRD targets\n`;
  response += `- [ ] Conduct comprehensive mock survey\n`;
  response += `- [ ] Launch QAPI performance improvement project\n`;
  response += `- [ ] Implement behavior tracking for antipsychotic reduction\n\n`;

  response += `### Phase 3: Sustainability (Days 61-90)\n`;
  response += `- [ ] Evaluate progress with data dashboard\n`;
  response += `- [ ] Institutionalize successful interventions\n`;
  response += `- [ ] Conduct second mock survey\n`;
  response += `- [ ] Develop ongoing monitoring systems\n`;
  response += `- [ ] Prepare for continuous survey readiness\n\n`;

  // ============================================================================
  // DEEP DIVE ANALYSIS
  // ============================================================================
  response += `---\n## DEEP DIVE ANALYSIS\n\n`;

  response += `### Expected Outcomes (with full implementation)\n`;
  response += `| Domain | Current | 90-Day Target | 12-Month Target |\n`;
  response += `|--------|---------|---------------|------------------|\n`;
  if (facility) {
    const current = facility.overallRating || 3;
    response += `| Overall Rating | ${current}★ | ${Math.min(current + 1, 5)}★ | ${Math.min(current + 2, 5)}★ |\n`;
    response += `| Health Inspection | ${facility.healthRating || '-'}★ | +1★ possible | +1-2★ possible |\n`;
    response += `| Staffing | ${facility.staffingRating || '-'}★ | Maintain/+1★ | +1★ with investment |\n`;
    response += `| Quality Measures | ${facility.qmRating || '-'}★ | +30-50 points | +50-80 points |\n`;
  } else {
    response += `| Overall Rating | -★ | +1★ typical | +1-2★ achievable |\n`;
    response += `| Health Points | - | -15 to -30 points | -30 to -50 points |\n`;
    response += `| QM Score | - | +30-50 points | +50-80 points |\n`;
  }
  response += `\n`;

  response += `### Investment vs. Return Analysis\n`;
  response += `| Investment Level | Annual Cost | Expected Impact | ROI |\n`;
  response += `|------------------|-------------|-----------------|-----|\n`;
  response += `| Minimal | $0-10K | +0.5 stars avg | 10-20x |\n`;
  response += `| Moderate | $10-50K | +1 star avg | 5-10x |\n`;
  response += `| Significant | $50-150K | +1-2 stars | 3-5x |\n`;
  response += `| Major | $150K+ | +2 stars possible | 2-3x |\n\n`;

  response += `### Risk Assessment & Mitigation\n`;
  response += `| Risk | Likelihood | Impact | Mitigation Strategy |\n`;
  response += `|------|------------|--------|---------------------|\n`;
  response += `| Staff resistance | Medium | High | Engage frontline in design, celebrate wins |\n`;
  response += `| Unsustainable gains | Medium | High | Build into daily workflows, not projects |\n`;
  response += `| Survey timing | Low | Medium | Maintain constant readiness |\n`;
  response += `| Data accuracy issues | Medium | Medium | Monthly PBJ/MDS audits |\n`;
  response += `| Turnover disruption | High | High | Retention programs, cross-training |\n\n`;

  // ============================================================================
  // REPORT/PRESENTATION OPTIONS
  // ============================================================================
  if (isReportQuery) {
    response += `---\n## DELIVERABLE OPTIONS\n\n`;
    response += `I can help you create:\n\n`;
    response += `📄 **Executive Summary PDF** - 2-page board-ready overview\n`;
    response += `📊 **Gamma.app Presentation** - Full slide deck for leadership\n`;
    response += `📈 **Detailed Analytics Report** - Deep data analysis\n`;
    response += `📋 **Action Plan Checklist** - Implementation tracker\n`;
    response += `📉 **Benchmark Comparison** - Competitive analysis\n\n`;
    response += `Say "create presentation" or "generate report" for ready-to-use content.\n`;
  }

  // Generate Gamma prompt - always generate one, with or without facility
  const gammaPrompt = facility
    ? `Create a professional healthcare consulting presentation:

TITLE: 5-Star Quality Improvement Strategy
FACILITY: ${facility.name} (${facility.city}, ${facility.state})

CURRENT STATE:
- Overall Rating: ${facility.overallRating}★
- Health Inspection: ${facility.healthRating}★
- Staffing: ${facility.staffingRating}★
- Quality Measures: ${facility.qmRating}★
- Total Nursing HPRD: ${facility.nursingHoursPerResidentDay?.toFixed(2) || 'N/A'}
- RN HPRD: ${facility.rnHoursPerResidentDay?.toFixed(2) || 'N/A'}

SECTIONS:
1. Executive Summary with current ratings vs benchmarks
2. Gap Analysis - where we are vs where we need to be
3. Health Inspection Strategy - deficiency reduction
4. Staffing Optimization Plan - HPRD improvement
5. Quality Measures Improvement - targeted interventions
6. 90-Day Implementation Timeline
7. Investment & ROI Analysis
8. Success Metrics Dashboard

STYLE: Clean, professional healthcare aesthetic. Blue and white color scheme. Data visualizations and charts. Modern, trustworthy design.`
    : `Create a professional healthcare consulting presentation:

TITLE: CMS Five-Star Quality Improvement Strategy
SUBTITLE: Best Practices for Skilled Nursing Facility Excellence

AUDIENCE: Nursing home administrators, DONs, and quality improvement teams

SECTIONS:
1. Understanding the CMS Five-Star Rating System
   - Overview of the three domains: Health Inspections, Staffing, Quality Measures
   - How ratings are calculated and weighted
   - National benchmarks and performance trends

2. Health Inspection Excellence
   - Common deficiency categories (F-tags)
   - Survey readiness protocols
   - Mock survey best practices
   - QAPI integration strategies

3. Staffing Optimization
   - PBJ data accuracy and reporting
   - HPRD thresholds (4.08 total, 0.55 RN for 5-star)
   - Turnover reduction strategies
   - Scheduling efficiency improvements

4. Quality Measures Improvement
   - MDS assessment accuracy
   - Top QM indicators and interventions
   - Falls prevention protocols
   - Antipsychotic reduction strategies

5. 90-Day Implementation Roadmap
   - Week 1-4: Assessment and baseline
   - Week 5-8: Implementation phase
   - Week 9-12: Monitoring and adjustment

6. ROI of Quality Improvement
   - Financial impact of star rating changes
   - Occupancy and payer mix benefits
   - Regulatory cost avoidance

STYLE: Clean, professional healthcare aesthetic. Blue and white color scheme. Data visualizations and charts. Modern, trustworthy design.`;

  return {
    response,
    recommendations,
    metrics: {
      nationalAvg,
      stateAvg,
      nationalFacilityCount,
      stateFacilityCount,
      topDeficiencies: topDeficiencies.slice(0, 5)
    },
    facilityData: facility ? {
      ...facility,
      citations: citations.length,
      penalties: penalties.length,
      qualityMeasures: qualityMeasures.length
    } : undefined,
    reportAvailable: true,
    gammaPrompt
  };
}

export async function POST(request: NextRequest) {
  try {
    const { query, facilityId } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await generatePhilResponse(query, facilityId);

    return NextResponse.json({
      ...result,
      query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Phil API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
