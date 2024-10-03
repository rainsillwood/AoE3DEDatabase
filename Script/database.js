//
class database {
  database;
  dbName = 'database';
  //构造函数
  constructor() {}
  //初始化数据库
  initDB(database) {
    for (const tableName in tableList) {
      //属性为version时跳过
      if (tableName == 'version') continue;
      //判断是否存在表格
      if (!database.objectStoreNames.contains(tableName)) {
        //获取table配置
        let attrList = tableList[tableName];
        //建立表格
        const objectStore = database.createObjectStore(tableName, { keyPath: 'index' });
        //为所有属性建立索引
        for (const key in attrList) {
          //跳过index
          if (key == 'index') continue;
          objectStore.createIndex(key, key, { unique: false });
        }
      }
    }
  }
  //打开数据库
  async openDB() {
      const request = indexedDB.open(dbName, 1);
      //更改成功
      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        this.initDB(database);
      };
      //打开成功
      request.onsuccess = (event) => {
      };
      //打开失败
      request.onerror = (event) => {
      };
  }
  //插入数据
  async insertData(tableName, iData) {
    let transaction = this.database.transaction([tableName], 'readwrite');
    let objectStore = transaction.objectStore(tableName);
    let request = objectStore.add(iData);
    request.onsuccess = function (success) {};
    request.onerror = function (error) {};
  }
  //更新数据
  async updateData(tableName, iData) {
    let transaction = database.transaction([tableName], 'readwrite');
    let objectStore = transaction.objectStore(tableName);
    let request = objectStore.put(iData);
    request.onsuccess = function (sucess) {};
    request.onerror = function (error) {};
  }
  //删除数据
  async removeData(table, key) {
    let transaction = database.transaction([table], 'readwrite');
    let objectStore = transaction.objectStore(table);
    let request = objectStore.delete(key);
    request.onsuccess = function (success) {};
    request.onerror = function (error) {};
  }
  //查询数据
  async 
}
