import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Button, ConfirmDialog } from "../components/ui";
import { entreprisesApi, employesApi } from "../utils/api";
import { formatCFA } from "../utils/format";
import { PencilSquareIcon, TrashIcon, ArrowLeftIcon, UsersIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function EntrepriseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entreprise, setEntreprise] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  async function loadEntreprise() {
    try {
      const data = await entreprisesApi.get(id);
      setEntreprise(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function loadEmployees() {
    try {
      const allEmployees = await employesApi.list();
      const companyEmployees = allEmployees.filter(emp => emp.entrepriseId === parseInt(id));
      setEmployees(companyEmployees);
    } catch (err) {
      console.error("Error loading employees:", err);
      setEmployees([]);
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([loadEntreprise(), loadEmployees()]);
      setLoading(false);
    }
    loadData();
  }, [id]);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await entreprisesApi.remove(toDelete.id);
      navigate("/entreprises");
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

  if (error || !entreprise) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-600">
            {error || "Entreprise non trouvée"}
          </div>
        </div>
      </main>
    );
  }

  const activeEmployees = employees.filter(emp => emp.estActif && emp.statutEmploi === 'ACTIF');
  const totalSalary = activeEmployees.reduce((sum, emp) => {
    const base = Number(emp.salaireBase) || 0;
    const alloc = Number(emp.allocations) || 0;
    const deduc = Number(emp.deductions) || 0;
    return sum + (base + alloc - deduc);
  }, 0);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/entreprises">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {entreprise.nom}
              </h1>
              <p className="text-gray-600">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  entreprise.estActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {entreprise.estActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/entreprises/${id}/edit`}>
              <Button className="flex items-center gap-2">
                <PencilSquareIcon className="h-4 w-4" />
                Modifier
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setToDelete(entreprise)}
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader title="Informations générales" />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                    <p className="mt-1 text-sm text-gray-900">{entreprise.adresse || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
                    <p className="mt-1 text-sm text-gray-900">{entreprise.secteurActivite || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{entreprise.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="mt-1 text-sm text-gray-900">{entreprise.telephone || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Site Web</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {entreprise.siteWeb ? (
                        <a href={entreprise.siteWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                          {entreprise.siteWeb}
                        </a>
                      ) : '-'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="Statistiques" />
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Employés actifs</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {activeEmployees.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total employés</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {employees.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Masse salariale</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCFA(totalSalary)}
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
                  <Link to={`/employees/new?entrepriseId=${id}`}>
                    <Button className="w-full flex items-center justify-center gap-2">
                      <UsersIcon className="h-4 w-4" />
                      Ajouter employé
                    </Button>
                  </Link>
                  <Link to={`/parametres-entreprise?entrepriseId=${id}`}>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      Paramètres entreprise
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Employees List */}
        <div className="mt-8">
          <Card>
            <CardHeader title={`Employés (${employees.length})`} />
            <CardBody>
              {employees.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucun employé dans cette entreprise</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom complet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Poste
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salaire
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.matricule}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <Link to={`/employees/${employee.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {employee.prenom} {employee.nom}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.profession?.nom || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              employee.statutEmploi === 'ACTIF' ? 'bg-green-100 text-green-800' :
                              employee.statutEmploi === 'CONGE' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {employee.statutEmploi}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCFA(employee.salaireBase)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link to={`/employees/${employee.id}`}>
                              <Button variant="outline" className="text-xs px-2 py-1">
                                Voir
                              </Button>
                            </Link>
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
          title="Supprimer l'entreprise"
          message={`Confirmer la suppression de ${toDelete?.nom || ""} ? Cette action est irréversible et supprimera également tous les employés associés.`}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </main>
  );
}
