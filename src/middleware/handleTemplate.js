const fs = require('fs');
const path = require('path');

module.exports = function (templateName) {
    //check if the template file is there if not then create a new file with first template inint
    const file = path.join(__dirname, '..', 'frames', 'template.json');
    const jsonObj = {
        template: templateName,
        treeSelection: [
            [1, 2],
            [1, 3],
            [1, 3],
            [1, 3],
            [1, 3],
            [1, 3],
            [1, 3],
            [1, 3],
            [1, 3],
            [1, 3]
        ]
    }
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) throw err;
        if (data) {

        } else {
            fs.writeFile(file, JSON.stringify([jsonObj]), (err) => {
                if (err) console.log("something went wrong!");
                console.log("data written successfully");
            })
        }
    })
}