'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './client'
import { useRouter } from 'next/navigation'

const SupabaseContext = createContext(supabase)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN') {
        // Redirige après une connexion réussie
        const redirectPath = new URLSearchParams(window.location.search).get('redirectedFrom') || '/';
        if (window.location.pathname !== redirectPath) {
          window.location.href = redirectPath;
        }
      } else if (event === 'SIGNED_OUT') {
        await router.refresh();
        router.push('/login');
      }
      // Ne pas rafraîchir pour TOKEN_REFRESHED - c'est normal et ne nécessite pas de rechargement
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)