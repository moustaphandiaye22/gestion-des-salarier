import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { professionsApi } from "../utils/api";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Professions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await professionsApi.list();
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
      await professionsApi.remove(toDelete.id);
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
            title="Professions"
            actions={
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </Button>
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
                  "Description",
                  "Catégorie",
                  "Actif",
                  "Actions",
                ]}
                rows={rows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.nom}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row.description || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">{row.categorie || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.estActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {row.estActive ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm">
                      <div className="flex gap-1">
                        <Button variant="outline" className="text-xs px-2 py-1">
                          <PencilSquareIcon className="h-3 w-3" />
                        </Button>
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
          title="Supprimer la profession"
          message={`Confirmer la suppression de ${toDelete?.nom || ""} ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </main>
  );
}