import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// Routes protégées par authentification (gérées par le composant ProtectedTab)

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Debug logs
  const allCookies = request.cookies.getAll()
  console.log('Middleware - Request cookies:', allCookies)
  
  // Récupère le cookie d'authentification
  // Le client Supabase utilise un stockage personnalisé, on vérifie simplement la présence d'une session
  const hasAuthSession = allCookies.some(c => c.name === 'session_id')
  
  if (!hasAuthSession) {
    console.log('No auth session found')
    // Autorise les assets statiques et les pages publiques
    if (!request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/api') &&
        !request.nextUrl.pathname.startsWith('/_next')) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }
  
  // Avec la configuration actuelle du client, on fait une vérification basique
  // La validation détaillée est gérée côté client par les composants
  console.log('Middleware - Session détectée, autorisation accordée')
  return NextResponse.next()
}