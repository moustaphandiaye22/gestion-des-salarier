import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button } from "../components/ui";
import { bulletinsApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PlusIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function Bulletins() {
  const { selectedCompanyId, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      let data = await bulletinsApi.list();

      // Filter bulletins based on user role
      if (user?.role === 'SUPER_ADMIN') {
        // Super admin sees all bulletins
      } else if (user?.role === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
        // Admin entreprise sees only bulletins from their entreprise
        data = data.filter(b => b.employe?.entrepriseId === user.entrepriseId);
      } else if (user?.role === 'CAISSIER' && user.entrepriseId) {
        // Cashier sees only bulletins from their entreprise
        data = data.filter(b => b.employe?.entrepriseId === user.entrepriseId);
      }

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

  async function generateBulletins() {
    try {
      // For now, generate bulletins for the current cycle - you might want to add cycle selection
      await bulletinsApi.generate();
      load();
      showSuccess("Succès", "Bulletins générés avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de génération", errorMessage);
    }
  }

  async function exportBulletins() {
    try {
      const response = await bulletinsApi.exportExcel();
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bulletins.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess("Succès", "Bulletins exportés avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      showError("Erreur d'export", errorMessage);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Bulletins de salaire"
            actions={
              <div className="flex gap-2">
                <Button className="flex items-center gap-2" onClick={generateBulletins}>
                  <PlusIcon className="h-5 w-5" />
                  Générer
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={exportBulletins}
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Exporter Excel
                </Button>
              </div>
            }
          />
          <CardBody>
            {error && (
              <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Table
                head={[
                  "Numéro",
                  "Période",
                  "Salaire",
                  "Finances",
                  "Total",
                  "Statut",
                  "Employé",
                  "Cycle",
                  "Actions",
                ]}
                rows={rows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.numeroBulletin || "-"}</td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">
                      <div className="text-xs">
                        {row.periodeDebut ? new Date(row.periodeDebut).toLocaleDateString() : "-"}<br />
                        {row.periodeFin ? new Date(row.periodeFin).toLocaleDateString() : "-"}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-right font-medium">
                      {row.salaireBase?.toLocaleString()} CFA
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">
                      <div className="text-xs space-y-1">
                        <div className="text-green-600">+{row.allocations?.toLocaleString() || 0} CFA</div>
                        <div className="text-red-600">-{row.deductions?.toLocaleString() || 0} CFA</div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-right font-bold text-green-600">
                      {row.totalAPayer?.toLocaleString()} CFA
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.statutPaiement === 'PAYE' ? 'bg-green-100 text-green-800' :
                        row.statutPaiement === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {row.statutPaiement || 'BROUILLON'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                      {row.employe ? `${row.employe.prenom || ""} ${row.employe.nom || ""}`.trim() : "-"}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 hidden xl:table-cell">
                      <div className="text-xs">
                        {row.cycle?.typeCycle || "-"}<br />
                        <span className="text-gray-500">
                          {row.cycle?.periodeDebut ? new Date(row.cycle.periodeDebut).toLocaleDateString() : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm">
                      <div className="text-xs text-gray-500">
                        {Array.isArray(row.paiements) ? row.paiements.length : 0} paiement(s)
                      </div>
                    </td>
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
