//返回字符串
async function getString(textID, targetID) {
    if (textID) {
        //textID不为空,
        let iData = await getData('string', textID);
        let oData;
        if (iData) {
            oData = iData.value['#text'];
        } else {
            oData = '<del>' + textID + '</del>';
        }
        if (targetID) {
            //targetID不为空:'<ruby>' + iData.value['#text'] + '<rt>' + targetID + '<rt>' + '</ruby>';
            oData = '<ruby>' + oData + '<rt>' + targetID + '</rt></ruby>';
        }
        //targetID为空:iData.value['#text']
        return oData;
    } else {
        //textID为空,targetID为空:'null'
        //textID为空,targetID不为空:targetID
        return ((targetID) ? targetID : 'null');
    }
}
async function getCString(textID) {
    if (textID) {
        //textID不为空,
        //targetID为空:iData.value['#text']
        //targetID不为空:'<ruby>' + iData.value['#text'] + '<rt>' + targetID + '<rt>' + '</ruby>';
        let iData = await getData('string', 'cString' + textID, 'symbol');
        let oData;
        if (iData) {
            oData = '<ruby>' + iData.value['#text'] + '<rt>' + textID + '</rt></ruby>';
        } else {
            oData = textID;
        }
        return oData;
    } else {
        //textID为空:'null'
        return 'null';
    }
}
//返回科技
async function getTech(id) {
    if (!id) {
        return { 'displayname': '空', 'rollovertext': '空', '@name': 'null' };
    }
    let oData = await getData('techtree', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', 'rollovertext': '找不到该科技', '@name': id };
    return oData;
}
//返回单位
async function getProto(id) {
    if (!id) {
        return { 'displayname': '空', 'rollovertext': '空', '@name': 'null' };
    }
    let oData = await getData('proto', id.toLowerCase());
    if (!oData) oData = { 'displayname': '<del>' + id + '</del>', 'rollovertext': '找不到该单位', '@name': id };
    return oData;
}