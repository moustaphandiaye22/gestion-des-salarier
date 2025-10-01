# SalairePro Multi-Entreprises

## 📋 Description

Système complet de gestion des salaires et des employés pour les entreprises, avec une architecture multi-entreprises sécurisée et des contrôles d'accès avancés basés sur les rôles.

## 🚀 Fonctionnalités

### 🔐 Système d'Authentification et d'Autorisation

#### **Rôles Utilisateur :**
- **Super Admin** : Contrôle total du système, accès à toutes les entreprises
- **Admin d'Entreprise** : Gestion exclusive de son entreprise
- **Employé** : Accès limité à ses propres données

#### **Sécurité :**
- Authentification JWT avec tokens d'accès et de rafraîchissement
- Contrôle d'accès basé sur les rôles (RBAC)
- Filtrage automatique des données par entreprise
- Middleware de sécurité sur toutes les routes

### 👥 Gestion des Employés

#### **Administrateur d'Entreprise :**
- ✅ **UC_AE001** : Gérer les employés (CRUD complet)
- ✅ **UC_AE002** : Créer et configurer les cycles de paie
- ✅ **UC_AE003** : Approuver les bulletins de paie
- ✅ **UC_AE004** : Consulter le dashboard entreprise
- ✅ **UC_AE005** : Gérer les utilisateurs de son entreprise
- ✅ **UC_AE006** : Configurer les paramètres de paie
- ✅ **UC_AE007** : Générer les rapports d'entreprise
- ✅ **UC_AE008** : Exporter les données de paie

#### **Fonctionnalités Employés :**
- Gestion complète du cycle de vie des employés
- Types de contrats : CDI, CDD, Intérim, Stage
- Types de salaire : Mensuel, Honoraires, Journalier
- Gestion des professions et catégories
- Calcul automatique des allocations et déductions

### 📊 Gestion des Bulletins de Paie

#### **Fonctionnalités :**
- Génération automatique des bulletins
- Calcul des salaires, allocations et déductions
- Gestion des périodes de paie
- Approbation et validation des bulletins
- Export PDF des bulletins
- Suivi des statuts de paiement

### 💰 Gestion des Paiements

#### **Fonctionnalités :**
- Enregistrement des paiements effectués
- Modes de paiement : Espèces, Chèque, Virement, Wave, Orange Money
- Suivi des statuts : En attente, Payé, Échec
- Référence de paiement automatique
- Lien avec les bulletins de paie

### 📈 Cycles de Paie

#### **Fonctionnalités :**
- Configuration des cycles de paie par entreprise
- Fréquences : Mensuel, Hebdomadaire, Quinzaine
- Gestion des périodes de début et fin
- Statuts : Ouvert, Fermé
- Association avec les bulletins

### 📋 Rapports et Analytics

#### **Types de Rapports :**
- Rapports de bulletins de paie
- Rapports d'employés
- Rapports de paiements
- Rapports statistiques

#### **Fonctionnalités :**
- Génération automatique des rapports
- Filtres par entreprise, période, statut
- Export des données
- Dashboard avec métriques clés

### 👥 Gestion des Utilisateurs

#### **Fonctionnalités :**
- Gestion des comptes utilisateurs
- Attribution des rôles par entreprise
- Activation/désactivation des comptes
- Gestion des permissions

### ⚙️ Paramètres d'Entreprise

#### **Configuration :**
- Paramètres de devise (XOF)
- Configuration de langue (Français)
- Fréquence de paie
- Paramètres spécifiques à chaque entreprise

### 📊 Dashboard Dynamique

#### **Admin d'Entreprise :**
- Vue filtrée sur son entreprise uniquement
- Métriques calculées sur SES données
- Indicateurs personnalisés

#### **Super Admin :**
- Vue globale du système
- Sélection d'entreprise pour analyse détaillée
- Métriques consolidées

## 🛠️ Architecture Technique

### **Backend (Node.js + TypeScript)**
```
backend/
├── src/
│   ├── auth/                 # Authentification JWT
│   ├── config/               # Configuration (DB, env)
│   ├── controller/           # Contrôleurs API
│   ├── middleware/           # Middleware (auth, RBAC)
│   ├── repositories/         # Couche d'accès aux données
│   ├── routes/               # Définition des routes
│   ├── service/              # Logique métier
│   ├── validators/           # Validation des données (Zod)
│   └── utils/                # Utilitaires
├── prisma/
│   └── schema.prisma         # Schéma de base de données
```

### **Frontend (React + Vite)**
```
frontend/
├── src/
│   ├── components/           # Composants réutilisables
│   ├── pages/                # Pages de l'application
│   ├── context/              # Contextes React (Auth)
│   ├── utils/                # API client et utilitaires
│   └── styles/               # Styles et thème
├── public/                   # Assets statiques
```

### **Base de Données**
- **MySQL** avec Prisma ORM
- Schéma relationnel optimisé
- Migrations automatisées

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
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### **Backend :**
```bash
cd backend
npm install
# Configuration de la base de données
cp .env.example .env
# Modifier les variables d'environnement
npm run dev
```

### **Frontend :**
```bash
cd frontend
npm install
npm run dev
```

### **Base de Données :**
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma seed  # Données de test
```

## 🔧 Configuration

### **Variables d'Environnement (.env) :**
```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/payroll_db"

# JWT
JWT_ACCESS_SECRET=votre_secret_access
JWT_REFRESH_SECRET=votre_secret_refresh

# Serveur
PORT=3015
NODE_ENV=development
```

## 📡 API Endpoints

### **Authentification :**
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/refresh` - Rafraîchissement du token
- `POST /api/auth/logout` - Déconnexion

### **Employés :**
- `GET /api/employes` - Liste des employés (filtré par rôle)
- `POST /api/employes` - Créer un employé
- `GET /api/employes/:id` - Détails d'un employé
- `PUT /api/employes/:id` - Modifier un employé
- `DELETE /api/employes/:id` - Supprimer un employé

### **Bulletins de Paie :**
- `GET /api/bulletins` - Liste des bulletins (filtré par rôle)
- `POST /api/bulletins` - Créer un bulletin
- `GET /api/bulletins/:id` - Détails d'un bulletin
- `PUT /api/bulletins/:id` - Modifier un bulletin
- `DELETE /api/bulletins/:id` - Supprimer un bulletin
- `GET /api/bulletins/:id/pdf` - Télécharger le PDF

### **Paiements :**
- `GET /api/paiements` - Liste des paiements (filtré par rôle)
- `POST /api/paiements` - Enregistrer un paiement
- `GET /api/paiements/:id` - Détails d'un paiement
- `PUT /api/paiements/:id` - Modifier un paiement
- `DELETE /api/paiements/:id` - Supprimer un paiement

### **Entreprises :**
- `GET /api/entreprises` - Liste des entreprises (filtré par rôle)
- `POST /api/entreprises` - Créer une entreprise
- `GET /api/entreprises/:id` - Détails d'une entreprise
- `PUT /api/entreprises/:id` - Modifier une entreprise
- `DELETE /api/entreprises/:id` - Supprimer une entreprise

### **Cycles de Paie :**
- `GET /api/cycles-paie` - Liste des cycles (filtré par rôle)
- `POST /api/cycles-paie` - Créer un cycle
- `GET /api/cycles-paie/:id` - Détails d'un cycle
- `PUT /api/cycles-paie/:id` - Modifier un cycle
- `DELETE /api/cycles-paie/:id` - Supprimer un cycle

### **Rapports :**
- `GET /api/rapports` - Liste des rapports (filtré par rôle)
- `POST /api/rapports` - Générer un rapport
- `GET /api/rapports/:id` - Détails d'un rapport
- `PUT /api/rapports/:id` - Modifier un rapport
- `DELETE /api/rapports/:id` - Supprimer un rapport

### **Utilisateurs :**
- `GET /api/utilisateurs` - Liste des utilisateurs (filtré par rôle)
- `POST /api/utilisateurs` - Créer un utilisateur
- `GET /api/utilisateurs/:id` - Détails d'un utilisateur
- `PUT /api/utilisateurs/:id` - Modifier un utilisateur
- `DELETE /api/utilisateurs/:id` - Supprimer un utilisateur

### **Paramètres d'Entreprise :**
- `GET /api/parametres-entreprise` - Liste des paramètres (filtré par rôle)
- `POST /api/parametres-entreprise` - Créer un paramètre
- `GET /api/parametres-entreprise/:id` - Détails d'un paramètre
- `PUT /api/parametres-entreprise/:id` - Modifier un paramètre
- `DELETE /api/parametres-entreprise/:id` - Supprimer un paramètre

## 👥 Comptes de Test

### **Super Admin :**
- **Email** : `superadmin@payrollplatform.com`
- **Mot de passe** : `superadmin123`
- **Accès** : Toutes les entreprises et fonctionnalités

### **Admin d'Entreprise (TechCorp) :**
- **Email** : `admin@techcorp.sn`
- **Mot de passe** : `admin123`
- **Entreprise** : TechCorp Senegal uniquement

### **Admin d'Entreprise (AgriSolutions) :**
- **Email** : `admin@agrisolutions.ml`
- **Mot de passe** : `admin123`
- **Entreprise** : AgriSolutions Mali uniquement

### **Employé :**
- **Email** : `employe@techcorp.sn`
- **Mot de passe** : `employe123`
- **Accès** : Données personnelles uniquement

## 📊 Modèle de Données

### **Entités Principales :**
- **Entreprise** : Entités organisationnelles
- **Utilisateur** : Comptes d'accès au système
- **Employe** : Salariés des entreprises
- **Bulletin** : Bulletins de paie générés
- **Paiement** : Enregistrements de paiements
- **CyclePaie** : Périodes de paie
- **Rapport** : Rapports générés
- **Profession** : Métiers et catégories

### **Relations :**
- Une entreprise a plusieurs utilisateurs et employés
- Un employé appartient à une entreprise et une profession
- Un bulletin est lié à un employé et un cycle de paie
- Un paiement est associé à un bulletin

## 🔄 Workflows Métier

### **Cycle de Vie Employé :**
1. Création de l'employé avec contrat et salaire
2. Affectation à une profession
3. Génération périodique de bulletins
4. Traitement des paiements
5. Suivi des évolutions (promotion, départ)

### **Processus de Paie :**
1. Configuration du cycle de paie
2. Génération des bulletins
3. Validation par l'admin
4. Traitement des paiements
5. Archivage et reporting

## 🚨 Gestion des Erreurs

### **Codes d'Erreur HTTP :**
- `400` : Erreur de validation des données
- `401` : Token d'authentification requis
- `403` : Accès refusé (permissions insuffisantes)
- `404` : Ressource non trouvée
- `500` : Erreur serveur interne

### **Messages d'Erreur :**
- Validation automatique avec Zod
- Messages d'erreur localisés en français
- Détails des erreurs de validation

## 📈 Performance et Évolutivité

### **Optimisations :**
- Requêtes de base de données optimisées
- Index sur les colonnes fréquemment utilisées
- Pagination automatique pour les grandes listes
- Cache des données fréquemment accédées

### **Évolutivité :**
- Architecture modulaire (repository pattern)
- Services indépendants et testables
- Support de nouvelles entités facilement
- API RESTful standardisée

## 🧪 Tests

### **Tests Automatisés :**
- Tests unitaires des services
- Tests d'intégration des contrôleurs
- Tests des repositories
- Tests de sécurité et d'autorisation

### **Tests Manuels :**
- Tests fonctionnels des workflows
- Tests de sécurité par rôle
- Tests de performance

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

## 📄 Licence

Ce projet est développé pour la gestion des salaires en entreprise.

---

**Développé avec ❤️ pour la gestion moderne des salaires d'entreprise**
