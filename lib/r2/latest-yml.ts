/**
 * parseLatestYml() — strict, pure parser for the update feed's latest.yml.
 *
 * The website serves exactly the installer the update feed names, so this is
 * the single place that decides which object key is downloadable. It accepts
 * ONLY the exact shape the desktop build writes
 * (ui/settings_electron/scripts/regen-update-metadata.js):
 *
 *   version: 1.8.1
 *   files:
 *     - url: RaceCortex Setup 1.8.1.exe
 *       sha512: <base64>
 *       size: 273808936
 *   path: RaceCortex Setup 1.8.1.exe
 *   sha512: <base64>
 *   releaseDate: '2026-10-12T20:45:42.822Z'
 *
 * After CRLF → LF and dropping trailing empty lines, every line must match one
 * allowlisted pattern. Anything else — document markers, comments, quoted or
 * escaped keys, anchors/aliases, flow collections, tabs, unknown keys, empty
 * lines mid-file — rejects the whole feed. This way the site can never accept
 * a feed the desktop updater's YAML parser would read differently or reject.
 *
 * Structure rules: version and path exactly once; files, sha512, releaseDate at
 * most once. A files block is the `files:` line, immediately its single
 * `  - url:` item, then 0–3 of that item's sha512/size/blockMapSize (each at
 * most once). The path's version must equal `version`; the files url (if
 * present) must equal `path`.
 *
 * If the build's format ever changes, the site goes "temporarily unavailable"
 * until this allowlist is updated. That is intended: missing beats wrong.
 */

export type LatestYmlResult =
  | { ok: true; key: string; version: string }
  | { ok: false; reason: LatestYmlRejection }

export type LatestYmlRejection =
  | 'empty'
  | 'unsupported_line'
  | 'missing_version'
  | 'missing_path'
  | 'duplicate_version'
  | 'duplicate_path'
  | 'duplicate_key'
  | 'invalid_version'
  | 'invalid_path'
  | 'files_block_invalid'
  | 'version_path_mismatch'
  | 'url_path_mismatch'

const INSTALLER = 'RaceCortex Setup \\d+\\.\\d+\\.\\d+\\.exe'

const TOP_VERSION = /^version: (\d+\.\d+\.\d+)$/
const TOP_FILES = /^files:$/
const TOP_PATH = new RegExp(`^path: (${INSTALLER})$`)
const TOP_SHA512 = /^sha512: [A-Za-z0-9+/]+={0,2}$/
const TOP_RELEASE_DATE = /^releaseDate: '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:.]+Z'$/

const ITEM_URL = new RegExp(`^  - url: (${INSTALLER})$`)
const ITEM_FIELDS: Array<[string, RegExp]> = [
  ['sha512', /^ {4}sha512: [A-Za-z0-9+/]+={0,2}$/],
  ['size', /^ {4}size: \d+$/],
  ['blockMapSize', /^ {4}blockMapSize: \d+$/],
]

const INSTALLER_VERSION = /^RaceCortex Setup (\d+\.\d+\.\d+)\.exe$/

export function parseLatestYml(text: string): LatestYmlResult {
  if (typeof text !== 'string' || text.trim() === '') return { ok: false, reason: 'empty' }

  const lines = text.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n')

  let version: string | undefined
  let path: string | undefined
  let url: string | undefined
  const seenTop = new Set<string>()

  // files block state: 'none' (not inside), 'expectUrl' (just saw files:), 'inItem' (after - url:)
  let filesState: 'none' | 'expectUrl' | 'inItem' = 'none'
  const seenItemFields = new Set<string>()

  for (const line of lines) {
    // ── Lines inside the files: block (two/four-space indented) ─────────────
    if (line.startsWith(' ')) {
      if (filesState === 'none') return { ok: false, reason: 'unsupported_line' }

      const urlMatch = ITEM_URL.exec(line)
      if (filesState === 'expectUrl') {
        // The block's first child must be its sole - url: item.
        if (!urlMatch) return { ok: false, reason: 'files_block_invalid' }
        url = urlMatch[1]
        filesState = 'inItem'
        continue
      }

      if (urlMatch) return { ok: false, reason: 'files_block_invalid' } // second item
      const field = ITEM_FIELDS.find(([, re]) => re.test(line))
      if (!field) return { ok: false, reason: 'unsupported_line' }
      if (seenItemFields.has(field[0])) return { ok: false, reason: 'files_block_invalid' }
      seenItemFields.add(field[0])
      continue
    }

    // ── Top-level lines ──────────────────────────────────────────────────────
    if (filesState === 'expectUrl') return { ok: false, reason: 'files_block_invalid' } // files: with no item
    filesState = 'none'

    let key: string
    let m: RegExpExecArray | null
    if ((m = TOP_VERSION.exec(line))) {
      key = 'version'
      if (seenTop.has(key)) return { ok: false, reason: 'duplicate_version' }
      version = m[1]
    } else if ((m = TOP_PATH.exec(line))) {
      key = 'path'
      if (seenTop.has(key)) return { ok: false, reason: 'duplicate_path' }
      path = m[1]
    } else if (TOP_FILES.test(line)) {
      key = 'files'
      if (seenTop.has(key)) return { ok: false, reason: 'duplicate_key' }
      filesState = 'expectUrl'
    } else if (TOP_SHA512.test(line)) {
      key = 'sha512'
      if (seenTop.has(key)) return { ok: false, reason: 'duplicate_key' }
    } else if (TOP_RELEASE_DATE.test(line)) {
      key = 'releaseDate'
      if (seenTop.has(key)) return { ok: false, reason: 'duplicate_key' }
    } else if (line.startsWith('version:')) {
      return { ok: false, reason: 'invalid_version' }
    } else if (line.startsWith('path:')) {
      return { ok: false, reason: 'invalid_path' }
    } else {
      return { ok: false, reason: 'unsupported_line' }
    }
    seenTop.add(key)
  }

  if (filesState === 'expectUrl') return { ok: false, reason: 'files_block_invalid' }
  if (version === undefined) return { ok: false, reason: 'missing_version' }
  if (path === undefined) return { ok: false, reason: 'missing_path' }

  const pathVersion = INSTALLER_VERSION.exec(path)?.[1]
  if (pathVersion !== version) return { ok: false, reason: 'version_path_mismatch' }
  if (url !== undefined && url !== path) return { ok: false, reason: 'url_path_mismatch' }

  return { ok: true, key: path, version }
}
