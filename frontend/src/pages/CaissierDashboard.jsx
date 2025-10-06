import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button, Modal, Input, Select } from "../components/ui";
import { cyclesPaieApi, bulletinsApi, paiementsApi, rapportsApi, employesApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { CreditCardIcon, DocumentIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function CaissierDashboard() {
  const [cycles, setCycles] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { user } = useAuth();

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Load validated cycles that cashier can pay
      const cyclesData = await cyclesPaieApi.list();
      const validatedCycles = cyclesData.filter(cycle => cycle.statutValidation === 'VALIDE');
      setCycles(validatedCycles);

      // Load bulletins for the enterprise
      const bulletinsData = await bulletinsApi.list();
      setBulletins(bulletinsData);

      // Load payments for the enterprise
      const paiementsData = await paiementsApi.list();
      setPaiements(paiementsData);

      // Load reports for the enterprise
      const rapportsData = await rapportsApi.list();
      setRapports(rapportsData);

    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showPaymentModal && selectedCycle) {
      loadEmployeesForCycle();
    }
  }, [showPaymentModal, selectedCycle]);

  async function loadEmployeesForCycle() {
    try {
      const employeesData = await employesApi.list();
      setEmployees(employeesData);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handlePayCycle(cycleId) {
    // Open employee selection modal for payment
    setSelectedCycle(cycleId);
    setShowPaymentModal(true);
  }

  async function handleDownloadReport(rapportId) {
    try {
      const blob = await rapportsApi.getPdf(rapportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${rapportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handleCreatePayment() {
    if (!selectedEmployee) {
      setError("Veuillez sélectionner un employé");
      return;
    }

    setPaymentLoading(true);
    try {
      await paiementsApi.create({
        cycleId: selectedCycle,
        employeId: selectedEmployee,
        entrepriseId: user.entrepriseId,
        utilisateurId: user.id,
        modePaiement: "VIREMENT", // Default payment method
        datePaiement: new Date().toISOString()
      });

      // Close modal and refresh data
      setShowPaymentModal(false);
      setSelectedEmployee("");
      setSelectedCycle(null);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setPaymentLoading(false);
    }
  }

  function handleCloseModal() {
    setShowPaymentModal(false);
    setSelectedEmployee("");
    setSelectedCycle(null);
    setError(null);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Caissier</h1>
          <p className="text-gray-600">Gérez les paiements et consultez les rapports</p>
        </div>

        {error && <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cycles de paie validés */}
          <Card>
            <CardHeader
              title="Cycles de paie validés"
              icon={<CreditCardIcon className="h-5 w-5" />}
            />
            <CardBody>
              <div className="max-h-64 overflow-y-auto">
                <Table
                  head={["Nom", "Période", "Bulletins", "Actions"]}
                  rows={cycles}
                  renderRow={(row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.nom}</td>
                      <td className="px-2 py-2 text-sm text-gray-700">
                        {row.dateDebut ? new Date(row.dateDebut).toLocaleDateString() : '-'} à {row.dateFin ? new Date(row.dateFin).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700 text-center">
                        {Array.isArray(row.bulletins) ? row.bulletins.length : 0}
                      </td>
                      <td className="px-2 py-2 text-sm">
                        <Button variant="primary" onClick={() => handlePayCycle(row.id)} className="text-xs px-3 py-1">
                          Payer
                        </Button>
                      </td>
                    </tr>
                  )}
                />
              </div>
              {cycles.length === 0 && !loading && <p className="text-sm text-gray-500 mt-4">Aucun cycle validé disponible</p>}
            </CardBody>
          </Card>

          {/* Bulletins */}
          <Card>
            <CardHeader
              title="Bulletins de paie"
              icon={<DocumentIcon className="h-5 w-5" />}
            />
            <CardBody>
              <div className="max-h-64 overflow-y-auto">
                <Table
                  head={["Employé", "Période", "Montant", "Statut"]}
                  rows={bulletins.slice(0, 10)} // Show only first 10
                  renderRow={(row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                        {row.employe?.prenom} {row.employe?.nom}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700">
                        {row.periodeDebut ? new Date(row.periodeDebut).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700">
                        {row.totalAPayer ? `${row.totalAPayer} FCFA` : '-'}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          row.statutPaiement === 'PAYE' ? 'bg-green-100 text-green-800' :
                          row.statutPaiement === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {row.statutPaiement || 'INCONNU'}
                        </span>
                      </td>
                    </tr>
                  )}
                />
              </div>
              {bulletins.length > 10 && <p className="text-sm text-gray-500 mt-4">Et {bulletins.length - 10} autres...</p>}
            </CardBody>
          </Card>

          {/* Paiements récents */}
          <Card>
            <CardHeader
              title="Paiements récents"
              icon={<CreditCardIcon className="h-5 w-5" />}
            />
            <CardBody>
              <div className="max-h-64 overflow-y-auto">
                <Table
                  head={["Employé", "Montant", "Date", "Mode"]}
                  rows={paiements.slice(0, 10)} // Show only first 10
                  renderRow={(row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                        {row.bulletin?.employe?.prenom} {row.bulletin?.employe?.nom}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700">
                        {row.montant ? `${row.montant} FCFA` : '-'}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700">
                        {row.datePaiement ? new Date(row.datePaiement).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700">
                        {row.modePaiement || '-'}
                      </td>
                    </tr>
                  )}
                />
              </div>
              {paiements.length > 10 && <p className="text-sm text-gray-500 mt-4">Et {paiements.length - 10} autres...</p>}
            </CardBody>
          </Card>

          {/* Rapports */}
          <Card>
            <CardHeader
              title="Rapports disponibles"
              icon={<ChartBarIcon className="h-5 w-5" />}
            />
            <CardBody>
              <div className="max-h-64 overflow-y-auto">
                <Table
                  head={["Type", "Date", "Actions"]}
                  rows={rapports.slice(0, 10)} // Show only first 10
                  renderRow={(row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                        {row.typeRapport || '-'}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700">
                        {row.dateGeneration ? new Date(row.dateGeneration).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-2 py-2 text-sm">
                        <Button variant="secondary" onClick={() => handleDownloadReport(row.id)} className="text-xs px-3 py-1">
                          Télécharger
                        </Button>
                      </td>
                    </tr>
                  )}
                />
              </div>
              {rapports.length === 0 && !loading && <p className="text-sm text-gray-500 mt-4">Aucun rapport disponible</p>}
            </CardBody>
          </Card>
        </div>

        {loading && <p className="mt-8 text-sm text-gray-600 text-center">Chargement...</p>}

        {/* Payment Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={handleCloseModal}
          title="Créer un paiement"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un employé
              </label>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full"
              >
                <option value="">Choisir un employé...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.prenom} {employee.nom} - {employee.profession?.nom}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={paymentLoading}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleCreatePayment}
                disabled={paymentLoading || !selectedEmployee}
              >
                {paymentLoading ? "Création..." : "Créer le paiement"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}
