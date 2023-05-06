function getInnerHTML() {
    return returnList(document.getElementById('input').value.replace('\t', '\n').split("\n"));
}

function setOuterHTML(text) {
    document.getElementById('output').value = text;
}

function resetInfo() {
    document.getElementById('info').innerHTML = '';
}
async function getTechs() {
    let oArray = [];
    let iArray = await getArray('techtree', 'all');
    for (let i in iArray) {
        let tech = iArray[i];
        let text = tech['@name'] + '\t' + tech.dbid + '\t' + returnNode(tech.displayname) + '\t' + returnNode(tech.rollovertext);
        /*let effects;
        if (!(!tech.effects)) {
            effects = returnList(tech.effects.effect);
        }
        for (let j in effects) {
            let effect = await getEffect(effects[j]);
            txt = txt + effect + '|';
        }*/
        oArray.push(text.replace(/<ruby>/g, '').replace(/<\/ruby>/g, '').replace(/<rt>.*?<\/rt>/g, ''));
    }
    setOuterHTML(oArray.join('\n'));
}

async function getProtos() {
    let oArray = [];
    let iArray = await getArray('proto', 'all');
    for (let i in iArray) {
        let unit = iArray[i];
        let text = unit['@name'] + '\t' + unit['@id'] + '\t' + returnNode(unit.displayname) + '\t' + returnNode(unit.rollovertext);
        oArray.push(text.replace(/<ruby>/g, '').replace(/<\/ruby>/g, '').replace(/<rt>.*?<\/rt>/g, ''));
    }
    setOuterHTML(oArray.join('\n'));
}

async function getStrings() {
    let oArray = [];
    let iArray = await getArray('string', 'all');
    for (let i in iArray) {
        let string = iArray[i];
        let text = string['@_locid'] + '\t' + returnNode(string['@symbol']) + '\t' + returnNode(string['#text']);
        oArray.push(text);
    }
    setOuterHTML(oArray.join('\n'));
}

async function getCards() {
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
async function getShrine() {
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
                oData = oData + '<td>' + unit.displayname + '</td>';
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

async function getTree() {
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
        oData = oData + '<td>' + unit.displayname + '</td>';
        oData = oData + '<td>' + unit.obstructionradiusx + '*' + unit.obstructionradiusz + '</td>';
        oData = oData + '<td>' + unit.initialresource['#text'] + '</td>';
        oData = oData + '<td>' + unit.rollovertext + '</td>';
        appendNode(oData, 'info', 'tr');
    }
    setOuterHTML(oArray.join('\n'));
}

async function getNative() {
    resetInfo();
    let oArray = [];
    appendNode('<th class="name">调用名</th><th class="local">中文名</th><th class="local">名称</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">属性</th>', 'info', 'tr');
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
                        let tempTech = await getTech(techeffect[j]['#text']);
                        oData = oData + '<td>' + tempTech.displayname + '</td><td>科技</td>';
                        oData = oData + '<td>' + tempTech.rollovertext + '</td>';
                        oData = oData + '<td class="effect"><div>' /*+getEffects(tempTech.effects, tempTech.displayname)*/ + '</div></td>';
                    }
                    if (techeffect[j]['@type'] == 'Data' && techeffect[j]['@subtype'] == 'Enable') {
                        let target = await getProto(techeffect[j].target['#text']);
                        oData = oData + '<td>' + target.displayname + '</td><td>单位</td>';
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

function getNuggetTech() {
    appendNode('<th>调用名</th><th>地图</th><th>难度</th><th>描述</th><th>效果</th>', 'info', 'tr');
    for (i in nuggets) {
        let nugget = nuggets[i];
        if ('AdjustHP|GiveTech|AdjustSpeed'.indexOf(nugget.type) > -1) {
            info = info + '<tr><td>' + nugget.name + '</td>';
            info = info + '<td>';
            let maptypes = returnList(nugget.maptype);
            for (j in maptypes) {
                info = info + maptypes[j] + '<br>';
            }
            info = info + '</td>';
            info = info + '<td>' + nugget.difficulty + '</td>';
            info = info + '<td>' + nugget.rolloverstring + '</td>';
            info = info + '<td>' + nugget.applystring + '</td></tr>';
        }
    }
    document.getElementById('info').innerHTML = info;
}

function getLocal() {
    appendNode('<th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">效果</th>', 'info', 'tr');
    let iArray = getInnerHTML();
    for (i in iArray) {
        let iData = iArray[i];
        if (iData == "") continue;
        let oString = '<td class="icon">%picture%</td>';
        oString = oString + '<td class="name">' + iData + '</td>';
        let oData = getTech(iData.toLowerCase());
        if (oData) {
            oString = oString + '<td>' + oData.displayname + '</td>';
            oString = oString.replace('%picture%', '<img src="./Data/wpfg/' + returnNode(oData.icon).replace(/\\/g, '\/') + '" height="128" width="128">');
            oString = oString + '<td>科技</td>';
            oString = oString + '<td>' + oData.rollovertext + '</td><td><div class="effect">';
            oString = oString + getEffects(oData.effects, oData.displayname);
            oString = oString + '</div></td>';
        } else {
            if (oData) {
                oData = getProto(iData.toLowerCase());
                oString = oString + '<td>' + strings[oData.displaynameid] + '</td>';
                oString = oString.replace('%picture%', '<img src="./Data/wpfg/' + oData.icon.replace(/\\/g, '\/') + '">');
                oString = oString + '<td>单位</td>';
                oString = oString + '<td>' + strings[oData.rollovertextid] + '</td>';
                oString = oString + '<td>' + '</td>';
            } else {

            }
        }
        for (j in nuggets) {
            let temp = nuggets[j];
            if (temp.name.toLowerCase() == iData.toLowerCase()) {
                oString = oString + '<td>' + strings[temp.rolloverstringid]['#text'] + '</td>';
                oString = oString + '<td>宝藏</td>';
                /*.replace(/%2s/, tString[temp.resource] ? tString[temp.resource] : temp.resource).replace(/%1d/, temp.amount)*/
                ;
                oString = oString + '<td>' + strings[temp.applystringid]['#text'] + '</td>';
            }
        }
        appendNode(oString, 'info', 'tr');
    }
    document.getElementById('info').innerHTML = info;
}

function getName() {
    let info = '<tr><th>中文名</th><th>调用名</th></tr>';
    let values = getInnerHTML();
    let tempList = [];
    for (i in techs) {
        let temp = {};
        temp.name = techs[i]['@name'];
        temp.displayname = techs[i].displayname;
        temp.rollovertext = techs[i].rollovertext;
        temp.type = '科技'
        tempList.push(temp);
    }
    for (i in units) {
        let temp = {};
        temp.name = units[i]['@name'];
        temp.displayname = units[i].displayname;
        temp.rollovertext = units[i].rollovertext;
        temp.type = '单位'
        tempList.push(temp);
    }
    for (i in values) {
        let value = values[i];
        if (value == "") continue;
        info = info + '<tr><td>' + value + '</td><td><table border="1">';
        for (j in tempList) {
            let temp = tempList[j];
            if (returnNode(temp.displayname).indexOf(value) > -1) {
                info = info + '<tr><td>' + temp.name + '</td>';
                info = info + '<td>' + temp.displayname + '</td>';
                info = info + '<td>' + temp.type + '</td>';
                info = info + '<td>' + temp.rollovertext + '</td></tr>';
            }
        }
        info = info + '</table></td>';
    }
    info = info + '</table>';
    document.getElementById('info').innerHTML = info;
}