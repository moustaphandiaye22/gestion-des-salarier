import request from 'supertest';
import app from '../index.js'; // Adjust path as needed
import { ExportService } from '../src/service/exportService.js';

jest.mock('../src/service/exportService');

describe('EmployeController', () => {
  describe('GET /api/employes/export/template', () => {
    it('should return the employee template Excel file', async () => {
      const mockBuffer = Buffer.from('test excel content');
      (ExportService.prototype.exportEmployeeTemplate as jest.Mock).mockResolvedValue(mockBuffer);

      const response = await request(app)
        .get('/api/employes/export/template')
        .set('Authorization', 'Bearer testtoken')
        .expect('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .expect('Content-Disposition', 'attachment; filename="modele-employes.xlsx"')
        .expect(200);

      expect(response.body).toEqual(mockBuffer);
      expect(ExportService.prototype.exportEmployeeTemplate).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (ExportService.prototype.exportEmployeeTemplate as jest.Mock).mockRejectedValue(new Error('Export failed'));

      const response = await request(app)
        .get('/api/employes/export/template')
        .set('Authorization', 'Bearer testtoken')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/Export failed/);
    });
  });
});
