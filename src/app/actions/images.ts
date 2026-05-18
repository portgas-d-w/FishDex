'use server'

import { createAdminClient } from '@/lib/supabase/admin'

type GenerateResult = {
  thumbPath:  string | null
  mediumPath: string | null
  error?: string
}

/**
 * Génère les variantes thumb (300px) et medium (800px) depuis l'original.
 * Appelée côté serveur après qu'un fichier ait été uploadé dans /original/.
 *
 * @param originalPath  ex: "{userId}/original/1748000000000.webp"
 */
export async function generateThumbnails(originalPath: string): Promise<GenerateResult> {
  const admin = createAdminClient()

  // Télécharger l'original depuis Supabase Storage
  const { data: blob, error: dlErr } = await admin.storage
    .from('catches')
    .download(originalPath)

  if (dlErr || !blob) {
    return { thumbPath: null, mediumPath: null, error: dlErr?.message ?? 'Download failed' }
  }

  const arrayBuffer = await blob.arrayBuffer()
  const buffer      = Buffer.from(arrayBuffer)

  // Dériver les chemins variantes
  // originalPath = "{userId}/original/{filename}"
  const parts    = originalPath.split('/')
  const userId   = parts[0]
  const filename = parts[parts.length - 1]       // ex: "1748000000000.webp"
  const base     = filename.replace(/\.[^.]+$/, '') // sans extension
  const thumbPath  = `${userId}/thumb/${base}.webp`
  const mediumPath = `${userId}/medium/${base}.webp`

  // Traitement avec Sharp (importé dynamiquement pour éviter les SSR issues)
  const sharp = (await import('sharp')).default

  const [thumbBuf, mediumBuf] = await Promise.all([
    sharp(buffer)
      .resize(300, 300, { fit: 'cover', position: 'attention' })
      .webp({ quality: 75 })
      .toBuffer(),
    sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer(),
  ])

  // Upload des variantes
  const [tRes, mRes] = await Promise.all([
    admin.storage.from('catches').upload(thumbPath,  thumbBuf,  { contentType: 'image/webp', upsert: true }),
    admin.storage.from('catches').upload(mediumPath, mediumBuf, { contentType: 'image/webp', upsert: true }),
  ])

  if (tRes.error || mRes.error) {
    return {
      thumbPath:  null,
      mediumPath: null,
      error: tRes.error?.message ?? mRes.error?.message,
    }
  }

  return { thumbPath, mediumPath }
}

/**
 * Supprime tous les fichiers temp/ plus vieux de 24h pour un user.
 * À appeler en cron ou manuellement.
 */
export async function cleanUserTempFiles(userId: string): Promise<number> {
  const admin = createAdminClient()

  const { data: files } = await admin.storage
    .from('catches')
    .list(`${userId}/temp`)

  if (!files?.length) return 0

  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const old = files.filter(f => {
    const ts = parseInt(f.name.split('.')[0], 10)
    return !isNaN(ts) && ts < cutoff
  })

  if (!old.length) return 0

  const paths = old.map(f => `${userId}/temp/${f.name}`)
  await admin.storage.from('catches').remove(paths)
  return old.length
}
