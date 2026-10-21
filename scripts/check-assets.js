const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let issues = 0;
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
  const linkRegex = /<link[^>]+href=["']([^"']+)["']/g;

  let match;
  console.log('Inspecting ' + file + ':');

  while ((match = scriptRegex.exec(content)) !== null) {
    const ref = match[1];
    if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('data:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    const fullPath = path.join(dir, cleanRef);
    if (!fs.existsSync(fullPath)) {
      console.log('  ❌ Missing script: ' + ref);
      issues++;
    } else {
      console.log('  ✅ script: ' + ref);
    }
  }

  while ((match = linkRegex.exec(content)) !== null) {
    const ref = match[1];
    if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('data:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    const fullPath = path.join(dir, cleanRef);
    if (!fs.existsSync(fullPath)) {
      console.log('  ❌ Missing link: ' + ref);
      issues++;
    } else {
      console.log('  ✅ link: ' + ref);
    }
  }
});

console.log('\nTotal broken asset references:', issues);

const { execSync } = require('child_process');
const jsDirs = [
  path.join(dir, 'js'),
  path.join(dir, 'scripts')
];

let syntaxErrors = 0;
console.log('\nChecking JavaScript syntax:');
jsDirs.forEach(d => {
  fs.readdirSync(d).filter(f => f.endsWith('.js')).forEach(f => {
    const full = path.join(d, f);
    try {
      execSync(`node -c "${full}"`);
      console.log('  ✅ ' + f);
    } catch (e) {
      console.log('  ❌ Syntax error in ' + f + ': ' + e.message);
      syntaxErrors++;
    }
  });
});

console.log('\nTotal syntax errors:', syntaxErrors);
process.exit(issues === 0 && syntaxErrors === 0 ? 0 : 1);

