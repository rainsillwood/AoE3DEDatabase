function help() {
    document.getElementById('helpbox').classList.remove('hidden')
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
//提取图标
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
//
async function getTechs(isAll, iArray) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let isAction = document.getElementById('getTech').checked;
    if (isAction || isAll) {
        let iList = [];
        let tableName = 'tableTech';
        if (isAll) {
            iList = await getArray('techtree', 'all');
            clearValue('output');
            clearNode('databox');
        } else {
            for (let i in iArray) {
                let iData = iArray[i];
                if (iData == "") continue;
                let oData = await getTech(iData.toLowerCase());
                if (!oData.isNull) {
                    iList.push(oData);
                }
            }
            appendNode('<table class="infoTable" id="' + tableName + '">', 'databox', 'div');
            appendNode('<th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">效果</th>', tableName, 'tr');
        }
        if (iList.length == 0) return;
        enableProtect();
        appendNode('正在查询科技: <a id="' + tableName + '_processed">0</a> / <a id="' + tableName + '_quest">0</a> , <a id="' + tableName + '_failed">0</a> Error', 'logger', 'div');
        document.getElementById(tableName + '_quest').innerHTML = iList.length;
        let oArray = ['调用名\t中文名\t类型\t描述\t效果'];
        for (let i in iList) {
            if (!iList[i].isNull) {
                let stringEffect = await getEffects(iList[i], false);
                if (!isAll) {
                    let oNode = getIcon(iList[i])
                        + '<td>' + iList[i]['@name'] + '</td>'
                        + '<td>' + getRuby(iList[i].displayname, iList[i]['@name']) + '</td>'
                        + '<td>科技</td>'
                        + '<td>' + iList[i].rollovertext + '</td>'
                        + '<td class="effect"><div class="maxHeight" ondblclick="toggleMaxHeight(this)">' + stringEffect + '</div></td>';
                    appendNode(oNode, tableName, 'tr');
                }
                let oString = iList[i]['@name'] + '\t'
                    + (iList[i].displayname ? iList[i].displayname : iList[i]['@name']) + '\t'
                    + '科技' + '\t'
                    + iList[i].rollovertext + '\t'
                    + stringEffect.replace(/<ruby>(.*?)<rt>.*?<\/ruby>/g, '$1').replaceAll('</br>', '↩️').replaceAll('&nbsp;', ' ').replace(/<.*?>/g, '') + '\n';
                oArray.push(oString);
                logUpdate(tableName + '_processed', 1);
            } else {
                logUpdate(tableName + '_failed', 1);
                logUpdate(tableName + '_processed', 1);
                console.error('查询失败:' + iList[i]['@name']);
            }
        }
        setValue('output', oArray.join('\n'));
        disableProtect();
    }
}

async function getProtos(isAll, iArray) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let isAction = document.getElementById('getProto').checked;
    if (isAction || isAll) {
        let iList = [];
        let tableName = 'tableProto';
        if (isAll) {
            iList = await getArray('proto', 'all');
            clearValue('output');
            clearNode('databox');
        } else {
            for (let i in iArray) {
                let iData = iArray[i];
                if (iData == "") continue;
                let oData = await getProto(iData.toLowerCase());
                if (!oData.isNull) {
                    iList.push(oData);
                }
            }
            appendNode('<table class="infoTable" id="' + tableName + '">', 'databox', 'div');
            appendNode('<th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">属性</th>', tableName, 'tr');
        }
        if (iList.length == 0) return;
        enableProtect();
        showNode('logger');
        appendNode('正在查询单位: <a id="' + tableName + '_processed">0</a> / <a id="' + tableName + '_quest">0</a> , <a id="' + tableName + '_failed">0</a> Error', 'logger', 'div');
        document.getElementById(tableName + '_quest').innerHTML = iList.length;
        let oArray = ['调用名\t中文名\t类型\t描述\t属性'];
        for (let i in iList) {
            if (!iList[i].isNull) {
                let stringAttribute = await getAttribute(iList[i], false);
                if (!isAll) {
                    let oNode = getIcon(iList[i])
                        + '<td>' + iList[i]['@name'] + '</td>'
                        + '<td>' + getRuby(iList[i].displayname, iList[i]['@name']) + '</td>'
                        + '<td>单位</td>'
                        + '<td>' + iList[i].rollovertext + '</td>'
                        + '<td class="effect"><div class="maxHeight" ondblclick="toggleMaxHeight(this)">' + stringAttribute + '</div></td>';
                    appendNode(oNode, tableName, 'tr');
                }
                let oString = iList[i]['@name'] + '\t'
                    + (iList[i].displayname ? iList[i].displayname : iList[i]['@name']) + '\t'
                    + '单位' + '\t'
                    + iList[i].rollovertext + '\t'
                    + stringAttribute.replace(/<ruby>(.*?)<rt>.*?<\/ruby>/g, '$1').replaceAll('</br>', '↩️').replaceAll('&nbsp;', ' ').replace(/<.*?>/g, '') + '\n';
                oArray.push(oString);
                logUpdate(tableName + '_processed', 1);
            } else {
                logUpdate(tableName + '_failed', 1);
                logUpdate(tableName + '_processed', 1);
                console.error('查询失败:' + iList[i]['@name']);
            }
        }
        setValue('output', oArray.join('\n'));
        disableProtect();
    }
}

async function getNuggets(isAll, iArray) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let isAction = document.getElementById('getNugget').checked;
    if (isAction || isAll) {
        let iList = [];
        let tableName = 'tableNugget';
        if (isAll) {
            iList = await getArray('nugget', 'all');
            clearValue('output');
            clearNode('databox');
        } else {
            for (let i in iArray) {
                let iData = iArray[i];
                if (iData == "") continue;
                let oData = await getNugget(iData.toLowerCase());
                if (!oData.isNull) {
                    iList.push(oData);
                }
            }
            appendNode('<table class="infoTable" id="' + tableName + '">', 'databox', 'div');
            appendNode('<th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">效果</th>', tableName, 'tr');
        }
        if (iList.length == 0) return;
        enableProtect();
        showNode('logger');
        appendNode('正在查询宝藏: <a id="' + tableName + '_processed">0</a> / <a id="' + tableName + '_quest">0</a> , <a id="' + tableName + '_failed">0</a> Error', 'logger', 'div');
        document.getElementById(tableName + '_quest').innerHTML = iList.length;
        let oArray = ['调用名\t中文名\t类型\t描述\t效果'];
        for (let i in iList) {
            if (!iList[i].isNull) {
                let nuggetUint = await getProto(iList[i].nuggetunit);
                let stringEffects = await getEffects(iList[i], true);
                if (!isAll) {
                    let oNode = getIcon(iList[i])
                        + '<td>' + iList[i].name + '</td>'
                        + '<td>' + getRuby(nuggetUint.displayname, nuggetUint['@name']) + '</td>'
                        + '<td>宝藏</td>'
                        + '<td>' + iList[i].rolloverstring + '</td>'
                        + '<td class="effect"><div class="maxHeight" ondblclick="toggleMaxHeight(this)">' + stringEffects + '</div></td>';
                    appendNode(oNode, tableName, 'tr');
                }
                let oString = iList[i].name + '\t'
                    + (nuggetUint.displayname ? nuggetUint.displayname : nuggetUint['@name']) + '\t'
                    + '宝藏' + '\t'
                    + iList[i].rolloverstring + '\t'
                    + stringEffects.replace(/<ruby>(.*?)<rt>.*?<\/ruby>/g, '$1').replaceAll('</br>', '↩️').replaceAll('&nbsp;', ' ').replace(/<.*?>/g, '') + '\n';
                oArray.push(oString);
                logUpdate(tableName + '_processed', 1);
            } else {
                logUpdate(tableName + '_failed', 1);
                logUpdate(tableName + '_processed', 1);
                console.error('查询失败:' + iList[i].name);
            }
        }
        setValue('output', oArray.join('\n'));
        disableProtect();
    }
}
//提取文本
async function getStrings() {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    clearValue('output');
    clearNode('databox');
    enableProtect();
    showNode('logger');
    let tableName = 'tableString';
    let iList = await getArray('string', 'all');
    appendNode('正在查询语言: <a id="' + tableName + '_processed">0</a> / <a id="' + tableName + '_quest">0</a> , <a id="' + tableName + '_failed">0</a> Error', 'logger', 'div');
    document.getElementById(tableName + '_quest').innerHTML = iList.length;
    let oArray = ['ID\tCString\tValue'];
    for (let i in iList) {
        let x = await getData('unkown', 'unkown');
        let oData = iList[i];
        let oString = oData['@_locid'] + '\t' + returnNode(oData['@symbol']) + '\t' + returnNode(oData['#text']);
        oArray.push(oString);
        logUpdate(tableName + '_processed', 1);
    }
    setValue('output', oArray.join('\n'));
    disableProtect();
}

async function getUnitTypes(isAll, iArray) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    let isAction = document.getElementById('getUnitType').checked;
    if (isAction || isAll) {
        let iList1, iList2 = [];
        let tableName = 'tableUnitType';
        if (isAll) {
            iList1 = await getArray('unittype', 'all');
            clearValue('output');
            clearNode('databox');
        } else {
            for (let i in iArray) {
                let iData = iArray[i];
                if (iData == "") continue;
                let oData = await getData(iData.toLowerCase());
                if (!oData.isNull) {
                    iList1.push(oData);
                }
            }
            appendNode('<table class="infoTable" id="' + tableName + '">', 'databox', 'div');
            appendNode('<th class="name">调用名</th><th class="local">中文名</th><th class="effect">单位</th><th class="effect">科技</th>', tableName, 'tr');
        }
        if (iList1.length == 0) return;
        enableProtect();
        showNode('logger');
        appendNode('正在查询单位类型: <a id="' + tableName + '_processed">0</a> / <a id="' + tableName + '_quest">0</a> , <a id="' + tableName + '_failed">0</a> Error', 'logger', 'div');
        document.getElementById(tableName + '_quest').innerHTML = iList1.length;
        let oArray = ['调用名\t中文名\t单位\t科技'];
        for (let i in iList1) {
            if (!iList1[i].isNull) {
                let nuggetUint = await getProto(iList1[i].nuggetunit);
                let stringEffects = await getEffects(iList1[i], true);
                if (!isAll) {
                    let oNode = getIcon(iList1[i])
                        + '<td>' + iList1[i].name + '</td>'
                        + '<td>' + getRuby(nuggetUint.displayname, nuggetUint['@name']) + '</td>'
                        + '<td>宝藏</td>'
                        + '<td>' + iList1[i].rolloverstring + '</td>'
                        + '<td class="effect"><div class="maxHeight" ondblclick="toggleMaxHeight(this)">' + stringEffects + '</div></td>';
                    appendNode(oNode, tableName, 'tr');
                }
                let oString = iList1[i].name + '\t'
                    + (nuggetUint.displayname ? nuggetUint.displayname : nuggetUint['@name']) + '\t'
                    + '宝藏' + '\t'
                    + iList1[i].rolloverstring + '\t'
                    + stringEffects.replace(/<ruby>(.*?)<rt>.*?<\/ruby>/g, '$1').replaceAll('</br>', '↩️').replaceAll('&nbsp;', ' ').replace(/<.*?>/g, '') + '\n';
                oArray.push(oString);
                logUpdate(tableName + '_processed', 1);
            } else {
                logUpdate(tableName + '_failed', 1);
                logUpdate(tableName + '_processed', 1);
                console.error('查询失败:' + iList1[i].name);
            }
        }
        setValue('output', oArray.join('\n'));
        disableProtect();
    }
    for (let i in iArray) {
        let iData = iArray[i];
        let text = iData.name + '\t' + iData.displayname + '\t' + iData.list.join(',');
        oArray.push(text);
    }
    setOuterHTML(oArray.join('\n'));
}

async function getInfo() {
    clearValue('output');
    clearNode('databox');
    let iArray = getValue('input');
    await getTechs(false, iArray);
    await getProtos(false, iArray);
    await getNuggets(false, iArray);
}

async function searchInfo(isFuzzy) {
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
        return;
    }
    resetInfo();
    appendNode('<th class="icon">查询字段</th><th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th>效果</th>',
        'info', 'tr');
    let iArray = getInnerHTML('input');
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
