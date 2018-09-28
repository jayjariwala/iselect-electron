const fs = require('fs');
const electron = require('electron');
const ipc = electron.ipcRenderer;
const {
  shell
} = require('electron');

function generateList(links) {
  return links.map((link, headingNum) => {
    return `<ul><li id="${headingNum}" >${link.$.displaytext} <ul>
      ${link.links[0].slidelink.map((slidelink,sideLinkNum) => {
        return `<li id="${headingNum}.${sideLinkNum}">${slidelink.$.displaytext}</li>`
      }).join('')}
      </ul>
      </li>
    </ul>`;
  }).join('')
}

function generateJS(originalJSON, selectedNav) {
  let originalNav = originalJSON.navData.outline.links;
  let obj = {};
  let manipuledNav = [];
  selectedNav.forEach((each) => {
    if (each.includes('.')) {
      let heading = each.substring(-1, each.indexOf('.'));
      let subtopic = each.substring(each.indexOf('.') + 1, each.length);
      if (!Object.keys(obj).includes(heading)) {
        obj[heading] = [];
        obj[heading].push(subtopic);
      } else {
        obj[heading].push(subtopic);
      }
    }
  });


  originalNav.map((heading, headingIndex) => {
    let manipulatedObj = {
      "displaytext": "",
      "expand": false,
      "kind": "",
      "links": [],
      "slideid": "",
      "slidetitle": "",
      "type": ""
    };
    if (Object.keys(obj).includes(headingIndex.toString())) {
      manipulatedObj.displaytext = heading.displaytext;
      manipulatedObj.expand = heading.expand;
      manipulatedObj.kind = heading.kind;
      manipulatedObj.slideid = heading.slideid;
      manipulatedObj.slidetitle = heading.slidetitle;
      manipulatedObj.type = heading.type;
      heading.links.map((link, linkIndex) => {
        if (obj[headingIndex].includes(linkIndex.toString())) {
          manipulatedObj.links.push(link);
        }
      })
      manipuledNav.push(manipulatedObj);
    }
  })
  return manipuledNav;
}

function generateXML(originalJSON, selectedNav) {
  let originalNav = originalJSON.bwFrame.nav_data[0].outline[0].links[0].slidelink;
  let obj = {};
  let manipuledNav = [];
  selectedNav.forEach((each) => {
    if (each.includes('.')) {
      let heading = each.substring(-1, each.indexOf('.'));
      let subtopic = each.substring(each.indexOf('.') + 1, each.length);
      if (!Object.keys(obj).includes(heading)) {
        obj[heading] = [];
        obj[heading].push(subtopic);
      } else {
        obj[heading].push(subtopic);
      }
    }
  })

  originalNav.map((heading, headingIndex) => {
    let manipulatedObj = {
      "$": {},
      "links": [{
        'slidelink': []
      }]
    };
    if (Object.keys(obj).includes(headingIndex.toString())) {
      manipulatedObj.$ = heading.$;
      heading.links[0].slidelink.map((slideLink, slideLinkIndex) => {
        if (obj[headingIndex].includes(slideLinkIndex.toString())) {
          manipulatedObj.links[0].slidelink.push(slideLink);
        }
      })
      manipuledNav.push(manipulatedObj);
    }
  })
  return manipuledNav;
}

ipc.send('fetch_tree_data');

ipc.on('sendData', (event, html5json, xmljson) => {
  console.log("send data recieve");
  //Render xml data with checkbox
  let originalxmlJSON = xmljson;
  let links = xmljson.bwFrame.nav_data[0].outline[0].links[0].slidelink;
  let navigation = generateList(links);
  $('#jstree').html(navigation);

  // checkbox list and folder style
  $('#jstree').jstree({
    "core": {
      "themes": {
        "variant": "large"
      }
    },
    "checkbox": {
      "keep_selected_style": false
    },
    "plugins": ["wholerow", "checkbox"]
  });


  // Generate Button click listener
  $('#generateXML').on('click', function () {
    const selectedTree = $('#jstree').jstree('get_selected');
    console.log(selectedTree);
    const manipulatedXmlNav = generateXML(originalxmlJSON, selectedTree);
    let newXmlNavBar = JSON.parse(JSON.stringify(originalxmlJSON));
    newXmlNavBar.bwFrame.nav_data[0].outline[0].links[0].slidelink = manipulatedXmlNav;
    const manipulatedHtmlNav = generateJS(html5json, selectedTree);
    let newHtmlNavBar = JSON.parse(JSON.stringify(html5json));
    newHtmlNavBar.navData.outline.links = manipulatedHtmlNav;
    ipc.send('generateNavBar', newXmlNavBar, newHtmlNavBar);
  })

})

$('.preview').on('click', () => {
  $('#jstree').jstree().check_node(["0", "1", "0.0", "0.1", "0.2", "1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "2.0", "2.1"]);
});

$('.save').on('click', () => {
  const selectedTree = $('#jstree').jstree('get_selected');
  if ($('.template-navigation a').length === 0) {
    // open template dialog
    if (selectedTree.length === 0) {
      errorDialog.showModal();
    } else {
      templateDialog.showModal();
    }
  } else {
    if (selectedTree.length === 0) {
      errorDialog.showModal();
    } else {
      //save the current template in the file
      const tempId = $('.current').data('tid');
      ipc.send('update-template-data', tempId, selectedTree);
    }
  }
})

ipc.on('savedFile', (event, filePath) => {
  console.log("saved file", filePath);
  shell.showItemInFolder(filePath);
})

const templateDialog = document.querySelector('.template-dialog');
const errorDialog = document.querySelector('.error-dialog');


var showTemplateDialogButton = document.querySelector('#show-template-dialog');
if (!templateDialog.showModal) {
  DialogPolyfill.registerDialog(templateDialog);
}
if (!errorDialog.showModal) {
  dialogPolyfill.registerDialog(errorDialog);
}
showTemplateDialogButton.addEventListener('click', function () {
  templateDialog.showModal();
});

$('.close-template').click((e) => {
  templateDialog.close();
})

$('.close-error').click((e) => {
  errorDialog.close();
})

$('.save-template').click((e) => {
  const templateName = $('.template-name').val();
  let selectedTree = [];
  if (templateName) {
    if ($('.template-navigation a').length === 0) {
      selectedTree = $('#jstree').jstree('get_selected');
      ipc.send('handle-template', templateName, selectedTree);
    } else {
      ipc.send('handle-template', templateName);
    }
  } else {
    $('.mdl-textfield__error').html('Template Name cannot be empty');
    $('.mdl-textfield__error').css('visibility', 'visible');
    e.preventDefault();
  }
})

ipc.on('template-added', () => {
  $('.template-name').val("");
  $('.mdl-textfield__error').css('visibility', 'hidden');
  ipc.send('fetch-templates-activeted');
  templateDialog.close();
});

$('.template-name').keyup(() => {
  $('.mdl-textfield__error').css('visibility', 'hidden');
})

ipc.on('template-exist', () => {
  $('.mdl-textfield__error').html('Template already exist. try different name!');
  $('.template-name').val("");
  $('.mdl-textfield__error').css('visibility', 'visible');
})


$(document).ready((yes) => {
  ipc.send('fetch-templates');
})

ipc.on('fetched-templates', (e, templates) => {
  $('.template-navigation').html(templates);
  if ($('.current').length === 0) {
    // uncheck all
    $('#jstree').jstree().uncheck_all();
  } else {
    if ($('.current').data('id')) {
      $('#jstree').jstree().uncheck_all();
      $('#jstree').jstree().check_node($('.current').data('id').split(','));
    } else {
      $('#jstree').jstree().uncheck_all();
    }
  }
});

ipc.on('fetched-template-activated', (e, template) => {

  $('.template-navigation').html(template);
  $('.template-navigation a').removeClass('current');
  $('.template-navigation a:last-child').addClass('current');
  if ($('.template-navigation a:last-child').data('id') === "") {
    $('#jstree').jstree().uncheck_all();
  } else {
    console.log('In the fetched-activeted condition');
    $('#jstree').jstree().check_node($('.template-navigation a:last-child').data('id').split(','));
  }
})
$('.alert-success').hide();

ipc.on('template-saved', () => {

  $('.alert-success').show();
  $('.alert-success').addClass('success-animation');
  setTimeout(() => {
    $('.alert-success').removeClass('success-animation');
    $('.alert-success').hide();
  }, 2000);
})

$('.template-navigation').click((e) => {
  if (e.target.matches('i')) {
    let activeLink = $('.current').data('tid');
    let activeLinkStatus = 0;
    if (activeLink !== $(e.target).data('id')) {
      activeLinkStatus = activeLink;
    }
    ipc.send('delete-template', $(e.target).data('id'), activeLinkStatus);

  }
  if (!e.target.matches('a')) return;
  e.delegateTarget.childNodes.forEach((template) => {
    $(template).removeClass('current');
  });
  let tempId = $(e.target).data('id').split(",");
  $(e.target).addClass('current');
  $('#jstree').jstree().uncheck_all();
  $('#jstree').jstree().check_node(tempId);
})