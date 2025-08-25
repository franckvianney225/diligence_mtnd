# Configuration de la Base de Données Supabase

## 1. Création de la table `diligences`

### Méthode 1 : Via l'éditeur SQL de Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans "SQL Editor" dans le menu de gauche
4. Copiez-collez le contenu du fichier `schema_diligences.sql`
5. Exécutez la requête

### Méthode 2 : Via l'interface Table Editor

1. Allez dans "Table Editor" → "Create a new table"
2. Configurez les colonnes suivantes :

| Nom de colonne | Type | Contraintes | Default |
|----------------|------|-------------|---------|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| titre | text | NOT NULL | - |
| directiondestinataire | text | NOT NULL | - |
| datedebut | date | NOT NULL | - |
| datefin | date | NOT NULL | - |
| description | text | NOT NULL | - |
| priorite | text | CHECK: Haute,Moyenne,Basse | 'Moyenne' |
| statut | text | CHECK: Planifié,En cours,Terminé,En retard | 'Planifié' |
| destinataire | text | - | - |
| piecesjointes | text[] | - | '{}' |
| progression | integer | CHECK: 0-100 | 0 |
| created_at | timestamptz | - | now() |
| updated_at | timestamptz | - | now() |

## 2. Configuration des politiques RLS (Row Level Security)

La table doit avoir RLS activé avec les politiques suivantes :

- **SELECT**: Tous les utilisateurs authentifiés peuvent lire
- **INSERT**: Tous les utilisateurs authentifiés peuvent créer
- **UPDATE**: Tous les utilisateurs authentifiés peuvent modifier
- **DELETE**: Tous les utilisateurs authentifiés peuvent supprimer

## 3. Création du bucket de stockage

Suivez les instructions dans `SETUP_STORAGE.md` pour créer le bucket `diligences-files`.

## 4. Vérification de la configuration

Après configuration, testez que :

1. ✅ La table `diligences` existe avec toutes les colonnes
2. ✅ Les politiques RLS sont correctement configurées
3. ✅ Le bucket `diligences-files` existe et est public
4. ✅ Les variables d'environnement sont correctes dans `.env.local`

## 5. Test de fonctionnement

1. Lancez l'application avec `npm run dev`
2. Connectez-vous
3. Allez dans la section "Diligences"
4. Essayez de créer une nouvelle diligence
5. Vérifiez qu'elle s'affiche dans la liste

## Dépannage

### Erreur "relation 'diligences' does not exist"
- La table n'a pas été créée
- Exécutez le script SQL dans l'éditeur SQL

### Erreur RLS "new row violates row-level security policy"
- Les politiques RLS ne sont pas correctement configurées
- Vérifiez que les politiques permettent INSERT aux authenticated

### Erreur d'upload de fichiers
- Le bucket `diligences-files` n'existe pas
- Vérifiez la configuration du bucket dans Supabase Storage

### Erreur de connexion à Supabase
- Vérifiez les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Assurez-vous qu'elles correspondent à votre projet