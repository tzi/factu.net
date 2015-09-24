(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.contentFormable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = unindentor();

function unindentor() {
    'use strict';

    function unindentElementList(elementList) {
        elementList = formatElementList(elementList);
        for (var i = 0; i < elementList.length; i++) {
            unindentElement(elementList[i]);
        }
    }

    function formatElementList(elementList) {
        if (typeof elementList == 'string') {
            elementList = document.querySelectorAll(elementList);
        }
        elementList = Array.prototype.slice.call(elementList);
        return elementList;
    }

    function unindentElement(element) {
        element.innerHTML = unindentText(element.innerHTML);
    }

    function unindentText(text) {
        var result = [];
        var indentation = false;
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (indentation === false) {
                indentation = findIndentation(line);
                if (indentation === false) {
                    continue;
                }
            }
            line = unindentLine(line, indentation);
            result.push(line);
        }
        return rtrim(result.join('\n'));
    }

    function unindentLine(line, indentation) {
        if (startsWith(line, indentation)) {
            line = line.substr(indentation.length);
        }
        return line;
    }

    function findIndentation(line) {
        var trimmed = line.trim();
        if (!trimmed) {
            return false;
        }
        return line.substr(0, line.indexOf(trimmed[0]));
    }

    function startsWith(str, prefix) {
        return str.slice(0, prefix.length) == prefix;
    }

    function rtrim(str) {
        return str.replace(/\s+$/, '');
    }

    return {
        unindentElementList: unindentElementList,
        unindentElement: unindentElement,
        unindentText: unindentText
    }
};
},{}],2:[function(require,module,exports){
module.exports = url2form();

function url2form() {
    'use strict';

    function getQueryList() {
        var queryObjectList = [];
        var href = window.location.href;
        var queryString = href.slice(href.indexOf('?') + 1);
        queryString = decodeURIComponent(queryString.replace(/\+/g, ' '));
        var queryList = queryString.split('&');
        var queryItem;
        for (var i = 0; i < queryList.length; i++) {
            if (queryList[i]) {
                queryItem = queryList[i].split('=');
                queryObjectList.push({name: queryItem[0], value: queryItem[1]});
            }
        }
        return queryObjectList;
    }

    function init(formName) {
        var form = document.forms[formName];
        if (!form) {
            throw new DOMException('Unexisting form: ' + formName);
        }
        var queryList = getQueryList();
        var query;
        for (var j = 0; j < queryList.length; j++) {
            query = queryList[j];
            var inputList = form.querySelectorAll('[name="' + query.name + '"]');
            for (var i = 0; i < inputList.length; i++) {
                var input = inputList[i];
                if (input.tagName == "TEXTAREA") {
                    input.innerHTML = query.value;
                    break;
                } else if (input.tagName == "INPUT") {
                    if (
                        input.type == "checkbox" ||
                        input.type == "radio"
                    ) {
                        if (input.value == query.value) {
                            input.setAttribute('checked', 'checked');
                            break;
                        }
                    } else if (
                        input.type !== "hidden" &&
                        input.type !== "button" &&
                        input.type !== "image"
                    ) {
                        input.value = query.value;
                        break;
                    }
                }
            }
        }
    }

    return {
        init: init
    };
}
},{}],3:[function(require,module,exports){
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
},{"../node_modules/unindentor.js/src/unindentor":1,"../node_modules/url2form.js/src/url2form":2}]},{},[3])(3)
});