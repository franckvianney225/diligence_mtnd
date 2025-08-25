"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ProfilTab from "@/components/Parametres/ProfilTab";
import UtilisateursTab from "@/components/Parametres/UtilisateursTab";
import SMTPTab from "@/components/Parametres/SMTPTab";
import SecuriteTab from "@/components/Parametres/SecuriteTab";
import ApplicationTab from "@/components/Parametres/ApplicationTab";
import NotificationsTab from "@/components/Parametres/NotificationsTab";
import SystemeTab from "@/components/Parametres/SystemeTab";
import SauvegardeTab from "@/components/Parametres/SauvegardeTab";
import { supabase } from "@/lib/supabase/client";
import ProtectedTab from "@/components/Parametres/ProtectedTab";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState(() => {
    // Récupérer l'onglet actif depuis le localStorage s'il existe
    if (typeof window !== 'undefined') {
      return localStorage.getItem('parametresActiveTab') || 'profil';
    }
    return 'profil';
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User metadata:', user?.user_metadata);
      
      // Détection du rôle avec priorité aux métadonnées, puis vérification de l'email
      let role = user?.app_metadata?.role || user?.user_metadata?.role || 'user';
      
      // Si pas de rôle défini mais email contient "admin", considérer comme admin
      if (role === 'user' && user?.email?.includes('admin')) {
        role = 'admin';
      }
      
      console.log('Detected role:', role);
      setUserRole(role);
      setLoading(false);
    };
    fetchUserRole();
  }, []);

  const isAdmin = userRole === 'admin' || userRole === 'Administrateur';
  const tabs = isAdmin
    ? [
        { id: 'profil', name: 'Profil', icon: '👤' },
        { id: 'utilisateurs', name: 'Utilisateurs', icon: '👥' },
        { id: 'smtp', name: 'SMTP/Email', icon: '📧' },
        { id: 'securite', name: 'Sécurité', icon: '🔒' },
        { id: 'application', name: 'Application', icon: '⚙️' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
        { id: 'systeme', name: 'Système', icon: '🖥️' },
        { id: 'sauvegarde', name: 'Sauvegarde', icon: '💾' },
      ]
    : [
        { id: 'profil', name: 'Profil', icon: '👤' }
      ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64 p-8 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Chargement des paramètres...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 p-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Paramètres
          </h1>
          <p className="text-gray-600">Configuration et gestion de l&apos;application</p>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Sauvegarder l'onglet actif dans le localStorage
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('parametresActiveTab', tab.id);
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {activeTab === 'profil' && <ProfilTab />}
          
          {/* Les autres onglets sont réservés aux admins seulement */}
          {activeTab === 'utilisateurs' && (
            <ProtectedTab allowedRoles={['admin']}>
              <UtilisateursTab />
            </ProtectedTab>
          )}
          {activeTab === 'smtp' && (
            <ProtectedTab allowedRoles={['admin']}>
              <SMTPTab />
            </ProtectedTab>
          )}
          {activeTab === 'securite' && (
            <ProtectedTab allowedRoles={['admin']}>
              <SecuriteTab />
            </ProtectedTab>
          )}
          {activeTab === 'application' && (
            <ProtectedTab allowedRoles={['admin']}>
              <ApplicationTab />
            </ProtectedTab>
          )}
          {activeTab === 'notifications' && (
            <ProtectedTab allowedRoles={['admin']}>
              <NotificationsTab />
            </ProtectedTab>
          )}
          {activeTab === 'systeme' && (
            <ProtectedTab allowedRoles={['admin']}>
              <SystemeTab />
            </ProtectedTab>
          )}
          {activeTab === 'sauvegarde' && (
            <ProtectedTab allowedRoles={['admin']}>
              <SauvegardeTab />
            </ProtectedTab>
          )}
        </div>
      </div>
    </div>
  );
}
