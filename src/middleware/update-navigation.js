const fs = require('fs');
const path = require('path');

module.exports = function (templateId, selectionTree) {
    return new Promise((resolve, reject) => {
        const file = path.join(__dirname, '..', 'frames', 'template.json');
        fs.readFile(file, 'utf-8', (err, data) => {
            const templates = JSON.parse(data)
            templates.forEach(element => {
                if (element.tempId === templateId) {
                    element.treeSelection = selectionTree;
                }
            });
            fs.writeFile(file, JSON.stringify(templates), (err) => {
                resolve(templateId);
            })
        })
    })
}