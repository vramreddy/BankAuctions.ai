const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'prototype', 'Sajith_Prototype_Standalone');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const inventory = files.map(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const pageMatch = content.match(/data-page=["']([^"']*)["']/i);
  const staff = /data-staff/i.test(content);
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  return {
    file,
    title: titleMatch ? titleMatch[1].trim() : '',
    page: pageMatch ? pageMatch[1].trim() : '',
    isStaff: staff,
    h1: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '',
    desc: descMatch ? descMatch[1].trim() : ''
  };
});

fs.writeFileSync(path.join(__dirname, 'prototype_inventory.json'), JSON.stringify(inventory, null, 2));
console.log('Successfully scanned', inventory.length, 'HTML prototype pages.');
