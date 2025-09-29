import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Input, Select, Button } from "../components/ui";
import { employesApi, entreprisesApi } from "../utils/api";

// Validation functions matching backend validators
function validateMatricule(value) {
  if (!value || value.length < 1) return "Le matricule est obligatoire.";
  if (value.length > 50) return "Le matricule ne doit pas dépasser 50 caractères.";
  return null;
}

function validatePrenom(value) {
  if (!value || value.length < 2) return "Le prénom doit contenir au moins 2 caractères.";
  if (value.length > 100) return "Le prénom ne doit pas dépasser 100 caractères.";
  return null;
}

function validateNom(value) {
  if (!value || value.length < 2) return "Le nom doit contenir au moins 2 caractères.";
  if (value.length > 100) return "Le nom ne doit pas dépasser 100 caractères.";
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

function validateAdresse(value) {
  if (!value) return null; // optional
  if (value.length > 255) return "L'adresse ne doit pas dépasser 255 caractères.";
  return null;
}

function validateDateEmbauche(value) {
  if (!value) return "La date d'embauche est obligatoire.";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Date invalide.";
  return null;
}

function validateSalaireBase(value) {
  if (!value) return "Le salaire de base est obligatoire.";
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return "Le salaire de base doit être positif ou nul.";
  return null;
}

function validateAllocations(value) {
  if (!value) return null; // optional
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return "Les allocations doivent être positives ou nulles.";
  return null;
}

function validateDeductions(value) {
  if (!value) return null; // optional
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return "Les déductions doivent être positives ou nulles.";
  return null;
}

function validateEntrepriseId(value) {
  if (!value) return "L'entreprise est obligatoire.";
  return null;
}

// Generate matricule based on company
function generateMatricule(entrepriseId, entreprises) {
  if (!entrepriseId || !entreprises.length) return "";
  const entreprise = entreprises.find(ent => ent.id === parseInt(entrepriseId));
  if (!entreprise) return "";

  // Use first 3 letters of company name + random 4-digit number
  const prefix = entreprise.nom.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    matricule: "",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    dateEmbauche: "",
    statutEmploi: "ACTIF",
    typeContrat: "CDI",
    salaireBase: "",
    allocations: "",
    deductions: "",
    estActif: true,
    entrepriseId: "",
  });
  const [generatedMatricule, setGeneratedMatricule] = useState("");
  const [errors, setErrors] = useState({});
  const [entreprises, setEntreprises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));

    // Generate matricule when entreprise changes
    if (k === 'entrepriseId' && v) {
      const matricule = generateMatricule(v, entreprises);
      setGeneratedMatricule(matricule);
      setForm((f) => ({ ...f, matricule }));
    }

    // Validate the field on change
    let error = null;
    switch (k) {
      case 'prenom':
        error = validatePrenom(v);
        break;
      case 'nom':
        error = validateNom(v);
        break;
      case 'email':
        error = validateEmail(v);
        break;
      case 'telephone':
        error = validateTelephone(v);
        break;
      case 'adresse':
        error = validateAdresse(v);
        break;
      case 'dateEmbauche':
        error = validateDateEmbauche(v);
        break;
      case 'salaireBase':
        error = validateSalaireBase(v);
        break;
      case 'allocations':
        error = validateAllocations(v);
        break;
      case 'deductions':
        error = validateDeductions(v);
        break;
      case 'entrepriseId':
        error = validateEntrepriseId(v);
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
    if (!isEdit) return;
    let mounted = true;
    employesApi
      .get(id)
      .then((data) => {
        if (!mounted) return;
        setForm({
          matricule: data.matricule || "",
          prenom: data.prenom || "",
          nom: data.nom || "",
          email: data.email || "",
          telephone: data.telephone || "",
          adresse: data.adresse || "",
          dateEmbauche: data.dateEmbauche ? new Date(data.dateEmbauche).toISOString().split('T')[0] : "",
          statutEmploi: data.statutEmploi || "ACTIF",
          typeContrat: data.typeContrat || "CDI",
          salaireBase: data.salaireBase || "",
          allocations: data.allocations || "",
          deductions: data.deductions || "",
          estActif: data.estActif ?? true,
          entrepriseId: data.entrepriseId || "",
        });
        // Generate matricule for edit mode as well
        const genMatricule = generateMatricule(data.entrepriseId, entreprises);
        setGeneratedMatricule(genMatricule);
      })
      .catch((err) => setError(err?.response?.data?.message || err.message));
    return () => (mounted = false);
  }, [id, isEdit, entreprises]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validate all fields before submitting
    const newErrors = {
      prenom: validatePrenom(form.prenom),
      nom: validateNom(form.nom),
      email: validateEmail(form.email),
      telephone: validateTelephone(form.telephone),
      adresse: validateAdresse(form.adresse),
      dateEmbauche: validateDateEmbauche(form.dateEmbauche),
      salaireBase: validateSalaireBase(form.salaireBase),
      allocations: validateAllocations(form.allocations),
      deductions: validateDeductions(form.deductions),
      entrepriseId: validateEntrepriseId(form.entrepriseId),
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
        matricule: form.matricule,
        prenom: form.prenom,
        nom: form.nom,
        email: form.email || undefined,
        telephone: form.telephone || undefined,
        adresse: form.adresse || undefined,
        dateEmbauche: new Date(form.dateEmbauche),
        statutEmploi: form.statutEmploi,
        typeContrat: form.typeContrat,
        salaireBase: parseFloat(form.salaireBase),
        allocations: form.allocations ? parseFloat(form.allocations) : undefined,
        deductions: form.deductions ? parseFloat(form.deductions) : undefined,
        estActif: form.estActif,
        entrepriseId: parseInt(form.entrepriseId),
      };
      if (isEdit) await employesApi.update(id, payload);
      else await employesApi.create(payload);
      navigate("/employees");
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
          <CardHeader title={isEdit ? "Modifier l'employé" : "Nouvel employé"} />
          <CardBody>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Matricule</label>
                <input
                  type="text"
                  value={generatedMatricule}
                  readOnly
                  className="w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700 cursor-not-allowed"
                />
              </div>
              <div>
                <Input
                  label="Prénom"
                  value={form.prenom}
                  onChange={(e) => update("prenom", e.target.value)}
                  error={errors.prenom}
                  
                />
              </div>
              <div>
                <Input
                  label="Nom"
                  value={form.nom}
                  onChange={(e) => update("nom", e.target.value)}
                  error={errors.nom}
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
                  label="Adresse"
                  value={form.adresse}
                  onChange={(e) => update("adresse", e.target.value)}
                  error={errors.adresse}
                />
              </div>
              <div>
                <Input
                  label="Date d'embauche"
                  type="date"
                  value={form.dateEmbauche}
                  onChange={(e) => update("dateEmbauche", e.target.value)}
                  error={errors.dateEmbauche}
                />
              </div>
              <Select label="Statut d'emploi" value={form.statutEmploi} onChange={(e) => update("statutEmploi", e.target.value)} required>
                <option value="ACTIF">Actif</option>
                <option value="CONGE">Congé</option>
                <option value="LICENCIE">Licencié</option>
                <option value="RETRAITE">Retraite</option>
              </Select>
              <Select label="Type de contrat" value={form.typeContrat} onChange={(e) => update("typeContrat", e.target.value)} required>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERIM">Intérim</option>
                <option value="STAGE">Stage</option>
              </Select>
              <div>
                <Input
                  label="Salaire de base"
                  type="number"
                  step="0.01"
                  value={form.salaireBase}
                  onChange={(e) => update("salaireBase", e.target.value)}
                  error={errors.salaireBase}
                />
              </div>
              <div>
                <Input
                  label="Allocations"
                  type="number"
                  step="0.01"
                  value={form.allocations}
                  onChange={(e) => update("allocations", e.target.value)}
                  error={errors.allocations}
                />
              </div>
              <div>
                <Input
                  label="Déductions"
                  type="number"
                  step="0.01"
                  value={form.deductions}
                  onChange={(e) => update("deductions", e.target.value)}
                  error={errors.deductions}
                />
              </div>
              <Select label="Entreprise" value={form.entrepriseId} onChange={(e) => update("entrepriseId", e.target.value)} error={errors.entrepriseId} >
                <option value="">Sélectionner une entreprise</option>
                {entreprises.map((ent) => (
                  <option key={ent.id} value={ent.id}>{ent.nom}</option>
                ))}
              </Select>
              <div className="flex items-center gap-2 mt-4 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.estActif}
                  onChange={(e) => update("estActif", e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  id="estActif"
                />
                <label htmlFor="estActif" className="text-sm text-gray-700">Actif</label>
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
