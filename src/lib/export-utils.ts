/**
 * Excel/CSV Export Utility
 *
 * Pure JavaScript implementation for exporting data to CSV and Excel formats.
 * No external dependencies required.
 */

// ============================================
// TYPES
// ============================================

/**
 * Column configuration for exports
 */
export interface ColumnConfig {
  /** Property key from the data object */
  key: string;
  /** Display header for the column */
  header: string;
  /** Optional custom formatter function */
  formatter?: (value: unknown) => string;
  /** Column type for formatting */
  type?: 'text' | 'number' | 'date' | 'percentage';
  /** Column width (for Excel) */
  width?: number;
}

/**
 * Facility data interface (matches the app's facility type)
 */
interface FacilityExportData {
  federalProviderNumber?: string;
  providerName?: string;
  providerAddress?: string;
  cityTown?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  countyName?: string;
  ownershipType?: string;
  numberOfCertifiedBeds?: number;
  numberOfResidents?: number;
  overallRating?: number;
  healthInspectionRating?: number;
  healthRating?: number;
  staffingRating?: number;
  qualityMeasureRating?: number;
  qmRating?: number;
  totalNurseHPRD?: number;
  rnHPRD?: number;
  cnaHPRD?: number;
  totalFines?: number;
  penaltyCount?: number;
  lastSurveyDate?: string;
  lastUpdated?: string;
  isSpecialFocus?: boolean;
  abuseIcon?: boolean;
  [key: string]: unknown;
}

// ============================================
// CSV EXPORT
// ============================================

/**
 * Escapes a value for CSV format
 * Handles quotes, commas, and newlines properly
 */
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // Check if value needs to be quoted
  const needsQuotes =
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r');

  if (needsQuotes) {
    // Double up any existing quotes and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Formats a value based on column type
 */
function formatValue(value: unknown, type?: ColumnConfig['type']): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (type) {
    case 'number':
      if (typeof value === 'number') {
        return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
      }
      return String(value);

    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString('en-US');
      }
      if (typeof value === 'string' && value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US');
          }
        } catch {
          return String(value);
        }
      }
      return String(value);

    case 'percentage':
      if (typeof value === 'number') {
        return `${(value * 100).toFixed(1)}%`;
      }
      return String(value);

    case 'text':
    default:
      return String(value);
  }
}

/**
 * Gets a nested value from an object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Export data to CSV format and trigger download
 *
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param columns - Optional column configuration for custom headers and formatting
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: ColumnConfig[]
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine columns from config or data keys
  const columnConfigs: ColumnConfig[] = columns ||
    Object.keys(data[0]).map(key => ({
      key,
      header: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()
    }));

  // Build header row
  const headers = columnConfigs.map(col => escapeCSVValue(col.header));

  // Build data rows
  const rows = data.map(item => {
    return columnConfigs.map(col => {
      const rawValue = getNestedValue(item, col.key);
      const formattedValue = col.formatter
        ? col.formatter(rawValue)
        : formatValue(rawValue, col.type);
      return escapeCSVValue(formattedValue);
    });
  });

  // Combine into CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  // Add BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Trigger download
  downloadBlob(blob, `${filename}.csv`);
}

// ============================================
// EXCEL EXPORT
// ============================================

/**
 * Gets Excel column width style
 */
function getColumnWidthStyle(columns: ColumnConfig[]): string {
  return columns.map((col, idx) => {
    const width = col.width || 120;
    return `col:nth-child(${idx + 1}) { width: ${width}px; }`;
  }).join('\n');
}

/**
 * Format value for Excel HTML table
 */
function formatExcelValue(value: unknown, type?: ColumnConfig['type']): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (type) {
    case 'number':
      if (typeof value === 'number') {
        // Return raw number for Excel to format
        return String(value);
      }
      return escapeHTML(String(value));

    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString('en-US');
      }
      if (typeof value === 'string' && value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US');
          }
        } catch {
          return escapeHTML(String(value));
        }
      }
      return escapeHTML(String(value));

    case 'percentage':
      if (typeof value === 'number') {
        // Return as decimal for Excel percentage format
        return String(value);
      }
      return escapeHTML(String(value));

    case 'text':
    default:
      return escapeHTML(String(value));
  }
}

/**
 * Escapes HTML special characters
 */
function escapeHTML(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char);
}

/**
 * Gets Excel cell style based on type
 */
function getCellStyle(type?: ColumnConfig['type']): string {
  switch (type) {
    case 'number':
      return 'mso-number-format:"#,##0.00";text-align:right;';
    case 'percentage':
      return 'mso-number-format:"0.0%";text-align:right;';
    case 'date':
      return 'mso-number-format:"MM/DD/YYYY";text-align:center;';
    default:
      return '';
  }
}

/**
 * Export data to Excel format (HTML table that Excel can open)
 *
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param sheetName - Name of the worksheet
 * @param columns - Optional column configuration for custom headers and formatting
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName: string = 'Sheet1',
  columns?: ColumnConfig[]
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine columns from config or data keys
  const columnConfigs: ColumnConfig[] = columns ||
    Object.keys(data[0]).map(key => ({
      key,
      header: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim(),
      width: 120
    }));

  // Build the HTML table
  const html = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <meta name="ProgId" content="Excel.Sheet">
  <meta name="Generator" content="my5STARreport.com">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${escapeHTML(sheetName)}</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    table {
      border-collapse: collapse;
      font-family: Calibri, Arial, sans-serif;
      font-size: 11pt;
    }
    th {
      background-color: #0891b2;
      color: white;
      font-weight: bold;
      text-align: center;
      padding: 8px 12px;
      border: 1px solid #0e7490;
    }
    td {
      padding: 6px 12px;
      border: 1px solid #e5e7eb;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    ${getColumnWidthStyle(columnConfigs)}
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        ${columnConfigs.map(col => `<th>${escapeHTML(col.header)}</th>`).join('\n        ')}
      </tr>
    </thead>
    <tbody>
      ${data.map(item => `
      <tr>
        ${columnConfigs.map(col => {
          const rawValue = getNestedValue(item, col.key);
          const formattedValue = col.formatter
            ? col.formatter(rawValue)
            : formatExcelValue(rawValue, col.type);
          const style = getCellStyle(col.type);
          return `<td${style ? ` style="${style}"` : ''}>${formattedValue}</td>`;
        }).join('\n        ')}
      </tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([html], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  });

  downloadBlob(blob, `${filename}.xls`);
}

// ============================================
// DOWNLOAD HELPER
// ============================================

/**
 * Triggers a file download in the browser
 */
function downloadBlob(blob: Blob, filename: string): void {
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Append to body, click, and cleanup
  document.body.appendChild(link);
  link.click();

  // Cleanup after a short delay
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

// ============================================
// FACILITY DATA FORMATTERS
// ============================================

/**
 * Default column configuration for facility exports
 */
export const FACILITY_COLUMNS: ColumnConfig[] = [
  { key: 'federalProviderNumber', header: 'CCN', type: 'text', width: 100 },
  { key: 'providerName', header: 'Facility Name', type: 'text', width: 250 },
  { key: 'cityTown', header: 'City', type: 'text', width: 120 },
  { key: 'state', header: 'State', type: 'text', width: 60 },
  { key: 'zipCode', header: 'ZIP Code', type: 'text', width: 80 },
  { key: 'countyName', header: 'County', type: 'text', width: 120 },
  { key: 'ownershipType', header: 'Ownership Type', type: 'text', width: 140 },
  { key: 'numberOfCertifiedBeds', header: 'Certified Beds', type: 'number', width: 100 },
  { key: 'numberOfResidents', header: 'Residents', type: 'number', width: 80 },
  {
    key: 'overallRating',
    header: 'Overall Rating',
    type: 'number',
    width: 100,
    formatter: (value) => value ? `${value} Star${value !== 1 ? 's' : ''}` : 'N/A'
  },
  {
    key: 'healthInspectionRating',
    header: 'Health Rating',
    type: 'number',
    width: 100,
    formatter: (value) => value ? `${value} Star${value !== 1 ? 's' : ''}` : 'N/A'
  },
  {
    key: 'staffingRating',
    header: 'Staffing Rating',
    type: 'number',
    width: 100,
    formatter: (value) => value ? `${value} Star${value !== 1 ? 's' : ''}` : 'N/A'
  },
  {
    key: 'qualityMeasureRating',
    header: 'QM Rating',
    type: 'number',
    width: 100,
    formatter: (value) => value ? `${value} Star${value !== 1 ? 's' : ''}` : 'N/A'
  },
  {
    key: 'totalFines',
    header: 'Total Fines',
    type: 'number',
    width: 120,
    formatter: (value) => {
      if (value === null || value === undefined) return '$0';
      const num = Number(value);
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  },
  { key: 'penaltyCount', header: 'Penalty Count', type: 'number', width: 100 },
  { key: 'lastSurveyDate', header: 'Last Survey', type: 'date', width: 100 },
];

/**
 * Format facility data for export with clean column names
 *
 * @param facilities - Array of facility data
 * @returns Formatted data ready for export
 */
export function formatFacilityDataForExport(
  facilities: FacilityExportData[]
): Record<string, unknown>[] {
  return facilities.map(facility => ({
    'CCN': facility.federalProviderNumber || '',
    'Facility Name': facility.providerName || '',
    'Address': facility.providerAddress || '',
    'City': facility.cityTown || '',
    'State': facility.state || '',
    'ZIP Code': facility.zipCode || '',
    'Phone': facility.phoneNumber || '',
    'County': facility.countyName || '',
    'Ownership Type': facility.ownershipType || '',
    'Certified Beds': facility.numberOfCertifiedBeds || 0,
    'Current Residents': facility.numberOfResidents || 0,
    'Overall Rating': facility.overallRating || 'N/A',
    'Health Rating': facility.healthInspectionRating || facility.healthRating || 'N/A',
    'Staffing Rating': facility.staffingRating || 'N/A',
    'Quality Measure Rating': facility.qualityMeasureRating || facility.qmRating || 'N/A',
    'Total Nurse HPRD': facility.totalNurseHPRD ? Number(facility.totalNurseHPRD).toFixed(2) : 'N/A',
    'RN HPRD': facility.rnHPRD ? Number(facility.rnHPRD).toFixed(2) : 'N/A',
    'CNA HPRD': facility.cnaHPRD ? Number(facility.cnaHPRD).toFixed(2) : 'N/A',
    'Total Fines': facility.totalFines ? `$${Number(facility.totalFines).toLocaleString()}` : '$0',
    'Penalty Count': facility.penaltyCount || 0,
    'Last Survey Date': facility.lastSurveyDate ? new Date(facility.lastSurveyDate).toLocaleDateString('en-US') : 'N/A',
    'Special Focus Facility': facility.isSpecialFocus ? 'Yes' : 'No',
    'Last Updated': facility.lastUpdated ? new Date(facility.lastUpdated).toLocaleDateString('en-US') : 'N/A',
  }));
}

/**
 * Portfolio summary column configuration
 */
export const PORTFOLIO_SUMMARY_COLUMNS: ColumnConfig[] = [
  { key: 'Facility Name', header: 'Facility Name', type: 'text', width: 250 },
  { key: 'Location', header: 'Location', type: 'text', width: 150 },
  { key: 'Overall Rating', header: 'Overall', type: 'number', width: 80 },
  { key: 'Health Rating', header: 'Health', type: 'number', width: 80 },
  { key: 'Staffing Rating', header: 'Staffing', type: 'number', width: 80 },
  { key: 'QM Rating', header: 'QM', type: 'number', width: 80 },
  { key: 'Beds', header: 'Beds', type: 'number', width: 80 },
  { key: 'Risk Level', header: 'Risk Level', type: 'text', width: 100 },
];

/**
 * Format portfolio data for a summary export
 *
 * @param facilities - Array of facility data
 * @returns Formatted summary data for portfolio export
 */
export function formatPortfolioDataForExport(
  facilities: FacilityExportData[]
): Record<string, unknown>[] {
  // Calculate averages for summary row
  const avgOverall = facilities.length > 0
    ? facilities.reduce((sum, f) => sum + (f.overallRating || 0), 0) / facilities.length
    : 0;
  const avgHealth = facilities.length > 0
    ? facilities.reduce((sum, f) => sum + (f.healthInspectionRating || f.healthRating || 0), 0) / facilities.length
    : 0;
  const avgStaffing = facilities.length > 0
    ? facilities.reduce((sum, f) => sum + (f.staffingRating || 0), 0) / facilities.length
    : 0;
  const avgQM = facilities.length > 0
    ? facilities.reduce((sum, f) => sum + (f.qualityMeasureRating || f.qmRating || 0), 0) / facilities.length
    : 0;
  const totalBeds = facilities.reduce((sum, f) => sum + (f.numberOfCertifiedBeds || 0), 0);

  const getRiskLevel = (rating: number | undefined): string => {
    if (!rating) return 'Unknown';
    if (rating <= 2) return 'High Risk';
    if (rating <= 3) return 'Moderate';
    return 'Low Risk';
  };

  // Build facility rows
  const facilityRows = facilities.map(facility => ({
    'Facility Name': facility.providerName || '',
    'Location': `${facility.cityTown || ''}, ${facility.state || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
    'Overall Rating': facility.overallRating || 'N/A',
    'Health Rating': facility.healthInspectionRating || facility.healthRating || 'N/A',
    'Staffing Rating': facility.staffingRating || 'N/A',
    'QM Rating': facility.qualityMeasureRating || facility.qmRating || 'N/A',
    'Beds': facility.numberOfCertifiedBeds || 0,
    'Risk Level': getRiskLevel(facility.overallRating),
  }));

  // Add summary row at the end
  const summaryRow = {
    'Facility Name': `PORTFOLIO SUMMARY (${facilities.length} facilities)`,
    'Location': '',
    'Overall Rating': avgOverall.toFixed(1),
    'Health Rating': avgHealth.toFixed(1),
    'Staffing Rating': avgStaffing.toFixed(1),
    'QM Rating': avgQM.toFixed(1),
    'Beds': totalBeds,
    'Risk Level': '',
  };

  return [...facilityRows, summaryRow];
}

// ============================================
// CONVENIENCE EXPORT FUNCTIONS
// ============================================

/**
 * Export facilities to CSV with default formatting
 */
export function exportFacilitiesToCSV(
  facilities: FacilityExportData[],
  filename: string = 'facilities'
): void {
  const formattedData = formatFacilityDataForExport(facilities);
  exportToCSV(formattedData, filename);
}

/**
 * Export facilities to Excel with default formatting
 */
export function exportFacilitiesToExcel(
  facilities: FacilityExportData[],
  filename: string = 'facilities',
  sheetName: string = 'Facilities'
): void {
  const formattedData = formatFacilityDataForExport(facilities);
  exportToExcel(formattedData, filename, sheetName);
}

/**
 * Export portfolio summary to CSV
 */
export function exportPortfolioToCSV(
  facilities: FacilityExportData[],
  filename: string = 'portfolio-summary'
): void {
  const formattedData = formatPortfolioDataForExport(facilities);
  exportToCSV(formattedData, filename, PORTFOLIO_SUMMARY_COLUMNS);
}

/**
 * Export portfolio summary to Excel
 */
export function exportPortfolioToExcel(
  facilities: FacilityExportData[],
  filename: string = 'portfolio-summary',
  sheetName: string = 'Portfolio'
): void {
  const formattedData = formatPortfolioDataForExport(facilities);
  exportToExcel(formattedData, filename, sheetName, PORTFOLIO_SUMMARY_COLUMNS);
}

// ============================================
// GENERIC DATA EXPORT
// ============================================

/**
 * Quick export any data array to CSV
 */
export function quickExportCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string = 'export'
): void {
  exportToCSV(data, filename);
}

/**
 * Quick export any data array to Excel
 */
export function quickExportExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string = 'export',
  sheetName: string = 'Data'
): void {
  exportToExcel(data, filename, sheetName);
}
