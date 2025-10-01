import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '../ui';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  BellIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AlertsPanel = ({ alertes = [], onMarkAsRead, onRefresh, loading = false }) => {
  const [showAll, setShowAll] = useState(false);

  const getSeverityIcon = (severite) => {
    switch (severite) {
      case 'CRITIQUE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'ELEVEE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'MOYENNE':
        return <InformationCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severite) => {
    switch (severite) {
      case 'CRITIQUE':
        return 'border-l-red-500 bg-red-50';
      case 'ELEVEE':
        return 'border-l-orange-500 bg-orange-50';
      case 'MOYENNE':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayedAlertes = showAll ? alertes : alertes.slice(0, 5);
  const hasMore = alertes.length > 5;

  if (loading) {
    return (
      <Card>
        <CardHeader title="Alertes et Notifications" />
        <CardBody className="p-6">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BellIcon className="h-5 w-5" />
              Alertes et Notifications
              {alertes.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {alertes.length}
                </span>
              )}
            </span>
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Actualiser
            </Button>
          </div>
        }
      />
      <CardBody className="p-6">
        {alertes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircleIcon className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>Aucune alerte en attente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAlertes.map((alerte) => (
              <div
                key={alerte.id}
                className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alerte.severite)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alerte.severite)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {alerte.titre}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {alerte.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(alerte.dateCreation)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onMarkAsRead(alerte.id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {hasMore && !showAll && (
              <div className="text-center pt-3">
                <Button
                  onClick={() => setShowAll(true)}
                  variant="outline"
                  size="sm"
                >
                  Voir toutes les alertes ({alertes.length})
                </Button>
              </div>
            )}

            {showAll && hasMore && (
              <div className="text-center pt-3">
                <Button
                  onClick={() => setShowAll(false)}
                  variant="outline"
                  size="sm"
                >
                  Voir moins
                </Button>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AlertsPanel;