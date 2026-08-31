import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const sourceDirectory = resolve('public/referencias')
const outputDirectory = resolve('public/images/velvet/catalog')

const assets = [
  { name: 'logo', page: 9, left: 166, top: 202, width: 244, height: 118 },
  { name: 'promo-massage', page: 2, left: 24, top: 24, width: 246, height: 244 },
  { name: 'promo-basic', page: 2, left: 22, top: 288, width: 245, height: 235 },
  { name: 'promo-divine', page: 2, left: 23, top: 548, width: 245, height: 252 },
  { name: 'promo-french', page: 3, left: 27, top: 21, width: 245, height: 252 },
  { name: 'promo-glow', page: 3, left: 27, top: 288, width: 244, height: 245 },
  { name: 'promo-mirada', page: 3, left: 27, top: 552, width: 246, height: 252 },
  { name: 'promo-signature', page: 4, left: 27, top: 18, width: 240, height: 245 },
  { name: 'head-spa-real', page: 4, left: 28, top: 278, width: 235, height: 236 },
  { name: 'hair-real', page: 4, left: 26, top: 535, width: 240, height: 253 },
  { name: 'eyes-real', page: 5, left: 28, top: 18, width: 244, height: 246 },
  { name: 'spa-real', page: 5, left: 28, top: 280, width: 245, height: 241 },
  { name: 'full-hair-real', page: 5, left: 27, top: 540, width: 248, height: 248 },
  { name: 'facial-real', page: 6, left: 106, top: 86, width: 164, height: 224 },
  { name: 'nails-real', page: 6, left: 275, top: 86, width: 164, height: 224 },
  { name: 'social-real', page: 7, left: 18, top: 92, width: 220, height: 329 },
  { name: 'makeup-real', page: 7, left: 18, top: 437, width: 220, height: 328 },
  { name: 'manicure-real', page: 12, left: 2, top: 637, width: 292, height: 192 },
  { name: 'pedicure-real', page: 13, left: 0, top: 560, width: 558, height: 272 },
  { name: 'brows-real', page: 14, left: 0, top: 605, width: 279, height: 226 },
  { name: 'lashes-real', page: 15, left: 0, top: 638, width: 284, height: 202 },
  { name: 'depilation-real', page: 19, left: 0, top: 612, width: 333, height: 204 },
  { name: 'social-group-real', page: 20, left: 0, top: 304, width: 571, height: 526 },
]

await mkdir(outputDirectory, { recursive: true })

for (const asset of assets) {
  const extracted = sharp(resolve(sourceDirectory, `${asset.page}.png`))
    .extract({ left: asset.left, top: asset.top, width: asset.width, height: asset.height })

  if (asset.name === 'logo') {
    const { data, info } = await extracted.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    for (let index = 0; index < data.length; index += info.channels) {
      const [red, green, blue] = [data[index], data[index + 1], data[index + 2]]
      if (red > 218 && green > 218 && blue > 218) data[index + 3] = 0
    }
    await sharp(data, { raw: info }).webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile(resolve(outputDirectory, `${asset.name}.webp`))
  } else {
    await extracted.webp({ quality: 88, effort: 5 }).toFile(resolve(outputDirectory, `${asset.name}.webp`))
  }
}

console.log(`Extracted ${assets.length} catalog assets.`)
