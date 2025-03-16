const http = require('http'),
  fs = require('fs'),
  url = require('url');

http
  .createServer((request, response) => {
    let addr = request.url,
      q = new URL(addr, 'http://' + request.headers.host),
      filePath = '';

    /* Log the request */
    fs.appendFile(
      'log.txt',
      'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n',
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added to log.');
        }
      }
    );

    if (q.pathname.includes('documentation')) {
      filePath = __dirname + '/documentation.html';
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

    /* http end */
  })
  .listen(8080);
console.log('My test server is running on Port 8080.');

// http
//   .createServer((request, response) => {
//     /* Parse the request containing file name */
//     let addr = request.url,
//       q = new URL(addr, "http://" + request.headers.host),
//       filePath = "";

//     /* Log the request */
//     fs.appendFile(
//       "log.txt",
//       "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
//       (err) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Added to log");
//         }
//       },
//     );

//     /* If the URL path is /documentation, set the file path to documentation.html */
//     if (q.pathname.includes("documentation")) {
//       filePath = __dirname + "/documentation.html";
//     } else {
//       filePath = "index.html";
//     }

//     /* Read the HTML file and return it to the client */
//     fs.readFile(filePath, (error, data) => {
//       if (err) {
//         throw error;
//       }
//       response.writeHead(200, { "Content-Type": "text/html" });
//       response.write(data);
//       response.end();
//     });
//   })
//   .listen(8080);
// console.log("My first Node test server is running on Port 8080.");
