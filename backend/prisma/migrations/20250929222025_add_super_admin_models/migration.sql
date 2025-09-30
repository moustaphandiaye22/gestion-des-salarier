/*
  Warnings:

  - You are about to drop the column `dateCreation` on the `pay_cycles` table. All the data in the column will be lost.
  - You are about to drop the column `estFerme` on the `pay_cycles` table. All the data in the column will be lost.
  - You are about to drop the column `periodeDebut` on the `pay_cycles` table. All the data in the column will be lost.
  - You are about to drop the column `periodeFin` on the `pay_cycles` table. All the data in the column will be lost.
  - You are about to drop the column `typeCycle` on the `pay_cycles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entrepriseId,nom]` on the table `pay_cycles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateDebut` to the `pay_cycles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateFin` to the `pay_cycles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `pay_cycles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `pay_cycles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pay_cycles` DROP FOREIGN KEY `pay_cycles_entrepriseId_fkey`;

-- DropIndex
DROP INDEX `pay_cycles_entrepriseId_periodeDebut_periodeFin_key` ON `pay_cycles`;

-- AlterTable
ALTER TABLE `pay_cycles` DROP COLUMN `dateCreation`,
    DROP COLUMN `estFerme`,
    DROP COLUMN `periodeDebut`,
    DROP COLUMN `periodeFin`,
    DROP COLUMN `typeCycle`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dateDebut` DATETIME(3) NOT NULL,
    ADD COLUMN `dateFin` DATETIME(3) NOT NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `frequence` ENUM('MENSUEL', 'HEBDOMADAIRE', 'QUINZAINE') NOT NULL DEFAULT 'MENSUEL',
    ADD COLUMN `nom` VARCHAR(100) NOT NULL,
    ADD COLUMN `statut` ENUM('OUVERT', 'FERME') NOT NULL DEFAULT 'OUVERT',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `global_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cle` VARCHAR(100) NOT NULL,
    `valeur` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `categorie` VARCHAR(50) NULL,
    `estModifiable` BOOLEAN NOT NULL DEFAULT true,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateModification` DATETIME(3) NOT NULL,

    UNIQUE INDEX `global_settings_cle_key`(`cle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `licenses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `typeLicence` ENUM('STANDARD', 'PREMIUM', 'ENTERPRISE', 'TRIAL') NOT NULL,
    `statut` ENUM('ACTIVE', 'EXPIREE', 'SUSPENDUE', 'ANNULEE') NOT NULL DEFAULT 'ACTIVE',
    `dateDebut` DATETIME(3) NOT NULL,
    `dateFin` DATETIME(3) NULL,
    `limiteUtilisateurs` INTEGER NULL DEFAULT -1,
    `limiteEntreprises` INTEGER NULL DEFAULT -1,
    `prix` DECIMAL(10, 2) NULL,
    `entrepriseId` INTEGER NULL,

    UNIQUE INDEX `licenses_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `pay_cycles_entrepriseId_nom_key` ON `pay_cycles`(`entrepriseId`, `nom`);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `licenses` ADD CONSTRAINT `licenses_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
