const DEFAULT_WIDTHS = [480, 768, 1122, 1536, 2048]
const SOURCE_WIDTHS = new Map([
  ['hero-hd.webp', 2048],
  ['hero.webp', 1122],
  ['hair.webp', 1122],
  ['nails.webp', 1122],
  ['eyes.webp', 1122],
])

function imageVariant(src, width, format) {
  const filename = src.split('/').pop()
  const name = filename.replace(/\.[^.]+$/, '')
  return `/images/velvet/responsive/${name}-${width}.${format}`
}

export default function ResponsiveImage({
  src,
  alt,
  sizes = '100vw',
  widths = DEFAULT_WIDTHS,
  className = '',
  pictureClassName = '',
  loading,
  fetchPriority,
  decoding = 'async',
  ...props
}) {
  const filename = src.split('/').pop()
  const sourceWidth = SOURCE_WIDTHS.get(filename) ?? 1536
  const availableWidths = widths.filter((width) => width <= sourceWidth)
  const srcSet = (format) => availableWidths.map((width) => `${imageVariant(src, width, format)} ${width}w`).join(', ')

  return (
    <picture className={`responsive-picture ${pictureClassName}`.trim()}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        className={className}
        src={src}
        srcSet={srcSet('webp')}
        sizes={sizes}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        {...props}
      />
    </picture>
  )
}
