-- Schéma de la table diligences pour Supabase
-- À exécuter dans l'éditeur SQL de Supabase

CREATE TABLE IF NOT EXISTS public.diligences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre TEXT NOT NULL,
    directiondestinataire TEXT NOT NULL,
    datedebut DATE NOT NULL,
    datefin DATE NOT NULL,
    description TEXT NOT NULL,
    priorite TEXT CHECK (priorite IN ('Haute', 'Moyenne', 'Basse')) NOT NULL DEFAULT 'Moyenne',
    statut TEXT CHECK (statut IN ('Planifié', 'En cours', 'Terminé', 'En retard')) NOT NULL DEFAULT 'Planifié',
    destinataire TEXT,
    piecesjointes TEXT[] DEFAULT '{}',
    progression INTEGER DEFAULT 0 CHECK (progression >= 0 AND progression <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_diligences_statut ON public.diligences(statut);
CREATE INDEX IF NOT EXISTS idx_diligences_priorite ON public.diligences(priorite);
CREATE INDEX IF NOT EXISTS idx_diligences_datefin ON public.diligences(datefin);
CREATE INDEX IF NOT EXISTS idx_diligences_created_at ON public.diligences(created_at DESC);

-- Politique RLS (Row Level Security)
ALTER TABLE public.diligences ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs authentifiés de lire les diligences
CREATE POLICY "Les utilisateurs authentifiés peuvent lire toutes les diligences" 
ON public.diligences FOR SELECT 
TO authenticated 
USING (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de créer des diligences
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des diligences" 
ON public.diligences FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de modifier les diligences
CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les diligences" 
ON public.diligences FOR UPDATE 
TO authenticated 
USING (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de supprimer les diligences
CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer les diligences" 
ON public.diligences FOR DELETE 
TO authenticated 
USING (true);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_diligences_updated_at 
    BEFORE UPDATE ON public.diligences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires sur la table
COMMENT ON TABLE public.diligences IS 'Table de gestion des diligences gouvernementales';
COMMENT ON COLUMN public.diligences.titre IS 'Titre de la diligence';
COMMENT ON COLUMN public.diligences.directiondestinataire IS 'Direction du destinataire';
COMMENT ON COLUMN public.diligences.datedebut IS 'Date de début de la diligence';
COMMENT ON COLUMN public.diligences.datefin IS 'Date de fin prévue de la diligence';
COMMENT ON COLUMN public.diligences.description IS 'Description détaillée de la diligence';
COMMENT ON COLUMN public.diligences.priorite IS 'Priorité de la diligence (Haute, Moyenne, Basse)';
COMMENT ON COLUMN public.diligences.statut IS 'Statut de la diligence (Planifié, En cours, Terminé, En retard)';
COMMENT ON COLUMN public.diligences.destinataire IS 'Destinataire de la diligence (UUID ou nom)';
COMMENT ON COLUMN public.diligences.piecesjointes IS 'Liste des chemins des fichiers joints dans le storage';
COMMENT ON COLUMN public.diligences.progression IS 'Pourcentage de progression de la diligence (0-100)';