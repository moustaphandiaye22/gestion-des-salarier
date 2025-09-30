import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input, Select } from "../components/ui";
import { licencesApi, entreprisesApi } from "../utils/api";
import { TrashIcon, PlusIcon, PencilIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Licences() {
  const [rows, setRows] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    typeLicence: "STANDARD",
    statut: "ACTIVE",
    dateDebut: "",
    dateFin: "",
    nombreUtilisateursMax: "",
    entrepriseId: ""
  });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [licencesData, entreprisesData] = await Promise.all([
        licencesApi.list(),
        entreprisesApi.list()
      ]);
      setRows(Array.isArray(licencesData) ? licencesData : []);
      setEntreprises(Array.isArray(entreprisesData) ? entreprisesData : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setForm({
      nom: selected.nom || "",
      description: selected.description || "",
      typeLicence: selected.typeLicence || "STANDARD",
      statut: selected.statut || "ACTIVE",
      dateDebut: selected.dateDebut ? selected.dateDebut.split('T')[0] : "",
      dateFin: selected.dateFin ? selected.dateFin.split('T')[0] : "",
      nombreUtilisateursMax: selected.nombreUtilisateursMax || "",
      entrepriseId: selected.entrepriseId || ""
    });
  }, [selected]);

  async function save() {
    setSaving(true);
    try {
      const dataToSend = {
        ...form,
        nombreUtilisateursMax: form.nombreUtilisateursMax ? parseInt(form.nombreUtilisateursMax) : null,
        entrepriseId: form.entrepriseId || null
      };

      if (selected?.id) await licencesApi.update(selected.id, dataToSend);
      else await licencesApi.create(dataToSend);

      setSelected(null);
      setShowForm(false);
      setForm({
        nom: "",
        description: "",
        typeLicence: "STANDARD",
        statut: "ACTIVE",
        dateDebut: "",
        dateFin: "",
        nombreUtilisateursMax: "",
        entrepriseId: ""
      });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await licencesApi.remove(toDelete.id);
      setToDelete(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handleAssign(licence) {
    if (!licence.entrepriseId) return;
    try {
      await licencesApi.assignToEntreprise(licence.id, licence.entrepriseId);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function handleRevoke(licence) {
    try {
      await licencesApi.revokeFromEntreprise(licence.id);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'STANDARD': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ENTERPRISE': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Gestion des licences"
            actions={
              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  setSelected(null);
                  setShowForm(true);
                  setForm({
                    nom: "",
                    description: "",
                    typeLicence: "STANDARD",
                    statut: "ACTIVE",
                    dateDebut: "",
                    dateFin: "",
                    nombreUtilisateursMax: "",
                    entrepriseId: ""
                  });
                }}
              >
                <PlusIcon className="h-5 w-5" />
                Nouvelle licence
              </Button>
            }
          />
          <CardBody>
            {error && <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>}

            {showForm && (
              <Card className="mb-6">
                <CardHeader
                  title={selected ? "Modifier la licence" : "Nouvelle licence"}
                  actions={
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      <XMarkIcon className="h-5 w-5" />
                    </Button>
                  }
                />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nom"
                      value={form.nom}
                      onChange={(e) => update("nom", e.target.value)}
                      required
                    />
                    <Input
                      label="Description"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                    <Select
                      label="Type de licence"
                      value={form.typeLicence}
                      onChange={(e) => update("typeLicence", e.target.value)}
                    >
                      <option value="STANDARD">Standard</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="ENTERPRISE">Entreprise</option>
                    </Select>
                    <Select
                      label="Statut"
                      value={form.statut}
                      onChange={(e) => update("statut", e.target.value)}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspendue</option>
                      <option value="EXPIRED">Expirée</option>
                    </Select>
                    <Input
                      label="Date de début"
                      type="date"
                      value={form.dateDebut}
                      onChange={(e) => update("dateDebut", e.target.value)}
                    />
                    <Input
                      label="Date de fin"
                      type="date"
                      value={form.dateFin}
                      onChange={(e) => update("dateFin", e.target.value)}
                    />
                    <Input
                      label="Nombre max d'utilisateurs"
                      type="number"
                      value={form.nombreUtilisateursMax}
                      onChange={(e) => update("nombreUtilisateursMax", e.target.value)}
                    />
                    <Select
                      label="Entreprise assignée"
                      value={form.entrepriseId}
                      onChange={(e) => update("entrepriseId", e.target.value)}
                    >
                      <option value="">Aucune entreprise</option>
                      {entreprises.map((ent) => (
                        <option key={ent.id} value={ent.id}>{ent.nom}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                    <Button onClick={save} disabled={saving}>
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
              <Table
                head={[
                  "Nom",
                  "Type",
                  "Statut",
                  "Entreprise",
                  "Utilisateurs max",
                  "Date début",
                  "Date fin",
                  "Actions",
                ]}
                rows={rows}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                      <div>
                        <div>{row.nom}</div>
                        {row.description && <div className="text-xs text-gray-500">{row.description}</div>}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(row.typeLicence)}`}>
                        {row.typeLicence}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(row.statut)}`}>
                        {row.statut}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.entreprise ? row.entreprise.nom : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      {row.nombreUtilisateursMax || '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.dateDebut ? new Date(row.dateDebut).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.dateFin ? new Date(row.dateFin).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-2 py-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" onClick={() => { setSelected(row); setShowForm(true); }} className="text-xs px-2 py-1">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        {row.entrepriseId ? (
                          <Button variant="outline" onClick={() => handleRevoke(row)} className="text-xs px-2 py-1" title="Révoquer de l'entreprise">
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={() => handleAssign(row)} className="text-xs px-2 py-1" title="Assigner à l'entreprise" disabled={!row.entrepriseId}>
                            <UserGroupIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="danger" onClick={() => setToDelete(row)} className="text-xs px-2 py-1">
                          <TrashIcon className="h-4 w-4" />
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

        <ConfirmDialog
          open={!!toDelete}
          title="Supprimer la licence"
          message={`Confirmer la suppression de la licence "${toDelete?.nom || ''}" ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </main>
  );
}
