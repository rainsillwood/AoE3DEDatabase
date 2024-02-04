//数值改变解析,设基础数值为Base,当前数值为Current
function getRelativity(type, amount) {
    let oData = {
        'type': 'null',
        'value': 0,
        'change': {
            'multiplier': 0,
            'cross': [[0, 0]]
        }
    }
    let value = BigNumber(amount);
    let percent = value.minus(1).times(100);
    switch (type) {
        //直接设定数值,Current=Assign
        case 'Assign': {
            oData.type = 'Set';
            oData.value = value;
            break;
        }
        //当前数值上加,Current=Current+Assign
        case 'Absolute': {
            oData.type = 'Add';
            oData.value = value;
            oData.change.multiplier = 1;
            break;
        }
        //当前数值上乘,Current=Current*Percent;
        case 'Percent': {
            if (percent < 0) {
                oData.type = 'Decrease';
                oData.value = percent;
            } else {
                oData.type = 'Increase';
                oData.value = percent;
            }
            break;
        }
        //基础数值乘,Current=Current+(BasePercent-1)*Base
        case 'BasePercent': {
            if (percent < 0) {
                oData.type = 'Decrease';
                oData.value = percent;
            } else {
                oData.type = 'Increase';
                oData.value = percent;
            }
            break;
        }
        //覆盖部分基础数值
        case 'Override': {
            oData.type = 'Set';
            oData.value = value;
            break;
        }
        case 'DefaultValue': {
            oData.type = 'Default';
            oData.value = value;
            break;
        }
        default: {
            oData.type = '未知';
            oData.value = value;
            break;
        }
    }
    return oData;
}
//结构字符替换
function replaceData(iString, iArray, changePos) {
    let oString = iString;
    oString = oString.replace(/!(.*?)!/g, '$1').replace(/(%\d)\.?\d?[sdfc]/g, '$1x');
    if (changePos) {
        for (let i in changePos.cross) {
            let cross = ['%' + changePos.cross[i][0] * changePos.multiplier + 'x', '%' + changePos.cross[i][1] * changePos.multiplier + 'x'];
            oString = oString.replace(cross[0], '%∞x');
            oString = oString.replace(cross[1], cross[0]);
            oString = oString.replace('%∞x', cross[1]);
        }
    }
    for (let i in iArray) {
        oString = oString.replace('%' + (i * 1 + 1) + 'x', iArray[i]);
    }
    oString = oString.replace('%%', '%');
    oString = oString.replace('增加 -', '减少 ');
    oString = oString.replace('+-', '-');
    return oString;
}
//目标解析
async function getTarget(target, type) {
    if (target === undefined) return '';
    let iData;
    let oString;
    switch (type) {
        case 'ProtoUnit': {
            //查询unittype
            iData = await getData('unittype', target.toLowerCase());
            if (!iData) {
                //unittype查询失败则查询unitflag
                iData = await getData('unitflag', target.toLowerCase());
            }
            if (iData) {
                //查询到unitflag||unittype
                oString = '⚐' + getRuby(iData.displayname, iData.name);
                break;
            } else {
                //均查询失败则查询proto
                iData = await getProto(target);
            }
            if (iData) {
                //查询到proto
                oString = getRuby(iData.displayname, iData['@name']);
            }
            break;
        }
        case 'Proto': {
            //查询unittype
            iData = await getData('unittype', target.toLowerCase());
            if (!iData) {
                //unittype查询失败则查询unitflag
                iData = await getData('unitflag', target.toLowerCase());
            }
            if (iData) {
                //查询到unitflag||unittype
                oString = '⚐' + getRuby(iData.displayname, iData.name);
                break;
            } else {
                //均查询失败则查询proto
                iData = await getProto(target);
            }
            if (iData) {
                //查询到proto
                oString = getRuby(iData.displayname, iData['@name']);
            }
            break;
        }
        case 'Tech': {
            iData = await getTech(target);
            if (iData) {
                oString = getRuby(iData.displayname, iData['@name']);
            }
            break;
        }
        case 'techWithFlag': {
            iData = await getData('techflag', target.toLowerCase());
            if (iData) {
                oString = '⚐' + getRuby(iData.displayname, iData['name']);
            } else {
                oString = '<del>⚐' + target + '</del>';
            }
            break;
        }
        case 'Player': {
            oString = getRuby('玩家', 'Player');
            break;
        }
        case 'techAll': {
            oString = getRuby('所有科技', 'techAll');
            break;
        }
        case 'Resource': {
            oString = await getCString('ResourceName' + target);
            oString = getRuby(oString, target);
            break;
        }
        case 'Command': {
            iData = await getCommand(target);
            if (iData) {
                oString = getRuby(iData.displayname, iData['name']);
            }
            break;
        }
        case 'Power': {
            iData = await getPower(target);
            if (iData) {
                oString = getRuby(iData.displayname, iData['@name']);
            }
            break;
        }
        default: {
            oString = target;
            break;
        }
    }
    return ' ' + oString + ' ';
}
//操作解析
async function getTargetAction(action, proto, isAll) {
    let oString;
    if (proto) {
        if (isAll) {
            oString = await getCString('AllActionsEffect');
        } else if (action) {
            let uniType = await getData('unittype', proto.toLowerCase());
            if (!uniType) {
                uniType = {
                    'list': []
                };
            }
            uniType.list.unshift(proto);
            for (let i in uniType.list) {
                let target = await getProto(uniType.list[i]);
                if (target.tactics) {
                    let iData = await getAction(target.tactics.toLowerCase() + '-' + action.toLowerCase());
                    if (!iData.isNull) {
                        oString = getRuby(iData.displayname, iData.name['#text']);
                        break;
                    }
                }
            }
        }
    }
    if (!oString) {
        oString = '<del>' + proto + ':' + action + '</del>';
    }
    return ' ' + oString + ' ';
}
//战术解析
async function gettargetTactic(tactic, proto, isAll) {
    let oString;
    if (proto) {
        if (isAll) {
            oString = await getCString('AllActionsEffect');
        } else if (tactic) {
            let uniType = await getData('unittype', proto.toLowerCase());
            if (!uniType) {
                uniType = {
                    'list': []
                };
            }
            uniType.list.unshift(proto);
            for (let i in uniType.list) {
                let target = await getProto(uniType.list[i]);
                if (target.tactics) {
                    let iData = await getTactic(target.tactics.toLowerCase() + '-' + tactic.toLowerCase());
                    if (!iData.isNull) {
                        oString = getRuby(iData.displayname, iData['#text']);
                        break;
                    }
                }
            }
        }
    }
    if (!oString) {
        oString = '<del>' + proto + ':' + tactic + '</del>';
    }
    return ' ' + oString + ' ';
}
//科技效果
async function getEffects(tech, isNugget) {
    let oString = '';
    let effectList = [];
    let techName;
    if (isNugget) {
        tech['@type'] = 'Nugget';
        
        effectList.push(tech);
        techName = tech.name;
    } else {
        if (!tech.effects) return '';
        effectList = returnList(tech.effects.effect);
        techName = getRuby(tech.displayname, tech['@name']);
    }
    for (let i in effectList) {
        let iString = await getEffect(effectList[i], techName);
        oString = oString + iString + '</br>';
    }
    oString = oString + '</br>';
    return oString.replace('</br></br>', '');
}
//效果解析,包括宝藏
async function getEffect(effect, techName) {
    let oString;
    let subType;//次级效果
    //获取执行对象
    let actor;
    let targetAction, targetTactic;
    if (effect.target) {
        actor = await getTarget(effect.target['#text'], effect.target['@type']);
        targetAction = await getTargetAction(effect['@action'], effect.target['#text'], BigNumber(effect['@allactions']).gt(0));
        targetTactic = await gettargetTactic(effect['@tactic'], effect.target['#text'], BigNumber(effect['@allactions']).gt(0));
    }
    //获取目标对象
    let targetProto = await getTarget(effect['@proto'], 'ProtoUnit');
    let targetUnitType = await getTarget(effect['@unittype'], 'ProtoUnit');
    let targetUnit = targetProto || targetUnitType;
    let targetTech = await getTarget(effect['@tech'], 'Tech');
    let targetCommand = await getTarget(effect['@command'], 'Command');
    let targetResource = await getTarget(effect['@resource'], 'Resource');
    //获取交换资源对象
    let fromResource = await getTarget(effect['@fromresource'], 'Resource');
    let toResource = await getTarget(effect['@toresource'], 'Resource');
    //获取改变单位对象
    let fromProto = await getTarget(effect['@fromprotoid'], 'ProtoUnit');
    let toProto = await getTarget(effect['@toprotoid'], 'ProtoUnit');
    //获取数值改变
    let relativity = getRelativity(effect['@relativity'], effect['@amount']);
    //获取状态改变
    let status = await getCString(effect['@status']);
    status = ' ' + status + ' ';
    //其他数值处理
    let multiplier = BigNumber(effect['@multiplier']).times(100) + '%';
    let multiplier2 = BigNumber(effect['@multiplier2']).times(100) + '%';
    let amount = BigNumber(effect['@amount']);
    let amount2 = BigNumber(effect['@amount2']);
    let unitcount = BigNumber(effect['@unitcount']);
    let maxcount = ('×' + BigNumber(effect['@maxcount'])).replace('-1', '∞');
    let minvalue = BigNumber(effect['@minvalue']);
    let maxvalue = BigNumber(effect['@maxvalue']);
    let minsrcvalue = BigNumber(effect['@minsrcvalue']);
    let maxsrcvalue = BigNumber(effect['@maxsrcvalue']);
    let unitcap = BigNumber(effect['@unitcap']);
    let resourcecap = BigNumber(effect['@resourcecap']);
    let resvalue = BigNumber(effect['@resvalue'])
    let rate = relativity.value.times(100);
    //其他文本处理
    let kbstat = effect['@kbstat'];
    let querystate = effect['@querystate'];
    //其他布尔值处理
    let includeself = effect['@includeself'] == 'true';
    let infiniteinlastage = BigNumber(effect['@infiniteinlastage']).gt(0);
    switch (effect['@type']) {
        case 'Nugget': {//宝藏效果
            subType = effect.type;
            break;
        }
        case 'Data': {//改变数据
            subType = effect["@subtype"];
            break;
        }
        case 'Data2': {//改变数据
            subType = effect["@subtype"];
            break;
        }
        case 'TechStatus': {//开/关科技 HCAdvancedArsenal
            oString = await getCString('TechSetStatus' + 'Effect');
            let target = await getTarget(effect['#text'], 'Tech');
            oString = replaceData(oString, [
                target,
                status
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'RandomTech': {//激活随机科技 DEHCPokerShadow
            oString = '随机 ' + effect['@select'] + ' 项科技设置为' + status;
            let techList = effect.tech;
            if (techList) {
                for (let i in techList) {
                    techList[i] = await getTarget(techList[i], 'Tech');
                }
                oString = oString + '：[' + techList.join(', ') + ']';
            }
            oString = '☆' + oString;
            break;
        }
        case 'CreatePower': {//激活能力 HCXPNationalRedoubt
            let protoPower = await getTarget(effect['@protopower'], 'Power');
            oString = '激活能力：' + protoPower;
            oString = '☆' + oString;
            break;
        }
        case 'CommandAdd': {//增加命令 DEHCEarlyFort
            oString = actor + ': 增加命令' + targetProto + targetTech + targetCommand;
            oString = '☆' + oString;
            break;
        }
        case 'CommandRemove': {//移除命令 DEHCFedGoldRush
            oString = actor + ': 移除命令' + targetProto + targetTech + targetCommand;
            oString = '☆' + oString;
            break;
        }
        case 'TransformUnit': {//置换单位 HCXPTercioTactics
            oString = '所有' + fromProto + '转变成' + toProto;
            oString = '☆' + oString;
            break;
        }
        case 'ReplaceUnit': {//转换单位 DEHCPlanVeracruz
            oString = '所有' + fromProto + '转变成' + toProto;
            oString = '☆' + oString;
            break;
        }
        case 'SetName': {//更改名称 HCAdvancedArsenal
            let newName = await getString(effect['@newname']);
            oString = targetTech + targetProto + ': 更名为 ' + newName;
            oString = '☆' + oString;
            break;
        }
        case 'Sound': {//播放音频 DEVictorianEraDiscoveryShadow
            oString = '播放音频：' + effect['#text'];
            oString = '☆' + oString;
            break;
        }
        case 'TextOutput': {//输出消息 HCAdvancedArsenal
            oString = await getString(effect['#text']);
            oString = '输出消息：『' + oString.replace('%1!s!', techName) + '』';
            oString = '☆' + oString;
            break;
        }
        case 'TextOutputTechName': {//输出消息 DEHCChurchWagon
            oString = await getString(effect['#text']);
            oString = '输出消息：『' + oString.replace('%1!s!', techName) + '』';
            oString = '☆' + oString;
            break;
        }
        case 'TextEffectOutput': {//输出消息 DEChurchRisorgimentoBrazil
            let iString = await getString(effect['@playermsg']);
            oString = await getString(effect['@selfmsg']);
            oString = '输出消息：『' + oString + '』/『' + iString.replace('%s', '玩家1') + '』';
            oString = '☆' + oString;
            break;
        }
        case 'InitiateRevolution': {//发起革命 DERevolutionMXBajaCalifornia
            oString = '发起革命：' + (!targetProto ? ' 无市民 ' : targetUnit.replace('<ruby><del>none</del><rt>-none-</rt></ruby>', ' 无市民 ')) + '，';
            oString = oString + (effect['@savedeck'] == 'True' ? '' : '不') + '保存卡组，';
            oString = '☆' + oString + (effect['@extdeck'] == 'True' ? '' : '不') + '启用新卡组';
            break;
        }
        case 'RevertRevolution': {//回归 DEReturnMXYucatan
            let iString = await getString(effect['@playermsg']);
            oString = await getString(effect['@selfmsg']);
            oString = '回归：『' + oString + '』/『' + iString.replace('%s', 'Player') + '』';
            oString = '☆' + oString;
            break;
        }
        case 'ResourceExchange': {//资源交换1换1 YPHCEmpressDowager
            oString = '所有' + fromResource + '都将换成 ' + multiplier + ' 的' + toResource;
            oString = '☆' + oString;
            break;
        }
        case 'ResourceExchange2': {//资源交换1换2 DENatAkanPalmOil
            let toResource2 = await getTarget(effect['@toresource2'], 'Resource');
            oString = '所有' + fromResource + '都将换成' + multiplier + '的' + toResource;
            oString = oString + '和 ' + multiplier2 + ' 的' + toResource2;
            oString = '☆' + oString;
            break;
        }
        case 'SetOnBuildingDeathTech': {//建筑死亡时激活 YPHCCalltoArms1
            let target = await getTarget(effect['#text'], 'Tech');
            oString = '建筑摧毁时激活科技' + target + ' ' + amount;
            if (amount.lt(amount2)) {
                oString = oString + '-' + effect['@amount2'] + '(存疑)';
            }
            oString = oString + ' 次';
            oString = '☆' + oString;
            break;
        }
        case 'ResetHomeCityCardCount': {//重置指定船运次数 DEHCShipMineWagon3
            oString = targetTech + '：重置船运次数';
            oString = '☆' + oString;
            break;
        }
        case 'ResetResendableCards': {//重置可重复船运次数 DEHCREVFedMXPlanMonterrey
            oString = '重置所有可重复运送船运次数';
            oString = '☆' + oString;
            break;
        }
        case 'SetOnShipmentSentTech': {//每次船运抵达时激活科技 DEHCFulaniInvasion
            let target = await getTarget(effect['#text'], 'Tech');
            oString = '每次船运抵达时激活科技' + target + ' ' + amount + ' 次';
            oString = '☆' + oString;
            break;
        }
        case 'SetOnTechResearchedTech': {//每次完成研究时激活科技 DEHCGondolas
            let target = await getTarget(effect['#text'], 'Tech');
            oString = '每次完成研究时激活科技' + target + ' ' + amount + '次';
            oString = '☆' + oString;
            break;
        }
        case 'ResourceInventoryExchange': {//卖牲畜 DERoyalBanquet
            oString = '所有' + targetUnitType + '储存的' + fromResource + '兑换为 ' + multiplier + ' 的' + toResource;
            oString = '☆' + oString;
            break;
        }
        case 'SharedLOS': {//获得所有单位的视野 Spies
            oString = '获得所有单位的视野';
            oString = '☆' + oString;
            break;
        }
        case 'Blockade': {//封锁工具 HCBlockade
            oString = effect['@delay'] + ' 秒后禁止敌对发出船运';
            oString = '☆' + oString;
            break;
        }
        case 'SetAge': {//设置时代 ypConsulateJapaneseMeijiRestoration
            oString = await getCString(effect['#text']);
            oString = '设置时代为 ' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'AddHomeCityCard': {//启用船运(需启用额外船运卡槽) DEPoliticianFederalNewYork
            oString = await getCString('Age' + effect['@ageprereq']);
            oString = '于 ' + oString + ' 启用船运： ';
            if (unitcount.gt(0)) {
                oString = oString + '<sup>' + effect['@unitcount'] + '</sup>';
            }
            oString = oString + targetTech;
            oString = oString + maxcount;
            oString = oString + infiniteinlastage ? ' 🔄' : '';
            oString = '☆' + oString;
            break;
        }
        case 'AddTrickleByResource': {//增加百分比细流 DENatBerberSaltCaravans
            let srcResource1 = await getTarget(effect['@srcresource1'], 'Resource');
            let srcResource2 = await getTarget(effect['@srcresource2'], 'Resource');
            oString = '<span style="display: inline-flex;align-items:center;">';
            oString = oString + '根据' + srcResource1 + (srcResource2 ? ('+' + srcResource2) : '') + getSpan(minsrcvalue, maxsrcvalue, 'left');
            oString = oString + '获得 ' + getSpan(minvalue, maxvalue, 'right') + targetResource + '细流';
            oString = oString + '</span>';
            oString = '☆' + oString;
            break;
        }
        case 'ForbidTech': {//DECircleArmyShadow1Switch
            break;
        }
        case 'ResetActiveOnce': {//DECircleArmyShadow1Switch
            break;
        }
        case 'HomeCityCardMakeInfinite': {//DESebastopolMortarRepeatShadow
            break;
        }
        case 'UIAlert': {//显示UI DESPCExcommunication
            break;
        }
        default: {
            break;
        }
    }
    switch (subType) {
        case 'RevealLOS': {//临时视野 DEHCUSExpedition
            oString = '★' + (actor + '：' + (amount.gt(0) ? '获得视野' : '显示位置') + '');
            break;
        }
        case 'EnableTradeRouteLOS': {
            oString = '★' + ((amount.gt(0) ? '获得' : '关闭') + '贸易路线视野');
            break;
        }
        case 'AllowedAge': {//更改解锁时代 HCAdvancedArsenal
            oString = actor + '：推迟 ' + amount + ' 个时代启用';
            oString = oString.replace('推迟 -', '提前 ');
            oString = '☆' + oString;
            break;
        }
        case 'Enable': {//启用/禁用单位 HCAdvancedArsenal
            let flag = amount.gt(0) ? 'Enable' : 'Disable';
            oString = await getCString(flag + subType.replace('Enable', '') + 'Effect');
            oString = replaceData(oString, [
                actor
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'ActionEnable': {//DEHCNewSpainViceroyalty
            let flag = amount.gt(0) ? 'Enable' : 'Disable';
            oString = await getCString(flag + subType.replace('Enable', '') + 'Effect');
            oString = replaceData(oString, [
                actor,
                targetAction
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'TacticEnable': {//DEHCNewSpainViceroyalty
            let flag = amount.gt(0) ? 'Enable' : 'Disable';
            oString = await getCString(flag + 'Action' + 'Effect');
            oString = replaceData(oString.replace('操作', '战术'), [
                actor,
                targetTactic
            ], relativity.change);
            oString = '☆' + oString;
            break;
        }
        case 'EnableAutoCrateGather': {//DEHCChichaBrewing
            let flag = amount.gt(0) ? 'Enable' : 'Disable';
            oString = await getCString(flag + subType.replace('Enable', '') + 'Effect');
            oString = replaceData(oString, [
                actor,
                targetAction
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'FreeHomeCityUnit': {//运送单位 HCRobberBarons
            oString = await getCString(subType + 'Effect');
            oString = replaceData(oString, [
                amount,
                targetUnit
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'FreeHomeCityUnitIfTechObtainable': {//启用指定科技时运送单位 HCAdvancedArsenal
            oString = await getCString('FreeHomeCityUnitEffect');
            oString = replaceData(oString, [
                amount,
                targetUnit
            ], relativity.change);
            oString = '启用科技' + targetTech + '时：' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitByTechActiveCount': {//根据生效次数运送单位 DEHCFedNewYorkZouaves
            oString = await getCString('FreeHomeCityUnitEffect');
            oString = replaceData(oString, [
                amount + '×',
                targetUnit
            ], relativity.change);
            oString = '根据' + targetTech + '已生效次数，' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitTechActiveCycle': {//数次递减后重置运送单位循环 DEHCRollingArtillery
            oString = await getCString('FreeHomeCityUnitEffect');
            oString = replaceData(oString, [
                amount,
                targetUnit
            ], relativity.change);
            oString = '首次' + oString + '，其后每次减少 1 个，';
            oString = oString + '每 ' + amount + ' 次后重置';
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitByShipmentCount': {//根据船运次数运送单位 DEHCFedDelawareBlues
            oString = await getCString('FreeHomeCityUnitEffect');
            oString = replaceData(oString, [
                amount + '×(' + (includeself ? '' : '不') + '包含本次)',
                targetUnit
            ], relativity.change);
            oString = '根据已运送船运次数，' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitByKBStat': {//根据计分状态运送单位 DEHCOromoMigrations
            oString = await getCString('FreeHomeCityUnitEffect');
            oString = replaceData(oString, [
                amount + '×',
                targetUnit
            ], relativity.change);
            oString = '根据统计 ' + kbstat + ' ，' + oString + ',';
            oString = oString + '最多 ' + unitcap + ' 个';
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitByKBQuery': {//根据计分统计运送单位 DEHCRitualGladiators
            let queryUnitType = await getTarget(effect['@queryunittype'], 'ProtoUnit');
            oString = await getCString('FreeHomeCityUnitEffect');
            oString = replaceData(oString, [
                amount + '×',
                targetUnit
            ], relativity.change);
            oString = '根据' + queryUnitType + ' 的 ' + querystate + ' 数量' + '，' + oString + ',';
            oString = oString + '最多 ' + unitcap + ' 个';
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitResource': {//运送携带资源单位 HCShipCows
            oString = await getCString(subType + 'Effect');
            oString = replaceData(oString, [
                amount,
                targetUnit,
                resvalue,
                targetResource
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'FreeHomeCityUnitResourceIfTechObtainable': {//激活指定科技时运送携带资源单位 DEHCAltaCalifornia
            oString = await getCString('FreeHomeCityUnitResourceEffect');
            oString = replaceData(oString, [
                amount,
                targetUnit,
                resvalue,
                targetResource
            ], relativity.change);
            oString = '启用科技' + targetTech + '时：' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitResourceIfTechActive': {//启用指定科技时运送携带资源单位 DENatJagiellonInheritance
            oString = await getCString('FreeHomeCityUnitResourceEffect');
            oString = replaceData(oString, [
                amount,
                targetUnit,
                resvalue,
                targetResource
            ], relativity.change);
            oString = '科技' + targetTech + '生效时：' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitByShipmentCountResource': {//根据船运次数运送携带资源单位 DEHCFedFloridaCowhunters
            oString = await getCString('FreeHomeCityUnitResourceEffect');
            oString = replaceData(oString, [
                amount + '×(' + (includeself ? '' : '不') + '包含本次)',
                targetUnit,
                resvalue,
                targetResource
            ], relativity.change);
            oString = '根据已运送船运次数，' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitToGatherPoint': {//运送携带资源单位至收集点 DEHCShipZebu3
            let gpUnitType = await getTarget(effect['@gpunittype'], 'ProtoUnit');
            oString = await getCString('FreeHomeCityUnitResourceEffect');
            oString = replaceData(oString, [
                amount,
                targetUnit,
                resvalue,
                targetResource
            ], relativity.change);
            oString = '于' + gpUnitType + '处：' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitRandom': {//运送随机单位 HCXPBanditGang
            oString = await getCString(subType + 'Effect');
            oString = replaceData(oString, [
                amount,
                targetUnit
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'FreeHomeCityUnitShipped': {//运送船载单位 YPHCWokouJapanese1
            oString = await getCString('FreeHomeCityUnitEffectShipped');
            let targetUnitType2 = await getTarget(effect['@unittype2'], 'ProtoUnit');
            oString = replaceData(oString, [
                amount,
                targetUnit,
                amount2,
                targetUnitType2
            ], relativity.change);
            oString = '☆' + oString;
            break;
        }
        case 'FreeHomeCityUnitByUnitCount': {//根据单位数量运送单位 DEHCSoldierTorps
            oString = await getCString(subType + 'Effect');
            let targetCountType = await getTarget(effect['@counttype'], 'ProtoUnit');
            oString = replaceData(oString, [
                amount + '×',
                targetUnit,
                targetCountType
            ], relativity.change);
            oString = '☆' + oString;
            break;
        }
        case 'Resource': {//运送资源 
            oString = await getCString(relativity.type + 'InventoryAmount' + 'Effect');
            oString = replaceData(oString, [
                actor,
                targetResource,
                amount
            ], relativity.change);
            oString = '☆' + oString;
            break;
        }
        case 'ResourceIfTechObtainable': {//启用指定科技时运送资源 HCShipBalloons
            oString = await getCString(relativity.type + 'InventoryAmount' + 'Effect');
            oString = replaceData(oString, [
                actor,
                targetResource,
                amount
            ], relativity.change);
            oString = '启用科技' + targetTech + '时：' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'ResourceIfTechActive': {//启用指定科技时运送资源 DENatJagiellonInheritance
            oString = await getCString(relativity.type + 'InventoryAmount' + 'Effect');
            oString = replaceData(oString, [
                actor,
                targetResource,
                amount
            ], relativity.change);
            oString = '科技' + targetTech + '生效时：' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'ResourceByKBStat': {//根据计分统计运送资源 HCXPGreatHunter
            oString = await getCString(relativity.type + 'InventoryAmount' + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetResource,
                amount + '× '
            ], relativity.change);
            oString = '根据统计 ' + kbstat + ' ，' + oString + ',';
            oString = oString + '最多 ' + resourcecap;
            oString = '☆' + oString;
            break;
        }
        case 'ResourceByKBQuery': {//根据计分数量运送资源 DEHCTripToJerusalem
            let queryUnitType = await getTarget(effect['@queryunittype'], 'ProtoUnit');
            oString = await getCString(relativity.type + 'InventoryAmount' + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetResource,
                amount
            ], relativity.change);
            oString = '根据' + queryUnitType + ' 的 ' + querystate + ' 数量' + '，' + oString + ',';
            oString = oString + '最多 ' + resourcecap;
            oString = '☆' + oString;
            break;
        }
        case 'ResourceByUnitCount': {//根据单位数量运送资源 DEHCFedTextileMill
            oString = await getCString(relativity.type + 'InventoryAmount' + 'Effect');
            oString = replaceData(oString, [
                actor,
                targetResource,
                amount
            ], relativity.change);
            oString = '地图上每存在一' + targetUnit + '，' + oString;
            oString = '☆' + oString;
            break;
        }
        case 'ResourceAsCratesByShipmentCount': {//根据船运次数运送携带资源箱子 DEHCREVMXMayaCeramics
            oString = await getCString('ResourceAsCrates' + 'Effect');
            oString = replaceData(oString, [
                actor,
                amount + '×(' + (includeself ? '' : '不') + '包含本次)',
                targetResource
            ], relativity.change);
            oString = '根据已运送船运次数，' + oString.replace('+', '');
            oString = '☆' + oString;
            break;
        }
        case 'ResourceReturn': {//设置返还资源 DEHCVasa
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value,
                targetResource
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'ResourceReturnRate': {//设置返还资源率 DEHCTEAMHausaGates
            oString = await getCString(relativity.type + 'ResourceReturn' + 'Effect');
            oString = replaceData(oString, [
                actor,
                rate + '%',
                targetResource
            ], relativity.change);
            oString = '☆' + oString;
            break;
        }
        case 'ResourceReturnRateTotalCost': {//设置所有返还资源率 DEHCTEAMHausaGates
            oString = await getCString(relativity.type + 'ResourceReturn' + 'Effect');
            oString = replaceData(oString, [
                actor,
                rate + '%',
                ' 所有 '
            ], relativity.change);
            oString = '☆' + oString;
            break;
        }
        case 'InventoryAmount': {//携带资源提升 DEHCLevantineTrade
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetResource,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'PopulationCap': {//人口上限 ImpImmigrants
            oString = await getCString('PopulationCapExtra');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = oString.replace('最大', '');
            oString = '☆' + oString;
            break;
        }
        case 'PopulationCapExtra': {//额外人口上限 deUnknownOverpop
            oString = await getCString(subType);
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'PopulationCapBonus': {//额外人口上限 ypPopulationCapBonus
            oString = await getCString('PopulationCapExtra');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '☆' + oString;
            break;
        }
        case 'PopulationCapAddition': {//提供人口空间 FrontierBlockhouse
            oString = await getCString(subType);
            oString = replaceData(oString, [
                actor,
                relativity.value
            ]);
            oString = '★' + oString;
            break;
        }
        case 'PopulationCount': {//占用人口空间 DEHCSiegeConstruction
            oString = await getCString('PopulationCapAddition');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ]);
            oString = oString.replace('提供', '占用');
            oString = '☆' + oString;
            break;
        }
        case 'BuildLimit': {//建造上限 HCXPMarauders
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ]);
            oString = '★' + oString;
            break;
        }
        case 'BuildLimitIncrement': {//建造上限增加 DEIncreaseMayaLimit
            oString = await getCString(relativity.type + 'BuildLimit' + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ]);
            oString = '☆' + oString;
            break;
        }
        case 'AddSharedBuildLimitUnitType': {//Age0Russian
            oString = actor + '：建造数量上限';
            oString = oString + (amount.gt(0) ? '增加' : '取消') + '共享'
            oString = '☆' + oString;
            break;
        }
        case 'SharedBuildLimitUnit': {//Age0Russian
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ]);
            oString = '★' + oString;
            break;
        }
        case 'TrainPoints': {//训练时间 DEHCSiegeConstruction
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'BuildPoints': {//建造时间 Bastion
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'ResearchPoints': {//研究时间 ChurchMissionFervor
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'BuildBounty': {//建造回馈 DEHCFedMXBustamante
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'KillBounty': {//击杀回馈 DEHCFedMXBustamante
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'Cost': {//成本 DEHCFedMXBustamante
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetResource,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'Hitpoints': {//生命 DEHCFedMXBustamante
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'Lifespan': {//存在时间 DEHCObservers
            oString = actor + '：存在时间 +' + relativity.value;
            oString = oString.replace('+-', '-');
            oString = '☆' + oString;
            break;
        }
        case 'Armor': {//护甲 DEHCCentSuisses
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'ArmorSpecific': {//额外护甲 DEHCDignitaries
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                relativity.value,
                effect['@newtype']
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'MaximumVelocity': {//速度 DEChurchTeutonicKnights
            oString = await getCString(relativity.type + 'Speed' + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'LOS': {//视野 DEHCFlintlockRockets
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'MaximumRange': {//最大范围 DEVeteranAzaps
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'MinimumRange': {//最小范围 DEHCCaseShot
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'RateOfFire': {//攻击间隔 DEHCGrapeshot
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'InventoryRate': {//增肥效率 DEHCBarbacoa
            oString = await getCString(relativity.type + 'WorkRate' + 'Effect');
            relativity.change.cross = [[2, 4], [2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                targetUnit,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'WorkRate': {//工作效率 DEHCMedicineWheels
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 4], [2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                targetUnit,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'WorkRateSpecific': {//单一工作效率 DEHCREVMXTextileMills
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                targetAction,
                targetUnit,
                relativity.value,
                targetResource
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'CommunityPlazaWeight': {//社区广场工作权重 DEHCMedicineWheels
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'BuildingWorkRate': {//训练研究效率 YPHCBakufu
            oString = await getCString(relativity.type + subType + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'Yield': {//资源产量 DEHCEnvironmentalism
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 4], [2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                targetUnit,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'ResourceTrickleRate': {//资源细流 XPTrickle
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetResource,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'MinimumResourceTrickleRate': {//最小资源细流 XPTrickle
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetResource,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'MaximumResourceTrickleRate': {//最大资源细流 XPTrickle
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetResource,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'DamageTimeoutTrickle': {//无伤资源流
            oString = actor + '：';
            oString = oString + BigNumber(effect['@timeout']) + ' 秒内未受到伤害，';
            oString = oString + targetResource + '细流';
            oString = oString + ' +' + relativity.value;
            oString = '☆' + oString;
            //DEMonasteryPhanarHesychasm{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"2.50","_subtype":{"DamageTimeoutTrickle","_resource":{"XP","_timeout":{"30.00","_relativity":{"Absolute"}
            break;
        }
        case 'Damage': {//伤害 ypImpLegendaryNatives
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'DamageCap': {//伤害上限 ypMonasteryKillingBlowUpgrade
            oString = await getCString(relativity.type + subType);
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'DamageBonus': {//伤害倍率 Rifling
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 4], [2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                targetUnit,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'DamageArea': {//伤害范围 HCXPGreatTempleHuitzilopochtli
            oString = await getCString(relativity.type + subType + 'Effect');
            relativity.change.cross = [[2, 3]];
            oString = replaceData(oString, [
                actor,
                targetAction,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'DamageForAllRangedLogicActions': {//HCXPPioneers2
            oString = await getCString(relativity.type + 'RangedDamage' + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'DamageForAllHandLogicActions': {
            oString = await getCString(relativity.type + 'HandDamage' + 'Effect');
            oString = replaceData(oString, [
                actor,
                relativity.value,
            ], relativity.change);
            oString = '★' + oString;
            break;
        }
        case 'GarrisonBonusDamage': {//驻守伤害倍率
            oString = actor + '：';
            oString = oString + targetAction + ' 的驻守伤害增益';
            oString = oString + ' +' + relativity.value;
            oString = '☆' + oString;
            //DEHCKatsinaFortifications{"target":{{"_type":{"ProtoUnit","__text":{"deTower"},"_type":{"Data","_action":{"RangedAttack",['@amount']":{"0.1","_subtype":{"GarrisonBonusDamage","_unittype":{"Unit","_relativity":{"Assign"}
            break;
        }
        case 'DamageMultiplier': {//额外伤害倍率 DEHCMexicanStandoff
            oString = actor + '：';
            oString = oString + targetAction + ' 的额外伤害倍率';
            oString = oString + ' +' + relativity.value;
            oString = '☆' + oString;
            //DEHCMexicanStandoff{"target":{{"_type":{"ProtoUnit","__text":{"deSaloonDesperado"},"_type":{"Data","_action":{"RangedAttack",['@amount']":{"2.00","_subtype":{"DamageMultiplier","_relativity":{"Assign"}
            break;
        }
        case 'SelfDamageMultiplier': {//反伤倍率 DEHCMexicanStandoff
            oString = actor + '：';
            oString = oString + targetAction + ' 的反伤倍率';
            oString = oString + ' +' + relativity.value;
            oString = '☆' + oString;
            //DEHCMexicanStandoff{"target":{{"_type":{"ProtoUnit","__text":{"deSaloonDesperado"},"_type":{"Data","_action":{"RangedAttack",['@amount']":{"0.50","_subtype":{"SelfDamageMultiplier","_relativity":{"Assign"}
            break;
        }
        case 'HitPercent': {
            oString = actor + '：';
            oString = oString + targetAction + ' 的附加效果几率';
            oString = oString + ' +' + relativity.value + '%';
            oString = '☆' + oString;
            //DEHCMexicanStandoff{"target":{{"_type":{"ProtoUnit","__text":{"deSaloonDesperado"},"_type":{"Data","_action":{"RangedAttack",['@amount']":{"25.00","_subtype":{"HitPercent","_relativity":{"Assign"}
            break;
        }
        case 'HitPercentType': {
            oString = actor + '：';
            oString = oString + targetAction + ' 的攻击附加效果为 ';
            oString = oString + effect['@hitpercenttype'];
            oString = '☆' + oString;
            //DEHCMexicanStandoff{"target":{{"_type":{"ProtoUnit","__text":{"deSaloonDesperado"},"_type":{"Data","_action":{"RangedAttack",['@amount']":{"0.00","_subtype":{"HitPercentType","_relativity":{"Absolute","_hitpercenttype":{"CriticalAttack"}
            break;
        }
        default: {
            break;
        }
    }
    if (!oString) {
        oString = '❓'+JSON.stringify(effect);
    }
    oString = oString.replace('%1!s!', techName);
    return oString;
}
//次级效果解析
async function subEffect(effect, isNugget) {
    switch (subType) {
        case 'ActionAdd': {
            oString = actor + ':{ 增加战术 ' + actionType(effect['@action'], '-1', effect['@unittype']);
            break;
        }
        case 'AddTrain': {
            return (actor + '：' + ((effect['@amount']) * 1 > 0 ? '添加' : '删除') + '训练' + targetProto);
        }
        case 'ActionDisplayName': {
            return (actor + '：动作' + actionType(effect['@action'], effect['@allactions'], effect.target['#text']) + '更名为 ' + getString(effect['@stringid']));
        }
        case 'MaximumContained': {
            return (actor + '：装载空间' + getRelativity(effect['@relativity'], effect['@amount']));
        }
        case 'CopyUnitPortraitAndIcon': {
            return (targetProto + '更该模型和图标为' + actor);
        }
        case 'Market': {
            oString = getString('42074');
            oString = oString.replace('%1!s!', actor);
            oString = oString.replace('%2!s!', effect['@component'] == 'BuyFactor' ? getString('42070') : getString('42071'));
            oString = oString.replace('%3!.0f!%', (Sub(effect['@amount'], 1)) * 100).replace('+-', '-');
            break;
        }
        case 'SubCivAllianceCostMultiplier': {
            //HCAdvancedTradingPost{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.65","_subtype":{"SubCivAllianceCostMultiplier","_relativity":{"Percent"}
            break;
        }
        case 'UpdateVisual': {
            //HCArtilleryCombatOttoman{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"UpdateVisual","_unittype":{"Falconet","_relativity":{"Absolute"}
            break;
        }
        case 'AutoAttackType': {
            //HCXPPioneers2{"target":{{"_type":{"ProtoUnit","__text":{"AbstractVillager"},"_type":{"Data",['@amount']":{"1.00","_tactic":{"Normal","_subtype":{"AutoAttackType","_unittype":{"LogicalTypeRangedUnitsAutoAttack","_relativity":{"Absolute"}
            break;
        }
        case 'UnitHelpOverride': {
            //HCXPRenegadoAllies{"target":{{"_type":{"ProtoUnit","__text":{"SaloonOutlawRifleman"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"UnitHelpOverride","_proto":{"deSaloonOwlhoot","_relativity":{"Absolute"}
            break;
        }
        case 'DisplayedRange': {
            //HCXPUnction{"target":{{"_type":{"ProtoUnit","__text":{"Missionary"},"_type":{"Data",['@amount']":{"34.00","_subtype":{"DisplayedRange","_relativity":{"Assign"}
            break;
        }
        case 'Snare': {
            //HCXPAdvancedScouts{"target":{{"_type":{"ProtoUnit","__text":{"NativeScout"},"_type":{"Data","_action":{"MeleeHandAttack",['@amount']":{"1.00","_subtype":{"Snare","_relativity":{"Assign"}
            break;
        }
        case 'UnitRegenRate': {
            oString = actor + ':{ 生命值恢复速度 ' + getRelativity(effect['@relativity'], effect['@amount']);
            break;
        }
        case 'SetUnitType': {
            //DEHCDominions{"target":{{"_type":{"ProtoUnit","__text":{"deTorp"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"SetUnitType","_unittype":{"HCGatherPointPri3","_relativity":{"Assign"}
            break;
        }
        case 'ArmorType': {
            //DEHCSveaLifeguard{"target":{{"_type":{"ProtoUnit","__text":{"deCarolean"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"ArmorType","_newtype":{"Ranged","_relativity":{"Absolute"}
            break;
        }
        case 'BountyResourceOverride': {
            //DEHCREVCorsairCaptain{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"BountyResourceOverride","_unittype":{"Building","_resource":{"Gold","_relativity":{"Assign"}
            break;
        }
        case 'InitialTactic': {
            //DEHCREVLetterOfMarque{"target":{{"_type":{"ProtoUnit","__text":{"SaloonPirate"},"_type":{"Data",['@amount']":{"1.00","_tactic":{"Volley","_subtype":{"InitialTactic","_forceapply":{"true","_relativity":{"Assign"}
            break;
        }
        case 'SharedSettlerBuildLimit': {
            //DEHCREVHuguenots{"target":{{"_type":{"ProtoUnit","__text":{"Coureur"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"SharedSettlerBuildLimit","_relativity":{"Assign"}
            break;
        }
        case 'CopyTacticAnims': {
            //DEHCREVHonorGuard{"target":{{"_type":{"ProtoUnit","__text":{"Dragoon"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"CopyTacticAnims","_fromtactic":{"MeleeLance","_totactic":{"Melee","_relativity":{"Assign"}
            break;
        }
        case 'UpgradeSubCivAlliance': {
            //DEHCREVNativeAllies{"target":{{"_type":{"Player"},"_civ":{"Comanche","_type":{"Data",['@amount']":{"1.00","_subtype":{"UpgradeSubCivAlliance","_relativity":{"Absolute"}
            break;
        }
        case 'SpeedModifier': {
            //DEHCTrampleTactics{"target":{{"_type":{"ProtoUnit","__text":{"deFinnishRider"},"_type":{"Data",['@amount']":{"0.25","_tactic":{"Trample","_subtype":{"SpeedModifier","_relativity":{"Absolute"}
            break;
        }
        case 'SetNextResearchFree': {
            //DEHCFedGeneralAssembly{"target":{{"_type":{"ProtoUnit","__text":{"deStateCapitol"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"SetNextResearchFree","_relativity":{"Assign"}
            break;
        }
        case 'PartisanUnit': {
            //DEHCFedAlamo{"target":{{"_type":{"ProtoUnit","__text":{"FortFrontier"},"_type":{"Data",['@amount']":{"17.00","_subtype":{"PartisanUnit","_unittype":{"deMinuteman","_relativity":{"Assign"}
            break;
        }
        case 'GatherResourceOverride': {
            //DEHCFedOysterPirates{"target":{{"_type":{"ProtoUnit","__text":{"deSloop"},"_type":{"Data2","_action":{"Gather",['@amount']":{"0.90","_subtype":{"GatherResourceOverride","_resource":{"Gold","_unittype":{"AbstractFish","_relativity":{"Assign"}
            break;
        }
        case 'EnableDodge': {
            //DEHCHulks{"target":{{"_type":{"ProtoUnit","__text":{"xpIronclad"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"EnableDodge","_relativity":{"Assign"}
            break;
        }
        case 'DodgeChance': {
            //DEHCHulks{"target":{{"_type":{"ProtoUnit","__text":{"xpIronclad"},"_type":{"Data",['@amount']":{"25.00","_subtype":{"DodgeChance","_relativity":{"Assign"}
            break;
        }
        case 'CalculateInfluenceCost': {
            //DEHCWeaponImports{"target":{{"_type":{"ProtoUnit","__text":{"Falconet"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"CalculateInfluenceCost","_calctype":{"1","_relativity":{"Assign"}
            break;
        }
        case 'BuildBountySpecific': {
            //DEHCRoyalArchitecture{"target":{{"_type":{"ProtoUnit","__text":{"Building"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"BuildBountySpecific","_resource":{"Influence","_relativity":{"DefaultValue"}
            break;
        }
        case 'MaintainTrainPoints': {
            //DEHCFasterTrainingUnitsAfrican{"target":{{"_type":{"ProtoUnit","__text":{"AbstractAfricanHero"},"_type":{"Data","_action":{"HeroRespawn",['@amount']":{"0.85","_subtype":{"MaintainTrainPoints","_relativity":{"BasePercent"}
            break;
        }
        case 'LivestockRecoveryRate': {
            //DEHCAdvancedLivestockMarket{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.50","_subtype":{"LivestockRecoveryRate","_resource":{"Wood","_relativity":{"BasePercent"}
            break;
        }
        case 'deLivestockMarket': {
            //DEHCAdvancedLivestockMarket{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.80","_subtype":{"deLivestockMarket","_component":{"BuyFactor","_relativity":{"Percent"}
            break;
            //复制图标
        }
        case 'CopyTechIcon': {
            oString = getTarget(effect.target['#text'], effect.target['@type']) + ' :{从 ' + getTarget(effect['@tech'], 'Tech') + ' 复制图标';
            break;
        }
        case 'RevealEnemyLOS': {
            //DEHCSPCMaraboutNetwork{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"RevealEnemyLOS","_unittype":{"TradingPost","_relativity":{"Absolute"}
            break;
        }
        case 'GatheringMultiplier': {
            //DEHCSPCReputedMarkets{"target":{{"_type":{"ProtoUnit","__text":{"Herdable"},"_type":{"Data","_action":{"AutoGatherInfluence",['@amount']":{"1.10","_subtype":{"GatheringMultiplier","_relativity":{"BasePercent"}
            break;
        }
        case 'UnitRegenAbsolute': {
            //DEHCJesuitSpirituality{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"UnitRegenAbsolute","_unittype":{"UnitClass","_relativity":{"Assign"}
            break;
        }
        case 'LivestockExchangeRate': {
            //DEHCKarrayyuPastoralism{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.80","_subtype":{"LivestockExchangeRate","_resource":{"Wood","_relativity":{"Absolute"}
            break;
        }
        case 'AddContainedType': {
            //DEHCKatsinaFortifications{"target":{{"_type":{"ProtoUnit","__text":{"deTower"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"AddContainedType","_unittype":{"deBowmanLevy","_relativity":{"Assign"}
            break;
        }
        case 'EmpowerArea': {
            //DEHCMaguzawa{"target":{{"_type":{"ProtoUnit","__text":{"deGriot"},"_type":{"Data2","_action":{"Empower",['@amount']":{"1.50","_subtype":{"EmpowerArea","_empowertype":{"enemy","_unittype":{"Military","_relativity":{"Absolute"}
            break;
        }
        case 'EmpowerModify': {
            //DEHCMaguzawa{"target":{{"_type":{"ProtoUnit","__text":{"deGriot"},"_type":{"Data2","_action":{"Empower",['@amount']":{"1.50","_subtype":{"EmpowerModify","_empowertype":{"enemy","_unittype":{"Military","_modifytype":{"HealRate","_relativity":{"BasePercent"}
            break;
        }
        case 'CarryCapacity': {
            //DEHCKilishiJerky{"target":{{"_type":{"ProtoUnit","__text":{"AbstractBovine"},"_type":{"Data",['@amount']":{"100.00","_subtype":{"CarryCapacity","_resource":{"Food","_relativity":{"Absolute"}
            break;
        }
        case 'AgeUpCostAbsoluteKillXPFactor': {
            //DEHCEraPrinces{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"3.00","_subtype":{"AgeUpCostAbsoluteKillXPFactor","_relativity":{"Assign"}
            break;
        }
        case 'AgeUpCostAbsoluteRateCap': {
            //DEHCEraPrinces{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.01","_subtype":{"AgeUpCostAbsoluteRateCap","_relativity":{"Assign"}
            break;
        }
        case 'DeadTransform': {
            //DEHCChichimecaRebellion{"target":{{"_type":{"ProtoUnit","__text":{"AbstractVillager"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"DeadTransform","_unittype":{"xpWarrior","_relativity":{"Assign"}
            break;
        }
        case 'NextAgeUpTimeFactor': {
            //DEHCCalmecac{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.50","_subtype":{"NextAgeUpTimeFactor","_relativity":{"Assign"}
            break;
        }
        case 'NextAgeUpDoubleEffect': {
            //DEHCFedMXArteagaReforms{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"NextAgeUpDoubleEffect","_relativity":{"Assign"}
            break;
        }
        case 'PowerROF': {
            //DEHCFedMXZaragozaLands{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.025","_subtype":{"PowerROF","_protopower":{"deAbilityInspiringFlag","_relativity":{"Percent"}
            break;
        }
        case 'PlacementRulesOverride': {
            //DEHCFedMXZaragozaLands{"target":{{"_type":{"ProtoUnit","__text":{"deInspiringFlag"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"PlacementRulesOverride","_unittype":{"deInspiringFlagRuleOverride","_relativity":{"Absolute"}
            break;
        }
        case 'ModifyRate': {
            //DEHCFedMXNationalServant{"target":{{"_type":{"ProtoUnit","__text":{"dePadre"},"_type":{"Data","_action":{"AreaHeal",['@amount']":{"3.00","_subtype":{"ModifyRate","_relativity":{"BasePercent"}
            break;
        }
        case 'FreeRepair': {
            //DEHCPorfiriato{"target":{{"_type":{"ProtoUnit","__text":{"Factory"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"FreeRepair","_relativity":{"Assign"}
            break;
        }
        case 'CostBuildingTechs': {
            //DEHCPorfiriato{"target":{{"_type":{"ProtoUnit","__text":{"Factory"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"CostBuildingTechs","_resource":{"Gold","_relativity":{"Assign"}
            break;
        }
        case 'RemoveUnits': {
            //DEHCREVMXTehuantepecRoute{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"RemoveUnits","_unittype":{"deSloop","_relativity":{"Assign"}
            break;
        }
        case 'ActionAddAttachingUnit': {
            //DEHCREVFedMXJungleWarfare{"target":{{"_type":{"ProtoUnit","__text":{"deEmboscador"},"_type":{"Data","_action":{"DefendRangedAttack",['@amount']":{"1.00","_subtype":{"ActionAddAttachingUnit","_unittype":{"PoisonAttachment","_relativity":{"Absolute"}
            break;
        }
        case 'TradeMonopoly': {
            //DEHCREVMXAnnexation{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"TradeMonopoly","_relativity":{"Absolute"}
            break;
        }
        case 'SetForceFullTechUpdate': {
            //DEHCSevenLaws{"target":{{"_type":{"ProtoUnit","__text":{"deSoldado"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"SetForceFullTechUpdate","_relativity":{"Assign"}
            break;
        }
        case 'ScoreValue': {
            //DEHCAuberges{"target":{{"_type":{"ProtoUnit","__text":{"ypConsulateLifeGuard"},"_type":{"Data",['@amount']":{"220.00","_subtype":{"ScoreValue","_relativity":{"Assign"}
            break;
        }
        case 'AttackPriority': {
            //DEHCAlpini{"target":{{"_type":{"ProtoUnit","__text":{"deBersagliere"},"_type":{"Data",['@amount']":{"50.00","_tactic":{"Volley","_subtype":{"AttackPriority","_unittype":{"AbstractHeavyInfantry","_relativity":{"Absolute"}
            break;
        }
        case 'TacticArmor': {
            //DEHCHeavyPaveses{"target":{{"_type":{"ProtoUnit","__text":{"dePavisier"},"_type":{"Data",['@amount']":{"0.15","_subtype":{"TacticArmor","_tactic":{"Volley","_armortype":{"Ranged","_relativity":{"Absolute"}
            break;
        }
        case 'NextAgeUpCostAbsoluteShipmentRate': {
            //DEHCHouseOfTrastamara{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"-80.00","_subtype":{"NextAgeUpCostAbsoluteShipmentRate","_relativity":{"Assign"}
            break;
        }
        case 'NextAgeUpTimeFactorShipmentRate': {
            //DEHCHouseOfTrastamara{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"-0.085","_subtype":{"NextAgeUpTimeFactorShipmentRate","_relativity":{"Assign"}
            break;
        }
        case 'FreeBuildRate': {
            //DEHCFreemasonry{"target":{{"_type":{"ProtoUnit","__text":{"deArchitect"},"_type":{"Data","_action":{"Build",['@amount']":{"1.65","_subtype":{"FreeBuildRate","_unittype":{"Building","_relativity":{"BasePercent"}
            break;
        }
        case 'AnimationRate': {
            //DEHCExplorerItalian{"target":{{"_type":{"ProtoUnit","__text":{"Explorer"},"_type":{"Data","_action":{"Discover",['@amount']":{"4.00","_subtype":{"AnimationRate","_relativity":{"Assign"}
            break;
        }
        case 'InvestResource': {
            //DEHCMonteDiPieta{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"700.00","_subtype":{"InvestResource","_resource":{"Gold","_relativity":{"Absolute"}
            break;
        }
        case 'PowerDataOverride': {
            //DEHCFlintlockRockets{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"PowerDataOverride","_fromprotopower":{"dePassiveAbilityMortar","_toprotopower":{"dePassiveAbilityMortarMaltese","_relativity":{"Percent"}
            break;
        }
        case 'RevealMap': {
            //DEHCMarcoPoloVoyages{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"RevealMap","_relativity":{"Absolute"}
            break;
        }
        case 'VeterancyEnable': {
            //DEHCFrenchRoyalArmy{"target":{{"_type":{"ProtoUnit","__text":{"Musketeer"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"VeterancyEnable","_relativity":{"Absolute"}
            break;
        }
        case 'VeterancyBonus': {
            //DEHCFrenchRoyalArmy{"target":{{"_type":{"ProtoUnit","__text":{"Musketeer"},"_type":{"Data",['@amount']":{"1.05","_subtype":{"VeterancyBonus","_rank":{"0","_modifytype":{"MaxHP","_relativity":{"Assign"}
            break;
        }
        case 'GrantsPowerDuration': {
            //DEHCAncienRegime{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"GrantsPowerDuration","_protopower":{"deNatPowerRoyalMarch","_relativity":{"Assign"}
            break;
        }
        case 'EnableAutoFormations': {
            //DEHCFortySevenRonin{"target":{{"_type":{"ProtoUnit","__text":{"ypWaywardRonin"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"EnableAutoFormations","_relativity":{"Assign"}
            break;
        }
        case 'ProtoUnitFlag': {
            //DEHCDutchBattleshipCard{"target":{{"_type":{"ProtoUnit","__text":{"deMercBattleship"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"ProtoUnitFlag","_flagid":{"241","_relativity":{"Assign"}
            break;
        }
        case 'TechCostAbsoluteBountyRate': {
            //AAStandardStartingTechs{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"-1.00","_subtype":{"TechCostAbsoluteBountyRate","_relativity":{"Assign"}
            break;
        }
        case 'PlayerSpecificTrainLimitPerAction': {
            //YPAaaTesting{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"10.00","_subtype":{"PlayerSpecificTrainLimitPerAction","_relativity":{"Absolute"}
            break;
        }
        case 'XPRate': {
            //ypXPRate{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"3.00","_subtype":{"XPRate","_relativity":{"Absolute"}
            break;
        }
        case 'HomeCityBucketCountPoints': {
            //SPCNoSettlerShipment{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"HomeCityBucketCountPoints","_unittype":{"Settler","_relativity":{"Assign"}
            break;
        }
        case 'HomeCityBucketMinCount': {
            //SPCNoSettlerShipment{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"HomeCityBucketMinCount","_unittype":{"Settler","_relativity":{"Assign"}
            break;
        }
        case 'HomeCityBucketMaxCount': {
            //SPCNoSettlerShipment{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"HomeCityBucketMaxCount","_unittype":{"Settler","_relativity":{"Assign"}
            break;
        }
        case 'HomeCityBucketCountIncrement': {
            //SPCNoSettlerShipment{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"HomeCityBucketCountIncrement","_unittype":{"Settler","_relativity":{"Assign"}
            break;
        }
        case 'UpgradeTradeRoute': {
            //TradeRouteUpgrade1{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"UpgradeTradeRoute","_relativity":{"Absolute"}
            break;
        }
        case 'SetCivRelation': {
            //ypBigConsulateBritish{"target":{{"_type":{"Player"},"_civ":{"British","_type":{"Data",['@amount']":{"0.00","_subtype":{"SetCivRelation","_relativity":{"Absolute"}
            break;
        }
        case 'UpgradeAllTradeRoutes': {
            //DETradeRouteUpgradeAll1{"target":{{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"UpgradeAllTradeRoutes","_relativity":{"Absolute"}
            break;
        }
        case 'ConversionDelay': {
            //DEEliteInca{"target":{{"_type":{"ProtoUnit","__text":{"dePriestess"},"_type":{"Data","_action":{"Convert",['@amount']":{"-1.20","_subtype":{"ConversionDelay","_relativity":{"Absolute"}
            break;
        }
        case 'ConversionResistance': {
            //DEAutoConversionResistance{"target":{{"_type":{"ProtoUnit","__text":{"AbstractHandInfantry"},"_type":{"Data",['@amount']":{"1.50","_subtype":{"ConversionResistance","_relativity":{"Percent"}
            break;
        }
        case 'RechargeTime': {
            //DESaloonBeverages{"target":{{"_type":{"ProtoUnit","__text":{"AbstractOutlaw"},"_type":{"Data",['@amount']":{"0.30","_subtype":{"RechargeTime","_relativity":{"BasePercent"}
            break;
        }
        case 'AuxRechargeTime': {
            //DESaloonBeverages{"target":{{"_type":{"ProtoUnit","__text":{"Hero"},"_type":{"Data",['@amount']":{"0.30","_subtype":{"AuxRechargeTime","_relativity":{"BasePercent"}
            break;
        }
        case 'SquareAura': {
            //DENatGhorfas{"target":{{"_type":{"ProtoUnit","__text":{"Mill"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"SquareAura","_relativity":{"Assign"}
            break;
        }
        case 'ProtoActionAdd': {
            //DENatYorubaHerbalism{"target":{{"_type":{"ProtoUnit","__text":{"LogicalTypeLandEconomy"},"_type":{"Data","_protoaction":{"HealWithResources",['@amount']":{"1.00","_subtype":{"ProtoActionAdd","_unittype":{"deResourceHealingContainer","_relativity":{"Assign"}
            break;
        }
        case 'UnitRegenRateLimit': {
            //DENatYorubaWrestling{"target":{{"_type":{"ProtoUnit","__text":{"xpWarrior"},"_type":{"Data",['@amount']":{"0.2505","_subtype":{"UnitRegenRateLimit","_relativity":{"Absolute"}
            break;
        }
        case 'LivestockMinCapacityKeepUnit': {
            //DECowLoans{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"LivestockMinCapacityKeepUnit","_relativity":{"Assign"}
            break;
        }
        case 'NextAgeUpTimeAbsolute': {
            //DETimbuktuManuscripts{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"-50.00","_subtype":{"NextAgeUpTimeAbsolute","_relativity":{"Assign"}
            break;
        }
        case 'SplitCost': {
            //DEAllegianceArabMercenaryGold{"target":{{"_type":{"ProtoUnit","__text":{"Mercenary"},"_type":{"Data",['@amount']":{"0.50","_subtype":{"SplitCost","_resource":{"Influence","_resource2":{"Gold","_relativity":{"BasePercent"}
            break;
        }
        case 'UseRandomNames': {
            //DERevolutionMXCentralAmerica{"target":{{"_type":{"ProtoUnit","__text":{"dePadre"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"UseRandomNames","_randomnametype":{"2","_relativity":{"Assign"}
            break;
        }
        case 'Attack': {
            //deWarshipAttack{"target":{{"_type":{"ProtoUnit","__text":{"AbstractWarShip"},"_type":{"Data",['@amount']":{"1.05","_subtype":{"Attack","_relativity":{"BasePercent"}
            break;
        }
        case 'InvestmentEnable': {
            //DEAge0Italians{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"InvestmentEnable","_relativity":{"Absolute"}
            break;
        }
        case 'BountyResourceExtra': {
            //DESPCMercenaryBounties{"target":{{"_type":{"Player"},"_type":{"Data2",['@amount']":{"1.00","_subtype":{"BountyResourceExtra","_unittype":{"Unit","_resource":{"Gold","_priority":{"1","_bountyrate":{"30.00","_relativity":{"Assign"}
            break;
        }
        case 'AutoGatherBonus': {
            //DESPCThirtyYeatsWarSetup{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.50","_subtype":{"AutoGatherBonus","_relativity":{"Assign"}
            break;
        }
        case 'FakeConversion': {
            //DESPCDelugeSetup{"target":{{"_type":{"ProtoUnit","__text":{"AbstractSPCVillageBuilding"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"FakeConversion","_relativity":{"Assign"}
            break;
        }
        case 'Strelet': {
            //euTreasureTechRifleInfantryBonusHP{"target":{{"_type":{"ProtoUnit","__text":{"AbstractRifleman"},"_type":{"Data",['@amount']":{"0.10","_subtype":{"Strelet","_unittype":{"AbstractHeavyInfantry","_allactions":{"1","_relativity":{"Absolute"}
            break;
        }
        case 'TradeRouteBonusTeam': {
            //DESPCZlotyTax{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"50.00","_subtype":{"TradeRouteBonusTeam","_resource":{"Gold","_relativity":{"Absolute"}
            break;
        }
        case 'BountySpecificBonus': {
            //DESPCWeddingOfMagdeburg{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"50.00","_subtype":{"BountySpecificBonus","_resource":{"Gold","_relativity":{"Absolute"}
            break;
        }
        case 'EnableTechXPReward': {
            //DENatBourbonReforms{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"EnableTechXPReward","_relativity":{"Assign"}
            break;
        }
        case 'MarketReset': {
            //DENatWettinTradeFair{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"1.00","_subtype":{"MarketReset","_relativity":{"Assign"}
            break;
        }
        case 'SendRandomCard': {
            //DENatHanoverRoyalCardGames{"target":{{"_type":{"Player"},"_type":{"Data",['@amount']":{"0.00","_subtype":{"SendRandomCard","_relativity":{"Absolute"}
            break;
        }
        case 'AdjustResource': {
            oString = effect.applystring;
            oString.replace('%1!s!', '玩家').replace('%2!d!', effect.amount).replace('%3!s!', targetProto)
            break;
        }
        case 'information': {
            break;
        }
        case 'ConvertUnit': {
            break;
        }
        case 'SpawnUnit': {
            break;
        }
        case 'AdjustSpeed': {
            break;
        }
        case 'AdjustHP': {
            break;
        }
        case 'GiveTech': {
            break;
        } default: {
            oString = JSON.stringify(effect);
            break;
        }
    }
}