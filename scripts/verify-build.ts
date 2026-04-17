import { existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const indexFile = join(distDir, 'index.html');
const searchIndex = join(distDir, 'search-index.json');

console.log('🔍 Validating build output...');

const checks = [
  { name: 'Dist directory exists', path: distDir },
  { name: 'Root index.html exists', path: indexFile },
  { name: 'Search index JSON exists', path: searchIndex },
];

let failed = false;

for (const check of checks) {
  if (existsSync(check.path)) {
    console.log(`✅ ${check.name}`);
  } else {
    console.error(`❌ ${check.name} MISSING at ${check.path}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('🚀 Build verification successful!');
}
