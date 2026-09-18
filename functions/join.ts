interface Env {
	DISCORD_INVITE_URL: string;
	TURNSTILE_SECRET_KEY: string;
	TURNSTILE_SITE_KEY: string;
}

interface Context {
	env: Env;
	request: Request;
}

interface TurnstileResult {
	action?: string;
	success?: boolean;
}

const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function onRequest({ env, request }: Context): Promise<Response> {
	if (request.method === 'POST') {
		const form = await request.formData();
		const token = form.get('cf-turnstile-response');

		if (typeof token === 'string' && token.length <= 2048) {
			const verification = new FormData();
			verification.append('secret', env.TURNSTILE_SECRET_KEY);
			verification.append('response', token);
			verification.append('remoteip', request.headers.get('CF-Connecting-IP') ?? '');

			try {
				const response = await fetch(verificationUrl, { method: 'POST', body: verification });
				const result = (await response.json()) as TurnstileResult;

				if (result.success && result.action === 'join-discord') {
					return Response.redirect(env.DISCORD_INVITE_URL, 303);
				}
			} catch {
				// Treat validation service failures the same as an invalid challenge.
			}
		}

		return Response.redirect(new URL('/join/?error=1', request.url), 303);
	}

	if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });

	const showError = new URL(request.url).searchParams.has('error');
	return new Response(
		`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Join LibreCourseUY on Discord</title>
    <script>
      (function () {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.add('light');
        }
      })();

      function renderTurnstile() {
        turnstile.render('#turnstile', {
          action: 'join-discord',
          appearance: 'always',
          sitekey: '${env.TURNSTILE_SITE_KEY}',
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        });
      }
    </script>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=renderTurnstile" defer></script>
    <style>
      :root { color-scheme: light; --background: #f5f5f0; --color-emphasis: #17171a; --color-emphasis-secondary: #106654; --color-surface: #ffffff; --color-line: #dededa; --color-muted: #63635c; font-family: Inter, system-ui, sans-serif; }
      .dark { color-scheme: dark; --background: #101010; --color-emphasis: #f7f7f0; --color-emphasis-secondary: #5ec2af; --color-surface: #191919; --color-line: #2e2e2b; --color-muted: #9f9f96; }
      @media (prefers-color-scheme: dark) { :root:not(.light) { color-scheme: dark; --background: #101010; --color-emphasis: #f7f7f0; --color-emphasis-secondary: #5ec2af; --color-surface: #191919; --color-line: #2e2e2b; --color-muted: #9f9f96; } }
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 1.5rem; background: radial-gradient(ellipse at center, color-mix(in srgb, var(--color-emphasis-secondary) 10%, transparent), transparent 62%), var(--background); color: var(--color-emphasis); }
      main { width: min(100%, 27rem); padding: 2.5rem; border: 1px solid var(--color-line); border-radius: 1rem; background: var(--color-surface); box-shadow: 0 20px 50px -36px rgb(0 0 0 / .45); }
      .eyebrow { margin: 0 0 1rem; color: var(--color-emphasis-secondary); font-size: .72rem; font-weight: 700; letter-spacing: .12em; }
      h1 { margin: 0 0 .75rem; font-family: 'Space Grotesk', Inter, system-ui, sans-serif; font-size: clamp(2rem, 7vw, 2.75rem); line-height: 1; letter-spacing: -.05em; }
      p { margin: 0 0 1.5rem; color: var(--color-muted); line-height: 1.5; }
      button { width: 100%; margin-top: 1rem; padding: .8rem 1rem; border: 0; border-radius: .5rem; background: var(--color-emphasis-secondary); color: var(--background); font: inherit; font-weight: 700; cursor: pointer; transition: opacity .2s; }
      button:hover { opacity: .85; }
      button:focus-visible { outline: 2px solid var(--color-emphasis-secondary); outline-offset: 3px; }
      .error { color: #b42318; }
      .dark .error { color: #ffb4ab; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">LIBRECOURSEUY COMMUNITY</p>
      <h1>Join our Discord</h1>
      <p>Complete the verification to continue to the LibreCourseUY community.</p>
      ${showError ? '<p class="error">Verification failed. Please try again.</p>' : ''}
      <form method="post">
        <div id="turnstile"></div>
        <button type="submit">Continue to Discord</button>
      </form>
    </main>
  </body>
</html>`,
		{ headers: { 'Content-Type': 'text/html; charset=UTF-8', 'Cache-Control': 'no-store' } },
	);
}
