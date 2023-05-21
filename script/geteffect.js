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
    for (i in effectList) {
        let iString = await getEffect(effectList[i], techName);
        oString = oString + iString + '</br>';
    }
    return oString;
}
//效果解析,包括宝藏
async function getEffect(effect, techName) {
    let oString;
    let actor;
    if (effect.target) {
        actor = await getTarget(effect.target['#text'], effect.target['@type']);
    }

    let targetProto = await getTarget(effect['@proto'], 'ProtoUnit');
    let targetUnitType = await getTarget(effect['@unittype'], 'ProtoUnit');
    let targetTech = await getTarget(effect['@tech'], 'Tech');
    let targetCommand = await getTarget(effect['@command'], 'Command');
    let targetResource = await getTarget(effect['@resource'], 'Resource');

    let fromResource = await getTarget(effect['@fromresource'], 'Resource');
    let toResource = await getTarget(effect['@toresource'], 'Resource');

    let fromProto = await getTarget(effect['@fromprotoid'], 'ProtoUnit');
    let toProto = await getTarget(effect['@toprotoid'], 'ProtoUnit');
    switch (effect['@type']) {
        //宝藏效果
        case 'Nugget': {
            //oString = subEffect(effect);
            break;
        }
        //改变数据
        case 'Data': {
            //oString = subEffect(effect);
            break;
        }
        //改变数据
        case 'Data2': {
            //oString = subEffect(effect);
            break;
        }
        //开/关科技 HCAdvancedArsenal
        case 'TechStatus': {
            let status = effect['@status'].toLowerCase();
            switch (status) {
                case 'obtainable':
                    status = ' 已启用';
                    break;
                case 'unobtainable':
                    status = ' 已禁用';
                    break;
                case 'active':
                    status = ' 已生效';
                    break;
            }
            let target = await getTarget(effect['#text'], 'Tech');
            oString = await getCString('TechSetStatusEffect');
            oString = oString.replace('%1!s!', target);
            oString = oString.replace('%2!s!', status);
            break;
        }
        //激活随机科技 DEHCPokerShadow
        case 'RandomTech': {
            let status = effect['@status'].toLowerCase();
            switch (status) {
                case 'obtainable':
                    status = ' 已启用';
                    break;
                case 'unobtainable':
                    status = ' 已禁用';
                    break;
                case 'active':
                    status = ' 已生效';
                    break;
            }
            oString = '随机 ' + effect['@select'] + ' 项科技设置为 ' + status;
            let techList = effect.tech;
            if (techList) {
                for (i in techList) {
                    techList[i] = await getTarget(techList[i], 'Tech');
                }
                oString = oString + '：[' + techList.join(', ') + ']';
            }
            break;
        }
        //激活能力 HCXPNationalRedoubt
        case 'CreatePower': {
            let protoPower = await getTarget(effect['@protopower'], 'Power');
            oString = '激活能力：' + protoPower;
            break;
        }
        //增加命令 DEHCEarlyFort
        case 'CommandAdd': {
            oString = actor + ': 增加命令 ' + targetProto + targetTech + targetCommand;
            break;
        }
        //移除命令 DEHCFedGoldRush
        case 'CommandRemove': {
            oString = actor + ': 移除命令 ' + targetProto + targetTech + targetCommand;
            break;
        }
        //置换单位 HCXPTercioTactics
        case 'TransformUnit': {
            oString = '所有 ' + fromProto + ' 转变成 ' + toProto;
            break;
        }
        //转换单位 DEHCPlanVeracruz
        case 'ReplaceUnit': {
            oString = '所有 ' + fromProto + ' 转变成 ' + toProto;
            break;
        }
        //更改名称 HCAdvancedArsenal
        case 'SetName': {
            let newName = await getString(effect['@newname']);
            oString = targetTech + targetProto + ': 更名为 ' + newName;
            break;
        }
        //输出消息 HCAdvancedArsenal
        case 'TextOutput': {
            oString = await getString(effect['#text']);
            oString = '输出消息：『' + oString.replace('%1!s!', techName) + '』';
            break;
        }
        //输出消息
        case 'TextOutputTechName': {
            oString = await getString(effect['#text']);
            oString = '输出消息：『' + oString.replace('%1!s!', techName) + '』';
            break;
        }
        //输出消息
        case 'TextEffectOutput': {
            let iString = await getString(effect['@playermsg']);
            oString = await getString(effect['@selfmsg']);
            oString = '输出消息：『' + oString + '』/『' + iString.replace('%s', 'Player') + '』';
            break;
        }
        //资源交换 YPHCEmpressDowager
        case 'ResourceExchange': {
            oString = '所有 ' + fromResource + ' 都将换成 ' + effect['@multiplier'] * 100 + '% 的 ' + toResource;
            break;
        }
        //建筑死亡时激活 YPHCCalltoArms1
        case 'SetOnBuildingDeathTech': {
            let target = await getTarget(effect['#text'], 'Tech');
            oString = '建筑摧毁时激活科技 ' + target + ' ' + effect['@amount'] * 1;
            if ((effect['@amount'] * 1) < (effect['@amount2'] * 1)) {
                oString = oString + '-' + effect['@amount2'] * 1 + '(存疑)';
            }
            oString = oString + ' 次';
            break;
        }
        //重置指定船运次数 DEHCShipMineWagon3
        case 'ResetHomeCityCardCount': {
            oString = targetTech + '：重置船运次数';
            break;
        }
        //重置可重复船运次数 DEHCREVFedMXPlanMonterrey
        case 'ResetResendableCards': {
            oString = '重置所有可重复运送船运次数';
            break;
        }
        //每次船运抵达时激活科技 DEHCFulaniInvasion
        case 'SetOnShipmentSentTech': {
            let target = await getTarget(effect['#text'], 'Tech');
            oString = '每次船运抵达时激活科技 ' + target + ' ' + effect['@amount'] * 1 + ' 次';
            break;
        }
        //每次完成研究时激活科技 DEHCGondolas
        case 'SetOnTechResearchedTech': {
            let target = await getTarget(effect['#text'], 'Tech');
            oString = '每次完成研究时激活科技 ' + target + ' ' + effect['@amount'] * 1 + ' 次';
            //DEHCGondolas{"_type":"SetOnTechResearchedTech",['@amount']":"1.00","__text":"DEShipItalianFishingBoat"}
            break;
        }
        //卖牲畜 DERoyalBanquet
        case 'ResourceInventoryExchange': {
            oString = '所有 ' + targetUnitType + ' 储存的 ' + fromResource + ' 兑换为 ' + effect['@multiplier'] * 100 + '% 的 ' + toResource;
            //DEHCHabbanaya{"@type":"ResourceInventoryExchange","@multiplier":"0.50","@unittype":"Herdable","@toresource":"Influence","@fromresource":"Food","#text":""}
            break;
        }
        //获得所有单位的视野 Spies
        case 'SharedLOS': {
            oString = '获得所有单位的视野';
            break;
        }
        //封锁工具 HCBlockade
        case 'Blockade': {
            oString = effect['@delay'] + ' 秒后禁止敌对发出船运';
            //HCBlockade{"_type":"Blockade","_delay":"10.00"}
            break;
        }
        //设置时代 ypConsulateJapaneseMeijiRestoration
        case 'SetAge': {
            oString = await getCString(effect['#text']);
            oString = '设置时代为 ' + oString;
            break;
        }
        //发起革命 DERevolutionPeru
        case 'InitiateRevolution': {
            oString = '发起革命';
            //XPRevolutionLouverture{"_type":"InitiateRevolution"}
            break;
        }
        //启用船运(需启用额外船运卡槽) DEPoliticianFederalNewYork
        case 'AddHomeCityCard': {
            oString = await getCString('Age' + effect['@ageprereq']);
            oString = '于 ' + oString + ' 启用船运：';
            if (effect['@unitcount'] * 1) {
                oString = oString + '<sup>' + effect['@unitcount'] + '</sup> ';
            }
            oString = oString + targetTech;
            oString = oString + ' ×' + effect['@maxcount'].replace('-1', '∞');
            if (effect['@infiniteinlastage'] * 1) {
                oString = oString + ' 🔄';
            }
            break;
        }
        //增加百分比细流 DENatBerberSaltCaravans
        case 'AddTrickleByResource': {
            let srcResource1 = await getTarget(effect['@srcresource1'], 'Resource');
            let srcResource2 = await getTarget(effect['@srcresource2'], 'Resource');
            oString = '根据 ' + srcResource1 + (srcResource2 ? '/' + srcResource2 : '') + ' <sub style="display:inline-block;width:3em;">' + effect['@minsrcvalue'] + '-</sub><sup style="position:relative;left:-3em;">' + effect['@maxsrcvalue'] + '</sup> ';
            oString = oString + '获得 ' + targetResource + ' 细流' + '<sub style="display:inline-block;width:3em;">' + effect['@minvalue'] + '-</sub><sup style="position:relative;left:-3em;">' + effect['@maxvalue'] + '</sup> ';
            //DENatBerberSaltCaravans{"_type":"AddTrickleByResource","_resource":"Gold","_minvalue":"0.001","_maxvalue":"4.0","_minsrcvalue":"1.00","_maxsrcvalue":"4000.00","_srcresource1":"Food","_srcresource2":"Wood"}
            break;
        }
        case 'ResourceExchange2': {
            //DENatAkanPalmOil{"_type":"ResourceExchange2","_multiplier":"0.50","_toresource":"Wood","_multiplier2":"0.50","_toresource2":"Gold","_fromresource":"Food"}
            break;
        }
        case 'RevertRevolution': {
            //DEReturnMXCentralAmerica{"_type":"RevertRevolution","_selfmsg":"112858","_playermsg":"112859"}
            break;
        }
        case 'UIAlert': {
            //DESPCExcommunication{"_type":"UIAlert","_reason":"Papal","_selfmsg":"-1","_playermsg":"123306","_target":"Enemy","_playername":"False","_duration":"2500"}
            break;
        }
        case 'Sound': {
            //DEVictorianEraColonialShadow{"_type":"Sound","__text":"AgeAdvance"}
            break;
        }
        case 'ForbidTech': {
            //DECircleArmyShadow1Switch{"_type":"ForbidTech",['@amount']":"0.00","__text":"DECircleArmyIndicator"}
            break;
        }
        case 'ResetActiveOnce': {
            //DECircleArmyShadow1Switch{"_type":"ResetActiveOnce","__text":"DECircleArmyShadow2Switch"}
            break;
        }
        case 'HomeCityCardMakeInfinite': {
            //DESebastopolMortarRepeatShadow{"_type":"HomeCityCardMakeInfinite","_tech":"DEHCShipSebastopolMortarRepeat"}
            break;
        }
        default: {
            oString = JSON.stringify(effect);
        }
    }
    if (!oString) return '·' + JSON.stringify(effect);
    return oString.replace('%1!s!', techName);
}
//次级效果解析
async function subEffect(effect) {
    let actor = getTarget(effect.target['#text'], effect.target['@type']);
    let target = getTarget(effect['@unittype'], 'ProtoUnit');
    let resource = getTarget(effect['@resource'], 'Resource');
    let subtype = effect['@subtype'] ? effect['@subtype'] : effect.type;
    let info = '';
    switch (subtype) {
        //启用/禁用单位
        case 'Enable':
            switch (effect['@amount']) {
                case '0.00':
                    info = getString('42065');
                    break;
                case '1.00':
                    info = getString('42064');
                    break;
                default:
                    info = '未知';
            }
            info = info.replace('%1!s!', actor);
            return info;
        case 'AllowedAge':
            return (actor + '：建造时代' + ((effect['@amount'] * 1) > 0 ? "推迟" : "提前") + Math.abs(effect['@amount'] * 1) + '个时代');
        case 'PopulationCap':
            return (actor + '：人口上限' + relativity(effect['@relativity'], effect['@amount']));
        case 'BuildLimit':
            info = getString('42003');
            info = info.replace('%1!s!', actor);
            info = info.replace('+%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'TrainPoints':
            info = getString('90119');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'BuildPoints':
            info = getString('90120');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'ResearchPoints':
            info = getString('90138');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'Hitpoints':
            info = getString('90116');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'Armor':
            info = getString('90141');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'ArmorSpecific':
            info = getString('101113');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', effect['@newtype']);
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info.replace('+-', '-');
        case 'MaximumVelocity':
            info = getString('90118');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'LOS':
            info = getString('41979');
            info = info.replace('%1!s!', actor);
            info = info.replace('+%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'BuildBounty':
            info = getString('90139');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'KillBounty':
            info = getString('79848');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'CommunityPlazaWeight':
            info = getString('80568');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'MaximumRange':
            info = getString('90128');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'Cost':
            info = getString('90127');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', getTarget(effect['@resource'], 'Resource'));
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'Lifespan':
            return (actor + '：' + '存在时间 ' + relativity(effect['@relativity'], effect['@amount']));
        case 'Damage':
            info = getString('90130');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'DamageBonus':
            return (actor + '：' + (effect['@allactions'] == '1' ? '所有操作' : '') + '对 ' + target + ' 的伤害加成 ' + relativity(effect['@relativity'], effect['@amount']));
        case 'DamageArea':
            info = getString('90131');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'WorkRate':
            info = getString('42007');
            info = info.replace('%1!s!', actor);
            info = info.replace('%3!s!', target);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('+%4!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
        case 'InventoryRate':
            info = getString('42007');
            info = info.replace('%1!s!', actor);
            info = info.replace('%3!s!', target);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('+%4!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
        case 'WorkRateSpecific':
            info = getString('90144');
            info = info.replace('%1!s!', actor);
            info = info.replace('%3!s!', target);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('+%4!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            info = info.replace('%5!s!', getTarget(effect['@resource'], 'Resource'));
        case 'Yield':
            info = getString('80382');
            info = info.replace('%1!s!', actor);
            info = info.replace('%3!s!', target);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('变更 %4!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'ResourceTrickleRate':
            info = getString('90133');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', resource);
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'MinimumResourceTrickleRate':
            info = getString('90134');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', resource);
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        case 'MaximumResourceTrickleRate':
            info = getString('90135');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', resource);
            info = info.replace('%3!.0f!%%', relativity(effect['@relativity'], effect['@amount']));
            return info;
        //送兵
        case 'FreeHomeCityUnit':
            info = getString('42177');
            info = info.replace('%1!d!', effect['@amount'] * 1);
            info = info.replace('%2!s!', target);
            return info;
        case 'FreeHomeCityUnitResource':
            info = getString('80529');
            info = info.replace('%1!d!', effect['@amount'] * 1);
            info = info.replace('%2!s!', target);
            info = info.replace('%3!d!', effect['@resvalue'] * 1);
            info = info.replace('%4!s!', resource);
            return info;
        case 'FreeHomeCityUnitIfTechObtainable':
            info = getString('42177');
            info = info.replace('%1!d!', effect['@amount'] * 1);
            info = info.replace('%2!s!', target);
            return ('启用科技 <ruby>' + getTech(effect['@tech']).displayname + '<rt>' + effect['@tech'] + '</rt></ruby> 时：' + info);
        case 'ResourceIfTechObtainable':
            info = getString('42054');
            info = info.replace('%1!s!', '启用科技 <ruby>' + getTech(effect['@tech']).displayname + '<rt>' + effect['@tech'] + '</rt></ruby> 时：');
            info = info.replace('%2!.2f!', effect['@amount'] * 1);
            info = info.replace('%3!s!', resource);
            return info;
        case 'Resource':
            info = getString('42078');
            info = info.replace('%1!1s!', actor);
            info = info.replace('%2!2.2f!', effect['@amount'] * 1);
            info = info.replace('%3!3s!', resource);
            info = info.replace('增加', ' ');
            return info;
        case 'RevealLOS':
            return (actor + '：' + ((effect['@amount']) * 1 > 0 ? '获得' : '关闭') + '视野');
        case 'EnableTradeRouteLOS':
            return (((effect['@amount']) * 1 > 0 ? '获得' : '关闭') + '贸易路线视野');
        case 'ActionEnable':
            info = getString('42080');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect['@action'], effect['@allactions'], effect.target['#text']));
            info = info.replace('启用', ((effect['@amount']) * 1 > 0 ? '启用' : '禁用'));
            return info;
        case 'TacticEnable':
            info = getString('42080');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect['@tactic'], effect['@allactions'], effect.target['#text']));
            info = info.replace('启用', ((effect['@amount']) * 1 > 0 ? '启用' : '禁用'));
            info = info.replace('操作', '战术');
            return info;
        case 'EnableAutoCrateGather':
            info = getString('91766');
            info = info.replace('%1!s!', actor);
            info = info.replace('启用', ((effect['@amount']) * 1 > 0 ? '启用' : '禁用'));
            return info;
        case 'AddSharedBuildLimitUnitType':
            info = '%1!s!：%3!s!共享建造限制%2!s!';
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', target);
            info = info.replace('%3!s!', (effect['@amount']) * 1 > 0 ? '增加' : '取消');
            info = info.replace('启用', ((effect['@amount']) * 1 > 0 ? '启用' : '禁用'));
            return info;
        case 'SharedBuildLimitUnit':
            info = '%1!s!：与%2!s!共享建造限制';
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', target);
            info = info.replace('启用', ((effect['@amount']) * 1 > 0 ? '启用' : '禁用'));
            return info;
        case 'ActionDisplayName':
            return (actor + '：动作' + actionType(effect['@action'], effect['@allactions'], effect.target['#text']) + '更名为 ' + getString(effect['@stringid']));
        case 'MaximumContained':
            return (actor + '：装载空间' + relativity(effect['@relativity'], effect['@amount']));
        case 'AddTrain':
            return (actor + '：' + ((effect['@amount']) * 1 > 0 ? '添加' : '删除') + '训练' + target);
        case 'CopyUnitPortraitAndIcon':
            return (target + '更该模型和图标为' + actor);
        case 'Market':
            info = getString('42074');
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', effect['@component'] == 'BuyFactor' ? getString('42070') : getString('42071'));
            info = info.replace('%3!.0f!%', (Sub(effect['@amount'], 1)) * 100);
            return info.replace('+-', '-');
        case 'PopulationCapExtra':
            info = actor + ': 额外人口上限+' + effect['@amount'];
            return info.replace('+-', '-');
        case 'PopulationCapAddition':
            //HCColonialEstancias{"target":{"_type":"ProtoUnit","__text":"TownCenter"},"_type":"Data",['@amount']":"70.00","_subtype":"PopulationCapAddition","_relativity":"Absolute"}
            return '待测试';
        case 'SubCivAllianceCostMultiplier':
            //HCAdvancedTradingPost{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.65","_subtype":"SubCivAllianceCostMultiplier","_relativity":"Percent"}
            return '待测试';
        case 'InventoryAmount':
            //HCSilkRoadTeam{"target":{"_type":"ProtoUnit","__text":"AbstractWoodCrate"},"_type":"Data",['@amount']":"1.25","_subtype":"InventoryAmount","_resource":"Wood","_relativity":"BasePercent"}
            return '待测试';
        case 'UpdateVisual':
            //HCArtilleryCombatOttoman{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.00","_subtype":"UpdateVisual","_unittype":"Falconet","_relativity":"Absolute"}
            return '待测试';
        case 'DamageForAllRangedLogicActions':
            //HCXPPioneers2{"target":{"_type":"ProtoUnit","__text":"AbstractVillager"},"_type":"Data",['@amount']":"20.00","_subtype":"DamageForAllRangedLogicActions","_relativity":"Absolute"}
            return '待测试';
        case 'DamageForAllHandLogicActions':
            //HCXPPioneers2{"target":{"_type":"ProtoUnit","__text":"AbstractVillager"},"_type":"Data",['@amount']":"20.00","_subtype":"DamageForAllHandLogicActions","_relativity":"Absolute"}
            return '待测试';
        case 'AutoAttackType':
            //HCXPPioneers2{"target":{"_type":"ProtoUnit","__text":"AbstractVillager"},"_type":"Data",['@amount']":"1.00","_tactic":"Normal","_subtype":"AutoAttackType","_unittype":"LogicalTypeRangedUnitsAutoAttack","_relativity":"Absolute"}
            return '待测试';
        case 'ResourceByKBStat':
            //HCXPGreatHunter{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"0.10","_subtype":"ResourceByKBStat","_kbstat":"totalHuntedResources","_resource":"Food","_resourcecap":"1500.00","_relativity":"Absolute"}
            return '待测试';
        case 'UnitHelpOverride':
            //HCXPRenegadoAllies{"target":{"_type":"ProtoUnit","__text":"SaloonOutlawRifleman"},"_type":"Data",['@amount']":"1.00","_subtype":"UnitHelpOverride","_proto":"deSaloonOwlhoot","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitRandom':
            //HCXPBanditGang{"target":{"_type":"Player"},"_type":"Data",['@amount']":"19.00","_subtype":"FreeHomeCityUnitRandom","_unittype":"LogicalTypePickableOutlaw","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitByTechActiveCount':
            //HCREVShipColonialMilitia{"target":{"_type":"Player"},"_tech":"DEREVWarElephantShipShadowInf","_type":"Data",['@amount']":"1.00","_subtype":"FreeHomeCityUnitByTechActiveCount","_unittype":"ypNatWarElephant","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitShipped':
            //YPHCWokouJapanese1{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"1.00",['@amount']2":"2.00","_subtype":"FreeHomeCityUnitShipped","_unittype":"ypWokouJunk","_unittype2":"ypWokouWaywardRonin","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitByUnitCount':
            //DEHCSoldierTorps{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"FreeHomeCityUnitByUnitCount","_counttype":"AbstractTorp","_unittype":"deCarolean","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitByShipmentCount':
            //DEHCFedDelawareBlues{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"FreeHomeCityUnitByShipmentCount","_unittype":"deRegular","_includeself":"true","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitByShipmentCountResource':
            //DEHCFedFloridaCowhunters{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"2.00","_subtype":"FreeHomeCityUnitByShipmentCountResource","_unittype":"Cow","_includeself":"true","_resource":"Food","_resvalue":"150.00","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitByKBStat':
            //DEHCOromoMigrations{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"1.00","_subtype":"FreeHomeCityUnitByKBStat","_unittype":"deSettlerAfrican","_kbstat":"villagersLost","_unitcap":"14.00","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitToGatherPoint':
            //DEHCShipSanga1{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"7.00","_subtype":"FreeHomeCityUnitToGatherPoint","_unittype":"deSangaCattle","_gpunittype":"deLivestockMarket","_resource":"Food","_resvalue":"100.00","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitByKBQuery':
            //DEHCRitualGladiators{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"0.50","_subtype":"FreeHomeCityUnitByKBQuery","_unittype":"xpJaguarKnight","_queryunittype":"xpJaguarKnight","_querystate":"Dead","_unitcap":"16.00","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitResourceIfTechObtainable':
            //DEHCAltaCalifornia{"target":{"_type":"Player"},"_tech":"deCardIgnoreBuildLimit","_type":"Data2",['@amount']":"7.00","_subtype":"FreeHomeCityUnitResourceIfTechObtainable","_unittype":"Cow","_resource":"Food","_resvalue":"150.00","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitTechActiveCycle':
            //DEHCRollingArtillery{"target":{"_type":"Player"},"_tech":"DERollingArtilleryShipGatlingInf","_type":"Data",['@amount']":"3.00","_subtype":"FreeHomeCityUnitTechActiveCycle","_unittype":"xpGatlingGun","_relativity":"Absolute"}
            return '待测试';
        case 'FreeHomeCityUnitResourceIfTechActive':
            //DENatJagiellonInheritance{"target":{"_type":"Player"},"_tech":"PoliticianNaturalist","_type":"Data2",['@amount']":"2.00","_subtype":"FreeHomeCityUnitResourceIfTechActive","_unittype":"Cow","_resource":"Food","_resvalue":"150.00","_relativity":"Absolute"}
            return '待测试';
        case 'DisplayedRange':
            //HCXPUnction{"target":{"_type":"ProtoUnit","__text":"Missionary"},"_type":"Data",['@amount']":"34.00","_subtype":"DisplayedRange","_relativity":"Assign"}
            return '待测试';
        case 'PopulationCount':
            //HCXPAdvancedScouts{"target":{"_type":"ProtoUnit","__text":"NativeScout"},"_type":"Data",['@amount']":"1.00","_subtype":"PopulationCount","_relativity":"Assign"}
            return '待测试';
        case 'Snare':
            //HCXPAdvancedScouts{"target":{"_type":"ProtoUnit","__text":"NativeScout"},"_type":"Data","_action":"MeleeHandAttack",['@amount']":"1.00","_subtype":"Snare","_relativity":"Assign"}
            return '待测试';
        case 'ActionAdd':
            info = actor + ': 增加战术 ' + actionType(effect['@action'], '-1', effect['@unittype']);
            return info;
        case 'UnitRegenRate':
            info = actor + ': 生命值恢复速度 ' + relativity(effect['@relativity'], effect['@amount']);
            return info;
        case 'BuildingWorkRate':
            //YPHCBakufu{"target":{"_type":"ProtoUnit","__text":"AbstractDaimyo"},"_type":"Data",['@amount']":"1.15","_subtype":"BuildingWorkRate","_relativity":"BasePercent"}
            return '待测试';
        case 'RateOfFire':
            //DEHCCanariSupport{"target":{"_type":"ProtoUnit","__text":"deIncaSpearman"},"_type":"Data","_action":"CoverHandAttack",['@amount']":"0.80","_subtype":"RateOfFire","_relativity":"BasePercent"}
            return '待测试';
        case 'HitPoints':
            //DEHCHandUnitHitpoints{"target":{"_type":"ProtoUnit","__text":"AbstractHandInfantry"},"_type":"Data",['@amount']":"1.15","_subtype":"HitPoints","_relativity":"BasePercent"}
            return '待测试';
        case 'ResourceReturn':
            //DEHCVasa{"target":{"_type":"ProtoUnit","__text":"Frigate"},"_type":"Data",['@amount']":"100.00","_subtype":"ResourceReturn","_resource":"Gold","_relativity":"Assign"}
            return '待测试';
        case 'SetUnitType':
            //DEHCDominions{"target":{"_type":"ProtoUnit","__text":"deTorp"},"_type":"Data",['@amount']":"1.00","_subtype":"SetUnitType","_unittype":"HCGatherPointPri3","_relativity":"Assign"}
            return '待测试';
        case 'ArmorType':
            //DEHCSveaLifeguard{"target":{"_type":"ProtoUnit","__text":"deCarolean"},"_type":"Data",['@amount']":"1.00","_subtype":"ArmorType","_newtype":"Ranged","_relativity":"Absolute"}
            return '待测试';
        case 'MinimumRange':
            //DEHCCaseShot{"target":{"_type":"ProtoUnit","__text":"Falconet"},"_type":"Data","_action":"CannonAttack",['@amount']":"13.00","_subtype":"MinimumRange","_relativity":"Assign"}
            return '待测试';
        case 'BountyResourceOverride':
            //DEHCREVCorsairCaptain{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"BountyResourceOverride","_unittype":"Building","_resource":"Gold","_relativity":"Assign"}
            return '待测试';
        case 'InitialTactic':
            //DEHCREVLetterOfMarque{"target":{"_type":"ProtoUnit","__text":"SaloonPirate"},"_type":"Data",['@amount']":"1.00","_tactic":"Volley","_subtype":"InitialTactic","_forceapply":"true","_relativity":"Assign"}
            return '待测试';
        case 'SharedSettlerBuildLimit':
            //DEHCREVHuguenots{"target":{"_type":"ProtoUnit","__text":"Coureur"},"_type":"Data",['@amount']":"0.00","_subtype":"SharedSettlerBuildLimit","_relativity":"Assign"}
            return '待测试';
        case 'CopyTacticAnims':
            //DEHCREVHonorGuard{"target":{"_type":"ProtoUnit","__text":"Dragoon"},"_type":"Data",['@amount']":"1.00","_subtype":"CopyTacticAnims","_fromtactic":"MeleeLance","_totactic":"Melee","_relativity":"Assign"}
            return '待测试';
        case 'UpgradeSubCivAlliance':
            //DEHCREVNativeAllies{"target":{"_type":"Player"},"_civ":"Comanche","_type":"Data",['@amount']":"1.00","_subtype":"UpgradeSubCivAlliance","_relativity":"Absolute"}
            return '待测试';
        case 'SpeedModifier':
            //DEHCTrampleTactics{"target":{"_type":"ProtoUnit","__text":"deFinnishRider"},"_type":"Data",['@amount']":"0.25","_tactic":"Trample","_subtype":"SpeedModifier","_relativity":"Absolute"}
            return '待测试';
        case 'SetNextResearchFree':
            //DEHCFedGeneralAssembly{"target":{"_type":"ProtoUnit","__text":"deStateCapitol"},"_type":"Data",['@amount']":"1.00","_subtype":"SetNextResearchFree","_relativity":"Assign"}
            return '待测试';
        case 'ResourceByUnitCount':
            //DEHCFedTextileMill{"target":{"_type":"Player"},"_type":"Data",['@amount']":"30.00","_subtype":"ResourceByUnitCount","_unittype":"LogicalTypeLandEconomy","_resource":"Food","_relativity":"Absolute"}
            return '待测试';
        case 'PartisanUnit':
            //DEHCFedAlamo{"target":{"_type":"ProtoUnit","__text":"FortFrontier"},"_type":"Data",['@amount']":"17.00","_subtype":"PartisanUnit","_unittype":"deMinuteman","_relativity":"Assign"}
            return '待测试';
        case 'GatherResourceOverride':
            //DEHCFedOysterPirates{"target":{"_type":"ProtoUnit","__text":"deSloop"},"_type":"Data2","_action":"Gather",['@amount']":"0.90","_subtype":"GatherResourceOverride","_resource":"Gold","_unittype":"AbstractFish","_relativity":"Assign"}
            return '待测试';
        case 'EnableDodge':
            //DEHCHulks{"target":{"_type":"ProtoUnit","__text":"xpIronclad"},"_type":"Data",['@amount']":"1.00","_subtype":"EnableDodge","_relativity":"Assign"}
            return '待测试';
        case 'DodgeChance':
            //DEHCHulks{"target":{"_type":"ProtoUnit","__text":"xpIronclad"},"_type":"Data",['@amount']":"25.00","_subtype":"DodgeChance","_relativity":"Assign"}
            return '待测试';
        case 'CalculateInfluenceCost':
            //DEHCWeaponImports{"target":{"_type":"ProtoUnit","__text":"Falconet"},"_type":"Data",['@amount']":"1.00","_subtype":"CalculateInfluenceCost","_calctype":"1","_relativity":"Assign"}
            return '待测试';
        case 'BuildBountySpecific':
            //DEHCRoyalArchitecture{"target":{"_type":"ProtoUnit","__text":"Building"},"_type":"Data",['@amount']":"1.00","_subtype":"BuildBountySpecific","_resource":"Influence","_relativity":"DefaultValue"}
            return '待测试';
        case 'MaintainTrainPoints':
            //DEHCFasterTrainingUnitsAfrican{"target":{"_type":"ProtoUnit","__text":"AbstractAfricanHero"},"_type":"Data","_action":"HeroRespawn",['@amount']":"0.85","_subtype":"MaintainTrainPoints","_relativity":"BasePercent"}
            return '待测试';
        case 'LivestockRecoveryRate':
            //DEHCAdvancedLivestockMarket{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.50","_subtype":"LivestockRecoveryRate","_resource":"Wood","_relativity":"BasePercent"}
            return '待测试';
        case 'deLivestockMarket':
            //DEHCAdvancedLivestockMarket{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.80","_subtype":"deLivestockMarket","_component":"BuyFactor","_relativity":"Percent"}
            return '待测试';
        //复制图标
        case 'CopyTechIcon':
            info = getTarget(effect.target['#text'], effect.target['@type']) + ' :从 ' + getTarget(effect['@tech'], 'Tech') + ' 复制图标';
            return info;
        case 'RevealEnemyLOS':
            //DEHCSPCMaraboutNetwork{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.00","_subtype":"RevealEnemyLOS","_unittype":"TradingPost","_relativity":"Absolute"}
            return '待测试';
        case 'GatheringMultiplier':
            //DEHCSPCReputedMarkets{"target":{"_type":"ProtoUnit","__text":"Herdable"},"_type":"Data","_action":"AutoGatherInfluence",['@amount']":"1.10","_subtype":"GatheringMultiplier","_relativity":"BasePercent"}
            return '待测试';
        case 'UnitRegenAbsolute':
            //DEHCJesuitSpirituality{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"UnitRegenAbsolute","_unittype":"UnitClass","_relativity":"Assign"}
            return '待测试';
        case 'LivestockExchangeRate':
            //DEHCKarrayyuPastoralism{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.80","_subtype":"LivestockExchangeRate","_resource":"Wood","_relativity":"Absolute"}
            return '待测试';
        case 'ResourceReturnRate':
            //DEHCTEAMHausaGates{"target":{"_type":"ProtoUnit","__text":"AbstractWall"},"_type":"Data",['@amount']":"1.00","_subtype":"ResourceReturnRate","_resource":"Wood","_relativity":"Assign"}
            return '待测试';
        case 'ResourceReturnRateTotalCost':
            //DEHCTEAMHausaGates{"target":{"_type":"ProtoUnit","__text":"AbstractWall"},"_type":"Data",['@amount']":"1.00","_subtype":"ResourceReturnRateTotalCost","_relativity":"Assign"}
            return '待测试';
        case 'AddContainedType':
            //DEHCKatsinaFortifications{"target":{"_type":"ProtoUnit","__text":"deTower"},"_type":"Data",['@amount']":"1.00","_subtype":"AddContainedType","_unittype":"deBowmanLevy","_relativity":"Assign"}
            return '待测试';
        case 'GarrisonBonusDamage':
            //DEHCKatsinaFortifications{"target":{"_type":"ProtoUnit","__text":"deTower"},"_type":"Data","_action":"RangedAttack",['@amount']":"0.1","_subtype":"GarrisonBonusDamage","_unittype":"Unit","_relativity":"Assign"}
            return '待测试';
        case 'EmpowerArea':
            //DEHCMaguzawa{"target":{"_type":"ProtoUnit","__text":"deGriot"},"_type":"Data2","_action":"Empower",['@amount']":"1.50","_subtype":"EmpowerArea","_empowertype":"enemy","_unittype":"Military","_relativity":"Absolute"}
            return '待测试';
        case 'EmpowerModify':
            //DEHCMaguzawa{"target":{"_type":"ProtoUnit","__text":"deGriot"},"_type":"Data2","_action":"Empower",['@amount']":"1.50","_subtype":"EmpowerModify","_empowertype":"enemy","_unittype":"Military","_modifytype":"HealRate","_relativity":"BasePercent"}
            return '待测试';
        case 'CarryCapacity':
            //DEHCKilishiJerky{"target":{"_type":"ProtoUnit","__text":"AbstractBovine"},"_type":"Data",['@amount']":"100.00","_subtype":"CarryCapacity","_resource":"Food","_relativity":"Absolute"}
            return '待测试';
        case 'AgeUpCostAbsoluteKillXPFactor':
            //DEHCEraPrinces{"target":{"_type":"Player"},"_type":"Data",['@amount']":"3.00","_subtype":"AgeUpCostAbsoluteKillXPFactor","_relativity":"Assign"}
            return '待测试';
        case 'AgeUpCostAbsoluteRateCap':
            //DEHCEraPrinces{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.01","_subtype":"AgeUpCostAbsoluteRateCap","_relativity":"Assign"}
            return '待测试';
        case 'DeadTransform':
            //DEHCChichimecaRebellion{"target":{"_type":"ProtoUnit","__text":"AbstractVillager"},"_type":"Data",['@amount']":"1.00","_subtype":"DeadTransform","_unittype":"xpWarrior","_relativity":"Assign"}
            return '待测试';
        case 'NextAgeUpTimeFactor':
            //DEHCCalmecac{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.50","_subtype":"NextAgeUpTimeFactor","_relativity":"Assign"}
            return '待测试';
        case 'NextAgeUpDoubleEffect':
            //DEHCFedMXArteagaReforms{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"NextAgeUpDoubleEffect","_relativity":"Assign"}
            return '待测试';
        case 'PowerROF':
            //DEHCFedMXZaragozaLands{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.025","_subtype":"PowerROF","_protopower":"deAbilityInspiringFlag","_relativity":"Percent"}
            return '待测试';
        case 'PlacementRulesOverride':
            //DEHCFedMXZaragozaLands{"target":{"_type":"ProtoUnit","__text":"deInspiringFlag"},"_type":"Data",['@amount']":"1.00","_subtype":"PlacementRulesOverride","_unittype":"deInspiringFlagRuleOverride","_relativity":"Absolute"}
            return '待测试';
        case 'ModifyRate':
            //DEHCFedMXNationalServant{"target":{"_type":"ProtoUnit","__text":"dePadre"},"_type":"Data","_action":"AreaHeal",['@amount']":"3.00","_subtype":"ModifyRate","_relativity":"BasePercent"}
            return '待测试';
        case 'FreeRepair':
            //DEHCPorfiriato{"target":{"_type":"ProtoUnit","__text":"Factory"},"_type":"Data",['@amount']":"1.00","_subtype":"FreeRepair","_relativity":"Assign"}
            return '待测试';
        case 'CostBuildingTechs':
            //DEHCPorfiriato{"target":{"_type":"ProtoUnit","__text":"Factory"},"_type":"Data",['@amount']":"0.00","_subtype":"CostBuildingTechs","_resource":"Gold","_relativity":"Assign"}
            return '待测试';
        case 'RemoveUnits':
            //DEHCREVMXTehuantepecRoute{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"RemoveUnits","_unittype":"deSloop","_relativity":"Assign"}
            return '待测试';
        case 'ActionAddAttachingUnit':
            //DEHCREVFedMXJungleWarfare{"target":{"_type":"ProtoUnit","__text":"deEmboscador"},"_type":"Data","_action":"DefendRangedAttack",['@amount']":"1.00","_subtype":"ActionAddAttachingUnit","_unittype":"PoisonAttachment","_relativity":"Absolute"}
            return '待测试';
        case 'ResourceAsCratesByShipmentCount':
            //DEHCREVMXMayaCeramics{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"200.00","_subtype":"ResourceAsCratesByShipmentCount","_resource":"Gold","_includeself":"true","_relativity":"Absolute"}
            return '待测试';
        case 'HitPercent':
            //DEHCMexicanStandoff{"target":{"_type":"ProtoUnit","__text":"deSaloonDesperado"},"_type":"Data","_action":"RangedAttack",['@amount']":"25.00","_subtype":"HitPercent","_relativity":"Assign"}
            return '待测试';
        case 'DamageMultiplier':
            //DEHCMexicanStandoff{"target":{"_type":"ProtoUnit","__text":"deSaloonDesperado"},"_type":"Data","_action":"RangedAttack",['@amount']":"2.00","_subtype":"DamageMultiplier","_relativity":"Assign"}
            return '待测试';
        case 'SelfDamageMultiplier':
            //DEHCMexicanStandoff{"target":{"_type":"ProtoUnit","__text":"deSaloonDesperado"},"_type":"Data","_action":"RangedAttack",['@amount']":"0.50","_subtype":"SelfDamageMultiplier","_relativity":"Assign"}
            return '待测试';
        case 'HitPercentType':
            //DEHCMexicanStandoff{"target":{"_type":"ProtoUnit","__text":"deSaloonDesperado"},"_type":"Data","_action":"RangedAttack",['@amount']":"0.00","_subtype":"HitPercentType","_relativity":"Absolute","_hitpercenttype":"CriticalAttack"}
            return '待测试';
        case 'TradeMonopoly':
            //DEHCREVMXAnnexation{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"TradeMonopoly","_relativity":"Absolute"}
            return '待测试';
        case 'SetForceFullTechUpdate':
            //DEHCSevenLaws{"target":{"_type":"ProtoUnit","__text":"deSoldado"},"_type":"Data",['@amount']":"1.00","_subtype":"SetForceFullTechUpdate","_relativity":"Assign"}
            return '待测试';
        case 'ScoreValue':
            //DEHCAuberges{"target":{"_type":"ProtoUnit","__text":"ypConsulateLifeGuard"},"_type":"Data",['@amount']":"220.00","_subtype":"ScoreValue","_relativity":"Assign"}
            return '待测试';
        case 'ResourceByKBQuery':
            //DEHCTripToJerusalem{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"10.0","_subtype":"ResourceByKBQuery","_resource":"Wood","_queryunittype":"LogicalTypeNeededForVictory","_querystate":"Dead","_resourcecap":"750.00","_relativity":"Absolute"}
            return '待测试';
        case 'AttackPriority':
            //DEHCAlpini{"target":{"_type":"ProtoUnit","__text":"deBersagliere"},"_type":"Data",['@amount']":"50.00","_tactic":"Volley","_subtype":"AttackPriority","_unittype":"AbstractHeavyInfantry","_relativity":"Absolute"}
            return '待测试';
        case 'TacticArmor':
            //DEHCHeavyPaveses{"target":{"_type":"ProtoUnit","__text":"dePavisier"},"_type":"Data",['@amount']":"0.15","_subtype":"TacticArmor","_tactic":"Volley","_armortype":"Ranged","_relativity":"Absolute"}
            return '待测试';
        case 'NextAgeUpCostAbsoluteShipmentRate':
            //DEHCHouseOfTrastamara{"target":{"_type":"Player"},"_type":"Data",['@amount']":"-80.00","_subtype":"NextAgeUpCostAbsoluteShipmentRate","_relativity":"Assign"}
            return '待测试';
        case 'NextAgeUpTimeFactorShipmentRate':
            //DEHCHouseOfTrastamara{"target":{"_type":"Player"},"_type":"Data",['@amount']":"-0.085","_subtype":"NextAgeUpTimeFactorShipmentRate","_relativity":"Assign"}
            return '待测试';
        case 'FreeBuildRate':
            //DEHCFreemasonry{"target":{"_type":"ProtoUnit","__text":"deArchitect"},"_type":"Data","_action":"Build",['@amount']":"1.65","_subtype":"FreeBuildRate","_unittype":"Building","_relativity":"BasePercent"}
            return '待测试';
        case 'AnimationRate':
            //DEHCExplorerItalian{"target":{"_type":"ProtoUnit","__text":"Explorer"},"_type":"Data","_action":"Discover",['@amount']":"4.00","_subtype":"AnimationRate","_relativity":"Assign"}
            return '待测试';
        case 'InvestResource':
            //DEHCMonteDiPieta{"target":{"_type":"Player"},"_type":"Data",['@amount']":"700.00","_subtype":"InvestResource","_resource":"Gold","_relativity":"Absolute"}
            return '待测试';
        case 'PowerDataOverride':
            //DEHCFlintlockRockets{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"PowerDataOverride","_fromprotopower":"dePassiveAbilityMortar","_toprotopower":"dePassiveAbilityMortarMaltese","_relativity":"Percent"}
            return '待测试';
        case 'RevealMap':
            //DEHCMarcoPoloVoyages{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"RevealMap","_relativity":"Absolute"}
            return '待测试';
        case 'VeterancyEnable':
            //DEHCFrenchRoyalArmy{"target":{"_type":"ProtoUnit","__text":"Musketeer"},"_type":"Data",['@amount']":"1.00","_subtype":"VeterancyEnable","_relativity":"Absolute"}
            return '待测试';
        case 'VeterancyBonus':
            //DEHCFrenchRoyalArmy{"target":{"_type":"ProtoUnit","__text":"Musketeer"},"_type":"Data",['@amount']":"1.05","_subtype":"VeterancyBonus","_rank":"0","_modifytype":"MaxHP","_relativity":"Assign"}
            return '待测试';
        case 'GrantsPowerDuration':
            //DEHCAncienRegime{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"GrantsPowerDuration","_protopower":"deNatPowerRoyalMarch","_relativity":"Assign"}
            return '待测试';
        case 'EnableAutoFormations':
            //DEHCFortySevenRonin{"target":{"_type":"ProtoUnit","__text":"ypWaywardRonin"},"_type":"Data",['@amount']":"1.00","_subtype":"EnableAutoFormations","_relativity":"Assign"}
            return '待测试';
        case 'ProtoUnitFlag':
            //DEHCDutchBattleshipCard{"target":{"_type":"ProtoUnit","__text":"deMercBattleship"},"_type":"Data",['@amount']":"1.00","_subtype":"ProtoUnitFlag","_flagid":"241","_relativity":"Assign"}
            return '待测试';
        case 'TechCostAbsoluteBountyRate':
            //AAStandardStartingTechs{"target":{"_type":"Player"},"_type":"Data",['@amount']":"-1.00","_subtype":"TechCostAbsoluteBountyRate","_relativity":"Assign"}
            return '待测试';
        case 'PlayerSpecificTrainLimitPerAction':
            //YPAaaTesting{"target":{"_type":"Player"},"_type":"Data",['@amount']":"10.00","_subtype":"PlayerSpecificTrainLimitPerAction","_relativity":"Absolute"}
            return '待测试';
        case 'XPRate':
            //ypXPRate{"target":{"_type":"Player"},"_type":"Data",['@amount']":"3.00","_subtype":"XPRate","_relativity":"Absolute"}
            return '待测试';
        case 'HomeCityBucketCountPoints':
            //SPCNoSettlerShipment{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.00","_subtype":"HomeCityBucketCountPoints","_unittype":"Settler","_relativity":"Assign"}
            return '待测试';
        case 'HomeCityBucketMinCount':
            //SPCNoSettlerShipment{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.00","_subtype":"HomeCityBucketMinCount","_unittype":"Settler","_relativity":"Assign"}
            return '待测试';
        case 'HomeCityBucketMaxCount':
            //SPCNoSettlerShipment{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.00","_subtype":"HomeCityBucketMaxCount","_unittype":"Settler","_relativity":"Assign"}
            return '待测试';
        case 'HomeCityBucketCountIncrement':
            //SPCNoSettlerShipment{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.00","_subtype":"HomeCityBucketCountIncrement","_unittype":"Settler","_relativity":"Assign"}
            return '待测试';
        case 'UpgradeTradeRoute':
            //TradeRouteUpgrade1{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"UpgradeTradeRoute","_relativity":"Absolute"}
            return '待测试';
        case 'PopulationCapBonus':
            //ypPopulationCapBonus{"target":{"_type":"Player"},"_type":"Data",['@amount']":"5.00","_subtype":"PopulationCapBonus","_relativity":"Absolute"}
            return '待测试';
        case 'SetCivRelation':
            //ypBigConsulateBritish{"target":{"_type":"Player"},"_civ":"British","_type":"Data",['@amount']":"0.00","_subtype":"SetCivRelation","_relativity":"Absolute"}
            return '待测试';
        case 'DamageCap':
            //ypMonasteryKillingBlowUpgrade{"target":{"_type":"ProtoUnit","__text":"AbstractJapaneseMonk"},"_type":"Data","_action":"VolleyRangedAttack",['@amount']":"1.50","_subtype":"DamageCap","_relativity":"BasePercent"}
            return '待测试';
        case 'UpgradeAllTradeRoutes':
            //DETradeRouteUpgradeAll1{"target":{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"UpgradeAllTradeRoutes","_relativity":"Absolute"}
            return '待测试';
        case 'ConversionDelay':
            //DEEliteInca{"target":{"_type":"ProtoUnit","__text":"dePriestess"},"_type":"Data","_action":"Convert",['@amount']":"-1.20","_subtype":"ConversionDelay","_relativity":"Absolute"}
            return '待测试';
        case 'ConversionResistance':
            //DEAutoConversionResistance{"target":{"_type":"ProtoUnit","__text":"AbstractHandInfantry"},"_type":"Data",['@amount']":"1.50","_subtype":"ConversionResistance","_relativity":"Percent"}
            return '待测试';
        case 'RechargeTime':
            //DESaloonBeverages{"target":{"_type":"ProtoUnit","__text":"AbstractOutlaw"},"_type":"Data",['@amount']":"0.30","_subtype":"RechargeTime","_relativity":"BasePercent"}
            return '待测试';
        case 'AuxRechargeTime':
            //DESaloonBeverages{"target":{"_type":"ProtoUnit","__text":"Hero"},"_type":"Data",['@amount']":"0.30","_subtype":"AuxRechargeTime","_relativity":"BasePercent"}
            return '待测试';
        case 'SquareAura':
            //DENatGhorfas{"target":{"_type":"ProtoUnit","__text":"Mill"},"_type":"Data",['@amount']":"1.00","_subtype":"SquareAura","_relativity":"Assign"}
            return '待测试';
        case 'ProtoActionAdd':
            //DENatYorubaHerbalism{"target":{"_type":"ProtoUnit","__text":"LogicalTypeLandEconomy"},"_type":"Data","_protoaction":"HealWithResources",['@amount']":"1.00","_subtype":"ProtoActionAdd","_unittype":"deResourceHealingContainer","_relativity":"Assign"}
            return '待测试';
        case 'UnitRegenRateLimit':
            //DENatYorubaWrestling{"target":{"_type":"ProtoUnit","__text":"xpWarrior"},"_type":"Data",['@amount']":"0.2505","_subtype":"UnitRegenRateLimit","_relativity":"Absolute"}
            return '待测试';
        case 'LivestockMinCapacityKeepUnit':
            //DECowLoans{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"LivestockMinCapacityKeepUnit","_relativity":"Assign"}
            return '待测试';
        case 'NextAgeUpTimeAbsolute':
            //DETimbuktuManuscripts{"target":{"_type":"Player"},"_type":"Data",['@amount']":"-50.00","_subtype":"NextAgeUpTimeAbsolute","_relativity":"Assign"}
            return '待测试';
        case 'SplitCost':
            //DEAllegianceArabMercenaryGold{"target":{"_type":"ProtoUnit","__text":"Mercenary"},"_type":"Data",['@amount']":"0.50","_subtype":"SplitCost","_resource":"Influence","_resource2":"Gold","_relativity":"BasePercent"}
            return '待测试';
        case 'UseRandomNames':
            //DERevolutionMXCentralAmerica{"target":{"_type":"ProtoUnit","__text":"dePadre"},"_type":"Data",['@amount']":"0.00","_subtype":"UseRandomNames","_randomnametype":"2","_relativity":"Assign"}
            return '待测试';
        case 'BuildLimitIncrement':
            //DEIncreaseMayaLimit{"target":{"_type":"ProtoUnit","__text":"deNatHolcanJavelineer"},"_type":"Data",['@amount']":"1.00","_subtype":"BuildLimitIncrement","_relativity":"Absolute"}
            return '待测试';
        case 'Attack':
            //deWarshipAttack{"target":{"_type":"ProtoUnit","__text":"AbstractWarShip"},"_type":"Data",['@amount']":"1.05","_subtype":"Attack","_relativity":"BasePercent"}
            return '待测试';
        case 'InvestmentEnable':
            //DEAge0Italians{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"InvestmentEnable","_relativity":"Absolute"}
            return '待测试';
        case 'BountyResourceExtra':
            //DESPCMercenaryBounties{"target":{"_type":"Player"},"_type":"Data2",['@amount']":"1.00","_subtype":"BountyResourceExtra","_unittype":"Unit","_resource":"Gold","_priority":"1","_bountyrate":"30.00","_relativity":"Assign"}
            return '待测试';
        case 'AutoGatherBonus':
            //DESPCThirtyYeatsWarSetup{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.50","_subtype":"AutoGatherBonus","_relativity":"Assign"}
            return '待测试';
        case 'FakeConversion':
            //DESPCDelugeSetup{"target":{"_type":"ProtoUnit","__text":"AbstractSPCVillageBuilding"},"_type":"Data",['@amount']":"0.00","_subtype":"FakeConversion","_relativity":"Assign"}
            return '待测试';
        case 'Strelet':
            //euTreasureTechRifleInfantryBonusHP{"target":{"_type":"ProtoUnit","__text":"AbstractRifleman"},"_type":"Data",['@amount']":"0.10","_subtype":"Strelet","_unittype":"AbstractHeavyInfantry","_allactions":"1","_relativity":"Absolute"}
            return '待测试';
        case 'TradeRouteBonusTeam':
            //DESPCZlotyTax{"target":{"_type":"Player"},"_type":"Data",['@amount']":"50.00","_subtype":"TradeRouteBonusTeam","_resource":"Gold","_relativity":"Absolute"}
            return '待测试';
        case 'BountySpecificBonus':
            //DESPCWeddingOfMagdeburg{"target":{"_type":"Player"},"_type":"Data",['@amount']":"50.00","_subtype":"BountySpecificBonus","_resource":"Gold","_relativity":"Absolute"}
            return '待测试';
        case 'ResourceIfTechActive':
            //DENatJagiellonInheritance{"target":{"_type":"Player"},"_tech":"YPWonderJapaneseShogunate2","_type":"Data",['@amount']":"400.00","_subtype":"ResourceIfTechActive","_resource":"XP","_relativity":"Absolute"}
            return '待测试';
        case 'EnableTechXPReward':
            //DENatBourbonReforms{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"EnableTechXPReward","_relativity":"Assign"}
            return '待测试';
        case 'DamageTimeoutTrickle':
            //DEMonasteryPhanarHesychasm{"target":{"_type":"Player"},"_type":"Data",['@amount']":"2.50","_subtype":"DamageTimeoutTrickle","_resource":"XP","_timeout":"30.00","_relativity":"Absolute"}
            return '待测试';
        case 'MarketReset':
            //DENatWettinTradeFair{"target":{"_type":"Player"},"_type":"Data",['@amount']":"1.00","_subtype":"MarketReset","_relativity":"Assign"}
            return '待测试';
        case 'SendRandomCard':
            //DENatHanoverRoyalCardGames{"target":{"_type":"Player"},"_type":"Data",['@amount']":"0.00","_subtype":"SendRandomCard","_relativity":"Absolute"}
            return '待测试';
        case 'Strelet':
            //euTreasureTechRifleInfantryBonusHP{"target":{"_type":"ProtoUnit","__text":"AbstractRifleman"},"_type":"Data",['@amount']":"0.10","_subtype":"Strelet","_unittype":"AbstractHeavyInfantry","_allactions":"1","_relativity":"Absolute"}
            return '待测试';
        case 'Strelet':
            //euTreasureTechRifleInfantryBonusHP{"target":{"_type":"ProtoUnit","__text":"AbstractRifleman"},"_type":"Data",['@amount']":"0.10","_subtype":"Strelet","_unittype":"AbstractHeavyInfantry","_allactions":"1","_relativity":"Absolute"}
            return '待测试';
        case 'AdjustResource':
            information = effect.applystring;
            information.replace('%1!s!', '玩家').replace('%2!d!', effect.amount).replace('%3!s!', target)
            break;
        case 'information':
            information = '待测试';
            break;
        case 'ConvertUnit':
            information = '待测试';
            break;
        case 'SpawnUnit':
            information = '待测试';
            break;
        case 'AdjustSpeed':
            information = '待测试';
            break;
        case 'AdjustHP':
            information = '待测试';
            break;
        case 'GiveTech':
            information = '待测试';
            break;
        default:
            return JSON.stringify(effect);
    }
}
//数值改变解析
function relativity(type, text) {
    switch (type) {
        case 'Assign':
            return '设置为 ' + text;
        case 'Absolute':
            text = text * 1;
            return (text > 0 ? '增加' : '减少') + ' ' + Math.abs(text);
        case 'Percent':
            return '设置为 ' + (text * 100) + '%';
        case 'BasePercent':
            text = text * 1;
            return (text > 1 ? '+' : '-') + ' ' + (Math.abs((Sub(text, 1)) * 100)) + '%';
        default:
            return '未知';
    }
}
//目标解析
async function getTarget(target, type) {
    if (!target) return '';
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
            } else {
                //均查询失败则
                oString = '<del>' + target + '</del>';
            }
            break;
        }
        case 'Tech': {
            iData = await getTech(target);
            if (iData) {
                oString = getRuby(iData.displayname, iData['@name']);
            } else {
                oString = '<del>' + target + '</del>';
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
        case 'Resource': {
            oString = await getCString('ResourceName' + target);
            oString = getRuby(oString, target);
            break;
        }
        case 'Player': {
            oString = '玩家';
            break;
        }
        case 'techAll': {
            oString = '所有科技';
            break;
        }
        case 'Command': {
            iData = await getCommand(target);
            if (iData) {
                oString = getRuby(iData.displayname, iData['name']);
            } else {
                oString = '<del>' + target + '</del>';
            }
            break;
        }
        case 'Power': {
            iData = await getPower(target);
            if (iData) {
                oString = getRuby(iData.displayname, iData['@name']);
            } else {
                oString = '<del>' + target + '</del>';
            }
            break;
        }
        default: {
            oString = target;
            break;
        }
    }
    return oString;
}
//动作解析
function actionType(action, allactions, proto) {
    if (allactions == '1') return getString('42044');
    if (allactions == 'CommandAdd') {
        return action;
    }
    if (!action) return ' 未知 ';
    let unit = getProto(proto);

    if (unit['@id']) {
        let tactic = getJson('./Data/tactics/' + unit.tactics + '.json');
        tactic = returnList(tactic.tactics.action);
        let actions = {};
        for (i in tactic) {
            let action = tactic[i];
            action.displayname = getString(action.name['@stringid']);
            actions[action.name['#text']] = action;
        }
        return ' <ruby>' + ((!returnNode(actions[action]).displayname) ? "未知" : returnNode(actions[action]).displayname) + '<rt>' + action + '</rt></ruby> ';
    }
    switch (action) {
        case 'Gather':
            return getString('42178');
        default:
            return action;
    }
}