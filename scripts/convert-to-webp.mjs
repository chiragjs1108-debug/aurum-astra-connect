/*
 * Converts an image file to .webp, matching the format every existing
 * blog image already uses (see docs/blog-content-automation-phase3.md §5).
 * Used by the content-automation pipeline on both AI-generated images
 * (which come back as PNG from Imagen) and real photos pulled from Drive
 * (whatever format the user uploaded), so everything that lands in
 * public/img/blog/ is consistently .webp regardless of source.
 *
 * Usage: node scripts/convert-to-webp.mjs <input-path> <output-path>
 */
import sharp from 'sharp'

const [inputPath, outputPath] = process.argv.slice(2)

if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/convert-to-webp.mjs <input-path> <output-path>')
  process.exit(1)
}

await sharp(inputPath).webp({ quality: 82 }).toFile(outputPath)
console.log(`Wrote ${outputPath}`)
