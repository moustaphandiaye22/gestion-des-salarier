import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Card, CardHeader, CardBody } from "../components/ui";
import { bulletinsApi, paiementsApi } from "../utils/api";

function StatCard({ title, value, subtitle }) {
  return (
    <Card>
      <CardBody className="p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
      </CardBody>
    </Card>
  );
}

function last12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("fr-FR", { month: "short" }) + " '" + String(d.getFullYear()).slice(-2),
      date: d,
    });
  }
  return months;
}

function monthKeyFromDateLike(value) {
  try {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

export default function CashierDashboard() {
  const [data, setData] = useState({ bulletins: [], paiements: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bulletins, paiements] = await Promise.all([
        bulletinsApi.list(),
        paiementsApi.list(),
      ]);
      setData({ bulletins, paiements });
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const months = useMemo(() => last12Months(), []);

  // KPIs spécifiques au caissier
  const kpis = useMemo(() => {
    const { bulletins, paiements } = data;
    const totalAPayer = bulletins.reduce((acc, b) => acc + (Number(b.totalAPayer) || 0), 0);
    const payes = paiements.filter((p) => p.statut === "PAYE").length;
    const enAttente = paiements.filter((p) => p.statut === "EN_ATTENTE").length;
    return {
      totalAPayer,
      paiementsPayes: payes,
      paiementsEnAttente: enAttente,
      nbBulletins: bulletins.length,
    };
  }, [data]);

  const seriesPaymentsStatus = useMemo(() => {
    const statuses = ["PAYE", "EN_ATTENTE", "ECHEC"];
    const counts = { PAYE: 0, EN_ATTENTE: 0, ECHEC: 0 };
    for (const p of data.paiements) counts[p.statut] = (counts[p.statut] || 0) + 1;
    return {
      labels: statuses,
      series: statuses.map((s) => counts[s] || 0),
    };
  }, [data.paiements]);

  const latestBulletins = useMemo(() => {
    return [...data.bulletins]
      .sort((a, b) => new Date(b.dateGeneration || b.periodeFin || 0) - new Date(a.dateGeneration || a.periodeFin || 0))
      .slice(0, 6);
  }, [data.bulletins]);

  const latestPaiements = useMemo(() => {
    return [...data.paiements]
      .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))
      .slice(0, 6);
  }, [data.paiements]);

  // Options charts
  const donutOptions = useMemo(() => ({
    labels: seriesPaymentsStatus.labels,
    legend: { position: "bottom", labels: { colors: "#374151" } },
    colors: ["#059669", "#f59e0b", "#dc2626"],
    stroke: { colors: ["#fff"] },
  }), [seriesPaymentsStatus.labels]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Caissier</h1>
            <p className="mt-1 text-gray-600 text-sm">Gestion des paiements et bulletins de salaire.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>
        )}

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Bulletins" value={kpis.nbBulletins ?? "--"} subtitle="Total générés" />
          <StatCard title="Total paie" value={(kpis.totalAPayer || 0).toLocaleString("fr-FR")} subtitle="Montant total" />
          <StatCard title="Paiements payés" value={kpis.paiementsPayes ?? "--"} subtitle="Transactions réussies" />
          <StatCard title="Paiements en attente" value={kpis.paiementsEnAttente ?? "--"} subtitle="À traiter" />
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Statut des paiements" />
            <CardBody className="grid place-items-center">
              <Chart options={donutOptions} series={seriesPaymentsStatus.series} type="donut" height={280} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Derniers paiements" />
            <CardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {latestPaiements.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{p.bulletin?.employe ? `${p.bulletin.employe.prenom || ''} ${p.bulletin.employe.nom || ''}`.trim() : '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{(Number(p.montant) || 0).toLocaleString("fr-FR")}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            p.statut === 'PAYE' ? 'bg-green-100 text-green-800' :
                            p.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {p.statut}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{p.datePaiement ? new Date(p.datePaiement).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                    {!latestPaiements.length && (
                      <tr>
                        <td className="px-4 py-4 text-sm text-gray-500" colSpan={4}>Aucun paiement récent</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader title="Derniers bulletins" />
            <CardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {latestBulletins.map((b) => (
                      <tr key={b.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{b.employe ? `${b.employe.prenom || ''} ${b.employe.nom || ''}`.trim() : '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{b.numeroBulletin || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{b.periodeDebut ? new Date(b.periodeDebut).toLocaleDateString() : '-'} → {b.periodeFin ? new Date(b.periodeFin).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{(Number(b.totalAPayer) || 0).toLocaleString("fr-FR")}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <button
                            onClick={() => window.open(`/api/bulletins/${b.id}/pdf`, '_blank')}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Télécharger PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!latestBulletins.length && (
                      <tr>
                        <td className="px-4 py-4 text-sm text-gray-500" colSpan={5}>Aucun bulletin récent</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {loading && (
          <div className="mt-6 text-sm text-gray-600">Chargement des données...</div>
        )}
      </div>
    </main>
  );
}
