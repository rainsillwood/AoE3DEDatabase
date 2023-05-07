async function init() {
    //兼容性验证
    if (!indexedDB) {
        alert('浏览器不支持 indexedDB 数据库');
    }
    await openDB();
    document.getElementById('version').innerHTML = version;
    document.getElementById('date').innerHTML = date;
    document.getElementById('versionDatabase').innerHTML = getStorage('version');
    document.getElementById('dateDatabase').innerHTML = getStorage('date');
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    if (version != getStorage('version')) {
        alert('当前数据版本:' + version + ',数据库版本:' + getStorage('version') + '\n请更新数据库');
    }
}
async function updateDatabase() {
    let logger = document.getElementById('logger');
    logger.innerHTML = '';
    showNode('logger');
    await updateStrings();
    await updateProtoy();
    await updateTactics();
    await updateUnittypes();
    await updateUnitflags();
    await updateTechtreey();
    await updateTechflags();
    await updateCivs();
    await updateHomecity();
    await updateNuggets();
    await updateDamageTypes();
    await updateProtoUnitCommands();
    setStorage('version', version);
    setStorage('date', date);
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
            let iData = iArray[j];
            let oData = {};
            oData.index = iData['@_locid'];
            oData.symbol = returnNode(iData['@symbol']).toLowerCase();
            oData.value = iData;
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
        let iData = iArray[i];
        iData.displayname = await getString(iData.displaynameid, iData['@name']);
        iData.rollovertext = await getString(iData.rollovertextid);
        if (!(!iData.unittype)) {
            let unitType = returnList(iData.unittype);
            for (j in unitType) {
                let key = unitType[j].toLowerCase();
                let oData;
                if (!unittypes[key]) {
                    let string = await getCString(unitType[j]);
                    oData = {
                        name: unitType[j],
                        list: [],
                        displayname: string
                    };
                } else {
                    oData = unittypes[key];
                }
                oData.list.push(iData['@name']);
                unittypes[key] = oData;
            }
        }
        if (!(!iData.flag)) {
            let unitFlag = returnList(iData.flag);
            for (j in unitFlag) {
                let key = unitFlag[j].toLowerCase();
                let oData;
                if (!unitflags[key]) {
                    let string = await getCString(unitFlag[j]);
                    oData = {
                        name: unitFlag[j],
                        list: [],
                        displayname: string
                    };
                } else {
                    oData = unitflags[key];
                }
                oData.list.push(iData['@name']);
                unitflags[key] = oData;
            }
        }
        if (!(!iData.tactics)) {
            let tactic = iData.tactics.split('.')[0].toLowerCase();
            tacticList[tactic] = './Data/tactics/' + tactic + '.tactics.json';
            iData.tactics = tactic;
        }
        let oData = {};
        oData.index = iData['@name'].toLowerCase();
        oData.local = iData.displayname;
        oData.value = iData;
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
        let iData = iArray[i];
        iData.displayname = await getString(iData.displaynameid, iData['@name']);
        iData.rollovertext = await getString(iData.rollovertextid);
        if (!(!iData.flag)) {
            let techFlag = returnList(iData.flag);
            for (j in techFlag) {
                let key = techFlag[j].toLowerCase();
                let oData;
                if (!techflags[key]) {
                    let string = await getCString(techFlag[j]);
                    oData = {
                        name: techFlag[j],
                        list: [],
                        displayname: string
                    };
                } else {
                    oData = techflags[key];
                }
                oData.list.push(iData['@name']);
                techflags[key] = oData;
            }
        }
        let oData = {};
        oData.index = iData['@name'].toLowerCase();
        oData.local = iData.displayname;
        oData.value = iData;
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
        let iData = iArray[i];
        iData.displayname = await getString(iData.displaynameid, iData['name']);
        iData.rollovername = await getString(iData.rollovernameid);
        if (!(!iData.homecityfilename)) {
            let homecity = iData.homecityfilename.split('.')[0].toLowerCase();
            homecityList[homecity] = './Data/' + iData.homecityfilename + '.json';
            iData.homecityfilename = homecity;
        }
        let oData = {};
        oData.index = iData['name'].toLowerCase();
        oData.value = iData;
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
        let iData = iArray[i];
        iData.rolloverstring = await getString(iData.rolloverstringid);
        iData.applystring = await getString(iData.applystringid);
        let oData = {};
        oData.index = iData['name'].toLowerCase();
        oData.value = iData;
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
        let iData = iArray[i];
        iData.displayname = await getString(iData.displaynameid);
        let oData = {};
        oData.index = iData['name'].toLowerCase();
        oData.value = iData;
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
        let iData = iArray[i];
        iData.rollovertext = await getString(iData.rollovertextid);
        let oData = {};
        oData.index = iData['name'].toLowerCase();
        oData.value = iData;
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