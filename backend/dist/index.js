import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import employeRoutes from './src/routes/employeRoutes.js';
import entrepriseRoutes from './src/routes/entrepriseRoutes.js';
import bulletinRoutes from './src/routes/bulletinRoutes.js';
import paiementRoutes from './src/routes/paiementRoutes.js';
import cyclePaieRoutes from './src/routes/cyclePaieRoutes.js';
import parametreEntrepriseRoutes from './src/routes/parametreEntrepriseRoutes.js';
import rapportRoutes from './src/routes/rapportRoutes.js';
import tableauDeBordRoutes from './src/routes/tableauDeBordRoutes.js';
import journalAuditRoutes from './src/routes/journalAuditRoutes.js';
import { authenticateToken } from './src/middleware/authMiddleware.js';
import { requireRole } from './src/middleware/rbacMiddleware.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
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
app.use('/api/parametres-entreprise', authenticateToken, parametreEntrepriseRoutes);
app.use('/api/rapports', authenticateToken, rapportRoutes);
app.use('/api/tableaux-de-bord', authenticateToken, tableauDeBordRoutes);
app.use('/api/journaux-audit', authenticateToken, journalAuditRoutes);
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map