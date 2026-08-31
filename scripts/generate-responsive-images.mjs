import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const sourceDirectory = fileURLToPath(new URL('../public/images/velvet/', import.meta.url))
const outputDirectory = join(sourceDirectory, 'responsive')
const sourceImages = ['hero.webp', 'hero-hd.webp', 'hair.webp', 'nails.webp', 'eyes.webp', 'facial.webp', 'head-spa.webp', 'spa.webp', 'social.webp']
const targetWidths = [480, 768, 1122, 1536, 2048]

await mkdir(outputDirectory, { recursive: true })

let created = 0

for (const filename of sourceImages) {
  const input = join(sourceDirectory, filename)
  const metadata = await sharp(input).metadata()
  const name = basename(filename, extname(filename))
  const widths = targetWidths.filter((width) => width <= metadata.width)

  for (const width of widths) {
    const pipeline = sharp(input).resize({ width, withoutEnlargement: true })
    await pipeline.clone().webp({ quality: 84, effort: 5, smartSubsample: true }).toFile(join(outputDirectory, `${name}-${width}.webp`))
    await pipeline.clone().avif({ quality: 63, effort: 5 }).toFile(join(outputDirectory, `${name}-${width}.avif`))
    created += 2
  }
}

const outputFiles = await readdir(outputDirectory)
const outputStats = await Promise.all(outputFiles.map((file) => stat(join(outputDirectory, file))))
const bytes = outputStats.reduce((total, file) => total + file.size, 0)

console.log(`Created ${created} responsive image variants (${Math.round(bytes / 1024)} KB).`)
