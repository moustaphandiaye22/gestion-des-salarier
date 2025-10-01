import { Server as HTTPServer } from 'http';
export interface WebSocketClient {
    socketId: string;
    entrepriseId: number;
    utilisateurId: number;
}
export declare class WebSocketService {
    private io;
    private clients;
    /**
     * Initialise le serveur WebSocket
     */
    initialize(httpServer: HTTPServer): void;
    /**
     * Authentifie un client WebSocket
     */
    private authenticateClient;
    /**
     * Supprime un client de la liste
     */
    private removeClient;
    /**
     * Envoie une notification à tous les clients d'une entreprise
     */
    sendNotificationToEntreprise(entrepriseId: number, notification: any): void;
    /**
     * Envoie une mise à jour de données spécifiques
     */
    sendDataUpdate(entrepriseId: number, type: string, data: any): void;
    /**
     * Obtient les statistiques de connexions
     */
    getConnectionStats(): {
        totalClients: number;
        clientsByEntreprise: Record<number, number>;
    };
    /**
     * Force la déconnexion de tous les clients d'une entreprise
     */
    disconnectEntrepriseClients(entrepriseId: number): void;
    /**
     * Nettoie les ressources
     */
    cleanup(): void;
}
export declare const websocketService: WebSocketService;
//# sourceMappingURL=websocketService.d.ts.map