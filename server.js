const http = require('http');
const fs = require('fs');

const baseURL = 'http://127.0.0.1';

http.createServer((request, response) => {
  const addr = request.url;
  const q = new URL(addr, baseURL);
  let filePath = '';

  fs.appendFile('log.txt', `URL: ${addr}\nTimestamp: ${new Date()}\n\n`, (err) => {
    if (err) {
      // eslint-disable-next-line
      console.log(err);
    } else {
      // eslint-disable-next-line
      console.log('Added to log.');
    }
  });

  if (q.pathname.includes('documentation')) {
    filePath = (`${__dirname}/documentation.html`);
  } else {
    filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });
}).listen(8080);

// eslint-disable-next-line
console.log('My test server is running on Port 8080.');
