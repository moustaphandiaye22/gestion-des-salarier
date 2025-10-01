const XLSX = require('xlsx');

// Sample employee data
const data = [
  ['matricule', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'dateEmbauche', 'statutEmploi', 'typeContrat', 'salaireBase', 'allocations', 'deductions', 'entrepriseId'],
  ['EMP001', 'Dupont', 'Jean', 'jean.dupont@example.com', '0123456789', '123 Rue de la Paix, Paris', '2023-01-15', 'ACTIF', 'CDI', 250000, 50000, 20000, 1],
  ['EMP002', 'Martin', 'Marie', 'marie.martin@example.com', '0987654321', '456 Avenue des Champs, Lyon', '2023-02-20', 'ACTIF', 'CDD', 220000, 40000, 15000, 1],
  ['EMP003', 'Durand', 'Pierre', 'pierre.durand@example.com', '0111111111', '789 Boulevard Saint-Michel, Marseille', '2023-03-10', 'CONGE', 'CDI', 280000, 60000, 25000, 1],
  ['EMP004', 'Leroy', 'Sophie', 'sophie.leroy@example.com', '0222222222', '321 Place Bellecour, Lyon', '2023-04-05', 'ACTIF', 'CDI', 260000, 55000, 22000, 1],
  ['EMP005', 'Moreau', 'Luc', 'luc.moreau@example.com', '0333333333', '654 Rue de la République, Toulouse', '2023-05-12', 'ACTIF', 'CDD', 240000, 45000, 18000, 1],
];

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);

// Save to file
XLSX.utils.book_append_sheet(wb, ws, 'Employees');
XLSX.writeFile(wb, 'sample_employees.xlsx');

console.log('Sample Excel file created: sample_employees.xlsx');
