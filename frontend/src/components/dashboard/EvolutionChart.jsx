import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import dashboardApi from '../../utils/dashboardApi';
import { useAuth } from '../../context/AuthContext';

const EvolutionChart = ({ kpiType, title, color = '#3B82F6', height = 300 }) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const entrepriseId = user?.entrepriseId;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    loadEvolutionData();
  }, [kpiType, entrepriseId, isSuperAdmin]);

  const loadEvolutionData = async () => {
    if (!entrepriseId && !isSuperAdmin) return;

    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getEvolutionData(
        isSuperAdmin ? 0 : entrepriseId,
        kpiType,
        6 // 6 derniers mois
      );

      if (response.success) {
        setData(response.data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données d\'évolution:', err);
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (kpiType.includes('MASSE') || kpiType.includes('COUT')) {
        return new Intl.NumberFormat('fr-FR').format(value);
      }
      if (kpiType.includes('TAUX') || kpiType.includes('POURCENTAGE')) {
        return `${value.toFixed(1)}%`;
      }
      return value.toLocaleString('fr-FR');
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Mois: ${label}`}</p>
          <p className="text-blue-600">
            {`Valeur: ${formatValue(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardBody className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardBody className="p-6">
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <button
              onClick={loadEvolutionData}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Réessayer
            </button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardBody className="p-6">
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="mois"
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="valeur"
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                name={title}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {data.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>Aucune donnée disponible pour cette période</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default EvolutionChart;
