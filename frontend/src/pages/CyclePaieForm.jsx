import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Input, Select, Button } from "../components/ui";
import { cyclesPaieApi, entreprisesApi, handleApiError, formatValidationErrors } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Validation functions
function validateNom(value) {
  if (!value || value.length < 2) return "Le nom doit contenir au moins 2 caractères.";
  if (value.length > 100) return "Le nom ne doit pas dépasser 100 caractères.";
  return null;
}

function validateDescription(value) {
  if (!value) return null; // optional
  if (value.length > 1000) return "La description ne doit pas dépasser 1000 caractères.";
  return null;
}

function validateDates(dateDebut, dateFin) {
  if (!dateDebut || !dateFin) return "Les dates de début et fin sont requises.";
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  if (debut >= fin) return "La date de fin doit être postérieure à la date de début.";
  return null;
}

export default function CyclePaieForm() {
  const { showSuccess, showError } = useToast();
  const { selectedCompanyId } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nom: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    frequence: "MENSUEL",
    entrepriseId: selectedCompanyId || "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entreprises, setEntreprises] = useState([]);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));

    // Validate the field on change
    let error = null;
    switch (k) {
      case 'nom':
        error = validateNom(v);
        break;
      case 'description':
        error = validateDescription(v);
        break;
      case 'dateDebut':
      case 'dateFin':
        error = validateDates(k === 'dateDebut' ? v : form.dateDebut, k === 'dateFin' ? v : form.dateFin);
        break;
    }

    setErrors((prev) => ({ ...prev, [k]: error }));
  }

  // Load entreprises for the select
  useEffect(() => {
    entreprisesApi.list().then((data) => {
      setEntreprises(data || []);
    }).catch((err) => {
      console.error("Erreur lors du chargement des entreprises:", err);
    });
  }, []);

  // Load cycle data if editing
  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    cyclesPaieApi
      .get(id)
      .then((data) => {
        if (!mounted) return;
        setForm({
          nom: data.nom || "",
          description: data.description || "",
          dateDebut: data.dateDebut ? new Date(data.dateDebut).toISOString().split('T')[0] : "",
          dateFin: data.dateFin ? new Date(data.dateFin).toISOString().split('T')[0] : "",
          frequence: data.frequence || "MENSUEL",
          entrepriseId: data.entrepriseId || selectedCompanyId || "",
        });
      })
      .catch((err) => setError(err?.response?.data?.message || err.message));
    return () => (mounted = false);
  }, [id, isEdit, selectedCompanyId]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validate all fields before submitting
    const newErrors = {
      nom: validateNom(form.nom),
      description: validateDescription(form.description),
      dates: validateDates(form.dateDebut, form.dateFin),
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
        description: form.description || null,
        dateDebut: new Date(form.dateDebut).toISOString(),
        dateFin: new Date(form.dateFin).toISOString(),
        frequence: form.frequence,
        entrepriseId: parseInt(form.entrepriseId),
      };
      if (isEdit) await cyclesPaieApi.update(id, payload);
      else await cyclesPaieApi.create(payload);
      showSuccess("Succès", isEdit ? "Cycle de paie modifié avec succès" : "Cycle de paie créé avec succès");
      navigate("/cycles-paie");
    } catch (err) {
      // Use the enhanced error handler
      const apiError = handleApiError(err);
      const errorMessage = apiError.message;
      const detailedErrors = apiError.details || [];

      setError(errorMessage);

      // Show detailed errors if available
      if (detailedErrors.length > 0) {
        const detailsText = formatValidationErrors(detailedErrors);
        showError("Erreur de validation", `${errorMessage}\n\n${detailsText}`);
      } else {
        showError("Erreur d'enregistrement", errorMessage);
      }

      // Set field-specific errors if available
      if (detailedErrors.length > 0) {
        const fieldErrors = {};
        detailedErrors.forEach(err => {
          if (err.champ && err.message) {
            // Map field names to form fields with French translations
            const fieldMapping = {
              'nom': 'nom',
              'description': 'description',
              'dateDebut': 'dateDebut',
              'dateFin': 'dateFin',
              'frequence': 'frequence',
              'entrepriseId': 'entrepriseId'
            };
            const fieldName = fieldMapping[err.champ] || err.champ;
            fieldErrors[fieldName] = err.message;
          }
        });
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader title={isEdit ? "Modifier le cycle de paie" : "Nouveau cycle de paie"} />
          <CardBody>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
              <div className="md:col-span-2">
                <Input
                  label="Nom du cycle"
                  value={form.nom}
                  onChange={(e) => update("nom", e.target.value)}
                  error={errors.nom}
                  required
                  placeholder="Ex: Cycle de paie - Janvier 2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Description</span>
                  <textarea
                    className={`block w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 bg-white shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-vertical ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    rows={3}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Description optionnelle du cycle de paie"
                  />
                  {errors.description && (
                    <span className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.description}
                    </span>
                  )}
                </label>
              </div>

              <div>
                <Input
                  label="Date de début"
                  type="date"
                  value={form.dateDebut}
                  onChange={(e) => update("dateDebut", e.target.value)}
                  error={errors.dates}
                  required
                />
              </div>

              <div>
                <Input
                  label="Date de fin"
                  type="date"
                  value={form.dateFin}
                  onChange={(e) => update("dateFin", e.target.value)}
                  error={errors.dates}
                  required
                />
              </div>

              <div>
                <Select
                  label="Fréquence"
                  value={form.frequence}
                  onChange={(e) => update("frequence", e.target.value)}
                  required
                >
                  <option value="MENSUEL">Mensuelle</option>
                  <option value="HEBDOMADAIRE">Hebdomadaire</option>
                  <option value="QUINZAINE">Quinzaine</option>
                </Select>
              </div>

              <div>
                <Select
                  label="Entreprise"
                  value={form.entrepriseId}
                  onChange={(e) => update("entrepriseId", e.target.value)}
                  required
                  disabled={!!selectedCompanyId}
                >
                  <option value="">Sélectionner une entreprise</option>
                  {entreprises.map((entreprise) => (
                    <option key={entreprise.id} value={entreprise.id}>
                      {entreprise.nom}
                    </option>
                  ))}
                </Select>
              </div>

              {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

              <div className="flex justify-end gap-2 md:col-span-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
