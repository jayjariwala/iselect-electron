const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');


module.exports = function generateXML(jsondata) {
  return new Promise((resolve, reject) => {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(jsondata);
    var destinationPath = path.join(__dirname, '..', '..', 'course-input', 'story_content', 'frame.xml');
    fs.writeFile(destinationPath, xml, (err) => {
      if (err) reject("Something went wrong");
      console.log("file saved successfull");
      resolve(true);
    })
  })
};