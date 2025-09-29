import type { Request, Response } from 'express';
import { CyclePaieService } from '../service/cyclePaieService.js';
import { cyclePaieSchema } from '../validators/cyclePaie.js';

const cyclePaieService = new CyclePaieService();

export class CyclePaieController {
    
  async create(req: Request, res: Response) {
    try {
      const data = cyclePaieSchema.parse(req.body);
      const cycle = await cyclePaieService.createCyclePaie(data);
      res.status(201).json({ message: 'Cycle de paie créé avec succès.', cycle });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la création du cycle de paie : ${err.message}` });
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const cycles = await cyclePaieService.getAllCyclesPaie();
      res.json({ message: 'Liste des cycles de paie récupérée avec succès.', cycles });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les cycles de paie : ${err.message}` });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const cycle = await cyclePaieService.getCyclePaie(id);
      if (!cycle) {
        return res.status(404).json({ error: `Aucun cycle de paie trouvé avec l'identifiant ${id}.` });
      }
      res.json({ message: 'Cycle de paie récupéré avec succès.', cycle });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer le cycle de paie : ${err.message}` });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = cyclePaieSchema.partial().parse(req.body);
      const cycle = await cyclePaieService.updateCyclePaie(id, data);
      res.json({ message: 'Cycle de paie mis à jour avec succès.', cycle });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la mise à jour du cycle de paie : ${err.message}` });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await cyclePaieService.deleteCyclePaie(id);
      res.status(200).json({ message: `Cycle de paie avec l'identifiant ${id} supprimé avec succès.` });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de supprimer le cycle de paie : ${err.message}` });
    }
  }
}
