import {
  badRequest,
  corsHeaders,
  getServiceClient,
  json,
  requireUser,
  tooManyRequests,
  unauthorized,
} from '../_shared/security.ts'

const TOXIC_TERMS = /\b(kill yourself|kys|slur|hate you)\b/i

const getEntryId = (req: Request) => new URL(req.url).searchParams.get('entryId')

async function scoreComment(text: string) {
  const apiKey = Deno.env.get('PERSPECTIVE_API_KEY')
  if (!apiKey) return TOXIC_TERMS.test(text) ? 0 : 0.9

  const response = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      comment: { text },
      languages: ['en'],
      requestedAttributes: { TOXICITY: {} },
      doNotStore: true,
    }),
  })

  if (!response.ok) return TOXIC_TERMS.test(text) ? 0 : 0.8
  const data = await response.json()
  const toxicity = data?.attributeScores?.TOXICITY?.summaryScore?.value
  return typeof toxicity === 'number' ? 1 - toxicity : 0.8
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const { user } = await requireUser(req)
  if (!user) return unauthorized()

  const entryId = getEntryId(req)
  if (!entryId) return badRequest('entryId is required')

  let body: { text?: string }
  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed JSON')
  }

  const text = body.text?.trim() ?? ''
  if (text.length < 1 || text.length > 500) return badRequest('Comment must be 1-500 characters')

  const supabase = getServiceClient()
  const recent = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date(Date.now() - 60_000).toISOString())

  if (recent.error) throw recent.error
  if ((recent.count ?? 0) >= 10) return tooManyRequests(60)

  const { data: entry, error: entryError } = await supabase
    .from('entries')
    .select('id,status')
    .eq('id', entryId)
    .maybeSingle()

  if (entryError) throw entryError
  if (!entry || entry.status !== 'live') return json({ error: 'Not found' }, 404)

  const positivityScore = await scoreComment(text)
  if (positivityScore <= 0.3) {
    return json({ error: 'Comment did not meet community guidelines' }, 422)
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      entry_id: entryId,
      user_id: user.id,
      content: text,
      positivity_score: positivityScore,
    })
    .select('id,entry_id,user_id,content,positivity_score,is_pinned,created_at,user:users(*)')
    .single()

  if (error) throw error

  return json({
    id: data.id,
    entryId: data.entry_id,
    userId: data.user_id,
    text: data.content,
    positivityScore: data.positivity_score,
    isPinned: data.is_pinned,
    parentId: null,
    createdAt: data.created_at,
    likeCount: 0,
    user: data.user ? {
      id: data.user.id,
      handle: data.user.username,
      username: data.user.username,
      displayName: data.user.full_name || data.user.username,
      avatarUrl: data.user.avatar_url || '',
      bio: data.user.bio || '',
      categories: [],
      vybeScore: data.user.vybe_score || 0,
      vybeCoins: 0,
      strikeCount: 0,
      pledgeSigned: true,
      createdAt: data.user.created_at,
      followersCount: 0,
      followingCount: 0,
    } : undefined,
  })
})
