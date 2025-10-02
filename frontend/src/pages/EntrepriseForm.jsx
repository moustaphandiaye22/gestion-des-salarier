import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Input, Select, Button } from "../components/ui";
import { entreprisesApi } from "../utils/api";
import { useToast } from "../context/ToastContext";

// Validation functions matching backend validators
function validateNom(value) {
  if (!value || value.length < 2) return "Le nom doit contenir au moins 2 caractères.";
  if (value.length > 100) return "Le nom ne doit pas dépasser 100 caractères.";
  return null;
}

function validateAdresse(value) {
  if (!value) return null; // optional
  if (value.length > 255) return "L'adresse ne doit pas dépasser 255 caractères.";
  return null;
}

function validateEmail(value) {
  if (!value) return null; // optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "L'email doit être une adresse valide.";
  if (value.length > 100) return "L'email ne doit pas dépasser 100 caractères.";
  return null;
}

function validateTelephone(value) {
  if (!value) return null; // optional
  if (value.length > 20) return "Le numéro de téléphone ne doit pas dépasser 20 caractères.";
  return null;
}

function validateSiteWeb(value) {
  if (!value) return null; // optional
  try {
    new URL(value);
  } catch {
    return "L'URL du site web doit être valide.";
  }
  if (value.length > 255) return "L'URL du site web ne doit pas dépasser 255 caractères.";
  return null;
}

function validateSecteurActivite(value) {
  if (!value) return null; // optional
  if (value.length > 100) return "Le secteur d'activité ne doit pas dépasser 100 caractères.";
  return null;
}

export default function EntrepriseForm() {
  const { showSuccess, showError } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nom: "",
    adresse: "",
    email: "",
    telephone: "",
    siteWeb: "",
    secteurActivite: "",
    estActive: true,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));

    // Validate the field on change
    let error = null;
    switch (k) {
      case 'nom':
        error = validateNom(v);
        break;
      case 'adresse':
        error = validateAdresse(v);
        break;
      case 'email':
        error = validateEmail(v);
        break;
      case 'telephone':
        error = validateTelephone(v);
        break;
      case 'siteWeb':
        error = validateSiteWeb(v);
        break;
      case 'secteurActivite':
        error = validateSecteurActivite(v);
        break;
    }

    setErrors((prev) => ({ ...prev, [k]: error }));
  }

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    entreprisesApi
      .get(id)
      .then((data) => {
        if (!mounted) return;
        setForm({
          nom: data.nom || "",
          adresse: data.adresse || "",
          email: data.email || "",
          telephone: data.telephone || "",
          siteWeb: data.siteWeb || "",
          secteurActivite: data.secteurActivite || "",
          estActive: data.estActive ?? true,
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
      nom: validateNom(form.nom),
      adresse: validateAdresse(form.adresse),
      email: validateEmail(form.email),
      telephone: validateTelephone(form.telephone),
      siteWeb: validateSiteWeb(form.siteWeb),
      secteurActivite: validateSecteurActivite(form.secteurActivite),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== null);
    if (hasErrors) {
      setError("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nom: form.nom,
        adresse: form.adresse || null,
        email: form.email || null,
        telephone: form.telephone || null,
        siteWeb: form.siteWeb || null,
        secteurActivite: form.secteurActivite || null,
        estActive: form.estActive,
      };
      if (isEdit) await entreprisesApi.update(id, payload);
      else await entreprisesApi.create(payload);
      showSuccess("Succès", isEdit ? "Entreprise modifiée avec succès" : "Entreprise créée avec succès");
      navigate("/entreprises");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      showError("Erreur d'enregistrement", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader title={isEdit ? "Modifier l'entreprise" : "Nouvelle entreprise"} />
          <CardBody>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
              <div className="md:col-span-2">
                <Input
                  label="Nom de l'entreprise"
                  value={form.nom}
                  onChange={(e) => update("nom", e.target.value)}
                  error={errors.nom}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Adresse"
                  value={form.adresse}
                  onChange={(e) => update("adresse", e.target.value)}
                  error={errors.adresse}
                />
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  error={errors.email}
                />
              </div>
              <div>
                <Input
                  label="Téléphone"
                  value={form.telephone}
                  onChange={(e) => update("telephone", e.target.value)}
                  error={errors.telephone}
                />
              </div>
              <div>
                <Input
                  label="Site Web"
                  type="url"
                  value={form.siteWeb}
                  onChange={(e) => update("siteWeb", e.target.value)}
                  error={errors.siteWeb}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Input
                  label="Secteur d'activité"
                  value={form.secteurActivite}
                  onChange={(e) => update("secteurActivite", e.target.value)}
                  error={errors.secteurActivite}
                />
              </div>
              <div className="flex items-center gap-2 mt-4 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.estActive}
                  onChange={(e) => update("estActive", e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  id="estActive"
                />
                <label htmlFor="estActive" className="text-sm text-gray-700">Entreprise active</label>
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
