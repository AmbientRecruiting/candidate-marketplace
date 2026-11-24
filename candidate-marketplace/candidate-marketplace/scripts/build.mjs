// Builds the site into _site/: copies site/, copies profile PDFs,
// and generates data/candidates.json from profiles/*.json.
import fs from 'node:fs';
import path from 'node:path';

// Hide profiles older than this many days from the site (0 = never hide).
// Hidden profiles stay in the repo; nothing is deleted.
const HIDE_AFTER_DAYS = Number(process.env.HIDE_AFTER_DAYS || 0);
const HIDDEN_STATUSES = ['withdrawn'];

const root = process.cwd();
const out = path.join(root, '_site');
const profilesDir = path.join(root, 'profiles');

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'site'), out, { recursive: true });
fs.mkdirSync(path.join(out, 'profiles'), { recursive: true });
fs.mkdirSync(path.join(out, 'data'), { recursive: true });

const files = fs.existsSync(profilesDir) ? fs.readdirSync(profilesDir) : [];
const candidates = [];
for (const f of files.filter(f => f.toLowerCase().endsWith('.json'))) {
  try {
    const c = JSON.parse(fs.readFileSync(path.join(profilesDir, f), 'utf8'));
    if (!c || !c.id) { console.warn(`Skipping ${f}: no id`); continue; }
    if (HIDDEN_STATUSES.includes(String(c.status || '').toLowerCase())) continue;
    if (HIDE_AFTER_DAYS > 0) {
      const age = (Date.now() - Date.parse(c.postedDate)) / 86400000;
      if (age > HIDE_AFTER_DAYS) continue;
    }
    if (c.pdf && !fs.existsSync(path.join(profilesDir, c.pdf))) {
      console.warn(`${f}: PDF "${c.pdf}" not found; card will show without a PDF link`);
      c.pdf = '';
    }
    if (c.pdf) fs.copyFileSync(path.join(profilesDir, c.pdf), path.join(out, 'profiles', c.pdf));
    candidates.push(c);
  } catch (e) {
    console.warn(`Skipping ${f}: ${e.message}`);
  }
}
fs.writeFileSync(path.join(out, 'data', 'candidates.json'), JSON.stringify(candidates, null, 2));
console.log(`Built site with ${candidates.length} candidate(s).`);
