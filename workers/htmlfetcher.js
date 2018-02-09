var archive = require('../helpers/archive-helpers.js');
var CronJob = require('cron').CronJob;
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

let cron = new CronJob('* */1 * * *', function() {  
  console.log('cron is running every minute');
  archive.readListOfUrls((err, array) => {
    archive.downloadUrls(array);
  });
}, null, true, 'America/Los_Angeles');