/*
 * OAuth proxy for Decap CMS's `github` backend.
 *
 * Decap can't talk to GitHub's OAuth endpoints directly (it needs a
 * confidential client_secret, which can never live in browser-side code).
 * This Worker is that missing piece: it holds the secret, and implements
 * the exact handshake Decap's client expects.
 *
 * Two routes:
 *   GET /auth      — Decap opens this in a popup. Redirects to GitHub's
 *                    own OAuth consent screen.
 *   GET /callback  — GitHub redirects back here with a `code`. This
 *                    exchanges it for an access token, then returns a
 *                    tiny HTML page that posts the token back to the
 *                    window that opened the popup (Decap is listening
 *                    for exactly this message).
 *
 * Required secrets (set via the Cloudflare dashboard or `wrangler secret
 * put`, never committed to git): GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET.
 * See README.md in this folder for full setup steps.
 */

const STATE_COOKIE = 'decap_oauth_state'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/auth') {
      return handleAuth(url, env)
    }
    if (url.pathname === '/callback') {
      return handleCallback(request, url, env)
    }
    return new Response('Not found', { status: 404 })
  },
}

function handleAuth(url, env) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('Missing GITHUB_CLIENT_ID secret — see oauth-worker/README.md.', { status: 500 })
  }

  const state = crypto.randomUUID()
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize')
  authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
  authorizeUrl.searchParams.set('redirect_uri', `${url.origin}/callback`)
  authorizeUrl.searchParams.set('scope', 'repo,user')
  authorizeUrl.searchParams.set('state', state)

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      // Short-lived, http-only — just enough to verify the callback
      // belongs to the request we just made (basic CSRF protection).
      'Set-Cookie': `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`,
    },
  })
}

async function handleCallback(request, url, env) {
  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const cookieState = readCookie(request.headers.get('Cookie'), STATE_COOKIE)

  if (!code) {
    return renderMessagePage({ status: 'error', message: 'GitHub did not return an authorization code.' })
  }
  if (!returnedState || !cookieState || returnedState !== cookieState) {
    return renderMessagePage({ status: 'error', message: 'Login state did not match — please try logging in again.' })
  }

  let tokenData
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })
    tokenData = await tokenResponse.json()
  } catch {
    return renderMessagePage({ status: 'error', message: 'Could not reach GitHub to exchange the login code.' })
  }

  if (!tokenData.access_token) {
    return renderMessagePage({
      status: 'error',
      message: tokenData.error_description || tokenData.error || 'GitHub did not return an access token.',
    })
  }

  return renderMessagePage({ status: 'success', token: tokenData.access_token })
}

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

// This exact "authorization:github:success/error:<json>" message format,
// sent after the popup's opener sends the first "authorizing:github" ping,
// is Decap's own documented handshake — not something we get to choose.
function renderMessagePage({ status, token, message }) {
  const payload =
    status === 'success'
      ? `authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`
      : `authorization:github:error:${JSON.stringify({ message })}`

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8" /><title>Aurum Astra CMS Login</title></head>
<body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(payload)}, e.origin)
      window.removeEventListener('message', receiveMessage, false)
    }
    window.addEventListener('message', receiveMessage, false)
    window.opener.postMessage('authorizing:github', '*')
  })()
</script>
<p>${status === 'success' ? 'Login successful — this window should close automatically.' : `Login failed: ${escapeHtml(message)}`}</p>
</body>
</html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } })
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, (c) => map[c])
}
