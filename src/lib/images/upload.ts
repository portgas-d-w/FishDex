/**
 * Compression client avant upload vers Supabase.
 * Utilise browser-image-compression pour réduire 2-4 MB → 300-500 KB.
 */
import imageCompression from 'browser-image-compression'

export type CaptureSource = 'camera' | 'gallery'

export async function compressForUpload(file: File): Promise<File> {
  const options = {
    maxSizeMB:        0.8,          // 800 KB max
    maxWidthOrHeight: 1920,
    useWebWorker:     true,
    fileType:         'image/webp', // convertir en WebP si supporté
    initialQuality:   0.82,
    alwaysKeepResolution: false,
  }

  try {
    const compressed = await imageCompression(file, options)
    // Renommer en .webp si la compression a converti le format
    const ext  = compressed.type === 'image/webp' ? 'webp' : compressed.name.split('.').pop()
    const name = `${Date.now()}.${ext}`
    return new File([compressed], name, { type: compressed.type })
  } catch {
    // Fallback : retourner le fichier original
    return file
  }
}

/**
 * Construit le chemin de stockage pour une photo.
 * Structure : {userId}/original/{timestamp}.webp
 */
export function buildOriginalPath(userId: string, file: File): string {
  const ext = file.type === 'image/webp' ? 'webp' : 'jpg'
  return `${userId}/original/${Date.now()}.${ext}`
}
