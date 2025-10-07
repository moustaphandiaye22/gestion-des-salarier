import React, { useMemo, useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { entreprisesApi, API_BASE_URL } from "../utils/api";
import UserProfileDropdown from "../components/UserProfileDropdown";
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
  ClockIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

const NAV = [
    { to: "/dashboard", label: "Tableau de bord", icon: ChartPieIcon },
    { to: "/cashier-dashboard", label: "Tableau de bord Caissier", icon: ChartPieIcon, cashierOnly: true },
    { to: "/employees", label: "Employés", icon: UsersIcon },
  { to: "/pointages", label: "Pointages", icon: ClockIcon },
  { to: "/qrcodes", label: "QR Codes", icon: QrCodeIcon },
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
  const [companyColors, setCompanyColors] = useState({ primary: '#2563eb', secondary: '#1d4ed8' });
  const [isGrayscale, setIsGrayscale] = useState(false);

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Function to set colors
  const setColors = (primaryColor, secondaryColor) => {
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
  };

  // Helper function to lighten colors
  const lightenColor = (color, amount) => {
    // Simple color lightening - convert hex to rgb, lighten, convert back
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(amount * 255));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(amount * 255));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(amount * 255));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Fetch company logo and name when user is authenticated
  useEffect(() => {
    async function loadCompanyInfo() {
      if (isAuthenticated && user?.role !== 'EMPLOYE') {
        if (user?.role === 'SUPER_ADMIN') {
          // For SUPER_ADMIN, apply company colors when a company is selected
          if (selectedCompanyId) {
            // Load the selected company's colors
            try {
              const entreprise = await entreprisesApi.get(parseInt(selectedCompanyId));
              if (entreprise?.couleurPrimaire && entreprise?.couleurSecondaire) {
                setCompanyColors({
                  primary: entreprise.couleurPrimaire,
                  secondary: entreprise.couleurSecondaire,
                });
                setColors(entreprise.couleurPrimaire, entreprise.couleurSecondaire);
              } else {
                // Fallback to default if company has no colors
                setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
                setColors('#2563eb', '#1d4ed8');
              }
            } catch (error) {
              console.error('Error loading selected company colors:', error);
              setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
              setColors('#2563eb', '#1d4ed8');
            }
          } else {
            // No company selected - use default colors
            setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
            setColors('#2563eb', '#1d4ed8');
          }

          // Set grayscale for super admin with no company selected
          setIsGrayscale(user?.role === 'SUPER_ADMIN' && !selectedCompanyId);

          // Still load selected company info for display if selected
          if (selectedCompanyId) {
            try {
              const entreprise = await entreprisesApi.get(parseInt(selectedCompanyId));
              setSelectedCompanyName(entreprise.nom);
              if (entreprise?.logo) {
                const logoPath = entreprise.logo.startsWith('images/') ? API_BASE_URL + '/assets/' + entreprise.logo : API_BASE_URL + entreprise.logo;
                setCompanyLogo(logoPath);
                setCompanyName(entreprise.nom);
              }
            } catch (error) {
              console.error('Error loading selected company info:', error);
              setSelectedCompanyId(null);
              setSelectedCompanyName(null);
            }
          }
        } else if (user?.entreprise && (user?.role === 'ADMIN_ENTREPRISE' || user?.role === 'CAISSIER')) {
          // For ADMIN_ENTREPRISE and CAISSIER, use their company's colors automatically
          const entreprise = user.entreprise;
          if (entreprise?.logo) {
            const logoPath = entreprise.logo.startsWith('images/') ? API_BASE_URL + '/assets/' + entreprise.logo : API_BASE_URL + entreprise.logo;
            setCompanyLogo(logoPath);
            setCompanyName(entreprise.nom);
          } else {
            setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
            setCompanyName("SalairePro");
          }
          // Set CSS variables for colors from user's company
          if (entreprise?.couleurPrimaire && entreprise?.couleurSecondaire) {
            setCompanyColors({
              primary: entreprise.couleurPrimaire,
              secondary: entreprise.couleurSecondaire,
            });
            setColors(entreprise.couleurPrimaire, entreprise.couleurSecondaire);
          } else {
            // Fallback to default colors if company doesn't have colors
            setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
            setColors('#2563eb', '#1d4ed8');
          }
          setIsGrayscale(false);
        } else {
          setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
          setCompanyName("SalairePro");
          setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
          setColors('#2563eb', '#1d4ed8');
          setIsGrayscale(false);
        }
      } else if (isAuthenticated && user?.role === 'EMPLOYE') {
        // For employees, use default logo and company name
        setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
        setCompanyName("SalairePro");
        setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
        setColors('#2563eb', '#1d4ed8');
        setIsGrayscale(false);
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
    // Don't render navigation if user is not loaded yet
    if (!user) {
      return null;
    }

    const filteredNav = NAV.filter((it) => {
      if (it.superAdminOnly) {
        return user.role === 'SUPER_ADMIN';
      }
      if (it.cashierOnly) {
        return user.role === 'CAISSIER';
      }
      // For CAISSIER, only show payment-related items and cashier dashboard
      if (user.role === 'CAISSIER') {
        return ['/cashier-dashboard', '/paiements', '/bulletins', '/rapports', '/journal-audit'].includes(it.to);
      }
      // For VIGILE, only show pointages and QR codes
      if (user.role === 'VIGILE') {
        return ['/pointages', '/qrcodes'].includes(it.to);
      }
      // For ADMIN_ENTREPRISE, filter menu items to only allowed ones
      if (user.role === 'ADMIN_ENTREPRISE') {
        const allowedPaths = [
          '/dashboard',
          '/employees',
          '/pointages',
          '/qrcodes',
          '/paiements',
          '/bulletins',
          '/cycles-paie',
          '/parametres-entreprise',
          '/rapports',
          '/journal-audit',
          '/professions',
        ];
        return allowedPaths.includes(it.to);
      }
      // For EMPLOYE, only show their personal dashboard
      if (user.role === 'EMPLOYE') {
        return it.to === '/mon-dashboard' || it.to === '/dashboard';
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
    <div className="flex h-screen bg-surface-50 text-surface-900">
      {/* Sidebar fixe */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-surface-200 shadow-soft">
        {/* Logo et titre */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-200">
          <img src={companyLogo} alt="Logo" className="h-8 w-8" onError={(e) => e.target.src = "/img/logo-ct.png"} />
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
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <p className="text-xs font-medium text-primary-900">Sélection d'entreprise</p>
                  </div>
                  {selectedCompanyId && selectedCompanyName && (
                    <p className="text-sm font-medium text-primary-900 truncate mb-2">
                      Actuellement: {selectedCompanyName}
                    </p>
                  )}
                  <select
                    className="w-full p-2 rounded border border-primary-300 text-sm"
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
                        // Set CSS variables for colors
                        if (entreprise?.couleurPrimaire && entreprise?.couleurSecondaire) {
                          setCompanyColors({
                            primary: entreprise.couleurPrimaire,
                            secondary: entreprise.couleurSecondaire,
                          });
                          setColors(entreprise.couleurPrimaire, entreprise.couleurSecondaire);
                        }
                        } catch (error) {
                          console.error('Error loading selected company info:', error);
                        }
                      } else {
                        setSelectedCompanyName(null);
                        setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
                        setCompanyName("SalairePro");
                        setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
                        document.documentElement.style.setProperty('--color-primary', '#2563eb');
                        document.documentElement.style.setProperty('--color-secondary', '#1d4ed8');
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
                      className="text-xs text-primary-600 hover:text-primary-800 mt-2 block"
                    >
                      Retour à l'administration globale
                    </button>
                  )}
                </div>
              )}


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
              <img src={companyLogo} alt="Logo" className="h-8 w-8" onError={(e) => e.target.src = "/img/logo-ct.png"} />
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
              <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <p className="text-xs font-medium text-primary-900">Sélection d'entreprise</p>
                </div>
                {selectedCompanyId && selectedCompanyName && (
                  <p className="text-sm font-medium text-primary-900 truncate mb-2">
                    Actuellement: {selectedCompanyName}
                  </p>
                )}
                <select
                  className="w-full p-2 rounded border border-primary-300 text-sm"
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
                        // Set CSS variables for colors
                        if (entreprise?.couleurPrimaire && entreprise?.couleurSecondaire) {
                          setCompanyColors({
                            primary: entreprise.couleurPrimaire,
                            secondary: entreprise.couleurSecondaire,
                          });
                          setColors(entreprise.couleurPrimaire, entreprise.couleurSecondaire);
                        }
                      } catch (error) {
                        console.error('Error loading selected company info:', error);
                      }
                    } else {
                      setSelectedCompanyName(null);
                      setCompanyLogo(API_BASE_URL + "/assets/images/logos/logo.jpg");
                      setCompanyName("SalairePro");
                      setCompanyColors({ primary: '#2563eb', secondary: '#1d4ed8' });
                      document.documentElement.style.setProperty('--color-primary', '#2563eb');
                      document.documentElement.style.setProperty('--color-secondary', '#1d4ed8');
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
                    className="text-xs text-primary-600 hover:text-primary-800 mt-2 block"
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
                <>
                  <UserProfileDropdown />
                </>
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
