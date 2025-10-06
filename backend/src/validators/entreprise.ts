import { z } from 'zod';

// Schema for admin user data when creating company
export const adminUserSchema = z.object({
  nom: z.string().min(1, 'Le nom de l\'admin est requis'),
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  prenom: z.string().optional(),
});

export const entrepriseSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères.')
    .max(100, 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères.'),
  description: z.string()
    .max(1000, 'La description ne doit pas dépasser 1000 caractères.')
    .optional(),
  adresse: z.string()
    .max(255, 'L\'adresse ne doit pas dépasser 255 caractères.')
    .optional(),
  telephone: z.string()
    .max(20, 'Le numéro de téléphone ne doit pas dépasser 20 caractères.')
    .optional(),
  email: z.string()
    .email('L\'email doit être une adresse valide.')
    .max(100, 'L\'email ne doit pas dépasser 100 caractères.')
    .optional(),
  siteWeb: z.string()
    .url('Le site web doit être une URL valide.')
    .max(255, 'Le site web ne doit pas dépasser 255 caractères.')
    .optional(),
  secteurActivite: z.string()
    .max(100, 'Le secteur d\'activité ne doit pas dépasser 100 caractères.')
    .optional(),
  logo: z.string()
    .max(255, 'Le chemin du logo ne doit pas dépasser 255 caractères.')
    .nullable()
    .optional(),
  couleurPrimaire: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur primaire doit être un code hexadécimal valide (ex: #FF0000).')
    .optional(),
  couleurSecondaire: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur secondaire doit être un code hexadécimal valide (ex: #00FF00).')
    .optional(),
  estActive: z.boolean().optional(),
  dateCreation: z.date().optional(),
  // Optional admin user data for company creation
  adminUser: adminUserSchema.optional(),
});
