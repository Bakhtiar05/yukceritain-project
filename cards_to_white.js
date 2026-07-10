const fs = require('fs');
const path = require('path');
const dir = 'components/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  if (content.includes('dark:bg-card')) {
    content = content.replace(/dark:bg-card/g, 'dark:bg-white');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Reverted cards in ' + file + ' to white');
  }
}
