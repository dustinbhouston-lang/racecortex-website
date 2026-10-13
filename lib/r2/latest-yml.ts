/**
 * parseLatestYml() — strict, pure parser for the update feed's latest.yml.
 *
 * The website serves exactly the installer the update feed names, so this is
 * the single place that decides which object key is downloadable. It is
 * deliberately strict (missing beats wrong):
 *
 *   - exactly one unindented `version:` line and one unindented `path:` line
 *     (a duplicate is rejected — never pick one);
 *   - values are plain or simply-quoted scalars only;
 *   - version matches ^\d+\.\d+\.\d+$;
 *   - path matches ^RaceCortex Setup (\d+\.\d+\.\d+)\.exe$ and the captured
 *     version equals `version` exactly.
 *
 * Indented lines (the `files:` list entries) and other top-level keys
 * (`sha512`, `releaseDate`, …) are ignored. No YAML dependency: the repo has
 * none, and a line parser is easier to keep strict.
 */

export type LatestYmlResult =
  | { ok: true; key: string; version: string }
  | { ok: false; reason: LatestYmlRejection }

export type LatestYmlRejection =
  | 'empty'
  | 'missing_version'
  | 'missing_path'
  | 'duplicate_version'
  | 'duplicate_path'
  | 'unsupported_scalar'
  | 'invalid_version'
  | 'invalid_path'
  | 'version_path_mismatch'

const VERSION_RE = /^\d+\.\d+\.\d+$/
const PATH_RE = /^RaceCortex Setup (\d+\.\d+\.\d+)\.exe$/
const TOP_LEVEL_KEY_RE = /^([A-Za-z0-9_]+):(.*)$/

/** Plain scalar, or a single/double-quoted scalar with no inner quotes or escapes. */
function parseScalar(raw: string): string | null {
  const value = raw.trim()
  if (value === '') return null
  const quoted = /^'([^']*)'$/.exec(value) ?? /^"([^"\\]*)"$/.exec(value)
  if (quoted) return quoted[1]
  // Plain scalar: reject anything YAML would treat as structure, quoting or a comment.
  if (/^['"[\]{}&*!|>%@`#-]/.test(value) || value.includes(' #') || /['"]/.test(value)) {
    return null
  }
  return value
}

export function parseLatestYml(text: string): LatestYmlResult {
  if (typeof text !== 'string' || text.trim() === '') return { ok: false, reason: 'empty' }

  const versions: string[] = []
  const paths: string[] = []

  for (const line of text.split(/\r?\n/)) {
    const match = TOP_LEVEL_KEY_RE.exec(line)
    if (!match) continue
    if (match[1] === 'version') versions.push(match[2])
    else if (match[1] === 'path') paths.push(match[2])
  }

  if (versions.length === 0) return { ok: false, reason: 'missing_version' }
  if (versions.length > 1) return { ok: false, reason: 'duplicate_version' }
  if (paths.length === 0) return { ok: false, reason: 'missing_path' }
  if (paths.length > 1) return { ok: false, reason: 'duplicate_path' }

  const version = parseScalar(versions[0])
  const key = parseScalar(paths[0])
  if (version === null || key === null) return { ok: false, reason: 'unsupported_scalar' }

  if (!VERSION_RE.test(version)) return { ok: false, reason: 'invalid_version' }
  const pathMatch = PATH_RE.exec(key)
  if (!pathMatch) return { ok: false, reason: 'invalid_path' }
  if (pathMatch[1] !== version) return { ok: false, reason: 'version_path_mismatch' }

  return { ok: true, key, version }
}
