import { PaiementService } from '../service/paiementService.js';
import { paiementSchema } from '../validators/paiement.js';
const paiementService = new PaiementService();
export class PaiementController {
    async create(req, res) {
        try {
            const data = paiementSchema.parse(req.body);
            const paiement = await paiementService.createPaiement(data);
            res.status(201).json({ message: 'Paiement créé avec succès.', paiement });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création du paiement : ${err.message}` });
            }
        }
    }
    async getAll(req, res) {
        try {
            const paiements = await paiementService.getAllPaiements();
            res.json({ message: 'Liste des paiements récupérée avec succès.', paiements });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les paiements : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const paiement = await paiementService.getPaiement(id);
            if (!paiement) {
                return res.status(404).json({ error: `Aucun paiement trouvé avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Paiement récupéré avec succès.', paiement });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer le paiement : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = paiementSchema.partial().parse(req.body);
            const paiement = await paiementService.updatePaiement(id, data);
            res.json({ message: 'Paiement mis à jour avec succès.', paiement });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour du paiement : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await paiementService.deletePaiement(id);
            res.status(200).json({ message: `Paiement avec l'identifiant ${id} supprimé avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer le paiement : ${err.message}` });
        }
    }
}
//# sourceMappingURL=paiementController.js.map