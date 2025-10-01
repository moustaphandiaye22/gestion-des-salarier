export declare class SalaryCalculationService {
    /**
     * Calculate net salary for an employee based on their salary components and deductions
     * This includes taxes, social security contributions, and other deductions
     */
    calculateNetSalary(employeeId: number): Promise<number>;
    /**
     * Get the most recent bulletin for an employee
     */
    getLatestBulletin(employeeId: number): Promise<({
        employe: {
            id: number;
            nom: string;
            email: string | null;
            estActif: boolean;
            entrepriseId: number;
            matricule: string;
            prenom: string;
            telephone: string | null;
            adresse: string | null;
            dateEmbauche: Date;
            statutEmploi: import("@prisma/client").$Enums.StatutEmploi;
            typeContrat: import("@prisma/client").$Enums.TypeContrat;
            typeSalaire: import("@prisma/client").$Enums.TypeSalaire;
            salaireBase: import("@prisma/client/runtime/library").Decimal;
            salaireHoraire: import("@prisma/client/runtime/library").Decimal | null;
            tauxJournalier: import("@prisma/client/runtime/library").Decimal | null;
            allocations: import("@prisma/client/runtime/library").Decimal;
            deductions: import("@prisma/client/runtime/library").Decimal;
            professionId: number | null;
        };
        cycle: {
            id: number;
            nom: string;
            entrepriseId: number;
            description: string | null;
            dateDebut: Date;
            dateFin: Date;
            statut: import("@prisma/client").$Enums.StatutCyclePaie;
            frequence: import("@prisma/client").$Enums.FrequencePaie;
            createdAt: Date;
            updatedAt: Date;
        };
        paiements: {
            id: number;
            entrepriseId: number;
            statut: import("@prisma/client").$Enums.StatutPaiement;
            montant: import("@prisma/client/runtime/library").Decimal;
            datePaiement: Date;
            modePaiement: import("@prisma/client").$Enums.ModePaiement;
            reference: string | null;
            bulletinId: number;
        }[];
    } & {
        id: number;
        salaireBase: import("@prisma/client/runtime/library").Decimal;
        allocations: import("@prisma/client/runtime/library").Decimal;
        deductions: import("@prisma/client/runtime/library").Decimal;
        numeroBulletin: string;
        periodeDebut: Date;
        periodeFin: Date;
        totalAPayer: import("@prisma/client/runtime/library").Decimal;
        statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
        dateGeneration: Date;
        cycleId: number;
        employeId: number;
    }) | null>;
    /**
     * Generate a unique payment reference
     */
    generatePaymentReference(employeeId: number, date?: Date): string;
    /**
     * Get employee payment information for payment creation
     */
    getEmployeePaymentInfo(employeeId: number): Promise<{
        employee: {
            entreprise: {
                cyclesPaie: {
                    id: number;
                    nom: string;
                    entrepriseId: number;
                    description: string | null;
                    dateDebut: Date;
                    dateFin: Date;
                    statut: import("@prisma/client").$Enums.StatutCyclePaie;
                    frequence: import("@prisma/client").$Enums.FrequencePaie;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
            } & {
                id: number;
                nom: string;
                email: string | null;
                telephone: string | null;
                adresse: string | null;
                description: string | null;
                dateCreation: Date;
                logo: string | null;
                estActive: boolean;
            };
        } & {
            id: number;
            nom: string;
            email: string | null;
            estActif: boolean;
            entrepriseId: number;
            matricule: string;
            prenom: string;
            telephone: string | null;
            adresse: string | null;
            dateEmbauche: Date;
            statutEmploi: import("@prisma/client").$Enums.StatutEmploi;
            typeContrat: import("@prisma/client").$Enums.TypeContrat;
            typeSalaire: import("@prisma/client").$Enums.TypeSalaire;
            salaireBase: import("@prisma/client/runtime/library").Decimal;
            salaireHoraire: import("@prisma/client/runtime/library").Decimal | null;
            tauxJournalier: import("@prisma/client/runtime/library").Decimal | null;
            allocations: import("@prisma/client/runtime/library").Decimal;
            deductions: import("@prisma/client/runtime/library").Decimal;
            professionId: number | null;
        };
        entreprise: {
            cyclesPaie: {
                id: number;
                nom: string;
                entrepriseId: number;
                description: string | null;
                dateDebut: Date;
                dateFin: Date;
                statut: import("@prisma/client").$Enums.StatutCyclePaie;
                frequence: import("@prisma/client").$Enums.FrequencePaie;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            dateCreation: Date;
            logo: string | null;
            estActive: boolean;
        };
        latestBulletin: ({
            employe: {
                id: number;
                nom: string;
                email: string | null;
                estActif: boolean;
                entrepriseId: number;
                matricule: string;
                prenom: string;
                telephone: string | null;
                adresse: string | null;
                dateEmbauche: Date;
                statutEmploi: import("@prisma/client").$Enums.StatutEmploi;
                typeContrat: import("@prisma/client").$Enums.TypeContrat;
                typeSalaire: import("@prisma/client").$Enums.TypeSalaire;
                salaireBase: import("@prisma/client/runtime/library").Decimal;
                salaireHoraire: import("@prisma/client/runtime/library").Decimal | null;
                tauxJournalier: import("@prisma/client/runtime/library").Decimal | null;
                allocations: import("@prisma/client/runtime/library").Decimal;
                deductions: import("@prisma/client/runtime/library").Decimal;
                professionId: number | null;
            };
            cycle: {
                id: number;
                nom: string;
                entrepriseId: number;
                description: string | null;
                dateDebut: Date;
                dateFin: Date;
                statut: import("@prisma/client").$Enums.StatutCyclePaie;
                frequence: import("@prisma/client").$Enums.FrequencePaie;
                createdAt: Date;
                updatedAt: Date;
            };
            paiements: {
                id: number;
                entrepriseId: number;
                statut: import("@prisma/client").$Enums.StatutPaiement;
                montant: import("@prisma/client/runtime/library").Decimal;
                datePaiement: Date;
                modePaiement: import("@prisma/client").$Enums.ModePaiement;
                reference: string | null;
                bulletinId: number;
            }[];
        } & {
            id: number;
            salaireBase: import("@prisma/client/runtime/library").Decimal;
            allocations: import("@prisma/client/runtime/library").Decimal;
            deductions: import("@prisma/client/runtime/library").Decimal;
            numeroBulletin: string;
            periodeDebut: Date;
            periodeFin: Date;
            totalAPayer: import("@prisma/client/runtime/library").Decimal;
            statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
            dateGeneration: Date;
            cycleId: number;
            employeId: number;
        }) | null;
        currentCycle: {
            id: number;
            nom: string;
            entrepriseId: number;
            description: string | null;
            dateDebut: Date;
            dateFin: Date;
            statut: import("@prisma/client").$Enums.StatutCyclePaie;
            frequence: import("@prisma/client").$Enums.FrequencePaie;
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
        netSalary: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    /**
     * Validate if payment can be made based on pay cycle
     */
    validatePaymentCycle(employeeId: number, paymentDate: Date): Promise<boolean>;
}
//# sourceMappingURL=salaryCalculationService.d.ts.map