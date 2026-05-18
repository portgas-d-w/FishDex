import Image from 'next/image'

export type ImageVariant = 'thumb' | 'medium' | 'large'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const BUCKET = 'catches'

/**
 * Construit l'URL publique selon le variant demandé.
 * Gère la compatibilité ascendante avec les anciens chemins /temp/.
 */
export function buildCatchImageUrl(photoPath: string, variant: ImageVariant): string {
  const base = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

  // Ancienne structure : {userId}/temp/{ts}.jpg → toujours l'original
  if (photoPath.includes('/temp/')) {
    return `${base}/${photoPath}`
  }

  // Nouvelle structure : {userId}/original/{ts}.webp → dériver le variant
  if (photoPath.includes('/original/')) {
    if (variant === 'large') return `${base}/${photoPath}`
    const variantPath = photoPath.replace('/original/', `/${variant}/`).replace(/\.[^.]+$/, '.webp')
    return `${base}/${variantPath}`
  }

  // Fallback : chemin brut sans transformation
  return `${base}/${photoPath}`
}

const DIMS: Record<ImageVariant, { w: number; h: number; sizes: string; quality: number }> = {
  thumb:  { w: 300,  h: 300,  sizes: '(max-width: 640px) 50vw, 25vw',  quality: 75 },
  medium: { w: 800,  h: 800,  sizes: '(max-width: 768px) 100vw, 50vw', quality: 82 },
  large:  { w: 1920, h: 1920, sizes: '100vw',                          quality: 90 },
}

type Props = {
  photoPath: string
  variant: ImageVariant
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
}

export function CatchImage({ photoPath, variant, alt, fill, className, priority }: Props) {
  const src = buildCatchImageUrl(photoPath, variant)
  const { w, h, sizes, quality } = DIMS[variant]

  const commonProps = {
    src,
    alt,
    sizes,
    quality,
    className,
    priority: priority ?? variant === 'large',
    loading:  (priority || variant === 'large' ? 'eager' : 'lazy') as 'eager' | 'lazy',
  }

  if (fill) {
    return <Image {...commonProps} fill />
  }

  return <Image {...commonProps} width={w} height={h} />
}
