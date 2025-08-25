# Backend Node.js - Application de Diligence

Ce backend remplace l'ancienne configuration Supabase par une solution autonome avec SQLite.

## Structure de la base de données

### Tables principales:
- **users**: Gestion des utilisateurs (admin/user)
- **diligences**: Suivi des tâches et diligences
- **smtp_config**: Configuration des emails SMTP
- **diligence_files**: Fichiers joints aux diligences
- **email_logs**: Historique des emails envoyés

## Installation et démarrage

1. **Installer les dépendances:**
```bash
cd backend
npm install
```

2. **Configurer l'environnement:**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

3. **Démarrer le serveur:**
```bash
# Mode développement avec rechargement automatique
npm run dev

# Mode production
npm start
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs

### Diligences
- `GET /api/diligences` - Liste des diligences

### Santé du serveur
- `GET /api/health` - Vérification du statut du serveur

## Configuration

### Variables d'environnement (.env)
```env
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=./database.sqlite
JWT_SECRET=votre_secret_jwt
```

### Configuration SMTP
La configuration SMTP est stockée dans la table `smtp_config` et peut être gérée via l'interface administrateur.

## Sécurité

- Authentification basée sur JWT (à implémenter)
- Hashage des mots de passe avec bcrypt
- Validation des entrées utilisateur
- CORS configuré pour le frontend

## Déploiement

1. Construire l'application:
```bash
npm install --production
```

2. Démarrer avec PM2 (recommandé):
```bash
npm install -g pm2
pm2 start src/server.js --name diligence-backend
```

## Développement

Le serveur utilise nodemon pour le rechargement automatique pendant le développement.

## Base de données

La base de données SQLite est automatiquement créée et initialisée au premier démarrage. Le fichier de base de données est stocké à la racine du projet.

### Migration des données
Pour migrer les données depuis Supabase, des scripts d'import devront être développés en fonction de la structure existante.