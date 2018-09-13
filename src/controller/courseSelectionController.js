const electron = require('electron');
const {
    dialog,
    Menu
} = require('electron');
const BrowserWindow = require('electron').BrowserWindow;
// const treeLoader = require('../middleware/treeloader.js');
const generateXML = require('../middleware/generateXML.js');
const generateJS = require('../middleware/generateJSFrame.js');
// const fetchHtmlFrame = require('../middleware/fetchHtmlFrame.js');
const ipc = electron.ipcMain;
const zipGenerator = require('../middleware/zipGenerator');
const handleTemplate = require('../middleware/handleTemplate.js');

module.exports = function (html5json, xmljson) {
    let mainWindow = new BrowserWindow({
        width: 1080,
        height: 600,
    });
    mainWindow.loadURL(`file://${__dirname}/../views/navigation.html`);
    mainWindow.webContents.openDevTools();
    const template = [{
            label: 'Edit',
            submenu: [{
                    role: 'undo'
                },
                {
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
                {
                    role: 'pasteandmatchstyle'
                },
                {
                    role: 'delete'
                },
                {
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'View',
            submenu: [{
                    role: 'reload'
                },
                {
                    role: 'forcereload'
                },
                {
                    role: 'toggledevtools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'resetzoom'
                },
                {
                    role: 'zoomin'
                },
                {
                    role: 'zoomout'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'togglefullscreen'
                }
            ]
        },
        {
            role: 'window',
            submenu: [{
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        },
        {
            role: 'help',
            submenu: [{
                label: 'Learn More',
                click() {
                    require('electron').shell.openExternal('https://electronjs.org')
                }
            }]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)


    mainWindow.webContents.send('sendData', html5json, xmljson);

    ipc.on('fetch_tree_data', _ => {
        mainWindow.webContents.send('sendData', html5json, xmljson);
    })

    ipc.on('generateNavBar', (event, newXmlNavBar, newHtmlNavBar) => {
        generateXML(newXmlNavBar).then((success, fail) => {
            if (success) {
                generateJS(newHtmlNavBar).then((sucess, fail) => {
                    if (sucess) {
                        dialog.showSaveDialog({
                            filters: [{
                                name: 'zip',
                                extensions: ['zip']
                            }]
                        }, (savePath) => {
                            zipGenerator(savePath).then((res) => {
                                if (res) {
                                    mainWindow.webContents.send('savedFile', savePath);
                                }
                            });
                        });
                    }
                })
            }
        });
    })

    ipc.on('handle-template', (e, templateName) => {
        handleTemplate(templateName);
    });

}