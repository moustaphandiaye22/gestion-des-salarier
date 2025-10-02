import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input, Select } from "../components/ui";
import { cyclesPaieApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TrashIcon, PlusIcon, CheckIcon, XMarkIcon, CreditCardIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function CyclesPaie() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterFrequence, setFilterFrequence] = useState("");
  const [filterEntreprise, setFilterEntreprise] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await cyclesPaieApi.list();

      // Filter cycles based on filters and search
      let filteredData = Array.isArray(data) ? data : [];

      if (filterStatut) {
        filteredData = filteredData.filter(cycle => cycle.statut === filterStatut);
      }
      if (filterFrequence) {
        filteredData = filteredData.filter(cycle => cycle.frequence === filterFrequence);
      }
      if (filterEntreprise) {
        filteredData = filteredData.filter(cycle => cycle.entreprise?.id === parseInt(filterEntreprise));
      }
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filteredData = filteredData.filter(cycle =>
          (cycle.nom && cycle.nom.toLowerCase().includes(lowerSearch)) ||
          (cycle.entreprise?.nom && cycle.entreprise.nom.toLowerCase().includes(lowerSearch))
        );
      }

      setRows(filteredData);
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
  }, [searchTerm, filterStatut, filterFrequence, filterEntreprise]);

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await cyclesPaieApi.remove(toDelete.id);
      setToDelete(null);
      load();
      showSuccess("Succès", "Cycle de paie supprimé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur", errorMessage);
    }
  }

  async function handleValidate(id) {
    try {
      await cyclesPaieApi.validate(id);
      load();
      showSuccess("Succès", "Cycle de paie validé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur", errorMessage);
    }
  }

  async function handleClose(id) {
    try {
      await cyclesPaieApi.close(id);
      load();
      showSuccess("Succès", "Cycle de paie clôturé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      let userFriendlyMessage = errorMessage;

      // Provide more user-friendly error messages for common cases
      if (errorMessage.includes('Tous les paiements doivent être effectués')) {
        userFriendlyMessage = 'Impossible de clôturer le cycle : tous les bulletins doivent être payés avant la clôture.';
      } else if (errorMessage.includes('doit être validé')) {
        userFriendlyMessage = 'Impossible de clôturer le cycle : le cycle doit d\'abord être validé.';
      }

      setError(userFriendlyMessage);
      showError("Erreur de clôture", userFriendlyMessage);
    }
  }

  async function handleCashierPay(id) {
    // This would navigate to payment page or open payment modal
    alert(`Paiement pour le cycle ${id} initié (fonctionnalité à implémenter)`);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Cycles de paie"
            subtitle="Gestion des cycles de paie et validation"
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, entreprise..."
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
                  <option value="ACTIF">Actif</option>
                  <option value="TERMINE">Terminé</option>
                  <option value="INACTIF">Inactif</option>
                </Select>
                <Select
                  value={filterFrequence}
                  onChange={(e) => setFilterFrequence(e.target.value)}
                  className="w-32"
                >
                  <option value="">Toutes fréquences</option>
                  <option value="MENSUELLE">Mensuelle</option>
                  <option value="HEBDOMADAIRE">Hebdomadaire</option>
                  <option value="QUOTIDIENNE">Quotidienne</option>
                </Select>
                <Select
                  value={filterEntreprise}
                  onChange={(e) => setFilterEntreprise(e.target.value)}
                  className="w-40"
                >
                  <option value="">Toutes entreprises</option>
                  {rows.map((cycle) => cycle.entreprise).filter(Boolean).filter((entreprise, index, self) =>
                    self.findIndex(e => e.id === entreprise.id) === index
                  ).sort((a, b) => a.nom.localeCompare(b.nom)).map((entreprise) => (
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
            {error && <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>}

            <div className="text-sm text-gray-600 mb-4">
              {rows.length} cycle{rows.length !== 1 ? 's' : ''} de paie trouvé{rows.length !== 1 ? 's' : ''}
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={[
                  "Entreprise",
                  "Nom",
                  "Fréquence",
                  "Période",
                  "Statut",
                  "Bulletins",
                  "Dates",
                  "Actions",
                ]}
                rows={rows}
                renderRow={(row) => {
                  const canValidate = user && (user.role === 'ADMIN_ENTREPRISE' || user.role === 'SUPER_ADMIN') && row.statutValidation === 'BROUILLON';
                  const canClose = user && (user.role === 'ADMIN_ENTREPRISE' || user.role === 'SUPER_ADMIN') && row.statutValidation === 'VALIDE';
                  const canPay = user && user.role === 'CAISSIER' && row.statutValidation === 'VALIDE';

                  return (
                    <tr key={row.id}>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.entreprise?.nom || '-'}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 font-medium">{row.nom || '-'}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row.frequence || '-'}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">
                        <div className="text-xs">
                          {row.dateDebut ? new Date(row.dateDebut).toLocaleDateString() : '-'}<br />
                          {row.dateFin ? new Date(row.dateFin).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          row.statut === 'ACTIF' ? 'bg-green-100 text-green-800' :
                          row.statut === 'TERMINE' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.statut || 'INACTIF'}
                        </span>
                        <div className="mt-1 text-xs">
                          Validation: {row.statutValidation || '-'}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700 text-center">
                        {Array.isArray(row.bulletins) ? row.bulletins.length : 0}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                        <div className="text-xs space-y-1">
                          <div>Créé: {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}</div>
                          <div className="text-gray-500">Modif: {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '-'}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-sm space-x-1">
                        {canValidate && (
                          <Button variant="success" title="Valider" onClick={() => handleValidate(row.id)} className="text-xs px-2 py-1">
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {canClose && (
                          <Button variant="warning" title="Clôturer" onClick={() => handleClose(row.id)} className="text-xs px-2 py-1">
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {canPay && (
                          <Button variant="primary" title="Payer" onClick={() => handleCashierPay(row.id)} className="text-xs px-2 py-1">
                            <CreditCardIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="danger" onClick={() => setToDelete(row)} className="text-xs px-2 py-1">
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  );
                }}
              />
            </div>
            {loading && <p className="mt-3 text-sm text-gray-600">Chargement...</p>}
          </CardBody>
        </Card>

        <ConfirmDialog
          open={!!toDelete}
          title="Supprimer le cycle de paie"
          message={`Confirmer la suppression de ${toDelete?.nom || ''} ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </main>
  );
}
