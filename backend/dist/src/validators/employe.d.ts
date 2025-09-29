import { z } from 'zod';
export declare const employeSchema: z.ZodObject<{
    matricule: z.ZodString;
    prenom: z.ZodString;
    nom: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    telephone: z.ZodOptional<z.ZodString>;
    adresse: z.ZodOptional<z.ZodString>;
    dateEmbauche: z.ZodDate;
    statutEmploi: z.ZodEnum<{
        ACTIF: "ACTIF";
        CONGE: "CONGE";
        LICENCIE: "LICENCIE";
        RETRAITE: "RETRAITE";
    }>;
    typeContrat: z.ZodEnum<{
        CDI: "CDI";
        CDD: "CDD";
        INTERIM: "INTERIM";
        STAGE: "STAGE";
    }>;
    salaireBase: z.ZodNumber;
    allocations: z.ZodOptional<z.ZodNumber>;
    deductions: z.ZodOptional<z.ZodNumber>;
    estActif: z.ZodOptional<z.ZodBoolean>;
    entrepriseId: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=employe.d.ts.map