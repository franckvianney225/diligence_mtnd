"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
};

// Icônes SVG custom
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    fetchUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => subscription?.unsubscribe();
  }, [supabase]);

  const isActive = (path: string) => pathname === path;

  // Vérifier si l'utilisateur est un administrateur
  const isAdmin = () => {
    const userRole = user?.user_metadata?.role || '';
    const normalizedRole = userRole.toString().trim().toLowerCase();
    return normalizedRole.includes('admin') || normalizedRole.includes('administrateur');
  };

  return (
    <div className="fixed left-0 top-0 w-56 h-screen bg-white flex flex-col shadow-lg border-r border-gray-200 z-40">
      {/* Header avec profil utilisateur */}
      <div className="p-4 border-b border-gray-200 bg-orange-50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-orange-100 border-2 border-orange-200 rounded-full flex items-center justify-center">
            <UserIcon />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              {user?.user_metadata?.full_name || user?.email || 'Utilisateur'}
            </h3>
            <p className="text-xs text-orange-600 font-medium">
              ({user?.user_metadata?.role || (user ? (user.email?.includes('admin') ? 'Administrateur' : 'Connecté') : 'Invité')})
            </p>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-1">
          <Link 
            href="/" 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <div>
              <HomeIcon />
            </div>
            <span className="font-medium text-sm">
              Tableau de bord
            </span>
          </Link>
          
          {!isAdmin() && (
            <Link
              href="/diligence"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive('/diligence')
                  ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <div>
                <ClipboardIcon />
              </div>
              <span className="font-medium text-sm">
                Diligence
              </span>
            </Link>
          )}
        </nav>
      </div>

      {/* Bouton de déconnexion */}
      <div className="px-3 py-2 flex-shrink-0">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/login';
          }}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>

      {/* Trait de séparation subtil */}
      <div className="px-4 mb-3 flex-shrink-0">
        <div className="h-px bg-gray-200"></div>
      </div>

      {/* Section paramètres */}
      <div className="p-3 flex-shrink-0">
        <Link 
          href="/parametres" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            isActive('/parametres') 
              ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }`}
        >
          <div>
            <SettingsIcon />
          </div>
          <span className="font-medium text-sm">
            Paramètres
          </span>
        </Link>
      </div>
    </div>
  );
}