import {
  corsHeaders,
  forbidden,
  getServiceClient,
  getStrikeCount,
  json,
  requireUser,
  tooManyRequests,
  unauthorized,
} from '../_shared/security.ts'

const getEntryId = (req: Request) => new URL(req.url).searchParams.get('entryId')

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST' && req.method !== 'DELETE') return json({ error: 'Method not allowed' }, 405)

  const { user } = await requireUser(req)
  if (!user) return unauthorized()

  const entryId = getEntryId(req)
  if (!entryId) return json({ error: 'entryId is required' }, 400)

  const supabase = getServiceClient()
  const recentVotes = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date(Date.now() - 60_000).toISOString())

  if (recentVotes.error) throw recentVotes.error
  if ((recentVotes.count ?? 0) >= 30) return tooManyRequests(60)

  const strikes = await getStrikeCount(supabase, user.id)
  if (strikes >= 2) return forbidden('Your account cannot vote right now')

  const { data: entry, error: entryError } = await supabase
    .from('entries')
    .select('id,user_id,status')
    .eq('id', entryId)
    .maybeSingle()

  if (entryError) throw entryError
  if (!entry || entry.status !== 'live') return json({ error: 'Not found' }, 404)
  if (entry.user_id === user.id) return forbidden('You cannot vote for your own entry')

  if (req.method === 'POST') {
    const { error } = await supabase
      .from('votes')
      .insert({ entry_id: entryId, user_id: user.id })

    if (error && error.code !== '23505') throw error
  } else {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('entry_id', entryId)
      .eq('user_id', user.id)

    if (error) throw error
  }

  const { count, error: countError } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('entry_id', entryId)

  if (countError) throw countError
  await supabase.from('entries').update({ vote_count: count ?? 0 }).eq('id', entryId)

  return json({ success: true, voteCount: count ?? 0 })
})
