# Architecture du Projet Diligence MTND

## Diagramme d'Architecture Global

```mermaid
graph TB
    subgraph "Frontend - Next.js 15"
        FE[Next.js App Router]
        FE --> Layout[Layout.tsx]
        FE --> Pages[Pages]
        FE --> Components[Components]
        FE --> API_Routes[API Routes]
        
        subgraph Pages
            P1[Dashboard]
            P2[Diligence List]
            P3[Diligence Detail]
            P4[Login]
            P5[Paramètres]
        end
        
        subgraph Components
            C1[Sidebar]
            C2[DiligenceForm]
            C3[DeleteModal]
            C4[Paramètres Tabs]
        end
        
        subgraph API_Routes
            AR1[/api/admin/users]
            AR2[/auth/callback]
        end
    end
    
    subgraph "Backend - Node.js/Express"
        BE[Express Server]
        BE --> Auth[Authentication]
        BE --> DB[Database Layer]
        BE --> Routes[API Routes]
        
        subgraph Routes
            R1[/api/health]
            R2[/api/users]
            R3[/api/auth/login]
            R4[/api/diligences]
            R5[/api/smtp/config]
        end
    end
    
    subgraph "Base de Données"
        DB_SQLite[SQLite Database]
        DB_SQLite --> Tables[Tables]
        
        subgraph Tables
            T1[users]
            T2[diligences]
            T3[profiles]
            T4[smtp_config]
            T5[email_logs]
        end
    end
    
    subgraph "Sécurité & Authentification"
        Auth[JWT Authentication]
        Auth --> Middleware[Middleware]
        Auth --> CORS[CORS Configuration]
    end
    
    FE -- HTTP Requests --> BE
    BE -- Database Queries --> DB_SQLite
    Auth -- Protects --> Routes
```

## Technologies et Dépendances Utilisées

### Frontend (Next.js 15)
- **Framework**: Next.js 15.4.7 avec App Router
- **UI**: React 19.1.0, Tailwind CSS 4.1.12
- **Langage**: TypeScript 5
- **Build Tools**: PostCSS, ESLint
- **Styling**: Tailwind CSS avec design system personnalisé

### Backend (Node.js/Express)
- **Runtime**: Node.js avec ES Modules
- **Framework**: Express.js 4.18.2
- **Base de données**: SQLite3 avec wrapper `sqlite`
- **Authentification**: JWT avec bcryptjs
- **Sécurité**: CORS, dotenv pour les variables d'environnement
- **Upload**: Multer pour gestion des fichiers

### Base de Données
- **Moteur**: SQLite
- **Schéma**: Tables relationnelles avec contraintes
- **Migrations**: Scripts SQL pour initialisation
- **Indexation**: Index optimisés pour les performances

### Authentification & Sécurité
- **JWT**: Tokens avec expiration 24h
- **Hashing**: bcryptjs avec salt rounds 12
- **CORS**: Configuration sécurisée cross-origin
- **Validation**: Middleware d'authentification

## Structure des Dossiers

```
diligence_mtnd/
├── backend/                 # Serveur Node.js/Express
│   ├── src/
│   │   ├── server.js       # Point d'entrée principal
│   │   └── database/
│   │       ├── db.js       # Gestionnaire de base de données
│   │       └── schema.sql  # Schéma de la base de données
│   └── package.json
├── src/                    # Frontend Next.js
│   ├── app/               # App Router
│   │   ├── api/           # Routes API Next.js
│   │   ├── diligence/     # Pages de gestion des diligences
│   │   ├── login/         # Page de connexion
│   │   ├── parametres/    # Page de paramètres
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Page d'accueil
│   ├── components/        # Composants React
│   │   ├── ui/           # Composants d'interface
│   │   ├── Diligence/    # Composants spécifiques aux diligences
│   │   └── Parametres/   # Composants de paramètres
│   └── lib/              # Utilitaires et configurations
│       └── api/          # Client API pour communiquer avec le backend
├── database.sqlite       # Base de données SQLite
└── Configuration files (package.json, tsconfig.json, etc.)
```

## Flux de Données

1. **Authentification**:
   - Utilisateur se connecte via le formulaire de login
   - Le frontend envoie les credentials au backend `/api/auth/login`
   - Le backend valide et retourne un JWT
   - Le token est stocké dans le localStorage

2. **Gestion des Diligences**:
   - Les composants frontend utilisent le client API (`/lib/api/client.js`)
   - Les requêtes sont envoyées au backend Express
   - Le backend exécute les opérations sur la base de données SQLite
   - Les réponses sont retournées au frontend

3. **Sécurité**:
   - Middleware JWT vérifie les tokens sur les routes protégées
   - CORS configure les origines autorisées
   - Validation des données côté backend

## Points Forts de l'Architecture

- **Séparation claire** entre frontend et backend
- **API RESTful** bien structurée
- **Sécurité** implémentée avec JWT et bcrypt
- **Base de données** relationnelle avec schéma solide
- **Code modulaire** avec composants réutilisables
- **Configuration** centralisée avec variables d'environnement

## Évolutions Possibles

- Ajout de tests unitaires et d'intégration
- Implémentation de websockets pour les notifications en temps réel
- Migration vers une base de données plus scalable (PostgreSQL)
- Ajout de caching Redis pour les performances
- Intégration de monitoring et logging