import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui';

const DashboardFilters = ({ onFiltersChange, currentFilters }) => {
  const [period, setPeriod] = useState(currentFilters?.period || 'MOIS');
  const [comparison, setComparison] = useState(currentFilters?.comparison || 'MOIS_PRECEDENT');
  const [customStartDate, setCustomStartDate] = useState(currentFilters?.customStartDate || '');
  const [customEndDate, setCustomEndDate] = useState(currentFilters?.customEndDate || '');

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    onFiltersChange({
      period: newPeriod,
      comparison,
      customStartDate: newPeriod === 'CUSTOM' ? customStartDate : '',
      customEndDate: newPeriod === 'CUSTOM' ? customEndDate : ''
    });
  };

  const handleComparisonChange = (newComparison) => {
    setComparison(newComparison);
    onFiltersChange({
      period,
      comparison: newComparison,
      customStartDate,
      customEndDate
    });
  };

  const handleCustomDateChange = (startDate, endDate) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    onFiltersChange({
      period,
      comparison,
      customStartDate: startDate,
      customEndDate: endDate
    });
  };

  const getPeriodLabel = (periodValue) => {
    switch (periodValue) {
      case 'JOUR': return 'Aujourd\'hui';
      case 'SEMAINE': return 'Cette semaine';
      case 'MOIS': return 'Ce mois';
      case 'TRIMESTRE': return 'Ce trimestre';
      case 'ANNEE': return 'Cette année';
      case 'CUSTOM': return 'Période personnalisée';
      default: return periodValue;
    }
  };

  const getComparisonLabel = (comparisonValue) => {
    switch (comparisonValue) {
      case 'JOUR_PRECEDENT': return 'Jour précédent';
      case 'SEMAINE_PRECEDENTE': return 'Semaine précédente';
      case 'MOIS_PRECEDENT': return 'Mois précédent';
      case 'TRIMESTRE_PRECEDENT': return 'Trimestre précédent';
      case 'ANNEE_PRECEDENTE': return 'Année précédente';
      case 'AUCUNE': return 'Aucune comparaison';
      default: return comparisonValue;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader title="Filtres et Périodes" />
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Période d'analyse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période d'analyse
            </label>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="JOUR">Aujourd'hui</option>
              <option value="SEMAINE">Cette semaine</option>
              <option value="MOIS">Ce mois</option>
              <option value="TRIMESTRE">Ce trimestre</option>
              <option value="ANNEE">Cette année</option>
              <option value="CUSTOM">Période personnalisée</option>
            </select>
          </div>

          {/* Comparaison */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comparer avec
            </label>
            <select
              value={comparison}
              onChange={(e) => handleComparisonChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="AUCUNE">Aucune comparaison</option>
              <option value="JOUR_PRECEDENT">Jour précédent</option>
              <option value="SEMAINE_PRECEDENTE">Semaine précédente</option>
              <option value="MOIS_PRECEDENT">Mois précédent</option>
              <option value="TRIMESTRE_PRECEDENT">Trimestre précédent</option>
              <option value="ANNEE_PRECEDENTE">Année précédente</option>
            </select>
          </div>

          {/* Dates personnalisées */}
          {period === 'CUSTOM' && (
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période personnalisée
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => handleCustomDateChange(e.target.value, customEndDate)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Début"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => handleCustomDateChange(customStartDate, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Fin"
                />
              </div>
            </div>
          )}
        </div>

        {/* Résumé des filtres actifs */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>
              <strong>Période:</strong> {getPeriodLabel(period)}
            </span>
            {comparison !== 'AUCUNE' && (
              <span>
                <strong>Comparaison:</strong> {getComparisonLabel(comparison)}
              </span>
            )}
            {period === 'CUSTOM' && customStartDate && customEndDate && (
              <span>
                <strong>Dates:</strong> {new Date(customStartDate).toLocaleDateString('fr-FR')} - {new Date(customEndDate).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DashboardFilters;
