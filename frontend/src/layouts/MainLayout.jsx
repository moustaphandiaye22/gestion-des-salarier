import React, { useMemo, useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { entreprisesApi, API_BASE_URL } from "../utils/api";
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

const NAV = [
   { to: "/dashboard", label: "Tableau de bord", icon: ChartPieIcon },
   { to: "/employees", label: "Employés", icon: UsersIcon },
  { to: "/entreprises", label: "Entreprises", icon: BuildingOfficeIcon },
  { to: "/paiements", label: "Paiements", icon: BanknotesIcon },
  { to: "/bulletins", label: "Bulletins", icon: DocumentTextIcon },
  { to: "/cycles-paie", label: "Cycles de paie", icon: CalendarDaysIcon },
  { to: "/parametres-entreprise", label: "Paramètres entreprise", icon: Cog6ToothIcon },
  { to: "/rapports", label: "Rapports", icon: ClipboardDocumentListIcon },
  { to: "/journal-audit", label: "Journal d'audit", icon: HomeIcon },
  { to: "/professions", label: "Professions", icon: UsersIcon },
  // Super-admin only
  { to: "/parametres-globaux", label: "Paramètres globaux", icon: Cog6ToothIcon, superAdminOnly: true },
  { to: "/licences", label: "Licences", icon: DocumentTextIcon, superAdminOnly: true },
];

export default function MainLayout({ children }) {
  const { isAuthenticated, user, logout, selectedCompanyId, setSelectedCompanyId } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState("/img/logo-ct.png");
  const [companyName, setCompanyName] = useState("SalairePro");
  const [loading, setLoading] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [companies, setCompanies] = useState([]);

  // Fetch company logo and name when user is authenticated
  useEffect(() => {
    async function loadCompanyInfo() {
      if (isAuthenticated) {
        if (user?.role === 'SUPER_ADMIN' && selectedCompanyId) {
          try {
            const entreprise = await entreprisesApi.get(parseInt(selectedCompanyId));
            setSelectedCompanyName(entreprise.nom);
            if (entreprise?.logo) {
              // Use full backend URL for static assets
              const logoPath = entreprise.logo.startsWith('images/') ? API_BASE_URL + '/assets/' + entreprise.logo : API_BASE_URL + entreprise.logo;
              setCompanyLogo(logoPath);
              setCompanyName(entreprise.nom);
            } else {
              setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
              setCompanyName("SalairePro");
            }
          } catch (error) {
            console.error('Error loading selected company info:', error);
            setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
            setCompanyName("SalairePro");
          }
        } else if (user?.entrepriseId && user?.role !== 'SUPER_ADMIN') {
          try {
            const entreprise = await entreprisesApi.get(user.entrepriseId);
            if (entreprise?.logo) {
              // Use full backend URL for static assets
              const logoPath = entreprise.logo.startsWith('images/') ? API_BASE_URL + '/assets/' + entreprise.logo : API_BASE_URL + entreprise.logo;
              setCompanyLogo(logoPath);
              setCompanyName(entreprise.nom);
            } else {
              setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
              setCompanyName("SalairePro");
            }
          } catch (error) {
            console.error('Error loading company info:', error);
            setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
            setCompanyName("SalairePro");
          }
        } else {
          setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg"); // default logo for super admin
          setCompanyName("SalairePro");
        }
      }
    }

    loadCompanyInfo();
  }, [isAuthenticated, user, selectedCompanyId]);

  // Load companies list for super admin
  useEffect(() => {
    async function loadCompanies() {
      if (isAuthenticated && user?.role === 'SUPER_ADMIN') {
        try {
          const data = await entreprisesApi.list();
          setCompanies(data);
        } catch (error) {
          console.error('Error loading companies:', error);
        }
      }
    }
    loadCompanies();
  }, [isAuthenticated, user]);

  const currentTitle = useMemo(() => {
    const m = NAV.find((n) => location.pathname.startsWith(n.to));
    return m?.label || "Accueil";
  }, [location.pathname]);

  const NavItems = ({ onNavigate }) => {
    const filteredNav = NAV.filter((it) => {
      if (it.superAdminOnly) {
        return user?.role === 'SUPER_ADMIN';
      }
      return true;
    });

    return (
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredNav.map((it) => {
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cx(
                  "group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  "text-primary-700 hover:bg-primary-50 hover:text-primary-900",
                  isActive && "bg-primary-100 text-primary-900 shadow-sm"
                )
              }
              onClick={() => onNavigate?.()}
            >
              <Icon className={cx(
                "h-5 w-5 transition-colors duration-200",
                "text-primary-500 group-hover:text-primary-600"
              )} />
              <span className="truncate">{it.label}</span>
            </NavLink>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Sidebar fixe */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-surface-200 shadow-soft">
        {/* Logo et titre */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-200">
          <img src={companyLogo} alt="Logo" className="h-8 w-8" />
          <div>
            <h1 className="text-lg font-bold text-primary-900">{companyName}</h1>
            <p className="text-xs text-surface-500">Gestion intelligente</p>
          </div>
        </div>

        {/* Navigation */}
        <NavItems />

        {/* Footer sidebar */}
        <div className="p-4 border-t border-surface-200">
          {isAuthenticated && (
            <div className="space-y-3">
              {/* Super admin company selector */}
              {user?.role === 'SUPER_ADMIN' && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-xs font-medium text-blue-900">Sélection d'entreprise</p>
                  </div>
                  {selectedCompanyId && selectedCompanyName && (
                    <p className="text-sm font-medium text-blue-900 truncate mb-2">
                      Actuellement: {selectedCompanyName}
                    </p>
                  )}
                  <select
                    className="w-full p-2 rounded border border-blue-300 text-sm"
                    value={selectedCompanyId || ""}
                    onChange={async (e) => {
                      const newId = e.target.value;
                      setSelectedCompanyId(newId || null);
                      if (newId) {
                        try {
                          const entreprise = await entreprisesApi.get(parseInt(newId));
                          setSelectedCompanyName(entreprise.nom);
                          setCompanyLogo(
                            entreprise.logo.startsWith('images/')
                              ? API_BASE_URL + '/assets/' + entreprise.logo
                              : API_BASE_URL + entreprise.logo
                          );
                          setCompanyName(entreprise.nom);
                        } catch (error) {
                          console.error('Error loading selected company info:', error);
                        }
                      } else {
                        setSelectedCompanyName(null);
                        setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
                        setCompanyName("SalairePro");
                      }
                    }}
                  >
                    <option value="">-- Toutes les entreprises --</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                  {selectedCompanyId && (
                    <button
                      onClick={() => {
                        setSelectedCompanyId(null);
                        setSelectedCompanyName(null);
                        setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
                        setCompanyName("SalairePro");
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 block"
                    >
                      Retour à l'administration globale
                    </button>
                  )}
                </div>
              )}

              {/* User info */}
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">{user?.email}</p>
                  <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cx(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <aside className="absolute inset-y-0 left-0 w-64 bg-white border-r border-surface-200 shadow-xl transform transition-transform duration-300">
          {/* Logo mobile */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
            <div className="flex items-center gap-3">
              <img src={companyLogo} alt="Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold text-primary-900">{companyName}</h1>
                <p className="text-xs text-surface-500">Gestion intelligente</p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <NavItems onNavigate={() => setMobileOpen(false)} />

          {/* Footer mobile sidebar */}
          {isAuthenticated && user?.role === 'SUPER_ADMIN' && (
            <div className="p-4 border-t border-surface-200">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-xs font-medium text-blue-900">Sélection d'entreprise</p>
                </div>
                {selectedCompanyId && selectedCompanyName && (
                  <p className="text-sm font-medium text-blue-900 truncate mb-2">
                    Actuellement: {selectedCompanyName}
                  </p>
                )}
                <select
                  className="w-full p-2 rounded border border-blue-300 text-sm"
                  value={selectedCompanyId || ""}
                  onChange={async (e) => {
                    const newId = e.target.value;
                    setSelectedCompanyId(newId || null);
                    if (newId) {
                      try {
                        const entreprise = await entreprisesApi.get(parseInt(newId));
                        setSelectedCompanyName(entreprise.nom);
                        setCompanyLogo(
                          entreprise.logo.startsWith('images/')
                            ? API_BASE_URL + '/assets/' + entreprise.logo
                            : API_BASE_URL + entreprise.logo
                        );
                        setCompanyName(entreprise.nom);
                      } catch (error) {
                        console.error('Error loading selected company info:', error);
                      }
                    } else {
                      setSelectedCompanyName(null);
                      setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
                      setCompanyName("SalairePro");
                    }
                    setMobileOpen(false); // Close mobile menu after selection
                  }}
                >
                  <option value="">-- Toutes les entreprises --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
                {selectedCompanyId && (
                  <button
                    onClick={() => {
                      setSelectedCompanyId(null);
                      setSelectedCompanyName(null);
                      setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
                      setCompanyName("SalairePro");
                      setMobileOpen(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2 block"
                  >
                    Retour à l'administration globale
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-surface-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors duration-200"
                onClick={() => setMobileOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-primary-900">{currentTitle}</h1>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Déconnexion
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Créer un compte
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-surface-50">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
