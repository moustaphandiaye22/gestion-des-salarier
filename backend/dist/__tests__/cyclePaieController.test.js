import request from 'supertest';
import app from '../index.js'; // Adjust path if needed
import { mnprisma as prisma } from '../src/config/db.js';
describe('CyclePaieController', () => {
    let tokenAdmin;
    let tokenCaissier;
    beforeAll(async () => {
        // Login as admin entreprise
        const resAdmin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@techcorp.sn', motDePasse: 'admin123' });
        tokenAdmin = resAdmin.body.accessToken;
        // Login as caissier
        const resCaissier = await request(app)
            .post('/api/auth/login')
            .send({ email: 'caissier@techcorp.sn', motDePasse: 'caissier123' });
        tokenCaissier = resCaissier.body.accessToken;
    });
    test('should close cycle when all payments are PAYE', async () => {
        // Assuming cycle with id 1 has all payments PAYE
        const res = await request(app)
            .put('/api/cycles-paie/1/close')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/clôturé avec succès/i);
    });
    test('should fail to close cycle with pending payments', async () => {
        // Assuming cycle with id 2 has pending payments
        const res = await request(app)
            .put('/api/cycles-paie/2/close')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Tous les paiements doivent être effectués/i);
    });
    test('caissier should not be able to close cycle', async () => {
        const res = await request(app)
            .put('/api/cycles-paie/1/close')
            .set('Authorization', `Bearer ${tokenCaissier}`);
        expect(res.status).toBe(403);
    });
});
//# sourceMappingURL=cyclePaieController.test.js.map