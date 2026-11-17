# auth.md — LibreCourseUY agent authentication

LibreCourseUY publishes a public, read-only catalogue of the projects built by its
community. There is **no OAuth or OpenID Connect authorization server** for
`librecourse.uy`, and no API key, account, or access token is required to read
any public resource.

## Audience

AI agents acting for a learner, maintainer, or organisation that wants to
discover LibreCourseUY projects, follow project activity, or prepare a
contribution. Human-facing pages stay the default; agents may request
`Accept: text/markdown` for a markdown rendering of any page.

## What needs credentials

| Surface                            | Method             | Needs credentials                                                |
| ---------------------------------- | ------------------ | ---------------------------------------------------------------- |
| `GET /api/feed`, `GET /api/health` | HTTPS              | No                                                               |
| `GET /.well-known/*`               | HTTPS              | No                                                               |
| `POST /mcp` (MCP tools)            | HTTPS              | No                                                               |
| `POST /join` (Discord invite)      | HTTPS form         | No token, but **human-only** — protected by Cloudflare Turnstile |
| Contributing code or docs          | Git over HTTPS/SSH | GitHub account, commits signed off (DCO) and GPG-signed          |

Agents MUST NOT attempt to solve or bypass the Turnstile challenge on `/join`;
that endpoint issues a Discord invite to a person. Ask the user to complete it
in a browser instead.

## Registration and provisioning

There is no self-service agent registration endpoint and no dynamic client
registration. Nothing is provisioned for read access: call the endpoints
directly.

To contribute on behalf of a user:

1. Fork the target repository under the user's own GitHub account.
2. Sign every commit off with `git commit -s` (Developer Certificate of Origin,
   <https://librecourse.uy/dco/>) and sign with GPG
   (<https://librecourse.uy/docs/gpg-signature/>).
3. Use Conventional Commits, then open a pull request against the default branch.

## Credentials in use

- Bearer tokens: none issued.
- Ambient browser credentials: agent tools run through the WebMCP API
  (`document.modelContext`), which only exposes the tools the page registers and
  grants no extra privileges.
- OAuth Protected Resource Metadata: `/.well-known/oauth-protected-resource`
  advertises `resource` and an empty `authorization_servers`, which is an explicit
  statement that this resource server accepts unauthenticated reads.

## Contact

- Discord: <https://librecourse.uy/join/>
- GitHub organisation: <https://github.com/LibreCourseUY>
- Coordination issue tracker: <https://gitsion.librecourse.uy/issues>
