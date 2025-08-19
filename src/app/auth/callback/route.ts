import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code_provided`);
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    if (!data.session) {
      throw new Error('No session created');
    }

    // Force full page reload to sync middleware
    const response = NextResponse.redirect(requestUrl.origin);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=authentication_failed`
    );
  }
}