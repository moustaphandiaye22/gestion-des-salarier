import type { Request, Response } from 'express';
import { journalAuditService } from '../service/journalAuditService.js';
import { journalAuditValidator } from '../validators/journalAudit.js';

export class JournalAuditController {
  async create(req: Request, res: Response) {
    try {
      const data = journalAuditValidator.parse(req.body);
      const journal = await journalAuditService.createJournalAudit(data);
      res.status(201).json(journal);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const journals = await journalAuditService.getAllJournalAudits(req.user);
      res.json(journals);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const journal = await journalAuditService.getJournalAudit(id);
      if (!journal) return res.status(404).json({ error: 'Journal d\'audit non trouvé' });
      res.json(journal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = journalAuditValidator.partial().parse(req.body);
      const journal = await journalAuditService.updateJournalAudit(id, data);
      res.json(journal);
    } catch (err: any) {
      res.status(400).json({ error: err.errors || err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await journalAuditService.deleteJournalAudit(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
