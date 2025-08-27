import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware simplifié pour la nouvelle authentification JWT
// La gestion d'authentification est maintenant gérée côté client avec notre API personnalisée

export async function middleware(request: NextRequest) {
  // Pour le moment, on laisse passer toutes les requêtes
  // L'authentification est gérée par les composants React côté client
  return NextResponse.next()
}