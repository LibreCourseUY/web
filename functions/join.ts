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
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <style>
      :root { color-scheme: light dark; font-family: Inter, system-ui, sans-serif; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #10100e; color: #f5f5f0; }
      main { width: min(100% - 3rem, 27rem); padding: 2.5rem; border: 1px solid #3e3e38; border-radius: 1rem; background: #181816; }
      h1 { margin: 0 0 .75rem; font-size: 2rem; line-height: 1.1; }
      p { margin: 0 0 1.5rem; color: #c4c4ba; line-height: 1.5; }
      button { width: 100%; margin-top: 1rem; padding: .8rem 1rem; border: 0; border-radius: .5rem; background: #b5fb4b; color: #10100e; font: inherit; font-weight: 700; cursor: pointer; }
      .error { color: #ffb4ab; }
    </style>
  </head>
  <body>
    <main>
      <h1>Join our Discord</h1>
      <p>Complete the verification to continue to the LibreCourseUY community.</p>
      ${showError ? '<p class="error">Verification failed. Please try again.</p>' : ''}
      <form method="post">
        <div class="cf-turnstile" data-sitekey="${env.TURNSTILE_SITE_KEY}" data-action="join-discord"></div>
        <button type="submit">Continue to Discord</button>
      </form>
    </main>
  </body>
</html>`,
		{ headers: { 'Content-Type': 'text/html; charset=UTF-8', 'Cache-Control': 'no-store' } },
	);
}
