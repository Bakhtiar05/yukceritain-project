const fs = require('fs');
const path = require('path');
const dir = 'components/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // Revert black back to community background
  if (content.includes('dark:bg-[#030712]')) {
    content = content.replace(/dark:bg-\[#030712\]/g, 'dark:bg-background');
    changed = true;
  }
  if (content.includes('dark:from-[#030712]')) {
    content = content.replace(/dark:from-\[#030712\]/g, 'dark:from-background');
    changed = true;
  }
  if (content.includes('dark:to-[#030712]')) {
    content = content.replace(/dark:to-\[#030712\]/g, 'dark:to-background');
    changed = true;
  }
  
  // Fix the glowing white vignette in HeroSection
  if (file === 'HeroSection.tsx' && content.includes('shadow-[inset_0_0_120px_50px_#FFFFFF]')) {
    content = content.replace('shadow-[inset_0_0_120px_50px_#FFFFFF]', 'shadow-[inset_0_0_120px_50px_#FFFFFF] dark:shadow-[inset_0_0_120px_50px_#1D1F24]');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Reverted ' + file);
  }
}
