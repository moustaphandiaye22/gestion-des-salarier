-- CreateTable
CREATE TABLE `companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `adresse` VARCHAR(255) NULL,
    `telephone` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `estActive` BOOLEAN NOT NULL DEFAULT true,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `companies_estActive_idx`(`estActive`),
    UNIQUE INDEX `companies_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `motDePasse` VARCHAR(255) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN_ENTREPRISE', 'CAISSIER', 'EMPLOYE') NOT NULL DEFAULT 'EMPLOYE',
    `estActif` BOOLEAN NOT NULL DEFAULT true,
    `entrepriseId` INTEGER NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_entrepriseId_idx`(`entrepriseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricule` VARCHAR(50) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `telephone` VARCHAR(20) NULL,
    `adresse` VARCHAR(255) NULL,
    `dateEmbauche` DATETIME(3) NOT NULL,
    `statutEmploi` ENUM('ACTIF', 'CONGE', 'LICENCIE', 'RETRAITE') NOT NULL,
    `typeContrat` ENUM('CDI', 'CDD', 'INTERIM', 'STAGE') NOT NULL,
    `salaireBase` DECIMAL(15, 2) NOT NULL,
    `allocations` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `deductions` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `estActif` BOOLEAN NOT NULL DEFAULT true,
    `entrepriseId` INTEGER NOT NULL,

    INDEX `employees_entrepriseId_estActif_idx`(`entrepriseId`, `estActif`),
    INDEX `employees_statutEmploi_idx`(`statutEmploi`),
    INDEX `employees_typeContrat_idx`(`typeContrat`),
    UNIQUE INDEX `employees_entrepriseId_matricule_key`(`entrepriseId`, `matricule`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payslips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroBulletin` VARCHAR(50) NOT NULL,
    `periodeDebut` DATETIME(3) NOT NULL,
    `periodeFin` DATETIME(3) NOT NULL,
    `salaireBase` DECIMAL(15, 2) NOT NULL,
    `allocations` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `deductions` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `totalAPayer` DECIMAL(15, 2) NOT NULL,
    `statutPaiement` ENUM('EN_ATTENTE', 'PAYE', 'ECHEC') NOT NULL DEFAULT 'EN_ATTENTE',
    `dateGeneration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cycleId` INTEGER NOT NULL,
    `employeId` INTEGER NOT NULL,

    UNIQUE INDEX `payslips_numeroBulletin_key`(`numeroBulletin`),
    INDEX `payslips_statutPaiement_idx`(`statutPaiement`),
    UNIQUE INDEX `payslips_cycleId_employeId_key`(`cycleId`, `employeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pay_cycles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periodeDebut` DATETIME(3) NOT NULL,
    `periodeFin` DATETIME(3) NOT NULL,
    `typeCycle` ENUM('MENSUEL', 'HEBDOMADAIRE', 'QUINZAINE') NOT NULL,
    `estFerme` BOOLEAN NOT NULL DEFAULT false,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `entrepriseId` INTEGER NOT NULL,

    UNIQUE INDEX `pay_cycles_entrepriseId_periodeDebut_periodeFin_key`(`entrepriseId`, `periodeDebut`, `periodeFin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montant` DECIMAL(15, 2) NOT NULL,
    `datePaiement` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modePaiement` ENUM('ESPECES', 'CHEQUE', 'VIREMENT', 'WAVE', 'ORANGE_MONEY') NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'PAYE', 'ECHEC') NOT NULL DEFAULT 'EN_ATTENTE',
    `reference` VARCHAR(100) NULL,
    `bulletinId` INTEGER NOT NULL,
    `entrepriseId` INTEGER NOT NULL,

    INDEX `payments_statut_idx`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeRapport` ENUM('BULLETINS', 'EMPLOYES', 'PAIEMENTS', 'STATISTIQUES') NOT NULL,
    `contenu` JSON NOT NULL,
    `dateGeneration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `entrepriseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` ENUM('CREATION', 'MODIFICATION', 'SUPPRESSION', 'CONNEXION', 'DECONNEXION', 'EXPORTATION', 'GENERATION') NOT NULL,
    `details` JSON NOT NULL,
    `dateAction` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utilisateurId` INTEGER NULL,
    `entrepriseId` INTEGER NULL,
    `employeId` INTEGER NULL,
    `bulletinId` INTEGER NULL,
    `paiementId` INTEGER NULL,
    `cyclePaieId` INTEGER NULL,

    INDEX `audit_logs_utilisateurId_idx`(`utilisateurId`),
    INDEX `audit_logs_entrepriseId_idx`(`entrepriseId`),
    INDEX `audit_logs_employeId_idx`(`employeId`),
    INDEX `audit_logs_bulletinId_idx`(`bulletinId`),
    INDEX `audit_logs_paiementId_idx`(`paiementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dashboards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `configuration` JSON NOT NULL,
    `entrepriseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cle` VARCHAR(100) NOT NULL,
    `valeur` VARCHAR(255) NOT NULL,
    `entrepriseId` INTEGER NOT NULL,

    UNIQUE INDEX `company_settings_entrepriseId_cle_key`(`entrepriseId`, `cle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payslips` ADD CONSTRAINT `payslips_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `pay_cycles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payslips` ADD CONSTRAINT `payslips_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `employees`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pay_cycles` ADD CONSTRAINT `pay_cycles_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_bulletinId_fkey` FOREIGN KEY (`bulletinId`) REFERENCES `payslips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_bulletinId_fkey` FOREIGN KEY (`bulletinId`) REFERENCES `payslips`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_paiementId_fkey` FOREIGN KEY (`paiementId`) REFERENCES `payments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_cyclePaieId_fkey` FOREIGN KEY (`cyclePaieId`) REFERENCES `pay_cycles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `dashboards_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_settings` ADD CONSTRAINT `company_settings_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
