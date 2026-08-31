import { readdir } from 'node:fs/promises'
import { extname, join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const imageDirectory = fileURLToPath(new URL('../public/images/velvet/', import.meta.url))
const files = await readdir(imageDirectory)
const pngFiles = files.filter((file) => extname(file).toLowerCase() === '.png')

await Promise.all(
  pngFiles.map(async (file) => {
    const input = join(imageDirectory, file)
    const output = join(imageDirectory, `${parse(file).name}.webp`)

    await sharp(input)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(output)
  }),
)

console.log(`Optimized ${pngFiles.length} images to WebP.`)
