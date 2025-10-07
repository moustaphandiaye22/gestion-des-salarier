import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input, Select } from "../components/ui";
import Pagination from "../components/Pagination";
import { paiementsApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TrashIcon, PlusIcon, PencilSquareIcon, CheckCircleIcon, MagnifyingGlassIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function Paiements() {
  const { showSuccess, showError } = useToast();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [toValidate, setToValidate] = useState(null);
  const { user } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterEntreprise, setFilterEntreprise] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  async function load() {
    setLoading(true);
    setError(null);
      try {
        let data = await paiementsApi.list();

        // Filter payments based on user role
        if (user?.role === 'SUPER_ADMIN') {
          // Super admin sees all payments
        } else if (user?.role === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
          // Admin entreprise sees only payments from their entreprise
          data = data.filter(p => p.entrepriseId === user.entrepriseId);
        } else if (user?.role === 'CAISSIER' && user.entrepriseId) {
          // Cashier sees only payments from their entreprise
          data = data.filter(p => p.entrepriseId === user.entrepriseId);
        }

        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage = err?.response?.data?.message || err.message;
        setError(errorMessage);
        showError("Erreur de chargement", errorMessage);
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
      await paiementsApi.remove(toDelete.id);
      setToDelete(null);
      load();
      showSuccess("Succès", "Paiement supprimé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de suppression", errorMessage);
    }
  }

  async function handleValidate() {
    if (!toValidate) return;
    try {
      await paiementsApi.update(toValidate.id, { statut: 'PAYE' });
      setToValidate(null);
      load();
      showSuccess("Succès", "Paiement validé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de validation", errorMessage);
    }
  }

  async function exportPaiements() {
    try {
      const response = await paiementsApi.exportExcel();
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'paiements.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess("Succès", "Paiements exportés avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      showError("Erreur d'export", errorMessage);
    }
  }

  // Filtered rows based on search and filters
  const filteredRows = useMemo(() => {
    return rows.filter((paiement) => {
      const matchesSearch = !searchTerm ||
        paiement.entreprise?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paiement.bulletin?.numeroBulletin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paiement.reference?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatut = !filterStatut || paiement.statut === filterStatut;
      const matchesEntreprise = !filterEntreprise ||
        paiement.entreprise?.id === parseInt(filterEntreprise);

      return matchesSearch && matchesStatut && matchesEntreprise;
    });
  }, [rows, searchTerm, filterStatut, filterEntreprise]);

  // Paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatut, filterEntreprise]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  // Get unique entreprises for filter dropdown
  const entreprises = useMemo(() => {
    const uniqueEntreprises = rows
      .map(p => p.entreprise)
      .filter(Boolean)
      .filter((entreprise, index, self) =>
        self.findIndex(e => e.id === entreprise.id) === index
      );
    return uniqueEntreprises.sort((a, b) => a.nom.localeCompare(b.nom));
  }, [rows]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Paiements"
            subtitle="Gestion des paiements et validations"
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher par entreprise, bulletin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="w-32"
                >
                  <option value="">Tous statuts</option>
                  <option value="PAYE">Payé</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="ANNULE">Annulé</option>
                </Select>
                <Select
                  value={filterEntreprise}
                  onChange={(e) => setFilterEntreprise(e.target.value)}
                  className="w-40"
                >
                  <option value="">Toutes entreprises</option>
                  {entreprises.map((entreprise) => (
                    <option key={entreprise.id} value={entreprise.id}>{entreprise.nom}</option>
                  ))}
                </Select>
                <Link to="/paiements/new">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 ml-2"
                    onClick={exportPaiements}
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    Exporter Excel
                  </Button>
                  <Button className="flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Ajouter
                  </Button>
                </Link>
              </div>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>
            )}

            <div className="text-sm text-gray-600 mb-4">
              {filteredRows.length} paiement{filteredRows.length !== 1 ? 's' : ''} trouvé{filteredRows.length !== 1 ? 's' : ''}
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={[
                  "Entreprise",
                  "Bulletin",
                  "Montant",
                  "Date",
                  "Paiement",
                  "Statut",
                  "Actions",
                ]}
                rows={paginatedRows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.entreprise?.nom || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row.bulletin?.numeroBulletin || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-right font-medium">
                      {row.montant?.toLocaleString()} CFA
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">
                      {row.datePaiement ? new Date(row.datePaiement).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                      <div className="text-xs space-y-1">
                        <div>{row.modePaiement || '-'}</div>
                        <div className="text-gray-500">{row.reference || '-'}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.statut === 'PAYE' ? 'bg-green-100 text-green-800' :
                        row.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.statut || 'INCONNU'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm">
                      <div className="flex gap-1">
                        {row.statut === 'EN_ATTENTE' && user?.role === 'CAISSIER' && (
                          <Button variant="primary" onClick={() => setToValidate(row)} className="text-xs px-2 py-1">
                            <CheckCircleIcon className="h-3 w-3" />
                          </Button>
                        )}
                        <Link to={`/paiements/${row.id}/edit`}>
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
            {filteredRows.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredRows.length}
                itemsPerPage={itemsPerPage}
              />
            )}
            {loading && <p className="mt-3 text-sm text-gray-600">Chargement...</p>}

            <ConfirmDialog
              open={!!toDelete}
              title="Supprimer le paiement"
              message={`Confirmer la suppression du paiement ${toDelete?.reference || toDelete?.id || ''} ?`}
              onCancel={() => setToDelete(null)}
              onConfirm={handleDelete}
            />

            <ConfirmDialog
              open={!!toValidate}
              title="Valider le paiement"
              message={`Confirmer la validation du paiement ${toValidate?.reference || toValidate?.id || ''} ?`}
              onCancel={() => setToValidate(null)}
              onConfirm={handleValidate}
            />
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
