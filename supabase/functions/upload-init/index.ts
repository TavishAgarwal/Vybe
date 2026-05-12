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

const MAX_VIDEO_BYTES = 100 * 1024 * 1024
const ALLOWED_MIME = new Set(['video/mp4', 'video/quicktime'])

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const { user } = await requireUser(req)
  if (!user) return unauthorized()

  let body: { challengeId?: string; mimeType?: string; size?: number }
  try {
    body = await req.json()
  } catch {
    return badRequest('Malformed JSON')
  }

  if (!body.challengeId || typeof body.challengeId !== 'string') return badRequest('challengeId is required')
  if (!body.mimeType || !ALLOWED_MIME.has(body.mimeType)) return badRequest('Unsupported video type')
  if (!Number.isFinite(body.size) || Number(body.size) <= 0 || Number(body.size) > MAX_VIDEO_BYTES) {
    return badRequest('Video must be 100 MB or smaller')
  }

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

  const extension = body.mimeType === 'video/quicktime' ? 'mov' : 'mp4'
  const objectPath = `${user.id}/${body.challengeId}/${crypto.randomUUID()}.${extension}`
  const bucket = Deno.env.get('VYBE_UPLOAD_BUCKET') ?? 'entries'

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(objectPath)

  if (error || !data?.signedUrl) return json({ error: 'Upload could not be initialized' }, 500)

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl

  return json({
    uploadUrl: data.signedUrl,
    videoUrl: publicUrl,
    thumbnailUrl: null,
    path: objectPath,
    token: data.token,
  })
})
