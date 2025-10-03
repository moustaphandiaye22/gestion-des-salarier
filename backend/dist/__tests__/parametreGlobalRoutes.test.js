import request from 'supertest';
import app from '../index.js';
describe('ParametreGlobalRoutes', () => {
    let tokenAdminEntreprise;
    let tokenCaissier;
    beforeAll(async () => {
        // Login as admin entreprise
        const resAdmin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@techcorp.sn', motDePasse: 'admin123' });
        tokenAdminEntreprise = resAdmin.body.accessToken;
        // Login as caissier
        const resCaissier = await request(app)
            .post('/api/auth/login')
            .send({ email: 'caissier@techcorp.sn', motDePasse: 'caissier123' });
        tokenCaissier = resCaissier.body.accessToken;
    });
    test('ADMIN_ENTREPRISE should access parametres-globaux', async () => {
        const res = await request(app)
            .get('/api/parametres-globaux')
            .set('Authorization', `Bearer ${tokenAdminEntreprise}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/parametres globaux récupérés avec succès/i);
        expect(Array.isArray(res.body.parametres)).toBe(true);
    });
    test('CAISSIER should not access parametres-globaux', async () => {
        const res = await request(app)
            .get('/api/parametres-globaux')
            .set('Authorization', `Bearer ${tokenCaissier}`);
        expect(res.status).toBe(403);
    });
    test('unauthenticated request should be denied', async () => {
        const res = await request(app)
            .get('/api/parametres-globaux');
        expect(res.status).toBe(401);
    });
});
//# sourceMappingURL=parametreGlobalRoutes.test.js.map