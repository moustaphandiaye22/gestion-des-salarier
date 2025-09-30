import type { Request, Response } from 'express';
import { ParametreEntrepriseService } from '../service/parametreEntrepriseService.js';
import { parametreEntrepriseValidator } from '../validators/parametreEntreprise.js';

const parametreEntrepriseService = new ParametreEntrepriseService();

export class ParametreEntrepriseController {
    
  async create(req: Request, res: Response) {
    try {
      const data = parametreEntrepriseValidator.parse(req.body);
      const parametre = await parametreEntrepriseService.createParametreEntreprise(data);
      res.status(201).json({ message: 'Paramètre créé avec succès.', parametre });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la création du paramètre : ${err.message}` });
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const parametres = await parametreEntrepriseService.getAllParametresEntreprise(req.user);
      res.json({ message: 'Liste des paramètres récupérée avec succès.', parametres });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les paramètres : ${err.message}` });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parametre = await parametreEntrepriseService.getParametreEntreprise(id);
      if (!parametre) {
        return res.status(404).json({ error: `Aucun paramètre trouvé avec l'identifiant ${id}.` });
      }
      res.json({ message: 'Paramètre récupéré avec succès.', parametre });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer le paramètre : ${err.message}` });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = parametreEntrepriseValidator.partial().parse(req.body);
      const parametre = await parametreEntrepriseService.updateParametreEntreprise(id, data);
      res.json({ message: 'Paramètre mis à jour avec succès.', parametre });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la mise à jour du paramètre : ${err.message}` });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await parametreEntrepriseService.deleteParametreEntreprise(id);
      res.status(200).json({ message: `Paramètre avec l'identifiant ${id} supprimé avec succès.` });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de supprimer le paramètre : ${err.message}` });
    }
  }
}
