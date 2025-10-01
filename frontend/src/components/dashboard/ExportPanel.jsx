import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button } from '../ui';
import {
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import dashboardApi from '../../utils/dashboardApi';
import { useAuth } from '../../context/AuthContext';

const ExportPanel = ({ entrepriseId }) => {
  const { user } = useAuth();
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Types d'export disponibles
  const exportTypes = [
    { value: 'DONNEES_ANALYTIQUES', label: 'Données Analytiques', description: 'Rapport complet avec statistiques' },
    { value: 'RAPPORT_SALARIAL', label: 'Rapport Salarial', description: 'Bulletins et masse salariale' },
    { value: 'LISTE_EMPLOYES', label: 'Liste des Employés', description: 'Informations détaillées des employés' },
    { value: 'BULLETINS_PAIE', label: 'Bulletins de Paie', description: 'Tous les bulletins générés' },
    { value: 'PAIEMENTS', label: 'Historique des Paiements', description: 'Transactions et statuts' },
    { value: 'KPI_DASHBOARD', label: 'KPI Dashboard', description: 'Indicateurs de performance' }
  ];

  const exportFormats = [
    { value: 'PDF', label: 'PDF', icon: '📄' },
    { value: 'EXCEL', label: 'Excel', icon: '📊' },
    { value: 'CSV', label: 'CSV', icon: '📋' },
    { value: 'JSON', label: 'JSON', icon: '💾' }
  ];

  useEffect(() => {
    loadExports();
  }, []);

  const loadExports = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getExports();
      if (response.success) {
        setExports(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des exports:', error);
      // Pour les erreurs 401, afficher un message au lieu de rediriger
      if (error.response?.status === 401) {
        showNotification('Session expirée. Veuillez vous reconnecter pour accéder aux exports.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type, format) => {
    if (!user?.id || !entrepriseId) {
      showNotification('Informations utilisateur manquantes', 'error');
      return;
    }

    try {
      setExportLoading(true);

      // Paramètres par défaut selon le type d'export
      const defaultParams = {
        DONNEES_ANALYTIQUES: {},
        RAPPORT_SALARIAL: {
          mois: new Date().getMonth() + 1,
          annee: new Date().getFullYear()
        },
        LISTE_EMPLOYES: {},
        BULLETINS_PAIE: {
          dateDebut: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateFin: new Date().toISOString().split('T')[0]
        },
        PAIEMENTS: {
          dateDebut: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateFin: new Date().toISOString().split('T')[0]
        },
        KPI_DASHBOARD: {}
      };

      const response = await dashboardApi.createExport(type, format, defaultParams[type]);

      if (response.success) {
        // Recharger la liste des exports
        loadExports();

        // Afficher une notification de succès
        showNotification('Export lancé avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      if (error.response?.status === 401) {
        showNotification('Session expirée. Veuillez vous reconnecter.', 'error');
      } else {
        showNotification('Erreur lors de l\'export: ' + (error.response?.data?.message || error.message), 'error');
      }
    } finally {
      setExportLoading(false);
    }
  };

  const handleDownload = async (exportId, fileName) => {
    try {
      const response = await dashboardApi.downloadExport(exportId);

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('Téléchargement démarré', 'success');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      if (error.response?.status === 401) {
        showNotification('Session expirée. Veuillez vous reconnecter pour télécharger.', 'error');
      } else {
        showNotification('Erreur lors du téléchargement', 'error');
      }
    }
  };

  const showNotification = (message, type) => {
    // Implémentation basique - peut être améliorée avec un système de notifications
    if (type === 'success') {
      alert('✅ ' + message);
    } else {
      alert('❌ ' + message);
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'TERMINE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'ECHEC':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  return (
    <Card>
      <CardHeader title="Exports de Données" />
      <CardBody className="p-6">
        <div className="space-y-6">
          {/* Section de création d'export */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Créer un nouvel export</h3>

            {/* Sélection du type d'export */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {exportTypes.map((type) => (
                <div key={type.value} className="border rounded-lg p-3 hover:bg-gray-50">
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>

                  {/* Boutons de format */}
                  <div className="flex gap-2">
                    {exportFormats.map((format) => (
                      <Button
                        key={format.value}
                        onClick={() => handleExport(type.value, format.value)}
                        disabled={exportLoading}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {format.icon} {format.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section des exports existants */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Exports récents</h3>

            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : exports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun export récent</p>
            ) : (
              <div className="space-y-3">
                {exports.slice(0, 5).map((exportItem) => (
                  <div key={exportItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(exportItem.statut)}
                      <div>
                        <p className="font-medium text-gray-900">{exportItem.nom}</p>
                        <p className="text-sm text-gray-600">
                          {exportTypes.find(t => t.value === exportItem.type)?.label} • {exportFormats.find(f => f.value === exportItem.format)?.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          Créé le {formatDate(exportItem.dateCreation)}
                        </p>
                      </div>
                    </div>

                    {exportItem.statut === 'TERMINE' && exportItem.cheminFichier && (
                      <Button
                        onClick={() => handleDownload(exportItem.id, exportItem.cheminFichier)}
                        variant="outline"
                        size="sm"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ExportPanel;
