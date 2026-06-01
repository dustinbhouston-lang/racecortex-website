// scripts/apply-email-templates.mjs
// Applies RaceCortex's custom Supabase Auth email templates (confirmation + recovery)
// via the Supabase Management API. Idempotent: safe to re-run. Reads the account PAT
// from the SUPABASE_ACCESS_TOKEN env var — never hardcode or log it.

const PROJECT_REF = "dhzypzvveccurfjizqno";

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("ERROR: SUPABASE_ACCESS_TOKEN env var is not set. Export it before running. Aborting.");
  process.exit(1);
}

// The {{ .RedirectTo }} / {{ .TokenHash }} tokens are Supabase Go-template placeholders
// and must reach the API verbatim. They are plain string literals here — no escaping needed.
const templates = {
  mailer_subjects_confirmation: "Confirm your RaceCortex email",
  mailer_templates_confirmation_content:
    '<h2>Confirm your signup</h2>\n<p>Follow this link to confirm your account:</p>\n<p><a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Confirm your email</a></p>',
  mailer_subjects_recovery: "Reset your RaceCortex password",
  mailer_templates_recovery_content:
    '<h2>Reset password</h2>\n<p>Follow this link to reset the password for your account:</p>\n<p><a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">Reset password</a></p>',
};

const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;
const authHeader = { Authorization: `Bearer ${token}` };

// 1) PATCH the templates
const patchRes = await fetch(url, {
  method: "PATCH",
  headers: { ...authHeader, "Content-Type": "application/json" },
  body: JSON.stringify(templates),
});
if (!patchRes.ok) {
  // Do NOT print the token. Status + body text are safe (Supabase does not echo the auth header).
  console.error(`ERROR: PATCH failed: ${patchRes.status} ${patchRes.statusText}`);
  console.error(await patchRes.text());
  process.exit(1);
}
console.log("PATCH ok — config updated.");

// 2) GET the config back and assert each field persisted exactly
const getRes = await fetch(url, { headers: authHeader });
if (!getRes.ok) {
  console.error(`ERROR: verification GET failed: ${getRes.status} ${getRes.statusText}`);
  process.exit(1);
}
const cfg = await getRes.json();

let allMatch = true;
for (const [key, expected] of Object.entries(templates)) {
  if (cfg[key] !== expected) {
    allMatch = false;
    console.error(`MISMATCH on ${key}`);
    console.error(`  expected: ${JSON.stringify(expected)}`);
    console.error(`  actual:   ${JSON.stringify(cfg[key])}`);
  } else {
    // These four values are not secrets — safe to print for operator visibility.
    console.log(`OK ${key}: ${JSON.stringify(cfg[key])}`);
  }
}

if (!allMatch) {
  console.error("ERROR: one or more templates did not persist. Aborting non-zero.");
  process.exit(1);
}
console.log("All templates verified. GoTrue reloads config within ~10s.");
