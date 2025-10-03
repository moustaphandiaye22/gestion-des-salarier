import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  QrCodeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
  }, [user]);

  async function loadEmployeeData() {
    setLoading(true);
    try {
      // Simulation des données employé - à remplacer par les vrais appels API
      // const statsData = await employesApi.getStats(user.employeId);
      // const paymentsData = await paiementsApi.getByEmploye(user.employeId);

      // Données de simulation
      setStats({
        totalPresences: 45,
        totalAbsences: 2,
        totalRetards: 3,
        heuresTravaillees: 180.5,
        dernierPointage: new Date().toISOString(),
        salaireMensuel: 500000,
        prochainPaiement: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      });

      setRecentPayments([
        {
          id: 1,
          montant: 500000,
          datePaiement: new Date().toISOString(),
          statut: 'PAYE',
          bulletin: { numeroBulletin: 'BUL-2024-001' }
        },
        {
          id: 2,
          montant: 480000,
          datePaiement: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          statut: 'PAYE',
          bulletin: { numeroBulletin: 'BUL-2023-012' }
        }
      ]);
    } catch (err) {
      showError('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, {user?.nom || 'Employé'}
              </h1>
              <p className="text-gray-600">
                Votre tableau de bord personnel - Présences et paiements
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Présences ce mois</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.totalPresences || 0}
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absences</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats?.totalAbsences || 0}
                  </p>
                </div>
                <XCircleIcon className="h-8 w-8 text-red-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Retards</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.totalRetards || 0}
                  </p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Heures travaillées</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.heuresTravaillees || 0}h
                  </p>
                </div>
                <ClockIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations salariales */}
          <Card>
            <CardHeader title="Informations salariales" />
            <CardBody className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-700">Salaire mensuel</span>
                <span className="font-semibold text-lg">
                  {stats?.salaireMensuel?.toLocaleString()} CFA
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-700">Dernier paiement</span>
                <span className="font-semibold text-green-600">
                  {recentPayments[0]?.montant?.toLocaleString()} CFA
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">Prochain paiement</span>
                <span className="font-semibold text-blue-600">
                  {stats?.prochainPaiement ? new Date(stats.prochainPaiement).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Activité récente */}
          <Card>
            <CardHeader title="Activité récente" />
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Présence enregistrée</p>
                    <p className="text-xs text-green-600">
                      {stats?.dernierPointage ? new Date(stats.dernierPointage).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Paiement reçu</p>
                    <p className="text-xs text-blue-600">
                      {recentPayments[0]?.montant?.toLocaleString()} CFA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Statistiques mises à jour</p>
                    <p className="text-xs text-gray-600">Aujourd'hui</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Historique des paiements */}
        <div className="mt-8">
          <Card>
            <CardHeader title="Historique des paiements récents" />
            <CardBody>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${payment.statut === 'PAYE' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.bulletin?.numeroBulletin}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.datePaiement ? new Date(payment.datePaiement).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {payment.montant?.toLocaleString()} CFA
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.statut === 'PAYE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Informations importantes */}
        <div className="mt-8">
          <Card>
            <CardHeader title="Informations importantes" />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <QrCodeIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Pointage QR Code</h4>
                      <p className="text-sm text-gray-600">
                        Utilisez votre QR code personnel pour pointer votre présence rapidement et sécuritairement.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Horaires de travail</h4>
                      <p className="text-sm text-gray-600">
                        Lundi - Vendredi: 8h00 - 17h00<br />
                        Samedi: 8h00 - 12h00<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Politique de présence</h4>
                      <p className="text-sm text-gray-600">
                        Tolérance de 15 minutes pour les retards.<br />
                        Justificatif obligatoire pour les absences.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ChartBarIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Suivi des performances</h4>
                      <p className="text-sm text-gray-600">
                        Vos statistiques sont mises à jour automatiquement.<br />
                        Consultez régulièrement votre tableau de bord.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}