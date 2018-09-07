const fs = require('fs');
const path = require('path');
module.exports = function (html5fetch) {
    fs.readFile(path.join(__dirname, '..', '..', 'frames', 'frame.js'), 'utf-8', (err, data) => {
        if (err) console.log(err);
        const startTrim = data.toString().indexOf('{');
        const endTrim = data.toString().lastIndexOf('}');
        const html5OriginalNav = JSON.parse(data.toString().substring(startTrim, endTrim + 1));
        //got json array or what?
        html5fetch(html5OriginalNav);
    })
}