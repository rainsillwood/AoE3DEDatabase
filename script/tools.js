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
//小数+
function Add(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
}
//小数-
function Sub(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    let precision; // 精度
    try {
        baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
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
    if (lower.substring(0, 3) == '未找到:') {
        return lower;
    }
    return ('<ruby>' + lower + '<rt>-' + upper + '-</rt></ruby>');
}

function getStyleSheet(name) {
    let styleList = document.styleSheets;
    for (i in styleList) {
        if (styleList[i].title == 'ruby') {
            return styleList[i];
        }
    }
}