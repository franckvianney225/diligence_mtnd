"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DiligenceForm from "@/components/DiligenceForm";
import DeleteModal from "@/components/DeleteModal";
import DetailsDiligence from "@/components/Diligence/DetailsDiligence";
import { supabase } from "@/lib/supabase/client";
import { uploadFile, deleteFiles, ensureBucketExists, getPublicFileUrl, BUCKET_NAME } from "@/lib/supabase/storage";

interface Diligence {
  id: string;
  titre: string;
  directiondestinataire: string;
  datedebut: string;
  datefin: string;
  description: string;
  priorite: "Haute" | "Moyenne" | "Basse";
  statut: "Planifié" | "En cours" | "Terminé" | "En retard";
  destinataire: string | null;
  piecesjointes: string[];
  progression: number;
  created_at: string;
  updated_at: string;
}

interface DiligenceFormData {
  titre: string;
  directionDestinataire: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  priorite: string;
  statut: string;
  destinataire: string | null;
  piecesJointes: string[];
  piecesJointesFiles: File[];
}

export default function DiligencePage() {
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('diligenceViewMode') || 'table';
    }
    return 'table';
  });
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDiligence, setEditingDiligence] = useState<Diligence | null>(null);
  const [diligenceToDelete, setDiligenceToDelete] = useState<Diligence | null>(null);
  const [selectedDiligence, setSelectedDiligence] = useState<Diligence | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('diligenceItemsPerPage');
      return saved ? parseInt(saved) : 6;
    }
    return 6;
  });
  const [filters, setFilters] = useState({
    search: '',
    statut: '',
    priorite: '',
    dateDebut: '',
    dateFin: ''
  });
  const [allDiligences, setAllDiligences] = useState<Diligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);

  // Initialiser les états depuis localStorage et charger les données
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Charger depuis le cache local si disponible et récent (moins de 5 minutes)
      const cachedData = localStorage.getItem('diligencesCache');
      const cachedTime = localStorage.getItem('diligencesCacheTime');
      
      if (cachedData && cachedTime) {
        const cacheAge = Date.now() - parseInt(cachedTime);
        if (cacheAge < 300000) { // 5 minutes de cache
          setAllDiligences(JSON.parse(cachedData));
          setLastLoadTime(parseInt(cachedTime));
          setLoading(false);
          return;
        }
      }
    }

    // Charger les données si pas de cache ou cache expiré
    loadDiligences();
  }, []);

  // Détecter quand l'utilisateur revient à l'onglet
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // L'utilisateur revient à l'onglet, mais on ne recharge PAS les données automatiquement
        console.log('Utilisateur de retour sur la page - Pas de rechargement automatique');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadDiligences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diligences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const diligencesData = data || [];
      setAllDiligences(diligencesData);
      setLastLoadTime(Date.now());
      
      // Sauvegarder dans le cache local
      if (typeof window !== 'undefined') {
        localStorage.setItem('diligencesCache', JSON.stringify(diligencesData));
        localStorage.setItem('diligencesCacheTime', Date.now().toString());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des diligences:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour gérer les actions
  const handleCreateDiligence = () => {
    setEditingDiligence(null);
    setShowForm(true);
  };

  const handleEditDiligence = (diligence: Diligence) => {
    setEditingDiligence(diligence);
    setShowForm(true);
  };

  const handleDeleteDiligence = (diligence: Diligence) => {
    setDiligenceToDelete(diligence);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (diligenceToDelete) {
      try {
        // Supprimer uniquement la diligence de la base de données (ignorer les fichiers)
        const { error } = await supabase
          .from('diligences')
          .delete()
          .eq('id', diligenceToDelete.id);

        if (error) {
          throw error;
        }

        setAllDiligences(prev => prev.filter(d => d.id !== diligenceToDelete.id));
        setShowDeleteModal(false);
        setDiligenceToDelete(null);
        alert('Diligence supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        alert(`Erreur lors de la suppression: ${errorMessage}`);
      }
    }
  };

  const handleFormSubmit = async (formData: DiligenceFormData) => {
    try {
      // Vérifier que le bucket existe
      const bucketExists = await ensureBucketExists();
      if (!bucketExists) {
        alert('Le bucket de stockage n\'est pas configuré. Veuillez créer le bucket "diligence-file" dans Supabase Storage.');
        return;
      }

      // Préparer les données pour Supabase
      const diligenceData = {
        titre: formData.titre,
        directiondestinataire: formData.directionDestinataire,
        datedebut: formData.dateDebut,
        datefin: formData.dateFin,
        description: formData.description,
        priorite: formData.priorite as "Haute" | "Moyenne" | "Basse",
        statut: formData.statut as "Planifié" | "En cours" | "Terminé" | "En retard",
        destinataire: formData.destinataire,
        piecesjointes: [], // Initialiser comme tableau vide
        progression: 0
      };

      let diligenceId: string;

      if (editingDiligence) {
        // MODIFICATION - Mettre à jour la diligence
        diligenceId = editingDiligence.id;
        const { error } = await supabase
          .from('diligences')
          .update(diligenceData)
          .eq('id', editingDiligence.id);

        if (error) {
          throw error;
        }

      } else {
        // CRÉATION - Créer la diligence et récupérer l'ID
        const { data, error } = await supabase
          .from('diligences')
          .insert(diligenceData)
          .select('id')
          .single();

        if (error) {
          throw error;
        }

        diligenceId = data.id;
      }

      // Upload des fichiers joints si présents
      if (formData.piecesJointesFiles && formData.piecesJointesFiles.length > 0) {
        const uploadedFilePaths: string[] = [];
        
        for (const file of formData.piecesJointesFiles) {
          try {
            const filePath = await uploadFile(diligenceId, file);
            uploadedFilePaths.push(filePath);
          } catch (uploadError) {
            console.error('Erreur lors de l\'upload du fichier:', uploadError);
            // Continuer avec les autres fichiers même si un échoue
          }
        }

        // Mettre à jour la diligence avec les chemins des fichiers uploadés
        if (uploadedFilePaths.length > 0) {
          const { error: updateError } = await supabase
            .from('diligences')
            .update({ piecesjointes: uploadedFilePaths })
            .eq('id', diligenceId);

          if (updateError) {
            console.error('Erreur lors de la mise à jour des fichiers joints:', updateError);
          }
        }
      }

      // Recharger les diligences pour avoir les données à jour
      await loadDiligences();

      setShowForm(false);
      setEditingDiligence(null);
      alert(editingDiligence ? 'Diligence modifiée avec succès' : 'Diligence créée avec succès');

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de l'enregistrement: ${errorMessage}`);
    }
  };

  // Fonction de filtrage
  const filteredDiligences = allDiligences.filter(diligence => {
    const matchSearch = !filters.search || 
      diligence.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
      diligence.directiondestinataire.toLowerCase().includes(filters.search.toLowerCase()) ||
      (diligence.destinataire && diligence.destinataire.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchStatut = !filters.statut || diligence.statut === filters.statut;
    const matchPriorite = !filters.priorite || diligence.priorite === filters.priorite;
    
    return matchSearch && matchStatut && matchPriorite;
  });

  // Calculs de pagination
  const totalItems = filteredDiligences.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDiligences = filteredDiligences.slice(startIndex, endIndex);

  // Réinitialiser la page quand les filtres changent
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      statut: '',
      priorite: '',
      dateDebut: '',
      dateFin: ''
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatutColor = (statut: string) => {
    switch(statut) {
      case "En cours": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Terminé": return "bg-green-50 text-green-700 border border-green-200";
      case "Planifié": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "En retard": return "bg-red-50 text-red-700 border border-red-200";
      default: return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch(priorite) {
      case "Haute": return "bg-red-50 text-red-700 border border-red-200";
      case "Moyenne": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Basse": return "bg-green-50 text-green-700 border border-green-200";
      default: return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Composant de pagination
  const Pagination = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems} résultats
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newItemsPerPage = Number(e.target.value);
              setItemsPerPage(newItemsPerPage);
              localStorage.setItem('diligenceItemsPerPage', newItemsPerPage.toString());
              setCurrentPage(1);
            }}
            className="ml-4 border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={6}>6 par page</option>
            <option value={12}>12 par page</option>
            <option value={24}>24 par page</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-2 text-sm font-medium border rounded-md ${
                page === currentPage
                  ? 'text-white bg-orange-500 border-orange-500'
                  : page === '...'
                  ? 'text-gray-400 bg-white border-gray-300 cursor-default'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64 p-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des diligences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 p-8 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestion des Diligences
            </h1>
            <p className="text-gray-600">Suivi et gestion des missions de diligence gouvernementales</p>
          </div>
          <button
            onClick={handleCreateDiligence}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Nouvelle Diligence</span>
          </button>
        </div>

        {/* Filtres et contrôles */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <input 
                type="text" 
                placeholder="Titre, direction, destinataire..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select 
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
              >
                <option value="">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Planifié">Planifié</option>
                <option value="Terminé">Terminé</option>
                <option value="En retard">En retard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <select 
                value={filters.priorite}
                onChange={(e) => handleFilterChange('priorite', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
              >
                <option value="">Toutes priorités</option>
                <option value="Haute">Haute</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Basse">Basse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
              <input 
                type="date" 
                value={filters.dateDebut}
                onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
              <input 
                type="date" 
                value={filters.dateFin}
                onChange={(e) => handleFilterChange('dateFin', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" 
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={resetFilters}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Réinitialiser les filtres
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setViewMode('table');
                    localStorage.setItem('diligenceViewMode', 'table');
                  }}
                  className={`p-2 rounded-lg ${
                    viewMode === 'table'
                      ? 'bg-orange-100 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setViewMode('grid');
                    localStorage.setItem('diligenceViewMode', 'grid');
                  }}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid'
                      ? 'bg-orange-100 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table des diligences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDiligences.map((diligence) => (
                  <tr key={diligence.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{diligence.titre}</div>
                      <div className="text-sm text-gray-500">{diligence.destinataire || 'Non spécifié'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{diligence.directiondestinataire}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(diligence.datedebut)} - {formatDate(diligence.datefin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(diligence.statut)}`}>
                        {diligence.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrioriteColor(diligence.priorite)}`}>
                        {diligence.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedDiligence(diligence)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => handleEditDiligence(diligence)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteDiligence(diligence)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalItems === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200 mt-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune diligence</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer votre première diligence.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateDiligence}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Créer une diligence
              </button>
            </div>
          </div>
        )}

        {totalItems > 0 && <Pagination />}

        {/* Modals */}
        {showForm && (
          <DiligenceForm
            initialData={editingDiligence ? {
              titre: editingDiligence.titre,
              directionDestinataire: editingDiligence.directiondestinataire,
              dateDebut: editingDiligence.datedebut,
              dateFin: editingDiligence.datefin,
              description: editingDiligence.description,
              priorite: editingDiligence.priorite,
              statut: editingDiligence.statut,
              destinataire: editingDiligence.destinataire,
              piecesJointes: editingDiligence.piecesjointes
            } : undefined}
            onClose={() => {
              setShowForm(false);
              setEditingDiligence(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}

        {showDeleteModal && (
          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            itemName={diligenceToDelete?.titre || ''}
            itemType="diligence"
          />
        )}

        {selectedDiligence && (
          <DetailsDiligence
            id={selectedDiligence.id}
            title={selectedDiligence.titre}
            description={selectedDiligence.description}
            date={formatDate(selectedDiligence.created_at)}
            status={selectedDiligence.statut.toLowerCase().replace(' ', '_') as "en_cours" | "termine" | "en_attente" | "en_retard"}
            directionDestinataire={selectedDiligence.directiondestinataire}
            destinataire={selectedDiligence.destinataire || 'Non spécifié'}
            echeance={formatDate(selectedDiligence.datefin)}
            documents={selectedDiligence.piecesjointes.length}
            commentaires={0}
            priorite={selectedDiligence.priorite}
            progression={selectedDiligence.progression}
          />
        )}
      </div>
    </div>
  );
}
