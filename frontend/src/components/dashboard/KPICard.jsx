import React from 'react';
import { Card, CardBody } from '../ui';

const KPICard = ({
  title,
  value,
  previousValue,
  unit = '',
  trend,
  icon,
  color = 'blue',
  loading = false
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (unit === 'FCFA' || unit === '€' || unit === '$') {
        return new Intl.NumberFormat('fr-FR').format(val);
      }
      return val.toLocaleString('fr-FR');
    }
    return val || '--';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getColorClasses = () => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      red: 'bg-red-50 border-red-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      purple: 'bg-purple-50 border-purple-200',
      gray: 'bg-gray-50 border-gray-200',
      orange: 'bg-orange-50 border-orange-200',
      indigo: 'bg-indigo-50 border-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <Card className={`${getColorClasses()} animate-pulse`}>
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={`${getColorClasses()} hover:shadow-md transition-shadow duration-200`}>
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatValue(value)} {unit}
            </p>
            {previousValue !== undefined && (
              <div className={`flex items-center text-sm ${getTrendColor()}`}>
                <span className="mr-1">{getTrendIcon()}</span>
                <span>
                  {formatValue(previousValue)} {unit} précédemment
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-full ${
              color === 'blue' ? 'bg-blue-100 text-blue-600' :
              color === 'green' ? 'bg-green-100 text-green-600' :
              color === 'red' ? 'bg-red-100 text-red-600' :
              color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
              color === 'purple' ? 'bg-purple-100 text-purple-600' :
              color === 'orange' ? 'bg-orange-100 text-orange-600' :
              color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
              'bg-gray-100 text-gray-600'
            } text-2xl`}>
              {icon}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default KPICard;
