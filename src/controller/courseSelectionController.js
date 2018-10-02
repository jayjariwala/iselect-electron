const electron = require('electron');
const {
    dialog,
    Menu
} = require('electron');
const {
    shell
} = require('electron');
const BrowserWindow = require('electron').BrowserWindow;
const generateXML = require('../middleware/generateXML.js');
const generateJS = require('../middleware/generateJSFrame.js');
const ipc = electron.ipcMain;
const zipGenerator = require('../middleware/zipGenerator');
const handleTemplate = require('../middleware/handleTemplate');
const fetchTemplate = require('../middleware/fetchTemplate');
const deleteTemplate = require('../middleware/deleteTemplate');
const updateNavigation = require('../middleware/update-navigation');
const path = require('path');

module.exports = function (mainWindow, html5json, xmljson) {

    mainWindow.setSize(1080, 600);
    mainWindow.center();

    mainWindow.loadURL(`file://${__dirname}/../views/navigation.html`);

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
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)


    mainWindow.webContents.send('sendData', html5json, xmljson);

    ipc.on('fetch_tree_data', _ => {
        mainWindow.webContents.send('sendData', html5json, xmljson);
    })

    ipc.on('generateNavBar', (event, newXmlNavBar, newHtmlNavBar, templateName) => {
        generateXML(newXmlNavBar).then((success, fail) => {
            if (success) {
                generateJS(newHtmlNavBar).then((sucess, fail) => {
                    if (sucess) {
                        dialog.showSaveDialog({
                            title: templateName,
                            defaultPath: '~/' + templateName,
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

    ipc.on('previewTemplate', (event, newXmlNavBar, newHtmlNavBar) => {
        generateXML(newXmlNavBar).then((success, fail) => {
            if (success) {
                generateJS(newHtmlNavBar).then((sucess, fail) => {
                    if (sucess) {
                        shell.openItem(path.join(__dirname, '..', '..', 'course-input', 'story_html5.html'));
                    }
                })
            }
        });
    })

    ipc.on('handle-template', (e, templateName, selectionTree = []) => {

        handleTemplate(templateName, selectionTree).then((success, fail) => {
            if (success === 'file-updated') {
                mainWindow.webContents.send('template-added');
            } else {
                mainWindow.webContents.send('template-exist');
            }
        });
    });

    ipc.on('fetch-templates', () => {
        console.log("fetch the template");
        fetchTemplate().then((success, fail) => {
            if (success) {
                mainWindow.webContents.send('fetched-templates', success);
            }
        });
    });

    ipc.on('fetch-templates-activeted', () => {
        fetchTemplate().then((success, fail) => {
            if (success) {
                mainWindow.webContents.send('fetched-template-activated', success);
            }
        });
    })

    ipc.on('delete-template', (e, id, activeLink) => {
        deleteTemplate(id).then((success, fail) => {
            fetchTemplate(activeLink).then((suc, fail) => {
                if (suc) {
                    mainWindow.webContents.send('fetched-templates', suc);
                }
            })
        });
    })

    ipc.on('update-template-data', (e, tId, selectedTree) => {
        updateNavigation(tId, selectedTree).then((success, fail) => {
            if (success) {
                fetchTemplate(success).then((templates, fail) => {
                    if (templates) {
                        mainWindow.webContents.send('fetched-templates', templates);
                        mainWindow.webContents.send('template-saved');
                    }
                });
            }
        });
    })

}