import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Input, Select, Button } from "../components/ui";
import { parametresGlobauxApi } from "../utils/api";
import { useToast } from "../context/ToastContext";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function ParametresGlobaux() {
  const { showSuccess, showError } = useToast();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ cle: "", valeur: "", description: "", categorie: "" });
  const [saving, setSaving] = useState(false);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function load() {
    setError(null);
    parametresGlobauxApi
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
    if (!selected) return;
    setForm({
      cle: selected.cle || "",
      valeur: selected.valeur || "",
      description: selected.description || "",
      categorie: selected.categorie || ""
    });
  }, [selected]);

  async function save() {
    setSaving(true);
    try {
      if (selected?.id) await parametresGlobauxApi.update(selected.id, form);
      else await parametresGlobauxApi.create(form);
      setSelected(null);
      setForm({ cle: "", valeur: "", description: "", categorie: "" });
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
              title="Paramètres globaux"
              actions={
                <Button className="flex items-center gap-2" onClick={() => { setSelected(null); setForm({ cle: "", valeur: "", description: "", categorie: "" }); }}>
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
                        {it.description && <p className="text-xs text-gray-500">{it.description}</p>}
                        {it.categorie && <p className="text-xs text-blue-600">Catégorie: {it.categorie}</p>}
                      </div>
                      <Button variant="outline" onClick={() => setSelected(it)} className="flex items-center gap-1">
                        <PencilIcon className="h-4 w-4" />
                        Modifier
                      </Button>
                    </li>
                  ))}
                  {!list.length && <li className="py-3 text-sm text-gray-600">Aucun paramètre global</li>}
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
                <Input label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
                <Input label="Catégorie" value={form.categorie} onChange={(e) => update("categorie", e.target.value)} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setSelected(null); setForm({ cle: "", valeur: "", description: "", categorie: "" }); }}>Annuler</Button>
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
