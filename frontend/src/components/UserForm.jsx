import React, { useState, useEffect } from "react";
import { Button, Input, Select, Modal } from "../components/ui";
import { utilisateursApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function UserForm({ isOpen, onClose, onSuccess, user = null }) {
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    role: "EMPLOYE",
    estActif: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUser?.role === 'SUPER_ADMIN') {
      return [
        { value: 'SUPER_ADMIN', label: 'Super Admin' },
        { value: 'ADMIN_ENTREPRISE', label: 'Admin Entreprise' },
        { value: 'CAISSIER', label: 'Caissier' },
        { value: 'EMPLOYE', label: 'Employé' }
      ];
    } else if (currentUser?.role === 'ADMIN_ENTREPRISE') {
      return [
        { value: 'CAISSIER', label: 'Caissier' },
        { value: 'EMPLOYE', label: 'Employé' }
      ];
    }
    return [];
  };

  const availableRoles = getAvailableRoles();

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        email: user.email || "",
        motDePasse: "", // Don't populate password for editing
        role: user.role || "EMPLOYE",
        estActif: user.estActif !== undefined ? user.estActif : true
      });
    } else {
      setFormData({
        nom: "",
        email: "",
        motDePasse: "",
        role: "EMPLOYE",
        estActif: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!user && !formData.motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis";
    } else if (!user && formData.motDePasse && formData.motDePasse.length < 6) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = { ...formData };

      // Remove password if empty (for updates)
      if (!submitData.motDePasse) {
        delete submitData.motDePasse;
      }

      if (user) {
        await utilisateursApi.update(user.id, submitData);
        showSuccess("Succès", "Utilisateur mis à jour avec succès");
      } else {
        await utilisateursApi.create(submitData);
        showSuccess("Succès", "Utilisateur créé avec succès");
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      showError("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <Input
            type="text"
            value={formData.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            placeholder="Entrez le nom"
            error={errors.nom}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Entrez l'email"
            error={errors.email}
          />
        </div>

        {!user && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe *
            </label>
            <Input
              type="password"
              value={formData.motDePasse}
              onChange={(e) => handleChange('motDePasse', e.target.value)}
              placeholder="Entrez le mot de passe"
              error={errors.motDePasse}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rôle *
          </label>
          <Select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            error={errors.role}
          >
            {availableRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <Select
            value={formData.estActif ? "true" : "false"}
            onChange={(e) => handleChange('estActif', e.target.value === "true")}
          >
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : (user ? "Modifier" : "Créer")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
