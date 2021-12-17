function getXml(url) {
    $.ajaxSetup({ async: false });
    let xml;
    let json;
    let x2js = new X2JS();
    $.get(url, function (data) { xml = data }, 'xml');
    /*if (xml === undefined) {
        $.get(url.replace('.xml', ''), function (data) { xml = data }, 'xml');
    }*/
    if (xml === undefined) { return xml; }
    json = x2js.xml2json(xml);
    return json;
}

function getJson(url) {
    $.ajaxSetup({ async: false });
    let json;
    $.get(url, function (data) { json = data; }, 'json');
    return json;
}
//返回一个节点或者返回空
function returnNode(node) {
    if (!node)
        return '';
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
//返回string
function getString(id) {
    if (!id)
        return "无名";
    if (!strings[id])
        return "找不到名称";
    return strings[id].__text;
}
//返回string
function getTech(id) {
    if (!id) return id;
    return techs[id.toLowerCase()];
}
//返回string
function getProto(id) {
    if (!id) return id;
    return units[id.toLowerCase()];
}
//小数+
function Add(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
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
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};