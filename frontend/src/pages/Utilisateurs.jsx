import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { utilisateursApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Utilisateurs() {
  const { selectedCompanyId } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await utilisateursApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [selectedCompanyId]);

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await utilisateursApi.remove(toDelete.id);
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
            title="Utilisateurs"
            actions={
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </Button>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>
            )}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={["Nom", "Email", "Rôle", "Actif", "Entreprise", "Actions"]}
                rows={rows}
                 renderRow={(row) => (
                   <tr key={row.id}>
                     <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.nom || '-'}</td>
                     <td className="px-2 py-2 text-sm text-gray-900">{row.email}</td>
                     <td className="px-2 py-2 text-sm text-gray-700">{row.role}</td>
                     <td className="px-2 py-2 text-sm text-gray-700 text-center">
                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                         row.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {row.estActif ? 'Oui' : 'Non'}
                       </span>
                     </td>
                     <td className="px-2 py-2 text-sm text-gray-700">{row.entreprise?.nom || '-'}</td>
                     <td className="px-2 py-2 text-sm">
                       <div className="flex gap-2">
                         <Button variant="danger" onClick={() => setToDelete(row)} className="flex items-center gap-1">
                           <TrashIcon className="h-4 w-4" />
                           Supprimer
                         </Button>
                       </div>
                     </td>
                   </tr>
                 )}
              />
            </div>
            {loading && <p className="mt-3 text-sm text-gray-600">Chargement...</p>}

            <ConfirmDialog
              open={!!toDelete}
              title="Supprimer l'utilisateur"
              message={`Confirmer la suppression de ${toDelete?.email || ''} ?`}
              onCancel={() => setToDelete(null)}
              onConfirm={handleDelete}
            />
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
