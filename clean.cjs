const fs = require('fs');
['src/pages/Landing.jsx', 'src/pages/AgentDetails.jsx'].forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');
  txt = txt.replace(/â•/g, '═');
  txt = txt.replace(/â”€/g, '─');
  txt = txt.replace(/â”/g, '│');
  txt = txt.replace(/œ/g, '═');
  txt = txt.replace(/ðŸ”¥|Â/g, ''); // Remove fire emoji and weird spaces
  fs.writeFileSync(f, txt, 'utf8');
  console.log('Cleaned ' + f);
});
