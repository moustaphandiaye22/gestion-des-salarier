import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import employeRoutes from './src/routes/employeRoutes.js';
import entrepriseRoutes from './src/routes/entrepriseRoutes.js';
import bulletinRoutes from './src/routes/bulletinRoutes.js';
import paiementRoutes from './src/routes/paiementRoutes.js';
import cyclePaieRoutes from './src/routes/cyclePaieRoutes.js';
import pointageRoutes from './src/routes/pointageRoutes.js';
import qrCodeRoutes from './src/routes/qrCodeRoutes.js';
import parametreEntrepriseRoutes from './src/routes/parametreEntrepriseRoutes.js';
import parametreGlobalRoutes from './src/routes/parametreGlobalRoutes.js';
import rapportRoutes from './src/routes/rapportRoutes.js';

import journalAuditRoutes from './src/routes/journalAuditRoutes.js';
import licenceRoutes from './src/routes/licenceRoutes.js';
import professionRoutes from './src/routes/professionRoutes.js';
import { authenticateToken } from './src/middleware/authMiddleware.js';
import { requireRole } from './src/middleware/rbacMiddleware.js';
import { websocketService } from './src/service/websocketService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve static files from assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API for Gestion des Salariés is running!' });
});

// Public auth routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/utilisateurs', authenticateToken, utilisateurRoutes);
app.use('/api/employes', authenticateToken, employeRoutes);
app.use('/api/entreprises', authenticateToken, entrepriseRoutes);
app.use('/api/bulletins', authenticateToken, bulletinRoutes);
app.use('/api/paiements', authenticateToken, paiementRoutes);
app.use('/api/cycles-paie', authenticateToken, cyclePaieRoutes);
app.use('/api/pointages', authenticateToken, pointageRoutes);

// QR Code routes (scan and pointer don't require auth, others do)
app.use('/api/qrcodes', qrCodeRoutes);
app.use('/api/parametres-entreprise', authenticateToken, parametreEntrepriseRoutes);
app.use('/api/parametres-globaux', authenticateToken, parametreGlobalRoutes);
app.use('/api/rapports', authenticateToken, rapportRoutes);

app.use('/api/journaux-audit', authenticateToken, journalAuditRoutes);
app.use('/api/licences', authenticateToken, licenceRoutes);
app.use('/api/professions', authenticateToken, professionRoutes);

// Error handling middleware global
import { errorHandler } from './src/middleware/errorMiddleware.js';
app.use(errorHandler);

// Initialize WebSocket service
websocketService.initialize(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is ready`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  websocketService.cleanup();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  websocketService.cleanup();
  await prisma.$disconnect();
  process.exit(0);
});
