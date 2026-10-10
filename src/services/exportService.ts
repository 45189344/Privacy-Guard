/**
 * Export Service with Security Defenses
 * Defends against CSV Formula Injection (CWE-1236)
 */

export function sanitizeCsvField(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let stringValue = String(value);

  // If the field starts with formula trigger characters: = + - @ \t \r
  // prepend an apostrophe to neutralize formula execution in Excel/Sheets/Calc
  const formulaChars = ['=', '+', '-', '@', '\t', '\r'];
  if (formulaChars.some((char) => stringValue.startsWith(char))) {
    stringValue = `'${stringValue}`;
  }

  // Escape existing quotes by doubling them
  const escaped = stringValue.replace(/"/g, '""');

  return `"${escaped}"`;
}

export function generateCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const headerRow = headers.map(sanitizeCsvField).join(',');
  const dataRows = rows.map((row) => row.map(sanitizeCsvField).join(','));
  return [headerRow, ...dataRows].join('\r\n');
}

export function downloadCsv(filename: string, csvContent: string): void {
  // Use UTF-8 BOM so Excel correctly parses special characters
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
