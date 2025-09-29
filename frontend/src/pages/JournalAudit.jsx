import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button } from "../components/ui";
import {
  journauxAuditApi,
  utilisateursApi,
  entreprisesApi,
  employesApi,
  bulletinsApi,
  paiementsApi,
  cyclesPaieApi,
} from "../utils/api";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

function truncate(value, n = 120) {
  if (!value) return "-";
  try {
    const s = typeof value === "string" ? value : JSON.stringify(value);
    return s.length > n ? s.slice(0, n) + "…" : s;
  } catch {
    return "-";
  }
}

export default function JournalAudit() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [maps, setMaps] = useState({
    users: new Map(),
    entreprises: new Map(),
    employes: new Map(),
    bulletins: new Map(),
    paiements: new Map(),
    cycles: new Map(),
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      journauxAuditApi.list(),
      utilisateursApi.list(),
      entreprisesApi.list(),
      employesApi.list(),
      bulletinsApi.list(),
      paiementsApi.list(),
      cyclesPaieApi.list(),
    ])
      .then(([journaux, users, entreprises, employes, bulletins, paiements, cycles]) => {
        if (!mounted) return;
        const toMap = (arr) => {
          const m = new Map();
          (Array.isArray(arr) ? arr : []).forEach((it) => m.set(it.id, it));
          return m;
        };
        setRows(Array.isArray(journaux) ? journaux : []);
        setMaps({
          users: toMap(users),
          entreprises: toMap(entreprises),
          employes: toMap(employes),
          bulletins: toMap(bulletins),
          paiements: toMap(paiements),
          cycles: toMap(cycles),
        });
      })
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const resolvedRows = useMemo(() => {
    return rows.map((r) => {
      const user = r.utilisateurId ? maps.users.get(r.utilisateurId) : null;
      const ent = r.entrepriseId ? maps.entreprises.get(r.entrepriseId) : null;
      const emp = r.employeId ? maps.employes.get(r.employeId) : null;
      const bul = r.bulletinId ? maps.bulletins.get(r.bulletinId) : null;
      const pay = r.paiementId ? maps.paiements.get(r.paiementId) : null;
      const cyc = r.cyclePaieId ? maps.cycles.get(r.cyclePaieId) : null;
      return {
        ...r,
        _userLabel: user ? `${user.email}${user.role ? " (" + user.role + ")" : ""}` : (r.utilisateurId ?? "-"),
        _entLabel: ent ? `${ent.nom}` : (r.entrepriseId ?? "-"),
        _empLabel: emp ? `${emp.prenom || ""} ${emp.nom || ""}`.trim() : (r.employeId ?? "-"),
        _bulLabel: bul ? `${bul.numeroBulletin || bul.id}` : (r.bulletinId ?? "-"),
        _payLabel: pay ? `${pay.reference || pay.id} / ${(pay.montant ?? "-")}` : (r.paiementId ?? "-"),
        _cycLabel: cyc ? `${cyc.typeCycle || ""} (${cyc.periodeDebut ? new Date(cyc.periodeDebut).toLocaleDateString() : "-"} → ${cyc.periodeFin ? new Date(cyc.periodeFin).toLocaleDateString() : "-"})` : (r.cyclePaieId ?? "-"),
      };
    });
  }, [rows, maps]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Journal d'audit"
            actions={
              <Button className="flex items-center gap-2">
                <ArrowDownTrayIcon className="h-5 w-5" />
                Exporter
              </Button>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>
            )}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={[
                  "Date",
                  "Action",
                  "Utilisateur",
                  "Entité",
                  "Détails",
                ]}
                rows={resolvedRows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-700 font-medium">
                      {row.dateAction ? new Date(row.dateAction).toLocaleString() : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.action || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row._userLabel}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">
                      <div className="text-xs space-y-1">
                        <div>Entreprise: {row._entLabel}</div>
                        <div>Employé: {row._empLabel}</div>
                        <div>Bulletin: {row._bulLabel}</div>
                        <div>Paiement: {row._payLabel}</div>
                        <div>Cycle: {row._cycLabel}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">{truncate(row.details, 120)}</td>
                  </tr>
                )}
              />
            </div>
            {loading && <p className="mt-3 text-sm text-gray-600">Chargement...</p>}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
