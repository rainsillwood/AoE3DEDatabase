//获取json
async function getJson(url) {
    return new Promise(function (resolve, reject) {
        $.get(url, function (data) {
            resolve(data);
        }).fail(function () {
            appendNode('<a style="color:red;">请求失败:' + url + '</a>', 'logger', 'div');
            resolve(null);
        });
    });
}
//返回一个节点或者返回空
function returnNode(node) {
    if (!node)
        return 'null';
    return node;
}
//返回一个数组
function returnList(node) {
    if (Array.isArray(node)) {
        return node;
    }
    node = [node];
    return node;
}
function logUpdate(id, value) {
    let temp = document.getElementById(id);
    if (temp) {
        document.getElementById(id).innerHTML = temp.innerHTML * 1 + value;
    }
}

function getCookie(key) {
    let name = key + '=';
    let iArray = document.cookie.split(';');
    for (let i = 0; i < iArray.length; i++) {
        let c = iArray[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return '';
}

function setCookie(key, value, limit) {
    let d = new Date();
    d.setTime(d.getTime() + (limit * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toGMTString();
    document.cookie = key + '=' + value + '; ' + expires;
}

function getStorage(key) {
    return localStorage.getItem(key);
}

function setStorage(key, value) {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
}

function hideNode(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id + 'Shower').innerHTML = '&lt;';
}

function showNode(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id + 'Shower').innerHTML = '&gt;';
}

function toggleNode(id) {
    let classList = document.getElementById(id).classList;
    if (classList.contains('hidden')) {
        showNode(id);
    } else {
        hideNode(id);
    }
}

function toggleID() {
    let styleRuby = getStyleSheet('ruby');
    let checkbox = document.getElementById('showID');
    if (checkbox.checked) {
        styleRuby.disabled = true;
        checkbox.checked = true;
    } else {
        styleRuby.disabled = false;
        checkbox.checked = false;
    }
}

function appendNode(text, father, type) {
    let node = document.createElement(type);
    node.innerHTML = text;
    if (!document.getElementById(father)) return;
    document.getElementById(father).appendChild(node);
}

function getRuby(lower, upper) {
    if ((!lower) || (lower == '无描述')) {
        return upper;
    }
    if (lower.substring(0, 4) == '<del>') {
        return lower;
    }
    if (lower.substring(0, 4) == '未找到:') {
        return lower;
    }
    return ('<ruby>' + lower + '<rt>-' + upper + '-</rt></ruby>');
}

function getSpan(lower, upper, align) {
    let oString = '<span style="display: inline-flex;flex-direction:column-reverse;">';
    oString = oString + '<small style="line-height: 0.75em;text-align:' + align + ';">&nbsp;' + (!lower ? '' : lower) + '&nbsp;</small>';
    oString = oString + '<small style="line-height: 0.25em;text-align:' + align + ';visibility:hidden;">-</small>';
    oString = oString + '<small style="line-height: 0.75em;text-align:' + align + ';">&nbsp;' + (!upper ? '' : upper) + '&nbsp;</small>';
    oString = oString + '</span>';
    return oString;
}

function getStyleSheet(name) {
    let styleList = document.styleSheets;
    for (i in styleList) {
        if (styleList[i].title == 'ruby') {
            return styleList[i];
        }
    }
}