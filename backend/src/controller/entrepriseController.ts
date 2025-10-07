import type { Request, Response } from 'express';
import { EntrepriseService } from '../service/entrepriseService.js';
import { entrepriseSchema } from '../validators/entreprise.js';

const entrepriseService = new EntrepriseService();

export class EntrepriseController {
  async create(req: Request, res: Response) {
    try {
      // Handle file upload - logo is handled by multer, so we don't need req.body.logo
      let logoPath = null;
      if (req.file) {
        logoPath = `/assets/images/logos/${req.file.filename}`;
      }

      // Extract adminUser data and remove it from body
      const { adminUser, logo, estActive, couleurPrimaire, couleurSecondaire, superAdminAccessGranted, ...bodyData } = req.body;

      // Convert estActive string to boolean if needed
      const estActiveBool = estActive === 'true' || estActive === true;
      const superAdminAccessGrantedBool = superAdminAccessGranted === 'true' || superAdminAccessGranted === true;

      const dataToParse = {
        ...bodyData,
        estActive: estActiveBool,
        superAdminAccessGranted: superAdminAccessGrantedBool,
        ...(logoPath !== null && { logo: logoPath }),
        ...(couleurPrimaire && { couleurPrimaire }),
        ...(couleurSecondaire && { couleurSecondaire }),
        ...(req.body.email && { email: req.body.email }), // Only include email if provided
        adminUser: adminUser ? JSON.parse(adminUser) : undefined
      };
      console.log('Data to parse:', JSON.stringify(dataToParse, null, 2));
      const data = entrepriseSchema.parse(dataToParse);
      const result = await entrepriseService.createEntreprise(data);
      res.status(201).json({ message: 'Entreprise créée avec succès.', ...result });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la création de l'entreprise : ${err.message}` });
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const entreprises = await entrepriseService.getAllEntreprises(req.user);
      res.json({ message: 'Liste des entreprises récupérée avec succès.', entreprises });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les entreprises : ${err.message}` });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const entreprise = await entrepriseService.getEntreprise(id);
      if (!entreprise) {
        return res.status(404).json({ error: `Aucune entreprise trouvée avec l'identifiant ${id}.` });
      }
      res.json({ message: 'Entreprise récupérée avec succès.', entreprise });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer l'entreprise : ${err.message}` });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      // Handle file upload - logo is handled by multer, so we don't need req.body.logo
      let logoPath = undefined;
      if (req.file) {
        logoPath = `/assets/images/logos/${req.file.filename}`;
      }

      // Remove logo from req.body if it exists (it might be a File object from FormData)
      const { logo, estActive, couleurPrimaire, couleurSecondaire, superAdminAccessGranted, ...bodyData } = req.body;

      // Convert estActive string to boolean if needed
      const estActiveBool = estActive === 'true' || estActive === true;
      const superAdminAccessGrantedBool = superAdminAccessGranted === 'true' || superAdminAccessGranted === true;

      const data = entrepriseSchema.partial().parse({
        ...bodyData,
        ...(estActive !== undefined && { estActive: estActiveBool }),
        ...(superAdminAccessGranted !== undefined && { superAdminAccessGranted: superAdminAccessGrantedBool }),
        ...(logoPath !== undefined && { logo: logoPath }),
        ...(couleurPrimaire !== undefined && { couleurPrimaire }),
        ...(couleurSecondaire !== undefined && { couleurSecondaire })
      });
      const entreprise = await entrepriseService.updateEntreprise(id, data);
      res.json({ message: 'Entreprise mise à jour avec succès.', entreprise });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la mise à jour de l'entreprise : ${err.message}` });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await entrepriseService.deleteEntreprise(id);
      res.status(200).json({ message: `Entreprise avec l'identifiant ${id} supprimée avec succès.` });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de supprimer l'entreprise : ${err.message}` });
    }
  }
}
