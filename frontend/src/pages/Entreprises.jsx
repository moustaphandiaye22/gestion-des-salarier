import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Table, Button, ConfirmDialog, Input } from "../components/ui";
import { entreprisesApi, utilisateursApi } from "../utils/api";
import { TrashIcon, PlusIcon, UserCircleIcon, EyeIcon, MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon, BuildingOfficeIcon, UsersIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Entreprises() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    nom: "",
    description: "",
    adresse: "",
    telephone: "",
    email: "",
    logo: null,
  });
  const [createErrors, setCreateErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  const [searchTerm, setSearchTerm] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await entreprisesApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await entreprisesApi.remove(toDelete.id);
      setToDelete(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function loadCompanyUsers(entrepriseId) {
    setUsersLoading(true);
    setError(null);
    try {
      const users = await utilisateursApi.list({ entrepriseId });
      setCompanyUsers(Array.isArray(users) ? users : []);
      setShowUsers(entrepriseId);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setUsersLoading(false);
    }
  }

  function handleCompanyAccess(entreprise) {
    // For super admin, store the selected company context and redirect to dashboard
    if (user?.role === 'SUPER_ADMIN') {
      localStorage.setItem('selectedCompanyId', entreprise.id);
      localStorage.setItem('selectedCompanyName', entreprise.nom);
      navigate('/dashboard');
    }
  }

  function validateCompanyForm() {
    const errors = {};

    if (!createForm.nom.trim()) {
      errors.nom = "Le nom de l'entreprise est obligatoire.";
    }

    if (!createForm.email.trim()) {
      errors.email = "L'email est obligatoire.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createForm.email)) {
        errors.email = "L'email doit être une adresse valide.";
      }
    }

    if (createForm.telephone && createForm.telephone.length > 20) {
      errors.telephone = "Le numéro de téléphone ne doit pas dépasser 20 caractères.";
    }

    if (createForm.adresse && createForm.adresse.length > 255) {
      errors.adresse = "L'adresse ne doit pas dépasser 255 caractères.";
    }

    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreateCompany(e) {
    e.preventDefault();
    setError(null);

    if (!validateCompanyForm()) {
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('nom', createForm.nom.trim());
      formData.append('description', createForm.description.trim() || '');
      formData.append('adresse', createForm.adresse.trim() || '');
      formData.append('telephone', createForm.telephone.trim() || '');
      formData.append('email', createForm.email.trim());
      formData.append('estActive', 'true');

      // Always append the logo field, even if no file is selected
      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await entreprisesApi.create(formData);
      setShowCreateForm(false);
      setCreateForm({
        nom: "",
        description: "",
        adresse: "",
        telephone: "",
        email: "",
        logo: null,
      });
      setCreateErrors({});
      setSelectedFile(null);
      setFilePreview("");
      load(); // Reload the companies list
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setCreating(false);
    }
  }

  function updateCreateForm(field, value) {
    setCreateForm(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (createErrors[field]) {
      setCreateErrors(prev => ({ ...prev, [field]: null }));
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCreateForm(prev => ({ ...prev, logo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeFile() {
    setSelectedFile(null);
    setFilePreview("");
    setCreateForm(prev => ({ ...prev, logo: null }));
  }

  // Filter companies based on search term
  const filteredRows = rows.filter(row =>
    row.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader
            title="Entreprises"
            actions={
              <div className="flex items-center gap-4">
                {user?.role === 'SUPER_ADMIN' && (
                  <>
                    {/* Search Bar */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher une entreprise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <Button
                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="flex items-center gap-1"
                      >
                        <ListBulletIcon className="h-4 w-4" />
                        Liste
                      </Button>
                      <Button
                        variant={viewMode === 'card' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('card')}
                        className="flex items-center gap-1"
                      >
                        <Squares2X2Icon className="h-4 w-4" />
                        Cartes
                      </Button>
                    </div>
                  </>
                )}

                {user?.role === 'SUPER_ADMIN' && (
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <PlusIcon className="h-5 w-5" />
                    Ajouter
                  </Button>
                )}
              </div>
            }
          />
          <CardBody>
            {error && <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              {viewMode === 'list' ? (
                <Table
                  head={[
                    "Logo",
                    "Nom",
                    "Email",
                    "Téléphone",
                    "Adresse",
                    "Secteur",
                    "Employés",
                    "Actif",
                    "Création",
                    "Stats",
                    "Actions",
                  ]}
                  rows={filteredRows}
                  renderRow={(row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-2 text-sm">
                        {row.logo ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/${row.logo}`}
                            alt={`Logo ${row.nom}`}
                            className="w-8 h-8 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium">{row.nom}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden sm:table-cell">{row.email || '-'}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">{row.telephone || '-'}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">{row.adresse || '-'}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden xl:table-cell">{row.secteurActivite || '-'}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 text-center">{row.nombreEmployes || 0}</td>
                      <td className="px-2 py-2 text-sm text-gray-700 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          row.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row.estActif ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden md:table-cell">
                        {row.dateCreation ? new Date(row.dateCreation).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                        <div className="text-xs space-y-1">
                          <div>E: {Array.isArray(row.employes) ? row.employes.length : 0}</div>
                          <div>C: {Array.isArray(row.cyclesPaie) ? row.cyclesPaie.length : 0}</div>
                          <div>P: {Array.isArray(row.paiements) ? row.paiements.length : 0}</div>
                          <div>U: {Array.isArray(row.utilisateurs) ? row.utilisateurs.length : 0}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-sm">
                        <div className="flex gap-1">
                          {user?.role === 'SUPER_ADMIN' && (
                            <Button
                              variant="outline"
                              onClick={() => handleCompanyAccess(row)}
                              className="text-xs px-2 py-1"
                              title="Accéder à cette entreprise"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => loadCompanyUsers(row.id)}
                            className="text-xs px-2 py-1"
                            title="Voir les utilisateurs"
                          >
                            <UserCircleIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="danger" onClick={() => setToDelete(row)} className="text-xs px-2 py-1">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              ) : (
                // Card View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRows.map((row) => (
                    <Card key={row.id} className="hover:shadow-lg transition-shadow">
                      <CardBody className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          {row.logo ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/${row.logo}`}
                              alt={`Logo ${row.nom}`}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 ${row.logo ? 'hidden' : ''}`}>
                            <BuildingOfficeIcon className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{row.nom}</h3>
                            <p className="text-xs text-gray-500 truncate">{row.email || 'Pas d\'email'}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <UsersIcon className="w-4 h-4" />
                            <span>{row.nombreEmployes || 0} employés</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            <span>{Array.isArray(row.paiements) ? row.paiements.length : 0} paiements</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              row.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {row.estActif ? 'Actif' : 'Inactif'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {row.dateCreation ? new Date(row.dateCreation).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }) : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {user?.role === 'SUPER_ADMIN' && (
                            <Button
                              variant="outline"
                              onClick={() => handleCompanyAccess(row)}
                              className="flex-1 text-xs"
                              title="Accéder à cette entreprise"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              Accéder
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => loadCompanyUsers(row.id)}
                            className="flex-1 text-xs"
                            title="Voir les utilisateurs"
                          >
                            <UserCircleIcon className="h-4 w-4 mr-1" />
                            Utilisateurs
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => setToDelete(row)}
                            className="text-xs px-2"
                            title="Supprimer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            {loading && <p className="mt-3 text-sm text-gray-600">Chargement...</p>}
          </CardBody>
        </Card>

        {/* Company Creation Form */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <form onSubmit={handleCreateCompany}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Nouvelle entreprise
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {error && (
                      <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label="Nom de l'entreprise *"
                          value={createForm.nom}
                          onChange={(e) => updateCreateForm("nom", e.target.value)}
                          error={createErrors.nom}
                          placeholder="Ex: MonEntreprise SARL"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={createForm.description}
                          onChange={(e) => updateCreateForm("description", e.target.value)}
                          rows={3}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Description de l'entreprise..."
                        />
                      </div>

                      <Input
                        label="Email *"
                        type="email"
                        value={createForm.email}
                        onChange={(e) => updateCreateForm("email", e.target.value)}
                        error={createErrors.email}
                        placeholder="contact@entreprise.com"
                      />

                      <Input
                        label="Téléphone"
                        value={createForm.telephone}
                        onChange={(e) => updateCreateForm("telephone", e.target.value)}
                        error={createErrors.telephone}
                        placeholder="+221 77 123 45 67"
                      />

                      <div className="md:col-span-2">
                        <Input
                          label="Adresse"
                          value={createForm.adresse}
                          onChange={(e) => updateCreateForm("adresse", e.target.value)}
                          error={createErrors.adresse}
                          placeholder="Adresse complète de l'entreprise"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo de l'entreprise
                        </label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {filePreview && (
                            <div className="relative inline-block">
                              <img
                                src={filePreview}
                                alt="Aperçu du logo"
                                className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={removeFile}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <Button
                      type="submit"
                      disabled={creating}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {creating ? "Création..." : "Créer l'entreprise"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!toDelete}
          title="Supprimer l'entreprise"
          message={`Confirmer la suppression de ${toDelete?.nom || ''} ?`}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />

        {/* Users Dialog */}
        {showUsers && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Utilisateurs de l'entreprise
                    </h3>
                    <button
                      onClick={() => setShowUsers(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">
                      {error}
                    </div>
                  )}

                  <div className="max-h-96 overflow-y-auto">
                    {usersLoading ? (
                      <p className="text-sm text-gray-600">Chargement des utilisateurs...</p>
                    ) : companyUsers.length > 0 ? (
                      <div className="space-y-4">
                        {/* Admins */}
                        {companyUsers.filter(user => user.role === 'ADMIN_ENTREPRISE').length > 0 && (
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-2">Administrateurs</h4>
                            <div className="bg-blue-50 rounded-lg p-3">
                              {companyUsers
                                .filter(user => user.role === 'ADMIN_ENTREPRISE')
                                .map(user => (
                                  <div key={user.id} className="flex items-center gap-3 py-2">
                                    <UserCircleIcon className="w-8 h-8 text-blue-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {user.role}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Caissiers */}
                        {companyUsers.filter(user => user.role === 'CAISSIER').length > 0 && (
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-2">Caissiers</h4>
                            <div className="bg-green-50 rounded-lg p-3">
                              {companyUsers
                                .filter(user => user.role === 'CAISSIER')
                                .map(user => (
                                  <div key={user.id} className="flex items-center gap-3 py-2">
                                    <UserCircleIcon className="w-8 h-8 text-green-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {user.role}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Employés */}
                        {companyUsers.filter(user => user.role === 'EMPLOYE').length > 0 && (
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-2">Employés</h4>
                            <div className="bg-gray-50 rounded-lg p-3">
                              {companyUsers
                                .filter(user => user.role === 'EMPLOYE')
                                .map(user => (
                                  <div key={user.id} className="flex items-center gap-3 py-2">
                                    <UserCircleIcon className="w-8 h-8 text-gray-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {user.role}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Aucun utilisateur trouvé pour cette entreprise.</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowUsers(null)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
