const fs = require('fs');
const pdfParse = require('pdf-parse');

async function test() {
  try {
    console.log(typeof pdfParse);
  } catch (e) {
    console.error(e);
  }
}
test();
