// Server-only. Do not import from client code.
// This module reads R2 credentials from process.env at call time.
// Importing from a Client Component would expose those secrets to the browser.
import 'server-only'

import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { resolveInstaller, type InstallerResolution } from './installer'

/**
 * getR2Client() — lazy factory returning an S3Client configured for Cloudflare R2.
 *
 * Reads R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY at call time
 * so that next build never crashes when env vars are absent at build evaluation.
 *
 * R2-specific config:
 *   region: 'auto'        — Cloudflare selects the region automatically
 *   forcePathStyle: true  — R2 requires path-style URLs (not virtual-hosted)
 *   endpoint              — derived from R2_ACCOUNT_ID
 *   maxAttempts: 1        — no SDK-internal retries; resolveInstaller() owns the
 *                           single bounded retry inside its 8 s budget
 */
export function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId) {
    throw new Error(
      'Missing required env var: R2_ACCOUNT_ID. Add it to .env.local (see .env.local.example).',
    )
  }
  if (!accessKeyId) {
    throw new Error(
      'Missing required env var: R2_ACCESS_KEY_ID. Add it to .env.local (see .env.local.example).',
    )
  }
  if (!secretAccessKey) {
    throw new Error(
      'Missing required env var: R2_SECRET_ACCESS_KEY. Add it to .env.local (see .env.local.example).',
    )
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
    maxAttempts: 1,
  })
}

/**
 * getInstallerBucketName() — returns the R2 bucket name from env.
 * Throws clearly if R2_BUCKET_NAME is not set.
 */
export function getInstallerBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME
  if (!bucket) {
    throw new Error(
      'Missing required env var: R2_BUCKET_NAME. Add it to .env.local (see .env.local.example).',
    )
  }
  return bucket
}

/**
 * resolveLatestInstaller() — the single server-side source of truth for which
 * installer the website serves: the object named by the update feed's
 * latest.yml in the installer bucket. Used by both the /download page (build
 * info) and /api/download (re-resolved on every request). Never throws.
 */
export function resolveLatestInstaller(): Promise<InstallerResolution> {
  return resolveInstaller(() => {
    const r2 = getR2Client()
    const bucket = getInstallerBucketName()
    return {
      getObject: (key, signal) =>
        r2.send(new GetObjectCommand({ Bucket: bucket, Key: key }), { abortSignal: signal }),
      headObject: (key, signal) =>
        r2.send(new HeadObjectCommand({ Bucket: bucket, Key: key }), { abortSignal: signal }),
    }
  })
}
