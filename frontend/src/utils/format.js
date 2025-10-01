// Utility functions for formatting

export function formatCFA(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 FCFA';
  }

  // Convert to number and format with proper separators
  const num = Number(amount);
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num) + ' FCFA';
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('fr-FR');
  } catch {
    return '-';
  }
}
