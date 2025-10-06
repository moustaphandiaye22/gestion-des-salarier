import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash password function
  const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  // Check if entreprises already exist to avoid unique constraint error
  const existingEntreprises = await prisma.entreprise.findMany({
    where: {
      nom: {
        in: ['TechCorp Senegal', 'AgriSolutions Mali'],
      },
    },
  });

  let entreprise1, entreprise2;

  if (existingEntreprises.length === 0) {
    entreprise1 = await prisma.entreprise.create({
      data: {
        nom: 'TechCorp Senegal',
        description: 'Entreprise technologique leader au Sénégal',
        adresse: 'Dakar, Plateau',
        telephone: '+221 33 123 45 67',
        email: 'contact@techcorp.sn',
        logo: 'images/logos/LOGOst.png',
        estActive: true,
      },
    });

    entreprise2 = await prisma.entreprise.create({
      data: {
        nom: 'AgriSolutions Mali',
        description: 'Solutions agricoles pour l\'Afrique de l\'Ouest',
        adresse: 'Bamako, ACI 2000',
        telephone: '+223 20 12 34 56',
        email: 'info@agrisolutions.ml',
        logo: 'images/logos/images.png',
        estActive: true,
      },
    });
  } else {
    entreprise1 = existingEntreprises.find(e => e.nom === 'TechCorp Senegal');
    entreprise2 = existingEntreprises.find(e => e.nom === 'AgriSolutions Mali');

    // Update existing entreprises with logos if not set
    if (entreprise1 && !entreprise1.logo) {
      entreprise1 = await prisma.entreprise.update({
        where: { id: entreprise1.id },
        data: { logo: 'images/logos/LOGOst.png' }
      });
    }
    if (entreprise2 && !entreprise2.logo) {
      entreprise2 = await prisma.entreprise.update({
        where: { id: entreprise2.id },
        data: { logo: 'images/logos/images.png' }
      });
    }
  }

  console.log('Entreprises created');

  // Create Utilisateurs - check each one individually to avoid conflicts
  const hashedPasswordAdmin = await hashPassword('admin123');
  const hashedPasswordEmploye = await hashPassword('employe123');
  const hashedPasswordCaissier = await hashPassword('caissier123');

  // Admin TechCorp
  let user1 = await prisma.utilisateur.findUnique({
    where: { email: 'admin@techcorp.sn' }
  });
  if (!user1) {
    user1 = await prisma.utilisateur.create({
      data: {
        nom: 'Admin TechCorp',
        email: 'admin@techcorp.sn',
        motDePasse: hashedPasswordAdmin,
        role: 'ADMIN_ENTREPRISE',
        estActif: true,
        entrepriseId: entreprise1.id,
      },
    });
  }

  // Employe TechCorp
  let user2 = await prisma.utilisateur.findUnique({
    where: { email: 'employe@techcorp.sn' }
  });
  if (!user2) {
    user2 = await prisma.utilisateur.create({
      data: {
        nom: 'Employe TechCorp',
        email: 'employe@techcorp.sn',
        motDePasse: hashedPasswordEmploye,
        role: 'EMPLOYE',
        estActif: true,
        entrepriseId: entreprise1.id,
      },
    });
  }

  // Caissier TechCorp
  let user3 = await prisma.utilisateur.findUnique({
    where: { email: 'caissier@techcorp.sn' }
  });
  if (!user3) {
    user3 = await prisma.utilisateur.create({
      data: {
        nom: 'Caissier TechCorp',
        email: 'caissier@techcorp.sn',
        motDePasse: hashedPasswordCaissier,
        role: 'CAISSIER',
        estActif: true,
        entrepriseId: entreprise1.id,
      },
    });
  }

  // Admin AgriSolutions
  let user4 = await prisma.utilisateur.findUnique({
    where: { email: 'admin@agrisolutions.ml' }
  });
  if (!user4) {
    user4 = await prisma.utilisateur.create({
      data: {
        nom: 'Admin AgriSolutions',
        email: 'admin@agrisolutions.ml',
        motDePasse: hashedPasswordAdmin,
        role: 'ADMIN_ENTREPRISE',
        estActif: true,
        entrepriseId: entreprise2.id,
      },
    });
  }

  // Caissier AgriSolutions
  let user5 = await prisma.utilisateur.findUnique({
    where: { email: 'caissier@agrisolutions.ml' }
  });
  if (!user5) {
    user5 = await prisma.utilisateur.create({
      data: {
        nom: 'Caissier AgriSolutions',
        email: 'caissier@agrisolutions.ml',
        motDePasse: hashedPasswordCaissier,
        role: 'CAISSIER',
        estActif: true,
        entrepriseId: entreprise2.id,
      },
    });
  }

  // Super Admin
  let superAdmin = await prisma.utilisateur.findUnique({
    where: { email: 'superadmin@pay.com' }
  });
  if (!superAdmin) {
    const superAdminPassword = await hashPassword('superadmin123');
    superAdmin = await prisma.utilisateur.create({
      data: {
        nom: 'Super Administrateur',
        email: 'superadmin@pay.com',
        motDePasse: superAdminPassword,
        role: 'SUPER_ADMIN',
        estActif: true,
        // No entrepriseId for super admin
      },
    });
  }

  console.log('Utilisateurs created');

  // Check if employes already exist
  const existingEmployes = await prisma.employe.findMany({
    where: {
      matricule: {
        in: ['TC001', 'TC002', 'TC003', 'AS001', 'AS002'],
      },
    },
  });

  let employe1, employe2, employe3, employe4, employe5;

  if (existingEmployes.length === 0) {
    // Create Employes for Entreprise 1
    employe1 = await prisma.employe.create({
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

    employe2 = await prisma.employe.create({
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

    employe3 = await prisma.employe.create({
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
    employe4 = await prisma.employe.create({
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

    employe5 = await prisma.employe.create({
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
  } else {
    employe1 = existingEmployes.find(e => e.matricule === 'TC001');
    employe2 = existingEmployes.find(e => e.matricule === 'TC002');
    employe3 = existingEmployes.find(e => e.matricule === 'TC003');
    employe4 = existingEmployes.find(e => e.matricule === 'AS001');
    employe5 = existingEmployes.find(e => e.matricule === 'AS002');
  }

  console.log('Employes created');

  // Check if cycles already exist
  const existingCycles = await prisma.cyclePaie.findMany({
    where: {
      nom: 'Cycle Paie Janvier 2024',
    },
  });

  let cycle1, cycle2;

  if (existingCycles.length === 0) {
    // Create CyclePaie
    cycle1 = await prisma.cyclePaie.create({
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

    cycle2 = await prisma.cyclePaie.create({
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
  } else {
    cycle1 = existingCycles.find(c => c.entrepriseId === entreprise1.id);
    cycle2 = existingCycles.find(c => c.entrepriseId === entreprise2.id);
  }

  console.log('Cycles de paie created');

  // Check if bulletins already exist
  const existingBulletins = await prisma.bulletin.findMany({
    where: {
      numeroBulletin: {
        in: ['BL-TC001-202401', 'BL-TC002-202401', 'BL-TC003-202401', 'BL-AS001-202401', 'BL-AS002-202401'],
      },
    },
  });

  let bulletin1, bulletin2, bulletin3, bulletin4, bulletin5;

  if (existingBulletins.length === 0) {
    // Create Bulletins
    bulletin1 = await prisma.bulletin.create({
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

    bulletin2 = await prisma.bulletin.create({
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

    bulletin3 = await prisma.bulletin.create({
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

    bulletin4 = await prisma.bulletin.create({
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

    bulletin5 = await prisma.bulletin.create({
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
  } else {
    bulletin1 = existingBulletins.find(b => b.numeroBulletin === 'BL-TC001-202401');
    bulletin2 = existingBulletins.find(b => b.numeroBulletin === 'BL-TC002-202401');
    bulletin3 = existingBulletins.find(b => b.numeroBulletin === 'BL-TC003-202401');
    bulletin4 = existingBulletins.find(b => b.numeroBulletin === 'BL-AS001-202401');
    bulletin5 = existingBulletins.find(b => b.numeroBulletin === 'BL-AS002-202401');
  }

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

  // Additional cashier test payments
  const paiement4 = await prisma.paiement.create({
    data: {
      montant: 440000.00,
      datePaiement: new Date('2024-02-15'),
      modePaiement: 'ESPECES',
      statut: 'PAYE',
      reference: 'ESP-2024-002',
      bulletinId: bulletin3.id,
      entrepriseId: entreprise1.id,
    },
  });

  const paiement5 = await prisma.paiement.create({
    data: {
      montant: 418000.00,
      datePaiement: new Date('2024-02-20'),
      modePaiement: 'CHEQUE',
      statut: 'PAYE',
      reference: 'CHQ-2024-002',
      bulletinId: bulletin5.id,
      entrepriseId: entreprise2.id,
    },
  });

  // Pending payment for cashier to process
  const paiement6 = await prisma.paiement.create({
    data: {
      montant: 418000.00,
      datePaiement: new Date('2024-02-25'),
      modePaiement: 'VIREMENT',
      statut: 'EN_ATTENTE',
      reference: 'VIR-2024-003',
      bulletinId: bulletin5.id,
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

  // Create sample KPI data for testing
  const sampleKpiData1 = await prisma.kpiData.create({
    data: {
      nom: 'NOMBRE_EMPLOYES',
      valeur: 3,
      valeurPrecedente: 2,
      unite: 'employés',
      typeKpi: 'NOMBRE_EMPLOYES',
      periode: 'TEMPS_REEL',
      dateCalcul: new Date(),
      tableauDeBordId: tableau1.id,
      entrepriseId: entreprise1.id,
    },
  });

  const sampleKpiData2 = await prisma.kpiData.create({
    data: {
      nom: 'MASSE_SALARIALE',
      valeur: 1350000.00,
      valeurPrecedente: 1200000.00,
      unite: 'FCFA',
      typeKpi: 'MASSE_SALARIALE',
      periode: 'MOIS',
      dateCalcul: new Date(),
      tableauDeBordId: tableau1.id,
      entrepriseId: entreprise1.id,
    },
  });

  const sampleKpiData3 = await prisma.kpiData.create({
    data: {
      nom: 'NOMBRE_EMPLOYES',
      valeur: 2,
      valeurPrecedente: 2,
      unite: 'employés',
      typeKpi: 'NOMBRE_EMPLOYES',
      periode: 'TEMPS_REEL',
      dateCalcul: new Date(),
      tableauDeBordId: tableau2.id,
      entrepriseId: entreprise2.id,
    },
  });

  console.log('Sample KPI data created');

  // Create sample alerts
  const sampleAlerte1 = await prisma.alerte.create({
    data: {
      titre: 'Nouveau employé ajouté',
      message: 'Un nouvel employé a été ajouté au système aujourd\'hui.',
      type: 'NOUVEAU_EMPLOYE',
      severite: 'FAIBLE',
      estLue: false,
      dateCreation: new Date(),
      tableauDeBordId: tableau1.id,
      entrepriseId: entreprise1.id,
      utilisateurId: user1.id,
    },
  });

  const sampleAlerte2 = await prisma.alerte.create({
    data: {
      titre: 'Taux de paiement élevé',
      message: 'Le taux de paiement est excellent ce mois-ci (100%).',
      type: 'PAIEMENT_ECHEC',
      severite: 'FAIBLE',
      estLue: true,
      dateCreation: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours ago
      dateLecture: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 jour ago
      tableauDeBordId: tableau1.id,
      entrepriseId: entreprise1.id,
      utilisateurId: user1.id,
    },
  });

  console.log('Sample alerts created');

  // Create sample widgets
  const sampleWidget1 = await prisma.widget.create({
    data: {
      nom: 'KPI Employés',
      type: 'KPI_CARD',
      configuration: {
        kpiType: 'NOMBRE_EMPLOYES',
        showTrend: true,
        color: 'blue'
      },
      positionX: 0,
      positionY: 0,
      largeur: 3,
      hauteur: 2,
      tableauDeBordId: tableau1.id,
      estVisible: true,
      ordre: 1,
      dateCreation: new Date(),
    },
  });

  const sampleWidget2 = await prisma.widget.create({
    data: {
      nom: 'Graphique Salaires',
      type: 'LINE_CHART',
      configuration: {
        dataSource: 'MASSE_SALARIALE',
        period: '6months',
        showLegend: true
      },
      positionX: 3,
      positionY: 0,
      largeur: 6,
      hauteur: 4,
      tableauDeBordId: tableau1.id,
      estVisible: true,
      ordre: 2,
      dateCreation: new Date(),
    },
  });

  console.log('Sample widgets created');

  // Create sample exports
  const sampleExport1 = await prisma.export.create({
    data: {
      nom: 'Export Données Analytiques - Janvier 2024',
      type: 'DONNEES_ANALYTIQUES',
      format: 'PDF',
      statut: 'TERMINE',
      cheminFichier: 'exports/analyse-janvier-2024.pdf',
      parametres: {
        dateDebut: '2024-01-01',
        dateFin: '2024-01-31'
      },
      dateCreation: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 jours ago
      dateFin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 300000), // 7 jours ago + 5 minutes
      utilisateurId: user1.id,
      entrepriseId: entreprise1.id,
    },
  });

  const sampleExport2 = await prisma.export.create({
    data: {
      nom: 'Export Liste Employés - TechCorp',
      type: 'LISTE_EMPLOYES',
      format: 'EXCEL',
      statut: 'EN_COURS',
      parametres: {},
      dateCreation: new Date(),
      utilisateurId: user1.id,
      entrepriseId: entreprise1.id,
    },
  });

  console.log('Sample exports created');

  console.log('Parametres entreprise skipped - moved to global parameters');

  // Check if global parameters already exist
  const existingGlobalParams = await prisma.parametreGlobal.findMany({
    where: {
      cle: {
        in: ['app_name', 'app_version', 'max_file_size', 'session_timeout', 'support_email', 'maintenance_mode', 'devise', 'langue', 'frequence_paie'],
      },
    },
  });

  if (existingGlobalParams.length === 0) {
    // Create ParametresGlobaux
    await prisma.parametreGlobal.create({
      data: {
        cle: 'app_name',
        valeur: 'Payroll Platform',
        description: 'Nom de l\'application',
        categorie: 'GENERAL',
      },
    });

    await prisma.parametreGlobal.create({
      data: {
        cle: 'app_version',
        valeur: '1.0.0',
        description: 'Version actuelle de l\'application',
        categorie: 'GENERAL',
      },
    });

    await prisma.parametreGlobal.create({
      data: {
        cle: 'max_file_size',
        valeur: '10485760',
        description: 'Taille maximale des fichiers en octets (10MB)',
        categorie: 'UPLOAD',
      },
    });

    await prisma.parametreGlobal.create({
      data: {
        cle: 'session_timeout',
        valeur: '3600',
        description: 'Timeout de session en secondes (1 heure)',
        categorie: 'SECURITY',
      },
    });

    await prisma.parametreGlobal.create({
      data: {
        cle: 'support_email',
        valeur: 'support@payrollplatform.com',
        description: 'Email de support technique',
        categorie: 'SUPPORT',
      },
    });

    await prisma.parametreGlobal.create({
      data: {
        cle: 'maintenance_mode',
        valeur: 'false',
        description: 'Mode maintenance activé/désactivé',
        categorie: 'MAINTENANCE',
      },
    });

    // Company parameters moved to global
    await prisma.parametreGlobal.create({
      data: {
        cle: 'devise',
        valeur: 'XOF',
        description: 'Devise par défaut (Franc CFA)',
        categorie: 'FINANCE',
      },
    });

    await prisma.parametreGlobal.create({
      data: {
        cle: 'langue',
        valeur: 'fr',
        description: 'Langue par défaut de l\'application',
        categorie: 'GENERAL',
      },
    });

    await prisma.parametreGlobal.create({
      data: {
        cle: 'frequence_paie',
        valeur: 'mensuelle',
        description: 'Fréquence de paie par défaut',
        categorie: 'PAIE',
      },
    });
  }

  console.log('Parametres globaux created');

  // Check if licences already exist
  const existingLicences = await prisma.licence.findMany({
    where: {
      nom: {
        in: ['Licence Standard TechCorp', 'Licence Premium AgriSolutions', 'Licence Entreprise Demo', 'Licence Standard Expirée'],
      },
    },
  });

  if (existingLicences.length === 0) {
    // Create Licences
    await prisma.licence.create({
      data: {
        nom: 'Licence Standard TechCorp',
        description: 'Licence standard pour TechCorp Senegal',
        typeLicence: 'STANDARD',
        statut: 'ACTIVE',
        dateDebut: new Date('2024-01-01'),
        dateFin: new Date('2024-12-31'),
        limiteUtilisateurs: 50,
        entrepriseId: entreprise1.id,
      },
    });

    await prisma.licence.create({
      data: {
        nom: 'Licence Premium AgriSolutions',
        description: 'Licence premium pour AgriSolutions Mali',
        typeLicence: 'PREMIUM',
        statut: 'ACTIVE',
        dateDebut: new Date('2024-01-01'),
        dateFin: new Date('2024-12-31'),
        limiteUtilisateurs: 100,
        entrepriseId: entreprise2.id,
      },
    });

    await prisma.licence.create({
      data: {
        nom: 'Licence Entreprise Demo',
        description: 'Licence entreprise pour démonstration',
        typeLicence: 'ENTERPRISE',
        statut: 'SUSPENDUE',
        dateDebut: new Date('2024-06-01'),
        dateFin: new Date('2025-05-31'),
        limiteUtilisateurs: 500,
        // Not assigned to any company yet
      },
    });

    await prisma.licence.create({
      data: {
        nom: 'Licence Standard Expirée',
        description: 'Licence expirée pour test',
        typeLicence: 'STANDARD',
        statut: 'EXPIREE',
        dateDebut: new Date('2023-01-01'),
        dateFin: new Date('2023-12-31'),
        limiteUtilisateurs: 25,
        entrepriseId: entreprise1.id,
      },
    });
  }

  console.log('Licences created');

  // Check if professions already exist
  const existingProfessions = await prisma.profession.findMany({
    where: {
      nom: {
        in: ['Développeur', 'Designer', 'Chef de Projet', 'Ingénieur Agricole', 'Technicien', 'Manager', 'Analyste', 'Consultant'],
      },
    },
  });

  if (existingProfessions.length === 0) {
    // Create Professions
    await prisma.profession.create({
      data: {
        nom: 'Développeur',
        description: 'Développement d\'applications web et mobiles',
        categorie: 'Technique',
        estActive: true,
      },
    });

    await prisma.profession.create({
      data: {
        nom: 'Designer',
        description: 'Conception d\'interfaces utilisateur et expérience utilisateur',
        categorie: 'Créatif',
        estActive: true,
      },
    });

    await prisma.profession.create({
      data: {
        nom: 'Chef de Projet',
        description: 'Gestion et coordination de projets',
        categorie: 'Management',
        estActive: true,
      },
    });

    await prisma.profession.create({
      data: {
        nom: 'Ingénieur Agricole',
        description: 'Expertise technique en agriculture et agroalimentaire',
        categorie: 'Agriculture',
        estActive: true,
      },
    });

    await prisma.profession.create({
      data: {
        nom: 'Technicien',
        description: 'Support technique et maintenance',
        categorie: 'Technique',
        estActive: true,
      },
    });

    await prisma.profession.create({
      data: {
        nom: 'Manager',
        description: 'Management d\'équipes et gestion opérationnelle',
        categorie: 'Management',
        estActive: true,
      },
    });

    await prisma.profession.create({
      data: {
        nom: 'Analyste',
        description: 'Analyse de données et business intelligence',
        categorie: 'Analyse',
        estActive: true,
      },
    });

    await prisma.profession.create({
      data: {
        nom: 'Consultant',
        description: 'Conseil et expertise métier',
        categorie: 'Conseil',
        estActive: true,
      },
    });
  }

  console.log('Professions created');

  // Update some employees with profession IDs
  if (employe1 && existingProfessions.length > 0) {
    const devProfession = existingProfessions.find(p => p.nom === 'Développeur');
    if (devProfession) {
      await prisma.employe.update({
        where: { id: employe1.id },
        data: { professionId: devProfession.id },
      });
    }
  }

  if (employe2 && existingProfessions.length > 0) {
    const designerProfession = existingProfessions.find(p => p.nom === 'Designer');
    if (designerProfession) {
      await prisma.employe.update({
        where: { id: employe2.id },
        data: { professionId: designerProfession.id },
      });
    }
  }

  if (employe4 && existingProfessions.length > 0) {
    const agriProfession = existingProfessions.find(p => p.nom === 'Ingénieur Agricole');
    if (agriProfession) {
      await prisma.employe.update({
        where: { id: employe4.id },
        data: { professionId: agriProfession.id },
      });
    }
  }

  console.log('Employee professions updated');

  // Générer automatiquement les QR codes pour tous les employés existants
  console.log('Génération des QR codes pour les employés...');

  try {
    // Importer les services nécessaires (fichiers compilés)
    const { QrCodeService } = await import('../dist/src/service/qrCodeService.js');
    const { FileService } = await import('../dist/src/service/fileService.js');
    const { EmployeService } = await import('../dist/src/service/employeService.js');

    const qrCodeService = new QrCodeService();
    const fileService = new FileService();
    const employeService = new EmployeService();

    // Récupérer tous les employés
    const allEmployes = await prisma.employe.findMany({
      include: { entreprise: true }
    });

    for (const employe of allEmployes) {
      try {
        // Générer le QR code
        const qrCodeDataURL = await qrCodeService.generateEmployeeQrCode(employe.id, employe.entrepriseId);

        // Sauvegarder l'image
        const imagePath = await fileService.saveQrCodeImage(qrCodeDataURL, employe.id, employe.entrepriseId);

        // Générer le contenu du QR code
        const qrContent = qrCodeService.generateQrContent(employe.id, employe.entrepriseId);

        // Mettre à jour l'employé
        await prisma.employe.update({
          where: { id: employe.id },
          data: {
            qrCode: qrContent,
            qrCodeGenere: new Date(),
            qrCodeImagePath: imagePath
          }
        });

        console.log(`QR code généré pour ${employe.prenom} ${employe.nom} (${employe.matricule})`);
      } catch (error) {
        console.error(`Erreur génération QR code pour ${employe.prenom} ${employe.nom}:`, error.message);
      }
    }

    console.log('Génération des QR codes terminée');
  } catch (error) {
    console.error('Erreur lors de la génération des QR codes:', error.message);
  }

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
