import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    detectSessionInUrl: true,
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    storage: {
      getItem: (key) => {
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';').reduce((res: Record<string, string>, c) => {
            const [key, val] = c.trim().split('=').map(decodeURIComponent)
            return key ? {...res, [key]: val} : res
          }, {})
          return cookies[key] || null
        }
        return null
      },
      setItem: (key, value) => {
        if (typeof document !== 'undefined') {
          document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; secure; samesite=lax`
        }
      },
      removeItem: (key) => {
        if (typeof document !== 'undefined') {
          document.cookie = `${encodeURIComponent(key)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      }
    }
  }
})