import { z } from 'zod';
export declare const employeSchema: z.ZodObject<{
    matricule: z.ZodString;
    prenom: z.ZodString;
    nom: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telephone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    adresse: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dateEmbauche: z.ZodPipe<z.ZodUnion<readonly [z.ZodDate, z.ZodString]>, z.ZodTransform<Date, string | Date>>;
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
    typeSalaire: z.ZodDefault<z.ZodEnum<{
        MENSUEL: "MENSUEL";
        HONORAIRES: "HONORAIRES";
        JOURNALIER: "JOURNALIER";
    }>>;
    salaireBase: z.ZodNumber;
    salaireHoraire: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    tauxJournalier: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    allocations: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    deductions: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    roleUtilisateur: z.ZodDefault<z.ZodEnum<{
        CAISSIER: "CAISSIER";
        EMPLOYE: "EMPLOYE";
    }>>;
    motDePasse: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    estActif: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    entrepriseId: z.ZodNumber;
    professionId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
//# sourceMappingURL=employe.d.ts.map