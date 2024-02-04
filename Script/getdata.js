//返回字符串
async function getString(textID, targetID) {
    if (textID) {
        //textID不为空,
        let iData = await getData('string', textID);
        if (iData) {
            return iData['#text'];
        } else {
            return ('未找到:' + textID);
        }
    } else {
        //textID为空,targetID为空:'空',targetID不为空:targetID
        return ((targetID) ? ('无描述') : '空');
    }
}
async function getCString(cString) {
    if (cString) {
        //textID不为空,
        //targetID不为空:'<ruby>' + iData['#text'] + '<rt>' + targetID + '<rt>' + '</ruby>';
        let iString = cString.toLowerCase().replace('abstractname', '').replace('abstract', '').replace('logicaltypepickable', '').replace('logicaltype', '');
        if (cString.toLowerCase() == 'ship') {
            iString = 'ships';
        }
        if (cString.toLowerCase() == 'resource') {
            iString = 'resources';
        }
        let iArray = [
            iString,
            'cstringabstractname' + iString,//unittype:Herdable → cStringAbstractNameHerdable
            'cstringabstract' + iString,//unittype:AbstractCaprine → cStringAbstractCaprine
            'cstring' + iString,//unittype:AbstractAbusGun → cStringAbusGun
            'cstring' + iString.replace('specificeffect', 'effectspecific'),
            'cstring' + iString.replace('increase', 'change').replace('decrease', 'change'),
            'cstring' + iString.replace('maximum', 'max').replace('minimum', 'min')
        ];
        let iData;
        for (let i in iArray) {
            iData = await getData('string', iArray[i], 'symbol');
            if (iData) break;
        }
        if (iData) {
            //targetID为空:iData['#text']
            return iData['#text'];
        } else {
            return ('无描述');
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
//返回技能
async function getPower(id) {
    if (!id) {
        return { 'displayname': '空', 'rollovertext': '空', '@name': 'null', 'isNull': true };
    }
    let oData = await getData('power', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', 'rollovertext': '找不到该技能', '@name': id, 'isNull': true };
    return oData;
}
//返回命令
async function getCommand(id) {
    if (!id) {
        return { 'displayname': '空', 'rollovertext': '空', 'name': 'null', 'isNull': true };
    }
    let oData = await getData('command', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', 'rollovertext': '找不到该命令', 'name': id, 'isNull': true };
    return oData;
}
//返回操作
async function getAction(id) {
    if (!id) {
        return { 'displayname': '空', 'name': { '#text': 'null' }, 'isNull': true };
    }
    let oData = await getData('action', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', 'name': { '#text': id }, 'isNull': true };
    return oData;
}
//返回操作
async function getTactic(id) {
    if (!id) {
        return { 'displayname': '空', '#text': 'null', 'isNull': true };
    }
    let oData = await getData('tactic', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', '#text': id, 'isNull': true };
    return oData;
}