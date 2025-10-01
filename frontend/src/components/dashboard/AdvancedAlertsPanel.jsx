import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../ui';
import { dashboardApi } from '../../utils/dashboardApi';

const AdvancedAlertsPanel = ({ tableauDeBordId, entrepriseId, isSuperAdmin }) => {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, CRITIQUE, ELEVEE, MOYENNE, FAIBLE

  useEffect(() => {
    loadAlertes();
  }, [tableauDeBordId, entrepriseId, isSuperAdmin]);

  const loadAlertes = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getAlertes(tableauDeBordId, entrepriseId, isSuperAdmin);
      setAlertes(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      setAlertes([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alerteId) => {
    try {
      await dashboardApi.markAlerteAsRead(alerteId);
      setAlertes(alertes.map(alerte =>
        alerte.id === alerteId ? { ...alerte, estLue: true } : alerte
      ));
    } catch (error) {
      console.error('Erreur lors du marquage de l\'alerte comme lue:', error);
    }
  };

  const getSeverityColor = (severite) => {
    switch (severite) {
      case 'CRITIQUE': return 'bg-red-100 border-red-500 text-red-800';
      case 'ELEVEE': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'MOYENNE': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'FAIBLE': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severite) => {
    switch (severite) {
      case 'CRITIQUE': return '🚨';
      case 'ELEVEE': return '⚠️';
      case 'MOYENNE': return '📊';
      case 'FAIBLE': return 'ℹ️';
      default: return '📌';
    }
  };

  const filteredAlertes = alertes.filter(alerte => {
    if (filter === 'ALL') return true;
    return alerte.severite === filter;
  });

  const unreadCount = alertes.filter(alerte => !alerte.estLue).length;

  if (loading) {
    return (
      <Card>
        <CardHeader title="Alertes Avancées" />
        <CardBody>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Chargement des alertes...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={`Alertes Avancées ${unreadCount > 0 ? `(${unreadCount} non lues)` : ''}`}
        actions={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Toutes les alertes</option>
            <option value="CRITIQUE">Critiques</option>
            <option value="ELEVEE">Élevées</option>
            <option value="MOYENNE">Moyennes</option>
            <option value="FAIBLE">Faibles</option>
          </select>
        }
      />
      <CardBody className="p-0">
        {filteredAlertes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <p>Aucune alerte pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAlertes.map((alerte) => (
              <div
                key={alerte.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !alerte.estLue ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getSeverityIcon(alerte.severite)}</span>
                      <h4 className={`font-medium ${!alerte.estLue ? 'text-blue-900' : 'text-gray-900'}`}>
                        {alerte.titre}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alerte.severite)}`}>
                        {alerte.severite}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alerte.type === 'TENDANCE_MASSE_SALARIALE' || alerte.type === 'TENDANCE_ABSENTEISME'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {alerte.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className={`text-sm ${!alerte.estLue ? 'text-blue-700' : 'text-gray-600'}`}>
                      {alerte.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(alerte.dateCreation).toLocaleString('fr-FR')}
                      </span>
                      {!alerte.estLue && (
                        <button
                          onClick={() => markAsRead(alerte.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AdvancedAlertsPanel;
