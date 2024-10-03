//获取json
async function getJson(url) {
  return new Promise(function (resolve, reject) {
    $.get(url, function (data) {
      resolve(data);
    }).fail(function () {
      appendNode('<a style="color:red;">请求失败:' + url + '</a>', 'logger', 'div');
      resolve(null);
    });
  });
}
