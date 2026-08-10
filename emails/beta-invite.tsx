import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LIFETIME_FREE_COPY
 * ─────────────────────────────────────────────────────────────────────────────
 * The "founding testers stay free for life" paragraph. This is the one piece of
 * copy Dustin should rewrite in his own voice before sending (keep it warm and
 * genuine — "thanks for helping shape this" — not salesy). The task-34 wording is
 * used as the default placeholder. Edit the string below; no need to touch the JSX.
 */
export const LIFETIME_FREE_COPY =
  "You're in the closed beta, which means two things. First, the honest part: it's " +
  "early software, so expect rough edges — and that's exactly where you come in. Your " +
  "feedback is the whole point. Second, the thank-you: as one of our founding testers, " +
  "your RaceCortex account stays free for life. No catch and no card required — we just " +
  "want you racing with it and telling us the truth about what works and what doesn't."

// ── Brand tokens (IGNITION design system — use exactly) ──────────────────────
const colors = {
  background: "#0C0C0E", // carbon
  surface: "#1A1A1F", // card/surface
  border: "#26262B",
  text: "#F4F4F2", // chalk
  muted: "#8A8C92", // smoke
  faint: "#5C5E66",
  success: "#00D26A",
  accent: "#FF4D00", // Ignition Orange
  accentDark: "#CC3E00",
}

const fontSans =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const fontMono = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"

export interface BetaInviteEmailProps {
  firstName: string
  inviteCode: string // e.g. "RC-ZTHV-2TK5"
  downloadUrl?: string
  discordUrl?: string
  supportEmail?: string
  baseUrl?: string // for asset URLs
}

const defaults = {
  downloadUrl: "https://racecortex.com/download",
  discordUrl: "https://discord.gg/5GJVYXAT7",
  supportEmail: "beta@racecortex.com",
  baseUrl: "https://racecortex.com",
}

export function BetaInviteEmail({
  firstName,
  inviteCode,
  downloadUrl = defaults.downloadUrl,
  discordUrl = defaults.discordUrl,
  supportEmail = defaults.supportEmail,
  baseUrl = defaults.baseUrl,
}: BetaInviteEmailProps) {
  return (
    <Html lang="en">
      <Head>
        {/* Color-scheme hints — discourage Gmail/Apple Mail auto-inversion so the
            intended dark theme is honored. */}
        <meta name="color-scheme" content="dark light" />
        <meta name="supported-color-schemes" content="dark light" />
        {/* Oxanium for headings — degrades gracefully to the bold system stack
            if the client blocks web fonts (most do). Never depended on. */}
        <Font
          fontFamily="Oxanium"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/oxanium/v14/RrQPboN_4yJ0JmiMe2mMd5DfSyc3l1e-9j4H.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>You&apos;re in — set up RaceCortex and meet Clive.</Preview>
      <Body style={body}>
        {/* Full-bleed dark wrapper — Gmail paints the area outside the content
            table with its own default; this stops the off-white background.
            bgcolor attr + background-color style (belt-and-suspenders). */}
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          border={0}
          bgcolor={colors.background}
          style={fullBleed}
        >
          <tbody>
            <tr>
              <td {...tdBg(colors.background)} align="center" style={fullBleedCell}>
                {/* Card / surface — dark via bgcolor + background-color. */}
                <table
                  role="presentation"
                  width="560"
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  bgcolor={colors.surface}
                  style={cardTable}
                >
                  <tbody>
                    <tr>
                      <td {...tdBg(colors.surface)} style={cardCell}>
                        {/* ── Header: horizontal white wordmark (absolute hosted URL).
                            Sits on this dark cell (bgcolor + background-color) so the
                            white wordmark keeps contrast even on partial CSS failure. ── */}
                        <Section style={{ paddingBottom: "8px" }}>
                          <Img
                            src={`${baseUrl}/brand/racecortex-logo-horizontal-orange.png`}
                            width="180"
                            alt="RaceCortex"
                            style={{ display: "block", border: "0", outline: "none" }}
                          />
                        </Section>

          {/* ── Eyebrow ── */}
          <Text style={eyebrow}>BETA ACCESS</Text>

          {/* ── Headline ── */}
          <Heading style={headline}>
            You&apos;re in — welcome to the RaceCortex beta
          </Heading>

          {/* ── Body copy ── */}
          <Text style={paragraph}>Hey {firstName},</Text>
          <Text style={paragraph}>
            Welcome aboard — you&apos;re one of the first people anywhere to run{" "}
            <strong style={{ color: colors.text }}>RaceCortex</strong>, an AI race
            engineer (&ldquo;Clive&rdquo;) that rides along in iRacing: live spotting,
            fuel and strategy, and answers when you press to talk.
          </Text>
          <Text style={paragraph}>{LIFETIME_FREE_COPY}</Text>

          {/* ── Invite-code chip — dark via bgcolor + background-color ── */}
          <Section style={{ padding: "8px 0 4px" }}>
            <table
              role="presentation"
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              bgcolor={colors.background}
              style={codeChipTable}
            >
              <tbody>
                <tr>
                  <td {...tdBg(colors.background)} style={codeChipCell}>
                    {inviteCode}
                  </td>
                </tr>
              </tbody>
            </table>
            <Text style={codeCaption}>single-use and tied to you</Text>
          </Section>

          {/* ── CTA button (bulletproof) ── */}
          <Section style={{ padding: "12px 0 8px" }}>
            <Button href={downloadUrl} style={ctaButton}>
              Create your account &amp; download
            </Button>
          </Section>

          <Hr style={divider} />

          {/* ── Getting set up ── */}
          <Heading as="h2" style={sectionHeading}>
            Getting set up (about 5 minutes)
          </Heading>
          <Text style={stepText}>
            <strong style={numStyle}>1.</strong> Go to{" "}
            <Link href={downloadUrl} style={anchor}>
              racecortex.com/download
            </Link>{" "}
            and create your account using <em>this</em> email address, then confirm it
            from your inbox.
          </Text>
          <Text style={stepText}>
            <strong style={numStyle}>2.</strong> Enter your invite code on that page to
            unlock the download —{" "}
            <span style={{ fontFamily: fontMono, color: colors.text }}>{inviteCode}</span>{" "}
            (it&apos;s single-use and tied to you).
          </Text>
          <Text style={stepText}>
            <strong style={numStyle}>3.</strong> Download and run the installer. Your
            browser may show a &ldquo;Keep&rdquo; prompt and Windows a blue &ldquo;More
            info → Run anyway&rdquo; screen — that&apos;s normal for a new app; the
            installer is <strong style={{ color: colors.text }}>digitally signed by
            RaceCortex LLC</strong>, which you can verify in the file&apos;s properties.
          </Text>
          <Text style={stepText}>
            <strong style={numStyle}>4.</strong> Open RaceCortex, sign in, and follow the
            quick-start to bind push-to-talk and get Clive talking in your first session.
          </Text>

          <Hr style={divider} />

          {/* ── How to reach us ── */}
          <Heading as="h2" style={sectionHeading}>
            How to reach us / give feedback
          </Heading>
          <Text style={stepText}>
            <strong style={{ color: colors.text }}>Discord (best place):</strong>{" "}
            <Link href={discordUrl} style={anchor}>
              join the beta server
            </Link>{" "}
            — bug reports, questions, and chatting with the team and other testers. This
            is where the beta lives.
          </Text>
          <Text style={stepText}>
            <strong style={{ color: colors.text }}>In the app:</strong> the &ldquo;Report
            a problem&rdquo; button (Settings → About) sends us your logs so we can debug
            fast — perfect for &ldquo;it did something weird.&rdquo;
          </Text>
          <Text style={stepText}>
            <strong style={{ color: colors.text }}>Email:</strong>{" "}
            <Link href={`mailto:${supportEmail}`} style={anchor}>
              {supportEmail}
            </Link>{" "}
            for anything you&apos;d rather send directly.
          </Text>
          <Text style={paragraph}>
            Tell us <em>everything</em> — even small stuff (a wrong callout, an odd noise,
            a confusing screen). It all helps.
          </Text>
          <Text style={paragraph}>
            One honest ask: please keep your download link and invite code to yourself for
            now — the beta&apos;s private, and each code is single-use and tied to your
            account. Talk about your experience all you like; just hold off on posting the
            installer or codes publicly while we&apos;re in closed beta.
          </Text>

          <Text style={signoff}>
            That&apos;s it — go make Clive earn his seat. Thanks for being here this
            early; it genuinely means a lot.
          </Text>
          <Text style={{ ...paragraph, color: colors.text }}>
            — Dustin &amp; the RaceCortex team
          </Text>

          <Hr style={divider} />

          {/* ── Footer ── */}
          <Section>
            <Text style={footerText}>
              <Link href={`mailto:${supportEmail}`} style={footerLink}>
                {supportEmail}
              </Link>
              {"  ·  "}
              <Link href={discordUrl} style={footerLink}>
                Discord
              </Link>
              {"  ·  "}
              <Link href={`${baseUrl}/privacy`} style={footerLink}>
                Privacy
              </Link>
              {"  ·  "}
              <Link href={`${baseUrl}/terms`} style={footerLink}>
                Terms
              </Link>
            </Text>
            <Text style={footerText}>[RaceCortex LLC — mailing address]</Text>
                        </Section>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────
/**
 * `bgcolor` is typed on <table> but not <td> in React's DOM types. Spread this
 * helper onto a <td> to carry the presentational attribute without a TS error.
 */
const tdBg = (color: string) =>
  ({ bgcolor: color }) as React.TdHTMLAttributes<HTMLTableCellElement>

const body: React.CSSProperties = {
  backgroundColor: colors.background,
  color: colors.text,
  colorScheme: "dark light",
  fontFamily: fontSans,
  margin: "0",
  padding: "0",
}

const fullBleed: React.CSSProperties = {
  backgroundColor: colors.background,
  colorScheme: "dark light",
  width: "100%",
}

const fullBleedCell: React.CSSProperties = {
  backgroundColor: colors.background,
  padding: "24px 12px",
}

const cardTable: React.CSSProperties = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  width: "100%",
}

const cardCell: React.CSSProperties = {
  backgroundColor: colors.surface,
  padding: "32px",
}

const eyebrow: React.CSSProperties = {
  color: colors.accent,
  fontFamily: fontMono,
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  margin: "16px 0 8px",
  textTransform: "uppercase",
}

const headline: React.CSSProperties = {
  color: colors.text,
  fontFamily: `Oxanium, ${fontSans}`,
  fontSize: "26px",
  fontWeight: 700,
  lineHeight: "1.25",
  margin: "0 0 20px",
}

const paragraph: React.CSSProperties = {
  color: colors.muted,
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
}

const codeChipTable: React.CSSProperties = {
  backgroundColor: colors.background,
  border: `1px solid ${colors.border}`,
  borderRadius: "8px",
  width: "100%",
}

const codeChipCell: React.CSSProperties = {
  backgroundColor: colors.background,
  color: colors.text,
  fontFamily: fontMono,
  fontSize: "24px",
  fontWeight: 700,
  letterSpacing: "0.18em",
  padding: "18px 20px",
  textAlign: "center",
}

const codeCaption: React.CSSProperties = {
  color: colors.faint,
  fontFamily: fontMono,
  fontSize: "12px",
  letterSpacing: "0.04em",
  margin: "8px 0 0",
  textAlign: "center",
}

const ctaButton: React.CSSProperties = {
  backgroundColor: colors.accent,
  borderRadius: "8px",
  color: colors.background,
  display: "block",
  fontFamily: fontSans,
  fontSize: "16px",
  fontWeight: 700,
  padding: "14px 24px",
  textAlign: "center",
  textDecoration: "none",
}

const divider: React.CSSProperties = {
  borderColor: colors.border,
  borderTop: `1px solid ${colors.border}`,
  margin: "24px 0",
}

const sectionHeading: React.CSSProperties = {
  color: colors.text,
  fontFamily: `Oxanium, ${fontSans}`,
  fontSize: "17px",
  fontWeight: 700,
  margin: "0 0 12px",
}

const stepText: React.CSSProperties = {
  color: colors.muted,
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 12px",
}

const numStyle: React.CSSProperties = {
  color: colors.accent,
  fontFamily: fontMono,
}

const anchor: React.CSSProperties = {
  color: colors.accent,
  textDecoration: "underline",
}

const signoff: React.CSSProperties = {
  color: colors.muted,
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "16px 0 4px",
}

const footerText: React.CSSProperties = {
  color: colors.faint,
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0 0 6px",
}

const footerLink: React.CSSProperties = {
  color: colors.faint,
  textDecoration: "underline",
}

// ── Preview data for `email dev` ─────────────────────────────────────────────
BetaInviteEmail.PreviewProps = {
  firstName: "Alex",
  inviteCode: "RC-XXXX-XXXX",
} satisfies BetaInviteEmailProps

export default BetaInviteEmail
