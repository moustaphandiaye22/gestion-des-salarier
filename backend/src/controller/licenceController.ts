import type { Request, Response } from 'express';
import { LicenceService } from '../service/licenceService.js';
import { StatutLicence, TypeLicence } from '@prisma/client';

const licenceService = new LicenceService();

export class LicenceController {
  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const licence = await licenceService.createLicence(data);
      res.status(201).json({ message: 'Licence créée avec succès.', licence });
    } catch (err: any) {
      res.status(400).json({ error: `Échec de la création de la licence : ${err.message}` });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const licences = await licenceService.getAllLicences();
      res.json({ message: 'Licences récupérées avec succès.', licences });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les licences : ${err.message}` });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const licence = await licenceService.getLicenceById(id);
      res.json({ message: 'Licence récupérée avec succès.', licence });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async getByNom(req: Request, res: Response) {
    try {
      const nom = req.params.nom;
      if (!nom) {
        return res.status(400).json({ error: 'Le paramètre nom est requis' });
      }
      const licence = await licenceService.getLicenceByNom(nom);
      res.json({ message: 'Licence récupérée avec succès.', licence });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const licence = await licenceService.updateLicence(id, data);
      res.json({ message: 'Licence mise à jour avec succès.', licence });
    } catch (err: any) {
      res.status(400).json({ error: `Échec de la mise à jour de la licence : ${err.message}` });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await licenceService.deleteLicence(id);
      res.status(200).json({ message: `Licence avec l'identifiant ${id} supprimée avec succès.` });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de supprimer la licence : ${err.message}` });
    }
  }

  async getByEntreprise(req: Request, res: Response) {
    try {
      const entrepriseId = Number(req.params.entrepriseId);
      const licences = await licenceService.getLicencesByEntreprise(entrepriseId);
      res.json({ message: `Licences de l'entreprise ${entrepriseId} récupérées avec succès.`, licences });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les licences : ${err.message}` });
    }
  }

  async getByStatut(req: Request, res: Response) {
    try {
      const statut = req.params.statut as StatutLicence;
      const licences = await licenceService.getLicencesByStatut(statut);
      res.json({ message: `Licences avec le statut '${statut}' récupérées avec succès.`, licences });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les licences : ${err.message}` });
    }
  }

  async getByType(req: Request, res: Response) {
    try {
      const typeLicence = req.params.typeLicence as TypeLicence;
      const licences = await licenceService.getLicencesByType(typeLicence);
      res.json({ message: `Licences de type '${typeLicence}' récupérées avec succès.`, licences });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les licences : ${err.message}` });
    }
  }

  async assignToEntreprise(req: Request, res: Response) {
    try {
      const licenceId = Number(req.params.id);
      const { entrepriseId } = req.body;
      const licence = await licenceService.assignLicenceToEntreprise(licenceId, entrepriseId);
      res.json({ message: 'Licence assignée à l\'entreprise avec succès.', licence });
    } catch (err: any) {
      res.status(400).json({ error: `Échec de l'assignation de la licence : ${err.message}` });
    }
  }

  async revokeFromEntreprise(req: Request, res: Response) {
    try {
      const licenceId = Number(req.params.id);
      const licence = await licenceService.revokeLicenceFromEntreprise(licenceId);
      res.json({ message: 'Licence révoquée de l\'entreprise avec succès.', licence });
    } catch (err: any) {
      res.status(400).json({ error: `Échec de la révocation de la licence : ${err.message}` });
    }
  }
}
