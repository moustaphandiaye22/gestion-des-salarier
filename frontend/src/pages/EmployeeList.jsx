import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { employesApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { PencilSquareIcon, TrashIcon, PlusIcon, EyeIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";

export default function EmployeeList() {
  const { selectedCompanyId } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

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
  }, [selectedCompanyId]);

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

  async function handleImport(e) {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const result = await employesApi.bulkImport(file);
      setImportResult(result);
      setImportModalOpen(false);
      load(); // Reload list
    } catch (err) {
      setImportResult({ error: err?.response?.data?.error || err.message });
      setImportModalOpen(false);
    } finally {
      setImporting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Employés"
            actions={
              <div className="flex gap-2">
                <Link to="/employees/new">
                  <Button className="flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Ajouter
                  </Button>
                </Link>
                <Button
                  className="flex items-center gap-2"
                  variant="outline"
                  onClick={() => setImportModalOpen(true)}
                >
                  <DocumentArrowUpIcon className="h-5 w-5" />
                  Importer Excel
                </Button>
              </div>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                {error}
              </div>
            )}
            {importResult && (
              <div className="mb-4 rounded-md bg-blue-50 p-3 ring-1 ring-blue-200 text-sm text-blue-800">
                <div className="flex justify-between items-center">
                  <div>
                    {importResult.error ? (
                      <div className="text-red-600">Erreur: {importResult.error}</div>
                    ) : (
                      <div>
                        Import terminé. {importResult.success?.length || 0} employés créés, {importResult.errors?.length || 0} erreurs.
                        {importResult.errors && importResult.errors.length > 0 && (
                          <ul className="list-disc list-inside mt-2 max-h-40 overflow-y-auto text-xs text-red-700">
                            {importResult.errors.map((err, idx) => (
                              <li key={idx}>
                                Ligne {err.index + 1}: {err.errors.map(e => e.message).join(", ")}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setImportResult(null)}
                  >
                    Fermer
                  </button>
                </div>
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
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                      <Link to={`/employees/${row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                        {row.prenom} {row.nom}
                      </Link>
                    </td>
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
                        <Link to={`/employees/${row.id}`}>
                          <Button variant="outline" className="text-xs px-2 py-1">
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                        </Link>
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

        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 ring-1 ring-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Importer des employés depuis Excel</h3>
              <form onSubmit={handleImport}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un fichier Excel (.xlsx ou .xls)
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept=".xlsx,.xls"
                    required
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setImportModalOpen(false)}
                    disabled={importing}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={importing}>
                    {importing ? "Importation..." : "Importer"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
