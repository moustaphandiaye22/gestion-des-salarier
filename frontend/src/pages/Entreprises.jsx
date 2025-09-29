import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { entreprisesApi } from "../utils/api";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Entreprises() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await entreprisesApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
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
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </Button>
            }
          />
          <CardBody>
            {error && <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={[
                  "Nom",
                  "Email",
                  "Téléphone",
                  "Adresse",
                  "Secteur",
                  "Employés",
                  "Actif",
                  "Création",
                  "Stats",
                  "Actions",
                ]}
                rows={rows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.nom}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row.email || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">{row.telephone || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">{row.adresse || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden xl:table-cell">{row.secteurActivite || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">{row.nombreEmployes || 0}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.estActif ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">
                      {row.dateCreation ? new Date(row.dateCreation).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                      <div className="text-xs space-y-1">
                        <div>E: {Array.isArray(row.employes) ? row.employes.length : 0}</div>
                        <div>C: {Array.isArray(row.cyclesPaie) ? row.cyclesPaie.length : 0}</div>
                        <div>P: {Array.isArray(row.paiements) ? row.paiements.length : 0}</div>
                        <div>U: {Array.isArray(row.utilisateurs) ? row.utilisateurs.length : 0}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm">
                      <Button variant="danger" onClick={() => setToDelete(row)} className="text-xs px-2 py-1">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
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
          message={`Confirmer la suppression de ${toDelete?.nom || ''} ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </main>
  );
}
