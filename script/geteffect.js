function relativity(type, text) {
    switch (type) {
        case 'Assign':
            return '设置为 ' + text;
        case 'Absolute':
            text = text * 1;
            return (text > 0 ? '+' : '-') + Math.abs(text);
        case 'Percent':
            return '设置为 ' + (text * 100) + '%';
        case 'BasePercent':
            text = text * 1;
            return (text > 1 ? '+' : '-') + (Math.abs((Sub(text, 1)) * 100)) + '%';
        default:
            return '未知';
    }
}

function targetType(target, type) {
    if (!target) return '未知';
    switch (type) {
        case 'ProtoUnit':
            return ' <ruby>' + ((!unitTypes[target.toLowerCase()]) ? (getProto(target).displayname) : (unitTypes[target.toLowerCase()])) + '<rt>' + target + '</rt></ruby> ';
        case 'Resource':
            return ' <ruby>' + ((!unitTypes[target.toLowerCase()]) ? '未知' : unitTypes[target.toLowerCase()]) + '<rt>' + target + '</rt></ruby> ';
        case 'Player':
            return ' 玩家 ';
        case 'Tech':
            return ' <ruby>' + getTech(target).displayname + '<rt>' + target + '</rt></ruby>';
        case 'techAll':
            return ' 所有科技 ';
        case 'techWithFlag':
            return ' 所有' + target + '科技 ';
        default:
            return ' ' + target + ' ';
    }
}

function actionType(action, allactions, proto) {
    if (allactions == '1') return strings['42044'].__text;
    if (!action) return ' 未知 ';
    let unit = getProto(proto);

    if (!!unit) {
        let tactic = getXml('./Data/tactics/' + unit.tactics);
        if (allactions == 'CommandAdd') {
            return action;
        }
        tactic = returnList(tactic.tactics.action);
        let actions = {};
        for (i in tactic) {
            let action = tactic[i];
            action.displayname = getString(action.name._stringid);
            actions[action.name.__text] = action;
        }
        return ' <ruby>' + ((!returnNode(actions[action]).displayname) ? "未知" : returnNode(actions[action]).displayname) + '<rt>' + action + '</rt></ruby> ';
    }
    switch (action) {
        case 'Gather':
            return strings['42178'].__text;
        default:
            return action;
    }
}

function subType(effect) {
    let actor = targetType(effect.target.__text, effect.target._type);
    let target = targetType(returnNode(effect._unittype), 'ProtoUnit');
    let resource = targetType(returnNode(effect._resource), 'ProtoUnit');
    let info = '';
    switch (effect._subtype) {
        case 'Enable':
            return (((effect._amount) * 1 > 0 ? '启用' : '禁用') + '建造 ' + actor);
        case 'AllowedAge':
            return (actor + '：建造时代' + ((effect._amount * 1) > 0 ? "推迟" : "提前") + Math.abs(effect._amount * 1) + '个时代');
        case 'BuildLimit':
            info = strings['90125'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'TrainPoints':
            info = strings['90119'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'BuildPoints':
            info = strings['90120'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'ResearchPoints':
            info = strings['90138'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'Hitpoints':
            info = strings['90116'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'Armor':
            info = strings['90141'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'MaximumVelocity':
            info = strings['90118'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'LOS':
            info = strings['90118'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'CommunityPlazaWeight':
            info = strings['80568'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'MaximumRange':
            info = strings['90128'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect._action, effect._allactions, effect.target.__text));
            info = info.replace('%3!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'Cost':
            info = strings['90127'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', targetType(effect._resource, 'Resource'));
            info = info.replace('%3!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'Lifespan':
            return (actor + '：' + '存在时间 ' + relativity(effect._relativity, effect._amount));
        case 'Damage':
            info = strings['90130'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect._action, effect._allactions, effect.target.__text));
            info = info.replace('%3!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'DamageBonus':
            return (actor + '：' + (effect._allactions == '1' ? '所有操作' : '') + '对 ' + target + ' 的伤害加成 ' + relativity(effect._relativity, effect._amount));
        case 'DamageArea':
            info = strings['90131'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%2!s!', actionType(effect._action, effect._allactions, effect.target.__text));
            info = info.replace('%3!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'WorkRate':
            info = strings['42007'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%3!s!', target);
            info = info.replace('%2!s!', actionType(effect._action, effect._allactions, effect.target.__text));
            info = info.replace('+%4!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'WorkRateSpecific':
            info = strings['90144'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%3!s!', target);
            info = info.replace('%2!s!', actionType(effect._action, effect._allactions, effect.target.__text));
            info = info.replace('+%4!.0f!%%', relativity(effect._relativity, effect._amount));
            info = info.replace('%5!s!', targetType(effect._resource, 'Resource'));
            return info;
        case 'Yield':
            info = strings['80382'].__text;
            info = info.replace('%1!s!', actor);
            info = info.replace('%3!s!', target);
            info = info.replace('%2!s!', actionType(effect._action, effect._allactions, effect.target.__text));
            info = info.replace('变更 %4!.0f!%%', relativity(effect._relativity, effect._amount));
            return info;
        case 'FreeHomeCityUnit':
            {
                info = strings['42177'].__text;
                info = info.replace('%1!d!', effect._amount * 1);
                info = info.replace('%2!s!', target);
                return info;
            }
        case 'FreeHomeCityUnitResource':
            {
                info = strings['80529'].__text;
                info = info.replace('%1!d!', effect._amount * 1);
                info = info.replace('%2!s!', target);
                info = info.replace('%3!d!', effect._resvalue * 1);
                info = info.replace('%4!s!', resource);
                return info;
            }
        case 'FreeHomeCityUnitIfTechObtainable':
            {
                info = strings['42177'].__text;
                info = info.replace('%1!d!', effect._amount * 1);
                info = info.replace('%2!s!', target);
                return ('启用科技 <ruby>' + ((!getTech(effect._tech).displayname) ? getTech(effect._tech).displayname : '未知') + '<rt>' + effect._tech + '</rt></ruby> 时：' + info);
            }
        case 'ResourceIfTechObtainable':
            {
                info = strings['42054'].__text;
                info = info.replace('%1s', '启用科技 <ruby>' + ((!getTech(effect._tech).displayname) ? getTech(effect._tech).displayname : '未知') + '<rt>' + effect._tech + '</rt></ruby> 时：');
                info = info.replace('%2.2f', effect._amount * 1);
                info = info.replace('%3s', resource);
                return info;
            }
        case 'RevealLOS':
            return (actor + '：' + '获得视野');
        case 'ActionEnable':
            info = strings['42080'].__text;
            info = info.replace('%1s', actor);
            info = info.replace('%2s', actionType(effect._action, effect._allactions, effect.target.__text));
            info = info.replace('启用', ((effect._amount) * 1 > 0 ? '启用' : '禁用'));
            return info;
        case 'TacticEnable':
            info = strings['42080'].__text;
            info = info.replace('%1s', actor);
            info = info.replace('%2s', actionType(effect._tactic, effect._allactions, effect.target.__text));
            info = info.replace('启用', ((effect._amount) * 1 > 0 ? '启用' : '禁用'));
            info = info.replace('操作', '战术');
            return info;
        case 'EnableAutoCrateGather':
            info = strings['91766'].__text;
            info = info.replace('%1s', actor);
            info = info.replace('启用', ((effect._amount) * 1 > 0 ? '启用' : '禁用'));
            return info;
        case 'ActionDisplayName':
            return (actor + '：动作' + actionType(effect._action, effect._allactions, effect.target.__text) + '更名为 ' + strings[effect._stringid]);
        default:
            return JSON.stringify(effect);
    }
}

function getEffect(effect, tech) {
    let information = '';
    switch (effect._type) {
        //开/关科技
        case 'TechStatus':
            {
                let status = effect._status.toLowerCase();
                switch (status) {
                    case 'obtainable':
                        information = '启用';
                        break;
                    case 'unobtainable':
                        information = '关闭';
                        break;
                    case 'active':
                        information = '激活';
                        break;
                }
                information = information + '科技 <ruby>' + ((!getTech(effect.__text).displayname) ? '未知' : getTech(effect.__text).displayname + '<rt>' + effect.__text + '</rt></ruby> ');
                break;
            }
            //改变数据
        case 'Data':
            {
                information = subType(effect);
                break;
            }
        case 'Data2':
            {
                information = subType(effect);
                break;
            }
            //增加命令
        case 'CommandAdd':
            {
                information = strings['42080'].__text;
                information = information.replace('%1s', targetType(effect.target.__text, effect.target._type));
                information = information.replace('%2s', actionType((!effect._command) ? effect._proto : effect._command, 'CommandAdd', effect.target.__text));
                information = information.replace('启用', '增加');
                information = information.replace('操作', '命令');
                break;
            }
            //更改单位
        case 'TransformUnit':
            {
                information = targetType(effect._fromprotoid, 'ProtoUnit') + ' 变成 ' + targetType(effect._toprotoid, 'ProtoUnit');
                break;
            }
            //更改名称
        case 'SetName':
            {
                information = (!effect._proto ? ('科技 ' + getTech(effect._tech).displayname) : ('单位 ' + getProto(effect._proto).displayname)) + ' 更名为 ' + strings[effect._newname];
                break;
            }
            //输出消息
        case 'TextOutput':
            information = '输出消息：『' + returnNode(strings[effect.__text]) + '』';
            break;
            //输出消息
        case 'TextOutputTechName':
            information = '输出消息：『' + returnNode(strings[effect.__text]) + '』';
            break;
            //输出消息
        case 'TextEffectOutput':
            information = '输出消息：『' + returnNode(strings[effect._selfmsg]) + '』/『' + returnNode(strings[effect._playermsg]) + '』';
            break;
        default:
            information = JSON.stringify(effect);
    }
    return information.replace('%1s', tech);
}