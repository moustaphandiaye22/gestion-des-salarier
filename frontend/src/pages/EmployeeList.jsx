import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { employesApi } from "../utils/api";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function EmployeeList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await employesApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await employesApi.remove(toDelete.id);
      setToDelete(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Employés"
            actions={
              <Link to="/employees/new">
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Ajouter
                </Button>
              </Link>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
              <Table
                head={[
                  "Matricule",
                  "Nom complet",
                  "Contact",
                  "Adresse",
                  "Embauche",
                  "Statut",
                  "Contrat",
                  "Salaire",
                  "Finances",
                  "Actif",
                  "Entreprise",
                  "Actions",
                ]}
                rows={rows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-700 font-medium">{row.matricule}</td>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.prenom} {row.nom}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">
                      <div className="space-y-1">
                        <div>{row.email || '-'}</div>
                        <div className="text-xs text-gray-500">{row.telephone || '-'}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">{row.adresse || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                      {row.dateEmbauche ? new Date(row.dateEmbauche).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.statutEmploi === 'ACTIF' ? 'bg-green-100 text-green-800' :
                        row.statutEmploi === 'CONGE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.statutEmploi}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row.typeContrat}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-right font-medium">
                      {row.salaireBase?.toLocaleString()} CFA
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                      <div className="text-xs space-y-1">
                        <div className="text-green-600">+{row.allocations?.toLocaleString() || 0} CFA</div>
                        <div className="text-red-600">-{row.deductions?.toLocaleString() || 0} CFA</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.estActif ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden xl:table-cell">{row.entreprise?.nom || '-'}</td>
                    <td className="px-2 py-2 text-sm">
                      <div className="flex gap-1">
                        <Link to={`/employees/${row.id}/edit`}>
                          <Button variant="outline" className="text-xs px-2 py-1">
                            <PencilSquareIcon className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button variant="danger" onClick={() => setToDelete(row)} className="text-xs px-2 py-1">
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            </div>
          </CardBody>
        </Card>

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
