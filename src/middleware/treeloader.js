const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const path = require('path');

module.exports = function threeLoader(json) {
    fs.readFile(path.join(__dirname, '..', '..', 'frames', 'frame.xml'), 'utf-8', function (err, data) {
        if (err) console.log(err);
        // we then pass the data to our method here
        parser.parseString(data, function (err, result) {
            if (err) console.log(err);
            // here we log the results of our xml string conversion
            json(result);
        });
    });
};