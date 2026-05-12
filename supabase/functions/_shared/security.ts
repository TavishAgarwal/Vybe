import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

export const badRequest = (message: string) => json({ error: message }, 400)
export const unauthorized = () => json({ error: 'Unauthorized' }, 401)
export const forbidden = (message = "You don't have permission") => json({ error: message }, 403)
export const tooManyRequests = (retryAfterSeconds: number) =>
  new Response(JSON.stringify({ error: 'Too many requests, slow down', retryAfterSeconds }), {
    status: 429,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Retry-After': String(retryAfterSeconds),
    },
  })

export const getServiceClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

export const getAnonClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { auth: { persistSession: false } },
  )

export const getBearerToken = (req: Request) => {
  const header = req.headers.get('Authorization') ?? ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

export async function requireUser(req: Request) {
  const token = getBearerToken(req)
  if (!token) return { user: null, token: null }

  const anon = getAnonClient()
  const { data, error } = await anon.auth.getUser(token)
  if (error || !data.user) return { user: null, token: null }

  return { user: data.user, token }
}

export async function countRecent(
  supabase: SupabaseClient,
  table: string,
  column: string,
  userId: string,
  windowSeconds: number,
) {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString()
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, userId)
    .gte('created_at', since)

  if (error) throw error
  return count ?? 0
}

export async function getStrikeCount(supabase: SupabaseClient, userId: string) {
  const { count, error } = await supabase
    .from('strikes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) throw error
  return count ?? 0
}
