import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/format'

/**
 * Brand logo — /public/brand/gully-rack-logo.png, used unmodified.
 *
 * The artwork is white + blue on a solid black canvas (1536×1024) with generous padding,
 * so it must always be placed on dark surfaces. The file is not edited; CSS frames the artwork
 * area (measured: x 320–1209, y 178–810, plus a small safety margin) so it sits at a
 * usable size in the navbar.
 */
const SRC = '/brand/gully-rack-logo.png'
const FILE = { w: 1536, h: 1024 }
const FRAME = { x: 304, y: 162, w: 922, h: 665 }

const pct = (n) => `${(n * 100).toFixed(3)}%`
const imgStyle = {
  position: 'absolute',
  width: pct(FILE.w / FRAME.w),
  height: pct(FILE.h / FRAME.h),
  left: pct(-FRAME.x / FRAME.w),
  top: pct(-FRAME.y / FRAME.h),
  maxWidth: 'none',
  // The file's canvas is pure #000; "lighten" lets it merge with any dark surface
  // without a visible box: the frame is painted brand black (#050505) and the canvas
  // lightens to match it, even inside transformed parents. Artwork colours are unaffected.
  mixBlendMode: 'lighten',
}

export default function Logo({ className = 'h-12 lg:h-16', linked = true, onClick }) {
  const [failed, setFailed] = useState(false)

  const content = failed ? (
    <span className="inline-flex items-center text-xl leading-none font-extrabold tracking-tightest text-white uppercase sm:text-2xl">
      Gully<span className="text-blue">&nbsp;Rack</span>
    </span>
  ) : (
    <span
      className={cn('relative block overflow-hidden bg-ink', className)}
      style={{ aspectRatio: `${FRAME.w} / ${FRAME.h}` }}
    >
      <img
        src={SRC}
        alt="GULLY RACK"
        width={FILE.w}
        height={FILE.h}
        style={imgStyle}
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
      />
    </span>
  )

  if (!linked) return content
  return (
    <Link to="/" aria-label="GULLY RACK — home" className="inline-flex shrink-0 items-center" onClick={onClick}>
      {content}
    </Link>
  )
}
