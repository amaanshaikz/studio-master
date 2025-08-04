const pngToIco = require('png-to-ico');
const fs = require('fs');

async function convertToIco() {
  try {
    const pngFiles = ['favicon-16.png', 'favicon-32.png'];
    const ico = await pngToIco(pngFiles);
    fs.writeFileSync('favicon.ico', ico);
    console.log('Favicon created successfully!');
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

convertToIco(); 