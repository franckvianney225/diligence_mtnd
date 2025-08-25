"use client"

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface DiligenceData {
  titre: string;
  directionDestinataire: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  priorite: string;
  statut: string;
  destinataire: string | null;
  piecesJointes: string[];
}

interface DiligenceFormProps {
  onClose: () => void;
  onSubmit: (formData: DiligenceData & { piecesJointesFiles: File[] }) => void;
  initialData?: Partial<DiligenceData>;
}

export default function DiligenceForm({ onClose, onSubmit, initialData }: DiligenceFormProps) {
  const [formData, setFormData] = useState({
    titre: '',
    directionDestinataire: '',
    dateDebut: '',
    dateFin: '',
    description: '',
    priorite: 'Moyenne',
    statut: 'Planifié',
    destinataire: null as string | null,
    piecesJointes: [] as string[]
  });
  const [piecesJointesFiles, setPiecesJointesFiles] = useState<File[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Charger les utilisateurs depuis notre API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await apiClient.getUsers();
        const formattedUsers = response.map((user: User) => ({
          id: user.id.toString(),
          email: user.email || 'Email non défini',
          name: user.name || user.email || `Utilisateur ${user.id}`,
          role: user.role || 'user'
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        // Fallback en cas d'erreur
        setUsers([
          { id: '1', email: 'admin@example.com', name: 'Administrateur', role: 'admin' },
          { id: '2', email: 'user1@example.com', name: 'Utilisateur 1', role: 'user' },
          { id: '3', email: 'user2@example.com', name: 'Utilisateur 2', role: 'user' }
        ]);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // Remplir le formulaire si on modifie une diligence existante
  useEffect(() => {
    if (initialData) {
      setFormData({
        titre: initialData.titre || '',
        directionDestinataire: initialData.directionDestinataire || '',
        dateDebut: initialData.dateDebut || '',
        dateFin: initialData.dateFin || '',
        description: initialData.description || '',
        priorite: initialData.priorite || 'Moyenne',
        statut: initialData.statut || 'Planifié',
        destinataire: initialData.destinataire || null,
        piecesJointes: initialData.piecesJointes || []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer un objet avec les données du formulaire
    const diligenceData = {
      ...formData,
      piecesJointes: formData.piecesJointes, // Noms des fichiers
      piecesJointesFiles: piecesJointesFiles // Objets File pour l'upload
    };
    
    onSubmit(diligenceData);
  };

  const isEditing = !!initialData;

  return (
    <div 
      className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center p-4 z-50" 
      onClick={onClose}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/30" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? '✏️ Modifier la Diligence' : '📋 Nouvelle Diligence'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la diligence</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  placeholder="Ex: Audit financier ministère"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Direction du destinataire</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                  value={formData.directionDestinataire}
                  onChange={(e) => setFormData({...formData, directionDestinataire: e.target.value})}
                  placeholder="Ex: Direction des Finances"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinataire</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                  value={formData.destinataire || ''}
                  onChange={(e) => setFormData({...formData, destinataire: e.target.value || null})}
                  required
                  disabled={loadingUsers}
                >
                  <option value="">Sélectionner un destinataire</option>
                  {loadingUsers ? (
                    <option value="">Chargement des utilisateurs...</option>
                  ) : (
                    users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                  value={formData.priorite}
                  onChange={(e) => setFormData({...formData, priorite: e.target.value})}
                >
                  <option value="Haute">🔴 Haute</option>
                  <option value="Moyenne">🟡 Moyenne</option>
                  <option value="Basse">🟢 Basse</option>
                </select>
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                    value={formData.statut}
                    onChange={(e) => setFormData({...formData, statut: e.target.value})}
                  >
                    <option value="Planifié">📅 Planifié</option>
                    <option value="En cours">🔄 En cours</option>
                    <option value="Terminé">✅ Terminé</option>
                    <option value="En retard">⚠️ En retard</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin prévue</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                  value={formData.dateFin}
                  onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white/80"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez les objectifs et le périmètre de cette diligence..."
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Pièces jointes (PDF)</label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      setPiecesJointesFiles([...piecesJointesFiles, ...newFiles]);
                      setFormData({
                        ...formData,
                        piecesJointes: [...formData.piecesJointes, ...newFiles.map(file => file.name)]
                      });
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 transition-colors text-center"
                >
                  📄 Ajouter des fichiers PDF
                </label>
                
                {formData.piecesJointes.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.piecesJointes.map((fileName, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700 truncate max-w-xs">
                          {fileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFiles = [...piecesJointesFiles];
                            updatedFiles.splice(index, 1);
                            setPiecesJointesFiles(updatedFiles);
                            
                            const updatedFileNames = [...formData.piecesJointes];
                            updatedFileNames.splice(index, 1);
                            setFormData({
                              ...formData,
                              piecesJointes: updatedFileNames
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                {isEditing ? 'Modifier la Diligence' : 'Créer la Diligence'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
