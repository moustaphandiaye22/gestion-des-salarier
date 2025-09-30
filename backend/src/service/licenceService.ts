import { LicenceRepository } from '../repositories/licence.js';
import { StatutLicence, TypeLicence } from '@prisma/client';

const licenceRepository = new LicenceRepository();

export class LicenceService {
  async createLicence(data: any) {
    // Vérifier si le nom existe déjà
    const existing = await licenceRepository.getByNom(data.nom);
    if (existing) {
      throw new Error(`Une licence avec le nom '${data.nom}' existe déjà`);
    }

    return await licenceRepository.create(data);
  }

  async getAllLicences() {
    return await licenceRepository.getAll();
  }

  async getLicenceById(id: number) {
    const licence = await licenceRepository.getById(id);
    if (!licence) {
      throw new Error(`Licence avec l'identifiant ${id} non trouvée`);
    }
    return licence;
  }

  async getLicenceByNom(nom: string) {
    const licence = await licenceRepository.getByNom(nom);
    if (!licence) {
      throw new Error(`Licence avec le nom '${nom}' non trouvée`);
    }
    return licence;
  }

  async updateLicence(id: number, data: any) {
    // Vérifier si la licence existe
    await this.getLicenceById(id);

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà
    if (data.nom) {
      const existing = await licenceRepository.getByNom(data.nom);
      if (existing && existing.id !== id) {
        throw new Error(`Une licence avec le nom '${data.nom}' existe déjà`);
      }
    }

    return await licenceRepository.update(id, data);
  }

  async deleteLicence(id: number) {
    // Vérifier si la licence existe
    await this.getLicenceById(id);

    return await licenceRepository.delete(id);
  }

  async getLicencesByEntreprise(entrepriseId: number) {
    return await licenceRepository.getByEntreprise(entrepriseId);
  }

  async getLicencesByStatut(statut: StatutLicence) {
    return await licenceRepository.getByStatut(statut);
  }

  async getLicencesByType(typeLicence: TypeLicence) {
    return await licenceRepository.getByType(typeLicence);
  }

  async assignLicenceToEntreprise(licenceId: number, entrepriseId: number) {
    const licence = await this.getLicenceById(licenceId);
    if (licence.entrepriseId) {
      throw new Error('Cette licence est déjà assignée à une entreprise');
    }

    return await licenceRepository.update(licenceId, { entrepriseId });
  }

  async revokeLicenceFromEntreprise(licenceId: number) {
    const licence = await this.getLicenceById(licenceId);
    if (!licence.entrepriseId) {
      throw new Error('Cette licence n\'est assignée à aucune entreprise');
    }

    return await licenceRepository.update(licenceId, { entrepriseId: null });
  }
}
