/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateModification` to the `dashboards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `audit_logs` ADD COLUMN `pointageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `companies` ADD COLUMN `logo` VARCHAR(255) NULL,
    ADD COLUMN `secteurActivite` VARCHAR(100) NULL,
    ADD COLUMN `siteWeb` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `dashboards` ADD COLUMN `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dateModification` DATETIME(3) NOT NULL,
    ADD COLUMN `estActif` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `roleRequis` ENUM('SUPER_ADMIN', 'ADMIN_ENTREPRISE', 'CAISSIER', 'EMPLOYE') NOT NULL DEFAULT 'EMPLOYE';

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `dernierPointage` DATETIME(3) NULL,
    ADD COLUMN `heuresTravaillees` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `professionId` INTEGER NULL,
    ADD COLUMN `qrCode` VARCHAR(255) NULL,
    ADD COLUMN `qrCodeGenere` DATETIME(3) NULL,
    ADD COLUMN `qrCodeImagePath` VARCHAR(500) NULL,
    ADD COLUMN `salaireHoraire` DECIMAL(15, 2) NULL,
    ADD COLUMN `tauxJournalier` DECIMAL(15, 2) NULL,
    ADD COLUMN `totalAbsences` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalPresences` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalRetards` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `typeSalaire` ENUM('MENSUEL', 'HONORAIRES', 'JOURNALIER') NOT NULL DEFAULT 'MENSUEL';

-- AlterTable
ALTER TABLE `pay_cycles` ADD COLUMN `statutValidation` ENUM('BROUILLON', 'VALIDE', 'CLOTURE') NOT NULL DEFAULT 'BROUILLON';

-- CreateTable
CREATE TABLE `attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datePointage` DATETIME(3) NOT NULL,
    `heureEntree` DATETIME(3) NULL,
    `heureSortie` DATETIME(3) NULL,
    `dureeTravail` DECIMAL(8, 2) NULL,
    `typePointage` ENUM('PRESENCE', 'ABSENCE', 'CONGE', 'MALADIE', 'MISSION', 'FORMATION', 'TELETRAVAIL', 'HEURE_SUPPLEMENTAIRE') NOT NULL DEFAULT 'PRESENCE',
    `statut` ENUM('PRESENT', 'ABSENT', 'EN_ATTENTE', 'VALIDE', 'REJETE', 'MODIFIE') NOT NULL DEFAULT 'PRESENT',
    `lieu` VARCHAR(100) NULL,
    `commentaire` TEXT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `localisation` JSON NULL,
    `employeId` INTEGER NOT NULL,
    `entrepriseId` INTEGER NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateModification` DATETIME(3) NOT NULL,

    INDEX `attendance_employeId_datePointage_idx`(`employeId`, `datePointage`),
    INDEX `attendance_entrepriseId_datePointage_idx`(`entrepriseId`, `datePointage`),
    INDEX `attendance_datePointage_idx`(`datePointage`),
    INDEX `attendance_typePointage_idx`(`typePointage`),
    INDEX `attendance_statut_idx`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `widgets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `type` ENUM('KPI_CARD', 'LINE_CHART', 'BAR_CHART', 'PIE_CHART', 'AREA_CHART', 'TABLE', 'GAUGE', 'METRIC', 'ALERT_LIST', 'EXPORT_BUTTON') NOT NULL,
    `configuration` JSON NOT NULL,
    `positionX` INTEGER NOT NULL DEFAULT 0,
    `positionY` INTEGER NOT NULL DEFAULT 0,
    `largeur` INTEGER NOT NULL DEFAULT 4,
    `hauteur` INTEGER NOT NULL DEFAULT 3,
    `tableauDeBordId` INTEGER NOT NULL,
    `estVisible` BOOLEAN NOT NULL DEFAULT true,
    `ordre` INTEGER NOT NULL DEFAULT 0,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpi_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `valeur` DECIMAL(15, 2) NOT NULL,
    `valeurPrecedente` DECIMAL(15, 2) NOT NULL,
    `unite` VARCHAR(20) NOT NULL,
    `typeKpi` ENUM('NOMBRE_EMPLOYES', 'NOMBRE_EMPLOYES_ACTIFS', 'TOTAL_SALAIRE_BASE', 'TOTAL_ALLOCATIONS', 'TOTAL_DEDUCTIONS', 'TOTAL_A_PAYER', 'NOMBRE_BULLETINS', 'NOMBRE_PAIEMENTS', 'NOMBRE_PAIEMENTS_PAYES', 'NOMBRE_CYCLES', 'TAUX_PAIEMENT', 'MASSE_SALARIALE', 'EVOLUTION_SALARIALE', 'TAUX_ABSENTEISME', 'TURNOVER') NOT NULL,
    `periode` ENUM('HEURE', 'JOUR', 'SEMAINE', 'MOIS', 'TRIMESTRE', 'ANNEE', 'TEMPS_REEL') NOT NULL,
    `dateCalcul` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tableauDeBordId` INTEGER NOT NULL,
    `entrepriseId` INTEGER NOT NULL,

    INDEX `kpi_data_tableauDeBordId_dateCalcul_idx`(`tableauDeBordId`, `dateCalcul`),
    INDEX `kpi_data_entrepriseId_typeKpi_idx`(`entrepriseId`, `typeKpi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alertes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('PAIEMENT_ECHEC', 'RETARD_PAIEMENT', 'SEUIL_DEPASSE', 'NOUVEAU_EMPLOYE', 'EMPLOYE_PARTI', 'CYCLE_FERME', 'LICENCE_EXPIRATION', 'PERFORMANCE', 'SECURITE') NOT NULL,
    `severite` ENUM('FAIBLE', 'MOYENNE', 'ELEVEE', 'CRITIQUE') NOT NULL DEFAULT 'MOYENNE',
    `estLue` BOOLEAN NOT NULL DEFAULT false,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateLecture` DATETIME(3) NULL,
    `tableauDeBordId` INTEGER NOT NULL,
    `entrepriseId` INTEGER NOT NULL,
    `utilisateurId` INTEGER NULL,

    INDEX `alertes_entrepriseId_estLue_idx`(`entrepriseId`, `estLue`),
    INDEX `alertes_tableauDeBordId_dateCreation_idx`(`tableauDeBordId`, `dateCreation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `type` ENUM('DONNEES_ANALYTIQUES', 'RAPPORT_SALARIAL', 'LISTE_EMPLOYES', 'BULLETINS_PAIE', 'PAIEMENTS', 'KPI_DASHBOARD') NOT NULL,
    `format` ENUM('PDF', 'EXCEL', 'CSV', 'JSON') NOT NULL,
    `statut` ENUM('EN_COURS', 'TERMINE', 'ECHEC') NOT NULL DEFAULT 'EN_COURS',
    `cheminFichier` VARCHAR(255) NULL,
    `parametres` JSON NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateFin` DATETIME(3) NULL,
    `utilisateurId` INTEGER NOT NULL,
    `entrepriseId` INTEGER NOT NULL,

    INDEX `exports_entrepriseId_dateCreation_idx`(`entrepriseId`, `dateCreation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `categorie` VARCHAR(50) NULL,
    `estActive` BOOLEAN NOT NULL DEFAULT true,

    INDEX `professions_categorie_idx`(`categorie`),
    UNIQUE INDEX `professions_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `audit_logs_pointageId_idx` ON `audit_logs`(`pointageId`);

-- CreateIndex
CREATE UNIQUE INDEX `employees_qrCode_key` ON `employees`(`qrCode`);

-- CreateIndex
CREATE INDEX `employees_professionId_idx` ON `employees`(`professionId`);

-- CreateIndex
CREATE INDEX `employees_qrCode_idx` ON `employees`(`qrCode`);

-- CreateIndex
CREATE INDEX `employees_dernierPointage_idx` ON `employees`(`dernierPointage`);

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_professionId_fkey` FOREIGN KEY (`professionId`) REFERENCES `professions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pay_cycles` ADD CONSTRAINT `pay_cycles_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_pointageId_fkey` FOREIGN KEY (`pointageId`) REFERENCES `attendance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `widgets` ADD CONSTRAINT `widgets_tableauDeBordId_fkey` FOREIGN KEY (`tableauDeBordId`) REFERENCES `dashboards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kpi_data` ADD CONSTRAINT `kpi_data_tableauDeBordId_fkey` FOREIGN KEY (`tableauDeBordId`) REFERENCES `dashboards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kpi_data` ADD CONSTRAINT `kpi_data_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alertes` ADD CONSTRAINT `alertes_tableauDeBordId_fkey` FOREIGN KEY (`tableauDeBordId`) REFERENCES `dashboards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alertes` ADD CONSTRAINT `alertes_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alertes` ADD CONSTRAINT `alertes_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exports` ADD CONSTRAINT `exports_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exports` ADD CONSTRAINT `exports_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
