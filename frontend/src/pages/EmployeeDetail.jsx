import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Button, ConfirmDialog } from "../components/ui";
import { employesApi, paiementsApi } from "../utils/api";
import { formatCFA } from "../utils/format";
import { PencilSquareIcon, TrashIcon, ArrowLeftIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [latestBulletin, setLatestBulletin] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  async function loadEmployee() {
    try {
      const data = await employesApi.get(id);
      setEmployee(data);
      // Load latest bulletin for employee (optional)
      try {
        const bulletin = await employesApi.getLatestBulletin(id);
        setLatestBulletin(bulletin);
      } catch (bulletinErr) {
        // If no bulletin exists (404), just set to null - not an error
        if (bulletinErr?.response?.status === 404) {
          setLatestBulletin(null);
        } else {
          // Re-throw other errors
          throw bulletinErr;
        }
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

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([loadEmployee(), loadPayments()]);
      setLoading(false);
    }
    loadData();
  }, [id]);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await employesApi.remove(toDelete.id);
      navigate("/employees");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
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
