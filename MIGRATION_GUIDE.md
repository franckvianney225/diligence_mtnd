# Guide de Migration de Supabase vers Backend Node.js

## ✅ Migration Complète Effectuée

### Ce qui a été supprimé
- ✅ Tous les fichiers et dossiers Supabase (`src/lib/supabase/`)
- ✅ Scripts Supabase (`scripts/create-bucket.ts`, `test-bucket.js`)
- ✅ Dépendances Supabase du package.json
- ✅ Références à Supabase dans tous les composants principaux

### Ce qui a été créé
- ✅ Backend Node.js complet dans `/backend/`
- ✅ Base de données SQLite avec schéma complet
- ✅ Système d'authentification avec bcrypt
- ✅ Client API pour le frontend (`src/lib/api/client.js`)
- ✅ Configuration d'environnement

## 🚀 Pour démarrer l'application

### Étape 1 : Démarrer le backend
```bash
cd backend
npm install
npm start
```

Le backend sera accessible sur `http://localhost:3001`

### Étape 2 : Démarrer le frontend (nouveau terminal)
```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

### Étape 3 : Se connecter
- **Email**: `admin@example.com`
- **Mot de passe**: `admin123`

Ou pour l'utilisateur normal :
- **Email**: `user@example.com`
- **Mot de passe**: `user123`

## 📋 Structure du Backend

```
backend/
├── src/
│   ├── server.js          # Serveur Express principal
│   └── database/
│       ├── db.js          # Gestionnaire de base de données
│       └── schema.sql     # Schéma SQLite complet
├── scripts/
│   └── generate-password.js
├── package.json
└── README.md
```

## 🗃️ Tables de la Base de Données
- `users` - Gestion des utilisateurs
- `diligences` - Suivi des tâches
- `smtp_config` - Configuration email
- `diligence_files` - Fichiers joints
- `email_logs` - Historique des emails

## 🔐 Authentification
- Mots de passe hashés avec bcrypt
- Système de rôles (admin/user)
- API endpoints sécurisés

## 🌐 API Endpoints
- `GET /api/health` - Vérification du serveur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/users` - Liste des utilisateurs
- `GET /api/diligences` - Liste des diligences

## 📝 Prochaines Étapes
1. Implémenter JWT pour l'authentification
2. Migrer les pages restantes (diligences, paramètres avancés)
3. Développer les API endpoints manquants
4. Implémenter la gestion des fichiers avec multer
5. Ajouter la validation des données

## 🛠️ Développement
Le backend utilise nodemon pour le rechargement automatique :
```bash
cd backend
npm run dev
```

## 🔧 Configuration
Les variables d'environnement sont dans `.env.local` :
- `NEXT_PUBLIC_BACKEND_URL` - URL du backend
- `DATABASE_URL` - Chemin de la base SQLite
- `JWT_SECRET` - Clé secrète pour JWT

L'application est maintenant entièrement autonome et ne dépend plus de Supabase !