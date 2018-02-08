var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    callback(err, data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((err, data) => {
    callback(err, data.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  const check = exports.isUrlInList(url, (err, exists) => {
    if (exists === false) {
      fs.appendFile(exports.paths.list, url, (err) => {
        callback(err);
      });
    } 
  });
};

exports.isUrlArchived = function(url, callback) {
  let sitePath = path.join(exports.paths.archivedSites, url);
  
  fs.access(sitePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        callback(null, false);
      }
    } else {
      callback(err, true);
    }
  });
};

exports.downloadUrls = function(urls) {
  //write file in sites dir
  //get html from internet
  //appendFile to newly created write file
  urls.forEach((site) => {
    request(`https://${site}`, function (error, response, body) {
      fs.writeFile(exports.paths.archivedSites + '/' + site, body);
    });
  });
};
































