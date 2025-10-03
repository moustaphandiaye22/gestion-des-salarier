import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input, Select } from "../components/ui";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export default function Pointages() {
  const { selectedCompanyId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Simulation de l'API - à remplacer par l'appel réel
      const mockData = [
        {
          id: 1,
          datePointage: "2024-01-15T08:00:00Z",
          heureEntree: "2024-01-15T08:00:00Z",
          heureSortie: "2024-01-15T17:00:00Z",
          dureeTravail: 8.0,
          typePointage: "PRESENCE",
          statut: "PRESENT",
          lieu: "Bureau principal",
          commentaire: "Journée normale",
          employe: {
            id: 1,
            prenom: "Jean",
            nom: "Dupont",
            matricule: "EMP001"
          },
          entreprise: {
            nom: "Entreprise ABC"
          }
        },
        {
          id: 2,
          datePointage: "2024-01-15T09:30:00Z",
          heureEntree: "2024-01-15T09:30:00Z",
          heureSortie: "2024-01-15T18:30:00Z",
          dureeTravail: 8.0,
          typePointage: "HEURE_SUPPLEMENTAIRE",
          statut: "PRESENT",
          lieu: "Bureau principal",
          commentaire: "Heures supplémentaires",
          employe: {
            id: 2,
            prenom: "Marie",
            nom: "Martin",
            matricule: "EMP002"
          },
          entreprise: {
            nom: "Entreprise ABC"
          }
        }
      ];
      setRows(Array.isArray(mockData) ? mockData : []);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Erreur";
      setError(errorMessage);
      showError("Erreur de chargement", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Filtered pointages based on search and filters
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pointage =>
        pointage.employe?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pointage.employe?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pointage.employe?.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pointage.lieu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pointage.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(pointage => pointage.typePointage === typeFilter);
    }

    // Statut filter
    if (statutFilter) {
      filtered = filtered.filter(pointage => pointage.statut === statutFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(pointage =>
        pointage.datePointage?.startsWith(dateFilter)
      );
    }

    return filtered;
  }, [rows, searchTerm, typeFilter, statutFilter, dateFilter]);

  // Paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statutFilter, dateFilter]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  useEffect(() => {
    load();
  }, [selectedCompanyId]);

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      // Simulation de la suppression - à remplacer par l'appel réel
      // await pointagesApi.remove(toDelete.id);
      setToDelete(null);
      load();
      showSuccess("Succès", "Pointage supprimé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de suppression", errorMessage);
    }
  }

  function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatDuration(hours) {
    if (!hours) return '-';
    return `${hours}h`;
  }

  function getStatutBadge(statut) {
    const badges = {
      'PRESENT': 'bg-green-100 text-green-800',
      'ABSENT': 'bg-red-100 text-red-800',
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'VALIDE': 'bg-blue-100 text-blue-800',
      'REJETE': 'bg-red-100 text-red-800',
      'MODIFIE': 'bg-purple-100 text-purple-800'
    };
    return badges[statut] || 'bg-gray-100 text-gray-800';
  }

  function getTypeBadge(type) {
    const badges = {
      'PRESENCE': 'bg-green-100 text-green-800',
      'ABSENCE': 'bg-red-100 text-red-800',
      'CONGE': 'bg-blue-100 text-blue-800',
      'MALADIE': 'bg-orange-100 text-orange-800',
      'MISSION': 'bg-purple-100 text-purple-800',
      'FORMATION': 'bg-indigo-100 text-indigo-800',
      'TELETRAVAIL': 'bg-teal-100 text-teal-800',
      'HEURE_SUPPLEMENTAIRE': 'bg-yellow-100 text-yellow-800'
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Gestion des Pointages"
            subtitle="Suivi moderne des présences par QR Code"
            actions={
              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Nouveau Pointage
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

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par employé, lieu ou commentaire..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-40"
                  >
                    <option value="">Tous types</option>
                    <option value="PRESENCE">Présence</option>
                    <option value="ABSENCE">Absence</option>
                    <option value="CONGE">Congé</option>
                    <option value="MALADIE">Maladie</option>
                    <option value="MISSION">Mission</option>
                    <option value="FORMATION">Formation</option>
                    <option value="TELETRAVAIL">Télétravail</option>
                    <option value="HEURE_SUPPLEMENTAIRE">Heures sup.</option>
                  </Select>
                  <Select
                    value={statutFilter}
                    onChange={(e) => setStatutFilter(e.target.value)}
                    className="w-40"
                  >
                    <option value="">Tous statuts</option>
                    <option value="PRESENT">Présent</option>
                    <option value="ABSENT">Absent</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="VALIDE">Validé</option>
                    <option value="REJETE">Rejeté</option>
                    <option value="MODIFIE">Modifié</option>
                  </Select>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-40"
                    placeholder="Date"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {filteredRows.length} pointage{filteredRows.length !== 1 ? 's' : ''} trouvé{filteredRows.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
              <Table
                head={[
                  "Date",
                  "Employé",
                  "Entrée",
                  "Sortie",
                  "Durée",
                  "Type",
                  "Statut",
                  "Lieu",
                  "Commentaire",
                  "Actions",
                ]}
                rows={paginatedRows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {formatDateTime(row.datePointage).split(' ')[0]}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{row.employe?.prenom} {row.employe?.nom}</div>
                          <div className="text-xs text-gray-500">{row.employe?.matricule}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.heureEntree ? formatDateTime(row.heureEntree).split(' ')[1] : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.heureSortie ? formatDateTime(row.heureSortie).split(' ')[1] : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 font-medium">
                      {formatDuration(row.dureeTravail)}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(row.typePointage)}`}>
                        {row.typePointage?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatutBadge(row.statut)}`}>
                        {row.statut}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3 text-gray-400" />
                        <span className="truncate max-w-24" title={row.lieu}>
                          {row.lieu || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                      <span className="truncate max-w-32" title={row.commentaire}>
                        {row.commentaire || '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm">
                      <div className="flex gap-1">
                        <Button variant="outline" className="text-xs px-2 py-1">
                          <EyeIcon className="h-3 w-3" />
                        </Button>
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

            {totalPages > 1 && (
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
          title="Supprimer le pointage"
          message={`Confirmer la suppression du pointage de ${toDelete?.employe?.prenom || ""} ${toDelete?.employe?.nom || ""} du ${formatDateTime(toDelete?.datePointage).split(' ')[0]} ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </main>
  );
}