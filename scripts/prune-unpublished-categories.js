const fs = require('fs');
const path = require('path');
const publication = require('../data/category-publication.json');
const { emptyRouteSlug } = require('../data/static-export.json');

const ROOT = path.join(__dirname, '..');

function main() {
  const { config } = JSON.parse(
    fs.readFileSync(path.join(ROOT, '.next', 'required-server-files.json'), 'utf8'),
  );
  if (config.output !== 'export') return;

  // Static hosts cannot apply the 404 status from a category's layout.
  const bestDir = path.join(ROOT, 'out', 'best');
  const removed = [];
  for (const directory of [bestDir, path.join(ROOT, 'out', 'articles')]) {
    if (!fs.existsSync(directory)) continue;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name !== emptyRouteSlug && !entry.name.startsWith(`${emptyRouteSlug}.`)) continue;
      fs.rmSync(path.join(directory, entry.name), { recursive: entry.isDirectory() });
      removed.push(entry.name);
    }
  }

  for (const entry of fs.readdirSync(bestDir, { withFileTypes: true })) {
    const slug = entry.isDirectory() ? entry.name : entry.name.replace(/\.(html|txt)$/, '');
    if (slug === 'index' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
    if (publication[slug] === true) continue;

    fs.rmSync(path.join(bestDir, entry.name), { recursive: entry.isDirectory() });
    removed.push(entry.name);
  }
  console.log(`Excluded ${removed.length} unpublished export(s).`);
}

main();
