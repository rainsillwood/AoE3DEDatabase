function getJson(url) {
    $.ajaxSetup({ async: false });
    let json;
    $.get(url, function (data) { json = data; }, 'json');
    return json;
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
//返回string
function getString(id) {
    if (!id)
        return "没有描述";
    if (!strings[id])
        return "找不到描述" + id;
    return strings[id]['#text'];
}
//返回科技
function getTech(id) {
    if (!id) return { 'displayname': '空', 'rollovertext': '空', '@id': false };
    return (!techs[id.toLowerCase()] ? ({ 'displayname': '找不到此科技', 'rollovertext': '找不到此科技', '@id': false }) : techs[id.toLowerCase()]);
}
//返回单位
function getProto(id) {
    if (!id) return { 'displayname': '空', 'rollovertext': '空', '@id': false };
    return (!units[id.toLowerCase()] ? ({ 'displayname': '找不到该单位', 'rollovertext': '找不到该单位', '@id': false }) : units[id.toLowerCase()]);
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