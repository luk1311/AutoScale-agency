import fs from 'fs';

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0b0c10" rx="100" />
  <text x="256" y="290" font-family="Arial" font-weight="bold" font-size="200" fill="#6366f1" text-anchor="middle">AS</text>
  <text x="256" y="400" font-family="Arial" font-size="60" fill="#f8f8f8" text-anchor="middle">CRM</text>
</svg>
`;

fs.writeFileSync('./public/pwa-icon.svg', svgContent.trim());
console.log('SVG icon generated at ./public/pwa-icon.svg');
