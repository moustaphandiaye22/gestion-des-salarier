import type { Request, Response } from 'express';
import { CyclePaieService } from '../service/cyclePaieService.js';
import { cyclePaieSchema } from '../validators/cyclePaie.js';
import { createErrorResponse, createSuccessResponse, createValidationErrorResponse } from '../utils/httpStatus.js';

const cyclePaieService = new CyclePaieService();

export class CyclePaieController {
    
  async create(req: Request, res: Response) {
    try {
      const data = cyclePaieSchema.parse(req.body);
      const cycle = await cyclePaieService.createCyclePaie(data);
      res.status(201).json(createSuccessResponse('Cycle de paie créé avec succès.', cycle));
    } catch (err: any) {
      if (err.errors) {
        const validationErrors = err.errors.map((error: any) => ({
          champ: error.path.join('.'),
          message: error.message,
          valeur: error.input
        }));
        res.status(400).json(createValidationErrorResponse(err.errors));
      } else {
        // Handle unique constraint errors with user-friendly messages
        if (err.message.includes('existe déjà')) {
          res.status(400).json(createErrorResponse(
            'Nom de cycle déjà utilisé',
            err.message
          ));
        } else {
          res.status(400).json(createErrorResponse(
            'Création impossible',
            'Une erreur technique s\'est produite lors de la création du cycle de paie. Veuillez réessayer ou contacter le support si le problème persiste.'
          ));
        }
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const cycles = await cyclePaieService.getAllCyclesPaie(req.user);
      res.json({ message: 'Liste des cycles de paie récupérée avec succès.', cycles });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les cycles de paie : ${err.message}` });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          error: 'Identifiant invalide',
          message: 'L\'identifiant du cycle de paie doit être un nombre positif.',
          success: false
        });
      }

      const cycle = await cyclePaieService.getCyclePaie(id);
      if (!cycle) {
        return res.status(404).json(createErrorResponse(
          'Cycle de paie non trouvé',
          `Aucun cycle de paie n'existe avec l'identifiant ${id}.`,
          404
        ));
      }

      res.json(createSuccessResponse('Cycle de paie récupéré avec succès.', cycle));
    } catch (err: any) {
      res.status(500).json(createErrorResponse(
        'Erreur serveur',
        'Une erreur technique s\'est produite lors de la récupération du cycle de paie. Veuillez réessayer ou contacter le support si le problème persiste.',
        500
      ));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      // Validate that the ID is a valid number
      if (isNaN(id) || id <= 0) {
        return res.status(400).json(createErrorResponse(
          'Identifiant de cycle invalide',
          'L\'identifiant du cycle de paie doit être un nombre positif.'
        ));
      }

      // If entrepriseId is in query params but not in body, add it to body for validation
      const bodyWithEntrepriseId = { ...req.body };
      if (req.query.entrepriseId && !req.body.entrepriseId) {
        bodyWithEntrepriseId.entrepriseId = parseInt(req.query.entrepriseId as string);
      }

      const data = cyclePaieSchema.partial().parse(bodyWithEntrepriseId);
      const cycle = await cyclePaieService.updateCyclePaie(id, data);
      res.json(createSuccessResponse('Cycle de paie mis à jour avec succès.', cycle));
    } catch (err: any) {
      if (err.errors) {
        const validationErrors = err.errors.map((error: any) => ({
          champ: error.path.join('.'),
          message: error.message,
          valeur: error.input
        }));
        res.status(400).json(createValidationErrorResponse(err.errors));
      } else {
        // Handle unique constraint errors with user-friendly messages
        if (err.message.includes('existe déjà')) {
          res.status(400).json(createErrorResponse(
            'Nom de cycle déjà utilisé',
            err.message
          ));
        } else {
          res.status(400).json(createErrorResponse(
            'Modification impossible',
            'Une erreur technique s\'est produite lors de la modification du cycle de paie. Veuillez réessayer ou contacter le support si le problème persiste.'
          ));
        }
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

  async validate(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const cycle = await cyclePaieService.validateCyclePaie(id, req.user);
      res.json({ message: 'Cycle de paie validé avec succès.', cycle });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async close(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const cycle = await cyclePaieService.closeCyclePaie(id, req.user);
      res.json({ message: 'Cycle de paie clôturé avec succès.', cycle });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async canCashierPay(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const canPay = await cyclePaieService.canCashierPayCycle(id, req.user);
      res.json({ canPay });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
