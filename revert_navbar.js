const fs = require('fs');
const path = require('path');
const file = 'components/layout/Navbar.tsx';

let content = fs.readFileSync(file, 'utf8');

const replacements = [
  { rx: /bg-white\/80/g, rep: 'bg-background/70' },
  { rx: /bg-white\/60/g, rep: 'bg-background/40' },
  { rx: /bg-white\/95/g, rep: 'bg-background/95' },
  { rx: /bg-white\/98/g, rep: 'bg-background/98' },
  { rx: /text-slate-900/g, rep: 'text-foreground' },
  { rx: /text-slate-600/g, rep: 'text-muted-foreground' },
  { rx: /border-slate-200\/60/g, rep: 'border-border/50' },
  { rx: /border-slate-200\/40/g, rep: 'border-border/30' },
  { rx: /border-slate-200/g, rep: 'border-border' },
  { rx: /bg-slate-100/g, rep: 'bg-muted/20' },
  { rx: /bg-slate-50/g, rep: 'bg-accent' },
];

for (const { rx, rep } of replacements) {
  content = content.replace(rx, rep);
}

// Add dark:brightness-0 dark:invert to the Logo image class
content = content.replace(/className="w-auto transition-all/g, 'className="w-auto dark:brightness-0 dark:invert transition-all');
content = content.replace(/className="w-auto h-\[32px\]"/g, 'className="w-auto h-[32px] dark:brightness-0 dark:invert"');

fs.writeFileSync(file, content, 'utf8');
console.log('Reverted Navbar.tsx');
