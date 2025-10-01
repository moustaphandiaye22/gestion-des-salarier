import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (entrepriseId, tableauDeBordId, utilisateurId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [kpiData, setKpiData] = useState({});
  const [alertes, setAlertes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  const reconnectTimeoutRef = useRef(null);

  // Vérifier que toutes les informations nécessaires sont disponibles
  // Pour le superadmin, entrepriseId peut être null (vue globale)
  // Dans ce cas, on ne se connecte pas au WebSocket
  const canConnect = utilisateurId && tableauDeBordId && entrepriseId !== null && entrepriseId !== undefined;

  // Connexion WebSocket
  useEffect(() => {
    if (!canConnect) {
      console.log('Informations manquantes pour la connexion WebSocket:', {
        entrepriseId,
        utilisateurId,
        tableauDeBordId,
        canConnect
      });
      return;
    }

    console.log('Tentative de connexion WebSocket avec:', {
      entrepriseId,
      utilisateurId,
      tableauDeBordId
    });

    // Vérification supplémentaire pour éviter les connexions avec des valeurs null
    if (utilisateurId && tableauDeBordId && entrepriseId !== null && entrepriseId !== undefined) {
      const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3015', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      // Gestionnaire de connexion
      newSocket.on('connect', () => {
        console.log('WebSocket connecté:', newSocket.id);
        setIsConnected(true);

        // Authentification
        newSocket.emit('authenticate', {
          entrepriseId,
          utilisateurId,
          tableauDeBordId
        });

        // Rejoindre les salles
        newSocket.emit('join-enterprise', entrepriseId);
        if (tableauDeBordId) {
          newSocket.emit('join-dashboard', tableauDeBordId);
        }
      });

      // Gestionnaire de déconnexion
      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket déconnecté:', reason);
        setIsConnected(false);

        // Tentative de reconnexion automatique
        if (reason === 'io server disconnect' || reason === 'transport close') {
          reconnectTimeoutRef.current = setTimeout(() => {
            newSocket.connect();
          }, 3000);
        }
      });

      // Gestionnaire d'erreur de connexion
      newSocket.on('connect_error', (error) => {
        console.error('Erreur de connexion WebSocket:', error);
        setIsConnected(false);

        // Tentative de reconnexion
        reconnectTimeoutRef.current = setTimeout(() => {
          newSocket.connect();
        }, 5000);
      });

      // Gestionnaire de mise à jour des KPIs
      newSocket.on('kpi-update', (data) => {
        console.log('KPIs mis à jour:', data);
        setKpiData(data);
        setLastUpdate(new Date());
      });

      // Gestionnaire de mise à jour des alertes
      newSocket.on('alerts-update', (data) => {
        console.log('Alertes mises à jour:', data);
        setAlertes(data);
      });

      // Gestionnaire des notifications
      newSocket.on('notification', (notification) => {
        console.log('Nouvelle notification:', notification);
        setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Garder les 10 dernières
      });

      // Gestionnaire des erreurs
      newSocket.on('error', (error) => {
        console.error('Erreur WebSocket:', error);
      });

      setSocket(newSocket);

      // Cleanup function to close socket on unmount or dependency change
      return () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        newSocket.close();
      };
    }
  }, [entrepriseId, utilisateurId, tableauDeBordId]);

  // Fonction pour envoyer un message
  const sendMessage = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  // Fonction pour rafraîchir manuellement les KPIs
  const refreshKPIs = useCallback(() => {
    sendMessage('refresh-kpis', { entrepriseId, tableauDeBordId });
  }, [sendMessage, entrepriseId, tableauDeBordId]);

  // Fonction pour récupérer les alertes
  const getAlerts = useCallback(() => {
    sendMessage('get-alerts', { entrepriseId, tableauDeBordId });
  }, [sendMessage, entrepriseId, tableauDeBordId]);

  // Fonction pour marquer une alerte comme lue
  const markAlertAsRead = useCallback((alerteId) => {
    sendMessage('mark-alert-read', alerteId);
  }, [sendMessage]);

  return {
    socket,
    isConnected,
    kpiData,
    alertes,
    notifications,
    lastUpdate,
    sendMessage,
    refreshKPIs,
    getAlerts,
    markAlertAsRead
  };
};
