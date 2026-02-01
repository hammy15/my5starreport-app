/**
 * PDF Export Utility
 * Generates professional PDF reports for nursing home data
 * Includes fallback download when popups are blocked
 */

interface FacilityData {
  providerName: string;
  federalProviderNumber: string;
  cityTown: string;
  state: string;
  overallRating: number;
  healthRating: number;
  staffingRating: number;
  qmRating: number;
  numberOfBeds?: number;
  numberOfResidents?: number;
}

interface ReportOptions {
  title: string;
  subtitle?: string;
  includeDate?: boolean;
  includeFooter?: boolean;
}

// Generate star display
function getStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Get rating color class
function getRatingColor(rating: number): string {
  if (rating >= 4) return '#16a34a'; // green
  if (rating >= 3) return '#f59e0b'; // yellow
  return '#dc2626'; // red
}

// Helper function to download as HTML file (fallback when popup blocked)
function downloadAsHTML(content: string, filename: string): void {
  try {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

// Open print window with content, with fallback to download
function openReportWindow(content: string, filename: string): void {
  // Try to open popup window
  const printWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');

  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
  } else {
    // Popup was blocked - use download fallback
    downloadAsHTML(content, filename);
    // Show a toast-like notification (using alert as fallback)
    setTimeout(() => {
      alert('Your browser blocked the popup. The report has been downloaded as an HTML file.\n\nTo view it:\n1. Open the downloaded file in your browser\n2. Use Print (Ctrl+P / Cmd+P) to save as PDF');
    }, 100);
  }
}

// Generate CSS styles for the PDF
function getPDFStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 3px solid #0891b2;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0891b2;
      margin-bottom: 5px;
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 5px;
    }
    .subtitle {
      font-size: 16px;
      color: #6b7280;
    }
    .date {
      font-size: 14px;
      color: #9ca3af;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #0891b2;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .facility-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .facility-name {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
    }
    .facility-location {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 15px;
    }
    .ratings-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }
    .rating-box {
      text-align: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .rating-value {
      font-size: 32px;
      font-weight: bold;
    }
    .rating-stars {
      font-size: 12px;
      letter-spacing: 2px;
    }
    .rating-label {
      font-size: 12px;
      color: #6b7280;
      margin-top: 5px;
    }
    .metrics-table {
      width: 100%;
      border-collapse: collapse;
    }
    .metrics-table th,
    .metrics-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .metrics-table th {
      background: #f1f5f9;
      font-weight: 600;
      color: #374151;
    }
    .metrics-table tr:last-child td {
      border-bottom: none;
    }
    .highlight {
      background: #ecfdf5;
      padding: 2px 8px;
      border-radius: 4px;
      color: #059669;
      font-weight: 600;
    }
    .warning {
      background: #fef3c7;
      padding: 2px 8px;
      border-radius: 4px;
      color: #d97706;
      font-weight: 600;
    }
    .danger {
      background: #fee2e2;
      padding: 2px 8px;
      border-radius: 4px;
      color: #dc2626;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
    .footer a {
      color: #0891b2;
      text-decoration: none;
    }
    .action-item {
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 8px;
      border-left: 4px solid;
    }
    .action-critical {
      background: #fef2f2;
      border-color: #dc2626;
    }
    .action-high {
      background: #fffbeb;
      border-color: #f59e0b;
    }
    .action-medium {
      background: #eff6ff;
      border-color: #3b82f6;
    }
    .priority-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 5px;
    }
    .badge-critical { background: #fecaca; color: #991b1b; }
    .badge-high { background: #fde68a; color: #92400e; }
    .badge-medium { background: #bfdbfe; color: #1e40af; }
    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .comparison-item {
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
    }
    .comparison-label {
      font-size: 12px;
      color: #6b7280;
    }
    .comparison-value {
      font-size: 24px;
      font-weight: bold;
    }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #0891b2;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }
    .print-btn:hover {
      background: #0e7490;
    }
    @media print {
      body { padding: 20px; }
      .no-print, .print-btn { display: none; }
    }
  `;
}

// Generate Facility Overview Report
export function generateFacilityReport(facility: FacilityData, options: ReportOptions = { title: 'Facility Report' }): void {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${options.title} - ${facility.providerName}</title>
      <style>${getPDFStyles()}</style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>

      <div class="header">
        <div class="logo">my5STARreport.com</div>
        <div class="title">${options.title}</div>
        ${options.subtitle ? `<div class="subtitle">${options.subtitle}</div>` : ''}
        ${options.includeDate !== false ? `<div class="date">Generated: ${date}</div>` : ''}
      </div>

      <div class="section">
        <div class="facility-card">
          <div class="facility-name">${facility.providerName}</div>
          <div class="facility-location">${facility.cityTown}, ${facility.state} | CCN: ${facility.federalProviderNumber}</div>

          <div class="ratings-grid">
            <div class="rating-box">
              <div class="rating-value" style="color: ${getRatingColor(facility.overallRating)}">${facility.overallRating}</div>
              <div class="rating-stars" style="color: ${getRatingColor(facility.overallRating)}">${getStars(facility.overallRating)}</div>
              <div class="rating-label">Overall</div>
            </div>
            <div class="rating-box">
              <div class="rating-value" style="color: ${getRatingColor(facility.healthRating)}">${facility.healthRating}</div>
              <div class="rating-stars" style="color: ${getRatingColor(facility.healthRating)}">${getStars(facility.healthRating)}</div>
              <div class="rating-label">Health (53%)</div>
            </div>
            <div class="rating-box">
              <div class="rating-value" style="color: ${getRatingColor(facility.staffingRating)}">${facility.staffingRating}</div>
              <div class="rating-stars" style="color: ${getRatingColor(facility.staffingRating)}">${getStars(facility.staffingRating)}</div>
              <div class="rating-label">Staffing (32%)</div>
            </div>
            <div class="rating-box">
              <div class="rating-value" style="color: ${getRatingColor(facility.qmRating)}">${facility.qmRating}</div>
              <div class="rating-stars" style="color: ${getRatingColor(facility.qmRating)}">${getStars(facility.qmRating)}</div>
              <div class="rating-label">Quality (15%)</div>
            </div>
          </div>
        </div>
      </div>

      ${facility.numberOfBeds ? `
      <div class="section">
        <div class="section-title">Facility Details</div>
        <table class="metrics-table">
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Certified Beds</td><td>${facility.numberOfBeds}</td></tr>
          ${facility.numberOfResidents ? `<tr><td>Current Residents</td><td>${facility.numberOfResidents}</td></tr>` : ''}
          ${facility.numberOfResidents && facility.numberOfBeds ? `<tr><td>Occupancy</td><td>${Math.round((facility.numberOfResidents / facility.numberOfBeds) * 100)}%</td></tr>` : ''}
        </table>
      </div>
      ` : ''}

      ${options.includeFooter !== false ? `
      <div class="footer">
        <p>Generated by <a href="https://my5starreport.com">my5STARreport.com</a></p>
        <p>Data sourced from CMS Care Compare. For informational purposes only.</p>
      </div>
      ` : ''}
    </body>
    </html>
  `;

  const filename = `facility-report-${facility.federalProviderNumber}-${new Date().toISOString().split('T')[0]}.html`;
  openReportWindow(content, filename);
}

// Generate Comparison Report
export function generateComparisonReport(
  facilities: FacilityData[],
  options: ReportOptions = { title: 'Facility Comparison Report' }
): void {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const avgOverall = facilities.reduce((sum, f) => sum + f.overallRating, 0) / facilities.length;
  const avgHealth = facilities.reduce((sum, f) => sum + f.healthRating, 0) / facilities.length;
  const avgStaffing = facilities.reduce((sum, f) => sum + f.staffingRating, 0) / facilities.length;
  const avgQM = facilities.reduce((sum, f) => sum + f.qmRating, 0) / facilities.length;

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${options.title}</title>
      <style>${getPDFStyles()}</style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>

      <div class="header">
        <div class="logo">my5STARreport.com</div>
        <div class="title">${options.title}</div>
        ${options.subtitle ? `<div class="subtitle">${options.subtitle}</div>` : ''}
        <div class="date">Generated: ${date}</div>
      </div>

      <div class="section">
        <div class="section-title">Comparison Summary</div>
        <div class="comparison-grid">
          <div class="comparison-item">
            <div class="comparison-label">Facilities Compared</div>
            <div class="comparison-value">${facilities.length}</div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">Average Overall Rating</div>
            <div class="comparison-value" style="color: ${getRatingColor(Math.round(avgOverall))}">${avgOverall.toFixed(1)}★</div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">Average Health Rating</div>
            <div class="comparison-value" style="color: ${getRatingColor(Math.round(avgHealth))}">${avgHealth.toFixed(1)}★</div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">Average Staffing Rating</div>
            <div class="comparison-value" style="color: ${getRatingColor(Math.round(avgStaffing))}">${avgStaffing.toFixed(1)}★</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Detailed Comparison</div>
        <table class="metrics-table">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Location</th>
              <th>Overall</th>
              <th>Health</th>
              <th>Staffing</th>
              <th>QM</th>
            </tr>
          </thead>
          <tbody>
            ${facilities.map(f => `
              <tr>
                <td><strong>${f.providerName}</strong></td>
                <td>${f.cityTown}, ${f.state}</td>
                <td><span class="${f.overallRating >= 4 ? 'highlight' : f.overallRating >= 3 ? 'warning' : 'danger'}">${f.overallRating}★</span></td>
                <td>${f.healthRating}★</td>
                <td>${f.staffingRating}★</td>
                <td>${f.qmRating}★</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Generated by <a href="https://my5starreport.com">my5STARreport.com</a></p>
        <p>Data sourced from CMS Care Compare. For informational purposes only.</p>
      </div>
    </body>
    </html>
  `;

  const filename = `comparison-report-${new Date().toISOString().split('T')[0]}.html`;
  openReportWindow(content, filename);
}

// Generate Tinker Star Scenario Report
export function generateScenarioReport(
  facility: FacilityData,
  currentRatings: { overall: number; health: number; staffing: number; qm: number },
  predictedRatings: { overall: number; health: number; staffing: number; qm: number },
  actionPlan: Array<{ priority: string; action: string; impact: string; timeline: string }>,
  options: ReportOptions = { title: 'Tinker Star Improvement Plan' }
): void {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${options.title} - ${facility.providerName}</title>
      <style>${getPDFStyles()}</style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>

      <div class="header">
        <div class="logo">my5STARreport.com</div>
        <div class="title">${options.title}</div>
        <div class="subtitle">${facility.providerName}</div>
        <div class="date">Generated: ${date}</div>
      </div>

      <div class="section">
        <div class="section-title">Rating Projection</div>
        <div class="comparison-grid">
          <div class="comparison-item">
            <div class="comparison-label">Current Overall Rating</div>
            <div class="comparison-value" style="color: ${getRatingColor(currentRatings.overall)}">${currentRatings.overall}★</div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">Projected Overall Rating</div>
            <div class="comparison-value" style="color: ${getRatingColor(predictedRatings.overall)}">${predictedRatings.overall}★</div>
          </div>
        </div>

        <table class="metrics-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Current</th>
              <th>Projected</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Health Inspection (53%)</td>
              <td>${currentRatings.health}★</td>
              <td>${predictedRatings.health}★</td>
              <td><span class="${predictedRatings.health > currentRatings.health ? 'highlight' : predictedRatings.health < currentRatings.health ? 'danger' : ''}">${predictedRatings.health > currentRatings.health ? '+' : ''}${predictedRatings.health - currentRatings.health}</span></td>
            </tr>
            <tr>
              <td>Staffing (32%)</td>
              <td>${currentRatings.staffing}★</td>
              <td>${predictedRatings.staffing}★</td>
              <td><span class="${predictedRatings.staffing > currentRatings.staffing ? 'highlight' : predictedRatings.staffing < currentRatings.staffing ? 'danger' : ''}">${predictedRatings.staffing > currentRatings.staffing ? '+' : ''}${predictedRatings.staffing - currentRatings.staffing}</span></td>
            </tr>
            <tr>
              <td>Quality Measures (15%)</td>
              <td>${currentRatings.qm}★</td>
              <td>${predictedRatings.qm}★</td>
              <td><span class="${predictedRatings.qm > currentRatings.qm ? 'highlight' : predictedRatings.qm < currentRatings.qm ? 'danger' : ''}">${predictedRatings.qm > currentRatings.qm ? '+' : ''}${predictedRatings.qm - currentRatings.qm}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      ${actionPlan.length > 0 ? `
      <div class="section">
        <div class="section-title">Recommended Actions (${actionPlan.length})</div>
        ${actionPlan.map(a => `
          <div class="action-item action-${a.priority}">
            <span class="priority-badge badge-${a.priority}">${a.priority}</span>
            <div><strong>${a.action}</strong></div>
            <div style="color: #059669; margin-top: 5px;">${a.impact}</div>
            <div style="color: #6b7280; font-size: 12px; margin-top: 5px;">Timeline: ${a.timeline}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="footer">
        <p>Generated by Tinker Star on <a href="https://my5starreport.com">my5STARreport.com</a></p>
        <p>Projections are estimates based on CMS methodology. Actual results may vary.</p>
      </div>
    </body>
    </html>
  `;

  const filename = `scenario-report-${facility.federalProviderNumber}-${new Date().toISOString().split('T')[0]}.html`;
  openReportWindow(content, filename);
}

// Generate Executive Summary Report
export function generateExecutiveReport(
  portfolioData: {
    totalFacilities: number;
    avgOverallRating: number;
    avgHealthRating: number;
    avgStaffingRating: number;
    avgQMRating: number;
    atRiskCount: number;
    improvingCount: number;
    stableCount: number;
  },
  facilities: FacilityData[],
  options: ReportOptions = { title: 'Executive Portfolio Summary' }
): void {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${options.title}</title>
      <style>${getPDFStyles()}</style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>

      <div class="header">
        <div class="logo">my5STARreport.com</div>
        <div class="title">${options.title}</div>
        ${options.subtitle ? `<div class="subtitle">${options.subtitle}</div>` : ''}
        <div class="date">Generated: ${date}</div>
      </div>

      <div class="section">
        <div class="section-title">Portfolio Overview</div>
        <div class="comparison-grid">
          <div class="comparison-item">
            <div class="comparison-label">Total Facilities</div>
            <div class="comparison-value">${portfolioData.totalFacilities}</div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">Average Overall Rating</div>
            <div class="comparison-value" style="color: ${getRatingColor(Math.round(portfolioData.avgOverallRating))}">${portfolioData.avgOverallRating.toFixed(1)}★</div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">At Risk (1-2 Stars)</div>
            <div class="comparison-value" style="color: #dc2626">${portfolioData.atRiskCount}</div>
          </div>
          <div class="comparison-item">
            <div class="comparison-label">High Performers (4-5 Stars)</div>
            <div class="comparison-value" style="color: #16a34a">${facilities.filter(f => f.overallRating >= 4).length}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Component Ratings Summary</div>
        <table class="metrics-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Average Rating</th>
              <th>Weight</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Health Inspections</td>
              <td>${portfolioData.avgHealthRating.toFixed(1)}★</td>
              <td>53%</td>
              <td><span class="${portfolioData.avgHealthRating >= 3.5 ? 'highlight' : portfolioData.avgHealthRating >= 2.5 ? 'warning' : 'danger'}">${portfolioData.avgHealthRating >= 3.5 ? 'Strong' : portfolioData.avgHealthRating >= 2.5 ? 'Needs Attention' : 'Critical'}</span></td>
            </tr>
            <tr>
              <td>Staffing</td>
              <td>${portfolioData.avgStaffingRating.toFixed(1)}★</td>
              <td>32%</td>
              <td><span class="${portfolioData.avgStaffingRating >= 3.5 ? 'highlight' : portfolioData.avgStaffingRating >= 2.5 ? 'warning' : 'danger'}">${portfolioData.avgStaffingRating >= 3.5 ? 'Strong' : portfolioData.avgStaffingRating >= 2.5 ? 'Needs Attention' : 'Critical'}</span></td>
            </tr>
            <tr>
              <td>Quality Measures</td>
              <td>${portfolioData.avgQMRating.toFixed(1)}★</td>
              <td>15%</td>
              <td><span class="${portfolioData.avgQMRating >= 3.5 ? 'highlight' : portfolioData.avgQMRating >= 2.5 ? 'warning' : 'danger'}">${portfolioData.avgQMRating >= 3.5 ? 'Strong' : portfolioData.avgQMRating >= 2.5 ? 'Needs Attention' : 'Critical'}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Facility Details</div>
        <table class="metrics-table">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Location</th>
              <th>Overall</th>
              <th>Health</th>
              <th>Staffing</th>
              <th>QM</th>
            </tr>
          </thead>
          <tbody>
            ${facilities.sort((a, b) => a.overallRating - b.overallRating).map(f => `
              <tr>
                <td><strong>${f.providerName}</strong></td>
                <td>${f.cityTown}, ${f.state}</td>
                <td><span class="${f.overallRating >= 4 ? 'highlight' : f.overallRating >= 3 ? 'warning' : 'danger'}">${f.overallRating}★</span></td>
                <td>${f.healthRating}★</td>
                <td>${f.staffingRating}★</td>
                <td>${f.qmRating}★</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Generated by <a href="https://my5starreport.com">my5STARreport.com</a></p>
        <p>Data sourced from CMS Care Compare. For informational purposes only.</p>
      </div>
    </body>
    </html>
  `;

  const filename = `executive-report-${new Date().toISOString().split('T')[0]}.html`;
  openReportWindow(content, filename);
}
