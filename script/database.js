//打开数据库
async function openDB() {
    //创建打开请求,若存在则打开,否则创建
    let request = indexedDB.open('database', 1);
    //请求失败
    request.onerror = function (error) {
        console.error('数据库打开失败:' + error.target.errorCode);
    }
    //请求成功
    request.onsuccess = function (success) {
        console.log('数据库打开成功');
        database = request.result;
    }
    //更新数据库版本
    request.onupgradeneeded = function (upgrade) {
        console.log('数据库构建中');
        database = request.result;
        //表string是否存在,否则创建
        if (!database.objectStoreNames.contains('string')) {
            let objectStore = database.createObjectStore('string', {
                keyPath: 'index'
            });
            objectStore.createIndex('symbol', 'symbol', {
                unique: false
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表proto是否存在,否则创建
        if (!database.objectStoreNames.contains('proto')) {
            let objectStore = database.createObjectStore('proto', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表techtree是否存在,否则创建
        if (!database.objectStoreNames.contains('techtree')) {
            let objectStore = database.createObjectStore('techtree', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表civ是否存在,否则创建
        if (!database.objectStoreNames.contains('civ')) {
            let objectStore = database.createObjectStore('civ', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表nugget是否存在,否则创建
        if (!database.objectStoreNames.contains('nugget')) {
            let objectStore = database.createObjectStore('nugget', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表damagetype是否存在,否则创建
        if (!database.objectStoreNames.contains('damagetype')) {
            let objectStore = database.createObjectStore('damagetype', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表command是否存在,否则创建
        if (!database.objectStoreNames.contains('command')) {
            let objectStore = database.createObjectStore('command', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表homecity是否存在,否则创建
        if (!database.objectStoreNames.contains('homecity')) {
            let objectStore = database.createObjectStore('homecity', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表tactic是否存在,否则创建
        if (!database.objectStoreNames.contains('tactic')) {
            let objectStore = database.createObjectStore('tactic', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表unittype是否存在,否则创建
        if (!database.objectStoreNames.contains('unittype')) {
            let objectStore = database.createObjectStore('unittype', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表unitflag是否存在,否则创建
        if (!database.objectStoreNames.contains('unitflag')) {
            let objectStore = database.createObjectStore('unitflag', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
        //表techflag是否存在,否则创建
        if (!database.objectStoreNames.contains('techflag')) {
            let objectStore = database.createObjectStore('techflag', {
                keyPath: 'index'
            });
            objectStore.createIndex('value', 'value', {
                unique: false
            });
        }
    }
}
//关闭数据库
function colseDB() {
    database.close();
    console.log('数据库已关闭');
}
//删除数据库
async function removeDB() {
    colseDB();
    setStorage('version', '0');
    let request = indexedDB.deleteDatabase('database');
    request.onsuccess = function (success) {
        console.log('数据库清除成功');
        openDB();
    };
    request.onerror = function (error) {
        console.log('数据库清除失败');
    };
}
//插入数据
async function insertData(table, data) {
    let transaction = database.transaction([table], "readwrite");
    let objectStore = transaction.objectStore(table);
    let request = objectStore.add(data);
    request.onsuccess = function (success) {
        logUpdate(table + '_processed', 1);
        //console.log('插入成功' + data.index);
    }
    request.onerror = function (error) {
        logUpdate(table + '_failed', 1);
        logUpdate(table + '_processed', 1);
        console.error('插入失败:' + data.index);
    };
}
//更新数据
async function updateData(table, data) {
    let transaction = database.transaction([table], "readwrite");
    let objectStore = transaction.objectStore(table);
    let request;
    request = objectStore.put(data);
    request.onsuccess = function (sucess) {
        logUpdate(table + '_processed', 1);
        //console.log('更新成功' + data.index);
    };
    request.onerror = function (error) {
        logUpdate(table + '_failed', 1);
        logUpdate(table + '_processed', 1);
        console.error('更新失败:' + data.index);
    }
}
//删除数据
async function removeData(table, key) {
    let transaction = database.transaction([table], "readwrite");
    let objectStore = transaction.objectStore(table);
    let request = objectStore.delete(key);
    request.onerror = function (error) {
    };
    request.onsuccess = function (success) {
    }
}
//获取数据
async function getData(table, index, key) {
    return new Promise(function (resolve, reject) {
        let transaction = database.transaction([table]);
        transaction.oncomplete = function (complete) {
        };
        transaction.onerror = function (error) {
            console.error('获取失败:' + index)
        };
        let objectStore = transaction.objectStore(table);
        let request;
        if (!key) {
            request = objectStore.get(index);
        } else {
            request = objectStore.index(key).get(index);
        }
        request.onerror = function (error) {
            resolve(null);
        };
        request.onsuccess = function (success) {
            resolve(this.result);
        }
    });
}
//获取数据组
async function getArray(table, index, key) {
    return new Promise(function (resolve, reject) {
        let oArray = [];
        let transaction = database.transaction([table]);
        transaction.oncomplete = function (complete) {
        };
        transaction.onerror = function (error) {
            console.error('获取失败:' + index)
        };
        let objectStore = transaction.objectStore(table);
        let request;
        if (index == 'all') {
            request = objectStore.openCursor();
            request.onsuccess = function (success) {
                let cursor = this.result;
                if (cursor) {
                    oArray.push(cursor.value.value);
                    cursor.continue();
                } else {
                    resolve(oArray);
                }
            };
        } else {
            request = objectStore.index(key).openCursor(IDBKeyRange.only(index));
            request.onsuccess = function (sucess) {
                let cursor = this.result;
                if (cursor) {
                    oArray.push(cursor.value.value);
                    cursor.continue();
                } else {
                    resolve(oArray);
                }
            };
        }
        request.onerror = function (error) {
        }
    });
}