import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { kpiService } from './kpiService.js';
import { alerteService } from './alerteService.js';

export interface WebSocketClient {
  socketId: string;
  entrepriseId: number;
  utilisateurId: number;
  tableauDeBordId?: number | undefined;
}

export class WebSocketService {
  private io: SocketIOServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();
  private kpiIntervals: Map<number, NodeJS.Timeout> = new Map(); // entrepriseId -> interval

  /**
   * Initialise le serveur WebSocket
   */
  initialize(httpServer: HTTPServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Client connecté: ${socket.id}`);

      // Authentification du client
      socket.on('authenticate', (data: { entrepriseId: number; utilisateurId: number; tableauDeBordId?: number }) => {
        this.authenticateClient(socket.id, data);
      });

      // Rejoindre une salle spécifique à l'entreprise
      socket.on('join-enterprise', (entrepriseId: number) => {
        socket.join(`enterprise:${entrepriseId}`);
        console.log(`Client ${socket.id} a rejoint l'entreprise ${entrepriseId}`);
      });

      // Rejoindre une salle spécifique au tableau de bord
      socket.on('join-dashboard', (tableauDeBordId: number) => {
        socket.join(`dashboard:${tableauDeBordId}`);
        console.log(`Client ${socket.id} a rejoint le tableau ${tableauDeBordId}`);
      });

      // Demande de rafraîchissement manuel des KPIs
      socket.on('refresh-kpis', async (data: { entrepriseId: number; tableauDeBordId: number }) => {
        try {
          const kpis = await kpiService.calculateAllKPIs(data.entrepriseId, data.tableauDeBordId);
          socket.emit('kpi-update', kpis);

          // Diffuser à tous les clients de la même entreprise
          this.io?.to(`enterprise:${data.entrepriseId}`).emit('kpi-update', kpis);
        } catch (error) {
          console.error('Erreur lors du rafraîchissement des KPIs:', error);
          socket.emit('error', { message: 'Erreur lors du rafraîchissement des KPIs' });
        }
      });

      // Demande d'alertes non lues
      socket.on('get-alerts', async (data: { entrepriseId: number; tableauDeBordId: number }) => {
        try {
          const alertes = await alerteService.getAlertesNonLues(data.tableauDeBordId, data.entrepriseId);
          socket.emit('alerts-update', alertes);
        } catch (error) {
          console.error('Erreur lors de la récupération des alertes:', error);
          socket.emit('error', { message: 'Erreur lors de la récupération des alertes' });
        }
      });

      // Marquer une alerte comme lue
      socket.on('mark-alert-read', async (alerteId: number) => {
        try {
          await alerteService.marquerCommeLue(alerteId);
          const client = this.clients.get(socket.id);
          if (client) {
            const alertes = await alerteService.getAlertesNonLues(client.tableauDeBordId!, client.entrepriseId);
            this.io?.to(`dashboard:${client.tableauDeBordId}`).emit('alerts-update', alertes);
          }
        } catch (error) {
          console.error('Erreur lors du marquage de l\'alerte:', error);
        }
      });

      // Gestion de la déconnexion
      socket.on('disconnect', () => {
        console.log(`Client déconnecté: ${socket.id}`);
        this.removeClient(socket.id);
      });
    });

    console.log('Service WebSocket initialisé');
  }

  /**
   * Authentifie un client WebSocket
   */
  private authenticateClient(socketId: string, data: { entrepriseId: number; utilisateurId: number; tableauDeBordId?: number }): void {
    const client: WebSocketClient = {
      socketId,
      entrepriseId: data.entrepriseId,
      utilisateurId: data.utilisateurId,
      tableauDeBordId: data.tableauDeBordId
    };

    this.clients.set(socketId, client);

    // Démarrer les mises à jour automatiques des KPIs pour cette entreprise
    this.startKPIUpdates(data.entrepriseId, data.tableauDeBordId);

    console.log(`Client authentifié: ${socketId} pour entreprise ${data.entrepriseId}`);
  }

  /**
   * Supprime un client de la liste
   */
  private removeClient(socketId: string): void {
    const client = this.clients.get(socketId);
    if (client) {
      this.clients.delete(socketId);

      // Vérifier s'il y a encore des clients pour cette entreprise
      const entrepriseClients = Array.from(this.clients.values()).filter(c => c.entrepriseId === client.entrepriseId);

      if (entrepriseClients.length === 0) {
        // Arrêter les mises à jour automatiques pour cette entreprise
        this.stopKPIUpdates(client.entrepriseId);
      }
    }
  }

  /**
   * Démarre les mises à jour automatiques des KPIs pour une entreprise
   */
  private startKPIUpdates(entrepriseId: number, tableauDeBordId?: number): void {
    if (this.kpiIntervals.has(entrepriseId)) {
      return; // Les mises à jour sont déjà démarrées
    }

    // Mettre à jour les KPIs toutes les 30 secondes
    const interval = setInterval(async () => {
      try {
        if (tableauDeBordId) {
          const kpis = await kpiService.calculateAllKPIs(entrepriseId, tableauDeBordId);

          // Envoyer les mises à jour aux clients de cette entreprise
          this.io?.to(`enterprise:${entrepriseId}`).emit('kpi-update', kpis);

          // Générer et envoyer les alertes
          await alerteService.genererAlertesAutomatiques(entrepriseId, tableauDeBordId);
          const alertes = await alerteService.getAlertesNonLues(tableauDeBordId, entrepriseId);
          this.io?.to(`dashboard:${tableauDeBordId}`).emit('alerts-update', alertes);
        }
      } catch (error) {
        console.error(`Erreur lors de la mise à jour des KPIs pour l'entreprise ${entrepriseId}:`, error);
      }
    }, 30000); // 30 secondes

    this.kpiIntervals.set(entrepriseId, interval);
    console.log(`Mises à jour automatiques démarrées pour l'entreprise ${entrepriseId}`);
  }

  /**
   * Arrête les mises à jour automatiques des KPIs pour une entreprise
   */
  private stopKPIUpdates(entrepriseId: number): void {
    const interval = this.kpiIntervals.get(entrepriseId);
    if (interval) {
      clearInterval(interval);
      this.kpiIntervals.delete(entrepriseId);
      console.log(`Mises à jour automatiques arrêtées pour l'entreprise ${entrepriseId}`);
    }
  }

  /**
   * Envoie une notification à tous les clients d'une entreprise
   */
  sendNotificationToEntreprise(entrepriseId: number, notification: any): void {
    this.io?.to(`enterprise:${entrepriseId}`).emit('notification', notification);
  }

  /**
   * Envoie une notification à tous les clients d'un tableau de bord
   */
  sendNotificationToDashboard(tableauDeBordId: number, notification: any): void {
    this.io?.to(`dashboard:${tableauDeBordId}`).emit('notification', notification);
  }

  /**
   * Envoie une mise à jour de données spécifiques
   */
  sendDataUpdate(entrepriseId: number, type: string, data: any): void {
    this.io?.to(`enterprise:${entrepriseId}`).emit('data-update', { type, data });
  }

  /**
   * Obtient les statistiques de connexions
   */
  getConnectionStats(): { totalClients: number; clientsByEntreprise: Record<number, number> } {
    const clientsByEntreprise: Record<number, number> = {};

    Array.from(this.clients.values()).forEach(client => {
      clientsByEntreprise[client.entrepriseId] = (clientsByEntreprise[client.entrepriseId] || 0) + 1;
    });

    return {
      totalClients: this.clients.size,
      clientsByEntreprise
    };
  }

  /**
   * Force la déconnexion de tous les clients d'une entreprise
   */
  disconnectEntrepriseClients(entrepriseId: number): void {
    const clientsToDisconnect = Array.from(this.clients.entries())
      .filter(([_, client]) => client.entrepriseId === entrepriseId);

    clientsToDisconnect.forEach(([socketId, _]) => {
      const socket = this.io?.sockets.sockets.get(socketId);
      socket?.disconnect();
      this.removeClient(socketId);
    });
  }

  /**
   * Nettoie les ressources
   */
  cleanup(): void {
    // Arrêter tous les intervalles
    Array.from(this.kpiIntervals.values()).forEach(interval => {
      clearInterval(interval);
    });
    this.kpiIntervals.clear();
    this.clients.clear();

    // Fermer le serveur WebSocket
    if (this.io) {
      this.io.close();
      this.io = null;
    }
  }
}

export const websocketService = new WebSocketService();