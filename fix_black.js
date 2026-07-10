const fs = require('fs');
const path = require('path');
const dir = 'components/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // 1. If it's a section tag, make background black
  content = content.replace(/<section\b[^>]*className=["'\`][^"'\`]*dark:bg-background[^"'\`]*["'\`]/g, (match) => {
    changed = true;
    return match.replace('dark:bg-background', 'dark:bg-[#030712]'); // very dark black/gray (gray-950)
  });

  // 2. The remaining dark:bg-background are likely cards (since they have rounded-xl etc)
  if (content.includes('dark:bg-background')) {
    content = content.replace(/dark:bg-background/g, 'dark:bg-slate-900');
    changed = true;
  }
  
  // 3. Fix gradients
  if (content.includes('dark:from-background')) {
    content = content.replace(/dark:from-background/g, 'dark:from-[#030712]');
    changed = true;
  }
  if (content.includes('dark:to-background')) {
    content = content.replace(/dark:to-background/g, 'dark:to-[#030712]');
    changed = true;
  }

  // 4. Also fix HeroSection which has a section but might not have used dark:bg-background exactly
  // (Wait, HeroSection uses dark:bg-background)

  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Updated ' + file);
  }
}
