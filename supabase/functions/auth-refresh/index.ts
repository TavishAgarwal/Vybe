import { corsHeaders, getAnonClient, json, badRequest } from '../_shared/security.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body: { refreshToken?: string }
  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed JSON')
  }

  if (!body.refreshToken || typeof body.refreshToken !== 'string') {
    return badRequest('Refresh token is required')
  }

  const supabase = getAnonClient()
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: body.refreshToken,
  })

  if (error || !data.session) return json({ error: 'Session expired' }, 401)

  return json({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
  })
})
