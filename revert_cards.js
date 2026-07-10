const fs = require('fs');
const path = require('path');
const dir = 'components/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  if (content.includes('dark:bg-slate-900')) {
    content = content.replace(/dark:bg-slate-900/g, 'dark:bg-card');
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Reverted cards in ' + file);
  }
}
