import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash password function
  const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  // Create Entreprises
  const entreprise1 = await prisma.entreprise.create({
    data: {
      nom: 'TechCorp Senegal',
      description: 'Entreprise technologique leader au Sénégal',
      adresse: 'Dakar, Plateau',
      telephone: '+221 33 123 45 67',
      email: 'contact@techcorp.sn',
      estActive: true,
    },
  });

  const entreprise2 = await prisma.entreprise.create({
    data: {
      nom: 'AgriSolutions Mali',
      description: 'Solutions agricoles pour l\'Afrique de l\'Ouest',
      adresse: 'Bamako, ACI 2000',
      telephone: '+223 20 12 34 56',
      email: 'info@agrisolutions.ml',
      estActive: true,
    },
  });

  console.log('Entreprises created');

  // Create Utilisateurs
  const hashedPasswordAdmin = await hashPassword('admin123');
  const hashedPasswordEmploye = await hashPassword('employe123');

  const user1 = await prisma.utilisateur.create({
    data: {
      nom: 'Admin TechCorp',
      email: 'admin@techcorp.sn',
      motDePasse: hashedPasswordAdmin,
      role: 'ADMIN_ENTREPRISE',
      estActif: true,
      entrepriseId: entreprise1.id,
    },
  });

  const user2 = await prisma.utilisateur.create({
    data: {
      nom: 'Employe TechCorp',
      email: 'employe@techcorp.sn',
      motDePasse: hashedPasswordEmploye,
      role: 'EMPLOYE',
      estActif: true,
      entrepriseId: entreprise1.id,
    },
  });

  const user3 = await prisma.utilisateur.create({
    data: {
      nom: 'Admin AgriSolutions',
      email: 'admin@agrisolutions.ml',
      motDePasse: hashedPasswordAdmin,
      role: 'ADMIN_ENTREPRISE',
      estActif: true,
      entrepriseId: entreprise2.id,
    },
  });

  console.log('Utilisateurs created');

  // Create Employes for Entreprise 1
  const employe1 = await prisma.employe.create({
    data: {
      matricule: 'TC001',
      prenom: 'Mamadou',
      nom: 'Diallo',
      email: 'mamadou.diallo@techcorp.sn',
      telephone: '+221 77 123 45 67',
      adresse: 'Dakar, Yoff',
      dateEmbauche: new Date('2023-01-15'),
      statutEmploi: 'ACTIF',
      typeContrat: 'CDI',
      salaireBase: 500000.00,
      allocations: 50000.00,
      deductions: 0.00,
      estActif: true,
      entrepriseId: entreprise1.id,
    },
  });

  const employe2 = await prisma.employe.create({
    data: {
      matricule: 'TC002',
      prenom: 'Fatou',
      nom: 'Sow',
      email: 'fatou.sow@techcorp.sn',
      telephone: '+221 76 234 56 78',
      adresse: 'Dakar, Plateau',
      dateEmbauche: new Date('2023-03-01'),
      statutEmploi: 'ACTIF',
      typeContrat: 'CDI',
      salaireBase: 450000.00,
      allocations: 45000.00,
      deductions: 0.00,
      estActif: true,
      entrepriseId: entreprise1.id,
    },
  });

  const employe3 = await prisma.employe.create({
    data: {
      matricule: 'TC003',
      prenom: 'Ibrahima',
      nom: 'Ba',
      email: 'ibrahima.ba@techcorp.sn',
      telephone: '+221 78 345 67 89',
      adresse: 'Dakar, Medina',
      dateEmbauche: new Date('2023-05-10'),
      statutEmploi: 'ACTIF',
      typeContrat: 'CDD',
      salaireBase: 400000.00,
      allocations: 40000.00,
      deductions: 0.00,
      estActif: true,
      entrepriseId: entreprise1.id,
    },
  });

  // Create Employes for Entreprise 2
  const employe4 = await prisma.employe.create({
    data: {
      matricule: 'AS001',
      prenom: 'Aminata',
      nom: 'Traore',
      email: 'aminata.traore@agrisolutions.ml',
      telephone: '+223 70 12 34 56',
      adresse: 'Bamako, Koulikoro',
      dateEmbauche: new Date('2023-02-20'),
      statutEmploi: 'ACTIF',
      typeContrat: 'CDI',
      salaireBase: 350000.00,
      allocations: 35000.00,
      deductions: 0.00,
      estActif: true,
      entrepriseId: entreprise2.id,
    },
  });

  const employe5 = await prisma.employe.create({
    data: {
      matricule: 'AS002',
      prenom: 'Souleymane',
      nom: 'Coulibaly',
      email: 'souleymane.coulibaly@agrisolutions.ml',
      telephone: '+223 71 23 45 67',
      adresse: 'Bamako, ACI 2000',
      dateEmbauche: new Date('2023-04-05'),
      statutEmploi: 'ACTIF',
      typeContrat: 'CDI',
      salaireBase: 380000.00,
      allocations: 38000.00,
      deductions: 0.00,
      estActif: true,
      entrepriseId: entreprise2.id,
    },
  });

  console.log('Employes created');

  // Create CyclePaie
  const cycle1 = await prisma.cyclePaie.create({
    data: {
      nom: 'Cycle Paie Janvier 2024',
      description: 'Cycle de paie pour le mois de janvier 2024',
      dateDebut: new Date('2024-01-01'),
      dateFin: new Date('2024-01-31'),
      statut: 'OUVERT',
      frequence: 'MENSUEL',
      entrepriseId: entreprise1.id,
    },
  });

  const cycle2 = await prisma.cyclePaie.create({
    data: {
      nom: 'Cycle Paie Janvier 2024',
      description: 'Cycle de paie pour le mois de janvier 2024',
      dateDebut: new Date('2024-01-01'),
      dateFin: new Date('2024-01-31'),
      statut: 'OUVERT',
      frequence: 'MENSUEL',
      entrepriseId: entreprise2.id,
    },
  });

  console.log('Cycles de paie created');

  // Create Bulletins
  const bulletin1 = await prisma.bulletin.create({
    data: {
      numeroBulletin: 'BL-TC001-202401',
      periodeDebut: new Date('2024-01-01'),
      periodeFin: new Date('2024-01-31'),
      salaireBase: 500000.00,
      allocations: 50000.00,
      deductions: 0.00,
      totalAPayer: 550000.00,
      statutPaiement: 'PAYE',
      cycleId: cycle1.id,
      employeId: employe1.id,
    },
  });

  const bulletin2 = await prisma.bulletin.create({
    data: {
      numeroBulletin: 'BL-TC002-202401',
      periodeDebut: new Date('2024-01-01'),
      periodeFin: new Date('2024-01-31'),
      salaireBase: 450000.00,
      allocations: 45000.00,
      deductions: 0.00,
      totalAPayer: 495000.00,
      statutPaiement: 'PAYE',
      cycleId: cycle1.id,
      employeId: employe2.id,
    },
  });

  const bulletin3 = await prisma.bulletin.create({
    data: {
      numeroBulletin: 'BL-TC003-202401',
      periodeDebut: new Date('2024-01-01'),
      periodeFin: new Date('2024-01-31'),
      salaireBase: 400000.00,
      allocations: 40000.00,
      deductions: 0.00,
      totalAPayer: 440000.00,
      statutPaiement: 'EN_ATTENTE',
      cycleId: cycle1.id,
      employeId: employe3.id,
    },
  });

  const bulletin4 = await prisma.bulletin.create({
    data: {
      numeroBulletin: 'BL-AS001-202401',
      periodeDebut: new Date('2024-01-01'),
      periodeFin: new Date('2024-01-31'),
      salaireBase: 350000.00,
      allocations: 35000.00,
      deductions: 0.00,
      totalAPayer: 385000.00,
      statutPaiement: 'PAYE',
      cycleId: cycle2.id,
      employeId: employe4.id,
    },
  });

  const bulletin5 = await prisma.bulletin.create({
    data: {
      numeroBulletin: 'BL-AS002-202401',
      periodeDebut: new Date('2024-01-01'),
      periodeFin: new Date('2024-01-31'),
      salaireBase: 380000.00,
      allocations: 38000.00,
      deductions: 0.00,
      totalAPayer: 418000.00,
      statutPaiement: 'EN_ATTENTE',
      cycleId: cycle2.id,
      employeId: employe5.id,
    },
  });

  console.log('Bulletins created');

  // Create Paiements
  const paiement1 = await prisma.paiement.create({
    data: {
      montant: 550000.00,
      datePaiement: new Date('2024-02-01'),
      modePaiement: 'VIREMENT',
      statut: 'PAYE',
      reference: 'VIR-2024-001',
      bulletinId: bulletin1.id,
      entrepriseId: entreprise1.id,
    },
  });

  const paiement2 = await prisma.paiement.create({
    data: {
      montant: 495000.00,
      datePaiement: new Date('2024-02-01'),
      modePaiement: 'CHEQUE',
      statut: 'PAYE',
      reference: 'CHQ-2024-001',
      bulletinId: bulletin2.id,
      entrepriseId: entreprise1.id,
    },
  });

  const paiement3 = await prisma.paiement.create({
    data: {
      montant: 385000.00,
      datePaiement: new Date('2024-02-01'),
      modePaiement: 'ESPECES',
      statut: 'PAYE',
      reference: 'ESP-2024-001',
      bulletinId: bulletin4.id,
      entrepriseId: entreprise2.id,
    },
  });

  console.log('Paiements created');

  // Create Rapports
  const rapport1 = await prisma.rapport.create({
    data: {
      typeRapport: 'BULLETINS',
      contenu: {
        totalBulletins: 3,
        periode: 'Janvier 2024',
        entreprise: 'TechCorp Senegal'
      },
      entrepriseId: entreprise1.id,
    },
  });

  const rapport2 = await prisma.rapport.create({
    data: {
      typeRapport: 'PAIEMENTS',
      contenu: {
        totalPaiements: 2,
        montantTotal: 1045000.00,
        periode: 'Janvier 2024',
        entreprise: 'TechCorp Senegal'
      },
      entrepriseId: entreprise1.id,
    },
  });

  console.log('Rapports created');

  // Create JournalAudits
  await prisma.journalAudit.create({
    data: {
      action: 'CREATION',
      details: { entity: 'Entreprise', id: entreprise1.id },
      utilisateurId: user1.id,
      entrepriseId: entreprise1.id,
    },
  });

  await prisma.journalAudit.create({
    data: {
      action: 'CREATION',
      details: { entity: 'Employe', id: employe1.id },
      utilisateurId: user1.id,
      entrepriseId: entreprise1.id,
      employeId: employe1.id,
    },
  });

  await prisma.journalAudit.create({
    data: {
      action: 'GENERATION',
      details: { entity: 'Bulletin', numero: 'BL-TC001-202401' },
      utilisateurId: user1.id,
      entrepriseId: entreprise1.id,
      employeId: employe1.id,
      bulletinId: bulletin1.id,
    },
  });

  await prisma.journalAudit.create({
    data: {
      action: 'MODIFICATION',
      details: { entity: 'Paiement', statut: 'PAYE' },
      utilisateurId: user1.id,
      entrepriseId: entreprise1.id,
      paiementId: paiement1.id,
    },
  });

  console.log('JournalAudits created');

  // Create TableauDeBord
  const tableau1 = await prisma.tableauDeBord.create({
    data: {
      nom: 'Dashboard Principal',
      configuration: {
        widgets: ['employes_actifs', 'paiements_mensuels', 'rapports_generes'],
        theme: 'light'
      },
      entrepriseId: entreprise1.id,
    },
  });

  const tableau2 = await prisma.tableauDeBord.create({
    data: {
      nom: 'Dashboard Financier',
      configuration: {
        widgets: ['salaires_totaux', 'deductions', 'allocations'],
        theme: 'dark'
      },
      entrepriseId: entreprise2.id,
    },
  });

  console.log('Tableaux de bord created');

  // Create ParametreEntreprise
  await prisma.parametreEntreprise.create({
    data: {
      cle: 'devise',
      valeur: 'XOF',
      entrepriseId: entreprise1.id,
    },
  });

  await prisma.parametreEntreprise.create({
    data: {
      cle: 'langue',
      valeur: 'fr',
      entrepriseId: entreprise1.id,
    },
  });

  await prisma.parametreEntreprise.create({
    data: {
      cle: 'frequence_paie',
      valeur: 'mensuelle',
      entrepriseId: entreprise1.id,
    },
  });

  await prisma.parametreEntreprise.create({
    data: {
      cle: 'devise',
      valeur: 'XOF',
      entrepriseId: entreprise2.id,
    },
  });

  await prisma.parametreEntreprise.create({
    data: {
      cle: 'langue',
      valeur: 'fr',
      entrepriseId: entreprise2.id,
    },
  });

  console.log('Parametres entreprise created');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
