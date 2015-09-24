(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.url2form = factory();
    }
}(this, function () {
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
        if (typeof document.forms[formName] == "undefined") {
            return false;
        }
        var form = document.forms[formName];
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
}));