import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog } from "../components/ui";
import { rapportsApi, entreprisesApi } from "../utils/api";
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
        setRows(Array.isArray(rapports) ? rapports : []);
        setEntreprises(Array.isArray(ents) ? ents : []);
      })
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  async function refresh() {
    try {
      const rapports = await rapportsApi.list();
      setRows(Array.isArray(rapports) ? rapports : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await rapportsApi.remove(toDelete.id);
      setToDelete(null);
      refresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
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

  function downloadRapport(row) {
    try {
      const file = new Blob([JSON.stringify(row.contenu, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      const date = row.dateGeneration ? new Date(row.dateGeneration).toISOString().slice(0, 10) : "";
      a.href = url;
      a.download = `rapport-${row.typeRapport?.toLowerCase() || "data"}-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      // silencieux
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
                <Button className="flex items-center gap-2">
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
