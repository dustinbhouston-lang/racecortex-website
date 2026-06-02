// Server-only. Do not import from client code.
// This module reads R2 credentials from process.env at call time.
// Importing from a Client Component would expose those secrets to the browser.
import 'server-only'

import { S3Client } from '@aws-sdk/client-s3'

/**
 * INSTALLER_OBJECT_KEY — byte-exact key of the installer in the R2 bucket.
 * Capital P, capital W, spaces included. Must match the object name precisely.
 */
export const INSTALLER_OBJECT_KEY = 'RaceCortex Setup 1.0.0.exe'

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
