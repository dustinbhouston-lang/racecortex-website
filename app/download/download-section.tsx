'use client'

/**
 * DownloadSection — renders the download button and the post-click instructions panel.
 *
 * The download trigger MUST be a plain <a> tag (not <Link>).
 * <Link> performs client-side navigation and won't trigger a file download.
 * The browser follows /api/download → 302 → R2 presigned URL natively,
 * which is what initiates the actual file transfer.
 *
 * The onClick handler fires before the browser navigates away, so we can
 * update local state to show the post-download instructions immediately.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { redeemInviteCode } from './actions'

interface DownloadSectionProps {
  /** Whether this user has profiles.beta_active = true */
  betaActive: boolean
  /** Error message from ?error=beta_not_active redirect */
  errorMessage?: string
}

function RedeemCodeForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(undefined)
    const result = await redeemInviteCode(code)
    setLoading(false)
    if (result.ok) {
      setSuccess(true)
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXX-XXXX-XXXX"
          className="font-mono rounded-sm"
          disabled={loading || success}
          aria-label="Invite code"
        />
        <Button
          type="submit"
          className="rounded-sm shrink-0"
          disabled={loading || success || !code.trim()}
        >
          {loading ? 'Redeeming…' : 'Redeem code'}
        </Button>
      </div>
      {success && (
        <p className="font-mono text-sm text-primary">Beta access unlocked!</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </form>
  )
}

export function DownloadSection({ betaActive, errorMessage }: DownloadSectionProps) {
  const [downloading, setDownloading] = useState(false)

  // Post-click: browser has started the download; show instructions
  if (downloading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-sm border border-primary/30 bg-primary/5 px-5 py-4">
          <p className="font-mono text-sm font-semibold text-primary">
            ✓ Your download has started. Check your browser&apos;s downloads.
          </p>
        </div>

        <Separator />

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Next steps</p>
          <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <span className="text-foreground font-medium">1.</span> Run{' '}
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">
                RaceCortex Setup 1.0.0.exe
              </code>
            </li>
            <li>
              <span className="text-foreground font-medium">2.</span> When SmartScreen prompts
              you, click{' '}
              <strong className="text-foreground">More info</strong> then{' '}
              <strong className="text-foreground">Run anyway</strong> — this is normal for new
              closed-beta software.
            </li>
            <li>
              <span className="text-foreground font-medium">3.</span> Sign in to the app with
              your same RaceCortex account.
            </li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Need help? See your invite email.
          </p>
        </div>
      </div>
    )
  }

  // Beta access not yet active — show redemption form
  if (!betaActive) {
    return (
      <div className="flex flex-col gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Enter the invite code from your invitation email to unlock your download.
          </p>
          <RedeemCodeForm />
        </div>
        <Button
          disabled
          size="lg"
          className="h-12 rounded-sm cursor-not-allowed opacity-50"
        >
          <Download size={18} />
          Download installer
        </Button>
      </div>
    )
  }

  // Beta active — show live download link
  return (
    <div className="flex flex-col gap-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {/*
        Plain <a> is intentional — DO NOT replace with <Link>.
        Browser navigates to /api/download which returns 302 → R2 presigned URL.
        This causes the browser to trigger a file download automatically.
        A <Link> soft-navigation would consume the response in JS and kill the download.
      */}
      <a
        href="/api/download"
        onClick={() => setDownloading(true)}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Download size={18} />
        Download installer
      </a>
      <p className="text-xs text-muted-foreground text-center">
        RaceCortex Setup 1.0.0.exe · Windows 10/11 · ~249 MB
      </p>
    </div>
  )
}
