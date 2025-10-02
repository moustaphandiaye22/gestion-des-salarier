import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Input, Select, Button } from "../components/ui";
import { parametreEntrepriseApi, entreprisesApi } from "../utils/api";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useToast } from "../context/ToastContext";

export default function ParametreEntreprise() {
  const { showSuccess, showError } = useToast();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [entreprises, setEntreprises] = useState([]);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ cle: "", valeur: "", type: "STRING", entrepriseId: "" });
  const [saving, setSaving] = useState(false);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function load() {
    setError(null);
    parametreEntrepriseApi
      .list()
      .then((data) => setList(Array.isArray(data) ? data : data?.items || []))
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

  useEffect(() => {
    if (!selected) return;
    setForm({ cle: selected.cle || "", valeur: selected.valeur || "", type: selected.type || "STRING", entrepriseId: selected.entrepriseId || "" });
  }, [selected]);

  async function save() {
    setSaving(true);
    try {
      if (selected?.id) await parametreEntrepriseApi.update(selected.id, form);
      else await parametreEntrepriseApi.create(form);
      setSelected(null);
      setForm({ cle: "", valeur: "", type: "STRING", entrepriseId: "" });
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

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
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
