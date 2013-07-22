var FeedParser = require('feedparser')
  , fs = require('fs');

if(!process.argv[2])  throw 'Not File Found!';
var file = process.argv[2];
var data=[];

fs.createReadStream(file)
    .on('error', function (error) {
      console.error(error);
    })
    .pipe(new FeedParser())
    .on('error', function (error) {
       console.error(error);
    })
    .on('meta', function (meta) {
       console.log('===== %s =====', meta.title);
    })
    .on('readable', function() {
        var stream = this, item;
        stream.end = test;
        while (item = stream.read()) {
            data.push(item.title);
            //console.log('Got article: %s', item.title || item.description);
        }
  });

function test(){
	console.log(data);
}