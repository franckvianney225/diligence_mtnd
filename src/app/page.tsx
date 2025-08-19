"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fonction pour vérifier l'utilisateur
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log("Vérification utilisateur dashboard:", { user, error });
        
        if (error) {
          console.error("Erreur lors de la vérification:", error);
        }
        
        if (user) {
          setUser(user);
        } else {
          // Petite attente pour laisser le temps à la session de s'établir
          setTimeout(() => {
            router.push('/login');
          }, 100);
        }
      } catch (error) {
        console.error("Erreur:", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", { event, session });
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        router.push('/login');
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
      }
    });

    // Vérification initiale
    checkUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne pas afficher le contenu
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const statistiques = {
    diligencesEnCours: 24,
    diligencesTerminees: 156,
    diligencesPlanifiees: 18,
    diligencesEnRetard: 3,
    tauxCompletion: 87,
    utilisateursActifs: 247,
    documentsTraites: 1248,
    rapportsGeneres: 89
  };

  const activitesRecentes = [
    { id: 1, action: "Nouvelle diligence créée", details: "Audit financier - Ministère des Finances", temps: "Il y a 2 heures", type: "creation" },
    { id: 2, action: "Diligence #245 terminée", details: "Vérification légale - Direction des Marchés", temps: "Aujourd'hui, 09:30", type: "completion" },
    { id: 3, action: "Rapport mensuel généré", details: "Synthèse des activités de janvier", temps: "Hier, 16:45", type: "rapport" },
    { id: 4, action: "Utilisateur ajouté", details: "Marie Kouamé - Analyste junior", temps: "Hier, 14:20", type: "user" },
    { id: 5, action: "Document uploadé", details: "Contrat #2025-001.pdf", temps: "Il y a 3 jours", type: "document" }
  ];

  const prochainesEcheances = [
    { id: 1, nom: "Audit sécurité informatique", client: "Ministère de la Défense", echeance: "Demain, 10:00", priorite: "Haute", progression: 75 },
    { id: 2, nom: "Due diligence infrastructure", client: "Ministère des Infrastructures", echeance: "15/02/2025", priorite: "Moyenne", progression: 45 },
    { id: 3, nom: "Vérification comptable", client: "Ministère de l'Économie", echeance: "17/02/2025", priorite: "Basse", progression: 20 },
    { id: 4, nom: "Contrôle qualité projet", client: "Direction des Projets", echeance: "20/02/2025", priorite: "Haute", progression: 60 }
  ];

  const performanceEquipe = [
    { nom: "Jean Kouassi", role: "Senior Analyst", diligences: 12, taux: 95, avatar: "JK" },
    { nom: "Marie Traoré", role: "Project Manager", diligences: 8, taux: 92, avatar: "MT" },
    { nom: "Amadou Diallo", role: "Legal Expert", diligences: 15, taux: 88, avatar: "AD" },
    { nom: "Fatou Camara", role: "IT Auditor", diligences: 6, taux: 90, avatar: "FC" }
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "creation": return "🆕";
      case "completion": return "✅";
      case "rapport": return "📊";
      case "user": return "👤";
      case "document": return "📄";
      default: return "📋";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Sidebar />
      <div className="pl-64 p-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord des diligences</h1>
          <p className="text-gray-600">{`Vue d'ensemble des activités et performances du système`}</p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">En cours</h3>
                <p className="text-3xl font-bold mt-2 text-blue-600">{statistiques.diligencesEnCours}</p>
                <p className="text-green-600 text-sm mt-1 font-medium">+12% ce mois</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Terminées</h3>
                <p className="text-3xl font-bold mt-2 text-green-600">{statistiques.diligencesTerminees}</p>
                <p className="text-green-600 text-sm mt-1 font-medium">+8 cette semaine</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Planifiées</h3>
                <p className="text-3xl font-bold mt-2 text-orange-600">{statistiques.diligencesPlanifiees}</p>
                <p className="text-orange-600 text-sm mt-1 font-medium">Pour ce mois</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">En retard</h3>
                <p className="text-3xl font-bold mt-2 text-red-600">{statistiques.diligencesEnRetard}</p>
                <p className="text-red-600 text-sm mt-1 font-medium">Action requise</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Dernières activités */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Dernières activités</h2>
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Voir tout</button>
            </div>
            <div className="space-y-4">
              {activitesRecentes.map((activite) => (
                <div key={activite.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{getTypeIcon(activite.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{activite.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activite.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{activite.temps}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Métriques rapides */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Métriques clés</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux de complétion</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${statistiques.tauxCompletion}%`}}></div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{statistiques.tauxCompletion}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Utilisateurs actifs</span>
                  <span className="font-semibold text-gray-800">{statistiques.utilisateursActifs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Documents traités</span>
                  <span className="font-semibold text-gray-800">{statistiques.documentsTraites}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rapports générés</span>
                  <span className="font-semibold text-gray-800">{statistiques.rapportsGeneres}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Prochaines échéances */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Prochaines échéances</h2>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Voir le calendrier</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Diligence</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Client</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Échéance</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Priorité</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Progression</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prochainesEcheances.map((echeance) => (
                  <tr key={echeance.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium text-gray-800">{echeance.nom}</td>
                    <td className="p-3 text-gray-600">{echeance.client}</td>
                    <td className="p-3 text-gray-600">{echeance.echeance}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioriteColor(echeance.priorite)}`}>
                        {echeance.priorite}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${echeance.progression}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{echeance.progression}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}