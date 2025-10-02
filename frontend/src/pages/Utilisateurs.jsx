import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input, Select } from "../components/ui";
import { utilisateursApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TrashIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Utilisateurs() {
  const { selectedCompanyId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterEntreprise, setFilterEntreprise] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await utilisateursApi.list();
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
  }, [selectedCompanyId]);

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await utilisateursApi.remove(toDelete.id);
      setToDelete(null);
      load();
      showSuccess("Succès", "Utilisateur supprimé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de suppression", errorMessage);
    }
  }

  // Filtered rows based on search and filters
  const filteredRows = useMemo(() => {
    return rows.filter((utilisateur) => {
      const matchesSearch = !searchTerm ||
        utilisateur.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utilisateur.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !filterRole || utilisateur.role === filterRole;
      const matchesStatut = !filterStatut ||
        (filterStatut === "active" && utilisateur.estActif) ||
        (filterStatut === "inactive" && !utilisateur.estActif);
      const matchesEntreprise = !filterEntreprise ||
        utilisateur.entreprise?.id === parseInt(filterEntreprise);

      return matchesSearch && matchesRole && matchesStatut && matchesEntreprise;
    });
  }, [rows, searchTerm, filterRole, filterStatut, filterEntreprise]);

  // Get unique roles and entreprises for filter dropdowns
  const roles = useMemo(() => {
    const uniqueRoles = [...new Set(rows.map(u => u.role).filter(Boolean))];
    return uniqueRoles.sort();
  }, [rows]);

  const entreprises = useMemo(() => {
    const uniqueEntreprises = [...new Set(rows.map(u => u.entreprise).filter(Boolean))];
    return uniqueEntreprises.sort((a, b) => a.nom.localeCompare(b.nom));
  }, [rows]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Utilisateurs"
            subtitle="Gestion des utilisateurs"
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-32"
                >
                  <option value="">Tous rôles</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Select>
                <Select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="w-32"
                >
                  <option value="">Tous statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
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
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Ajouter
                </Button>
              </div>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>
            )}

            <div className="text-sm text-gray-600 mb-4">
              {filteredRows.length} utilisateur{filteredRows.length !== 1 ? 's' : ''} trouvé{filteredRows.length !== 1 ? 's' : ''}
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={["Nom", "Email", "Rôle", "Actif", "Entreprise", "Actions"]}
                rows={filteredRows}
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
