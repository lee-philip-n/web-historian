var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
//method Post (sends us a url)
//check if that url exists in our archive
//yes: return url html (serving)
//if not, check if its on list
//yes/no: (dont add url if yes)/add url and return loader.html (serving)
  

  if (req.method === 'POST') {
    let body = [];
    
    req.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      //does chunk come in order or randomly
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      let url = body.slice(4);

      res.on('error', (err) => {
        console.error(err);
      });  
      
      archive.isUrlArchived(url, (err, archiveExists)=>{
        if (err) {
          throw err;
        } else {
          if (archiveExists === true) {
            httpHelper.serveAssets(res, url, (err, res, data) => {
              if (err) {
                res.writeHead(302);
                res.end();
              } else {
                res.writeHead(200);
                res.end(data);
              }
            });
          } else if (archiveExists === false) {
            archive.isUrlInList(url, (err, urlListExists)=>{
              if (err) {
                throw err;
              } else if (urlListExists === true) {
                fs.readFile(__dirname + '/public/loading.html', 'utf8', (err, data) => {
                  res.writeHead(302, {Location: __dirname + '/public/loading.html'});
                  res.end(data);
                });
              } else if (urlListExists === false) {
                archive.addUrlToList(url, (err) => {
                  if (err) {
                    throw err;
                  }
                  fs.readFile(__dirname + '/public/loading.html', 'utf8', (err, data) => {
                    res.writeHead(302, {Location: __dirname + '/public/loading.html'});
                    res.end(data);
                  });
                });
              }
            });
          }
        }
      });
    });
  }
  //method Get
  console.log(`Now serving ${req.method} for ${req.url}`);

  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(__dirname + '/public/index.html', 'utf8', (err, data) => {
        res.end(data);
      });
    } else {
      httpHelper.serveAssets(res, req.url, (err, res, data) => {
        if (err) {
          res.writeHead(404);
          res.end();
        } else {
          res.writeHead(200);
          res.end(data);
        }
        // console.log('data outside', data);
      });
    }
  }
};
  


// res.write(data)



// res.end()