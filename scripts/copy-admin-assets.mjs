/*
 * Copies the Decap CMS runtime bundle from node_modules into public/admin/dist/
 * so the admin app is self-hosted (no dependency on the unpkg CDN) without
 * committing several MB of generated JS to git. Runs automatically before
 * `npm run build` via the "prebuild" script in package.json.
 */
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'node_modules/decap-cms/dist'
const DEST = 'public/admin/dist'

if (!existsSync(SRC)) {
  console.error(`decap-cms not found at ${SRC} — run "npm install" first.`)
  process.exit(1)
}

mkdirSync(DEST, { recursive: true })

const wanted = readdirSync(SRC).filter((name) => {
  if (name.endsWith('.map') || name.endsWith('.LICENSE.txt')) return false
  if (name.endsWith('.wasm')) return true
  // Keep the "decap-cms" entry + its numbered chunks, skip the duplicate
  // legacy-named "cms.js" build of the same code.
  return name === 'decap-cms.js' || /^\d+\.decap-cms\.js$/.test(name)
})

for (const name of wanted) {
  copyFileSync(join(SRC, name), join(DEST, name))
}

console.log(`Copied ${wanted.length} Decap CMS runtime files to ${DEST}/`)
