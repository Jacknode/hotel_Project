/**
 * Created by leibo on 17/11/11.
 */
//POST请求
export const POST = function (url,data,fn,err) {
  var xhr = null;
  if (window.XMLHttpRequest){
    xhr=new XMLHttpRequest();
  }else{// code for IE6, IE5
    xhr=new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (xhr==null){
    alert('您的浏览器不支持AJAX！');
    return;
  }
  let oStr = '';
  for(var key in data){
    oStr += key+"="+data[key]+"&";
  };
  xhr.open("POST",url,true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send(oStr);
  xhr.onreadystatechange=function () {
    if (xhr.readyState == 1 || xhr.readyState == 2 || xhr.readyState == 3) {
// 本地提示：加载中/处理中
    }
    if (xhr.readyState == 4 && xhr.status == 200) {
      fn&&fn(xhr.responseText)
    }else{
      err&&err(xhr.status);
    }
  }
}
function toZear(num) {
  return num<10?'0'+num:''+num;
}
//获取 年-月-日
export const getDateName = function(obj,format) {
  return obj.getFullYear()
    + format + toZear((obj.getMonth() + 1))
    + format+ toZear(obj.getDate())
}
//日期格式化
export const dateFormat = function (fmt,date)
{
  var o = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}
export const IsBackCode = function (data,_this) {
  if(data.backCode==='005'||data.backCode==='001'||data.backCode==='002'||data.backCode==='003'||data.backCode==='004'||data.backCode==='000'){
    _this.$message({
      showClose: true,
      message: data.backResult,
      type: 'error'
    });
  }
};
//POST,Promise请求
export const postPromise = function (url,data) {
  return new Promise(function (relove,reject) {
    var xhr = null;
    if (window.XMLHttpRequest){
      xhr=new XMLHttpRequest();
    }else{// code for IE6, IE5
      xhr=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xhr==null){
      alert('您的浏览器不支持AJAX！');
      return;
    }
    let oStr = '';
    for(var key in data){
      oStr += key+"="+data[key]+"&";
    };
    xhr.open("POST",url,true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(oStr);
    xhr.onreadystatechange=function () {
      if (xhr.readyState == 1 || xhr.readyState == 2 || xhr.readyState == 3) {
// 本地提示：加载中/处理中
      }
      if (xhr.readyState == 4 && xhr.status == 200) {
        relove(xhr.responseText)
      }
    }
  })
}

