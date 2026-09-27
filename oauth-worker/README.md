# Decap CMS GitHub OAuth Worker

This is the missing piece that lets the CMS at `/admin` actually log
writers in against the real GitHub repo. Decap CMS's `github` backend
can't talk to GitHub's OAuth endpoints directly — that requires a secret
key that can never live in browser code — so it needs a small server-side
proxy in between. This is that proxy, built to run free on Cloudflare
Workers.

You only need to set this up once. After that, it runs unattended.

## What you're setting up

1. A **GitHub OAuth App** — tells GitHub "this app is allowed to ask for
   login," and gives you a Client ID + Client Secret.
2. This **Worker**, deployed to Cloudflare, holding those two values.
3. One line in `public/admin/config.yml` pointing at the Worker's URL.

## Step 1 — Create the GitHub OAuth App

1. Go to **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
   (direct link: https://github.com/settings/applications/new).
2. Fill in:
   - **Application name**: `Aurum Astra CMS` (or anything you'll recognize)
   - **Homepage URL**: your site, e.g. `https://aurumastra.in`
   - **Authorization callback URL**: leave a placeholder for now
     (e.g. `https://example.com/callback`) — you'll come back and fix this
     in Step 3 once you know the Worker's real URL.
3. Click **Register application**.
4. Note the **Client ID** shown on the app's page.
5. Click **Generate a new client secret** and note it immediately —
   GitHub only shows it once.

## Step 2 — Deploy the Worker

**Easiest path — Cloudflare dashboard, no install needed:**

1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com) (free account is fine).
2. **Workers & Pages → Create → Create Worker**. Give it a name (e.g.
   `aurum-astra-cms-auth`) and deploy the default "Hello World" template first.
3. Click **Edit code**. Delete everything in the editor and paste in the
   full contents of `worker.js` from this folder. Save and deploy.
4. Go to the worker's **Settings → Variables and Secrets**. Add two
   **secrets** (not plain variables — secrets are encrypted):
   - `GITHUB_CLIENT_ID` — the Client ID from Step 1
   - `GITHUB_CLIENT_SECRET` — the Client Secret from Step 1
5. Note the Worker's URL shown at the top of its page — something like
   `https://aurum-astra-cms-auth.<your-subdomain>.workers.dev`.

**Alternative — Wrangler CLI**, if you're comfortable with a terminal:

```sh
cd oauth-worker
npx wrangler deploy
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

Wrangler will print the deployed URL when it finishes.

## Step 3 — Fix the callback URL

Go back to the GitHub OAuth App from Step 1 and edit **Authorization
callback URL** to the real Worker URL plus `/callback`, e.g.:

```
https://aurum-astra-cms-auth.<your-subdomain>.workers.dev/callback
```

Save.

## Step 4 — Point the CMS at the Worker

In `public/admin/config.yml`, set:

```yaml
backend:
  name: github
  repo: chiragjs1108-debug/aurum-astra-connect
  branch: main
  base_url: https://aurum-astra-cms-auth.<your-subdomain>.workers.dev
  auth_endpoint: auth
```

(`base_url` is just the Worker's own URL — no `/auth` on the end, Decap
appends that itself.) Commit and deploy the site as usual.

## Done — trying it

Visit `/admin` on the live site, click **Login with GitHub**, approve the
popup, and the CMS should load using the real repository. Whoever logs in
needs push access to this repo — Decap commits posts using their own
GitHub permissions, not a shared account.

## How it works, briefly

- `GET /auth` — Decap opens this in a popup. It redirects to GitHub's own
  consent screen, with a random `state` value stashed in a short-lived
  cookie (basic CSRF protection).
- GitHub redirects the popup to `GET /callback?code=...&state=...` after
  the user approves.
- The Worker checks `state` matches the cookie, then exchanges `code` for
  an access token by calling GitHub's token endpoint server-side (using
  the secret, which never reaches the browser).
- It returns a tiny HTML page that posts the token back to the window
  that opened the popup, in the exact message format Decap's client is
  listening for. Decap takes it from there.

No database, no state beyond that one short-lived cookie — the Worker is
fully stateless between requests.
