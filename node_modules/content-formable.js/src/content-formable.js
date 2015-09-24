var url2form = require('../node_modules/url2form.js/src/url2form');
var unindentor = require('../node_modules/unindentor.js/src/unindentor');

module.exports = contentFormable;

var defaultOptions = {
  editableAttribute: 'data-cf-editable',
  conditionalAttribute: 'data-cf-if',
  disabledClass: 'cf-disabled',
  hiddenClass: 'cf-hidden'
};

function contentFormable(formName, options) {

  var form = document.forms[formName];
  if (!form) {
    throw new DOMException('Unexisting form: ' + formName);
  }
  options = extend(defaultOptions, options);
  init();

  function init() {
    var editableElementList = document.querySelectorAll('['+options.editableAttribute+']');
    for (var i = 0; i < editableElementList.length; i++) {
      initEditableItem(editableElementList[i], i);
    }

    url2form.init(formName);

    var conditionalElementList = document.querySelectorAll('['+options.conditionalAttribute+']');
    for (var j = 0; j < conditionalElementList.length; j++) {
      initConditionalItem(conditionalElementList[j]);
    }
  }

  function initEditableItem(element, counter) {
    var attr = element.getAttribute(options.editableAttribute);
    var id = attr ? attr : 'f' + counter;
    var textarea = document.createElement('textarea');
    textarea.setAttribute('name', id);
    textarea.innerHTML = unindentor.unindentText(element.textContent);
    element.innerHTML = '';
    element.appendChild(textarea);
  }

  function initConditionalItem(element) {
    var inputNameList = element.getAttribute(options.conditionalAttribute).trim().split(' ');
    var i, inputName, inputList = [];
    for (i=0; i< inputNameList.length; i++) {
      inputName = inputNameList[i];
      if (inputName) {
        inputList.push(form.querySelector('[name="' + inputName + '"]'));
      }
    }

    updateConditionalItem(element, inputList);
    for (i=0; i< inputList.length; i++) {
      inputList[i].addEventListener('keyup', function () {
        updateConditionalItem(element, inputList);
      });
    }
  }

  function updateConditionalItem(element, inputList) {
    var disabled = false;
    var hidden = false;
    var i, input;
    for (i=0; i< inputList.length; i++) {
      input = inputList[i];
      if (!input.value) {
        disabled = true;
        if (!isDescendant(element, input)) {
          hidden = true;
        }
      }
    }

    element.classList.toggle(options.disabledClass, disabled);
    element.classList.toggle(options.hiddenClass, hidden);
  }
}

// UTILS
function isDescendant(parent, child) {
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function extend(defaults, options) {
  var extended = {};
  var prop;
  for (prop in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
      extended[prop] = defaults[prop];
    }
  }
  for (prop in options) {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      extended[prop] = options[prop];
    }
  }
  return extended;
}