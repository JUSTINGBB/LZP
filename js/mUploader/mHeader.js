/*start修改点名，删除点相关*/
var deleteFlag=false;
var gla_placeID = window.location.href.split('?')[2];
var old_placeName = window.location.href.split('?')[1];
var new_placeName;
if(!gla_placeID)gla_placeID='01';//测试名为"01"
//修改点名控件
function ShowElement(element) {
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
             new_placeName =element.innerHTML ;
             //修改文件夹名;舍弃直接固定文件夹名，否则容易混乱
            /* $.ajax({
                url: "./server/editDirName.php",
                data: {
                    "oldName": oldhtml,
                    "newName": element.innerHTML
                }, //第二个u和p只是变量，可以随意写，里面的u和p都是第一个。
                type: "GET",
                dataType: "TEXT",
                success: function(data) { //data返回的实1或2，admin和user
                    //console.log(data);
                    switch(data){
                        case "修改成功":
                            break;
                        case "修改失败":
                            element.innerHTML=oldhtml;
                            break;
                        case "有同级目录名相同":
                            element.innerHTML=oldhtml;
                            break;
                        case "创建新目录":
                            break;
                    }
                },
                error: function(err) {
                    alert(err.status);
                }
            });*/

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
}
/*end修改点名，删除点相关*/
/*start获取点名下所有相关图片名*/
(function($){
    $.ajax({
        url: "../../Handler.ashx?method=imgShower&folderName="+gla_placeID,
        type: "GET",
        dataType: "JSON",
        success: function(data) {
            console.log(data);
            dirPath = "panorama/userLandPointsImg/"+gla_placeID;
            for(var i=0;i<data.length;i++){
                var liTimeBtn = data[i].Key;//日期
                var imgByTime = data[i].Value;//当前日期，一天上传的所有图片名
                // var html = '<li><a>'+liTimeBtn+'</a></li>';
                // $("#timeBtn").append(html);
                var splitLineHtml = '<div style="margin:10px">--'+liTimeBtn+'--</div>';
                var tdivHtml = '<div id='+"img_"+liTimeBtn+' style="float:left">'
                $("#content").append(splitLineHtml);
                $("#content").append(tdivHtml);
                for(var j=0;j<imgByTime.length;j++){
                    //文件路径
                    var srcPath = "../../"+dirPath+"/"+liTimeBtn+"/"+imgByTime[j];
                    //
                    var imgHtml = '<div class="responsive"><div class="img">'+
                    '<input type="button" mImgName='+
                    ("panorama\\userLandPointsImg\\"+gla_placeID+"\\"+liTimeBtn+"\\"+imgByTime[j])+
                    ' value="删除" style="position:absolute;color:#aaf" onclick="msg(this)">'+
                    '<a target="_blank" href="'+srcPath +'">'+
                    '<img src="'+srcPath+'" alt="图片加载中" width="300" height="200"></a>'+
                    '<div class="desc">'+imgByTime[j]+'</div></div></div>';
                    var cStr='#'+'img_'+liTimeBtn;
                    $(cStr).append(imgHtml);
                }
            }        
        }
    })
})(jQuery)
/*end获取点名下所有相关图片名*/
function  msg(element){
    console.log("element是：");
    console.log(element);
    alert("确定删除图片？")
    element.parentNode.remove();//删除节点
    $.ajax({//删除服务器文件
        url:"../../Handler.ashx?method=DeleteImg&imgName="+element.getAttribute("mimgname"),//自定义的属性名不区分大小写
        type:"GET",
        dataType:"TEXT",
        success:function(msg){
            console.log(msg)
        }
    })

}
