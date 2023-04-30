function getInnerHTML() {
    return returnList(document.getElementById('input').value.replace('\t', '\n').split("\n"));
}

function getTechs() {
    let txt = '';
    getArray('techtree', 'all').then(function (resolve) {
        for (i in resolve) {
            let tech = resolve[i];
            let effects;
            txt = txt + tech['@name'] + '\t' + tech.displayname + '\t' + tech.rollovertext + '\t' + tech['dbid'] + '\t';
            if (!(!tech.effects)) {
                effects = returnList(tech.effects.effect);
            }
            for (let j in effects) {
                let effect = getEffect(effects[j]);
                txt = txt + effect.replace(/<ruby>/g, '').replace(/<\/ruby>/g, '').replace(/<rt>.*?<\/rt>/g, '');
                txt = txt + '|';
            }
            txt = txt + '\n';
            txt = txt.replace('|\n', '\n');
        }
        document.getElementById('output').value = txt;
    });
}

function getProtos() {
    let txt = '';
    for (i in units) {
        let unit = units[i];
        txt = txt + unit['@name'] + '\t' + returnNode(unit.displayname) + '\t' + returnNode(unit.rollovertext) + '\t' + unit['@id'] + '\t' + unit['dbid'] + '\n';
    }
    document.getElementById('output').value = txt;
}

function getCivCards() {
    let txt = '';
    for (i in homecitys) {
        let homecity = homecitys[i];
        let cards = homecity.cards.card;
        for (j in cards) {
            let card = cards[j];
            let temp = homecity.civ + ((card.revoltcard == '') ? '[R]' : '');
            /*if (!(!)) {
                temp = temp + '[R]';
            }*/
            temp = temp + '\t' + card.name + '\t' + returnNode(card.maxcount) + '\t' + returnNode(card.age) + '\n';
            txt = txt + temp;
        }
    }
    document.getElementById('output').value = txt;
}

function getCards() {
    let txt = '';
    for (i in techs) {
        let tech = techs[i];
        let flags = returnList(tech.flag);
        for (j in flags) {
            if (flags[j] == 'HomeCity') {
                let displayname = tech.displayname;
                txt = txt + tech['@name'] + '\t';
                txt = txt + (displayname.indexOf('队伍：') == 0 ? '队伍' : '单人') + '\t' + displayname.replace("队伍：", "") + '\t';
                txt = txt + tech.rollovertext + '\n';
                break;
            }
        }
    }
    document.getElementById('output').value = txt;
}

function getStrings() {
    let txt = '';
    for (i in strings) {
        txt = txt + strings[i]['@_locid'] + '\t' + returnNode(strings[i]['#text']) + '\t' + returnNode(strings[i]['@symbol']) + '\n';
    }
    document.getElementById('output').value = txt;
}

function getShrines() {
    let txt = '';
    let info = '<tr><th>调用名</th><th>中文名</th><th>种类</th><th>生产效率</th><th>描述</th></tr>';
    for (i in units) {
        let temp = '';
        let unit = units[i];
        let protoactions = returnList(returnNode(unit.protoaction));
        for (j in protoactions) {
            protoaction = protoactions[j];
            if (protoaction.name == 'ShrineGather') {
                temp = returnNode(unit['@name']) + '\t' + returnNode(protoaction.rate['#text']) + '\n';
                info = info + '<tr>';
                info = info + '<td>' + returnNode(unit['@name']) + '</td>';
                info = info + '<td>' + unit.displayname + '</td>';
                let unittypes = returnList(returnNode(unit.unittype));
                let utype = '';
                if (unittypes.includes('Herdable')) {
                    utype = '养殖';
                } else if (unittypes.includes('Huntable')) {
                    utype = '捕猎';
                }
                info = info + '<td>' + utype + '</td>';
                info = info + '<td>' + returnNode(protoaction.rate['#text']) + '</td>';
                info = info + '<td>' + unit.rollovertext + '</td>';
                info = info + '</tr>';
                break;
            }
        }
        txt = txt + temp;
    }
    document.getElementById('output').value = txt;
    document.getElementById('info').innerHTML = info;
}

function getTree() {
    let txt = '';
    let info = '<tr><th>调用名</th><th>中文名</th><th>大小</th><th>资源总量</th><th>描述</th></tr>';
    for (i in units) {
        unit = units[i];
        let unittypes = returnList(unit.unittype);
        if (unittypes.includes('Tree')) {
            txt = txt + unit['@name'] + '\t' + unit.initialresource['#text'] + '\n';
            info = info + '<tr>';
            info = info + '<td>' + unit['@name'] + '</td>';
            info = info + '<td>' + unit.displayname + '</td>';
            info = info + '<td>' + unit.obstructionradiusx + '*' + unit.obstructionradiusz + '</td>';
            info = info + '<td>' + unit.initialresource['#text'] + '</td>';
            info = info + '<td>' + unit.rollovertext + '</td>';
            info = info + '</tr>';
        }
    }
    document.getElementById('output').value = txt;
    document.getElementById('info').innerHTML = info;
}

function getNative() {
    let txt = '';
    let info = '<tr><th class="name">调用名</th><th class="local">中文名</th><th class="name">科技/兵种</th><th class="type">类型</th><th class="local">名称</th><th class="desc">描述</th><th class="effect">属性</th></tr>';
    for (i in civs) {
        if (!civs[i].agetech) continue;
        if (returnNode(civs[i].agetech.tech).indexOf('Native') > -1) {
            let techeffect = returnList(getTech(civs[i].agetech.tech).effects.effect);
            txt = txt + civs[i].name + '\t' + civs[i].displayname + '\t';
            info = info + '<tr>';
            info = info + '<th rowspan="' + techeffect.length + '">' + civs[i].name + '</th>';
            info = info + '<td rowspan="' + techeffect.length + '">' + civs[i].displayname + '</td>';
            for (j in techeffect) {
                if (j != '0') info = info + '<tr>';
                if (techeffect[j]['@type'] == 'TechStatus') {
                    let tempTech = getTech(techeffect[j]['#text']);
                    txt = txt + '\t\t' + techeffect[j]['#text'] + '\n';
                    info = info + '<td>' + techeffect[j]['#text'] + '</td><td>科技</td>';
                    info = info + '<td>' + tempTech.displayname + '</td>';
                    info = info + '<td>' + tempTech.rollovertext + '</td>';
                    info = info + '<td><div class="effect">' + getEffects(tempTech.effects, tempTech.displayname); + '</div></td>';
                }
                if (techeffect[j]['@type'] == 'Data' && techeffect[j]['@subtype'] == 'Enable') {
                    info = info + '<td>' + techeffect[j].target['#text'] + '</td><td>单位</td>';
                    info = info + '<td>' + getProto(techeffect[j].target['#text']).displayname + '</td>';
                    info = info + '<td>' + getProto(techeffect[j].target['#text']).rollovertext + '</td>';
                    info = info + '<td class="effect">' + '</td>';
                }
                info = info + '</tr>';
            }
        }
    }
    document.getElementById('output').value = txt;
    document.getElementById('info').innerHTML = info;
}

function getNuggetTech() {
    let info = '<tr><th>调用名</th><th>地图</th><th>难度</th><th>描述</th><th>效果</th></tr>';
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
    let info = '<tr><th class="icon">图标</th><th class="name">调用名</th><th class="local">中文名</th><th class="type">类型</th><th class="desc">描述</th><th class="effect">效果</th></tr>';
    let values = getInnerHTML();
    for (i in values) {
        let value = values[i];
        if (value == "") continue;
        info = info + '<tr>';
        info = info + '<td class="icon">%picture%</td>';
        info = info + '<td class="name">' + value + '</td>';
        for (j in techs) {
            let temp = techs[j];
            if (temp['@name'].toLowerCase() == value.toLowerCase()) {
                info = info + '<td class="local">' + temp.displayname + '</td>';
                info = info.replace('%picture%', '<img src="./Data/wpfg/' + returnNode(temp.icon).replace(/\\/g, '\/') + '" height="128" width="128">');
                info = info + '<td class="type">科技</td>';
                info = info + '<td class="desc">' + temp.rollovertext + '</td><td><div class="effect">';
                info = info + getEffects(temp.effects, temp.displayname);
                /*if (!!temp.effects) {
                    let effects = returnList(temp.effects.effect);
                    for (k in effects) {
                        info = info + getEffect(effects[k], temp.displayname) + '<br>';
                    }
                }*/
                info = info + '</div></td>';
                break;
            }
        }
        for (j in units) {
            let temp = units[j];
            if (temp['@name'].toLowerCase() == value.toLowerCase()) {
                info = info + '<td>' + strings[temp.displaynameid] + '</td>';
                info = info.replace('%picture%', '<img src="./Data/wpfg/' + temp.icon.replace(/\\/g, '\/') + '">');
                info = info + '<td>单位</td>';
                info = info + '<td>' + strings[temp.rollovertextid] + '</td>';
                info = info + '<td>' + '</td>';
                break;
            }
        }
        for (j in nuggets) {
            let temp = nuggets[j];
            if (temp.name.toLowerCase() == value.toLowerCase()) {
                info = info + '<td>' + strings[temp.rolloverstringid]['#text'] + '</td>';
                info = info + '<td>宝藏</td>';
                /*.replace(/%2s/, tString[temp.resource] ? tString[temp.resource] : temp.resource).replace(/%1d/, temp.amount)*/
                ;
                info = info + '<td>' + strings[temp.applystringid]['#text'] + '</td>';
            }
        }
        info = info + '</tr>';
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