# Configuration du Stockage Supabase

## Création du Bucket "diligence-file"

Pour que l'upload des fichiers fonctionne correctement, vous devez créer un bucket dans Supabase Storage. Deux méthodes sont disponibles :

### Méthode 1: Automatique (Recommandée)

Cette méthode utilise un script qui crée automatiquement le bucket via l'API Supabase.

#### Prérequis :
1. Obtenez votre clé de service depuis le tableau de bord Supabase
   - Allez dans Settings → API → Service Role Key
   - Copiez la clé de service

2. Configurez la variable d'environnement :
```bash
export SUPABASE_SERVICE_ROLE_KEY="votre_clé_service"
```

3. Installez les dépendances (si ce n'est pas déjà fait) :
```bash
npm install
```

#### Création du bucket :
```bash
npm run create-bucket
```

### Méthode 2: Manuellement via l'interface

Si vous préférez créer le bucket manuellement :

1. **Allez sur le tableau de bord Supabase**
   - Ouvrez https://supabase.com/dashboard
   - Connectez-vous à votre compte

2. **Sélectionnez votre projet**
   - Choisissez le projet correspondant à cette application

3. **Allez dans la section "Storage"**
   - Dans le menu de gauche, cliquez sur "Storage" → "Buckets"

4. **Créez un nouveau bucket**
   - Cliquez sur le bouton "New Bucket"
   - Nom : `diligence-file`
   - Public : ✅ **Cocher cette option** (bucket public pour permettre à tous d'uploader)
   - File size limit : `52428800` (50MB)
   - Allowed MIME types : Laisser vide ou restreindre aux types souhaités

5. **Configuration automatique des politiques**
   - Avec un bucket public, les politiques RLS sont automatiquement configurées
   - Tous les utilisateurs authentifiés pourront uploader des fichiers
   - Tous les utilisateurs (même non authentifiés) pourront lire les fichiers

### Structure des fichiers

Les fichiers sont organisés dans une structure de dossiers :
- `diligence-{ID}/` - Dossier par diligence
- `diligence-{ID}/timestamp_nomfichier.pdf` - Fichiers individuels

### URLs Publiques

Pour les buckets publics, l'application utilise des URLs publiques permanentes pour l'accès aux fichiers.

### Avantages du bucket public

- ✅ Aucune configuration manuelle des politiques RLS nécessaire
- ✅ Tous les utilisateurs authentifiés peuvent uploader des fichiers
- ✅ Accès simple aux fichiers sans URLs signées
- ✅ Configuration automatique par l'application

### Dépannage

Si vous rencontrez des erreurs :

1. **Erreur RLS "new row violates row-level security policy"**
   - Cette erreur ne devrait plus se produire avec un bucket public
   - Si elle persiste, vérifiez que le bucket est bien configuré comme "Public"

2. **Vérifiez les variables d'environnement**
   - Assurez-vous que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont correctement configurées

3. **Vérifiez les permissions du bucket**
   - Le bucket doit être public pour un fonctionnement automatique

4. **Vérifiez la taille des fichiers**
   - Assurez-vous que les fichiers ne dépassent pas 50MB

5. **Types de fichiers autorisés**
   - L'application accepte principalement les PDF mais peut gérer d'autres types