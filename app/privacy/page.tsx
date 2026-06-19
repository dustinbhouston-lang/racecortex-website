import type { Metadata } from "next"
import { LegalPageWrapper } from "@/components/legal-page-wrapper"

export const metadata: Metadata = {
  title: "Privacy Policy — RaceCortex",
  description:
    "How RaceCortex collects, uses, and protects your data during the closed beta.",
}

export default function PrivacyPage() {
  return (
    <LegalPageWrapper>
      <h1>RaceCortex Privacy Policy</h1>
      <p>
        <strong>Last updated: 17 June 2026</strong>
      </p>

      <p>
        RaceCortex ("RaceCortex," "we," "us") is software operated by{" "}
        <strong>RaceCortex LLC</strong> (a single-member LLC in Arkansas, USA). This
        policy explains what information the RaceCortex desktop app, the AI race
        engineer ("Clive"), and our website (<code>racecortex.com</code>) collect,
        why, and who processes it. RaceCortex is currently in{" "}
        <strong>closed beta</strong>; data practices may change as the product
        develops, and we'll update this policy and the "last updated" date when they
        do.
      </p>
      <p>
        By creating an account or using RaceCortex during the beta, you agree to this
        policy.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>
          We collect what we need to run the service: your{" "}
          <strong>account email</strong>, your{" "}
          <strong>gameplay/telemetry data</strong> (so Clive can engineer for you),
          your <strong>push-to-talk voice</strong> (transcribed to text), basic{" "}
          <strong>usage metrics</strong> (to keep the service running and prevent
          runaway costs), and <strong>diagnostics</strong> (to fix crashes and bugs).
        </li>
        <li>
          A lot of data <strong>never leaves your PC</strong> — your iRacing
          telemetry, local session history, and preferences are processed locally.
        </li>
        <li>
          We <strong>do not sell your data</strong> and don't show ads.
        </li>
        <li>
          Automatic crash reporting can be <strong>turned off</strong> in Settings.
        </li>
      </ul>

      <h2>1. Information we collect</h2>

      <p>
        <strong>Account information.</strong> When you redeem a beta invite and sign
        in, we store your <strong>email address</strong> and a securely{" "}
        <strong>hashed</strong> password (handled by our auth provider, Supabase — we
        never store your password in plain text). We also record your beta invite code
        and beta-access status.
      </p>

      <p>
        <strong>
          Gameplay &amp; telemetry data (sent to the AI to generate engineer
          responses).
        </strong>{" "}
        While you drive, RaceCortex reads live data from iRacing and sends the
        relevant context to our AI proxy for processing. This includes things like
        your{" "}
        <strong>
          car and track, lap and sector times, position and gaps, fuel,
          tyre/temperature readings, incidents, and session type
        </strong>
        , plus your{" "}
        <strong>iRacing display name, iRating, and license</strong> (so Clive can
        address you and tailor advice). This is used to produce real-time engineer
        callouts and answers; it is processed in real time and is not used to build an
        advertising profile.
      </p>

      <p>
        <strong>Voice (push-to-talk).</strong> When you hold your push-to-talk key
        and speak, the captured{" "}
        <strong>
          audio is sent to our speech-to-text provider (Groq) for transcription
        </strong>
        . We use the resulting text to understand your request. We do not retain your
        voice recordings.
      </p>

      <p>
        <strong>Usage &amp; cost metrics.</strong> To operate the service and enforce
        per-user spending limits (so one runaway client can't exhaust our API budget),
        we record per-account, per-day{" "}
        <strong>counts and estimated costs of API calls</strong> and{" "}
        <strong>token usage by AI model</strong>. This is operational/aggregate data
        tied to your account, not the content of your conversations.
      </p>

      <p>
        <strong>Diagnostics &amp; crash reports.</strong> To find and fix problems,
        the app sends crash and error reports to our diagnostics provider (Sentry).
        These include technical details such as{" "}
        <strong>
          error/stack traces, the app version, your operating system, and hardware
          (e.g., GPU/CPU) information
        </strong>
        , associated with your account email. If you use the{" "}
        <strong>"Report a problem"</strong> button, we also receive your typed
        message, your optional contact email, and your recent{" "}
        <strong>app log files</strong> (we automatically redact obvious secrets such
        as tokens before sending; logs may still contain gameplay details like
        car/track names). Automatic crash reporting is{" "}
        <strong>on by default and can be turned off</strong> in Settings → it does
        not disable the manual "Report a problem" button, which only sends when you
        click it.
      </p>

      <p>
        <strong>Website &amp; technical data.</strong> When you download the app or
        check for updates, our hosting/CDN providers (Vercel, Cloudflare) process
        standard request information such as{" "}
        <strong>IP address and request metadata</strong> in server logs. Our website
        also uses <strong>Vercel Analytics</strong> — a privacy-friendly,{" "}
        <strong>cookieless</strong> analytics tool — to measure{" "}
        <strong>aggregate</strong> site traffic (such as page views and referrers); it
        does not use cookies or build a personal profile of you.
      </p>

      <h2>2. What stays on your device</h2>
      <p>
        Much of what RaceCortex handles is{" "}
        <strong>processed locally and not collected by us</strong>, including: your
        raw iRacing telemetry stream, locally cached session history and analysis,
        your saved preferences and overlay layout, and your application logs (these
        stay on your PC unless you choose to send them via "Report a problem"). Your
        sign-in token is stored securely in the Windows Credential Manager on your
        machine.
      </p>

      <h2>3. How we use information</h2>
      <ul>
        <li>
          <strong>Provide the service</strong> — generate Clive's engineer responses,
          coaching, and strategy.
        </li>
        <li>
          <strong>Operate and protect it</strong> — authenticate you, enforce spending
          limits, prevent abuse, and keep costs sustainable.
        </li>
        <li>
          <strong>Improve it</strong> — diagnose crashes/bugs and understand aggregate
          usage during the beta.
        </li>
        <li>
          <strong>Communicate</strong> — send you beta onboarding, important service
          notices, and respond to your reports.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> sell personal information, and we do not use your
        gameplay or voice data to serve advertising.
      </p>

      <h2>4. Who processes your data (sub-processors)</h2>
      <p>
        We rely on these third-party services to run RaceCortex. Each processes only
        what's needed for its function, under its own terms and security:
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Data involved</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Supabase</strong>
              </td>
              <td>Accounts/auth + operational database</td>
              <td>Email, hashed password, beta status, usage metrics</td>
            </tr>
            <tr>
              <td>
                <strong>Vercel</strong> (incl. <strong>AI Gateway</strong>)
              </td>
              <td>Hosts our API proxy; routes AI requests</td>
              <td>Request metadata; relays gameplay context to Anthropic</td>
            </tr>
            <tr>
              <td>
                <strong>Anthropic</strong> (Claude)
              </td>
              <td>Generates Clive's responses/coaching</td>
              <td>Gameplay/telemetry context + your transcribed requests</td>
            </tr>
            <tr>
              <td>
                <strong>Groq</strong>
              </td>
              <td>Speech-to-text for push-to-talk</td>
              <td>Your push-to-talk audio (transcribed, not retained by us)</td>
            </tr>
            <tr>
              <td>
                <strong>Inworld</strong>
              </td>
              <td>Text-to-speech (Clive's voice)</td>
              <td>
                The text of Clive's spoken responses (may include your name and race
                context)
              </td>
            </tr>
            <tr>
              <td>
                <strong>Sentry</strong>
              </td>
              <td>Crash/error diagnostics</td>
              <td>
                Error traces, app/OS/hardware info, account email, and—if you submit
                a report—your message + redacted logs
              </td>
            </tr>
            <tr>
              <td>
                <strong>Cloudflare</strong>
              </td>
              <td>DNS + installer/update distribution</td>
              <td>IP/request metadata for downloads and update checks</td>
            </tr>
            <tr>
              <td>
                <strong>Vercel Analytics</strong>
              </td>
              <td>Privacy-friendly website analytics</td>
              <td>
                Cookieless, aggregate page views &amp; referrers (no personal profile)
              </td>
            </tr>
            <tr>
              <td>
                <strong>Resend</strong>
              </td>
              <td>Transactional/onboarding email</td>
              <td>Your email address</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        We are not affiliated with iRacing; RaceCortex reads iRacing's local
        telemetry on your machine but does not access your iRacing account.
      </p>

      <h2>5. Data retention</h2>
      <p>
        During the beta we keep account and usage data for as long as your account is
        active, and diagnostic data per our providers' defaults (for example, Sentry
        currently retains events about 30 days). When the beta ends or you ask us to
        delete your account, we'll delete or anonymize your personal data within a
        reasonable period, except where we must keep it for legal/security reasons.
      </p>

      <h2>6. Security</h2>
      <p>
        Data in transit is encrypted (HTTPS/TLS). Passwords are stored hashed by
        Supabase; your session token is stored in the Windows Credential Manager. No
        system is perfectly secure, but we take reasonable measures appropriate to a
        beta of this size.
      </p>

      <h2>7. Your choices and rights</h2>
      <ul>
        <li>
          <strong>Crash reporting:</strong> turn it off anytime in{" "}
          <strong>Settings → "Send crash reports."</strong>
        </li>
        <li>
          <strong>Access / correction / deletion:</strong> email us at{" "}
          <strong>privacy@racecortex.com</strong> and we'll help you access or delete
          your account data.
        </li>
        <li>
          <strong>Region-specific rights:</strong> depending on where you live (e.g.,
          the EU/UK under GDPR, or California under CCPA), you may have additional
          rights such as access, deletion, portability, or objection. We'll honor
          applicable requests; contact us at the address above.{" "}
          <em>
            (Full automated rights tooling is planned for public launch.)
          </em>
        </li>
      </ul>

      <h2>8. Children</h2>
      <p>
        RaceCortex is not directed to children. You must be at least 18 to create an
        account.
      </p>

      <h2>9. International users</h2>
      <p>
        RaceCortex is operated by RaceCortex LLC, based in Arkansas, USA. By using
        the Service, you understand that your data may be transferred to and processed
        in the United States.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We'll post changes here and update the "last updated" date; significant
        changes will be communicated to beta users by email.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions or requests: <strong>privacy@racecortex.com</strong>, RaceCortex
        LLC, Arkansas, USA.
      </p>
    </LegalPageWrapper>
  )
}
