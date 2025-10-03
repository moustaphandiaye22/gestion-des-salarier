import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Button, ConfirmDialog } from "../components/ui";
import { employesApi, paiementsApi, qrcodesApi } from "../utils/api";
import { formatCFA } from "../utils/format";
import { PencilSquareIcon, TrashIcon, ArrowLeftIcon, CurrencyDollarIcon, QrCodeIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";

import { useToast } from "../context/ToastContext";

export default function EmployeeDetail() {
  const { showSuccess, showError } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [latestBulletin, setLatestBulletin] = useState(null);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  async function downloadQrCode() {
    if (!qrCode || !qrCode.hasQrCode) return;

    try {
      const qrImageBlob = await qrcodesApi.getQrCodeImage(id);
      const qrImageUrl = URL.createObjectURL(qrImageBlob);

      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = `qr-code-${employee.prenom}-${employee.nom}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(qrImageUrl);
      showSuccess('Succès', 'QR code téléchargé avec succès');
    } catch (err) {
      console.error('Erreur lors du téléchargement du QR code:', err);
      showError('Erreur', 'Impossible de télécharger le QR code');
    }
  }

  async function generateQrCode() {
    try {
      await qrcodesApi.generateQrCode(id);
      showSuccess('Succès', 'QR code généré avec succès');
      await loadQrCode(); // Recharger le QR code
    } catch (err) {
      console.error('Erreur lors de la génération du QR code:', err);
      showError('Erreur', err?.response?.data?.error || 'Impossible de générer le QR code');
    }
  }

  async function loadEmployee() {
    try {
      const data = await employesApi.get(id);
      setEmployee(data);
      // Load latest bulletin for employee (optional)
      try {
        const bulletin = await employesApi.getLatestBulletin(id);
        setLatestBulletin(bulletin);
      } catch (bulletinErr) {
        // If no bulletin exists or other errors, just set to null - not an error for employee loading
        setLatestBulletin(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function loadPayments() {
    try {
      // Get all payments and filter by employeId or bulletin employeId
      const allPayments = await paiementsApi.list();
      const employeePayments = allPayments.filter(payment =>
        payment.employeId === parseInt(id) || payment.bulletin?.employeId === parseInt(id)
      );
      setPayments(employeePayments);
    } catch (err) {
      console.error("Error loading payments:", err);
      // Don't set error for payments, just show empty list
      setPayments([]);
    }
  }

  async function loadStats() {
    try {
      // Simulation des statistiques - à remplacer par l'appel réel
      // const statsData = await employesApi.getStats(id);
      // setStats(statsData.statistiques);

      // Données de simulation
      setStats({
        totalPresences: 45,
        totalAbsences: 2,
        totalRetards: 3,
        heuresTravaillees: 180.5,
        dernierPointage: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error loading stats:", err);
      setStats(null);
    }
  }

  async function loadQrCode() {
    try {
      // Récupérer les informations du QR code
      const qrInfo = await qrcodesApi.getQrCodeInfo(id);

      if (qrInfo.employe.hasQrCode) {
        // Récupérer l'image du QR code depuis le serveur
        const qrImageBlob = await qrcodesApi.getQrCodeImage(id);
        const qrImageUrl = URL.createObjectURL(qrImageBlob);

        setQrCode({
          qrCode: qrImageUrl,
          qrContent: qrInfo.employe.qrCode || 'Non disponible',
          hasQrCode: true
        });
      } else {
        setQrCode({ hasQrCode: false });
      }
    } catch (err) {
      console.error("Error loading QR code:", err);
      setQrCode({ hasQrCode: false });
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([loadEmployee(), loadPayments(), loadStats(), loadQrCode()]);
      setLoading(false);
    }
    loadData();
  }, [id]);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await employesApi.remove(toDelete.id);
      showSuccess("Succès", "Employé supprimé avec succès");
      navigate("/employees");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de suppression", errorMessage);
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

  if (error || !employee) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-600">
            {error || "Employé non trouvé"}
          </div>
        </div>
      </main>
    );
  }

  const totalPaid = payments
    .filter(p => p.statut === 'PAYE')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  const pendingPayments = payments
    .filter(p => p.statut === 'EN_ATTENTE')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/employees">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {employee.prenom} {employee.nom}
              </h1>
              <p className="text-gray-600">Matricule: {employee.matricule}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/employees/${id}/edit`}>
              <Button className="flex items-center gap-2">
                <PencilSquareIcon className="h-4 w-4" />
                Modifier
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setToDelete(employee)}
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Information */}
          <div className="lg:col-span-2 space-y-6">

            {/* QR Code Section */}
            <Card>
              <CardHeader title="QR Code de pointage" />
              <CardBody>
                {qrCode && qrCode.hasQrCode ? (
                  <div className="text-center space-y-4">
                    <div className="inline-block p-4 bg-white border rounded-lg">
                      <img
                        src={qrCode.qrCode}
                        alt="QR Code employé"
                        className="w-32 h-32"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">QR Code personnel</p>
                      <p className="text-xs text-gray-500 break-all font-mono">
                        {qrCode.qrContent}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={downloadQrCode}
                      className="flex items-center gap-2"
                    >
                      <QrCodeIcon className="h-4 w-4" />
                      Télécharger QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <QrCodeIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Aucun QR code généré</p>
                    <Button
                      onClick={generateQrCode}
                      className="flex items-center gap-2"
                    >
                      <QrCodeIcon className="h-4 w-4" />
                      Générer QR Code
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
            {/* Basic Information */}
            <Card>
              <CardHeader title="Informations personnelles" />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.telephone || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.adresse || '-'}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Employment Information */}
            <Card>
              <CardHeader title="Informations professionnelles" />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.entreprise?.nom || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profession</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.profession?.nom || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'embauche</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {employee.dateEmbauche ? new Date(employee.dateEmbauche).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut d'emploi</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.statutEmploi === 'ACTIF' ? 'bg-green-100 text-green-800' :
                      employee.statutEmploi === 'CONGE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.statutEmploi}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de contrat</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.typeContrat}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de salaire</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.typeSalaire}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Salary Information */}
            <Card>
              <CardHeader title="Informations salariales" />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salaire de base</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCFA(employee.salaireBase)}
                    </p>
                  </div>
                  {employee.typeSalaire === 'HONORAIRES' && employee.salaireHoraire && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Salaire horaire</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatCFA(employee.salaireHoraire)}
                      </p>
                    </div>
                  )}
                  {employee.typeSalaire === 'JOURNALIER' && employee.tauxJournalier && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Taux journalier</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatCFA(employee.tauxJournalier)}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allocations</label>
                    <p className="mt-1 text-sm text-green-600">
                      +{formatCFA(employee.allocations || 0)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Déductions</label>
                    <p className="mt-1 text-sm text-red-600">
                      -{formatCFA(employee.deductions || 0)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Salaire net estimé</label>
                    <p className="mt-1 text-xl font-bold text-blue-600">
                      {latestBulletin ? formatCFA(Number(latestBulletin.totalAPayer)) : formatCFA(employee.salaireBase + (employee.allocations || 0) - (employee.deductions || 0))}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Statistics de présence */}
          {stats && (
            <Card>
              <CardHeader title="Statistiques de présence" />
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Présences</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      {stats.totalPresences}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Absences</span>
                    </div>
                    <span className="text-lg font-semibold text-red-600">
                      {stats.totalAbsences}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Retards</span>
                    </div>
                    <span className="text-lg font-semibold text-yellow-600">
                      {stats.totalRetards}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Heures travaillées</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      {stats.heuresTravaillees}h
                    </span>
                  </div>
                  {stats.dernierPointage && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Dernier pointage</span>
                      <span className="text-sm text-gray-600">
                        {new Date(stats.dernierPointage).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="Résumé des paiements" />
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total payé</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCFA(totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">En attente</span>
                    <span className="text-lg font-semibold text-yellow-600">
                      {formatCFA(pendingPayments)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Nombre de paiements</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {payments.length}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader title="Actions rapides" />
              <CardBody>
                <div className="space-y-2">
                  <Link to={`/paiements/new?employeeId=${id}`}>
                    <Button className="w-full flex items-center justify-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      Nouveau paiement
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Payment History */}
        <div className="mt-8">
          <Card>
            <CardHeader title="Historique des paiements" />
            <CardBody>
              {payments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucun paiement trouvé</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bulletin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mode
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.bulletin?.numeroBulletin || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCFA(payment.montant)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.datePaiement ? new Date(payment.datePaiement).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.modePaiement || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              payment.statut === 'PAYE' ? 'bg-green-100 text-green-800' :
                              payment.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.statut || 'INCONNU'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <ConfirmDialog
          open={!!toDelete}
          title="Supprimer l'employé"
          message={`Confirmer la suppression de ${toDelete?.nom || ""} ${toDelete?.prenom || ""} ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </main>
  );
}
