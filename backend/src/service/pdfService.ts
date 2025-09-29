import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class PDFService {
  static async generatePayslip(bulletinData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('BULLETIN DE PAIE', { align: 'center' });
      doc.moveDown();

      // Employee info
      doc.fontSize(12).text(`Employé: ${bulletinData.employe.nom} ${bulletinData.employe.prenom}`);
      doc.text(`Période: ${bulletinData.periode}`);
      doc.moveDown();

      // Salary details
      doc.text('Salaire de base: ' + bulletinData.salaireBase);
      doc.text('Heures supplémentaires: ' + bulletinData.heuresSup);
      doc.text('Primes: ' + bulletinData.primes);
      doc.text('Déductions: ' + bulletinData.deductions);
      doc.text('Net à payer: ' + bulletinData.netAPayer);

      doc.end();
    });
  }

  static async generatePaymentReceipt(paiementData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      doc.fontSize(20).text('REÇU DE PAIEMENT', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Employé: ${paiementData.employe.nom} ${paiementData.employe.prenom}`);
      doc.text(`Montant: ${paiementData.montant}€`);
      doc.text(`Date: ${paiementData.datePaiement}`);
      doc.text(`Mode: ${paiementData.modePaiement}`);

      doc.end();
    });
  }

  static async generatePaymentList(paiements: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      doc.fontSize(20).text('LISTE DES PAIEMENTS', { align: 'center' });
      doc.moveDown();

      paiements.forEach((paiement, index) => {
        doc.fontSize(12).text(`${index + 1}. ${paiement.employe.nom} ${paiement.employe.prenom} - ${paiement.montant}€ - ${paiement.datePaiement}`);
      });

      doc.end();
    });
  }
}
