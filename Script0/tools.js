
//返回一个数组
function returnList(node) {
    if (Array.isArray(node)) {
        return node;
    }
    node = [node];
    return node;
}
//更新log
function logUpdate(id, value) {
    let temp = document.getElementById(id);
    if (temp) {
        document.getElementById(id).innerHTML = temp.innerHTML * 1 + value;
    }
}
//获取cookie
function getCookie(key) {
    let name = key + '=';
    let iArray = document.cookie.split(';');
    for (let i = 0; i < iArray.length; i++) {
        let c = iArray[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return '';
}
//设置cookie
function setCookie(key, value, limit) {
    let d = new Date();
    d.setTime(d.getTime() + (limit * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toGMTString();
    document.cookie = key + '=' + value + '; ' + expires;
}
//获取存储对象
function getStorage(key) {
    return localStorage.getItem(key);
}
//设置存储对象
function setStorage(key, value) {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
}
//隐藏/显示/切换元素显示
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
//开启/关闭保护页面
function enableProtect() {
    document.getElementById('protectbox').classList.remove('hidden');

}
function disableProtect() {
    document.getElementById('protectbox').classList.add('hidden');
}
//切换限高
function toggleMaxHeight(node) {
    let classList = node.classList;
    if (classList.contains('maxHeight')) {
        classList.remove('maxHeight');
    } else {
        classList.add('maxHeight');
    }
}
//获取/追加/设置/清除元素值
function getValue(id) {
    let textArray = returnList(document.getElementById(id).value.replaceAll('\r', '\n').split("\n"));
    return textArray.filter(notEmpty);
}

function addValue(id, text) {
    let textArray = [document.getElementById(id).value, text];
    document.getElementById(id).value = textArray.join('\n');
}

function setValue(id, text) {
    document.getElementById(id).value = text;
}

function clearValue(id) {
    document.getElementById(id).value = '';
}
//插入元素
function appendNode(text, father, type) {
    let node = document.createElement(type);
    node.innerHTML = text;
    if (!document.getElementById(father)) return;
    document.getElementById(father).appendChild(node);
}
//清除元素
function clearNode(father) {
    document.getElementById(father).innerHTML = '';
}
//复制元素
function copy(node) {
    node.select();
    navigator.clipboard.writeText(node.value);
    alert("复制成功");
}
//生成注释
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
//生成上下限显示
function getSpan(lower, upper, align) {
    let oString = '<span style="display: inline-flex;flex-direction:column-reverse;">';
    oString = oString + '<small style="line-height: 0.75em;text-align:' + align + ';">&nbsp;' + (!lower ? '' : lower) + '&nbsp;</small>';
    oString = oString + '<small style="line-height: 0.25em;text-align:' + align + ';visibility:hidden;">-</small>';
    oString = oString + '<small style="line-height: 0.75em;text-align:' + align + ';">&nbsp;' + (!upper ? '' : upper) + '&nbsp;</small>';
    oString = oString + '</span>';
    return oString;
}
//获取样式表
function getStyleSheet(name) {
    let styleList = document.styleSheets;
    for (let i in styleList) {
        if (styleList[i].title == name) {
            return styleList[i];
        }
    }
}
//判断非空
function notEmpty(value) {
    switch (value) {
        case undefined:
            return false;
        case '':
            return false;
        case null:
            return false;
        case false:
            return false;
        default:
            return true;
    }
}

//切换显示ID
function toggleID() {
    let styleSheet = getStyleSheet('ruby');
    let checkbox = document.getElementById('showID');
    if (checkbox.checked) {
        styleSheet.disabled = true;
        checkbox.checked = true;
    } else {
        styleSheet.disabled = false;
        checkbox.checked = false;
    }
}
//切换行号限制
function changeMaxHeight() {
    let styleSheet = getStyleSheet('maxHeight');
    let checkbox = document.getElementById('enableMaxHeight');
    if (checkbox.checked) {
        styleSheet.disabled = false;
        checkbox.checked = true;
    } else {
        styleSheet.disabled = true;
        checkbox.checked = false;
    }
}