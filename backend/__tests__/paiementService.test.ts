import { PaiementService } from '../src/service/paiementService.js';
import { paiementRepository } from '../src/repositories/paiement.js';
import { bulletinRepository } from '../src/repositories/bulletin.js';

jest.mock('../src/repositories/paiement.js');
jest.mock('../src/repositories/bulletin.js');

describe('PaiementService', () => {
  let service: PaiementService;

  beforeEach(() => {
    service = new PaiementService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createPaiement should validate and create paiement', async () => {
    const data = { montant: 1000, statut: 'EN_ATTENTE' };
    (paiementRepository.prototype.create as jest.Mock).mockResolvedValue(data);

    const result = await service.createPaiement(data);

    expect(paiementRepository.prototype.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(data);
  });

  test('updatePaiement should update and set bulletin statut to PAYE if all payments PAYE', async () => {
    const id = 1;
    const data = { statut: 'PAYE' };
    const updatedPaiement = { id, bulletinId: 10, statut: 'PAYE' };
    const bulletin = { id: 10, statutPaiement: 'EN_ATTENTE' };
    const allPayments = [{ statut: 'PAYE' }, { statut: 'PAYE' }];

    (paiementRepository.prototype.update as jest.Mock).mockResolvedValue(updatedPaiement);
    (bulletinRepository.prototype.findById as jest.Mock).mockResolvedValue(bulletin);
    (paiementRepository.prototype.findByBulletin as jest.Mock).mockResolvedValue(allPayments);
    (bulletinRepository.prototype.setStatutPaiement as jest.Mock).mockResolvedValue(true);

    const result = await service.updatePaiement(id, data);

    expect(paiementRepository.prototype.update).toHaveBeenCalledWith(id, data);
    expect(bulletinRepository.prototype.setStatutPaiement).toHaveBeenCalledWith(bulletin.id, 'PAYE');
    expect(result).toEqual(updatedPaiement);
  });

  test('getAllPaiements should filter by user role', async () => {
    const user = { role: 'ADMIN_ENTREPRISE', entrepriseId: 5 };
    const payments = [{ entrepriseId: 5 }, { entrepriseId: 6 }];

    (paiementRepository.prototype.findAllByUser as jest.Mock).mockResolvedValue(payments);

    const result = await service.getAllPaiements(user);

    expect(paiementRepository.prototype.findAllByUser).toHaveBeenCalledWith(user);
    expect(result).toEqual(payments);
  });
});
