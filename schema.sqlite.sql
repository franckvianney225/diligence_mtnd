-- Schéma de la table diligences pour SQLite
-- À exécuter lors de l'initialisation de la base de données

CREATE TABLE IF NOT EXISTS diligences (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-a' || substr(lower(hex(randomblob(2))), 2) || '-' || lower(hex(randomblob(6)))),
    titre TEXT NOT NULL,
    directiondestinataire TEXT NOT NULL,
    datedebut TEXT NOT NULL, -- SQLite stocke les dates en TEXT
    datefin TEXT NOT NULL,
    description TEXT NOT NULL,
    priorite TEXT CHECK (priorite IN ('Haute', 'Moyenne', 'Basse')) NOT NULL DEFAULT 'Moyenne',
    statut TEXT CHECK (statut IN ('Planifié', 'En cours', 'Terminé', 'En retard')) NOT NULL DEFAULT 'Planifié',
    destinataire TEXT,
    piecesjointes TEXT DEFAULT '[]', -- Stocké comme JSON string
    progression INTEGER DEFAULT 0 CHECK (progression >= 0 AND progression <= 100),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_diligences_statut ON diligences(statut);
CREATE INDEX IF NOT EXISTS idx_diligences_priorite ON diligences(priorite);
CREATE INDEX IF NOT EXISTS idx_diligences_datefin ON diligences(datefin);
CREATE INDEX IF NOT EXISTS idx_diligences_created_at ON diligences(created_at);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER IF NOT EXISTS update_diligences_updated_at 
    AFTER UPDATE ON diligences
    FOR EACH ROW
    WHEN OLD.updated_at IS NOT NEW.updated_at
BEGIN
    UPDATE diligences SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Table pour les utilisateurs (si nécessaire pour l'authentification)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT (datetime('now'))
);