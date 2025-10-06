import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input, Select } from "../components/ui";
import Pagination from "../components/Pagination";
import { entreprisesApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PencilSquareIcon, TrashIcon, PlusIcon, EyeIcon, MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";

export default function Entreprises() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  // View states
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSecteur, setFilterSecteur] = useState("");
  const [filterStatut, setFilterStatut] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await entreprisesApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Erreur";
      setError(errorMessage);
      showError("Erreur de chargement", errorMessage);
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
      showSuccess("Succès", "Entreprise supprimée avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de suppression", errorMessage);
    }
  }

  // Filtered rows based on search and filters
  const filteredRows = useMemo(() => {
    return rows.filter((entreprise) => {
      const matchesSearch = !searchTerm ||
        entreprise.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entreprise.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entreprise.secteurActivite?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSecteur = !filterSecteur || entreprise.secteurActivite === filterSecteur;
      const matchesStatut = !filterStatut ||
        (filterStatut === "active" && entreprise.estActive) ||
        (filterStatut === "inactive" && !entreprise.estActive);

      return matchesSearch && matchesSecteur && matchesStatut;
    });
  }, [rows, searchTerm, filterSecteur, filterStatut]);

  // Paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSecteur, filterStatut]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  // Get unique secteurs for filter dropdown
  const secteurs = useMemo(() => {
    const uniqueSecteurs = [...new Set(rows.map(e => e.secteurActivite).filter(Boolean))];
    return uniqueSecteurs.sort();
  }, [rows]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Entreprises"
            subtitle="Gestion des entreprises"
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, email, secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={filterSecteur}
                  onChange={(e) => setFilterSecteur(e.target.value)}
                  className="w-40"
                >
                  <option value="">Tous secteurs</option>
                  {secteurs.map((secteur) => (
                    <option key={secteur} value={secteur}>{secteur}</option>
                  ))}
                </Select>
                <Select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="w-32"
                >
                  <option value="">Tous statuts</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-1 rounded ${viewMode === 'card' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Vue en cartes"
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1 rounded ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Vue en liste"
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>
                <Link to="/entreprises/new">
                  <Button className="flex items-center gap-2" primaryColor={user?.entreprise?.couleurPrimaire} secondaryColor={user?.entreprise?.couleurSecondaire}>
                    <PlusIcon className="h-5 w-5" />
                    Ajouter
                  </Button>
                </Link>
              </div>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                {error}
              </div>
            )}

            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedRows.map((row) => (
                  <div key={row.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {row.logo && (
                            <img
                              src={row.logo}
                              alt={`Logo ${row.nom}`}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            <Link to={`/entreprises/${row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {row.nom}
                            </Link>
                          </h3>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          row.estActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row.estActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="font-medium w-16">Email:</span>
                          <span className="truncate">{row.email || '-'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-16">Tél:</span>
                          <span>{row.telephone || '-'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-16">Secteur:</span>
                          <span className="truncate">{row.secteurActivite || '-'}</span>
                        </div>
                        {row.adresse && (
                          <div className="flex items-start">
                            <span className="font-medium w-16">Adresse:</span>
                            <span className="text-xs">{row.adresse}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link to={`/entreprises/${row.id}`} className="flex-1">
                          <Button variant="outline" className="w-full text-xs" primaryColor={user?.entreprise?.couleurPrimaire} secondaryColor={user?.entreprise?.couleurSecondaire}>
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                        </Link>
                        <Link to={`/entreprises/${row.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full text-xs" primaryColor={user?.entreprise?.couleurPrimaire} secondaryColor={user?.entreprise?.couleurSecondaire}>
                            <PencilSquareIcon className="h-3 w-3 mr-1" />
                            Éditer
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => setToDelete(row)}
                          className="text-xs px-2"
                          primaryColor={user?.entreprise?.couleurPrimaire}
                          secondaryColor={user?.entreprise?.couleurSecondaire}
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                  rows={paginatedRows}
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
                            <Button variant="outline" className="text-xs px-2 py-1" primaryColor={user?.entreprise?.couleurPrimaire} secondaryColor={user?.entreprise?.couleurSecondaire}>
                              <EyeIcon className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Link to={`/entreprises/${row.id}/edit`}>
                            <Button variant="outline" className="text-xs px-2 py-1" primaryColor={user?.entreprise?.couleurPrimaire} secondaryColor={user?.entreprise?.couleurSecondaire}>
                              <PencilSquareIcon className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button variant="danger" onClick={() => setToDelete(row)} className="text-xs px-2 py-1" primaryColor={user?.entreprise?.couleurPrimaire} secondaryColor={user?.entreprise?.couleurSecondaire}>
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredRows.length}
                itemsPerPage={itemsPerPage}
              />
            )}

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
