const fs = require('fs');
const path = require('path');
var uniqid = require('uniqid');

function trimAndLower(templateNameString) {
    return templateNameString.replace(/\s/g, '').toLowerCase()
}

function checkIfTemplateExist(templateFromJson, templateName) {
    templateName = trimAndLower(templateName);
    const isTemplateThere = JSON.parse(templateFromJson).filter((templates) => {
        return trimAndLower(templates.template) === templateName;
    })
    if (isTemplateThere.length) {
        return true
    } else {
        return false
    }
}

module.exports = function (templateName, selectionTree) {
    const file = path.join(__dirname, '..', 'frames', 'template.json');
    const jsonObj = {
        tempId: uniqid(),
        template: templateName,
        treeSelection: selectionTree
    }
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) throw err;
            if (data) {
                const templateIsThere = checkIfTemplateExist(data, templateName);
                if (templateIsThere) {
                    // show error dialog saying please change the name of template
                    resolve("template-exist");
                } else {
                    let dataFromFile = JSON.parse(data);
                    dataFromFile.push(jsonObj);
                    fs.writeFile(file, JSON.stringify(dataFromFile), (data, err) => {
                        resolve("file-updated");
                    })
                    // push new template name
                }
            } else {
                fs.writeFile(file, JSON.stringify([jsonObj]), (err) => {
                    if (err) console.log("something went wrong!");
                    resolve("file-updated");
                })
            }
        })
    });
    //check if the template file is there if not then create a new file with first template inint
}