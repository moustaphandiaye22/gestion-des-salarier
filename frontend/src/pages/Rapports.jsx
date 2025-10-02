import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { rapportsApi, entreprisesApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { EyeIcon, ArrowDownTrayIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

function truncate(value, n = 160) {
  if (value == null) return "-";
  try {
    const s = typeof value === "string" ? value : JSON.stringify(value);
    return s.length > n ? s.slice(0, n) + "…" : s;
  } catch {
    return "-";
  }
}

export default function Rapports() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [rows, setRows] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [filterEntreprise, setFilterEntreprise] = useState("");
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([rapportsApi.list(), entreprisesApi.list()])
      .then(([rapports, ents]) => {
        if (!mounted) return;

        // Filter reports based on user role
        if (user?.role === 'SUPER_ADMIN') {
          // Super admin sees all reports
        } else if (user?.role === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
          // Admin entreprise sees only reports from their entreprise
          rapports = rapports.filter(r => r.entrepriseId === user.entrepriseId);
        } else if (user?.role === 'CAISSIER' && user.entrepriseId) {
          // Cashier sees only reports from their entreprise
          rapports = rapports.filter(r => r.entrepriseId === user.entrepriseId);
        }

        setRows(Array.isArray(rapports) ? rapports : []);
        setEntreprises(Array.isArray(ents) ? ents : []);
      })
      .catch((err) => {
        const errorMessage = err?.response?.data?.message || err.message;
        setError(errorMessage);
        showError("Erreur de chargement", errorMessage);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [user]);

  async function refresh() {
    try {
      const rapports = await rapportsApi.list();
      setRows(Array.isArray(rapports) ? rapports : []);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de rafraîchissement", errorMessage);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await rapportsApi.remove(toDelete.id);
      setToDelete(null);
      refresh();
      showSuccess("Succès", "Rapport supprimé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de suppression", errorMessage);
    }
  }

  const entrepriseMap = useMemo(() => {
    const m = new Map();
    entreprises.forEach((e) => m.set(e.id, e));
    return m;
  }, [entreprises]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterType && r.typeRapport !== filterType) return false;
      if (filterEntreprise && String(r.entrepriseId || "") !== String(filterEntreprise)) return false;
      return true;
    });
  }, [rows, filterType, filterEntreprise]);

  async function downloadRapport(row) {
    try {
      const pdfBlob = await rapportsApi.getPdf(row.id);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      const date = row.dateGeneration ? new Date(row.dateGeneration).toISOString().slice(0, 10) : "";
      a.href = url;
      a.download = `rapport-${row.typeRapport?.toLowerCase() || "data"}-${date}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erreur lors du téléchargement du rapport:", e);
      setError("Erreur lors du téléchargement du rapport");
    }
  }

  async function generateRapport() {
    try {
      // For now, generate a basic report - you might want to add a modal for report type selection
      const reportData = {
        typeRapport: "STATISTIQUES",
        entrepriseId: user?.entrepriseId || null,
        contenu: {
          message: "Rapport généré automatiquement",
          date: new Date().toISOString(),
          user: user?.email || "Système"
        }
      };

      await rapportsApi.create(reportData);
      refresh();
      showSuccess("Succès", "Rapport généré avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de génération", errorMessage);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Rapports"
            subtitle="Aperçu et export des rapports générés"
            actions={(
              <div className="flex items-center gap-2">
                <Button className="flex items-center gap-2" onClick={generateRapport}>
                  <PlusIcon className="h-5 w-5" />
                  Générer
                </Button>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-md border-gray-300 text-sm py-2 px-2 focus:border-gray-900 focus:ring-gray-900"
                >
                  <option value="">Tous les types</option>
                  <option value="BULLETINS">Bulletins</option>
                  <option value="EMPLOYES">Employés</option>
                  <option value="PAIEMENTS">Paiements</option>
                  <option value="STATISTIQUES">Statistiques</option>
                </select>
                <select
                  value={filterEntreprise}
                  onChange={(e) => setFilterEntreprise(e.target.value)}
                  className="rounded-md border-gray-300 text-sm py-2 px-2 focus:border-gray-900 focus:ring-gray-900"
                >
                  <option value="">Toutes entreprises</option>
                  {entreprises.map((e) => (
                    <option key={e.id} value={e.id}>{e.nom}</option>
                  ))}
                </select>
              </div>
            )}
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>
            )}

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={["Type", "Date génération", "Entreprise", "Contenu (aperçu)", "Actions"]}
                rows={filtered}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.typeRapport}</td>
                    <td className="px-2 py-2 text-sm text-gray-700">{row.dateGeneration ? new Date(row.dateGeneration).toLocaleString() : '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700">{entrepriseMap.get(row.entrepriseId)?.nom || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700">{truncate(row.contenu, 160)}</td>
                    <td className="px-2 py-2 text-sm">
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSelected(row)} className="flex items-center gap-1">
                          <EyeIcon className="h-4 w-4" />
                          Voir
                        </Button>
                        <Button variant="outline" onClick={() => downloadRapport(row)} className="flex items-center gap-1">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Télécharger
                        </Button>
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
          </CardBody>
        </Card>

        {/* Détail du rapport */}
        {selected && (
          <div className="fixed inset-0 z-50 bg-black/40 p-4 grid place-items-center">
            <div className="w-full max-w-3xl rounded-lg bg-white ring-1 ring-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Détail du rapport</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Type: {selected.typeRapport} · Entreprise: {entrepriseMap.get(selected.entrepriseId)?.nom || '-'} ·
                    Date: {selected.dateGeneration ? new Date(selected.dateGeneration).toLocaleString() : '-'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => downloadRapport(selected)}>Télécharger</Button>
                  <Button onClick={() => setSelected(null)}>Fermer</Button>
                </div>
              </div>
              <div className="p-4 max-h-[70vh] overflow-auto">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words">
{(() => { try { return JSON.stringify(selected.contenu, null, 2); } catch { return String(selected.contenu ?? '-') } })()}
                </pre>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!toDelete}
          title="Supprimer le rapport"
          message={`Confirmer la suppression de ce rapport (${toDelete?.typeRapport || ''}) ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </main>
  );
}
