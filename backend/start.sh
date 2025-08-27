#!/bin/bash

# Script de démarrage du backend Diligence MTND

echo "🚀 Démarrage du backend Diligence MTND..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Charger les variables d'environnement
if [ -f .env.local ]; then
    echo "🔧 Chargement de la configuration .env.local"
    export $(cat .env.local | grep -v '#' | awk '/=/ {print $1}')
fi

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur le port ${BACKEND_PORT:-3001}..."
npm start