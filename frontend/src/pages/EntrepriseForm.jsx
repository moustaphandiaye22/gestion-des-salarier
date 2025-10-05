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

function validateAdminNom(value) {
  if (!value) return null; // optional for admin user
  if (value.length < 1) return "Le nom de l'admin est requis.";
  return null;
}

function validateAdminEmail(value) {
  if (!value) return null; // optional for admin user
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "L'email de l'admin doit être une adresse valide.";
  return null;
}

function validateAdminMotDePasse(value) {
  if (!value) return null; // optional for admin user
  if (value.length < 6) return "Le mot de passe de l'admin doit contenir au moins 6 caractères.";
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
    logo: null,
    // Admin user fields
    adminNom: "",
    adminPrenom: "",
    adminEmail: "",
    adminMotDePasse: "",
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
      case 'adminNom':
        error = validateAdminNom(v);
        break;
      case 'adminEmail':
        error = validateAdminEmail(v);
        break;
      case 'adminMotDePasse':
        error = validateAdminMotDePasse(v);
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
      adminNom: validateAdminNom(form.adminNom),
      adminEmail: validateAdminEmail(form.adminEmail),
      adminMotDePasse: validateAdminMotDePasse(form.adminMotDePasse),
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
      const payload = new FormData();
      payload.append('nom', form.nom);
      payload.append('adresse', form.adresse || '');
      payload.append('email', form.email || '');
      payload.append('telephone', form.telephone || '');
      payload.append('siteWeb', form.siteWeb || '');
      payload.append('secteurActivite', form.secteurActivite || '');
      payload.append('estActive', form.estActive.toString());

      // Add logo file if provided
      if (form.logo) {
        payload.append('logo', form.logo);
      }

      // Add admin user data if provided
      if (form.adminNom && form.adminEmail && form.adminMotDePasse) {
        const adminUser = {
          nom: form.adminNom,
          prenom: form.adminPrenom || undefined,
          email: form.adminEmail,
          motDePasse: form.adminMotDePasse,
        };
        payload.append('adminUser', JSON.stringify(adminUser));
      }

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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo de l'entreprise
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => update("logo", e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Formats acceptés: JPG, PNG, GIF. Taille maximale: 5MB
                </p>
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

              {/* Admin User Section */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Administrateur de l'entreprise (optionnel)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Nom de l'admin"
                      value={form.adminNom}
                      onChange={(e) => update("adminNom", e.target.value)}
                      error={errors.adminNom}
                    />
                  </div>
                  <div>
                    <Input
                      label="Prénom de l'admin"
                      value={form.adminPrenom}
                      onChange={(e) => update("adminPrenom", e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      label="Email de l'admin"
                      type="email"
                      value={form.adminEmail}
                      onChange={(e) => update("adminEmail", e.target.value)}
                      error={errors.adminEmail}
                    />
                  </div>
                  <div>
                  <Input
                      label="Mot de passe de l'admin"
                      type="password"
                      autoComplete="new-password"
                      value={form.adminMotDePasse}
                      onChange={(e) => update("adminMotDePasse", e.target.value)}
                      error={errors.adminMotDePasse}
                    />
                  </div>
                </div>
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
