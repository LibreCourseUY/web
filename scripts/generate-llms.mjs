import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const SITE = 'https://librecourse.uy';
const SITE_NAME = 'LibreCourseUY';
const ABOUT =
	'A non-profit FOSS community from Uruguay growing the next generation of open source contributors in Latin America.';

if (!existsSync(dist)) {
	console.error('dist/ not found — run `astro build` first.');
	process.exit(1);
}

function walk(dir) {
	return readdirSync(dir).flatMap((entry) => {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) return walk(full);
		return entry.endsWith('.html') ? [full] : [];
	});
}

function urlFor(file) {
	let rel = relative(dist, file).split(sep).join('/');
	if (rel === 'index.html') return '/';
	rel = rel.replace(/index\.html$/, '');
	return `/${rel}`;
}

function decode(value) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#0?39;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&mdash;/g, '—')
		.replace(/&middot;/g, '·');
}

function metaDescription(html) {
	const match = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
	return match ? decode(match[1]).trim() : '';
}

function titleOf(html) {
	const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	return match ? decode(match[1]).trim() : '';
}

function contentText(html) {
	const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
	const source = (main ? main[1] : html)
		.replace(/<(script|style|template)[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
		.replace(/<\/(p|h[1-6]|li|div|section|article|tr|blockquote)>/gi, '\n')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<[^>]+>/g, ' ');

	return decode(source)
		.split('\n')
		.map((line) => line.replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.join('\n');
}

const pages = walk(dist)
	.map((file) => {
		const html = readFileSync(file, 'utf8');
		return {
			url: urlFor(file),
			title: titleOf(html) || SITE_NAME,
			description: metaDescription(html),
			text: contentText(html),
		};
	})
	.filter((page) => page.url !== '/404/')
	.sort((a, b) => (a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url)));

const index = [
	`# ${SITE_NAME}`,
	'',
	`> ${ABOUT}`,
	'',
	'## Pages',
	'',
	...pages.map((page) => {
		const suffix = page.description ? `: ${page.description}` : '';
		return `- [${page.title}](${SITE}${page.url})${suffix}`;
	}),
	'',
	`For the full content, see [llms-full.txt](${SITE}/llms-full.txt).`,
	'',
].join('\n');

const full = [
	`# ${SITE_NAME}`,
	'',
	`> ${ABOUT}`,
	'',
	`Source: ${SITE}`,
	`Pages: ${pages.length}`,
	'',
	...pages.flatMap((page) => [
		'='.repeat(72),
		`PAGE: ${SITE}${page.url}`,
		`TITLE: ${page.title}`,
		'='.repeat(72),
		'',
		page.text,
		'',
	]),
].join('\n');

writeFileSync(join(dist, 'llms.txt'), index, 'utf8');
writeFileSync(join(dist, 'llms-full.txt'), full, 'utf8');
console.log(`Wrote dist/llms.txt and dist/llms-full.txt (${pages.length} pages)`);
