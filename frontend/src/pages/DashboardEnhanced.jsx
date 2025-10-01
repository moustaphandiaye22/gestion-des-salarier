import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button } from "../components/ui";
import { dashboardApi } from "../utils/dashboardApi";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import AdvancedAlertsPanel from "../components/dashboard/AdvancedAlertsPanel";
import KPICard from "../components/dashboard/KPICard";
import EvolutionChart from "../components/dashboard/EvolutionChart";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function DashboardEnhanced() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState({});
  const [evolutionData, setEvolutionData] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    period: 'MOIS',
    startDate: null,
    endDate: null
  });

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const entrepriseId = isSuperAdmin ? null : user?.entrepriseId;

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Charger les KPIs
      const kpisResponse = await dashboardApi.getKPIs(entrepriseId, isSuperAdmin);
      setKpis(kpisResponse.data || {});

      // Charger les données d'évolution
      const evolutionResponse = await dashboardApi.getEvolution(entrepriseId, isSuperAdmin, filters);
      setEvolutionData(evolutionResponse.data || []);

      // Charger les alertes
      const alertesResponse = await dashboardApi.getAlertes(1, entrepriseId, isSuperAdmin);
      setAlertes(alertesResponse.data || []);

    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Calculer la tendance pour chaque KPI
  const getTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return null;
  };

  const kpiCards = [
    {
      title: "Nombre d'employés",
      value: kpis.NOMBRE_EMPLOYES?.valeur || 0,
      previousValue: kpis.NOMBRE_EMPLOYES?.valeurPrecedente || 0,
      unit: kpis.NOMBRE_EMPLOYES?.unite || '',
      trend: getTrend(kpis.NOMBRE_EMPLOYES?.valeur, kpis.NOMBRE_EMPLOYES?.valeurPrecedente),
      icon: "👥",
      color: "blue"
    },
    {
      title: "Masse salariale",
      value: kpis.MASSE_SALARIALE?.valeur || 0,
      previousValue: kpis.MASSE_SALARIALE?.valeurPrecedente || 0,
      unit: kpis.MASSE_SALARIALE?.unite || 'FCFA',
      trend: getTrend(kpis.MASSE_SALARIALE?.valeur, kpis.MASSE_SALARIALE?.valeurPrecedente),
      icon: "💰",
      color: "green"
    },
    {
      title: "Taux de paiement",
      value: kpis.TAUX_PAIEMENT?.valeur || 0,
      previousValue: kpis.TAUX_PAIEMENT?.valeurPrecedente || 0,
      unit: kpis.TAUX_PAIEMENT?.unite || '%',
      trend: getTrend(kpis.TAUX_PAIEMENT?.valeur, kpis.TAUX_PAIEMENT?.valeurPrecedente),
      icon: "💳",
      color: "purple"
    },
    {
      title: "Total allocations",
      value: kpis.TOTAL_ALLOCATIONS?.valeur || 0,
      previousValue: kpis.TOTAL_ALLOCATIONS?.valeurPrecedente || 0,
      unit: kpis.TOTAL_ALLOCATIONS?.unite || 'FCFA',
      trend: getTrend(kpis.TOTAL_ALLOCATIONS?.valeur, kpis.TOTAL_ALLOCATIONS?.valeurPrecedente),
      icon: "📊",
      color: "orange"
    },
    {
      title: "Turnover",
      value: kpis.TURNOVER?.valeur || 0,
      previousValue: kpis.TURNOVER?.valeurPrecedente || 0,
      unit: kpis.TURNOVER?.unite || '%',
      trend: getTrend(kpis.TURNOVER?.valeur, kpis.TURNOVER?.valeurPrecedente),
      icon: "⚡",
      color: "indigo"
    },
    {
      title: "Taux d'absentéisme",
      value: kpis.TAUX_ABSENTEISME?.valeur || 0,
      previousValue: kpis.TAUX_ABSENTEISME?.valeurPrecedente || 0,
      unit: kpis.TAUX_ABSENTEISME?.unite || '%',
      trend: getTrend(kpis.TAUX_ABSENTEISME?.valeur, kpis.TAUX_ABSENTEISME?.valeurPrecedente),
      icon: "📅",
      color: "red"
    }
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de Bord {isSuperAdmin ? 'Super Admin' : 'Entreprise'}
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Vue d'ensemble avancée avec KPIs prédictifs et alertes intelligentes
            </p>
          </div>
          <Button onClick={loadDashboardData} disabled={loading} className="flex items-center gap-2">
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6">
          <DashboardFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {kpiCards.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              previousValue={kpi.previousValue}
              unit={kpi.unit}
              trend={kpi.trend}
              icon={kpi.icon}
              color={kpi.color}
            />
          ))}
        </div>

        {/* Graphiques d'évolution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EvolutionChart
            kpiType="MASSE_SALARIALE"
            title="Évolution de la masse salariale sur 6 mois"
            color="#10B981"
          />
          <EvolutionChart
            kpiType="TAUX_PAIEMENT"
            title="Évolution du taux de paiement"
            color="#8B5CF6"
          />
        </div>

        {/* Alertes avancées */}
        <div className="mb-6">
          <AdvancedAlertsPanel
            tableauDeBordId={1}
            entrepriseId={entrepriseId}
            isSuperAdmin={isSuperAdmin}
          />
        </div>

        {loading && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Chargement des données...</p>
          </div>
        )}
      </div>
    </main>
  );
}
