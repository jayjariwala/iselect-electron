const fs = require('fs');
const path = require('path');
const templateNames = [];
const templateSelection = [];

function formatTemplates(templates) {
    const templateList = JSON.parse(templates).map((templateList, index) => {
        if (index === 0) {
            return `<a class="mdl-navigation__link current" href="#" data-id="${templateList.treeSelection}">${templateList.template}
        <button type="button" class="mdl-chip__action del-icon" >
          <i class="material-icons" data-id="${templateList.tempId}">delete</i>
        </button>
      </a>`
        } else {
            return `<a class="mdl-navigation__link" href="#" data-id="${templateList.treeSelection}">${templateList.template}
            <button type="button" class="mdl-chip__action del-icon" >
              <i class="material-icons" data-id="${templateList.tempId}">delete</i>
            </button>
          </a>`
        }
    }).join("");
    return templateList;
}

module.exports = function () {
    const file = path.join(__dirname, '..', 'frames', 'template.json');
    let template;
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (JSON.parse(data).length > 0) {
                const templateList = formatTemplates(data);
                resolve(templateList);
            } else {
                // template = "<p class='no-data'>NO TEMPLATE</p>"
                template = "<img src='./assets/img/createTemp.png' class='template-img' width='100px'>"
                resolve(template);
            }
        })
    })
}