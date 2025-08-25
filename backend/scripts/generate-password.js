#!/usr/bin/env node

import bcrypt from 'bcryptjs';

// Script pour générer des mots de passe hashés
async function generatePasswordHash(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Générer les hashs pour les mots de passe par défaut
async function main() {
  console.log('🔐 Génération des hashs de mots de passe...\n');
  
  const passwords = {
    'admin123': await generatePasswordHash('admin123'),
    'user123': await generatePasswordHash('user123')
  };
  
  console.log('Hashs générés:');
  console.log('==============\n');
  
  for (const [password, hash] of Object.entries(passwords)) {
    console.log(`Mot de passe: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('---');
  }
  
  console.log('\n📋 Pour mettre à jour le schéma de base de données:');
  console.log('1. Remplacez les hashs dans backend/src/database/schema.sql');
  console.log('2. Redémarrez le serveur pour réinitialiser la base de données');
}

main().catch(console.error);