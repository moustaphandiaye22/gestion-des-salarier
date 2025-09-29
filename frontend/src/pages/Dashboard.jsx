import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Card, CardHeader, CardBody, Button } from "../components/ui";
import { employesApi, bulletinsApi, paiementsApi, cyclesPaieApi } from "../utils/api";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

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

export default function Dashboard() {
  const [data, setData] = useState({ employes: [], bulletins: [], paiements: [], cycles: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [employes, bulletins, paiements, cycles] = await Promise.all([
        employesApi.list(),
        bulletinsApi.list(),
        paiementsApi.list(),
        cyclesPaieApi.list(),
      ]);
      setData({ employes, bulletins, paiements, cycles });
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

  // Agrégations
  const kpis = useMemo(() => {
    const { employes, bulletins, paiements, cycles } = data;
    const actifs = employes.filter((e) => e.estActif).length;
    const totalAPayer = bulletins.reduce((acc, b) => acc + (Number(b.totalAPayer) || 0), 0);
    const payes = paiements.filter((p) => p.statut === "PAYE").length;
    return {
      nbEmployes: employes.length,
      nbEmployesActifs: actifs,
      totalAPayer,
      paiementsPayes: payes,
      nbCycles: cycles.length,
      nbBulletins: bulletins.length,
    };
  }, [data]);

  const seriesPayrollByMonth = useMemo(() => {
    const map = new Map(months.map((m) => [m.key, 0]));
    for (const b of data.bulletins) {
      const key = monthKeyFromDateLike(b.dateGeneration || b.periodeFin || b.periodeDebut) || months[months.length - 1].key;
      if (map.has(key)) map.set(key, map.get(key) + (Number(b.totalAPayer) || 0));
    }
    const values = months.map((m) => Math.round((map.get(m.key) || 0) * 100) / 100);
    return [{ name: "Total paie", data: values }];
  }, [data.bulletins, months]);

  const seriesPaymentsStatus = useMemo(() => {
    const statuses = ["PAYE", "EN_ATTENTE", "ECHEC"];
    const counts = { PAYE: 0, EN_ATTENTE: 0, ECHEC: 0 };
    for (const p of data.paiements) counts[p.statut] = (counts[p.statut] || 0) + 1;
    return {
      labels: statuses,
      series: statuses.map((s) => counts[s] || 0),
    };
  }, [data.paiements]);

  const seriesEmployeesByStatut = useMemo(() => {
    const labels = ["ACTIF", "CONGE", "LICENCIE", "RETRAITE"];
    const counts = { ACTIF: 0, CONGE: 0, LICENCIE: 0, RETRAITE: 0 };
    for (const e of data.employes) counts[e.statutEmploi] = (counts[e.statutEmploi] || 0) + 1;
    return { labels, series: [{ name: "Employés", data: labels.map((l) => counts[l] || 0) }] };
  }, [data.employes]);

  const seriesContracts = useMemo(() => {
    const labels = ["CDI", "CDD", "INTERIM", "STAGE"];
    const counts = { CDI: 0, CDD: 0, INTERIM: 0, STAGE: 0 };
    for (const e of data.employes) counts[e.typeContrat] = (counts[e.typeContrat] || 0) + 1;
    return { labels, series: [{ name: "Contrats", data: labels.map((l) => counts[l] || 0) }] };
  }, [data.employes]);

  const latestBulletins = useMemo(() => {
    return [...data.bulletins]
      .sort((a, b) => new Date(b.dateGeneration || b.periodeFin || 0) - new Date(a.dateGeneration || a.periodeFin || 0))
      .slice(0, 6);
  }, [data.bulletins]);

  // Options charts (neutres, sans dégradés)
  const areaOptions = useMemo(() => ({
    chart: { id: "payroll-area", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "solid", opacity: 0.15 },
    xaxis: { categories: months.map((m) => m.label), labels: { style: { colors: "#6b7280" } } },
    yaxis: { labels: { style: { colors: "#6b7280" } } },
    colors: ["#111827"],
    grid: { borderColor: "#e5e7eb" },
    tooltip: { theme: "light", y: { formatter: (v) => `${v.toLocaleString("fr-FR")}` } },
  }), [months]);

  const donutOptions = useMemo(() => ({
    labels: seriesPaymentsStatus.labels,
    legend: { position: "bottom", labels: { colors: "#374151" } },
    colors: ["#059669", "#f59e0b", "#dc2626"],
    stroke: { colors: ["#fff"] },
  }), [seriesPaymentsStatus.labels]);

  const barStatutOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: seriesEmployeesByStatut.labels, labels: { style: { colors: "#6b7280" } } },
    yaxis: { labels: { style: { colors: "#6b7280" } } },
    colors: ["#111827"],
    grid: { borderColor: "#e5e7eb" },
  }), [seriesEmployeesByStatut.labels]);

  const barContractsOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: seriesContracts.labels, labels: { style: { colors: "#6b7280" } } },
    yaxis: { labels: { style: { colors: "#6b7280" } } },
    colors: ["#111827"],
    grid: { borderColor: "#e5e7eb" },
  }), [seriesContracts.labels]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-1 text-gray-600 text-sm">Vue d'ensemble de l'activité. Interface professionnelle, sobre et sans dégradés.</p>
          </div>
          <Button onClick={loadData} disabled={loading} className="flex items-center gap-2">
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>
        )}

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Employés" value={kpis.nbEmployes ?? "--"} subtitle={`${kpis.nbEmployesActifs ?? 0} actifs`} />
          <StatCard title="Bulletins" value={kpis.nbBulletins ?? "--"} subtitle="Total générés" />
          <StatCard title="Total paie (12m)" value={(seriesPayrollByMonth[0]?.data?.reduce((a,b)=>a+b,0) || 0).toLocaleString("fr-FR")} subtitle="Somme des bulletins" />
          <StatCard title="Paiements payés" value={kpis.paiementsPayes ?? "--"} subtitle="Transactions réussies" />
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Total de paie par mois (12 derniers mois)" />
            <CardBody>
              <Chart options={areaOptions} series={seriesPayrollByMonth} type="area" height={280} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Statut des paiements" />
            <CardBody className="grid place-items-center">
              <Chart options={donutOptions} series={seriesPaymentsStatus.series} type="donut" height={280} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Employés par statut" />
            <CardBody>
              <Chart options={barStatutOptions} series={seriesEmployeesByStatut.series} type="bar" height={280} />
            </CardBody>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Types de contrat" />
            <CardBody>
              <Chart options={barContractsOptions} series={seriesContracts.series} type="bar" height={280} />
            </CardBody>
          </Card>

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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {latestBulletins.map((b) => (
                      <tr key={b.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{b.employe ? `${b.employe.prenom || ''} ${b.employe.nom || ''}`.trim() : '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{b.numeroBulletin || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{b.periodeDebut ? new Date(b.periodeDebut).toLocaleDateString() : '-'} → {b.periodeFin ? new Date(b.periodeFin).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{(Number(b.totalAPayer) || 0).toLocaleString("fr-FR")}</td>
                      </tr>
                    ))}
                    {!latestBulletins.length && (
                      <tr>
                        <td className="px-4 py-4 text-sm text-gray-500" colSpan={4}>Aucun bulletin récent</td>
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
