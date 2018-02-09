var archive = require('../helpers/archive-helpers.js');
var cron = require('cron');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

cron.schedule('* /1 * * * *', function() {
  archive.readListOfUrls((err, array) => {
    archive.downloadUrl(array);
  });
  console.log('running a task every minute');
});