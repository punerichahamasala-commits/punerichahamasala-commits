
import { Employee } from '../types';

// Helper to sanitize CSV fields
const sanitizeField = (field: string | number): string => {
  const str = String(field);
  // If the string contains a comma, double quote, or newline, wrap it in double quotes
  // and escape any existing double quotes by doubling them.
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};


export const exportToCSV = (employees: Employee[], fileName: string) => {
  if (!employees || employees.length === 0) {
    console.warn("No data to export.");
    return;
  }

  const headers = ['Employee ID', 'Employee Name', 'Role', 'Training', 'Perimeter', 'Score'];
  
  const csvRows = [headers.join(',')]; // Start with the header row

  employees.forEach(employee => {
    employee.proficiency.forEach(prof => {
      const row = [
        sanitizeField(employee.id),
        sanitizeField(employee.name),
        sanitizeField(employee.role),
        sanitizeField(employee.training),
        sanitizeField(prof.perimeter),
        sanitizeField(prof.score)
      ];
      csvRows.push(row.join(','));
    });
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) { // feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
