(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.url2form = factory(root.b);
    }
}(this, function () {
    'use strict';

    function initQueryMap() {
        var queryMap = {};
        var href = window.location.href;
        var queryString = href.slice(href.indexOf('?') + 1);
        queryString = decodeURIComponent(queryString.replace('+', ' ', 'g'));
        var queryList = queryString.split('&');
        var queryItem;
        for (var i = 0; i < queryList.length; i++) {
            if (queryList[i]) {
                queryItem = queryList[i].split('=');
                queryMap[queryItem[0]] = queryItem[1];
            }
        }
        return queryMap;
    }

    function init(formName) {
        if (typeof document.forms[formName] == "undefined") {
            return false;
        }
        var form = document.forms[formName];
        var queryMap = initQueryMap();
        for (var name in queryMap) {
            var inputList = document.querySelectorAll('[name="' + name + '"]');
            for (var i = 0; i < inputList.length; i++) {
                var input = inputList[i];
                if (input.tagName == "TEXTAREA") {
                    input.innerHTML = queryMap[name];
                } else if (input.tagName == "INPUT") {
                    if (
                        input.type == "checkbox" ||
                        input.type == "radio"
                    ) {
                        if (input.value == queryMap[name]) {
                            input.setAttribute('checked', 'checked');
                        }
                    } else if (
                        input.type !== "hidden" &&
                        input.type !== "button" &&
                        input.type !== "image"
                    ) {
                        input.value = queryMap[name];
                    }
                }
            }
        }
    }

    return {
        init: init
    };
}));