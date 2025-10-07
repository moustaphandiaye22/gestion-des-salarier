# SalairePro Multi-Entreprises

## 📋 Description

Système complet et avancé de gestion des salaires et des employés pour les entreprises, avec une architecture multi-entreprises sécurisée, des contrôles d'accès avancés basés sur les rôles, et des fonctionnalités modernes de suivi en temps réel.

## 🌟 Fonctionnalités Principales

### 🔐 Système d'Authentification et d'Autorisation Avancé

#### **Rôles Utilisateur Étendus :**
- **Super Admin** : Contrôle total du système, accès à toutes les entreprises
- **Admin d'Entreprise** : Gestion exclusive de son entreprise
- **Caissier** : Gestion des paiements et transactions financières
- **Vigile/Sécurité** : Contrôle d'accès et pointage QR code
- **Employé** : Accès limité à ses propres données et pointage

#### **Sécurité Renforcée :**
- Authentification JWT avec tokens d'accès et de rafraîchissement
- Contrôle d'accès basé sur les rôles (RBAC) avancé
- Filtrage automatique des données par entreprise
- Middleware de sécurité sur toutes les routes
- Audit trail complet de toutes les actions
- Gestion des licences multi-niveaux

### 👥 Gestion Avancée des Employés

#### **Administrateur d'Entreprise :**
- ✅ **UC_AE001** : Gérer les employés (CRUD complet)
- ✅ **UC_AE002** : Créer et configurer les cycles de paie
- ✅ **UC_AE003** : Approuver les bulletins de paie
- ✅ **UC_AE004** : Consulter le dashboard entreprise personnalisable
- ✅ **UC_AE005** : Gérer les utilisateurs de son entreprise
- ✅ **UC_AE006** : Configurer les paramètres de paie avancés
- ✅ **UC_AE007** : Générer les rapports d'entreprise
- ✅ **UC_AE008** : Exporter les données de paie (PDF, Excel, CSV, JSON)
- ✅ **UC_AE009** : Gestion des QR codes pour le pointage
- ✅ **UC_AE010** : Configuration des alertes et notifications

#### **Fonctionnalités Employés Étendues :**
- Gestion complète du cycle de vie des employés
- Types de contrats : CDI, CDD, Intérim, Stage
- Types de salaire : Mensuel, Honoraires, Journalier
- Gestion des professions et catégories
- Calcul automatique des allocations et déductions
- Pointage par QR code avec géolocalisation
- Suivi des présences en temps réel
- Gestion des congés et absences

### 📊 Gestion des Bulletins de Paie

#### **Fonctionnalités Avancées :**
- Génération automatique des bulletins avec calculs complexes
- Calcul des salaires, allocations et déductions
- Gestion des périodes de paie personnalisables
- Approbation et validation multi-niveaux des bulletins
- Export PDF des bulletins avec personnalisation entreprise
- Suivi des statuts de paiement en temps réel
- Historique complet des bulletins
- Génération en lot pour plusieurs employés

### 💰 Gestion des Paiements Multi-Modales

#### **Fonctionnalités Étendues :**
- Enregistrement des paiements effectués avec références automatiques
- Modes de paiement : Espèces, Chèque, Virement, Wave, Orange Money, Mobile Money
- Suivi des statuts : En attente, Payé, Échec, En cours
- Gestion des échecs de paiement et relances automatiques
- Lien avec les bulletins de paie et validation croisée
- Rapports de paiement avancés
- Notifications en temps réel des paiements

### 📈 Cycles de Paie Flexibles

#### **Configuration Avancée :**
- Configuration des cycles de paie par entreprise
- Fréquences : Mensuel, Hebdomadaire, Quinzaine, Personnalisé
- Gestion des périodes de début et fin avec calculs automatiques
- Statuts : Ouvert, Fermé, En cours de validation
- Association avec les bulletins et employés
- Gestion des exceptions et cas particuliers

### 📋 Rapports et Analytics Puissants

#### **Types de Rapports Étendus :**
- Rapports de bulletins de paie détaillés
- Rapports d'employés avec statistiques avancées
- Rapports de paiements et flux financiers
- Rapports statistiques et analytiques
- Rapports de présence et productivité
- Rapports de conformité et audit

#### **Fonctionnalités Analytiques :**
- Génération automatique des rapports avec planification
- Filtres avancés par entreprise, période, statut, employé
- Export des données en PDF, Excel, CSV, JSON
- Dashboard personnalisable avec widgets configurables
- KPIs en temps réel avec seuils d'alerte
- Graphiques interactifs (Chart.js, ApexCharts, Recharts)

### 🎯 Dashboard Dynamique et Personnalisable

#### **Fonctionnalités Dashboard :**
- **Admin d'Entreprise** : Vue filtrée sur son entreprise uniquement avec métriques personnalisées
- **Super Admin** : Vue globale du système avec sélection d'entreprise
- **Caissier** : Vue centrée sur les paiements et transactions
- **Vigile** : Vue de contrôle d'accès et pointage
- **Employé** : Vue personnelle avec ses données

#### **Widgets Configurables :**
- Cartes KPI personnalisables
- Graphiques en ligne, barres, camembert, zones
- Tableaux de données filtrables
- Indicateurs de performance
- Alertes et notifications en temps réel
- Boutons d'export rapide

### 📱 Pointage par QR Code

#### **Fonctionnalités de Pointage :**
- Génération automatique de QR codes uniques par employé
- Pointage par scan QR code avec géolocalisation
- Types de pointage : Présence, Absence, Congé, Maladie, Mission, Formation, Télétravail
- Suivi des heures travaillées avec calcul automatique
- Gestion des retards et heures supplémentaires
- Rapports de présence détaillés
- Interface mobile optimisée pour le scanning

### ⚡ Notifications en Temps Réel

#### **WebSocket Integration :**
- Notifications push en temps réel
- Mises à jour de données automatiques
- Alertes de système (retards de paiement, seuils dépassés)
- Salles de discussion par entreprise
- Statistiques de connexions en temps réel

### 📤 Système d'Export Avancé

#### **Formats Supportés :**
- **PDF** : Bulletins de paie, rapports, attestations
- **Excel** : Données analytiques, listes d'employés
- **CSV** : Exports pour traitement externe
- **JSON** : API et intégrations

#### **Fonctionnalités d'Export :**
- Exports programmés automatiques
- Exports en lot pour grandes quantités de données
- Personnalisation des templates d'export
- Historique des exports avec téléchargement
- Notifications de fin d'export

### 🏢 Gestion des Licences

#### **Niveaux de Licence :**
- **Trial** : Version d'essai limitée
- **Standard** : Fonctionnalités de base
- **Premium** : Fonctionnalités avancées
- **Enterprise** : Fonctionnalités complètes + support

#### **Contrôle d'Accès :**
- Limitation par nombre d'utilisateurs
- Limitation par nombre d'entreprises
- Gestion des dates d'expiration
- Renouvellement automatique

### 👥 Gestion Avancée des Utilisateurs

#### **Fonctionnalités Étendues :**
- Gestion des comptes utilisateurs multi-rôles
- Attribution granulaire des rôles par entreprise
- Activation/désactivation/suspension des comptes
- Gestion avancée des permissions
- Audit des connexions et actions utilisateurs
- Réinitialisation sécurisée des mots de passe

### ⚙️ Paramètres d'Entreprise Personnalisables

#### **Configuration Avancée :**
- Paramètres de devise (XOF, EUR, USD, etc.)
- Configuration multi-langue (Français, Anglais, etc.)
- Fréquence de paie personnalisable
- Paramètres spécifiques à chaque entreprise
- Thématisation personnalisée (logos, couleurs)
- Configuration des seuils d'alerte

### 🔍 Système d'Audit Complet

#### **Traçabilité Totale :**
- Journalisation de toutes les actions utilisateurs
- Suivi des modifications de données sensibles
- Audit des connexions et déconnexions
- Historique des exports et génération de documents
- Rapports d'audit avancés avec filtres temporels

## 🛠️ Architecture Technique Avancée

### **Backend (Node.js + TypeScript)**
```
backend/
├── src/
│   ├── auth/                 # Authentification JWT avancée
│   ├── config/               # Configuration (DB, env, container)
│   ├── controller/           # Contrôleurs API RESTful
│   ├── middleware/           # Middleware (auth, RBAC, error handling)
│   ├── repositories/         # Couche d'accès aux données (Repository Pattern)
│   ├── routes/               # Définition des routes avec documentation Swagger
│   ├── service/              # Logique métier (Services spécialisés)
│   │   ├── qrCodeService.ts  # Gestion des QR codes
│   │   ├── websocketService.ts # Notifications temps réel
│   │   ├── fileService.ts    # Gestion des fichiers et exports
│   │   └── *Service.ts       # Services métier
│   ├── validators/           # Validation des données (Zod)
│   ├── interfaces/           # Interfaces TypeScript
│   ├── errors/               # Gestion centralisée des erreurs
│   └── utils/                # Utilitaires avancés
├── prisma/
│   ├── schema.prisma         # Schéma de base de données complet
│   ├── migrations/           # Migrations automatisées
│   └── seed.js               # Données de test
├── assets/
│   ├── images/logos/         # Logos d'entreprises
│   └── qrcodes/              # Images QR codes générées
└── __tests__/                # Tests automatisés complets
```

### **Frontend (React + Vite + Modern Stack)**
```
frontend/
├── src/
│   ├── components/           # Composants réutilisables avancés
│   │   ├── ui/               # Composants UI de base
│   │   ├── QRCodeScanner.jsx # Scanner QR code
│   │   ├── Toast.jsx         # Notifications
│   │   └── *Component.jsx    # Composants spécialisés
│   ├── pages/                # Pages de l'application
│   ├── context/              # Contextes React (Auth, Theme, Toast)
│   ├── hooks/                # Hooks personnalisés (WebSocket)
│   ├── layouts/              # Layouts d'application
│   ├── utils/                # API client et utilitaires avancés
│   ├── styles/               # Styles et thème personnalisable
│   └── assets/               # Ressources statiques
├── public/                   # Assets publics
└── index.html               # Point d'entrée SPA
```

### **Base de Données**
- **MySQL 8.0+** avec Prisma ORM
- Schéma relationnel optimisé avec 25+ tables
- Migrations automatisées et versionnées
- Index optimisés pour les performances
- Support des transactions complexes

### **Technologies Avancées**
- **Backend** : Node.js, TypeScript, Express.js, Socket.IO
- **Frontend** : React 18, Vite, Tailwind CSS, Material-UI
- **Base de données** : MySQL avec Prisma ORM
- **Authentification** : JWT avec refresh tokens
- **Real-time** : WebSocket pour notifications
- **QR Codes** : Génération et scan avec géolocalisation
- **Visualisation** : Chart.js, ApexCharts, Recharts
- **Export** : PDFKit, XLSX pour exports multi-formats
- **Tests** : Jest avec coverage complet
- **Documentation** : Swagger/OpenAPI intégrée

## 🔒 Sécurité

### **Contrôle d'Accès :**
- **JWT Tokens** : Authentification sécurisée
- **RBAC** : Autorisation basée sur les rôles
- **Filtrage automatique** : Isolation des données par entreprise
- **Middleware de sécurité** : Protection de toutes les routes

### **Entités Sécurisées :**
- Employés filtrés par entreprise
- Bulletins liés aux employés de l'entreprise
- Paiements associés aux bulletins de l'entreprise
- Rapports générés pour l'entreprise uniquement
- Paramètres spécifiques à chaque entreprise

## 🚀 Installation et Démarrage

### **Prérequis :**
- **Node.js 18+** (LTS recommandé)
- **MySQL 8.0+** (avec support JSON)
- **npm** ou **yarn**
- **Git** pour le contrôle de version

### **Backend :**
```bash
cd backend
npm install
# Configuration de la base de données
cp .env .env.local  # Créer une copie locale si nécessaire
# Modifier les variables d'environnement dans .env
npm run dev          # Développement avec hot reload
npm run dev:local    # Développement sur port 3003
npm run build        # Build de production
npm run start        # Démarrer en production
```

### **Frontend :**
```bash
cd frontend
npm install
npm run dev          # Développement avec Vite
npm run build        # Build de production
npm run preview      # Prévisualiser le build de production
npm run lint         # Vérification du code
```

### **Base de Données :**
```bash
cd backend
npx prisma generate           # Générer le client Prisma
npx prisma db push           # Appliquer le schéma à la DB
npx prisma migrate dev       # Créer et appliquer une migration
npx prisma seed              # Insérer les données de test
npx prisma studio            # Interface graphique de la DB
```

### **Tests :**
```bash
cd backend
npm run test                 # Lancer tous les tests
npm run test:watch          # Tests en mode watch
npm run test:coverage       # Coverage de tests
```

## 🔧 Configuration Avancée

### **Variables d'Environnement (.env) :**
```env
# Base de données
DATABASE_URL="mysql://root:passer@127.0.0.1:3306/gestion_salarie"

# JWT - Secrets forts recommandés en production
JWT_ACCESS_SECRET=un_secret_pour_jwt_super_securise_avec_au_moins_32_caracteres
JWT_REFRESH_SECRET=un_autre_secret_refresh_tout_aussi_securise_pour_la_rotation

# Serveur
PORT=3015
NODE_ENV=development

# Frontend URL (pour CORS et WebSocket)
FRONTEND_URL=http://localhost:5173

# Configuration optionnelle
# ENABLE_SWAGGER=true          # Activer la documentation API
# ENABLE_WEBSOCKET=true        # Activer les WebSockets
# QR_CODE_EXPIRY=300           # Expiration QR codes (secondes)
```

### **Configuration Frontend :**
Le frontend utilise Vite avec les variables d'environnement suivantes :
```env
# API Base URL
VITE_API_URL=http://localhost:3015/api

# WebSocket URL
VITE_WS_URL=ws://localhost:3015

# Configuration de l'application
VITE_APP_NAME=SalairePro
VITE_APP_VERSION=1.0.0
```

## 📡 API Endpoints Complets

### **Authentification et Sécurité :**
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/refresh` - Rafraîchissement du token
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/change-password` - Changer le mot de passe
- `GET /api/auth/profile` - Profil utilisateur

### **Gestion des Employés :**
- `GET /api/employes` - Liste des employés (filtré par rôle)
- `POST /api/employes` - Créer un employé
- `GET /api/employes/:id` - Détails d'un employé
- `PUT /api/employes/:id` - Modifier un employé
- `DELETE /api/employes/:id` - Supprimer un employé
- `GET /api/employes/:id/qr-code` - Générer QR code employé
- `POST /api/employes/generate-qr-codes` - Générer QR codes en lot

### **Pointage et Présence :**
- `POST /api/pointages` - Enregistrer un pointage
- `GET /api/pointages` - Liste des pointages (filtré par rôle)
- `GET /api/pointages/:id` - Détails d'un pointage
- `PUT /api/pointages/:id` - Modifier un pointage
- `POST /api/pointages/scan-qr` - Scanner QR code pour pointage
- `GET /api/pointages/employee/:id` - Pointages d'un employé
- `GET /api/pointages/stats` - Statistiques de présence

### **Bulletins de Paie :**
- `GET /api/bulletins` - Liste des bulletins (filtré par rôle)
- `POST /api/bulletins` - Créer un bulletin
- `GET /api/bulletins/:id` - Détails d'un bulletin
- `PUT /api/bulletins/:id` - Modifier un bulletin
- `DELETE /api/bulletins/:id` - Supprimer un bulletin
- `GET /api/bulletins/:id/pdf` - Télécharger le PDF
- `POST /api/bulletins/generate` - Générer bulletins en lot
- `PUT /api/bulletins/:id/approve` - Approuver un bulletin

### **Gestion des Paiements :**
- `GET /api/paiements` - Liste des paiements (filtré par rôle)
- `POST /api/paiements` - Enregistrer un paiement
- `GET /api/paiements/:id` - Détails d'un paiement
- `PUT /api/paiements/:id` - Modifier un paiement
- `DELETE /api/paiements/:id` - Supprimer un paiement
- `GET /api/paiements/pending` - Paiements en attente
- `POST /api/paiements/bulk` - Enregistrer paiements en lot

### **Gestion des Entreprises :**
- `GET /api/entreprises` - Liste des entreprises (filtré par rôle)
- `POST /api/entreprises` - Créer une entreprise
- `GET /api/entreprises/:id` - Détails d'une entreprise
- `PUT /api/entreprises/:id` - Modifier une entreprise
- `DELETE /api/entreprises/:id` - Supprimer une entreprise
- `POST /api/entreprises/:id/logo` - Upload logo entreprise
- `GET /api/entreprises/:id/stats` - Statistiques entreprise

### **Cycles de Paie :**
- `GET /api/cycles-paie` - Liste des cycles (filtré par rôle)
- `POST /api/cycles-paie` - Créer un cycle
- `GET /api/cycles-paie/:id` - Détails d'un cycle
- `PUT /api/cycles-paie/:id` - Modifier un cycle
- `DELETE /api/cycles-paie/:id` - Supprimer un cycle
- `PUT /api/cycles-paie/:id/status` - Changer statut du cycle

### **Rapports et Analytics :**
- `GET /api/rapports` - Liste des rapports (filtré par rôle)
- `POST /api/rapports` - Générer un rapport
- `GET /api/rapports/:id` - Détails d'un rapport
- `DELETE /api/rapports/:id` - Supprimer un rapport
- `GET /api/rapports/export/:id` - Télécharger un rapport
- `GET /api/rapports/dashboard` - Données du dashboard

### **Gestion des Utilisateurs :**
- `GET /api/utilisateurs` - Liste des utilisateurs (filtré par rôle)
- `POST /api/utilisateurs` - Créer un utilisateur
- `GET /api/utilisateurs/:id` - Détails d'un utilisateur
- `PUT /api/utilisateurs/:id` - Modifier un utilisateur
- `DELETE /api/utilisateurs/:id` - Supprimer un utilisateur
- `PUT /api/utilisateurs/:id/toggle` - Activer/désactiver utilisateur

### **Paramètres d'Entreprise :**
- `GET /api/parametres-entreprise` - Liste des paramètres (filtré par rôle)
- `POST /api/parametres-entreprise` - Créer un paramètre
- `GET /api/parametres-entreprise/:id` - Détails d'un paramètre
- `PUT /api/parametres-entreprise/:id` - Modifier un paramètre
- `DELETE /api/parametres-entreprise/:id` - Supprimer un paramètre

### **Dashboard et KPIs :**
- `GET /api/dashboard` - Données du dashboard
- `GET /api/dashboard/widgets` - Configuration des widgets
- `POST /api/dashboard/widgets` - Créer un widget
- `PUT /api/dashboard/widgets/:id` - Modifier un widget
- `DELETE /api/dashboard/widgets/:id` - Supprimer un widget
- `GET /api/kpis` - Indicateurs clés de performance

### **Gestion des Licences :**
- `GET /api/licences` - Liste des licences
- `POST /api/licences` - Créer une licence
- `GET /api/licences/:id` - Détails d'une licence
- `PUT /api/licences/:id` - Modifier une licence
- `GET /api/licences/check` - Vérifier validité licence

### **Exports et Fichiers :**
- `GET /api/exports` - Liste des exports
- `POST /api/exports` - Créer un export
- `GET /api/exports/:id/download` - Télécharger un export
- `GET /api/exports/:id/status` - Statut d'un export
- `POST /api/exports/bulk` - Exports en lot

### **Journal d'Audit :**
- `GET /api/audit` - Liste des actions d'audit
- `GET /api/audit/:id` - Détails d'une action d'audit
- `GET /api/audit/stats` - Statistiques d'audit

### **WebSocket et Temps Réel :**
- `WS /` - Connexion WebSocket principale
- `WS /enterprise/:id` - Salle d'entreprise spécifique

### **Documentation API :**
- `GET /api-docs` - Documentation Swagger/OpenAPI

## 👥 Comptes de Test

### **Super Admin :**
- **Email** : `superadmin@payrollplatform.com`
- **Mot de passe** : `superadmin123`
- **Accès** : Toutes les entreprises et fonctionnalités système

### **Admin d'Entreprise (TechCorp) :**
- **Email** : `admin@techcorp.sn`
- **Mot de passe** : `admin123`
- **Entreprise** : TechCorp Senegal uniquement
- **Accès** : Gestion complète de TechCorp

### **Admin d'Entreprise (AgriSolutions) :**
- **Email** : `admin@agrisolutions.ml`
- **Mot de passe** : `admin123`
- **Entreprise** : AgriSolutions Mali uniquement
- **Accès** : Gestion complète d'AgriSolutions

### **Caissier (TechCorp) :**
- **Email** : `caissier@techcorp.sn`
- **Mot de passe** : `caissier123`
- **Rôle** : Caissier avec accès aux paiements
- **Accès** : Gestion des paiements et transactions

### **Vigile/Sécurité (TechCorp) :**
- **Email** : `vigile@techcorp.sn`
- **Mot de passe** : `vigile123`
- **Rôle** : Vigile avec accès au pointage QR
- **Accès** : Contrôle d'accès et pointage

### **Employé (TechCorp) :**
- **Email** : `employe@techcorp.sn`
- **Mot de passe** : `employe123`
- **Accès** : Données personnelles et pointage uniquement

### **Configuration des Entreprises de Test :**
- **TechCorp Senegal** : Entreprise technologique avec employés CDI/CDD
- **AgriSolutions Mali** : Entreprise agricole avec employés saisonniers
- **Données incluses** : Employés, bulletins, paiements, cycles de paie

## 📊 Modèle de Données Complet

### **Entités Principales (25+ Tables) :**
- **Entreprise** : Entités organisationnelles avec branding personnalisé
- **Utilisateur** : Comptes d'accès avec rôles étendus (Super Admin, Admin, Caissier, Vigile, Employé)
- **Employe** : Salariés avec QR codes uniques et suivi de présence
- **Bulletin** : Bulletins de paie avec calculs automatisés
- **Paiement** : Enregistrements de paiements multi-modales
- **CyclePaie** : Périodes de paie flexibles et configurables
- **Rapport** : Rapports avancés avec exports multi-formats
- **Profession** : Métiers et catégories professionnelles
- **Pointage** : Système de présence avec géolocalisation et types variés
- **JournalAudit** : Traçabilité complète de toutes les actions
- **TableauDeBord** : Dashboards personnalisables avec widgets
- **Widget** : Composants de dashboard configurables
- **KpiData** : Indicateurs clés de performance en temps réel
- **Alerte** : Système de notifications avec sévérité
- **Export** : Gestion des exports avec historique
- **Licence** : Gestion des licences multi-niveaux
- **ParametreEntreprise** : Configuration personnalisée par entreprise
- **ParametreGlobal** : Paramètres système globaux

### **Relations Complexes :**
- Une entreprise a plusieurs utilisateurs, employés, pointages, cycles, paiements, rapports, audits
- Un employé appartient à une entreprise et une profession, avec QR code unique
- Un bulletin est lié à un employé et un cycle de paie, avec paiements associés
- Les pointages sont liés aux employés avec géolocalisation et types variés
- Les dashboards sont personnalisables avec widgets configurables
- Le système d'audit trace toutes les actions sur toutes les entités
- Les exports sont liés aux utilisateurs et entreprises avec historique

## 🔄 Workflows Métier Avancés

### **Cycle de Vie Employé Complet :**
1. **Création** : Employé avec contrat, salaire et QR code unique
2. **Intégration** : Affectation à une profession et entreprise
3. **Pointage** : Suivi quotidien avec QR code et géolocalisation
4. **Paie** : Génération périodique de bulletins automatisés
5. **Paiement** : Traitement multi-modal avec notifications
6. **Évolution** : Suivi des promotions, formations, départs
7. **Audit** : Traçabilité complète de toutes les actions

### **Processus de Paie Automatisé :**
1. **Configuration** : Cycles de paie flexibles par entreprise
2. **Génération** : Bulletins automatisés avec calculs complexes
3. **Validation** : Approbation multi-niveaux avec notifications
4. **Paiement** : Traitement avec références automatiques
5. **Archivage** : Exports automatisés et rapports détaillés
6. **Analyse** : KPIs et tableaux de bord personnalisés

### **Workflow de Pointage QR Code :**
1. **Génération** : QR codes uniques générés pour chaque employé
2. **Distribution** : QR codes envoyés ou affichés
3. **Scan** : Pointage via scanner mobile avec géolocalisation
4. **Validation** : Vérification automatique des données
5. **Enregistrement** : Sauvegarde avec IP et coordonnées GPS
6. **Rapport** : Génération des rapports de présence

### **Gestion des Alertes et Notifications :**
1. **Détection** : Seuils configurables par entreprise
2. **Classification** : Sévérité (Faible, Moyenne, Élevée, Critique)
3. **Notification** : Envoi en temps réel via WebSocket
4. **Suivi** : Lecture et archivage automatique
5. **Rapport** : Historique des alertes et actions

### **Processus d'Export et Sauvegarde :**
1. **Demande** : Interface intuitive de sélection
2. **Génération** : Traitement en arrière-plan
3. **Notification** : Avis de fin de génération
4. **Téléchargement** : Fichiers sécurisés temporaires
5. **Nettoyage** : Suppression automatique après délai

## 🚨 Gestion Avancée des Erreurs

### **Codes d'Erreur HTTP Étendus :**
- `400` : Erreur de validation des données (Zod)
- `401` : Token d'authentification requis/invalide
- `403` : Accès refusé (permissions insuffisantes)
- `404` : Ressource non trouvée
- `409` : Conflit de données (duplication, etc.)
- `422` : Données non traitables
- `429` : Trop de requêtes (rate limiting)
- `500` : Erreur serveur interne
- `503` : Service temporairement indisponible

### **Gestion d'Erreurs Centralisée :**
- Middleware d'erreur global personnalisé
- Validation automatique avec Zod schemas
- Messages d'erreur localisés en français
- Détails complets des erreurs de validation
- Stack traces en développement uniquement
- Logging structuré des erreurs

## 🛡️ Fonctionnalités de Sécurité Avancées

### **Authentification Multi-Couches :**
- **JWT** : Tokens d'accès et de rafraîchissement
- **Rotation automatique** des tokens
- **Sécurisation** des mots de passe avec bcrypt
- **Gestion des sessions** avec expiration

### **Autorisation Granulaire :**
- **RBAC** : Contrôle d'accès basé sur les rôles
- **Permissions fines** par entreprise et ressource
- **Filtrage automatique** des données sensibles
- **Audit complet** de toutes les actions

### **Sécurité Infrastructure :**
- **CORS** configuré pour les origines autorisées
- **Rate limiting** sur les endpoints sensibles
- **Validation** de toutes les entrées utilisateur
- **Protection CSRF** sur les formulaires
- **Sécurisation** des fichiers uploadés

## 📡 Communication Temps Réel (WebSocket)

### **Fonctionnalités WebSocket :**
- **Notifications push** en temps réel
- **Mises à jour de données** automatiques
- **Salles d'entreprise** isolées
- **Authentification** des connexions WebSocket
- **Gestion des déconnexions** propre

### **Événements Supportés :**
- `notification` : Alertes et avis système
- `data-update` : Rafraîchissement des données
- `user-activity` : Activités utilisateurs
- `payment-status` : Changements de statut paiement

## 📱 Pointage par QR Code

### **Génération de QR Codes :**
- **Unicité** : QR codes uniques par employé
- **Sécurité** : Codes avec timestamp et signature
- **Personnalisation** : Couleurs et logos d'entreprise
- **Expiration** : Codes renouvelables automatiquement

### **Scanning et Validation :**
- **Multi-plateforme** : Web, mobile, desktop
- **Géolocalisation** : Coordonnées GPS optionnelles
- **Vérification** : Validation temps réel des codes
- **Historique** : Traçabilité complète des scans

## 📈 Analytics et KPIs

### **Indicateurs Clés :**
- **Ressources Humaines** : Nombre d'employés, turnover, absentéisme
- **Paie** : Masse salariale, nombre de bulletins, taux de paiement
- **Performance** : Évolution salariale, productivité
- **Financier** : Budget vs réel, coûts par employé

### **Visualisations :**
- **Graphiques interactifs** : Lignes, barres, camemberts
- **Tableaux de bord** personnalisables
- **Exports** automatisés des métriques
- **Alertes** sur seuils configurables

## 🧪 Tests et Qualité

### **Tests Automatisés Complets :**
- **Unitaires** : Services et fonctions isolés
- **Intégration** : APIs et contrôleurs
- **End-to-End** : Workflows complets
- **Performance** : Tests de charge et vitesse
- **Sécurité** : Tests d'autorisation et pénétration

### **Outils de Qualité :**
- **Jest** : Framework de tests JavaScript/TypeScript
- **Supertest** : Tests d'API HTTP
- **Coverage** : Rapports de couverture de code
- **ESLint** : Linting et qualité du code
- **Prettier** : Formatage automatique du code

### **Tests Spécialisés :**
- Tests d'authentification et autorisation
- Tests de génération de QR codes
- Tests de calculs de paie complexes
- Tests de WebSocket et temps réel
- Tests de sécurité et injection de données

## 📈 Performance et Évolutivité

### **Optimisations Avancées :**
- **Base de données** : Index optimisés sur toutes les colonnes clés
- **Requêtes** : Optimisation avec Prisma et requêtes natives
- **Pagination** : Automatique pour les grandes listes
- **Cache** : Données fréquemment accédées en mémoire
- **Compression** : Réponses GZIP automatiques
- **CDN** : Support pour les assets statiques

### **Évolutivité :**
- **Architecture modulaire** : Repository et Service patterns
- **Microservices ready** : Services indépendants et déployables
- **API RESTful** : Standardisée et versionnée
- **Support multi-entreprises** : Isolation complète des données
- **Extensions faciles** : Nouvelles entités et fonctionnalités

## 🚀 Déploiement et Production

### **Environnement de Production :**
```bash
# Variables d'environnement de production
NODE_ENV=production
DATABASE_URL="mysql://user:secure_password@prod-host:3306/payroll_prod"
JWT_ACCESS_SECRET="super_secure_production_secret_min_32_chars"
JWT_REFRESH_SECRET="another_super_secure_refresh_secret"

# Configuration recommandée
ENABLE_SWAGGER=false         # Désactiver en production
ENABLE_WEBSOCKET=true        # Activer pour le temps réel
LOG_LEVEL=warn              # Réduire les logs
TRUST_PROXY=true            # Derrière reverse proxy
```

### **Scripts de Déploiement :**
```bash
cd backend
npm run build               # Build TypeScript
npm run migrate            # Appliquer migrations DB
npm run seed               # Données de production
npm start                  # Démarrer en production
```

### **Configuration Serveur :**
- **Reverse Proxy** : Nginx recommandé
- **SSL/TLS** : Certificats pour HTTPS
- **Load Balancer** : Support pour montée en charge
- **Monitoring** : Logs et métriques
- **Backup** : Stratégie de sauvegarde DB

## 🔧 DevOps et Maintenance

### **Migrations de Base de Données :**
```bash
npx prisma migrate dev      # Développement avec reset
npx prisma migrate deploy   # Production sans reset
npx prisma db seed         # Données d'initialisation
npx prisma generate        # Régénérer le client
```

### **Monitoring et Logs :**
- **Logs structurés** : JSON avec niveaux configurables
- **Métriques** : Endpoints de health check
- **Alertes** : Configuration de seuils
- **Audit** : Traçabilité complète des actions

## 🤝 Contribution

### **Guidelines de Développement :**
- Respecter les conventions de code (ESLint, Prettier)
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les APIs avec Swagger/OpenAPI
- Suivre le pattern repository/service/controller
- Créer des branches feature isolées
- Code review obligatoire avant merge

### **Processus de Contribution :**
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📋 Standards de Code

### **Conventions :**
- **TypeScript** : Typage strict partout
- **ESLint** : Configuration stricte activée
- **Prettier** : Formatage automatique
- **Commits** : Messages conventionnels (Conventional Commits)
- **Branches** : Nommage cohérent (feature/, bugfix/, hotfix/)

### **Qualité :**
- **Tests** : Couverture minimale de 80%
- **Documentation** : README mis à jour
- **Sécurité** : Audit des dépendances
- **Performance** : Tests de charge validés

## 📚 Documentation API

### **Format des Requêtes :**
- Content-Type: `application/json`
- Authorization: `Bearer <token>`

### **Exemple de Requête :**
```bash
curl -X POST http://localhost:3015/api/employes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "matricule": "EMP001",
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@entreprise.com",
    "dateEmbauche": "2024-01-01T00:00:00.000Z",
    "statutEmploi": "ACTIF",
    "typeContrat": "CDI",
    "typeSalaire": "MENSUEL",
    "salaireBase": 50000,
    "entrepriseId": 1,
    "professionId": 1
  }'
```

## 🤝 Contribution

### **Guidelines :**
- Respecter les conventions de code
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les changements
- Suivre le pattern repository/service/controller

## 📊 Feuille de Route (Roadmap)

### **Version Actuelle (v1.0) :**
- ✅ Gestion complète des employés et contrats
- ✅ Système de paie automatisé
- ✅ Pointage par QR code avec géolocalisation
- ✅ Notifications temps réel WebSocket
- ✅ Exports multi-formats (PDF, Excel, CSV, JSON)
- ✅ Dashboards personnalisables avec KPIs
- ✅ Système d'alerte avancé
- ✅ Audit trail complet
- ✅ Gestion des licences multi-niveaux

### **Futures Versions :**
- 🔄 **API Mobile** : Application mobile native
- 🔄 **Intégrations Bancaires** : Connexions automatiques
- 🔄 **IA et Automatisation** : Suggestions de paie intelligentes
- 🔄 **Multi-Devises** : Support international
- 🔄 **Workflows Approbation** : Circuits de validation avancés
- 🔄 **Rapports Avancés** : Business Intelligence intégrée
- 🔄 **API Externe** : Webhooks et intégrations tierces




## 🔗 Liens Utiles

- **Repository** : [GitHub Repository](#)
- **Documentation API** : `http://localhost:3015/api-docs`
- **Application** : `http://localhost:5173`
- **WebSocket Test** : `ws://localhost:3015`

## 📄 Licence

**Moustapha NDIAYE** 

---

**Développé par Moustapha NDIAYE pour la transformation digitale des RH en Afrique**

*Plateforme complète de gestion des salaires et des employés, conçue spécifiquement pour les entreprises africaines avec support multi-pays et réglementations locales.*
