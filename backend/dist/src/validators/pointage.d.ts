import { z } from 'zod';
export declare const pointageSchema: z.ZodObject<{
    datePointage: z.ZodPipe<z.ZodUnion<readonly [z.ZodDate, z.ZodString]>, z.ZodTransform<Date, string | Date>>;
    heureEntree: z.ZodNullable<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodDate, z.ZodString]>, z.ZodTransform<Date, string | Date>>>>;
    heureSortie: z.ZodNullable<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodDate, z.ZodString]>, z.ZodTransform<Date, string | Date>>>>;
    dureeTravail: z.ZodOptional<z.ZodNumber>;
    typePointage: z.ZodDefault<z.ZodEnum<{
        CONGE: "CONGE";
        PRESENCE: "PRESENCE";
        ABSENCE: "ABSENCE";
        MALADIE: "MALADIE";
        MISSION: "MISSION";
        FORMATION: "FORMATION";
        TELETRAVAIL: "TELETRAVAIL";
        HEURE_SUPPLEMENTAIRE: "HEURE_SUPPLEMENTAIRE";
    }>>;
    statut: z.ZodDefault<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        EN_ATTENTE: "EN_ATTENTE";
        VALIDE: "VALIDE";
        REJETE: "REJETE";
        MODIFIE: "MODIFIE";
    }>>;
    lieu: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    commentaire: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    ipAddress: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    localisation: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, z.core.$strip>>>;
    employeId: z.ZodNumber;
    entrepriseId: z.ZodNumber;
}, z.core.$strip>;
export declare const pointageFilterSchema: z.ZodObject<{
    employeId: z.ZodOptional<z.ZodNumber>;
    entrepriseId: z.ZodOptional<z.ZodNumber>;
    dateDebut: z.ZodOptional<z.ZodString>;
    dateFin: z.ZodOptional<z.ZodString>;
    typePointage: z.ZodOptional<z.ZodEnum<{
        CONGE: "CONGE";
        PRESENCE: "PRESENCE";
        ABSENCE: "ABSENCE";
        MALADIE: "MALADIE";
        MISSION: "MISSION";
        FORMATION: "FORMATION";
        TELETRAVAIL: "TELETRAVAIL";
        HEURE_SUPPLEMENTAIRE: "HEURE_SUPPLEMENTAIRE";
    }>>;
    statut: z.ZodOptional<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        EN_ATTENTE: "EN_ATTENTE";
        VALIDE: "VALIDE";
        REJETE: "REJETE";
        MODIFIE: "MODIFIE";
    }>>;
}, z.core.$strip>;
export declare const pointageEntreeSchema: z.ZodObject<{
    employeId: z.ZodNumber;
    entrepriseId: z.ZodNumber;
    lieu: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    localisation: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const pointageSortieSchema: z.ZodObject<{
    employeId: z.ZodNumber;
    entrepriseId: z.ZodNumber;
    lieu: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    localisation: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=pointage.d.ts.map