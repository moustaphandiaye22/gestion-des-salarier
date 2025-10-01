import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export interface WebSocketClient {
  socketId: string;
  entrepriseId: number;
  utilisateurId: number;
}

export class WebSocketService {
  private io: SocketIOServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();

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
      socket.on('authenticate', (data: { entrepriseId: number; utilisateurId: number }) => {
        this.authenticateClient(socket.id, data);
      });

      // Rejoindre une salle spécifique à l'entreprise
      socket.on('join-enterprise', (entrepriseId: number) => {
        socket.join(`enterprise:${entrepriseId}`);
        console.log(`Client ${socket.id} a rejoint l'entreprise ${entrepriseId}`);
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
  private authenticateClient(socketId: string, data: { entrepriseId: number; utilisateurId: number }): void {
    const client: WebSocketClient = {
      socketId,
      entrepriseId: data.entrepriseId,
      utilisateurId: data.utilisateurId
    };

    this.clients.set(socketId, client);
    console.log(`Client authentifié: ${socketId} pour entreprise ${data.entrepriseId}`);
  }

  /**
   * Supprime un client de la liste
   */
  private removeClient(socketId: string): void {
    this.clients.delete(socketId);
  }

  /**
   * Envoie une notification à tous les clients d'une entreprise
   */
  sendNotificationToEntreprise(entrepriseId: number, notification: any): void {
    this.io?.to(`enterprise:${entrepriseId}`).emit('notification', notification);
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
    this.clients.clear();

    // Fermer le serveur WebSocket
    if (this.io) {
      this.io.close();
      this.io = null;
    }
  }
}

export const websocketService = new WebSocketService();