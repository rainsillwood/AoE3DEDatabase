async function init() {
    //兼容性验证
    if (!indexedDB) {
        alert('浏览器不支持 indexedDB 数据库');
    }
    await openDB();
    document.getElementById('version').innerHTML = version;
    document.getElementById('date').innerHTML = date;
    document.getElementById('versiondatabase').innerHTML = getStorage('version');
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    if ((version + '-' + date) != getStorage('version')) {
        alert('当前数据版本:' + version + '-' + date + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
    }
}
async function updateDatabase() {
    let logger = document.getElementById('logger');
    logger.innerHTML = '';
    showNode('logger');
    await updateStrings();
    await updateProtoy();
    await updateTechtreey();
    await updateNuggets();
    await updateDamageTypes();
    await updateCivs();
    await updateProtoUnitCommands();
    await updateHomecity();
    await updateTactics();
    await updateUnittypes();
    await updateUnitflags();
    await updateTechflags();
    setStorage('version', version + '-' + date);
    appendNode('数据库更新完成', 'logger', 'div');
}
//缓存String
async function updateStrings() {
    let table = 'string';
    let files = ['stringtabley', 'unithelpstrings', 'unithelpstringsx', 'unithelpstringsy'];
    appendNode('更新语言文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    for (i in files) {
        let iArray = await getJson('./Data/strings/SimplifiedChinese/' + files[i] + '.xml.json');
        iArray = iArray.stringtable.language.string;
        let process = document.getElementById(table + '_quest').innerHTML * 1;
        process = process + iArray.length;
        document.getElementById(table + '_quest').innerHTML = process;
        for (j in iArray) {
            let oData = {};
            oData.index = iArray[j]['@_locid'];
            oData.symbol = returnNode(iArray[j]['@symbol']).toLowerCase();
            oData.value = iArray[j];
            updateData(table, oData);
        }
    }
}
//缓存单位,前置string
async function updateProtoy() {
    let table = 'proto';
    appendNode('更新单位文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let = iArray = await getJson('./Data/protoy.xml.json');
    iArray = iArray.proto.unit;
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + iArray.length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in iArray) {
        iArray[i].displayname = await getString(iArray[i].displaynameid, iArray[i]['@name']);
        iArray[i].rollovertext = await getString(iArray[i].rollovertextid);
        if (!(!iArray[i].unittype)) {
            let unitType = returnList(iArray[i].unittype);
            for (j in unitType) {
                let key = unitType[j].toLowerCase();
                let iData;
                if (!unittypes[key]) {
                    let string = await getCString(unitType[j]);
                    iData = {
                        name: unitType[j],
                        list: [],
                        displayname: string
                    };
                } else {
                    iData = unittypes[key];
                }
                iData.list.push(iArray[i]['@name']);
                unittypes[key] = iData;
            }
        }
        if (!(!iArray[i].flag)) {
            let unitFlag = returnList(iArray[i].flag);
            for (j in unitFlag) {
                let key = unitFlag[j].toLowerCase();
                let iData;
                if (!unitflags[key]) {
                    let string = await getCString(unitFlag[j]);
                    iData = {
                        name: unitFlag[j],
                        list: [],
                        displayname: string
                    };
                } else {
                    iData = unitflags[key];
                }
                iData.list.push(iArray[i]['@name']);
                unitflags[key] = iData;
            }
        }
        if (!(!iArray[i].tactics)) {
            let tactic = iArray[i].tactics.split('.')[0].toLowerCase();
            tacticList[tactic] = './Data/tactics/' + tactic + '.tactics.json';
            iArray[i].tactics = tactic;
        }
        let oData = {};
        oData.index = iArray[i]['@name'].toLowerCase();
        oData.value = iArray[i];
        updateData(table, oData);
    }
}
//缓存科技,前置string
async function updateTechtreey() {
    let table = 'techtree';
    appendNode('更新科技文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let iArray = await getJson('./Data/techtreey.xml.json');
    iArray = iArray.techtree.tech;
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + iArray.length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in iArray) {
        iArray[i].displayname = await getString(iArray[i].displaynameid, iArray[i]['@name']);
        iArray[i].rollovertext = await getString(iArray[i].rollovertextid);
        if (!(!iArray[i].flag)) {
            let techFlag = returnList(iArray[i].flag);
            for (j in techFlag) {
                let key = techFlag[j].toLowerCase();
                let iData;
                if (!techflags[key]) {
                    let string = await getCString(techFlag[j]);
                    iData = {
                        name: techFlag[j],
                        list: [],
                        displayname: string
                    };
                } else {
                    iData = techflags[key];
                }
                iData.list.push(iArray[i]['@name']);
                techflags[key] = iData;
            }
        }
        let oData = {};
        oData.index = iArray[i]['@name'].toLowerCase();
        oData.value = iArray[i];
        updateData(table, oData);
    }
}
//缓存文明,前置string
async function updateCivs() {
    let table = 'civ';
    appendNode('更新文明文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let iArray = await getJson('./Data/civs.xml.json');
    iArray = iArray.civs.civ;
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + iArray.length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in iArray) {
        iArray[i].displayname = await getString(iArray[i].displaynameid, iArray[i]['name']);
        iArray[i].rollovername = await getString(iArray[i].rollovernameid);
        if (!(!iArray[i].homecityfilename)) {
            let homecity = iArray[i].homecityfilename.split('.')[0].toLowerCase();
            homecityList[homecity] = './Data/' + iArray[i].homecityfilename + '.json';
            iArray[i].homecityfilename = homecity;
        }
        let oData = {};
        oData.index = iArray[i]['name'].toLowerCase();
        oData.value = iArray[i];
        updateData(table, oData);
    }
}
//缓存宝藏,前置string
async function updateNuggets() {
    let table = 'nugget';
    appendNode('更新宝藏文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let iArray = await getJson('./Data/nuggets.xml.json');
    iArray = iArray.nuggetmanager.nuggets.nugget;
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + iArray.length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in iArray) {
        iArray[i].rolloverstring = await getString(iArray[i].rolloverstringid);
        iArray[i].applystring = await getString(iArray[i].applystringid);
        let oData = {};
        oData.index = iArray[i]['name'].toLowerCase();
        oData.value = iArray[i];
        updateData(table, oData);
    }
}
//缓存伤害类型,前置string
async function updateDamageTypes() {
    let table = 'damagetype';
    appendNode('更新伤害文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let iArray = await getJson('./Data/damagetypes.xml.json');
    iArray = iArray.damagetypes.damagetype;
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + iArray.length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in iArray) {
        iArray[i].displayname = await getString(iArray[i].displaynameid);
        let oData = {};
        oData.index = iArray[i]['name'].toLowerCase();
        oData.value = iArray[i];
        updateData(table, oData);
    }
}
//缓存命令,前置string
async function updateProtoUnitCommands() {
    let table = 'command';
    appendNode('更新命令文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let iArray = await getJson('./Data/protounitcommands.xml.json');
    iArray = iArray.protounitcommands.protounitcommand;
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + iArray.length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in iArray) {
        iArray[i].rollovertext = await getString(iArray[i].rollovertextid);
        let oData = {};
        oData.index = iArray[i]['name'].toLowerCase();
        oData.value = iArray[i];
        updateData(table, oData);
    }
}
//缓存主城,前置civ
async function updateHomecity() {
    let table = 'homecity';
    appendNode('更新主城文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + Object.keys(homecityList).length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in homecityList) {
        let homecity = await getJson(homecityList[i]);
        if (!homecity) {
            logUpdate(table + '_failed', 1)
            logUpdate(table + '_processed', 1)
        } else {
            let oData = {};
            oData.index = i;
            oData.value = homecity.homecity;
            updateData(table, oData);
        }
    }
}
//缓存战术,前置proto
async function updateTactics() {
    let table = 'tactic';
    appendNode('更新战术文件: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + Object.keys(tacticList).length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in tacticList) {
        let tactic = await getJson(tacticList[i]);
        if (!tactic) {
            logUpdate(table + '_failed', 1)
            logUpdate(table + '_processed', 1)
        } else {
            let oData = {};
            oData.index = i;
            oData.value = tactic.tactics;
            updateData(table, oData);
        }
    }
}
//缓存单位类型,前置proto
function updateUnittypes() {
    let table = 'unittype';
    appendNode('更新单位类型: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + Object.keys(unittypes).length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in unittypes) {
        let oData = {};
        oData.index = i;
        oData.value = unittypes[i];
        updateData(table, oData);
    }
}
//缓存单位标志,前置proto
function updateUnitflags() {
    let table = 'unitflag';
    appendNode('更新单位标志: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + Object.keys(unitflags).length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in unitflags) {
        let oData = {};
        oData.index = i;
        oData.value = unitflags[i];
        updateData(table, oData);
    }
}
//缓存科技标志,前置techtree
function updateTechflags() {
    let table = 'techflag';
    appendNode('更新科技标志: <a id="' + table + '_processed">0</a> / <a id="' + table + '_quest">0</a> , <a id="' + table + '_failed">0</a> Error', 'logger', 'p');
    let process = document.getElementById(table + '_quest').innerHTML * 1;
    process = process + Object.keys(techflags).length;
    document.getElementById(table + '_quest').innerHTML = process;
    for (i in techflags) {
        let oData = {};
        oData.index = i;
        oData.value = techflags[i];
        updateData(table, oData);
    }
}