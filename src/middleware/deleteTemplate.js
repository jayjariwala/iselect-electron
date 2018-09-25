const path = require('path');
const fs = require('fs');

module.exports = function (id) {
    const file = path.join(__dirname, '..', 'frames', 'template.json');
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            const templates = JSON.parse(data);
            const newTemplates = templates.filter((tempFromFile) => tempFromFile.tempId !== id);
            fs.writeFile(file, JSON.stringify(newTemplates), (err) => {
                if (err) console.log("template didn't update");
                resolve('template-deleted');
            })
        })
    })

}