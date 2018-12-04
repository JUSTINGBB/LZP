var map;
var mSpatialReference;
//部分工具按下时背景颜色
var downColor = "rgb(67, 142, 185)";
var downColor2="#eee";
/*esriConfig.defaults.io.proxyUrl = "http://localhost/DotNet/proxy.ashx";  
esriConfig.defaults.io.alwaysUseProxy = false;*/
/*urlUtils.addProxyRule({
        urlPrefix:"../Libs",
        proxyUrl:"http://localhost/proxy/proxy.ashx"
    });*/ 
require(["esri/map", "esri/SpatialReference",
    "esri/graphic",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/webMercatorUtils", 
    "esri/geometry/Point",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/GraphicsLayer",
    "esri/dijit/Scalebar",
    "esri/dijit/LayerList",
    "esri/toolbars/draw", 
    "esri/toolbars/navigation",
    "dojo/parser", "dojo/dom", "dojo/dom-construct", "dojo/query","dojo/on",
    "dojo/cookie",'dojo/_base/fx',"dojo/fx/easing","dojo/request/xhr",
    "dijit/Toolbar","dijit/Menu","dijit/MenuItem","dijit/Dialog",
    "dijit/form/TextBox", "dijit/form/Button", "dijit/form/ToggleButton",
    "dijit/form/SimpleTextarea","dijit/ToolbarSeparator","dijit/layout/ContentPane", 
    "dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/layout/AccordionContainer",
    "dojox/layout/ExpandoPane",
    "dojo/domReady!"  
], function (Map, SpatialReference,Graphic,SimpleRenderer,PictureMarkerSymbol,
    webMercatorUtils, Point,
    ArcGISTiledMapServiceLayer,
    GraphicsLayer,
    Scalebar,LayerList,
    Draw,Navigation,
    parser, dom, domConstruct,query, on,cookie, fx, easing,xhr2,
    Toolbar,Menu,MenuItem,Dialog,TextBox,Button,ToggleButton,SimpleTextarea,ToolbarSeparator,
    ContentPane,BorderContainer, TabContainer, AccordionContainer, ExpandoPane) {
    parser.parse();
    //加载动画隐藏
    $("#loadgif").hide();
/*start底图图层*/ 
    mSpatialReference = new SpatialReference({ wkid: 4490 });
    var centerPoint = new Point(121.265, 30.326, new SpatialReference({ wkid: 4490 }));
    var minZoom = 13;
    //底图缩放级别1-21
    var lods = [
        {
        level: 0,
        resolution: 1.4062500262315807,
        scale: 590995197.141669
        },
        {
        level: 1,
        resolution: 0.7031250131157915,
        scale: 295497598.570835
        },
        {
        level: 2,
        resolution: 0.3515625065578945,
        scale: 147748799.285417
        },
        {
        level: 3,
        resolution: 0.1757812532789475,
        scale: 73874399.6427086
        },
        {
        level: 4,
        resolution: 0.08789062663947375,
        scale: 36937199.8213543
        },
        {
        level: 5,
        resolution: 0.043945313319736994,
        scale: 18468599.9106772
        },
        {
        level: 6,
        resolution: 0.02197265665986845,
        scale: 9234299.95533858
        },
        {
        level: 7,
        resolution: 0.010986328329934226,
        scale: 4617149.97766929
        },
        {
        level: 8,
        resolution: 0.005493164164967124,
        scale: 2308574.98883465
        },
        {
        level: 9,
        resolution: 0.0027465820824835504,
        scale: 1154287.49441732
        },
        {
        level: 10,
        resolution: 0.0013732910412417776,
        scale: 577143.747208661
        },
        {
        level: 11,
        resolution: 0.0006866455206208899,
        scale: 288571.873604331
        },
        {
        level: 12,
        resolution: 0.0003433227603104438,
        scale: 144285.936802165
        },
        {
        level: 13,
        resolution: 0.0001716613801552224,
        scale: 72142.9684010827
        },
        {
        level: 14,
        resolution: 0.00008583069007761132,
        scale: 36071.4842005414
        },
        {
        level: 15,
        resolution: 0.00004291534503880566,
        scale: 18035.7421002707
        },
        {
        level: 16,
        resolution: 0.000021457672519402802,
        scale: 9017.87105013534
        },
        {
        level: 17,
        resolution: 0.000010728836259701401,
        scale: 4508.93552506767
        },
        {
        level: 18,
        resolution: 0.000005364418129850712,
        scale: 2254.46776253384
        },
        {
        level: 19,
        resolution: 0.000002682209064925356,
        scale: 1127.23388126692
        },
        {
        level: 20,
        resolution: 0.0000013411045321451153,
        scale: 563.6169405
        },
        {
        level: 21,
        resolution: 0.0000006705522660725576,
        scale: 281.80847025
        }
    ];
    map = new Map("map", {           //底图
        lods:lods,
        //maxScale:281.80847025,
        //maxZoom: 21,
        minZoom: minZoom,
        zoom:13,
        slider: false,
        logo: false,
        center: centerPoint,
        navigationMode: 'css-transforms',
        showAttribution: true,
        showLabels:true,
    });
    var yingxiangId = "yingxiang";
    var zhujiId = "zhuji";
    var basemapId = "basemap";
    var baseMapzhujiUrl = ARCGISIP + "/arcgis/rest/services/天地图电子地图标注/MapServer";
    var baseMapzhuji = new ArcGISTiledMapServiceLayer(baseMapzhujiUrl);

    baseMapzhuji.id = zhujiId;
    var baseMapUrl = ARCGISIP + "/arcgis/rest/services/天地图电子地图/MapServer";
    var baseMap = new ArcGISTiledMapServiceLayer(baseMapUrl);
    baseMap.id = basemapId;

    var baseMapYingxiangUrl = ARCGISIP + "/arcgis/rest/services/电子地图影像/MapServer";
    //var yingxiangMap = new ArcGISTiledMapServiceLayer(baseMapYingxiangUrl);
    var yingxiangMap = new ArcGISTiledMapServiceLayer(baseMapYingxiangUrl,{
        initialExtent: {
            xmin: 121.023681640625,
            ymin: 30.19873046875,
            xmax: 121.3817138671875,
            ymax: 30.44512939453125,
            spatialReference: {
            wkid: 4490,
            latestWkid: 4490
            }
        },
    });
    yingxiangMap.id = yingxiangId;

    baseMap.visible = false;
    baseMapzhuji.visible=true;
    yingxiangMap.visible = true;
    map.addLayer(yingxiangMap);
    map.addLayer(baseMap);
    map.addLayer(baseMapzhuji);
/*end底图图层*/
/*start地图基本功能小部件*/
    //部分toolbar
    map.on('load', setupNavBar);
    //比例尺
    var scalebar = new Scalebar({
        map: map,
        attachTo:"bottom-left",
        scalebarUnit: "metric",
        scalebarStyle:"line",
    });
    //全图按钮
    on(dom.byId("fullBtn"), "click", function () {
        map.centerAndZoom(centerPoint, minZoom);
    });
    //切换底图
    //1.0
    /*// on(dom.byId("layerSwitcher"), "click", function () {
        var src = dom.byId("layerSwitcher").value;
        switch (src) {
            case "raster":
                baseMap.setVisibility(false);
                baseMapzhuji.setVisibility(true);
                yingxiangMap.setVisibility(true);
                break;
            case "vector":
                baseMap.setVisibility(true);
                baseMapzhuji.setVisibility(true);
                yingxiangMap.setVisibility(false);
                break;
        }
    });*/
    //2.0
   /* on(dom.byId("layerSwitcher"), "click", function () {
        var color =dom.byId("layerSwitcher").style["background-color"];
        if(color==downColor){
            dom.byId("layerSwitcher").style["background-color"]="";
            baseMap.setVisibility(true);
            baseMapzhuji.setVisibility(true);
            yingxiangMap.setVisibility(false); 
           
        }else{
            dom.byId("layerSwitcher").style["background-color"]=downColor;
            baseMap.setVisibility(false);
            baseMapzhuji.setVisibility(true);
            yingxiangMap.setVisibility(true);
        }
    });*/
    //3.0
    on(dom.byId("yxBtn"),"click",function(){
        dom.byId("yxBtn").parentNode.style["background-color"]=downColor2;
        dom.byId("zwBtn").parentNode.style["background-color"]="";
        baseMap.setVisibility(false);
        baseMapzhuji.setVisibility(true);
        yingxiangMap.setVisibility(true);
    })
    on(dom.byId("zwBtn"),"click",function(){
        dom.byId("zwBtn").parentNode.style["background-color"]=downColor2;
        dom.byId("yxBtn").parentNode.style["background-color"]="";
        baseMap.setVisibility(true);
        baseMapzhuji.setVisibility(true);
        yingxiangMap.setVisibility(false); 
    })
    //基本工具条
    var navOption; // 当前选择的操作
    function setupNavBar() {
        navToolbar = new Navigation(map);
        query(".navItem img").onclick(function (evt) {
            navEvent(evt.target.id);
        });
        // 将漫游设置为默认操作
        // navEvent('deactivate');
    }
    function navEvent(id) {
        switch (id) {
            case 'zoomprev':
                navToolbar.zoomToPrevExtent();
                break;
            case 'zoomnext':
                navToolbar.zoomToNextExtent();
                break;
        }
    }
/*end地图基本功能小部件*/
/*start退出登录，修改密码，更新日志相关*/
    //退出登陆loginDialog显示
    // on(dom.byId("userPic"),"click",function(){
    //     dijit.byId("logOut").show();
    // });
    //退出登录
    on(dom.byId("logOut"),"click",function(){
        cookie('level', null);
        cookie('userName', null);
        window.location.href="login.html"
    });
    //修改密码按钮弹窗
    on(dom.byId("changePwd"),"click",function(){
        var chpd=dijit.byId("changePwdDialog");
        chpd.show();
        //dijit.byId("cPD_user").value=cookie('userName');
        //dijit.byId("cPD_user").disabled=true;
        dom.byId("cPD_user").value=uncompile(cookie('userName'));
        dom.byId("cPD_user").disabled=true;
    });
    //清空输入的密码
    on(dom.byId("cPD_reset"),"click",function(){
        dijit.byId("cPD_pwdOld").reset();
        dijit.byId("cPD_pwdNew").reset();
        dijit.byId("cPD_pwdConfirm").reset();
    });
    //提交密码更新
    on(dom.byId("cPD_update"),"click",function(){
        //console.log("666");
        var u=dom.byId("cPD_user");
        var a=dom.byId("cPD_pwdOld");
        var b=dom.byId("cPD_pwdNew");
        var c=dom.byId("cPD_pwdConfirm");
        if(b.value!=c.value){
            alert("确认密码不一致")
            return;
        }else{
            //console.log("23333");
            $.ajax({            
                url:"Handler.ashx?method=pwdChange"+ "&" + Math.random(),
                data:{"user":u.value,"pwd":compile(a.value),"newPwd":compile(b.value)},//第二个u和p只是变量，可以随意写，里面的u和p都是第一个。
                type:"GET",
                dataType:"TEXT",
                success: function(data){//data返回的实1或2，admin和user
                        if(data.trim()=="error")//要加上去空格，防止内容里面有空格引起错误。
                        {
                            alert("密码错误");
                        }
                        else
                        {
                            alert(data);
                            dijit.byId("changePwdDialog").hide();
                            dijit.byId("cPD_pwdOld").reset();
                            dijit.byId("cPD_pwdNew").reset();
                            dijit.byId("cPD_pwdConfirm").reset();
                        }
                
                    },
                error: function (err){
                        alert(err.status);
                    }
                });                
        }
    });
    //版本更新日志弹窗
    var updateLogTxt;
    $.ajax({
        url:"../updateLogs.txt",
        type:"GET",
        dataType:"TEXT",
        success: function(data){
            //console.log(data); 
            updateLogTxt=data;   
            },
        error: function (err) {
            alert(err.status);
        }
    });
    on(dom.byId("updateLog"),"click",function(){
        updateLogDialog=dijit.byId("updateLogDialog");
        updateLogTxt=updateLogTxt;
        if(dom.byId("updateLogsTxt").innerText==""){
            dom.byId("updateLogsTxt").innerText=updateLogTxt;
        }
        updateLogDialog.show();
    });
/*end退出登录，修改密码，更新日志相关*/
/**start全景图及图片模块相关**/
/*start添加图片图层和树*/
    var skyPointsJson;
    var skyPointsLyr=new GraphicsLayer({id:"skyPoints",visible:false,});
    var skyPointsLyr2=new GraphicsLayer({id:"skyPoints2",visible:false,});
    var userLandPointsLyr=new GraphicsLayer({id:"userLandPoints",visible:false,});
    //读取json数据，将点添加到相应的GraphicsLayer中
    function addPoints(urlStr,mlayer,icon,jsonType){
        xhr2(urlStr,{
            handleAs: "json"
        }).then(getSkyPoints);

        function getSkyPoints(results){
            skyPointsJson=results;
            for(var key in skyPointsJson){
                var skyPoint=new Point(skyPointsJson[key],new SpatialReference({ wkid:4490 }));
                var skyPointGraphic = new Graphic(skyPoint);
                switch(jsonType){
                    case 1:
                        skyPointGraphic.attributes={"pointName":key,'x':skyPointsJson[key][0],'y':skyPointsJson[key][1]};
                        break;
                    case 2:
                        skyPointGraphic.attributes={"pointID":key.split('_')[0],"pointName":key.split('_')[1],'x':skyPointsJson[key][0],'y':skyPointsJson[key][1],};
                        break;
                } 
                mlayer.add(skyPointGraphic);
            }
        }
        var skyPointsSymbol = new PictureMarkerSymbol(icon, 20, 20)
        var skyPointsRenderer = new SimpleRenderer(skyPointsSymbol);
        mlayer.setRenderer(skyPointsRenderer);
    };
    var urlStr1="../panorama/skypoints.json";
    var icon1="../images/skyPoints.png";
    var urlStr2="../panorama/skypoints2.json";
    var icon2="../images/skyPoints2.png";
    var urlStr3="../panorama/userLandPoints.json";
    var icon3="../images/拍照.png";
    addPoints(urlStr1,skyPointsLyr,icon1,1);
    addPoints(urlStr2,skyPointsLyr2,icon2,1);
    addPoints(urlStr3,userLandPointsLyr,icon3,2);
    map.addLayer(skyPointsLyr);
    map.addLayer(skyPointsLyr2);
    map.addLayer(userLandPointsLyr);
    //图片图层树
    imgLayerInfos=[{
        id:"skyPoints",
        layer:skyPointsLyr,
        title:"全景影像",
        visibility:false
    },
    {
        id:"skyPoints2",
        layer:skyPointsLyr2,
        title:"无人机俯视图",
        visibility:false
    },{
        id:"userLandPoints",
        layer:userLandPointsLyr,
        title:"地面照片",
        visibility:false
    }];
    imgLayerList = new LayerList({
      "map": map,
      "removeUnderscores":true,
      //"showLegend" : true,
      //"showOpacitySlider": true,
      "layers" : imgLayerInfos,
      "showSubLayers":true
    }, "imgLayersDom");
    imgLayerList.startup();

    //全景模块图层显隐1.0
    /*on(dom.byId("skyPointsBtn"),"click",function(){
        var color =dom.byId("skyPointsBtn").style["background-color"];
        if(color==downColor){
          dom.byId("skyPointsBtn").style["background-color"]="";
          skyPointsLyr.setVisibility(false);
        }else{
          dom.byId("skyPointsBtn").style["background-color"]=downColor;
          skyPointsLyr.setVisibility(true); 
          //dijit.byId("skyPointsView").show();
        }
    });*/
    //2.0
    on(dom.byId("skyPointsBtn"),"click",function(){
        var color =dom.byId("skyPointsBtn").style["background-color"];
        if(color==downColor){
          dom.byId("skyPointsBtn").style["background-color"]="";
          dom.byId("imgLayersDiv").style.display="none";
          //关闭全景模块图层所有打开的图层
          map.getLayer("skyPoints").setVisibility(false);
          map.getLayer("skyPoints2").setVisibility(false);
          map.getLayer("userLandPoints").setVisibility(false);
          
        }else{
          dom.byId("skyPointsBtn").style["background-color"]=downColor;
          dom.byId("imgLayersDiv").style.display="block";
          //显示全景图
          map.getLayer("skyPoints").setVisibility(true);
        }
    });
/*end添加图片图层和树*/
/*start打开相关图片*/
    //打开全景图
    skyPointsLyr.on("click",function(evt){
        var pointName=evt.graphic.attributes["pointName"];
        dom.byId("sky_iframe").src="./panorama/vtour/tour_"+pointName+".html";
        DialogAutoSize(0.85,0.8,dom.byId("sky_iframe"));
        //dom.byId("skyPointsView").title=pointName;
        dijit.byId("skyPointsView").show();
    });
    //打开俯视图
    skyPointsLyr2.on("click",function(evt){
        var pointName=evt.graphic.attributes["pointName"];
        // var html="<a href='"+"./panorama/skypoints2Img"+pointName+"jpg"+"'></a>";
        // dom.byId("ImgShower").innerHTML=html;
        src="./panorama/skypoints2Img/"+pointName+".jpg";
        window.open(src);
    });
    // 打开地面照片1.0，集成到mousedown事件中
    /*userLandPointsLyr.on("click",function(evt){
        var pointName=evt.graphic.attributes["pointName"];
        // src="./panorama/uerLandPointsImg/"+pointName+".jpg";
        // window.open(src);
        dom.byId("imgUploader_iframe").src="js/mUploader/index.html?"+pointName;
        DialogAutoSize(0.85,0.8,dom.byId("imgUploader_iframe"));


        dom.byId("ImgShowerDialog_title").innerHTML="地点'"+pointName+"'"+" 相关图片预览/添加";
        dijit.byId("ImgShowerDialog").show();
    });*/
    /*1，打开地面图片添加/预览界面
     *2，右键更改地点名;函数ShowElement(),(舍弃)
    **/
   /* var pointNameEditDialog = new Dialog({
                title: "编辑点",
                id:"pointNameEditDlg",
                content: '<span id="placeName" title="双击编辑" style="width:100%;" '+
                'ondblclick="ShowElement(this)">可编辑文本</span><input type="button" value="删除该点" />',
                style: "width: 150px"
    });*/
    //全局变量
    window.old_placeName,
    window.new_placeName;
  /**
    *需要左右键都操作，不太科学，可以所有的都放到"click"事件和webuploader中
    userLandPointsLyr.on("mouse-down",function(evt){
        var pointName=evt.graphic.attributes["pointName"];
        window.old_placeName=pointName;
        console.log("old_placeName值为:"+old_placeName);
        //打开编辑点名
        if(evt.button==2){
            //console.log("点击右键");
            console.log("你右键点击了点"+pointName);
            document.getElementById("placeName").innerHTML=pointName;
            pointNameEditDialog.show();//打开点名编辑dialog 

        }else if(evt.button==0){//打开图片添加/预览
            console.log("你左键点击了点"+pointName);
            if(document.getElementById("placeName").innerHTML!="可编辑文本"){
                pointName=evt.graphic.attributes["pointName"]=document.getElementById("placeName").innerHTML;
            }
            dom.byId("imgUploader_iframe").src="js/mUploader/index.html?"+pointName;
            DialogAutoSize(0.85,0.8,dom.byId("imgUploader_iframe"));
            dom.byId("ImgShowerDialog_title").innerHTML='"'+pointName+'"点相关图片添加/预览';
            dijit.byId("ImgShowerDialog").show();
        }
    });
    */
    userLandPointsLyr.on("click",function(evt){
        var pointName=evt.graphic.attributes["pointName"];
        var pointID=evt.graphic.attributes["pointID"];
        console.log("你点击了点:"+pointName);
        dom.byId("imgUploader_iframe").src="js/mUploader/index.html?"+pointName+"?"+pointID;
        DialogAutoSize(0.85,0.8,dom.byId("imgUploader_iframe"));
        dom.byId("ImgShowerDialog_title").innerHTML='"'+pointName+'"点属性及相关图片添加/预览';
        dijit.byId("ImgShowerDialog").show();
    });
    //对话框关闭（隐藏）触发
    //将更改的名字,新建的地面点等数据写入userLandPoints.json文件中
    var outputJson;
    dijit.byId("ImgShowerDialog").on("hide",function(){
        console.log("关闭地面图片窗口");
        //当前点是
        gla_placeID=mIframe.window.gla_placeID;
        old_placeName=mIframe.window.old_placeName;
        new_placeName=mIframe.window.new_placeName;
        var flag = mIframe.window.deleteFlag;
        console.log(flag);
        /*if(flag){
            console.log("删除该点相关。。。");
            //...下面有遍历，不需再做额外遍历
            for(gra in userLandPointsLyr.graphics){
                //if(gra.attributes['pID'])
            }
            
        }*/
        console.log("输出的新名字地面图片点json相关。。。");
        //1.通过old_placeName找到
        //var userLandPointsAll=map.getLayer("userLandPoints").graphics;
        var userLandPointsAll=userLandPointsLyr.graphics;
        var printJson={};
        var delPoNum;
        for(i=0;i<userLandPointsAll.length;i++){
            var pID=userLandPointsAll[i].attributes['pointID'];
            var pName=userLandPointsAll[i].attributes['pointName'];
            if(pID==gla_placeID){
                if(flag){//判断是否要删除这个点
                    delPoNum = i;
                    console.log("删除了点："+"PID");
                }else{
                    if(old_placeName==new_placeName){   
                        printJson[pID+"_"+pName]=[userLandPointsAll[i].attributes['x'],userLandPointsAll[i].attributes['y']];
                    }else{
                        userLandPointsAll[i].attributes['pointName']=new_placeName;
                        pName = new_placeName;
                        printJson[pID+"_"+pName]=[userLandPointsAll[i].attributes['x'],userLandPointsAll[i].attributes['y']];
                    }
                }
            }else{
                printJson[pID+"_"+pName]=[userLandPointsAll[i].attributes['x'],userLandPointsAll[i].attributes['y']];
            }
        }
        //userLandPointsLyr中移除该点
        userLandPointsLyr.remove(userLandPointsAll[delPoNum]);
        console.log(printJson); 
        outputJson=printJson;

    });
    //退出时将所有地面点写入userLandPoints.json中,并在log.txt记录。
    window.onbeforeunload = function(event) {

        xhr2("../Handler.ashx?method=userLandPointsWrite"+ "&" + Math.random(),{
            data:JSON.stringify(outputJson),
            method:"POST",
            handleAs: "json"
        }).then(function(data){
            console.log(data);
        });

        event.returnValue = "我在这写点东西...";
        
    };
/*end打开相关图片*/
/*start右键添加地面照片相关*/
    //右键地图弹出菜单
    var pMenu;
    pMenu = new Menu({
        targetNodeIds: ["imgLayersDiv"]
    });
    pMenu.addChild(new MenuItem({
        id:"userImgLayerItem",
        label: "添加地面照片",
        disabled:true,
        onClick:imgPointAdd,
        title:"右键添加照片"
    }));
    //点击“图片图层树”右键菜单
    imgLayerList.on("mousedown",function(e){
        //console.log("666");
        if(e.button==2){
            //console.log("点击右键");
            if(map.getLayer("userLandPoints").visible){
                dijit.byId("userImgLayerItem").disabled=false;
            }else{
                dijit.byId("userImgLayerItem").disabled=true;
                alert('请打开："地面照片"图层再添加')
            }
        }
    })
    //添加地面图片点
    var DrawImgPoint = new Draw(map);
    function imgPointAdd(){
        DrawImgPoint.activate(Draw.POINT);
        pointID=pointName=(new Date().getTime());//点名初始化为当前时间戳
        on(DrawImgPoint, "draw-complete", function (result)
        {
            //获得绘图得到的图形
            var u_geometry=result.geometry;
            //获得绘图得到的图形,加入userLandPointsLyr图层
            var userLandPointGraphic=new Graphic();
            userLandPointGraphic.setGeometry(u_geometry);
            //图形添加属性"pointName"
            //pointID=pointName=(new Date().getTime());//点名初始化为当前时间戳
            //读入的点形式为："点ID_点名：[x,y]"所以新加的点按以下形式。默认都为时间戳，但点id不可修改，点名可修改
            userLandPointGraphic.setAttributes({'pointID':pointName,'pointName':pointName,'x':u_geometry.x,'y':u_geometry.y});
            //userLandPointGraphic.attributes={"pointName":key};
            userLandPointsLyr.add(userLandPointGraphic);
            //关闭绘图工具
            DrawImgPoint.deactivate();
            //画完之后打开pointNameEditDialog,实现点的命名和删除,及图片上传
            console.log("你创建了点:"+pointName);
            dom.byId("imgUploader_iframe").src="js/mUploader/index.html?"+pointName+"?"+pointID;
            DialogAutoSize(0.85,0.8,dom.byId("imgUploader_iframe"));
            dom.byId("ImgShowerDialog_title").innerHTML='"'+pointName+'"点属性及相关图片添加/预览';
            dijit.byId("ImgShowerDialog").show();
        });      
    }
/*end右键添加地面照片相关*/
/**end全景图及图片模块相关**/
    //dialog自动大小
    function DialogAutoSize(l_w,l_h,mydialog){
        w=l_w*window.innerWidth+"px";
        h=l_h*window.innerHeight+"px";
        mydialog.style.width=w;
        mydialog.style.height=h;
    }
});