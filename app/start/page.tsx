import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageWrapper } from "@/components/legal-page-wrapper"

export const metadata: Metadata = {
  title: "Quick Start — RaceCortex",
  description:
    "Get Clive talking in your first session — install, set up push-to-talk, and start racing.",
}

export default function StartPage() {
  return (
    <LegalPageWrapper>
      <h1>RaceCortex Quick-Start (Beta)</h1>
      <p>Welcome to RaceCortex. Here's how to get Clive talking in your first session.</p>

      <h2>1. Install</h2>
      <ol>
        <li>
          At <strong>racecortex.com/download</strong>, sign in (the account you made
          with your invite code).
        </li>
        <li>
          Run the installer. If your browser says <strong>"Keep"</strong> or Windows
          shows{" "}
          <strong>
            "Windows protected your PC → More info → Run anyway,"
          </strong>{" "}
          that's expected for a newly-released app — it's signed by{" "}
          <strong>RaceCortex LLC</strong> (check the file's Properties → Digital
          Signatures if you want to confirm).
        </li>
        <li>
          Launch <strong>RaceCortex</strong> and sign in.
        </li>
      </ol>

      <h2>2. One-time setup</h2>
      <ul>
        <li>
          <strong>Push-to-talk (to ask Clive things):</strong> in{" "}
          <strong>Settings</strong>, bind your <strong>push-to-talk button</strong>,
          then press the wheel/button you want to use.{" "}
          <em>(Tip: pick a button you can reach mid-corner.)</em>
        </li>
        <li>
          <strong>Microphone:</strong> the first time you use push-to-talk, Windows
          may ask permission to use your mic — <strong>allow it</strong>, or Clive
          can't hear you.
        </li>
        <li>
          <strong>Volume:</strong> set Clive's volume to taste in{" "}
          <strong>Settings</strong>.
        </li>
        <li>
          <strong>On-screen:</strong> alongside the voice engineer you get the{" "}
          <strong>Ignition on-track overlays</strong> — relative, standings, fuel
          and more — plus a small <strong>Clive indicator</strong> that lights up
          when he's listening or speaking.
        </li>
      </ul>

      <h2>3. Start racing</h2>
      <ol>
        <li>
          <strong>Launch iRacing and get into a session</strong> (practice is perfect
          for your first run).
        </li>
        <li>
          RaceCortex connects to iRacing automatically — once you're in a session, it
          shows as <strong>connected</strong> in the RaceCortex window.
        </li>
        <li>
          Drive. Clive starts calling out things like gaps, fuel, incidents, and flags
          on his own. <strong>Hold your push-to-talk button</strong> to ask him
          something ("how's my fuel?", "what's the gap behind?", "any damage?").
        </li>
      </ol>

      <h2>4. If something's not working</h2>
      <ul>
        <li>
          <strong>Clive is silent / "iRacing not detected":</strong> make sure iRacing
          is actually <em>in a session</em> (not just the UI), and that RaceCortex is
          running. Give it a few seconds after the session loads.
        </li>
        <li>
          <strong>No audio from Clive:</strong> check Clive's volume in{" "}
          <strong>Settings</strong> and your Windows output device.
        </li>
        <li>
          <strong>Push-to-talk does nothing:</strong> re-bind it in{" "}
          <strong>Settings</strong> and confirm you allowed mic access (Windows
          Settings → Privacy → Microphone).
        </li>
        <li>
          <strong>Anything else / it crashed:</strong> use{" "}
          <strong>"Report a problem"</strong> in Settings → About (it sends us the
          logs), drop a note in <strong>Discord</strong>, or email{" "}
          <strong>beta@racecortex.com</strong>.
        </li>
      </ul>

      <h2>A few things to know</h2>
      <ul>
        <li>
          It's <strong>beta</strong> — expect the occasional rough edge, and please
          tell us about it. Even small things help.
        </li>
        <li>
          Clive's calls are <strong>assistance for the sim</strong>, not gospel —
          you're still the driver.
        </li>
        <li>
          RaceCortex sends some race data to power Clive; details are in the{" "}
          <Link href="/privacy">Privacy Policy</Link>, and you can turn off crash
          reporting anytime in Settings.
        </li>
      </ul>

      <p>Now go put him to work. 🏁</p>
    </LegalPageWrapper>
  )
}
