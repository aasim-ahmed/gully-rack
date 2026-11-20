import { memo, useState } from 'react'
import { FALLBACK_IMAGE, buildImageUrl, buildSrcSet } from '../../utils/images'
import { cn } from '../../utils/format'

/**
 * Responsive, lazy-loaded image with a shimmer placeholder and a branded fallback.
 * `ratio` is height / width (e.g. 1.25 for 4:5 product shots) and reserves layout space.
 */
function SmartImage({
  src,
  alt,
  ratio,
  width = 800,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  priority = false,
  className,
  imgClassName,
  ...props
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const height = ratio ? Math.round(width * ratio) : undefined
  const finalSrc = failed ? FALLBACK_IMAGE : buildImageUrl(src, width, height)
  const srcSet = failed ? undefined : buildSrcSet(src, undefined, ratio)

  return (
    <div
      className={cn('relative overflow-hidden bg-mist', !loaded && 'skeleton', className)}
      style={ratio ? { aspectRatio: `1 / ${ratio}` } : undefined}
    >
      <img
        src={finalSrc}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true)
          setLoaded(true)
        }}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
        {...props}
      />
    </div>
  )
}

export default memo(SmartImage)
