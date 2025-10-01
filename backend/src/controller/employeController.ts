import type { Request, Response } from 'express';
import { EmployeService } from '../service/employeService.js';
import { SalaryCalculationService } from '../service/salaryCalculationService.js';
import { employeSchema } from '../validators/employe.js';

const employeService = new EmployeService();
const salaryCalculationService = new SalaryCalculationService();

export class EmployeController {
  async create(req: Request, res: Response) {
    try {
      const data = employeSchema.parse(req.body);
      const employe = await employeService.createEmploye(data);
      res.status(201).json({ message: 'Employé créé avec succès.', employe });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la création de l'employé : ${err.message}` });
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const employes = await employeService.getAllEmployes(req.user);
      res.json({ message: 'Liste des employés récupérée avec succès.', employes });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les employés : ${err.message}` });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const employe = await employeService.getEmploye(id);
      if (!employe) {
        return res.status(404).json({ error: `Aucun employé trouvé avec l'identifiant ${id}.` });
      }
      res.json({ message: 'Employé récupéré avec succès.', employe });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer l'employé : ${err.message}` });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = employeSchema.partial().parse(req.body);
      const employe = await employeService.updateEmploye(id, data);
      res.json({ message: 'Employé mis à jour avec succès.', employe });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la mise à jour de l'employé : ${err.message}` });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await employeService.deleteEmploye(id);
      res.status(200).json({ message: `Employé avec l'identifiant ${id} supprimé avec succès.` });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de supprimer l'employé : ${err.message}` });
    }
  }

  async getLatestBulletin(req: Request, res: Response) {
    try {
      const employeeId = Number(req.params.id);
      const bulletin = await salaryCalculationService.getLatestBulletin(employeeId);
      if (!bulletin) {
        return res.status(404).json({ error: `Aucun bulletin trouvé pour l'employé ${employeeId}.` });
      }
      res.json({ message: 'Bulletin récupéré avec succès.', bulletin });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer le bulletin : ${err.message}` });
    }
  }
}
