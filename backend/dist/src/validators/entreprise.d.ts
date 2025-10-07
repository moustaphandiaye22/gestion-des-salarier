import { z } from 'zod';
export declare const adminUserSchema: z.ZodObject<{
    nom: z.ZodString;
    email: z.ZodString;
    motDePasse: z.ZodString;
    prenom: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const entrepriseSchema: z.ZodObject<{
    nom: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    adresse: z.ZodOptional<z.ZodString>;
    telephone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    siteWeb: z.ZodOptional<z.ZodString>;
    secteurActivite: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    couleurPrimaire: z.ZodOptional<z.ZodString>;
    couleurSecondaire: z.ZodOptional<z.ZodString>;
    superAdminAccessGranted: z.ZodOptional<z.ZodBoolean>;
    estActive: z.ZodOptional<z.ZodBoolean>;
    dateCreation: z.ZodOptional<z.ZodDate>;
    adminUser: z.ZodOptional<z.ZodObject<{
        nom: z.ZodString;
        email: z.ZodString;
        motDePasse: z.ZodString;
        prenom: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=entreprise.d.ts.map