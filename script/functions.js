function getInnerHTML() {
    return returnList(document.getElementById('input').value.replace('\t', '\n').split("\n"));
}

function setOuterHTML(text) {
    document.getElementById('output').value = text;
}

function resetInfo() {
    document.getElementById('info').innerHTML = '';
}

function help() {
    alert('暂无帮助');
    /*BigNumber
    +:plus
    -:minus
    *:times
    /:div
    |:idiv
    %:mod
    <:lt
    <=lte
    >:gt
    >=:gte
    ==:eq
    ||:abs
    √:sqrt
    ^:pow
    */
}

function getIcon(iData) {
    let icon = iData.iconwpf;
    if (!icon) {
        icon = iData.icon;
    } else {
        icon = icon + '" height="205" width="135';
    }
    if (!icon) {
        icon = 'resources/images/icons/hp_cp/hp_cp_send_x.png " height="64" width="64';
    } else {
        icon = icon + '" height="64" width="64';
    }
    return ('<td class="icon"><img src="./Data/wpfg/' + icon.replace(/\\/g, '/') + '"></td>');
}

async function getStrings(isAll) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let oArray = [];
    let iArray = await getArray('string', 'all');
    for (let i in iArray) {
        let string = iArray[i];
        let text = string['@_locid'] + '\t' + returnNode(string['@symbol']) + '\t' + returnNode(string['#text']);
        oArray.push(text);
    }
    setOuterHTML(oArray.join('\n'));
}

async function getTechs(isAll, iArray) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let isAction = document.getElementById('getTech').checked;
    if (isAction || isAll) {
        appendNode('<table class="infoTable" id="techTable">', 'databox', 'div');
        appendNode('<th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">效果</th>',
            'techTable', 'tr');
        let iList = [];
        if (isAll) {
            iList = await getArray('tech', 'all');
        } else {
            for (let i in iArray) {
                let iData = iArray[i];
                if (iData == "") continue;
                let oData = await getTech(iData.toLowerCase());
                if (!oData.isNull) {
                    iList.push(oData);
                }
            }
        }
        let oArray = ['调用名\t中文名\t类型\t描述\t效果'];
        for (let i in iList) {
            let oNode, oString, stringEffect;
            if (!iList[i].isNull) {
                stringEffect = await getEffects(iList[i], false);
                oNode = getIcon(iList[i])
                    + '<td>' + iList[i]['@name'] + '</td>'
                    + '<td>' + getRuby(iList[i].displayname, iList[i]['@name']) + '</td>'
                    + '<td>科技</td>'
                    + '<td>' + iList[i].rollovertext + '</td>'
                    + '<td class="effect">' + stringEffect + '</td>';
                appendNode(oNode, 'info', 'tr');
                oString = iList[i]['@name'] + '\t'
                    + (iList[i].displayname ? iList[i].displayname : iList[i]['@name']) + '\t'
                    + '科技' + '\t'
                    + iList[i].rollovertext + '\t'
                    + stringEffect.replace(/<ruby>(.*?)<rt>.*?<\/ruby>/g, '$1').replaceAll('</br>', '↩️').replaceAll('&nbsp;', ' ').replace(/<.*?>/g, '');
                oArray.push(oString);
            }
        }
        return oArray.join('\n');
    }
    return '';
}

async function getProtos(isAll, iArray) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let isAction = document.getElementById('getProto').checked;
    if (isAction || isAll) {
        appendNode('<table class="infoTable" id="techTable">', 'databox', 'div');
        appendNode('<th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">数据</th>',
            'techTable', 'tr');
        let iList = [];
        if (isAll) {
            iList = await getArray('proto', 'all');
        } else {
            for (let i in iArray) {
                let iData = iArray[i];
                if (iData == "") continue;
                let oData = await getNugget(iData.toLowerCase());
                if (!oData.isNull) {
                    iList.push(oData);
                }
            }
        }
        let oArray = ['调用名\t中文名\t类型\t描述\t数据'];
        for (let i in iList) {
            let oNode, oString, stringAttribute;
            if (!iList[i].isNull) {
                stringAttribute = await getAttribute(iList[i], false);
                oNode = getIcon(iList[i])
                    + '<td>' + iList[i]['@name'] + '</td>'
                    + '<td>' + getRuby(iList[i].displayname, iList[i]['@name']) + '</td>'
                    + '<td>科技</td>'
                    + '<td>' + iList[i].rollovertext + '</td>'
                    + '<td class="effect">' + stringAttribute + '</td>';
                appendNode(oNode, 'info', 'tr');
                oString = iList[i]['@name'] + '\t'
                    + (iList[i].displayname ? iList[i].displayname : iList[i]['@name']) + '\t'
                    + '科技' + '\t'
                    + iList[i].rollovertext + '\t'
                    + stringAttribute.replace(/<ruby>(.*?)<rt>.*?<\/ruby>/g, '$1').replaceAll('</br>', '↩️').replaceAll('&nbsp;', ' ').replace(/<.*?>/g, '');
                oArray.push(oString);
            }
        }
        return oArray.join('\n');
    }
    return '';
}

async function getNuggets() {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    resetInfo();
    let oArray = [];
    appendNode('<th class="name">调用名</th><th class="local">地图列表</th><th class="type">难度</th><th class="desc">描述</th><th>效果</th>',
        'info', 'tr');
    let iArray = await getArray('nugget', 'all');
    for (i in iArray) {
        let iData = iArray[i];
        let text = iData.name + '\t\t' + iData.difficulty + '\t' + iData.rolloverstring;
        oArray.push(text);
        oString = '<td>' + iData.name + '</td>';
        oString = oString + '<td>';
        let maptypes = returnList(iData.maptype);
        for (j in maptypes) {
            oString = oString + maptypes[j] + '<br>';
        }
        oString = oString + '</td>';
        oString = oString + '<td>' + iData.difficulty + '</td>';
        oString = oString + '<td>' + iData.rolloverstring + '</td>';
        //let effect = await getEffect(iData, iData.name);
        oString = oString + '<td><div class="effect">' + /*effect +*/ '</div></td>';
        appendNode(oString, 'info', 'tr');
    }
    setOuterHTML(oArray.join('\n'));
}

async function getUnitTypes(isAll) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let oArray = [];
    let iArray = await getArray('unittype', 'all');
    for (let i in iArray) {
        let iData = iArray[i];
        let text = iData.name + '\t' + iData.displayname + '\t' + iData.list.join(',');
        oArray.push(text);
    }
    setOuterHTML(oArray.join('\n'));
}

async function getInfo() {
    resetInfo();
    iArray = getInnerHTML();
    //
    oString = getTechs(isAll, iArray) + '\n'
        + getProtos(isAll, iArray) + '\n'
        + getNuggets(isAll, iArray) + '\n'
        //
        + getUnitTypes(isAll, iArray) + '\n';
}

async function searchInfo(isFuzzy) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    resetInfo();
    appendNode('<th class="icon">查询字段</th><th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th>效果</th>',
        'info', 'tr');
    let iArray = getInnerHTML();
    for (let i in iArray) {
        let protoArray = await getArray('proto', iArray[i], 'local', isFuzzy);
        let techArray = await getArray('techtree', iArray[i], 'local', isFuzzy);
        let headString = '<td rowSpan="' + (protoArray.length + techArray.length) + '">' + iArray[i] + '</td>';
        for (let j in protoArray) {
            let oData = protoArray[j];
            let oString = headString;
            headString = '';
            oString = oString + getIcon(oData);
            oString = oString + '<td>' + oData['@name'] + '</td>';
            oString = oString + '<td>' + getRuby(oData.displayname, oData['@name']) + '</td>';
            oString = oString + '<td>单位</td>';
            oString = oString + '<td>' + oData.rollovertext + '</td>';
            oString = oString + '<td><div class="effect">' + '</div></td>';
            appendNode(oString, 'info', 'tr');
        }
        for (let j in techArray) {
            let oData = techArray[j];
            let oString = headString;
            headString = '';
            oString = oString + getIcon(oData);
            oString = oString + '<td>' + oData['@name'] + '</td>';
            oString = oString + '<td>' + getRuby(oData.displayname, oData['@name']) + '</td>';
            oString = oString + '<td>科技</td>';
            oString = oString + '<td>' + oData.rollovertext + '</td>';
            oString = oString + '<td><div class="effect">' + '</div></td>';
            appendNode(oString, 'info', 'tr');
        }
    }
}

async function getTree() {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    resetInfo();
    let oArray = [];
    appendNode('<th class="name">调用名</th><th class="local">中文名</th><th class="name">大小</th><th class="local">资源总量</th><th>描述</th>', 'info', 'tr');
    let iArray = await getData('unittype', 'tree');
    if (iArray) {
        iArray = iArray.list;
    } else {
        return;
    }
    for (let i in iArray) {
        let unit = await getData('proto', iArray[i].toLowerCase());
        if (!unit) {
            continue;
        }
        let text = unit['@name'] + '\t' + unit.initialresource['#text'];
        oArray.push(text);
        let oData = '<td>' + unit['@name'] + '</td>';
        oData = oData + '<td>' + getRuby(unit.displayname, unit['@name']) + '</td>';
        oData = oData + '<td>' + unit.obstructionradiusx + '*' + unit.obstructionradiusz + '</td>';
        oData = oData + '<td>' + unit.initialresource['#text'] + '</td>';
        oData = oData + '<td>' + unit.rollovertext + '</td>';
        appendNode(oData, 'info', 'tr');
    }
    setOuterHTML(oArray.join('\n'));
}

async function getShrine() {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    resetInfo();
    let oArray = [];
    appendNode('<th class="name">调用名</th><th class="local">中文名</th><th class="type">种类</th><th class="name">生产效率</th><th>描述</th>', 'info', 'tr');
    let iArray = await getArray('proto', 'all');
    for (i in iArray) {
        let unit = iArray[i];
        if (!unit.protoaction) {
            continue;
        }
        let protoactions = returnList(unit.protoaction);
        for (j in protoactions) {
            let protoaction = protoactions[j];
            if (protoaction.name == 'ShrineGather') {
                let text = returnNode(unit['@name']) + '\t' + returnNode(protoaction.rate['#text']);
                oArray.push(text);
                let oData = '<td>' + returnNode(unit['@name']) + '</td>';
                oData = oData + '<td>' + getRuby(unit.displayname, unit['@name']) + '</td>';
                let unittypes = returnList(returnNode(unit.unittype));
                let utype = '';
                if (unittypes.includes('Herdable')) {
                    utype = utype + '养殖';
                } else if (unittypes.includes('Huntable')) {
                    utype = utype + '捕猎';
                }
                oData = oData + '<td>' + utype + '</td>';
                oData = oData + '<td>' + returnNode(protoaction.rate['#text']) + '</td>';
                oData = oData + '<td>' + unit.rollovertext + '</td>';
                appendNode(oData, 'info', 'tr');
                break;
            }
        }
    }
    setOuterHTML(oArray.join('\n'));
}

async function getCards() {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let oArray = [];
    let iArray = await getData('techflag', 'homecity');
    if (iArray) {
        iArray = iArray.list;
    } else {
        return;
    }
    for (i in iArray) {
        let tech = await getData('techtree', iArray[i].toLowerCase());
        if (!tech) {
            return;
        }
        let text = tech['@name'] + '\t' + tech.displayname + '\t' + tech.rollovertext;
        oArray.push(text.replace(/<ruby>/g, '').replace(/<\/ruby>/g, '').replace(/<rt>.*?<\/rt>/g, ''));
    }
    setOuterHTML(oArray.join('\n'));
}

async function getNative() {
    resetInfo();
    let oArray = [];
    appendNode('<th class="name">调用名</th><th class="name">中文名</th><th class="local">名称</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">属性</th>', 'info', 'tr');
    let iArray = await getArray('civ', 'all');
    for (i in iArray) {
        let civ = iArray[i];
        if (!civ.agetech) continue;
        if (returnNode(civ.agetech.tech).indexOf('Native') > -1) {
            let tech = await getTech(civ.agetech.tech);
            if (tech) {
                let text = civ.name + '\t' + civ.displayname;
                oArray.push(text);
                let techeffect = returnList(tech.effects.effect);
                let oData = '<th rowspan="' + techeffect.length + '">' + civ.name + '</th>';
                oData = oData + '<td rowspan="' + techeffect.length + '">' + civ.displayname + '</td>';
                for (j in techeffect) {
                    if (techeffect[j]['@type'] == 'TechStatus') {
                        let target = await getTech(techeffect[j]['#text']);
                        oData = oData + '<td>' + getRuby(target.displayname, target['@name']) + '</td><td>科技</td>';
                        oData = oData + '<td>' + target.rollovertext + '</td>';
                        oData = oData + '<td class="effect"><div>' + getEffects(tempTech.effects, tempTech.displayname) + '</div></td>';
                    }
                    if (techeffect[j]['@type'] == 'Data' && techeffect[j]['@subtype'] == 'Enable') {
                        let target = await getProto(techeffect[j].target['#text']);
                        oData = oData + '<td>' + getRuby(target.displayname, target['@name']) + '</td><td>单位</td>';
                        oData = oData + '<td>' + target.rollovertext + '</td>';
                        oData = oData + '<td class="effect"><div>' + '</div></td>';
                    }
                    appendNode(oData, 'info', 'tr');
                    oData = '';
                }
            }
        }
    }
    setOuterHTML(oArray.join('\n'));
}
/*
function getCivCards() {
    let txt = '';
    for (i in homecitys) {
        let homecity = homecitys[i];
        let cards = homecity.cards.card;
        for (j in cards) {
            let card = cards[j];
            let temp = homecity.civ + ((card.revoltcard == '') ? '[R]' : '');
            if (!(!)) {
                temp = temp + '[R]';
            }
            temp = temp + '\t' + card.name + '\t' + returnNode(card.maxcount) + '\t' + returnNode(card.age) + '\n';
            txt = txt + temp;
        }
    }
    document.getElementById('output').value = txt;
}
*/