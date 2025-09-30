import type { Request, Response } from 'express';
import { ParametreGlobalService } from '../service/parametreGlobalService.js';
import { parametreGlobalSchema, parametreGlobalUpdateSchema } from '../validators/parametreGlobal.js';

const parametreGlobalService = new ParametreGlobalService();

export class ParametreGlobalController {
  async create(req: Request, res: Response) {
    try {
      const data = parametreGlobalSchema.parse(req.body);
      const parametre = await parametreGlobalService.createParametreGlobal(data);
      res.status(201).json({ message: 'Paramètre global créé avec succès.', parametre });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la création du paramètre global : ${err.message}` });
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const parametres = await parametreGlobalService.getAllParametresGlobaux();
      res.json({ message: 'Paramètres globaux récupérés avec succès.', parametres });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les paramètres globaux : ${err.message}` });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const parametre = await parametreGlobalService.getParametreGlobalById(id);
      res.json({ message: 'Paramètre global récupéré avec succès.', parametre });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async getByKey(req: Request, res: Response) {
    try {
      const cle = req.params.cle;
      if (typeof cle !== 'string') {
        return res.status(400).json({ error: "Le paramètre 'cle' est requis." });
      }
      const parametre = await parametreGlobalService.getParametreGlobalByKey(cle);
      res.json({ message: 'Paramètre global récupéré avec succès.', parametre });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = parametreGlobalUpdateSchema.parse(req.body);
      const parametre = await parametreGlobalService.updateParametreGlobal(id, data);
      res.json({ message: 'Paramètre global mis à jour avec succès.', parametre });
    } catch (err: any) {
      if (err.errors) {
        res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
      } else {
        res.status(400).json({ error: `Échec de la mise à jour du paramètre global : ${err.message}` });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await parametreGlobalService.deleteParametreGlobal(id);
      res.status(200).json({ message: `Paramètre global avec l'identifiant ${id} supprimé avec succès.` });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de supprimer le paramètre global : ${err.message}` });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      const categorie = req.params.categorie;
      if (typeof categorie !== 'string') {
        return res.status(400).json({ error: "Le paramètre 'categorie' est requis." });
      }
      const parametres = await parametreGlobalService.getParametresByCategory(categorie);
      res.json({ message: `Paramètres globaux de la catégorie '${categorie}' récupérés avec succès.`, parametres });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer les paramètres de la catégorie : ${err.message}` });
    }
  }

  async getValue(req: Request, res: Response) {
    try {
      const cle = req.params.cle;
      if (typeof cle !== 'string') {
        return res.status(400).json({ error: "Le paramètre 'cle' est requis." });
      }
      const valeur = await parametreGlobalService.getParametreValue(cle);
      if (valeur === null) {
        return res.status(404).json({ error: `Paramètre global '${cle}' non trouvé` });
      }
      res.json({ cle, valeur });
    } catch (err: any) {
      res.status(500).json({ error: `Impossible de récupérer la valeur du paramètre : ${err.message}` });
    }
  }
}
