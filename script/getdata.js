//返回字符串
async function getString(textID, targetID) {
    if (textID) {
        //textID不为空,
        let iData = await getData('string', textID);
        if (iData) {
            return iData['#text'];
        } else {
            return '未找到';
        }
    } else {
        //textID为空,targetID为空:'空',targetID不为空:targetID
        return ((targetID) ? ('无描述') : '空');
    }
}
async function getCString(cString) {
    if (cString) {
        //textID不为空,
        //targetID为空:iData['#text']
        //targetID不为空:'<ruby>' + iData['#text'] + '<rt>' + targetID + '<rt>' + '</ruby>';
        let iData = await getData('string', 'cstringabstractname' + cString.toLowerCase(), 'symbol');
        if (!iData) {
            iData = await getData('string', 'cstring' + cString.toLowerCase().replace('abstract', 'abstractname'), 'symbol');
        }
        if (!iData) {
            iData = await getData('string', 'cstringabstract' + cString.toLowerCase(), 'symbol');
        }
        if (!iData) {
            iData = await getData('string', 'cstring' + cString.toLowerCase(), 'symbol');
        }
        if (!iData) {
            iData = await getData('string', 'cstring' + cString.toLowerCase().replace('abstract', ''), 'symbol');
        }
        if (iData) {
            return iData['#text'];
        } else {
            return '未找到';
        }
    } else {
        //textID为空:'null'
        return '空';
    }
}
//返回科技
async function getTech(id) {
    if (!id) {
        return { 'displayname': '空', 'rollovertext': '空', '@name': 'null', 'isNull': true };
    }
    let oData = await getData('techtree', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', 'rollovertext': '找不到该科技', '@name': id, 'isNull': true };
    return oData;
}
//返回单位
async function getProto(id) {
    if (!id) {
        return { 'displayname': '空', 'rollovertext': '空', '@name': 'null', 'isNull': true };
    }
    let oData = await getData('proto', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', 'rollovertext': '找不到该单位', '@name': id, 'isNull': true };
    return oData;
}
//返回宝藏
async function getNugget(id) {
    if (!id) {
        return { 'rolloverstring': '空', 'applystring': '空', 'name': 'null', 'isNull': true };
    }
    let oData = await getData('nugget', id.toLowerCase());
    if (!oData) oData = { 'rolloverstring': '<del>' + id + '</del>', 'applystring': '找不到该宝藏', 'name': id, 'isNull': true };
    return oData;
}