import type { Request, Response } from 'express';
import { rapportService } from '../service/rapportService.js';
import { rapportValidator } from '../validators/rapport.js';

export class RapportController {
    
  async create(req: Request, res: Response) {
    try {
      const data = rapportValidator.parse(req.body);
      const rapport = await rapportService.createRapport(data);
      res.status(201).json(rapport);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const rapports = await rapportService.getAllRapports();
      res.json(rapports);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const rapport = await rapportService.getRapport(id);
      if (!rapport) return res.status(404).json({ error: 'Rapport non trouvé' });
      res.json(rapport);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = rapportValidator.partial().parse(req.body);
      const rapport = await rapportService.updateRapport(id, data);
      res.json(rapport);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await rapportService.deleteRapport(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
