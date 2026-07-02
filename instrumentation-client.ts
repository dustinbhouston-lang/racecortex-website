import { initBotId } from 'botid/client/core'

// Vercel BotID client registration (Next.js 15.3+ path). Declares which
// endpoints are protected so the client attaches the BotID challenge to those
// requests; the verdict is enforced server-side via checkBotId() in the route.
initBotId({
  protect: [{ path: '/api/waitlist', method: 'POST' }],
})
