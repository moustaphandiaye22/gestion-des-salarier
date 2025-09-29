import type { Request, Response } from 'express';
import { tableauDeBordService } from '../service/tableauDeBordService.js';
import { tableauDeBordValidator } from '../validators/tableauDeBord.js';

export class TableauDeBordController {
    
  async create(req: Request, res: Response) {
    try {
      const data = tableauDeBordValidator.parse(req.body);
      const tableau = await tableauDeBordService.createTableauDeBord(data);
      res.status(201).json(tableau);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const tableaux = await tableauDeBordService.getAllTableauxDeBord();
      res.json(tableaux);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const tableau = await tableauDeBordService.getTableauDeBord(id);
      if (!tableau) return res.status(404).json({ error: 'Tableau de bord non trouvé' });
      res.json(tableau);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = tableauDeBordValidator.partial().parse(req.body);
      const tableau = await tableauDeBordService.updateTableauDeBord(id, data);
      res.json(tableau);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await tableauDeBordService.deleteTableauDeBord(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
