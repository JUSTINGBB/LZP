require(["dojo/cookie", "dojo/dom", "dojo/on"], function(cookie, dom, on) {
    var userName = cookie('userName'),
        level = cookie('level');
    var commonAct = {
        init: function() {
            if (userName == "" || userName == undefined || userName == "null") {
                alert('您未登录，请登录后重试！');
                cookie('level', null);
                location.href = "login.html";
            } else if (level == "" || level == "null" || level == undefined) {
                alert("出现了问题，可能是您清除或禁用了cookie，请重新登录！");
                cookie('userName', null);
                location.href = "login.html";
            } else {
                //跳转成功
            }
        }
    };
    commonAct.init();
});
//用户名密码加解吗
function compile(code) {
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c);
}
function uncompile(code) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}

/**
 * json对象数组按照某个属性排序:降序排列
 * @param {Object} propertyName
 */
function compareDesc(propertyName) {
    return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if(value2 < value1) {
            return -1;
        } else if(value2 > value1) {
            return 1;
        } else {
            return 0;
        }
    }
}
 
/**
 * json对象数组按照某个属性排序:升序排列
 * @param {Object} propertyName
 */
function compareAsc(propertyName) {
    return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if(value2 < value1) {
            return 1;
        } else if(value2 > value1) {
            return -1;
        } else {
            return 0;
        }
    }
}
/**
*Json对象按照某个属性排序：升序('asc'),降序
*/
function getSortFun(order, sortBy) {
    var ordAlpah = (order == 'asc') ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    return sortFun;
}

//屏蔽右键

/*document.oncontextmenu = function(e){
             e.preventDefault();
         };*/
   /* window.onload = function(){
         去掉默认的contextmenu事件，否则会和右键事件同时出现。
         document.oncontextmenu = function(e){
             e.preventDefault();
         };
         document.getElementById("map").onmousedown = function(e){
                 if(e.button ==2){
                     //alert("你点了右键");
                     
                 }
             }
    }*/
//更改点名,并更改json数据
/*function ShowElement(element) {
    var oldhtml = element.innerHTML;
    //创建新的input元素
    var newobj = document.createElement('input');
    //为新增元素添加类型
    newobj.type = 'text';
    //为新增元素添加value值
    newobj.value = oldhtml;
    //为新增元素添加光标离开事件
    newobj.onblur = function() {
        //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值 
        if(!this.value ||this.value==oldhtml){
            element.innerHTML=oldhtml;
        }
        else{
             element.innerHTML = this.value == oldhtml ? oldhtml : this.value;
             //修改文件夹名
             $.ajax({
                url: "js/mUploader/server/editDirName.php",
                data: {
                    "oldName": oldhtml,
                    "newName": element.innerHTML
                }, //第二个u和p只是变量，可以随意写，里面的u和p都是第一个。
                type: "GET",
                dataType: "TEXT",
                success: function(data) { //data返回的实1或2，admin和user
                    //console.log(data);
                    alert(data);
                    switch(data){
                        case "修改成功":
                            break;
                        case "修改失败":
                            element.innerHTML=oldhtml;
                            break;
                        case "有同级目录名相同":
                            element.innerHTML=oldhtml;
                            break;
                        case "创建成功":
                            break;
                    }
                },
                error: function(err) {
                    alert(err.status);
                }
            });

        }
        //当触发时设置父节点的双击事件为ShowElement
        element.setAttribute("ondblclick", "ShowElement(this);");
    }
    //设置该标签的子节点为空
    element.innerHTML = '';
    //添加该标签的子节点，input对象
    element.appendChild(newobj);
    //设置选择文本的内容或设置光标位置（两个参数：start,end；start为开始位置，end为结束位置；如果开始位置和结束位置相同则就是光标位置）
    newobj.setSelectionRange(0, oldhtml.length);
    //设置获得光标
    newobj.focus();

    //设置父节点的双击事件为空
    newobj.parentNode.setAttribute("ondblclick", "");
}*/