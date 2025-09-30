import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Card, CardBody, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  Building2,
  Users,
  Shield,
  ArrowRight,
  CheckCircle
} from "lucide-react";

// Validation functions
function validateEmail(value) {
  if (!value) return "L'email est requis";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Format d'email invalide";
  return null;
}

function validatePassword(value) {
  if (!value) return "Le mot de passe est requis";
  if (value.length < 6) return "Le mot de passe doit contenir au moins 6 caractères";
  return null;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setErrors(prev => ({ ...prev, [field]: null }));
    if (field === 'email') setEmail(value);
    if (field === 'motDePasse') setMotDePasse(value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validation
    const emailError = validateEmail(email);
    const passwordError = validatePassword(motDePasse);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        motDePasse: passwordError
      });
      return;
    }

    setLoading(true);
    try {
      await login({ email, motDePasse });
      // Optionnel: remember influence la durée stockage, ici on garde simple
      navigate(redirectTo, { replace: true });
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
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Salariés</h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>

        <Card>
          <CardBody className="p-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => update("email", e.target.value)}
                    className={`block w-full rounded-md border px-3 py-2 pl-10 text-sm bg-gray-50 placeholder:text-gray-400 focus:bg-white ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900/20'
                    } focus:outline-none focus:ring-2`}
                    placeholder="vous@exemple.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={motDePasse}
                    onChange={(e) => update("motDePasse", e.target.value)}
                    className={`block w-full rounded-md border px-3 py-2 pl-10 pr-10 text-sm bg-gray-50 placeholder:text-gray-400 focus:bg-white ${
                      errors.motDePasse
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900/20'
                    } focus:outline-none focus:ring-2`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.motDePasse && (
                  <p className="mt-1 text-sm text-red-600">{errors.motDePasse}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">Se souvenir de moi</span>
                </label>
                <button type="button" className="text-sm text-gray-700 hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Pas de compte ?{" "}
              <Link className="text-gray-900 underline" to="/register">
                Créer un compte
              </Link>
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
