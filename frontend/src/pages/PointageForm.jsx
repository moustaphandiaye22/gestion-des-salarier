import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Button, Input, Select, Textarea } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { pointagesApi } from "../utils/api";
import { ArrowLeftIcon, ClockIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";

export default function PointageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCompanyId } = useAuth();
  const { showSuccess, showError } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    datePointage: new Date().toISOString().split('T')[0],
    heureEntree: '',
    heureSortie: '',
    dureeTravail: '',
    typePointage: 'PRESENCE',
    statut: 'PRESENT',
    lieu: '',
    commentaire: '',
    employeId: '',
    entrepriseId: selectedCompanyId || ''
  });

  const [employes, setEmployes] = useState([]);

  useEffect(() => {
    loadEmployes();
    if (isEditing) {
      loadPointage();
    }
  }, [id, selectedCompanyId]);

  async function loadEmployes() {
    try {
      const data = await pointagesApi.getEmployes ? await pointagesApi.getEmployes() : [];
      setEmployes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des employés:", err);
      showError("Erreur", "Impossible de charger la liste des employés");
      // Fallback to mock data if API fails
      const mockEmployes = [
        { id: 1, prenom: 'Jean', nom: 'Dupont', matricule: 'EMP001' },
        { id: 2, prenom: 'Marie', nom: 'Martin', matricule: 'EMP002' },
        { id: 3, prenom: 'Pierre', nom: 'Durand', matricule: 'EMP003' }
      ];
      setEmployes(mockEmployes);
    }
  }

  async function loadPointage() {
    setLoading(true);
    try {
      // Simulation du pointage - à remplacer par l'appel réel
      const mockPointage = {
        id: 1,
        datePointage: '2024-01-15',
        heureEntree: '08:00',
        heureSortie: '17:00',
        dureeTravail: 8.0,
        typePointage: 'PRESENCE',
        statut: 'PRESENT',
        lieu: 'Bureau principal',
        commentaire: 'Journée normale',
        employeId: 1,
        entrepriseId: selectedCompanyId
      };
      setFormData(mockPointage);
    } catch (err) {
      showError("Erreur", "Impossible de charger le pointage");
      navigate('/pointages');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Calcul automatique de la durée si les heures d'entrée et sortie sont définies
    if ((field === 'heureEntree' || field === 'heureSortie') && formData.heureEntree && formData.heureSortie) {
      const duree = calculateDureeTravail(formData.heureEntree, formData.heureSortie);
      setFormData(prev => ({
        ...prev,
        dureeTravail: duree
      }));
    }
  }

  function calculateDureeTravail(heureEntree, heureSortie) {
    if (!heureEntree || !heureSortie) return 0;

    const [heureE, minuteE] = heureEntree.split(':').map(Number);
    const [heureS, minuteS] = heureSortie.split(':').map(Number);

    const entree = new Date();
    entree.setHours(heureE, minuteE, 0, 0);

    const sortie = new Date();
    sortie.setHours(heureS, minuteS, 0, 0);

    const diffMs = sortie.getTime() - entree.getTime();
    const diffHeures = diffMs / (1000 * 60 * 60);

    return Math.round(diffHeures * 100) / 100;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      // Préparation des données
      const dataToSend = {
        ...formData,
        dureeTravail: parseFloat(formData.dureeTravail) || 0
      };

      // Real API calls
      if (isEditing) {
        await pointagesApi.update(id, dataToSend);
      } else {
        await pointagesApi.create(dataToSend);
      }

      showSuccess("Succès", `Pointage ${isEditing ? 'modifié' : 'créé'} avec succès`);

      // Dispatch custom event to refresh pointages list
      window.dispatchEvent(new CustomEvent('pointageCreated', {
        detail: { action: isEditing ? 'updated' : 'created' }
      }));

      navigate('/pointages');
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Erreur";
      showError("Erreur", errorMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/pointages')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour aux pointages
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier le pointage' : 'Nouveau pointage'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Modifiez les informations du pointage' : 'Enregistrez un nouveau pointage'}
            </p>
          </div>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du pointage *
                  </label>
                  <Input
                    type="date"
                    value={formData.datePointage}
                    onChange={(e) => handleInputChange('datePointage', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employé *
                  </label>
                  <Select
                    value={formData.employeId}
                    onChange={(e) => handleInputChange('employeId', e.target.value)}
                    required
                    className="w-full"
                  >
                    <option value="">Sélectionner un employé</option>
                    {employes.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.prenom} {emp.nom} ({emp.matricule})
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Horaires */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Horaires
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure d'entrée
                    </label>
                    <Input
                      type="time"
                      value={formData.heureEntree}
                      onChange={(e) => handleInputChange('heureEntree', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de sortie
                    </label>
                    <Input
                      type="time"
                      value={formData.heureSortie}
                      onChange={(e) => handleInputChange('heureSortie', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (heures)
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={formData.dureeTravail}
                      onChange={(e) => handleInputChange('dureeTravail', e.target.value)}
                      placeholder="Auto-calculée"
                    />
                  </div>
                </div>
              </div>

              {/* Type et statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de pointage *
                  </label>
                  <Select
                    value={formData.typePointage}
                    onChange={(e) => handleInputChange('typePointage', e.target.value)}
                    required
                    className="w-full"
                  >
                    <option value="PRESENCE">Présence</option>
                    <option value="ABSENCE">Absence</option>
                    <option value="CONGE">Congé</option>
                    <option value="MALADIE">Maladie</option>
                    <option value="MISSION">Mission</option>
                    <option value="FORMATION">Formation</option>
                    <option value="TELETRAVAIL">Télétravail</option>
                    <option value="HEURE_SUPPLEMENTAIRE">Heures supplémentaires</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <Select
                    value={formData.statut}
                    onChange={(e) => handleInputChange('statut', e.target.value)}
                    required
                    className="w-full"
                  >
                    <option value="PRESENT">Présent</option>
                    <option value="ABSENT">Absent</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="VALIDE">Validé</option>
                    <option value="REJETE">Rejeté</option>
                    <option value="MODIFIE">Modifié</option>
                  </Select>
                </div>
              </div>

              {/* Lieu et commentaire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Lieu
                  </label>
                  <Input
                    value={formData.lieu}
                    onChange={(e) => handleInputChange('lieu', e.target.value)}
                    placeholder="Bureau principal, Télétravail, etc."
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire
                  </label>
                  <Textarea
                    value={formData.commentaire}
                    onChange={(e) => handleInputChange('commentaire', e.target.value)}
                    placeholder="Commentaire optionnel..."
                    rows={3}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/pointages')}
                  disabled={saving}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-32"
                >
                  {saving ? 'Sauvegarde...' : (isEditing ? 'Modifier' : 'Créer')}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}