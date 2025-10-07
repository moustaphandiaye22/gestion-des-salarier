import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input, Select } from "../components/ui";
import Pagination from "../components/Pagination";
import { professionsApi } from "../utils/api";
import { useToast } from "../context/ToastContext";
import { PencilSquareIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Professions() {
  const { showSuccess, showError } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("");
  const [filterStatut, setFilterStatut] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await professionsApi.list();
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
      await professionsApi.remove(toDelete.id);
      setToDelete(null);
      load();
      showSuccess("Succès", "Profession supprimée avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de suppression", errorMessage);
    }
  }

  // Filtered rows based on search and filters
  const filteredRows = useMemo(() => {
    return rows.filter((profession) => {
      const matchesSearch = !searchTerm ||
        profession.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profession.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profession.categorie?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategorie = !filterCategorie || profession.categorie === filterCategorie;
      const matchesStatut = !filterStatut ||
        (filterStatut === "active" && profession.estActive) ||
        (filterStatut === "inactive" && !profession.estActive);

      return matchesSearch && matchesCategorie && matchesStatut;
    });
  }, [rows, searchTerm, filterCategorie, filterStatut]);

  // Paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategorie, filterStatut]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(rows.map(p => p.categorie).filter(Boolean))];
    return uniqueCategories.sort();
  }, [rows]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Professions"
            subtitle="Gestion des professions"
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={filterCategorie}
                  onChange={(e) => setFilterCategorie(e.target.value)}
                  className="w-40"
                >
                  <option value="">Toutes catégories</option>
                  {categories.map((categorie) => (
                    <option key={categorie} value={categorie}>{categorie}</option>
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
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Ajouter
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

            <div className="text-sm text-gray-600 mb-4">
              {filteredRows.length} profession{filteredRows.length !== 1 ? 's' : ''} trouvée{filteredRows.length !== 1 ? 's' : ''}
            </div>

            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
              <Table
                head={[
                  "Nom",
                  "Description",
                  "Catégorie",
                  "Actif",
                  "Actions",
                ]}
                rows={paginatedRows}
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
            {filteredRows.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredRows.length}
                itemsPerPage={itemsPerPage}
              />
            )}
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