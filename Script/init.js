'use strict';
var version = '100.15.59076.0';
var date = '2024/2/1';

var logger;
//额外列表
const extraList = {
  symbol: {
    101137: 'cStringAbstractMountainMonastery',
    25736: 'cStringEmbellishmentClass',
    42173: 'cStringSocket',
    66323: 'cStringAbstractChineseMonk',
    66351: 'cStringAbstractJapaneseMonk',
    68462: 'cStringAbstractIndianMonk',
  },
};
const tableList = {
  version: '0.1',
  unknown: {
    index: 'index',
    value: 'value',
  },
  local: {
    index: '@_locid',
    locid: '@_locid',
    symbol: '@symbol',
    text: '#text',
  },
};

function addScript(name) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', './Script/' + name + '.js');
  document.getElementsByTagName('head')[0].appendChild(script);
}

function init() {
  //检测兼容性
  if (!window.indexedDB) {
    alert('浏览器不支持 indexedDB 数据库，无法使用本工具');
    return;
  }
  //导入其他脚本
  let listScript = ['database', 'tool'];
  for (const i in listScript) {
    addScript(listScript[i]);
  }
  logger = document.getElementById('logger');
  alert('1');
}
//语言对象
class local {
  constructor(iData) {
    //检索额外symbol列表
    let symbolExtra = extraList.symbol[iData['@_locid']];
    //处理symbol
    iData['@symbol'] = (symbolExtra || iData['@symbol'] || 'null').toLowerCase();
    //处理text
    this.text = iData['#text'].replaceAll('\t', '    ');
    //构建对象
    let attrList = tableList.local;
    for (const i in attrList) {
      this[i] = iData[attrList[i]];
    }
  }
}
//单位对象
class unit {
  constructor(iData) {}
}
