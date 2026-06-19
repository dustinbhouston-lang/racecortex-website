import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageWrapper } from "@/components/legal-page-wrapper"

export const metadata: Metadata = {
  title: "Terms of Use — RaceCortex",
  description:
    "RaceCortex Beta Terms of Use — the rules governing your access to the closed beta.",
}

export default function TermsPage() {
  return (
    <LegalPageWrapper>
      <h1>RaceCortex Beta Terms of Use</h1>
      <p>
        <strong>Last updated: 17 June 2026</strong>
      </p>

      <p>
        These Terms govern your use of the RaceCortex desktop application, the AI
        race engineer ("Clive"), and related services (together, the "Service"),
        operated by <strong>RaceCortex LLC</strong> ("RaceCortex," "we," "us").
        RaceCortex is <strong>pre-release beta software</strong>. By redeeming an
        invite, creating an account, or using the Service, you agree to these Terms
        and to the{" "}
        <Link href="/privacy">Privacy Policy</Link>. If you don't agree, don't use
        the Service.
      </p>

      <h2>1. Beta status — read this first</h2>
      <p>
        The Service is provided for <strong>testing and evaluation</strong>. It is{" "}
        <strong>
          incomplete, may contain bugs, may change or be interrupted without notice,
          and may be discontinued
        </strong>{" "}
        at any time. Features, pricing, and these Terms may change before and at
        general release. <strong>Do not rely on the Service for anything critical.</strong>{" "}
        Clive's callouts, coaching, and strategy are{" "}
        <strong>informational assistance for a racing simulator only</strong> — they
        are not guaranteed to be accurate, and you are responsible for your own
        driving and decisions.
      </p>

      <h2>2. Eligibility &amp; accounts</h2>
      <ul>
        <li>
          You must be at least <strong>18</strong> years old.
        </li>
        <li>
          Beta access requires a valid, <strong>single-use invite code</strong>.
          Invite codes and accounts are <strong>personal to you</strong> — don't
          share, sell, or transfer them.
        </li>
        <li>
          You're responsible for keeping your login credentials secure and for
          activity under your account. Tell us promptly if you suspect unauthorized
          use.
        </li>
      </ul>

      <h2>3. License</h2>
      <p>
        Subject to these Terms, we grant you a{" "}
        <strong>
          limited, personal, non-exclusive, non-transferable, revocable
        </strong>{" "}
        license to install and use the Service for your own non-commercial sim-racing
        use during the beta. You may <strong>not</strong>: reverse-engineer,
        decompile, or extract source from the app except where that restriction is
        prohibited by law; redistribute, resell, sublicense, or publicly host the
        installer or invite codes; remove or alter notices; or use the Service to
        build a competing product.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          abuse, overload, or attempt to circumvent the Service's usage limits, rate
          limits, or spending caps, or access it through automated/scripted means
          beyond normal in-app use;
        </li>
        <li>
          use the Service in a way that violates <strong>iRacing's</strong> terms of
          service or any sim/competition rules, or to gain an unfair or prohibited
          advantage in sanctioned competition;
        </li>
        <li>
          attempt to access other users' data, probe our security, or disrupt the
          Service;
        </li>
        <li>
          use the Service for any unlawful purpose or in violation of third-party
          rights.
        </li>
      </ul>

      <h2>5. Relationship to iRacing and third parties</h2>
      <p>
        RaceCortex is an <strong>independent product</strong> and is{" "}
        <strong>
          not affiliated with, endorsed by, or sponsored by iRacing.com Motorsport
          Simulations, LLC
        </strong>
        , nor by any car/track manufacturer or league. "iRacing" and other marks
        belong to their owners.{" "}
        <strong>
          You are solely responsible for ensuring your use of RaceCortex complies
          with iRacing's terms and any league/competition rules you participate in.
        </strong>{" "}
        The Service relies on third-party providers (see the{" "}
        <Link href="/privacy">Privacy Policy</Link>'s sub-processor list); their
        services are governed by their own terms.
      </p>

      <h2>6. Your content &amp; feedback</h2>
      <p>
        You retain your own data. By sending us feedback, bug reports, or suggestions
        (including via "Report a problem"), you grant us a non-exclusive,
        royalty-free right to use them to improve the Service, without obligation to
        you.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The Service, including the RaceCortex software, the "Clive" persona and
        voice, branding, and related content, is owned by RaceCortex LLC and its
        licensors and is protected by law. These Terms don't transfer any ownership
        to you beyond the limited license in Section 3.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED{" "}
        <strong>
          "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND
        </strong>
        , express or implied, including merchantability, fitness for a particular
        purpose, accuracy, and non-infringement. Because this is beta software, we
        make{" "}
        <strong>
          no guarantee of availability, uptime, data preservation, or that defects
          will be fixed
        </strong>
        . Engineer advice may be wrong or incomplete; you assume all risk of relying
        on it.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, RACECORTEX LLC WILL NOT BE LIABLE
        FOR ANY{" "}
        <strong>
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
        </strong>
        , or loss of data, profits, or goodwill, arising from your use of (or
        inability to use) the Service. Our <strong>total liability</strong> for any
        claim relating to the Service will not exceed{" "}
        <strong>
          the greater of US $50 or the amount you paid us in the prior 12 months
        </strong>
        . The beta is provided free of charge. Some jurisdictions don't allow certain
        limitations, so some of the above may not apply to you.
      </p>

      <h2>10. Suspension &amp; termination</h2>
      <p>
        We may <strong>suspend or terminate</strong> your access at any time,
        including for violating these Terms, abusing usage limits, or to end the
        beta. You may stop using the Service and request account deletion at any
        time. Sections that by their nature should survive (e.g., 6–9, 11) survive
        termination.
      </p>

      <h2>11. Governing law &amp; disputes</h2>
      <p>
        These Terms are governed by the laws of the{" "}
        <strong>State of Arkansas, USA</strong>, without regard to
        conflict-of-laws rules. You agree to the{" "}
        <strong>
          exclusive jurisdiction of the state and federal courts located in Benton
          County, Arkansas
        </strong>{" "}
        for any disputes, except where applicable law gives you the right to your
        local courts.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms; we'll post the new version with an updated date
        and notify beta users of significant changes by email. Continued use after
        changes means you accept them.
      </p>

      <h2>13. Contact</h2>
      <p>
        <strong>privacy@racecortex.com</strong> · RaceCortex LLC, Arkansas, USA.
      </p>
    </LegalPageWrapper>
  )
}
