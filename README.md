# ankitdhadwal.com

Personal portfolio site. Static HTML/CSS/JS served as assets from a Cloudflare
Worker (`ankitdhadwal`).

## Layout

```
public/          <- everything served at ankitdhadwal.com
  index.html
  assets/
  og-image.jpg, robots.txt, sitemap.xml
wrangler.jsonc   <- Worker config; points assets.directory at ./public
```

Site files live in `public/` on purpose. When the assets directory was the repo
root, Cloudflare uploaded `.git` along with it and `ankitdhadwal.com/.git/config`
was publicly readable. Keeping the site in its own directory makes that
impossible. Do not move these files back to the root.

## Deploy

```sh
npm install       # first time only
npm run deploy
```

Requires a one-time `npx wrangler login`.

`npm run check` does a dry run — useful for confirming which files would be
uploaded before pushing anything live.

## Verify a deploy

```sh
curl -s https://ankitdhadwal.com | wc -c          # should match public/index.html
curl -s -o /dev/null -w '%{http_code}\n' https://ankitdhadwal.com/.git/config   # must be 404
```

## Notes

- `www.ankitdhadwal.com` 301s to the apex via a zone Redirect Rule, not the
  Worker. The rule matches `https://www.*`.
- The Worker has no build step. Workers Builds, if connected, just runs
  `wrangler deploy` against `wrangler.jsonc`.
