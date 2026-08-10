/**
 * Manual per-tester beta-invite send script.
 *
 *   pnpm tsx scripts/send-invite.ts --to <email> --name <firstName> --code <RC-XXXX-XXXX> [--dry-run]
 *
 * Renders emails/beta-invite.tsx to HTML + a plain-text alternative and sends
 * both via Resend. One explicit recipient per invocation. Does NOT touch
 * Supabase or mark the invite code used — redemption does that.
 *
 * --dry-run (default-safe): writes scripts/out/beta-invite.preview.{html,txt}
 * and prints the resolved envelope. Never calls Resend, never needs the API key.
 */
import dotenv from "dotenv"

// Load .env.local before any process.env read. pnpm tsx does not auto-load env
// files. Missing file is a non-fatal no-op (keeps --dry-run working anywhere);
// does not override vars already set in the real shell environment.
dotenv.config({ path: ".env.local" })

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { render } from "@react-email/render"
import { Resend } from "resend"

import BetaInviteEmail from "../emails/beta-invite"

const FROM = "RaceCortex <beta@racecortex.com>"
const REPLY_TO = "beta@racecortex.com"
const SUBJECT = "You're in — welcome to the RaceCortex beta 🏁"

const CODE_RE = /^RC-[A-Z0-9]{4}-[A-Z0-9]{4}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Args {
  to?: string
  name?: string
  code?: string
  dryRun: boolean
}

function parseArgs(argv: string[]): Args {
  const args: Args = { dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    switch (arg) {
      case "--to":
        args.to = argv[++i]
        break
      case "--name":
        args.name = argv[++i]
        break
      case "--code":
        args.code = argv[++i]
        break
      case "--dry-run":
        args.dryRun = true
        break
      default:
        fail(`Unknown argument: ${arg}`)
    }
  }
  return args
}

function fail(msg: string): never {
  console.error(`\n✗ ${msg}\n`)
  console.error(
    "Usage: pnpm tsx scripts/send-invite.ts --to <email> --name <firstName> --code <RC-XXXX-XXXX> [--dry-run]\n"
  )
  process.exit(1)
}

async function main() {
  const { to, name, code, dryRun } = parseArgs(process.argv.slice(2))

  if (!to) fail("--to <email> is required.")
  if (!name) fail("--name <firstName> is required.")
  if (!code) fail("--code <RC-XXXX-XXXX> is required.")
  if (!EMAIL_RE.test(to)) fail(`--to does not look like an email: ${to}`)
  if (!CODE_RE.test(code))
    fail(`--code must match RC-XXXX-XXXX (uppercase A-Z/0-9): ${code}`)

  const email = BetaInviteEmail({ firstName: name, inviteCode: code })
  const html = await render(email)
  const text = await render(email, { plainText: true })

  console.log("\nResolved envelope:")
  console.log(`  From:     ${FROM}`)
  console.log(`  Reply-To: ${REPLY_TO}`)
  console.log(`  To:       ${to}`)
  console.log(`  Subject:  ${SUBJECT}`)

  if (dryRun) {
    const outDir = path.join(__dirname, "out")
    fs.mkdirSync(outDir, { recursive: true })
    const htmlPath = path.join(outDir, "beta-invite.preview.html")
    const txtPath = path.join(outDir, "beta-invite.preview.txt")
    fs.writeFileSync(htmlPath, html, "utf8")
    fs.writeFileSync(txtPath, text, "utf8")
    console.log("\n✓ Dry run — no email sent. Wrote:")
    console.log(`  ${htmlPath}`)
    console.log(`  ${txtPath}\n`)
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    fail(
      "RESEND_API_KEY is not set. Add it to .env.local for a live send, or use --dry-run."
    )
  }

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send(
    {
      from: FROM,
      to,
      replyTo: REPLY_TO,
      subject: SUBJECT,
      html,
      text,
    },
    { idempotencyKey: `invite-${code}-${to}` }
  )

  if (error) {
    console.error(`\n✗ Resend error: ${error.name} — ${error.message}\n`)
    process.exit(1)
  }

  console.log(`\n✓ Sent. Resend message id: ${data?.id}\n`)
}

// __dirname shim for ESM execution under tsx.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
