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
originals/       <- full-resolution source photos; NOT deployed
```

`originals/` holds the untouched PNGs the web images are derived from. Keep
them there rather than in `public/` — they are ~1.7 MB each and would ship
as-is. Re-crop from these if the portrait or avatar ever needs changing.

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

Both commands strip `.DS_Store` from `public/` first. Wrangler's `.assetsignore`
does not work here (verified: adding one changes nothing), so the only reliable
way to keep Finder droppings off the live site is to delete them pre-upload.

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
