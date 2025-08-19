import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase/client'

const adminProtectedRoutes = [
  '/parametres/utilisateurs',
  '/parametres/smtp',
  '/parametres/securite',
  '/parametres/application',
  '/parametres/notifications',
  '/parametres/systeme',
  '/parametres/sauvegarde'
]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Debug logs
  const allCookies = request.cookies.getAll()
  console.log('Middleware - Request cookies:', allCookies)
  
  // Récupère le cookie d'authentification
  const authCookie = allCookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))?.value
  
  if (!authCookie) {
    console.log('No auth cookie found')
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
  
  try {
    // Parse le cookie pour extraire les tokens
    const authData = JSON.parse(authCookie)
    const accessToken = authData?.access_token
    
    console.log('Middleware - Extracted tokens:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!authData?.refresh_token
    })
    
    if (!accessToken) {
      throw new Error('No access token found in auth cookie')
    }
    
    // Vérifie la validité du token et récupère le rôle
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) throw error || new Error('No user')
    
    const userRole = user.user_metadata?.role || 'user'
    
    // Vérifie les routes protégées admin
    // Routes protégées admin
    const strictAdminRoutes = ['/parametres/securite', '/parametres/systeme'];
    if (strictAdminRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/parametres/profil', request.url))
      }
    }
    
    // Route utilisateurs accessible à tous les connectés
    if (request.nextUrl.pathname.startsWith('/parametres/utilisateurs')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
    
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware auth error:', error)
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
}