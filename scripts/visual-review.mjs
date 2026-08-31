/* global document, devicePixelRatio, getComputedStyle, location, window */
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outputDirectory = resolve('tmp/screens')
const baseUrl = 'http://127.0.0.1:5173'
const interactionOnly = process.argv.includes('--interactions-only')

await mkdir(outputDirectory, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

async function preparePage(width, path = '/', deviceScaleFactor = 1, viewportHeight = width < 768 ? 900 : 1000) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: viewportHeight, deviceScaleFactor })
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 300))
  return page
}

async function revealPage(page) {
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  const viewportHeight = await page.evaluate(() => window.innerHeight)
  for (let top = 0; top < scrollHeight; top += Math.max(320, Math.round(viewportHeight * 0.72))) {
    await page.evaluate((scrollTop) => window.scrollTo({ top: scrollTop, behavior: 'instant' }), top)
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 45))
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 100))
}

async function diagnostics(page) {
  return page.evaluate(() => {
    const root = document.documentElement
    return {
      route: location.pathname + location.search,
      viewport: root.clientWidth,
      scrollWidth: root.scrollWidth,
      overflowDelta: root.scrollWidth - root.clientWidth,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      lowDensityImages: [...document.images]
        .map((image) => {
          const match = image.currentSrc.match(/-(\d+)\.(?:avif|webp)(?:$|\?)/)
          const encodedWidth = match ? Number(match[1]) : image.naturalWidth * devicePixelRatio
          return {
            image,
            encodedWidth,
            density: encodedWidth / (image.clientWidth * devicePixelRatio),
          }
        })
        .filter(({ image, density }) => image.complete && image.currentSrc && image.clientWidth > 220 && density < 0.78)
        .map(({ image, encodedWidth, density }) => ({
          file: image.currentSrc.split('/').pop(),
          encodedWidth,
          renderedWidth: Math.round(image.clientWidth),
          density: Number(density.toFixed(2)),
        })),
      suspiciousOverflow: [...document.querySelectorAll('body *')]
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          const style = getComputedStyle(element)
          const carousel = element.closest('.experience-grid, .home-promo-grid, .promotion-filters, .catalog__nav, .service-explorer__tabs, .promotion-catalog__track')
          return !carousel && style.position !== 'fixed' && (rect.left < -2 || rect.right > root.clientWidth + 2)
        })
        .slice(0, 6)
        .map((element) => ({ tag: element.tagName.toLowerCase(), className: typeof element.className === 'string' ? element.className : '' })),
    }
  })
}

const report = []
const layoutChecks = []

if (!interactionOnly) {
for (const width of [390, 430, 768, 1366, 1440, 1728, 1920]) {
  const page = await preparePage(width, '/?hero=inmersivo')
  const result = await diagnostics(page)
  const composition = await page.evaluate(() => {
    const hero = document.querySelector('.immersive-hero').getBoundingClientRect()
    const visual = document.querySelector('.immersive-hero__slide img').getBoundingClientRect()
    return {
      viewportHeight: window.innerHeight,
      heroHeight: Math.round(hero.height),
      heroLeft: Math.round(hero.left),
      heroRight: Math.round(hero.right),
      visualLeft: Math.round(visual.left),
      visualTop: Math.round(visual.top),
      visualRight: Math.round(visual.right),
      visualBottom: Math.round(visual.bottom),
      visualWidth: Math.round(visual.width),
      slideCount: document.querySelectorAll('.immersive-hero__slide').length,
      currentHeroCount: document.querySelectorAll('.hero').length,
      immersiveHeroCount: document.querySelectorAll('.immersive-hero').length,
      headingCount: document.querySelectorAll('.immersive-hero h1').length,
    }
  })
  assert.equal(composition.currentHeroCount, 0, `Legacy hero must not be rendered at ${width}px`)
  assert.equal(composition.immersiveHeroCount, 1, `Immersive hero is missing at ${width}px`)
  assert.equal(composition.slideCount, 3, `Immersive hero must contain exactly three background images at ${width}px`)
  assert.equal(composition.headingCount, 1, `Immersive hero must have one heading at ${width}px`)
  assert.equal(result.overflowDelta, 0, `Immersive hero overflows horizontally at ${width}px`)
  assert.deepEqual(result.brokenImages, [], `Broken immersive hero image at ${width}px`)
  assert.deepEqual(result.lowDensityImages, [], `Low-density immersive hero image at ${width}px: ${JSON.stringify(result.lowDensityImages)}`)
  assert.ok(composition.heroHeight / composition.viewportHeight >= 0.99 && composition.heroHeight / composition.viewportHeight <= 1.01, `Immersive hero must fill the viewport at ${width}px`)
  assert.equal(composition.heroLeft, 0, `Immersive hero must start at the viewport edge at ${width}px`)
  assert.equal(composition.heroRight, width, `Immersive hero must end at the viewport edge at ${width}px`)
  assert.ok(composition.visualLeft <= 0 && composition.visualTop <= 0, `Immersive photos must cover the top-left edges at ${width}px`)
  assert.ok(composition.visualRight >= width && composition.visualBottom >= composition.heroHeight, `Immersive photos must cover the bottom-right edges at ${width}px`)
  assert.ok(composition.visualWidth >= width, `Immersive photos must cover the viewport at ${width}px`)
  report.push({ width, variant: 'immersive', ...result, immersiveComposition: composition })
  await page.screenshot({ path: resolve(outputDirectory, `immersive-hero-${width}.png`) })
  await page.close()
}

for (const [name, width, path] of [
  ['full-home-mobile', 390, '/'],
  ['full-home-desktop', 1440, '/'],
  ['full-services-mobile', 390, '/servicios/cabello'],
  ['full-promotions-mobile', 390, '/promociones'],
  ['full-velvet-mobile', 390, '/velvet'],
]) {
  const page = await preparePage(width, path)
  await page.evaluate(() => {
    for (const image of document.querySelectorAll('img[loading="lazy"]')) image.loading = 'eager'
  })
  await revealPage(page)
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 600))
  const layout = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('main > *')]
    return sections.map((section, index) => {
      const rect = section.getBoundingClientRect()
      const nextRect = sections[index + 1]?.getBoundingClientRect()
      return {
        name: section.id || section.className,
        height: Math.round(rect.height),
        gapAfter: nextRect ? Math.round(nextRect.top - rect.bottom) : 0,
      }
    })
  })
  assert.ok(layout.every((section) => Math.abs(section.gapAfter) <= 2), `Unexpected blank gap between sections on ${path}: ${JSON.stringify(layout)}`)
  layoutChecks.push({ name, width, path, sections: layout })
  await page.screenshot({ path: resolve(outputDirectory, `${name}.jpg`), type: 'jpeg', quality: 82, fullPage: true })
  await page.close()
}

for (const [name, width, path] of [
  ['services-top-mobile', 390, '/servicios/cabello'],
  ['services-top-desktop', 1440, '/servicios/cabello'],
  ['promotions-top-mobile', 390, '/promociones'],
  ['velvet-top-mobile', 390, '/velvet'],
]) {
  const page = await preparePage(width, path)
  await page.screenshot({ path: resolve(outputDirectory, `${name}.png`) })
  await page.close()
}

for (const [name, width, path, selector] of [
  ['experiences-mobile', 390, '/', '.experiences'],
  ['experiences-desktop', 1440, '/', '.experiences'],
  ['head-spa-mobile', 390, '/', '.head-spa'],
  ['head-spa-desktop', 1440, '/', '.head-spa'],
  ['spa-pause-mobile', 390, '/', '.spa-pause'],
  ['spa-pause-desktop', 1440, '/', '.spa-pause'],
  ['services-mobile', 390, '/servicios/cabello', '.catalog'],
  ['services-tablet', 768, '/servicios/spa', '.catalog'],
  ['services-desktop', 1440, '/servicios/cabello', '.catalog'],
  ['promotions-mobile', 390, '/promociones', '.promotion-catalog'],
  ['promotions-desktop', 1440, '/promociones', '.promotion-catalog'],
  ['velvet-mobile', 390, '/velvet', '.about-simple'],
  ['velvet-desktop', 1440, '/velvet', '.about-simple'],
  ['reviews-mobile', 390, '/', '.reviews-showcase'],
  ['reviews-desktop', 1440, '/', '.reviews-showcase'],
  ['location-desktop', 1440, '/velvet', '.location'],
  ['home-promotions-desktop', 1440, '/', '.home-promotions'],
  ['home-location-mobile', 390, '/', '.location'],
  ['home-location-desktop', 1440, '/', '.location'],
  ['final-cta-mobile', 390, '/', '.final-cta'],
  ['footer-mobile', 390, '/', '.footer'],
  ['footer-desktop', 1440, '/', '.footer'],
]) {
  const page = await preparePage(width, path)
  const element = await page.$(selector)
  if (element) {
    await element.scrollIntoView()
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 450))
    await element.screenshot({ path: resolve(outputDirectory, `${name}.png`) })
  }
  report.push({ width, ...(await diagnostics(page)) })
  await page.close()
}

for (const [width, path] of [[390, '/'], [1440, '/'], [1920, '/'], [390, '/servicios/cabello'], [1440, '/promociones']]) {
  const page = await preparePage(width, path, 2)
  await page.evaluate(() => {
    for (const image of document.querySelectorAll('img[loading="lazy"]')) image.loading = 'eager'
  })
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 700))
  const result = await diagnostics(page)
  assert.deepEqual(result.lowDensityImages, [], `Low-density image at ${width}px on ${path}: ${JSON.stringify(result.lowDensityImages)}`)
  report.push({ ...result, width, deviceScaleFactor: 2 })
  await page.close()
}
}

const interactionPage = await preparePage(390)
assert.equal(await interactionPage.$$eval('.hero', (elements) => elements.length), 0)
assert.equal(await interactionPage.$$eval('.immersive-hero', (elements) => elements.length), 1)
assert.ok(await interactionPage.$$eval('.immersive-hero .reveal', (elements) => elements.every((element) => element.classList.contains('is-visible'))))
await interactionPage.click('.menu-button')
assert.equal(await interactionPage.$eval('.mobile-menu', (element) => element.classList.contains('mobile-menu--open')), true)
assert.equal(await interactionPage.$eval('.menu-button', (element) => element.getAttribute('aria-expanded')), 'true')
await new Promise((resolveDelay) => setTimeout(resolveDelay, 320))
await interactionPage.screenshot({ path: resolve(outputDirectory, 'mobile-menu-open.png') })
await interactionPage.keyboard.press('Escape')
assert.equal(await interactionPage.$eval('.mobile-menu', (element) => element.classList.contains('mobile-menu--open')), false)

// Flow 1: Home -> Spa -> massage -> reserve.
await interactionPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
assert.equal(await interactionPage.$$eval('.service-explorer', (elements) => elements.length), 0)
await interactionPage.evaluate(() => window.scrollTo({ top: document.querySelector('#servicios-rapidos').offsetTop, behavior: 'instant' }))
await new Promise((resolveDelay) => setTimeout(resolveDelay, 200))
assert.ok(await interactionPage.$$eval('#servicios-rapidos .reveal', (elements) => elements.some((element) => element.classList.contains('is-visible'))))
assert.equal(await interactionPage.$eval('.desktop-nav a.active', (element) => element.textContent), 'Experiencias')
await interactionPage.click('.experience-tile__link[href="/servicios/spa"]')
await interactionPage.waitForFunction(() => location.pathname === '/servicios/spa')
await interactionPage.waitForFunction(() => document.querySelector('.catalog__intro h1')?.textContent === 'Spa')
await interactionPage.waitForFunction(() => window.scrollY < 5)
assert.equal(await interactionPage.$$eval('main h1', (elements) => elements.length), 1)
assert.equal(await interactionPage.$$eval('.catalog-head-spa', (elements) => elements.length), 0)
assert.equal(await interactionPage.$eval('.catalog__nav a.active', (element) => element.textContent.replace(/^\d+/, '').trim()), 'Spa')
assert.equal(await interactionPage.$$eval('.catalog-service', (elements) => elements.length), 11)
assert.equal(await interactionPage.$$eval('.catalog-service__title p', (elements) => elements.length), 11)
assert.match(await interactionPage.$eval('.catalog-service-list', (element) => element.textContent), /Masaje relajante/)
assert.match(await interactionPage.$eval('.catalog-service-list', (element) => element.textContent), /S\/60/)
await interactionPage.evaluate(() => {
  const item = [...document.querySelectorAll('.catalog-service')].find((element) => element.textContent.includes('Masaje relajante'))
  item.querySelector('summary').click()
})
assert.ok(await interactionPage.$eval('.catalog-service[open] a', (element) => element.href.includes('Masaje%20relajante')))

// Category changes restore the logical beginning and preserve clear context.
await interactionPage.evaluate(() => window.scrollTo(0, 700))
await interactionPage.click('.catalog__nav a[href="/servicios/faciales"]')
await interactionPage.waitForFunction(() => document.querySelector('.catalog__intro h1')?.textContent === 'Faciales')
await interactionPage.waitForFunction(() => window.scrollY < 5)
assert.equal(await interactionPage.$eval('.catalog__nav a.active', (element) => element.textContent.replace(/^\d+/, '').trim()), 'Faciales')
assert.equal(await interactionPage.$$eval('.catalog-service', (elements) => elements.length), 6)
assert.match(await interactionPage.$eval('.catalog-service-list', (element) => element.textContent), /regeneración celular/i)

// Flow 2: Home -> Head Spa -> selected Head Spa service -> reserve.
await interactionPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await interactionPage.click('.head-spa a[href="/servicios/head-spa"]')
await interactionPage.waitForFunction(() => location.pathname === '/servicios/head-spa')
await interactionPage.waitForFunction(() => document.querySelector('.catalog__intro h1')?.textContent === 'Head Spa')
await interactionPage.waitForFunction(() => window.scrollY < 5)
assert.equal(await interactionPage.$eval('.catalog__nav a.active', (element) => element.textContent.replace(/^\d+/, '').trim()), 'Head Spa')
assert.match(await interactionPage.$eval('.catalog-service-list', (element) => element.textContent), /Dúo Élite/)

// Flow 3: Home -> promotions -> promotion -> reserve.
await interactionPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await interactionPage.click('.home-promotions a[href="/promociones"]')
await interactionPage.waitForFunction(() => location.pathname === '/promociones')
await interactionPage.waitForFunction(() => document.querySelector('.promotion-catalog h1'))
await interactionPage.waitForFunction(() => window.scrollY < 5)
assert.equal(await interactionPage.$$eval('main h1', (elements) => elements.length), 1)
assert.equal(await interactionPage.$$eval('.promotion-note', (elements) => elements.length), 0)
assert.ok(await interactionPage.$eval('.catalog-promo__body a', (element) => element.href.startsWith('https://wa.me/51946992673')))
await interactionPage.click('.promotion-filters button:nth-child(2)')
await interactionPage.waitForFunction(() => new URLSearchParams(location.search).get('categoria') === 'Spa')
await interactionPage.waitForFunction(() => document.querySelector('.promotion-filters button[aria-pressed="true"]')?.textContent === 'Spa')
assert.ok((await interactionPage.$$eval('.catalog-promo', (elements) => elements.length)) > 0)
assert.equal(await interactionPage.$eval('.promotion-filters button[aria-pressed="true"]', (element) => element.textContent), 'Spa')
assert.ok(await interactionPage.$$eval('.promotion-filters button', (elements) => elements.every((element) => element.getBoundingClientRect().height >= 44)))

// Flow 4: Home -> mobile menu -> location -> directions context.
await interactionPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
await interactionPage.click('.menu-button')
await new Promise((resolveDelay) => setTimeout(resolveDelay, 320))
await interactionPage.click('.mobile-menu a[href="/velvet#ubicacion"]')
await interactionPage.waitForFunction(() => location.pathname === '/velvet' && location.hash === '#ubicacion')
await interactionPage.waitForFunction(() => {
  const top = document.querySelector('#ubicacion')?.getBoundingClientRect().top
  return top >= 60 && top <= 90
})
assert.equal(await interactionPage.$eval('.desktop-nav a[href="/velvet#ubicacion"]', (element) => element.classList.contains('active')), true)
assert.equal(await interactionPage.$eval('#ubicacion .button', (element) => element.textContent.trim().startsWith('Cómo llegar')), true)
assert.notEqual(await interactionPage.$eval('#ubicacion iframe', (element) => getComputedStyle(element).pointerEvents), 'none')
assert.ok(await interactionPage.$eval('#ubicacion iframe', (element) => element.tabIndex) >= 0)

// Flow 5: mobile menu -> services -> Nails -> back to Hair.
await interactionPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
await interactionPage.click('.menu-button')
await new Promise((resolveDelay) => setTimeout(resolveDelay, 320))
await interactionPage.click('.mobile-menu a[href="/servicios"]')
await interactionPage.waitForFunction(() => location.pathname === '/servicios/cabello')
await interactionPage.waitForSelector('.catalog__nav a.active')
assert.equal(await interactionPage.$eval('.catalog__nav a.active', (element) => element.textContent.replace(/^\d+/, '').trim()), 'Cabello')
await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
await interactionPage.click('.catalog__nav a[href="/servicios/manicure"]')
await interactionPage.waitForFunction(() => location.pathname === '/servicios/manicure')
await interactionPage.waitForFunction(() => document.querySelector('.catalog__intro h1')?.textContent === 'Manicure')
await new Promise((resolveDelay) => setTimeout(resolveDelay, 350))
assert.ok(await interactionPage.evaluate(() => window.scrollY < 120), 'Manicure should open at the beginning of its catalog view')
assert.equal(await interactionPage.$eval('.catalog__nav a.active', (element) => element.textContent.replace(/^\d+/, '').trim()), 'Manicure')
await interactionPage.click('.catalog__nav a[href="/servicios/cabello"]')
await interactionPage.waitForFunction(() => location.pathname === '/servicios/cabello')
await interactionPage.waitForFunction(() => document.querySelector('.catalog__intro h1')?.textContent === 'Cabello')
await new Promise((resolveDelay) => setTimeout(resolveDelay, 350))
assert.ok(await interactionPage.evaluate(() => window.scrollY < 120), 'Hair should open at the beginning of its catalog view')
assert.equal(await interactionPage.$eval('.catalog__nav a.active', (element) => element.textContent.replace(/^\d+/, '').trim()), 'Cabello')
assert.ok(await interactionPage.$$eval('.catalog__nav a', (elements) => elements.every((element) => element.getBoundingClientRect().height >= 44)))

await interactionPage.goto(`${baseUrl}/?hero=inmersivo`, { waitUntil: 'domcontentloaded' })
assert.equal(await interactionPage.$$eval('.hero', (elements) => elements.length), 0)
assert.equal(await interactionPage.$$eval('.immersive-hero', (elements) => elements.length), 1)
assert.ok(await interactionPage.$eval('.immersive-hero .button--primary', (element) => element.href.startsWith('https://wa.me/51946992673')))
assert.equal(await interactionPage.$eval('.immersive-hero__secondary', (element) => element.getAttribute('href')), '#servicios-rapidos')

await interactionPage.goto(`${baseUrl}/velvet`, { waitUntil: 'domcontentloaded' })
assert.equal(await interactionPage.$$eval('.page-hero', (elements) => elements.length), 0)
assert.equal(await interactionPage.$$eval('main h1', (elements) => elements.length), 1)
assert.equal(await interactionPage.$$eval('.public-review', (elements) => elements.length), 0)
assert.equal(await interactionPage.$eval('.header-book', (element) => getComputedStyle(element).display), 'none')
assert.ok(await interactionPage.$eval('.menu-button', (element) => element.getBoundingClientRect().height >= 44))
assert.equal(await interactionPage.$eval('.whatsapp-float', (element) => getComputedStyle(element).display), 'none')

await interactionPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
assert.equal(await interactionPage.$$eval('.public-review', (elements) => elements.length), 4)
assert.ok(await interactionPage.$$eval('.public-review blockquote', (elements) => elements.every((element) => element.textContent.trim().length > 20)))

const whatsappLinks = await interactionPage.$$eval('a[href^="https://wa.me/"]', (links) => links.map((link) => link.href))
assert.ok(whatsappLinks.length >= 3)
assert.ok(whatsappLinks.every((href) => href.startsWith('https://wa.me/51946992673')))
await interactionPage.close()

await browser.close()
console.log(JSON.stringify({ responsive: report, layoutChecks, interactions: 'passed' }, null, 2))
