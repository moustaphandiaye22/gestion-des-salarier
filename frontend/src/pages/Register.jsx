import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, CardBody } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { entreprisesApi } from "../utils/api";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    confirmationMotDePasse: "",
    role: "EMPLOYE",
    estActif: true,
    entrepriseId: "",
  });
  const [entreprises, setEntreprises] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    entreprisesApi
      .list()
      .then((data) => setEntreprises(Array.isArray(data) ? data : []))
      .catch(() => setEntreprises([]));
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.nom || !form.email || !form.motDePasse || !form.role) {
      setError("Veuillez renseigner les champs requis.");
      return;
    }
    if (form.motDePasse.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (form.motDePasse !== form.confirmationMotDePasse) {
      setError("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nom: form.nom,
        email: form.email,
        motDePasse: form.motDePasse,
        role: form.role,
        estActif: !!form.estActif,
        entrepriseId: form.entrepriseId ? Number(form.entrepriseId) : undefined,
      };
      await register(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4">
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Salariés</h1>
          <p className="text-gray-600">Créer un compte</p>
        </div>

        <Card>
          <CardBody className="p-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={form.nom}
                    onChange={(e) => update("nom", e.target.value)}
                    required
                    autoComplete="family-name"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.motDePasse}
                      onChange={(e) => update("motDePasse", e.target.value)}
                      required
                      autoComplete="new-password"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 pr-10 text-sm bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword2 ? "text" : "password"}
                      value={form.confirmationMotDePasse}
                      onChange={(e) => update("confirmationMotDePasse", e.target.value)}
                      required
                      autoComplete="new-password"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 pr-10 text-sm bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={showPassword2 ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword2 ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                  >
                    <option value="SUPER_ADMIN">Super admin</option>
                    <option value="ADMIN_ENTREPRISE">Admin entreprise</option>
                    <option value="CAISSIER">Caissier</option>
                    <option value="EMPLOYE">Employé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise (optionnel)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={form.entrepriseId}
                    onChange={(e) => update("entrepriseId", e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
                  >
                    <option value="">Aucune</option>
                    {entreprises.map((ent) => (
                      <option key={ent.id} value={ent.id}>{ent.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.estActif}
                  onChange={(e) => update("estActif", e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">Activer ce compte</span>
              </label>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Création..." : "Créer le compte"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Déjà inscrit ?{" "}
              <Link className="text-gray-900 underline" to="/login">Se connecter</Link>
            </p>
          </CardBody>
        </Card>

        <p className="mt-6 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Gestion des Salariés
        </p>
      </div>
    </main>
  );
}
