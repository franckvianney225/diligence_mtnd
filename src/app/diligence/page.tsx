"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DiligenceForm from "@/components/DiligenceForm";
import DeleteModal from "@/components/DeleteModal";
import DetailsDiligence from "@/components/Diligence/DetailsDiligence";

interface Diligence {
  id: number;
  titre: string;
  directionDestinataire: string;
  date: string;
  statut: string;
  priorite: "Haute" | "Moyenne" | "Basse";
  progression: number;
  destinataire: string;
  description: string;
  echeance: string;
  documents: number;
  commentaires: number;
  dateDebut: string;
  dateFin: string;
}

type DiligenceInput = Omit<Diligence, 'id' | 'progression'> & {
  progression?: number;
};

export default function DiligencePage() {
  const [viewMode, setViewMode] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDiligence, setEditingDiligence] = useState<Diligence | null>(null);
  const [diligenceToDelete, setDiligenceToDelete] = useState<Diligence | null>(null);
  const [selectedDiligence, setSelectedDiligence] = useState<Diligence | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filters, setFilters] = useState({
    search: '',
    statut: '',
    priorite: '',
    dateDebut: '',
    dateFin: ''
  });

  const [allDiligences, setAllDiligences] = useState([
    {
      id: 1,
      titre: "Audit financier ministère",
      directionDestinataire: "Ministère des Finances",
      date: "15/01/2025",
      statut: "En cours",
      priorite: "Haute",
      progression: 65,
      destinataire: "Jean Kouassi",
      description: "Audit complet des comptes du ministère pour l'exercice 2024",
      echeance: "28/02/2025",
      documents: 12,
      commentaires: 8,
      dateDebut: "2025-01-15",
      dateFin: "2025-02-28"
    },
    {
      id: 2,
      titre: "Due diligence projet infrastructure",
      directionDestinataire: "Ministère des Infrastructures",
      date: "20/01/2025",
      statut: "Planifié",
      priorite: "Moyenne",
      progression: 0,
      destinataire: "Marie Traoré",
      description: "Évaluation du projet de construction d'autoroutes",
      echeance: "15/03/2025",
      documents: 5,
      commentaires: 2,
      dateDebut: "2025-01-20",
      dateFin: "2025-03-15"
    },
    {
      id: 3,
      titre: "Vérification légale contrats publics",
      directionDestinataire: "Direction des Marchés Publics",
      date: "10/01/2025",
      statut: "Terminé",
      priorite: "Basse",
      progression: 100,
      destinataire: "Amadou Diallo",
      description: "Contrôle de conformité des contrats publics Q4 2024",
      echeance: "25/01/2025",
      documents: 25,
      commentaires: 15,
      dateDebut: "2025-01-10",
      dateFin: "2025-01-25"
    },
    {
      id: 4,
      titre: "Audit sécurité informatique",
      directionDestinataire: "Ministère de la Défense",
      date: "05/01/2025",
      statut: "En retard",
      priorite: "Haute",
      progression: 30,
      destinataire: "Fatou Camara",
      description: "Évaluation de la sécurité des systèmes informatiques",
      echeance: "20/01/2025",
      documents: 8,
      commentaires: 12,
      dateDebut: "2025-01-05",
      dateFin: "2025-01-20"
    },
    {
      id: 5,
      titre: "Contrôle qualité projets publics",
      directionDestinataire: "Direction des Projets",
      date: "12/01/2025",
      statut: "En cours",
      priorite: "Moyenne",
      progression: 45,
      destinataire: "Koffi Assi",
      description: "Évaluation de la qualité des projets en cours",
      echeance: "30/03/2025",
      documents: 15,
      commentaires: 6,
      dateDebut: "2025-01-12",
      dateFin: "2025-03-30"
    },
    {
      id: 6,
      titre: "Audit environnemental",
      directionDestinataire: "Ministère de l'Environnement",
      date: "18/01/2025",
      statut: "Planifié",
      priorite: "Basse",
      progression: 0,
      destinataire: "Aya Brou",
      description: "Évaluation de l'impact environnemental des projets",
      echeance: "20/04/2025",
      documents: 3,
      commentaires: 1,
      dateDebut: "2025-01-18",
      dateFin: "2025-04-20"
    },
    {
      id: 7,
      titre: "Due diligence fusion entreprises",
      directionDestinataire: "Ministère du Commerce",
      date: "22/01/2025",
      statut: "En cours",
      priorite: "Haute",
      progression: 80,
      destinataire: "Sekou Ouattara",
      description: "Analyse de la fusion de deux entreprises publiques",
      echeance: "15/02/2025",
      documents: 20,
      commentaires: 18,
      dateDebut: "2025-01-22",
      dateFin: "2025-02-15"
    },
    {
      id: 8,
      titre: "Vérification budgétaire",
      directionDestinataire: "Ministère du Budget",
      date: "25/01/2025",
      statut: "Planifié",
      priorite: "Moyenne",
      progression: 0,
      destinataire: "Mariam Koné",
      description: "Contrôle de l'exécution budgétaire 2024",
      echeance: "10/03/2025",
      documents: 7,
      commentaires: 3,
      dateDebut: "2025-01-25",
      dateFin: "2025-03-10"
    },
  ]);

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

  const confirmDelete = () => {
    if (diligenceToDelete) {
      setAllDiligences(prev => prev.filter(d => d.id !== diligenceToDelete.id));
      setShowDeleteModal(false);
      setDiligenceToDelete(null);
    }
  };

  const handleFormSubmit = (formData: DiligenceInput) => {
    if (editingDiligence) {
      // Modification
      setAllDiligences(prev => prev.map(d =>
        d.id === editingDiligence.id
          ? { ...d, ...formData, id: editingDiligence.id }
          : d
      ));
    } else {
      // Création
      const newId = Math.max(0, ...allDiligences.map(d => d.id)) + 1;
      const newDiligence: Diligence = {
        id: newId,
        progression: formData.progression || 0,
        titre: formData.titre,
        directionDestinataire: formData.directionDestinataire,
        date: formData.date,
        statut: formData.statut,
        priorite: formData.priorite,
        destinataire: formData.destinataire,
        description: formData.description,
        echeance: formData.echeance,
        documents: formData.documents,
        commentaires: formData.commentaires,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin
      };
      setAllDiligences(prev => [...prev, newDiligence]);
    }
    setShowForm(false);
    setEditingDiligence(null);
  };

  // Fonction de filtrage
  const filteredDiligences = allDiligences.filter(diligence => {
    const matchSearch = !filters.search || 
      diligence.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
      diligence.directionDestinataire.toLowerCase().includes(filters.search.toLowerCase()) ||
      diligence.destinataire.toLowerCase().includes(filters.search.toLowerCase());
    
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
              setItemsPerPage(Number(e.target.value));
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
            <div className="flex space-x-2">
              <button 
                onClick={resetFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Réinitialiser
              </button>
              <span className="text-sm text-gray-500 flex items-center">
                {filteredDiligences.length} résultat(s) trouvé(s)
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Exporter
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Rapport
                </button>
              </div>
              
              {/* Toggle vue */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-gray-700 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📋 Liste
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards' 
                      ? 'bg-white text-gray-700 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🗂️ Cartes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vue Liste (Tableau) */}
        {viewMode === 'table' && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Titre</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Direction du destinataire</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Destinataire</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Échéance</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Priorité</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Progression</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDiligences.map((diligence) => (
                      <tr key={diligence.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{diligence.titre}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{diligence.description}</div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{diligence.directionDestinataire}</td>
                        <td className="p-4 text-gray-700">{diligence.destinataire}</td>
                        <td className="p-4 text-gray-700">{diligence.date}</td>
                        <td className="p-4 text-gray-700">{diligence.echeance}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(diligence.statut)}`}>
                            {diligence.statut}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioriteColor(diligence.priorite)}`}>
                            {diligence.priorite}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${diligence.progression}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{diligence.progression}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditDiligence(diligence)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <Link href={`/diligence/${diligence.id}`}>
                              <button
                                className="text-green-600 hover:text-green-800 transition-colors p-1 hover:bg-green-50 rounded"
                                title="Voir détails"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </Link>
                            <button 
                              onClick={() => handleDeleteDiligence(diligence)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Message si aucun résultat */}
              {paginatedDiligences.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
            <Pagination />
          </>
        )}

        {/* Vue Cartes */}
        {viewMode === 'cards' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedDiligences.map((diligence) => (
                <div key={diligence.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  {/* Header de la carte */}
                  <div className="bg-orange-50 border-b border-orange-100 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">{diligence.titre}</h3>
                        <p className="text-orange-600 text-sm">{diligence.directionDestinataire}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioriteColor(diligence.priorite)}`}>
                        {diligence.priorite}
                      </span>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-3">{diligence.description}</p>
                      
                      {/* Barre de progression */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">Progression</span>
                          <span className="text-orange-600 font-medium">{diligence.progression}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${diligence.progression}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Statut */}
                      <div className="flex justify-center mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatutColor(diligence.statut)}`}>
                          {diligence.statut}
                        </span>
                      </div>
                    </div>

                    {/* Informations détaillées */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Destinataire:</span>
                        <span className="font-medium text-gray-700">{diligence.destinataire}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Échéance:</span>
                        <span className="font-medium text-orange-600">{diligence.echeance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Documents:</span>
                        <span className="font-medium text-gray-700">{diligence.documents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Commentaires:</span>
                        <span className="font-medium text-gray-700">{diligence.commentaires}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditDiligence(diligence)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Modifier
                      </button>
                      <Link href={`/diligence/${diligence.id}`}>
                        <button
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          Détails
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDeleteDiligence(diligence)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message si aucun résultat en mode cartes */}
            {paginatedDiligences.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            )}
            <Pagination />
          </>
        )}

        {/* Statistiques en bas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">En cours</h3>
                <p className="text-3xl font-bold mt-2 text-blue-600">
                  {allDiligences.filter(d => d.statut === 'En cours').length}
                </p>
              </div>
              <div className="text-4xl opacity-60">🔄</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Terminées</h3>
                <p className="text-3xl font-bold mt-2 text-green-600">
                  {allDiligences.filter(d => d.statut === 'Terminé').length}
                </p>
              </div>
              <div className="text-4xl opacity-60">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Planifiées</h3>
                <p className="text-3xl font-bold mt-2 text-orange-600">
                  {allDiligences.filter(d => d.statut === 'Planifié').length}
                </p>
              </div>
              <div className="text-4xl opacity-60">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">En retard</h3>
                <p className="text-3xl font-bold mt-2 text-red-600">
                  {allDiligences.filter(d => d.statut === 'En retard').length}
                </p>
              </div>
              <div className="text-4xl opacity-60">⚠️</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal du formulaire avec effet blur */}
      {showForm && (
        <DiligenceForm 
          onClose={() => {
            setShowForm(false);
            setEditingDiligence(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingDiligence}
        />
      )}

      {/* Modal de suppression */}
      {showDeleteModal && diligenceToDelete && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDiligenceToDelete(null);
          }}
          onConfirm={confirmDelete}
          itemName={diligenceToDelete.titre}
          itemType="diligence"
        />
      )}

      {/* Modal des détails */}
      {selectedDiligence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Détails de la diligence</h2>
                <button
                  onClick={() => setSelectedDiligence(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <DetailsDiligence
                id={selectedDiligence.id.toString()}
                title={selectedDiligence.titre}
                description={selectedDiligence.description}
                date={selectedDiligence.date}
                status={
                  selectedDiligence.statut === "Terminé" ? "termine" :
                  selectedDiligence.statut === "En cours" ? "en_cours" :
                  selectedDiligence.statut === "En retard" ? "en_retard" : "en_attente"
                }
                directionDestinataire={selectedDiligence.directionDestinataire}
                destinataire={selectedDiligence.destinataire}
                echeance={selectedDiligence.echeance}
                documents={selectedDiligence.documents}
                commentaires={selectedDiligence.commentaires}
                priorite={selectedDiligence.priorite}
                progression={selectedDiligence.progression}
              />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Direction destinataire</h3>
                  <p className="text-gray-900">{selectedDiligence.directionDestinataire}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Destinataire</h3>
                  <p className="text-gray-900">{selectedDiligence.destinataire}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Échéance</h3>
                  <p className="text-gray-900">{selectedDiligence.echeance}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Documents</h3>
                  <p className="text-gray-900">{selectedDiligence.documents}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
