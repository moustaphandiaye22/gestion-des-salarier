import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Input, Select, Button } from "../components/ui";
import { parametresGlobauxApi, entreprisesApi } from "../utils/api";
import { PencilIcon, PlusIcon, ShieldCheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function ParametreEntreprise() {
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [currentEntreprise, setCurrentEntreprise] = useState(null);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ cle: "", valeur: "", description: "", categorie: "GENERAL" });
  const [saving, setSaving] = useState(false);
  const [togglingAccess, setTogglingAccess] = useState(false);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function load() {
    setError(null);
    parametresGlobauxApi
      .list()
      .then((data) => setList(Array.isArray(data) ? data : data?.parametres || []))
      .catch((err) => {
        const errorMessage = err?.response?.data?.message || err.message;
        setError(errorMessage);
        showError("Erreur de chargement", errorMessage);
      });
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    entreprisesApi
      .list()
      .then((data) => setEntreprises(Array.isArray(data) ? data : []))
      .catch(() => setEntreprises([]));
  }, []);

  // Load current entreprise details for admin entreprise
  useEffect(() => {
    if (user?.role === 'ADMIN_ENTREPRISE' && user?.entrepriseId) {
      entreprisesApi.get(user.entrepriseId)
        .then((data) => setCurrentEntreprise(data))
        .catch((err) => console.error('Erreur chargement entreprise:', err));
    }
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    setForm({ cle: selected.cle || "", valeur: selected.valeur || "", description: selected.description || "", categorie: selected.categorie || "GENERAL" });
  }, [selected]);

  async function save() {
    setSaving(true);
    try {
      if (selected?.id) await parametresGlobauxApi.update(selected.id, form);
      else await parametresGlobauxApi.create(form);
      setSelected(null);
      setForm({ cle: "", valeur: "", description: "", categorie: "GENERAL" });
      load();
      showSuccess("Succès", selected?.id ? "Paramètre modifié avec succès" : "Paramètre créé avec succès");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur d'enregistrement", errorMessage);
    } finally {
      setSaving(false);
    }
  }

  async function toggleSuperAdminAccess() {
    if (!currentEntreprise) return;

    setTogglingAccess(true);
    try {
      const updatedData = {
        superAdminAccessGranted: !currentEntreprise.superAdminAccessGranted
      };
      await entreprisesApi.update(currentEntreprise.id, updatedData);
      setCurrentEntreprise({ ...currentEntreprise, ...updatedData });
      showSuccess("Succès", `Accès super admin ${updatedData.superAdminAccessGranted ? 'autorisé' : 'refusé'} pour votre entreprise`);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur de mise à jour", errorMessage);
    } finally {
      setTogglingAccess(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Accès Super Admin - visible seulement pour les admins d'entreprise */}
        {user?.role === 'ADMIN_ENTREPRISE' && currentEntreprise && (
          <Card className="mb-6">
            <CardHeader title="Contrôle d'accès Super Admin" />
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Accès Super Admin</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    En activant cette option, vous autorisez les super administrateurs à accéder et gérer toutes les données de votre entreprise.
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      currentEntreprise.superAdminAccessGranted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentEntreprise.superAdminAccessGranted ? 'Accès autorisé' : 'Accès refusé'}
                    </span>
                  </div>
                </div>
                <Button
                  variant={currentEntreprise.superAdminAccessGranted ? "danger" : "success"}
                  onClick={toggleSuperAdminAccess}
                  disabled={togglingAccess}
                  className="flex items-center gap-2"
                >
                  {togglingAccess ? (
                    "Modification..."
                  ) : currentEntreprise.superAdminAccessGranted ? (
                    <>
                      <XMarkIcon className="h-5 w-5" />
                      Refuser l'accès
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-5 w-5" />
                      Autoriser l'accès
                    </>
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Paramètres d'entreprise"
              actions={
                <Button className="flex items-center gap-2" onClick={() => { setSelected(null); setForm({ cle: "", valeur: "", type: "STRING", entrepriseId: "" }); }}>
                  <PlusIcon className="h-5 w-5" />
                  Ajouter
                </Button>
              }
            />
            <CardBody>
              {error && <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>}
              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {list.map((it) => (
                    <li key={it.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{it.cle}</p>
                        <p className="text-sm text-gray-700">{it.valeur}</p>
                      </div>
                      <Button variant="outline" onClick={() => setSelected(it)} className="flex items-center gap-1">
                        <PencilIcon className="h-4 w-4" />
                        Modifier
                      </Button>
                    </li>
                  ))}
                  {!list.length && <li className="py-3 text-sm text-gray-600">Aucun paramètre</li>}
                </ul>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={selected ? "Modifier" : "Nouveau"} />
            <CardBody>
              <div className="space-y-3">
                <Input label="Clé" value={form.cle} onChange={(e) => update("cle", e.target.value)} />
                <Input label="Valeur" value={form.valeur} onChange={(e) => update("valeur", e.target.value)} />
                <Select label="Type" value={form.type} onChange={(e) => update("type", e.target.value)}>
                  <option value="STRING">String</option>
                  <option value="NUMBER">Number</option>
                  <option value="BOOLEAN">Boolean</option>
                </Select>
                <Select label="Entreprise" value={form.entrepriseId} onChange={(e) => update("entrepriseId", e.target.value)}>
                  <option value="">Sélectionner une entreprise</option>
                  {entreprises.map((ent) => (
                    <option key={ent.id} value={ent.id}>{ent.nom}</option>
                  ))}
                </Select>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setSelected(null); setForm({ cle: "", valeur: "", type: "STRING", entrepriseId: "" }); }}>Annuler</Button>
                  <Button onClick={save} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
