import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { entreprisesApi } from "../utils/api";
import { PencilSquareIcon, TrashIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function Entreprises() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await entreprisesApi.list();
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
      await entreprisesApi.remove(toDelete.id);
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
            title="Entreprises"
            actions={
              <Link to="/entreprises/new">
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
                  "Nom",
                  "Adresse",
                  "Email",
                  "Téléphone",
                  "Site Web",
                  "Secteur",
                  "Statut",
                  "Actions",
                ]}
                rows={rows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                      <Link to={`/entreprises/${row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                        {row.nom}
                      </Link>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row.adresse || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">{row.email || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">{row.telephone || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden xl:table-cell">
                      {row.siteWeb ? (
                        <a href={row.siteWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                          {row.siteWeb}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">{row.secteurActivite || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.estActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.estActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm">
                      <div className="flex gap-1">
                        <Link to={`/entreprises/${row.id}`}>
                          <Button variant="outline" className="text-xs px-2 py-1">
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Link to={`/entreprises/${row.id}/edit`}>
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
            {loading && <p className="mt-3 text-sm text-gray-600">Chargement...</p>}
          </CardBody>
        </Card>

        <ConfirmDialog
          open={!!toDelete}
          title="Supprimer l'entreprise"
          message={`Confirmer la suppression de ${toDelete?.nom || ""} ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </main>
  );
}
