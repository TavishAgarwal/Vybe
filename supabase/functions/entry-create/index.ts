import {
  badRequest,
  corsHeaders,
  forbidden,
  getServiceClient,
  getStrikeCount,
  json,
  requireUser,
  unauthorized,
} from '../_shared/security.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const { user } = await requireUser(req)
  if (!user) return unauthorized()

  let body: {
    challengeId?: string
    videoUrl?: string
    thumbnailUrl?: string | null
    caption?: string
    musicTrack?: string
    filterId?: string
  }

  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed JSON')
  }

  const caption = body.caption?.trim() ?? ''
  if (!body.challengeId || typeof body.challengeId !== 'string') return badRequest('challengeId is required')
  if (!body.videoUrl || typeof body.videoUrl !== 'string' || !body.videoUrl.startsWith('https://')) {
    return badRequest('A valid uploaded video URL is required')
  }
  if (caption.length > 200) return badRequest('Caption must be 200 characters or fewer')

  const supabase = getServiceClient()
  const strikes = await getStrikeCount(supabase, user.id)
  if (strikes >= 3) return forbidden('Your account cannot submit entries right now')

  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('id,status,ends_at')
    .eq('id', body.challengeId)
    .maybeSingle()

  if (challengeError) throw challengeError
  if (!challenge || challenge.status !== 'active' || new Date(challenge.ends_at).getTime() <= Date.now()) {
    return forbidden('This challenge is closed')
  }

  const { data, error } = await supabase
    .from('entries')
    .insert({
      challenge_id: body.challengeId,
      user_id: user.id,
      video_url: body.videoUrl,
      thumbnail_url: body.thumbnailUrl ?? null,
      caption,
      status: 'processing',
      vote_count: 0,
      music_track: body.musicTrack ?? 'Original Audio',
    })
    .select('id,challenge_id,user_id,video_url,thumbnail_url,caption,status,vote_count,music_track,created_at')
    .single()

  if (error) throw error

  return json({
    id: data.id,
    challengeId: data.challenge_id,
    userId: data.user_id,
    videoUrl: data.video_url,
    thumbnailUrl: data.thumbnail_url,
    caption: data.caption,
    duration: 0,
    voteCount: data.vote_count,
    reactionCounts: { fire: 0, heart: 0, party: 0, clap: 0, sparkle: 0, love: 0 },
    status: data.status,
    moderationScore: 0,
    rejectionReason: null,
    createdAt: data.created_at,
    rank: null,
    musicTrack: data.music_track ? { title: data.music_track, artist: 'Unknown' } : undefined,
  })
})
