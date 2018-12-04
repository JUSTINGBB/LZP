require(["echarts", "dojo/_base/xhr","dojo/request/xhr", "dojo/dom", "dojo/on", "dojo/query","dojo/_base/array",
    "dojo/dom-construct",
    'dojox/grid/EnhancedGrid', 'dojo/data/ItemFileWriteStore',
    "esri/tasks/IdentifyTask", 
    "esri/tasks/IdentifyParameters",
    "esri/toolbars/draw","esri/symbols/SimpleLineSymbol",
    "dojo/domReady!"],
    function(ec, xhr,xhr2, dom, on,query,array,domConstruct,EnhancedGrid,ItemFileWriteStore,IdentifyTask,IdentifyParameters,Draw,SimpleLineSymbol) {
    /*start图表*/
        var pipeIDs=[];
        //
        var ys,ws,ysD,wsD;
        var widthys,widthysData;
        var widthws,widthwsData;
        var meterialys,meterialysData;
        var title=["雨水管线总体情况","污水管线总体情况","雨水管线管径情况",
            "污水管线管径情况","雨水管线材质情况","污水管线材质情况","排水管线材质情况"]
        var urlStr = encodeURI("Handler.ashx?method=chartsMaker" + "&" + Math.random());
        //xhr1
       /* // Using xhr.get, as very little information is being sent
        xhr.get({
            // The URL of the request
            url: urlStr,
            handleAs: "json",
            // The success callback with result from server
            load: chartsMaker,
            // The error handler
            error: function() {
                // Do nothing -- keep old content there
            }
        });*/
        xhr2(urlStr,{
            handleAs: "json"
        }).then(chartsMaker);
        //获取数据
        function chartsMaker(result) {
            var Ys=[];
            var Ws=[];
            var YsD=[];
            var WsD=[];
            //console.dir(result[i]);
            for (i in result[0]) {
                if(result[0][i]['subType']=="YS"){
                    Ys.push(result[0][i]['Type']);
                    YsD.push(result[0][i]['mCount']);
                }
                if(result[0][i]['subType']=="WS"){
                    Ws.push(result[0][i]['Type']);
                    WsD.push(result[0][i]['mCount']);
                }
            }
            for (j in result[1]) {
                if(result[1][j]['subType']=="YS"){
                    Ys.push(result[1][j]['Type']);
                    YsD.push(result[1][j]['mCount']);
                }
                if(result[1][j]['subType']=="WS"){
                    Ws.push(result[1][j]['Type']);
                    WsD.push(result[1][j]['mCount']);
                }
            }
            //-----------------管径
            var widthYs=[];
            var widthYsData=[];
            var widthWs=[];
            var widthWsData=[];
            // 先按管径大小排序
            for(i in result[2]){
                if(isNaN(result[2][i]['Type'])){
                    //Type不变
                    //console.log(666);
                }else{
                   result[2][i]['Type'] = parseInt(result[2][i]['Type']);
                }
            }
            result[2].sort(compareAsc("Type"));
            for(i in result[2]){
                if(result[2][i]['subType']=="YS"){
                    widthYs.push(result[2][i]['Type']);
                    widthYsData.push(result[2][i]['mCount']);
                }
                if(result[2][i]['subType']=="WS"){
                    widthWs.push(result[2][i]['Type']);
                    widthWsData.push(result[2][i]['mCount']);
                }
                //if()
            }
            //-------------材料
            var meterialYs=[];
            var meterialYsData=[];
            var meterialWs=[];
            var meterialWsData=[];
            for (i in result[3]) {
                var meterialJson={};
                if(result[3][i]['subType']=="YS"){
                    var type=result[3][i]['Type'];
                    meterialYs.push(type+"(ys)");
                    meterialYsData.push(result[3][i]['mCount']);

                }
                if(result[3][i]['subType']=="WS"){
                    meterialWs.push(result[3][i]['Type']+"(ws)");
                    meterialWsData.push(result[3][i]['mCount']);
                }
               
            }
            //升为全局变量
            ys=Ys;ws=Ws;
            ysD=YsD;wsD=WsD;
            //
            widthys=widthYs;
            widthysData=widthYsData;
            //-------
            widthws=widthWs;
            widthwsData=widthWsData;
            //
            meterialys=meterialYs;
            meterialysData=meterialYsData;
            //---------
            meterialws=meterialWs;
            meterialwsData=meterialWsData;
            // chartsZTL(Ys,YsD,t1);
            // chartsZTL(Ws,WsD,t2);
            // chartsZTL(widthYs,widthYsData,t3);
            // chartsZTL(widthWs,widthWsData,t4);            
            // chartsZTL(meterialYs,meterialYsData,t5);
            // chartsZTL(meterialWs,meterialWsData,t6);
        }
         //打开排水相关图表
        on(dom.byId("echartsBtn"), "click", function() {
            var eDialog=dijit.byId("eChartsDialog");
            eDialog.resize();
            eDialog.show();
            var a=$("input[name='PS_LINE_ec']:checked").val();
            switch(a){
                case"ys":
                    chartsZTL(ys,ysD,title[0]);
                    m2DgridCreate(ys,ysD);
                    break;
                case"ws":
                    chartsZTL(ws,wsD,title[1]);
                    m2DgridCreate(ws,wsD);
                    break;
                case"pwidthY":
                    chartsZTL(widthys,widthysData,title[2]);
                    m2DgridCreate(widthys,widthysData);
                    break;
                case"pwidthW":
                    chartsZTL(widthws,widthwsData,title[3]);
                    m2DgridCreate(widthws,widthwsData);
                    break;
                case"meterialY":
                    chartsZTL(meterialys,meterialysData,title[4]);
                    m2DgridCreate(meterialys,meterialysData);
                    break;
                case"meterialW":
                    chartsZTL(meterialws,meterialwsData,title[5]);
                    m2DgridCreate(meterialws,meterialwsData);
                    break;
                case"meterialP":
                    //meterialws是全局变量，meterialWs是局部变量此处不能用
                    //此处包括，数组结合，和数组去重
                   /* var arr = meterialws.contact(meterialys);
                    var set = new Set(arr);
                    var newArr = Array.from(set);*///弃用
                    //chartsZTL(meterialws,meterialwsData,title[6]);
                    var meterialps=meterialws.concat(meterialys);
                    var meterialpsData=meterialwsData.concat(meterialysData);
                    chartsZTL(meterialps,meterialpsData,title[6]);
                    m2DgridCreate(meterialps,meterialpsData);
                    break;
            }
        });
        //打开图/表
        on(dom.byId("echartsBtn_fac"), "click", function() {
            alert("暂无数据");
        });

        //打开图/表
        on(dom.byId("echartsBtn_upd"), "click", function() {
            alert("暂无数据更新");
        });
        //创建柱状图（字段在Y轴）
        function chartsZTL(alias,data,t) {
            // if (dijit.byId("chartsCon")) {
            //     dijit.byId("chartsCon").destroy();
            //     $("#chartsConBor").append("<div id='chartsCon'></div>");
            // }
            var myChart = ec.init(document.getElementById('chartsCon'));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text:t
                },
                tooltip: {},
                legend: {},
                dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    xAxisIndex: 0,
                    start: 0, // 左边在 10% 的位置。
                    end: 100 // 右边在 60% 的位置。
                },{ // 这个dataZoom组件，控制y轴。
                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    yAxisIndex: 0,
                    start: 0, // 左边在 10% 的位置。
                    end: 100 // 右边在 60% 的位置。
                }, { // 这个dataZoom组件，也控制x轴。
                    type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                    start: 0, // 左边在 10% 的位置。
                    end: 100 // 右边在 60% 的位置。
                }],
                xAxis: {
                    },
                yAxis: {
                    type: 'category',
                    data: alias
                },
                series: [{
                    type: 'bar',
                    data: data,
                    label:{
                        normal:{
                            show:true,
                            position:'right',
                            texStyle:{
                                color:'black'
                            }
                        }
                    } 
                }],
            };
            myChart.setOption(option);
        }
        //创建普通柱状图
        function chartsBarNormal(alias,data,t){
            /*echarts.init(document.getElementById('chartsCon')).setOption({
                        title:{
                            text:t
                        },
                        xAxis:[
                        {
                            type:'category',
                            data:alias
                        }
                        ],
                        yAxis:[
                            {
                                type:'value'
                            }
                        ],
                        series: [
                            {
                                type: 'bar',
                                data: data,
                            }
                        ]
                    });*/
        }
        //创建普通饼图
        function chartsPieNormal(data){
            // 绘制图表。
            echarts.init(document.getElementById('main')).setOption({
                series: {
                    type: 'pie',
                   /* data: [
                        {name: 'A', value: 1212},
                        {name: 'B', value: 2323},
                        {name: 'C', value: 1919}
                    ]*/
                    data:data
                }
            });
        }
        //统计对照表
        function m2DgridCreate(d1,d2){
            var str = "";
            str_s  = "<table class='gridtable' >";
            str  ="<tr><th>类型</th>"
            str2 ="<tr><th>数量</th>"
            for (var i = 0; i < d1.length;i++)
            {
                str += "<td>"+d1[i]+"</td>";
                str2 += "<td>"+d2[i]+"</td>";
            }
            str  += "</tr>"
            str2 += "</tr></table>";
            str   =str_s+str + str2;
            document.getElementById("chartsTable").innerHTML=str;
            dijit.byId("chartsConBor").resize();
        }
    /*end图表*/
    /*start 管线检修模块*/
        //管线检修右侧栏弹窗
        on(dom.byId("pipeFixBtn"),"click",function(){
            var fixContentP = dom.byId("fixContentP");
            dom.byId("fixContentP").style.display=dom.byId("fixContentP").style.display=="block"?"none":"block";
            dijit.byId(fixContentP.parentNode.id).resize();
             //关闭绘图工具
            DrawPointQ3.deactivate();
        });
        /*$("#pipeFixBtn").click(function(){
            var fixContentP = dom.byId("fixContentP");
            dom.byId("fixContentP").style.display=dom.byId("fixContentP").style.display=="block"?"none":"block";
            dijit.byId(fixContentP.parentNode.id).resize();
        });*/
        var ps_lineUrl=ARCGISIP+"/arcgis/rest/services/PS_LINE/MapServer";
        //给绘图工具绑定绘图完成事件
        var DrawPointQ3 = new Draw(map);
        //开始选择添加管线数据标签
        on(dom.byId("fixPipeAdd"), "click", function (){
          DrawPointQ3.activate(Draw.POINT);
        });
        //结束添加
        on(dom.byId("fixPipeStop"), "click", function (){
            //关闭绘图工具
            DrawPointQ3.deactivate();
            //清楚HLLayer图形（高亮）
            map.getLayer("HLLayer").clear();
        });
        on(DrawPointQ3, "draw-complete", function (result)
        {
            $("#loadgif").show();
            //获得绘图得到的点
            var geometry=result.geometry;
            // //关闭绘图工具
            // DrawPointQ3.deactivate();
            //执行空间查询
            identifyLineSourQuery(geometry);
        });      
        //执行空间查询
        function identifyLineSourQuery(geometry){
          //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
          var identifyTask = new IdentifyTask(ps_lineUrl);
          //定义空间查询参数对象
          var params = new IdentifyParameters();
          //容差
          params.tolerance = 3;
          //是否返回几何信息
          params.returnGeometry = true;
          //空间查询的图层，此时是多个图层，两个大图层
           var cLayers=mLayerList.layers;
          if(cLayers[0].visibility==false && cLayers[1].visibility==false){
            alert("请至少打开一个图层");
            $("#loadgif").hide();
            return;
          }else if(cLayers[0].visibility==false && cLayers[1].visibility!=false){
            params.layerIds = [1];
          }else if(cLayers[0].visibility!=false && cLayers[1].visibility==false){
            params.layerIds = [0];
          }else{
            params.layerIds = [0,1];
          }      
          //空间查询的条件
          params.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
          params.width = map.width;
          params.height = map.height;
          //空间查询的几何对象
          params.geometry = geometry;
          params.mapExtent = map.extent;
          //执行空间查询
          identifyTask.execute(params,showLineSourQueryResult);
        }
        function showLineSourQueryResult(idResults){
          //创建线符号
          var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 2);
          if (idResults.length==0){
             alert("请重新选择");
             $("#loadgif").hide();
          }else{
            var idResult=idResults[0];
            if(idResults[0].feature.geometry.type=="polyline"){
              //获得图形graphic
              var graphic = idResult.feature;
              //获取属性
              //var pipeID=idResult.feature.attributes.FLOW_ID;
              var pipeID=idResult.feature.attributes["流水号"];
              var code=idResult.feature.attributes.CODE;
              //维修管线
              if(pipeIDs.indexOf(pipeID)!=-1){
                alert("已添加");
                $("#loadgif").hide();
                return;
              }
              pipeIDs.push(pipeID);
              var pipeInfos="";
              pipeInfos="管线类型:"+idResult.feature.attributes["CODE"]+
                        "管径:"+idResult.feature.attributes["PWIDHT"]+
                        "材质:"+idResult.feature.attributes["MATERIAL"];
              //设置图形的符号
              graphic.setSymbol(lineSymbol);
              //map.getLayer("HLLayer").clear();
              map.getLayer("HLLayer").add(graphic);
              var html='<span class="tag" mid="'+pipeID+'" title="'+pipeInfos+'">'+pipeID+'&nbsp;&nbsp;<a href="#" onclick="tagRemove(this)">x</a></span>';
              domConstruct.place(html,"tagsinputID","last");
               $("#loadgif").hide();
            }
          }
        }
        //提交检修数据到后台
        on(dom.byId("fixSubmit"),"click",function(){
            if(dom.byId("fix_5").value.trim()==null){
                alert("工程编号不可为空");
                return;
            }
            if(pipeIDs.length==0){
                 alert("至少选择一条管线");
                return;
            }
            var cost=dom.byId("fix_10_cost").value.trim();
            if(!numCheck(cost)){
                alert("费用请输入为非数字，请重新输入");
                return;
            }
            //如果绘图未关闭则关闭
            DrawPointQ3.deactivate();
            //和html顺序密切相关，不可随意改变顺序
            var fixPipeJson = {};
            array.forEach(query(".fixPipeItem"), function(item, i) {
                //console.log(item.value+":"+i);
                var fixPipeFields = ["ManagerUnits", "ConstructionUnits", "ProjectName", "NameAndPhone", "ProjectCode", "place", "Principal", "Problem", "MoneyCost", "MoreInfo"];
                if (item.value == null) item.value = '';
                //对于原生html
                //fixPipeJson[fixPipeFields[i]]=item.value.trim();
                //对于dojo的dijit
                fixPipeJson[fixPipeFields[i]] = dijit.byNode(item).value.toString().trim();
            });
             //工程起止时间
             fixPipeJson["StartTime"]=dijit.byId("fix_8_s").value.Format("yyyy-MM-dd");
             fixPipeJson["EndTime"]=dijit.byId("fix_8_e").value.Format("yyyy-MM-dd");
             //添加的管线字段PIPES
             var pipeIDsStr='';
             array.forEach(pipeIDs,function(pipeId,i){
                pipeIDsStr=pipeIDsStr+pipeId+"|";
             });
             fixPipeJson["PIPES"]=pipeIDsStr;
             //检修类型
             array.forEach(document.getElementsByName("iChoose_fix"),function(item,i){
                if(item.checked==true){
                  fixPipeJson["FixType"]=item.value.toString().trim();
                }
             });
            //ajax
            fixPipeUpData(fixPipeJson);
        });
        //ajax，post数据
        function fixPipeUpData(data){
             var urlStr = encodeURI("Handler.ashx?method=fixPipe" + "&" + Math.random());
             xhr2(urlStr,{
                method:"post",
                handleAs: "text",
                data:JSON.stringify(data)
             }).then(function(results){
                //console.log("success");
                alert(JSON.stringify(results));
             });
        } 
        //检查数字
        function numCheck(value){
            var reg = /^\d+(\.\d+)?$/;   //包括小数
            if(reg.test(value)==true){
                //console.log("都是数字！通过");
                return true;
            }else{
                 //console.log("不是纯数字！失败！");
                return false;
            }
        }
    /*end 管线检修模块*/
    /*start 管线检修查询*/
        on(dom.byId("fixQuerybtn"),"click",function(){
            var queryJson={};
            var qNodes=query(".fixPipeQuery");
            //获取输入文本
            var stratTimeTxt=dijit.byNode(qNodes[4]).value;
            var EndTimeTxt=dijit.byNode(qNodes[5]).value;
            queryJson={ManagerUnits:"",
                        ConstructionUnits:dijit.byNode(qNodes[3]).value,
                        ProjectName:dijit.byNode(qNodes[1]).value,
                        NameAndPhone:"",
                        ProjectCode:dijit.byNode(qNodes[0]).value,
                        place:"",
                        Principal:"",
                        Problem:"",
                        MoneyCost:"",
                        MoreInfo:"",
                        PIPES:"",
                        FixType:dijit.byNode(qNodes[2]).value,
                        RecordTime:"",
                        StartTime:(stratTimeTxt==null ||stratTimeTxt==undefined)?"":stratTimeTxt.Format("yyyy-MM-dd"),
                        EndTime:(EndTimeTxt==null ||EndTimeTxt==undefined)?"":EndTimeTxt.Format("yyyy-MM-dd")};
            if(queryJson.StartTime=="NaN-aN-aN")queryJson.StartTime="";
            if(queryJson.EndTime=="NaN-aN-aN")queryJson.EndTime="";
            fixInfosQuery(queryJson);
        });
         //ajax，post数据
        function fixInfosQuery(queryJson){
             var urlStr = encodeURI("Handler.ashx?method=c_fixInfosQ" + "&" + Math.random());
             xhr2(urlStr,{
                method:"post",
                handleAs: "json",
                data:JSON.stringify(queryJson)
             }).then(function(results){
                //console.log("success");
                //alert(JSON.stringify(results));
                fixTable(results);
             });
        }
        function fixTable(data){
            var store = new ItemFileWriteStore({
                data:{
                    identifier:"ProjectCode",
                    items:data
                }
            });
            //name,field,width,editable
            var layout=[{field:"ProjectCode",name:"工程编号"},
                    {field:"ProjectName",name:"工程名称"},
                    {field:"ManagerUnits",name:"管理单位"},
                    {field:"Principal",name:"工程负责人"},
                    {field:"ConstructionUnits",name:"施工单位"},
                    {field:"NameAndPhone",name:"联系人/电话"},
                    {field:"FixType",name:"检修类型"},
                    {field:"place",name:"施工位置"},
                    {field:"MoneyCost",name:"施工费用(/万元)"},
                    {field:"PIPES",name:"管线"},
                    {field:"Problem",name:"管道问题"},
                    {field:"MoreInfo",name:"备注"},
                    {field:"RecordTime",name:"登记时间"},
                    {field:"StartTime",name:"开始时间"},
                    {field:"EndTime",name:"结束时间"}];
            if(!dijit.byId("FixInfosGrid")){
                var grid = new EnhancedGrid({
                    store: store,
                    structure: layout,
                    rowSelector: '20px' 
                },'FixInfosGrid');
                grid.startup();
            }else{
                 //console.dir(store);
                 dijit.byId("FixInfosGrid").store=store;
                 dijit.byId("FixInfosGrid")._refresh();
            }
            
        }
    /*end 管线检修查询*/

});
 //tag和graphic同步
 function tagRemove(evt){
             //console.log(evt);
             evt.parentNode.remove();
             dojo.forEach(map.getLayer("HLLayer").graphics,function(mgraphic,i){
                var mid=evt.parentNode.getAttribute("mid");
                if(mgraphic.attributes["流水号"]==mid){ //mgraphic.attributes.FLOW_ID==mid
                    map.getLayer("HLLayer").remove(mgraphic);
                    //delete pipeIDs.mid;(删除json项)
                    var index = pipeIDs.indexOf(mid);
                    if (index > -1) {
                        pipeIDs.splice(index, 1);
                    }
                }
             });

        }
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/*trim兼容不同浏览器*/
if (!String.prototype.trim) {
 
     /*---------------------------------------
      * 清除字符串两端空格，包含换行符、制表符
      *---------------------------------------*/
     String.prototype.trim = function () { 
      return this.triml().trimr(); 
     }
     
     /*----------------------------------------
      * 清除字符串左侧空格，包含换行符、制表符
      * ---------------------------------------*/
     String.prototype.triml = function () {
      return this.replace(/^[\s\n\t]+/g, "");
     }
     
     /*----------------------------------------
      * 清除字符串右侧空格，包含换行符、制表符
      *----------------------------------------*/
     String.prototype.trimr = function () {
      return this.replace(/[\s\n\t]+$/g, "");
     }
}