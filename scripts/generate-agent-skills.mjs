import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const skillsDir = join(root, 'dist', '.well-known', 'agent-skills');
const SITE = 'https://librecourse.uy';
const SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (!existsSync(skillsDir)) {
  console.error('dist/.well-known/agent-skills not found; run `astro build` first.');
  process.exit(1);
}

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) fields[key] = value.replace(/^["']|["']$/g, '');
  }
  return fields;
}

const skills = [];
for (const entry of readdirSync(skillsDir).sort()) {
  const dir = join(skillsDir, entry);
  if (!statSync(dir).isDirectory()) continue;

  const file = join(dir, 'SKILL.md');
  if (!existsSync(file)) {
    console.warn(`skipping ${entry}: no SKILL.md`);
    continue;
  }

  const bytes = readFileSync(file);
  const meta = frontmatter(bytes.toString('utf8'));
  const name = meta.name ?? entry;

  if (!NAME_PATTERN.test(name)) {
    console.error(
      `invalid skill name "${name}" in ${entry}: use lowercase alphanumerics and hyphens`,
    );
    process.exit(1);
  }
  if (!meta.description) {
    console.error(`skill ${name} is missing a description in its frontmatter`);
    process.exit(1);
  }

  skills.push({
    name,
    type: 'skill-md',
    description: meta.description,
    url: `${SITE}/.well-known/agent-skills/${entry}/SKILL.md`,
    digest: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
  });
}

if (!skills.length) {
  console.error('no agent skills found to index.');
  process.exit(1);
}

const index = { $schema: SCHEMA, skills };
writeFileSync(join(skillsDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log(`Wrote dist/.well-known/agent-skills/index.json (${skills.length} skills)`);
