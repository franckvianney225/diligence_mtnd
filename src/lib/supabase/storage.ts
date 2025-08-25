import { supabase } from './client';

export const BUCKET_NAME = 'diligences-files';

/**
 * Vérifie si un bucket existe et le crée si nécessaire
 */
export const ensureBucketExists = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Erreur lors de la vérification des buckets:', error);
      return false;
    }

    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.warn(`⚠️ Le bucket "${BUCKET_NAME}" n'existe pas.`);
      console.warn(`📋 Veuillez créer manuellement le bucket dans l'interface Supabase:`);
      console.warn('1. Allez sur https://supabase.com/dashboard');
      console.warn('2. Sélectionnez votre projet');
      console.warn('3. Allez dans "Storage" → "Buckets"');
      console.warn(`4. Créez un nouveau bucket nommé "${BUCKET_NAME}"`);
      console.warn('5. Configurez-le comme "Public"');
      console.warn('6. Définissez la limite de taille à 50MB');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification du bucket:', error);
    return false;
  }
};

/**
 * Récupère l'URL publique d'un fichier (pour les buckets publics)
 */
export const getPublicFileUrl = async (filePath: string): Promise<string> => {
  const { data } = await supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Upload un fichier vers Supabase Storage avec structure par diligence
 */
export const uploadFile = async (diligenceId: string, file: File): Promise<string> => {
  const filePath = `diligence-${diligenceId}/${Date.now()}_${file.name}`;
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) {
    throw new Error(`Erreur lors de l'upload: ${error.message}`);
  }

  return filePath;
};

/**
 * Supprime des fichiers de Supabase Storage
 */
export const deleteFiles = async (filePaths: string[]): Promise<void> => {
  if (filePaths.length === 0) return;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(filePaths);

  if (error) {
    console.error('Erreur lors de la suppression des fichiers:', error);
    throw new Error(`Erreur lors de la suppression: ${error.message}`);
  }
};

/**
 * Liste les fichiers d'une diligence spécifique
 */
export const listDiligenceFiles = async (diligenceId: string): Promise<string[]> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(`diligence-${diligenceId}`);

  if (error) {
    console.error('Erreur lors du listing des fichiers:', error);
    return [];
  }

  return data?.map(file => file.name) || [];
};