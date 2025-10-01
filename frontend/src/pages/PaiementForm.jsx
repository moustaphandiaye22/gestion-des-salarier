import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Input, Select, Button } from "../components/ui";
import { paiementsApi, bulletinsApi, entreprisesApi } from "../utils/api";

export default function PaiementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    montant: "",
    datePaiement: "",
    modePaiement: "ESPECES",
    statut: "EN_ATTENTE",
    reference: "",
    bulletinId: "",
    entrepriseId: "",
  });
  const [errors, setErrors] = useState({});
  const [bulletins, setBulletins] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));

    // Validate fields on change
    let error = null;
    switch (k) {
      case "montant":
        if (!v || isNaN(parseFloat(v)) || parseFloat(v) <= 0) {
          error = "Le montant doit être un nombre positif.";
        }
        break;
      case "datePaiement":
        if (!v) {
          error = "La date de paiement est obligatoire.";
        }
        break;
      case "bulletinId":
        if (!v) {
          error = "Le bulletin est obligatoire.";
        }
        break;
      case "entrepriseId":
        if (!v) {
          error = "L'entreprise est obligatoire.";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [k]: error }));
  }

  useEffect(() => {
    entreprisesApi
      .list()
      .then((data) => setEntreprises(Array.isArray(data) ? data : []))
      .catch(() => setEntreprises([]));
  }, []);

  useEffect(() => {
    if (form.entrepriseId) {
      bulletinsApi
        .listByEntreprise(form.entrepriseId)
        .then((data) => setBulletins(Array.isArray(data) ? data : []))
        .catch(() => setBulletins([]));
    } else {
      setBulletins([]);
    }
  }, [form.entrepriseId]);

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    paiementsApi
      .get(id)
      .then((data) => {
        if (!mounted) return;
        setForm({
          montant: data.montant || "",
          datePaiement: data.datePaiement ? new Date(data.datePaiement).toISOString().split("T")[0] : "",
          modePaiement: data.modePaiement || "ESPECES",
          statut: data.statut || "EN_ATTENTE",
          reference: data.reference || "",
          bulletinId: data.bulletinId || "",
          entrepriseId: data.entrepriseId || "",
        });
      })
      .catch((err) => setError(err?.response?.data?.message || err.message));
    return () => (mounted = false);
  }, [id, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validate all fields before submitting
    const newErrors = {
      montant: !form.montant || isNaN(parseFloat(form.montant)) || parseFloat(form.montant) <= 0 ? "Le montant doit être un nombre positif." : null,
      datePaiement: !form.datePaiement ? "La date de paiement est obligatoire." : null,
      bulletinId: !form.bulletinId ? "Le bulletin est obligatoire." : null,
      entrepriseId: !form.entrepriseId ? "L'entreprise est obligatoire." : null,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (hasErrors) {
      setError("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        montant: parseFloat(form.montant),
        datePaiement: new Date(form.datePaiement + "T00:00:00.000Z"),
        modePaiement: form.modePaiement,
        statut: form.statut,
        reference: form.reference || null,
        bulletinId: parseInt(form.bulletinId),
        entrepriseId: parseInt(form.entrepriseId),
      };
      if (isEdit) await paiementsApi.update(id, payload);
      else await paiementsApi.create(payload);
      navigate("/paiements");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader title={isEdit ? "Modifier le paiement" : "Nouveau paiement"} />
          <CardBody>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Montant</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.montant}
                  onChange={(e) => update("montant", e.target.value)}
                  error={errors.montant}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date de paiement</label>
                <Input
                  type="date"
                  value={form.datePaiement}
                  onChange={(e) => update("datePaiement", e.target.value)}
                  error={errors.datePaiement}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Mode de paiement</label>
                <Select value={form.modePaiement} onChange={(e) => update("modePaiement", e.target.value)}>
                  <option value="ESPECES">Espèces</option>
                  <option value="CHEQUE">Chèque</option>
                  <option value="VIREMENT">Virement</option>
                  <option value="WAVE">Wave</option>
                  <option value="ORANGE_MONEY">Orange Money</option>
                </Select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Statut</label>
                <Select value={form.statut} onChange={(e) => update("statut", e.target.value)}>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="PAYE">Payé</option>
                  <option value="ECHEC">Échec</option>
                </Select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Référence</label>
                <Input
                  value={form.reference}
                  onChange={(e) => update("reference", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Entreprise</label>
                <Select value={form.entrepriseId} onChange={(e) => update("entrepriseId", e.target.value)} error={errors.entrepriseId}>
                  <option value="">Sélectionner une entreprise</option>
                  {entreprises.map((ent) => (
                    <option key={ent.id} value={ent.id}>{ent.nom}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Bulletin</label>
                <Select value={form.bulletinId} onChange={(e) => update("bulletinId", e.target.value)} error={errors.bulletinId}>
                  <option value="">Sélectionner un bulletin</option>
                  {bulletins.map((bulletin) => (
                    <option key={bulletin.id} value={bulletin.id}>{bulletin.numeroBulletin}</option>
                  ))}
                </Select>
              </div>
              {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
              <div className="flex justify-end gap-2 md:col-span-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
                <Button type="submit" disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
