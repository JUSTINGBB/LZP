var mLayerList;
var layerSelectArr;
//var mLegend;
require([
    "esri/map", 
    "esri/IdentityManager",
    //esri.layers
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",  
    "esri/layers/ArcGISDynamicMapServiceLayer", 
    //esri.geometry   
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    //esri.renderers
    "esri/renderers/SimpleRenderer",
    "esri/renderers/UniqueValueRenderer",
    //esri.symbols
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/TextSymbol",
    "esri/layers/LabelClass",
    //esri.tasks
    "esri/tasks/GeometryService",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/tasks/IdentifyTask", 
    "esri/tasks/IdentifyParameters",
    "esri/tasks/FindTask",
    "esri/tasks/FindParameters",
    //esri.toolbars
    "esri/toolbars/draw",
    "esri/toolbars/navigation",
    //
    "esri/graphic","esri/Color", "esri/config", "esri/sniff", "esri/units", "esri/InfoTemplate","esri/SnappingManager",
    //dojo
    "dojo/_base/xhr",'dojo/_base/lang',"dojo/keys", "dojo/parser", "dojo/dom", "dojo/ready", "dojo/on","dojo/cookie","dojo/query", "dojo/_base/array","dojo/request/script",
    "dojo/dom-class", "dojo/dom-construct","dojo/dom-style","dojox/charting/themes/Dollar",//infowindow插图表的
    //esri.dijit
    "esri/dijit/Measurement", "esri/dijit/LayerList", "esri/dijit/Legend", "esri/dijit/FeatureTable",
    "esri/dijit/PopupTemplate", "esri/dijit/Popup","esri/dijit/Search","esri/dijit/editing/AttachmentEditor",
    //dijit
    "dijit/registry","dijit/Dialog","dijit/layout/BorderContainer","dijit/layout/TabContainer","dijit/layout/ContentPane",
    "dojo/store/Memory", "dijit/form/ComboBox", "dijit/form/FilteringSelect",
    'dojox/grid/DataGrid', 'dojo/data/ItemFileWriteStore',
    "echarts",
    "dojo/domReady!"
], function (Map, IdentityManager,
    GraphicsLayer,FeatureLayer,  ArcGISDynamicMapServiceLayer,
    Polyline,Point, 
    SimpleRenderer,UniqueValueRenderer,PictureMarkerSymbol,
    SimpleMarkerSymbol, SimpleLineSymbol,SimpleFillSymbol, TextSymbol, LabelClass,
    GeometryService,QueryTask,taskQuery,IdentifyTask,IdentifyParameters,FindTask,FindParameters,
    Draw,Navigation, 
    Graphic, Color, esriConfig, has, Units,InfoTemplate,  SnappingManager,
    xhr,lang,keys, parser, dom, ready, on,cookie,query,arrayUtils,script,
    domClass, domConstruct, domStyle,theme,
    Measurement, LayerList, Legend, FeatureTable, PopupTemplate, Popup,Search,AttachmentEditor,
    registry,Dialog, BorderContainer, TabContainer, ContentPane,
    Memory,ComboBox,FilteringSelect,DataGrid,ItemFileWriteStore,ec) {
    //parser.parse();
    var userName = cookie('userName'),
        level = cookie('level'); 
    userName=uncompile(userName);
    userType=uncompile(level);
    dom.byId("userText").innerHTML=userName;
    //创建线符号
    var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0, 0.8]), 3);
    //创建面符号
    var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([255, 0, 0, 0]), 3);
    var popup = new Popup({
        fillSymbol: fill,
        titleInBody: false,
    }, domConstruct.create("div"));
    domClass.add(popup.domNode, "light");
    //domConstruct.place(popup.domNode,"test"); (起作用了，但是加载完成后，又恢复默认,证明：放在“属性查看”按钮点击事件里起作用)
    map.infoWindow = popup;
/**start管线/点属性弹窗/featureTable参数设置**/
    //允许显示的字段
    /*var points_outFields=["PID", "GEOOBJNUM", "X","Y","PGZ", "PMZ", "PPZ", 'PROAD',"Ctype", "POWNER", "Source"];
    var line_outFields = ["GEOOBJNUM", "SNODEID", "ENODEID", "POWNER", "MATERIAL", 'PWIDHT',"LAYDATE", "LAYMETHOD", "Source", "LBMS","LEMS","LBTG","LETG","PSTATUS","PROAD","PLength"];*/
    var points_outFields=["PID", "GEOOBJNUM","CODE","X","Y", "PPZ", 'PROAD', "POWNER", "SOURCE"];
    var line_outFields = ["GEOOBJNUM", "SNODEID", "ENODEID", "CODE","POWNER", "PSlope","MATERIAL", 'PWIDHT',"LAYDATE", "LAYMETHOD", "SOURCE", "LBTG","LETG","PSTATUS","PROAD","PLength"];
    var factories_outFields=["FileNum","TextString","EstablishT","Address","LegalPerso","BusinessNu","ContactPer","PhoneNum","BusinessTy","Nature","ProductSer","MainMateri","Pretreatme","LicenseVal","LicenseNum"];
    //popup弹窗content内容，与下面fieldInfos相对应，若不输入，则字段以fieldInfos相对应
    var points_description = "管点编号: {PID}"+
                "</br>类型：{CODE}"+
                //"</br>地物编码: {GEOOBJNUM} "+
                //"</br>x坐标: {X} </br> y坐标:{Y}" +
                // "</br>地面高程: {PGZ}m</br>埋&nbsp&nbsp&nbsp&nbsp深: {PMZ}m"+
                "</br>管点高程: {PPZ}m" +
                "</br>所在道路: {PROAD}" +   
                // "</br>连接类型: {Ctype} "+
                // "</br>数据来源: {SOURCE}"+
                "</br>权&nbsp&nbsp&nbsp&nbsp属: {POWNER}";
    var line_description = "起点编号: {SNODEID}" + "</br>终点编号：{ENODEID}"+"</br>类&nbsp&nbsp&nbsp&nbsp型：{CODE}"+
              // "地物编码: {GEOOBJNUM}"+
             "</br>材&nbsp&nbsp&nbsp&nbsp质: {MATERIAL}</br>" +"管&nbsp&nbsp&nbsp&nbsp径:{PWIDHT}mm</br>" +
             "权&nbsp&nbsp&nbsp&nbsp属: {POWNER}" +"</br>坡&nbsp&nbsp&nbsp&nbsp度: {PSlope}%</br>" +
             "埋设年月: {LAYDATE}" +"</br>埋设方式: {LAYMETHOD} </br>"+
             // "数据来源: {SOURCE}</br>" +
             // "起点埋深: {LBMS}m</br>终点埋深: {LEMS}m</br>"+
             "起点高程: {LBTG}m </br>" +
             "终点高程: {LETG}m</br>" +"管线状态: {PSTATUS}</br>" +
             "所在道路: {PROAD}</br>" +"管线长度: {PLength}m";
    var factories_description=/*"编&nbsp&nbsp&nbsp&nbsp&nbsp号:{FileNum}</br>"+*/"排水户名:{TextString}</br>"+
             /*"成立时间:{EstablishT}</br>"+"详细地址:{Address}</br>"+*/
             /*"法定代表人:{LegalPerso}</br>"+"营业执照注册号:{BusinessNu}</br>"+*/
             /*"联&nbsp系&nbsp人:{ContactPer}</br>"+"联系电话:{PhoneNum}</br>"+*/
             /*"排水户业务性质:{BusinessTy}</br>"+*/"排水户性质:{Nature}</br>"+
             "主要产品或服务:{ProductSer}</br>"+/*"主要原料:{MainMateri}</br>"+*/
             /*"预处理方式:{Pretreatme}</br>"+*/"排水许可证有效期:{LicenseVal}</br>"+
            /* "排水许可证编号:{LicenseNum}"+*/"</br><a href='javascript:void(0)' onclick ='editFacInfos()'>详细信息</a>";
    //popup弹窗显示字段
    var line_fieldInfos = [
                    {
                        'fieldName': 'GEOOBJNUM',
                        'label': '地物编码',//
                    },
                    {
                        'fieldName': 'SNODEID',
                        'label': '起点编号',
                      },
                      {
                          'fieldName': 'ENODEID',
                          'label': '终点编号',
                      },
                       {
                           'fieldName': 'POWNER',
                           'label': '权属',
                       },
                       {
                           'fieldName': 'PSlope',
                           'label': '坡度',
                           'format': {
                              'places': 2
                          }
                       },
                      {
                          'fieldName': 'MATERIAL',
                          'label': '材质',
                      },
                      {
                          'fieldName': 'PWIDHT',
                          'label': '管径',
                      },
                      {
                          'fieldName': 'LAYDATE',
                          'label': '埋设年月',
                      },
                      {
                          'fieldName': 'LAYMETHOD',
                          'label': '埋设方式',
                      },
                     {
                         'fieldName': 'PROAD',
                         'label': '所在道路',
                     },
                    /* {
                         'fieldName': 'SOURCE',
                         'label': '数据来源',
                     },*/
                    /* {
                         'fieldName': 'LBMS',
                         'label': '起点埋深',//
                     },
                     {
                         'fieldName': 'LEMS',
                         'label': '终点埋深',//
                     },*/
                     {
                         'fieldName': 'LBTG',
                         'label': '起点高程',
                     },
                     {
                         'fieldName': 'LETG',
                         'label': '终点高程',
                     },
                     {
                         'fieldName': 'PSTATUS',
                         'label': '管线状态',
                     },
                     {
                         'fieldName': 'PLength',
                         'label': '管线长度',
                          'format': {
                              'places': 2
                          }
                     },
                ];
    var points_fieldInfos = [
                      {
                          'fieldName': 'PID',
                          'label': '管点编号',
                      },
                      {
                        'fieldName': 'GEOOBJNUM',
                        'label': '地物编码',//
                      },
                       {
                          'fieldName': 'X',
                          'label': 'x坐标',
                          'format': {
                              'places': 3
                          }

                      },
                      {
                          'fieldName': 'Y',
                          'label': 'y坐标',
                          'format': {
                              'places': 3
                          }
                          
                      },
                      {
                          'fieldName': 'PGZ',
                          'label': '地面高程',//
                      },
                      {
                          'fieldName': 'PMZ',
                          'label': '埋深',//
                      },
                      {
                          'fieldName': 'PPZ',
                          'label': '管点高程',
                      },
                      {
                          'fieldName': 'Ctype',
                          'label': '连接类',//
                      },
                      {
                          'fieldName': 'PROAD',
                          'label': '所在道路（地名）',
                      },
                      {
                          'fieldName': 'POWNER',
                          'label': '权属',
                      },
                     {
                         'fieldName': 'PROAD',
                         'label': '所在道路',
                     },
                     {
                         'fieldName': 'SOURCE',
                         'label': '数据来源',
                     },
                ];
    var factories_fieldInfos=[
      {
        fieldName:'OBJECTID',
        label:"编号",
      },
      {
        fieldName:'FileNum',
        label:'档案编号',
      },
      {
        fieldName:'TextString',
        label:'排水户名',
      },
       {
        fieldName:'EstablishT',
        label:'成立时间 ',
        format: { dateFormat: 'shortDate' }
      },
       {
        fieldName:'Address',
        label:'详细地址',
      },
       {
        fieldName:'LegalPerso',
        label:'法定代表人',
      },
       {
        fieldName:'BusinessNu',
        label:'营业执照注册号',
      },
       {
        fieldName:'ContactPer',
        label:'联系人',
      },
       {
        fieldName:'PhoneNum',
        label:'联系电话',
      },
       {
        fieldName:'BusinessTy',
        label:'排水户业务性质',
      },
       {
        fieldName:'Nature',
        label:'排水户性质',
      },
       {
        fieldName:'ProductSer',
        label:'主要产品或服务',
      },
       {
        fieldName:'MainMateri',
        label:'主要原料',
      },
       {
        fieldName:'Pretreatme',
        label:'预处理方式',
      },
       {
        fieldName:'LicenseVal',
        label:'排水许可证有效期',
      },
       {
        fieldName:'LicenseNum',
        label:'排水许可证编号',
      }
    ];
    //featureTable显示字段信息
    var pointsFieldInfosT = [
                      {
                          name: 'PID',
                          alias: '管点编号',
                          editable: false,
                      },
                      {
                          name: 'GEOOBJNUM',
                          alias: '地物编码',
                          editable: false,
                          visible: false,
                      },
                      {
                        name: 'CODE',
                        alias: '类型',
                        editable: false,
                        visible: false,
                      },
                      {
                          name: 'X',
                          alias: 'x坐标',
                          editable: false,
                          visible: false,
                          format: {
                              places: 3,
                          }
                      },
                      {
                          name: 'Y',
                          alias: 'y坐标',
                          editable: false,
                          visible: false,
                          format: {
                              places: 3,                          
                          }
                      },
                     /* {
                          name: 'PGZ',
                          alias: '地面高程',
                          editable: false,
                          format: {
                              template: "${value} m"
                          }
                      },
                      {
                          name: 'PMZ',
                          alias: '埋深',
                          editable: false,
                          format: {
                              template: "${value} m"
                          }
                      },*/
                      {
                          name: 'PPZ',
                          alias: '管点高程',
                          editable: false,
                          format: {
                              template: "${value} m"
                          }
                      },
                      /*{
                          name: 'Ctype',
                          alias: '连接类',
                          editable: false,
                      },*/
                      {
                          name: 'PROAD',
                          alias: '所在道路（地名）',
                          editable: true,
                      },
                      {
                          name: 'POWNER',
                          alias: '权属',
                          editable: true,
                      },
                     {
                         name: 'SOURCE',
                         alias: '数据来源',
                         editable: false,
                         visible: false,
                     },
                ];
    var lineFieldInfosT = [
                    {
                        name: 'GEOOBJNUM',
                        alias: '地物编码',
                        editable: false,
                        visible: false,
                    },
                    {
                        name: 'CODE',
                        alias: '类型',
                        editable: false,
                        visible: false,
                    },
                    {
                        name: 'SNODEID',
                        alias: '起点编号',
                        visible: false,
                        editable: false,
                    },
                      {
                          name: 'ENODEID',
                          alias: '终点编号',
                          visible: false,
                          editable: false,
                      },
                       {
                           name: 'POWNER',
                           alias: '权属',
                           editable: true,
                       },
                        {
                           name: 'PSlope',
                           alias: '坡度',
                           editable: false,
                           format: {
                              template: "${value} %"
                          }
                       },
                      {
                          name: 'MATERIAL',
                          alias: '材质',
                          editable: true,
                      },
                      {
                          name: 'PWIDHT',
                          alias: '管径',
                          editable: true,
                          format: {
                              template: "${value} mm"
                          }
                      },
                      {
                          name: 'LAYDATE',
                          alias: '埋设年月',
                          editable: false,
                      },
                      {
                          name: 'LAYMETHOD',
                          alias: '埋设方式',
                          visible: false,
                          editable: false,
                      },
                     {
                         name: 'PROAD',
                         alias: '所在道路',
                         editable: true,
                     },
                     {
                         name: 'SOURCE',
                         alias: '数据来源',
                         editable: false,
                         visible: false,
                     },
                     /*{
                         name: 'LBMS',
                         alias: '起点埋深',
                         editable: false,
                         format: {
                             template: "${value} m"
                         }
                     },
                     {
                         name: 'LEMS',
                         alias: '终点埋深',
                         editable: false,
                         format: {
                             template: "${value} m"
                         }
                     },*/
                     {
                         name: 'LBTG',
                         alias: '起点高程',
                         editable: false,
                         format: {
                             template: "${value} m"
                         }
                     },
                     {
                         name: 'LETG',
                         alias: '终点高程',
                         editable: false,
                         format: {
                             template: "${value} m"
                         }
                     },
                     {
                         name: 'PSTATUS',
                         alias: '管线状态',
                         visible:false,
                         editable: true,
                     },
                     {
                         name: 'PLength',
                         alias: '管线长度(米)',
                         editable: false,
                         format: {
                             template: "${value} m"
                         }
                     },
                ]; 
    var factoryFieldInfosT= [
      {
        name:'OBJECTID',
        alias:"编号",
        visible: false,
        editable: false,
      },
      {
        name:'FileNum',
        alias:'档案编号',
        editable: true,
      },
      {
        name:'TextString',
        alias:'排水户名',
        editable: false,
      },
       {
        name:'EstablishT',
        alias:'成立时间 ',
        editable: true,
      },
       {
        name:'Address',
        alias:'详细地址',
        editable: true,
      },
       {
        name:'LegalPerso',
        alias:'法定代表人',
        editable: true,
      },
       {
        name:'BusinessNu',
        alias:'营业执照注册号',
        visible: false,
        editable: true,
      },
       {
        name:'ContactPer',
        alias:'联系人',
        editable: true,
      },
       {
        name:'PhoneNum',
        alias:'联系电话',
        editable: true,
      },
       {
        name:'BusinessTy',
        alias:'排水户业务性质',
        visible: false,
        editable: true,
      },
       {
        name:'Nature',
        alias:'排水户性质',
        visible: false,
        editable: true,
      },
       {
        name:'ProductSer',
        alias:'主要产品或服务',
        editable: true,
      },
       {
        name:'MainMateri',
        alias:'主要原料',
        visible: false,
        editable: true,
      },
       {
        name:'Pretreatme',
        alias:'预处理方式',
        visible: false,
        editable: true,
      },
       {
        name:'LicenseVal',
        alias:'排水许可证有效期',
        editable: true,
      },
       {
        name:'LicenseNum',
        alias:'排水许可证编号',
        editable: true,
      }
    ];
/**end管线/点属性弹窗/featureTable参数设置**/
/*start核心数据动态图层*/
    var serverType1="FeatureServer";
    var serverType2="MapServer";
    var serverType;
    if(userType==1){
      serverType=serverType1;
    }
    else{
      serverType=serverType2;
    }
    var factoryUrl=ARCGISIP+"/arcgis/rest/services/Factories/";
    var ps_pipeUrl=ARCGISIP+"/arcgis/rest/services/PS_PIPE/";
    var ps_lineUrl=ARCGISIP+"/arcgis/rest/services/PS_LINE/";
    //var ps_pointsUrl=ARCGISIP+"/arcgis/rest/services/PS_POINTS/";
/*    var ps_lineLyr=new ArcGISDynamicMapServiceLayer(ps_lineUrl+serverType2,{
      id:"PS_LINE"
    });
    map.addLayer(ps_lineLyr);*/
    //排水户图层
    var factoryLyr = new FeatureLayer(factoryUrl+ serverType2+ "/0", {
      id:"Factories",
      outFields: ["*"],
      visible:false
    });
    var fac_fill = new SimpleFillSymbol().setColor(new Color([0, 255, 255, 0.1]));
    var fac_renderer = new SimpleRenderer(fac_fill);
    factoryLyr.setRenderer(fac_renderer);
    var factoriesColor=new Color("#666");
    //--start--排水户面要素显示Label
    // create a text symbol to define the style of labels
    var factoriesLabel = new TextSymbol().setColor(factoriesColor);
    factoriesLabel.font.setSize("5pt");
    factoriesLabel.font.setFamily("arial");
    //this is the very least of what should be set within the JSON  
    var labelClass_json = {
      "labelExpressionInfo": {"value": "{TextString}"},
      "minScale":9017.87105013534,
      "maxScale":563.6169405,
    };
    //create instance of LabelClass (note: multiple LabelClasses can be passed in as an array)
    //排水户标签（label）样式设定
    var labelClass = new LabelClass(labelClass_json);
    //labelClass.symbol = statesLabel; // symbol also can be set in LabelClass' json
    factoryLyr.setLabelingInfo([ labelClass ]);
    map.addLayer(factoryLyr,0);
    //--end--排水户面要素显示Label
    //雨水管线
    var ys_pipeID = "YS_PIPE";
    var ys_pipeUrl = ARCGISIP + "/arcgis/rest/services/YS_PIPE/";
    var ys_pipeLayer = new ArcGISDynamicMapServiceLayer(ys_pipeUrl+serverType2,{
      "id":ys_pipeID,
    });
    ys_pipeLayer.mType="ys";
    ys_pipeLayer["ztree_name"]="雨水管线";
    ys_pipeLayer["ztree_checked"]=true;
    //污水管线
    var ws_pipeID = "WS_PIPE";
    var ws_pipeUrl = ARCGISIP + "/arcgis/rest/services/WS_PIPE/";
    var ws_pipeLayer = new ArcGISDynamicMapServiceLayer(ws_pipeUrl+serverType2,{
      "id":ws_pipeID,
    });
    ws_pipeLayer.mType="ws";
    ws_pipeLayer["ztree_name"]="污水管线";
    ws_pipeLayer["ztree_checked"]=true;
    //给水管线
    var js_pipeID = "JS_PIPE";
    var js_pipeUrl = ARCGISIP + "/arcgis/rest/services/JS_PIPE/";
    var js_pipeLayer = new ArcGISDynamicMapServiceLayer(js_pipeUrl+serverType2,{
      "id":js_pipeID,
    });
    js_pipeLayer.mType="js";
    js_pipeLayer["ztree_name"]="给水管线";
    js_pipeLayer["ztree_checked"]=true;
    map.addLayers([ys_pipeLayer,ws_pipeLayer,js_pipeLayer]);
    //自动井图层
    var ps_Auto_PointsID = "PS_Auto_Points";
    var ps_Auto_PointsUrl = ARCGISIP + "/arcgis/rest/services/PS_Auto_Points/";
    var ps_Auto_PointsLayer = new ArcGISDynamicMapServiceLayer(ps_Auto_PointsUrl+serverType2,{
      "id":ps_Auto_PointsID,
       visible:false,
    });
    map.addLayer(ps_Auto_PointsLayer);
    //自动井显隐
    on(dom.byId("psAuto_PointsBtn"),"click",function(){
      var color =dom.byId("psAuto_PointsBtn").style["background-color"];
      if(color==downColor){
        dom.byId("psAuto_PointsBtn").style["background-color"]="";
        ps_Auto_PointsLayer.setVisibility(false);
      }else{
        ps_Auto_PointsLayer.setVisibility(true);
        dom.byId("psAuto_PointsBtn").style["background-color"]=downColor;
        ps_Auto_PointsLayer.infoTemplates=[{'infoTemplate':new PopupTemplate({
            "title":"自动闸门井",
            "description":points_description,
            "fieldInfos":points_fieldInfos,
            "showAttachments":true
          })},null];
      }
    });
    //排水口图层
    var ps_outerUrl=ARCGISIP+"/arcgis/rest/services/PS_OUTER/MapServer/0";
    var ps_outerLayer = new FeatureLayer(ps_outerUrl,{
      "id":"ps_outer",
      outFields: ["*"],
      visible:false,
      minScale:300000,
      maxScale:200
    });
    var psOuter_renderer = new UniqueValueRenderer("", "CODE");
    psOuter_renderer.addValue("YS", new PictureMarkerSymbol("../images/psOuter/ysOuter.png", 10, 10));
    psOuter_renderer.addValue("WS", new PictureMarkerSymbol("../images/psOuter/wsOuter.png", 10, 10));
    ps_outerLayer.setRenderer(psOuter_renderer);
    map.addLayer(ps_outerLayer);
    //POI点图层
    /*var addressLyr= new FeatureLayer(ARCGISIP+"/arcgis/rest/services/POI_HZW_cgcs2000/MapServer",{
        id:"mAddress"
    });
    map.addLayer(addressLyr);*/
    var ResultLayer = new GraphicsLayer();
    ResultLayer.id = "ResultLayer";//查询结果放此
    map.addLayer(ResultLayer);

    var HLLayer = new GraphicsLayer();
    HLLayer.id = "HLLayer";//高亮结果放此
    map.addLayer(HLLayer);
/*end核心数据动态图层*/
/**layers-add-result事件，获取图层树层次和详细信息**/
    map.on("layers-add-result", function(evt) {
        //alert("chufa");
        var layerInfo = arrayUtils.map(evt.layers, function(layer, index) {
          return {
            layerInfos: layer.layer.layerInfos,
            url: layer.layer.url,
            mType: layer.layer.mType,
            id:layer.layer.id,
            name:layer.layer.ztree_name,
            checked:layer.layer.ztree_checked
          };
        });
        //分类查询
        layerQuery(layerInfo);
        //图层树创建
        zTree_LayesTree(layerInfo);
    });
/**地图缩放"zoom-end"事件,图层树相关控制**/
    on(map,"zoom-end",function(e){
        var level=map.__LOD.level;//当级别为18（1：2255）
        //console.log(level);
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        var zNodes=zTree.getNodes();
        //控制到一定级别（18），管点层才能被选中
        for(j=0;j<zNodes.length;j++){
          var childrenNodes=zNodes[j].children;
          for(i=0;i<childrenNodes.length;i++){
            if(childrenNodes[i].name.indexOf("管段")==-1){
              if(level>17){
                zTree.setChkDisabled(childrenNodes[i],false);
              }else{
                zTree.setChkDisabled(childrenNodes[i],true);
              }
            }
          }
        }
    });
/**start图层树**/
    //图层信息改变后只需更改此处(废弃)，但属性查看按钮需要用到
    var mLayerInfos = [{
        "id":"YS_PIPE",
        "layer": ys_pipeLayer,
        "title":"雨水管线"
    },{
        "id":"WS_PIPE",
        "layer": ws_pipeLayer,
        "title":"污水管线"
    },{
        "id":"JS_PIPE",
        "layer": js_pipeLayer,
        "title":"给水管线"
    }];
    //var mLayerList
    //arcgis api自带的LayerList控件不好用，使用新的zTree组件创建图层树
    mLayerList = new LayerList({
      "map": map,
      "removeUnderscores":true,
      //"showLegend" : true,
      //"showOpacitySlider": true,
      "layers" : mLayerInfos,
      "showSubLayers":true
    }, "layerListDom");
    mLayerList.startup();

    //ztrees生成和图层交互
    function zTree_LayesTree(layerInfos){
      //console.log(layerInfos);
      var zTreeNodesArr=[]; 
      for(j=0;j<layerInfos.length;j++){
        var currentNodeJson={};
        currentNodeJson={
          id:layerInfos[j].id,
          name:layerInfos[j].name,
          checked:layerInfos[j].checked,
          children:zTreeBuilder(layerInfos[j])
        }
        zTreeNodesArr.push(currentNodeJson);
      }
      var setting = {
          view: {
              showLine: false,
          },
          check: {
              enable: true,
              chkStyle: "checkbox"
          },
          callback:{
            onCheck:zTreeOnCheck
          },
          data: {
              simpleData: {
                  enable: false
              }
          }
      };
      var zNodes=zTreeNodesArr;
      //check检查和layers的显隐关联
      function zTreeOnCheck(e, treeId, treeNode){
        //console.log("what the fuck");
        if(treeNode.level==0){
            var dynamicLayer=map.getLayer(treeNode.id);
            dynamicLayer.setVisibility(treeNode.checked);
        }else{
            var visibleLayerIDS=[];
            var parentNode=treeNode.getParentNode();
            var childrenNodes=parentNode.children;
            var dynamicLayer2=map.getLayer(parentNode.id);
            for(i=0;i<childrenNodes.length;i++){
              if(childrenNodes[i].checked){
                visibleLayerIDS.push(childrenNodes[i].id);
              }
            }
            dynamicLayer2.setVisibleLayers(visibleLayerIDS);
        }
      }
      //zTree的treeNodes的json格式数据
      function zTreeBuilder(ztree_LayerInfos){
        ztree_LayerInfos.children=ztree_LayerInfos.layerInfos;
        var nodes=ztree_LayerInfos.children;
        var subNodesArr=[];
        for(i=0;i<nodes.length;i++){
          nodes[i].checked=true;
          //如果是管点不是管段
          if(nodes[i].name.indexOf('管段')==-1){
            //在ztree为不可check状态
            nodes[i].chkDisabled=true;
          }
          var zTreeNode={
            id:nodes[i].id,
            name:nodes[i].name,
            checked:nodes[i].checked,
            chkDisabled:nodes[i].chkDisabled
          }
          subNodesArr.push(zTreeNode);
        }
        return subNodesArr;
      }
      //
      $(document).ready(function(){
          $.fn.zTree.init($("#treeDemo"), setting, zNodes);  
      });

    }
/**end图层树**/      
//初始化geometryservice
    esriConfig.defaults.geometryService = new GeometryService(ARCGISIP + "/arcgis/rest/services/Utilities/Geometry/GeometryServer");
/*start排水口显隐藏等*/
 on(dom.byId("psOuterBtn"),"click",function(){
    var color =dom.byId("psOuterBtn").style["background-color"];
    if(color==downColor){
      dom.byId("psOuterBtn").style["background-color"]="";
      //map.getLayer("Factories").setVisibility(false);
      ps_outerLayer.setVisibility(false);
    }else{
      //map.getLayer("Factories").setVisibility(true);
      ps_outerLayer.setVisibility(true);
      dom.byId("psOuterBtn").style["background-color"]=downColor;
      ps_outerLayer.infoTemplate=new PopupTemplate({
          "title":"排水口信息",
          "description":points_description,
          "fieldInfos":points_fieldInfos,
          "showAttachments":true
        });
    }
  });
/*end排水口显隐藏等*/
/**start排水户面图层显隐藏/查看属性信息(popup)/详细信息表**/
  on(dom.byId("factoriesBtn"),"click",function(){
    var color =dom.byId("factoriesBtn").style["background-color"];
    if(color==downColor){
      dom.byId("factoriesBtn").style["background-color"]="";
      //map.getLayer("Factories").setVisibility(false);
      factoryLyr.setVisibility(false);
    }else{
      //map.getLayer("Factories").setVisibility(true);
      factoryLyr.setVisibility(true);
      dom.byId("factoriesBtn").style["background-color"]=downColor;
      factoryLyr.infoTemplate=new PopupTemplate({
          "title":"排水户信息",
          "description":factories_description,
          "fieldInfos":factories_fieldInfos,
          //"showAttachments":true
        });
    }
  });
  var attachmentEditor = new AttachmentEditor({}, dom.byId("facAttachments"));
  factoryLyr.on("click",function(evt){
    //console.log(evt);
    mFactoryInfosTab(factories_fieldInfos,evt.graphic.attributes);
    attachmentEditor.showAttachments(evt.graphic,factoryLyr);
    attachmentEditor.startup();
  });
  map.infoWindow.on("show", function(evt) {
    //console.log(evt);
  });
  function mFactoryInfosTab(fieldInfos,attributes){
    var html="<table class='altrowstable' style='width:100%'>";
    for(var i=0;i<fieldInfos.length;i++){
      var name=fieldInfos[i].fieldName;
      var label=fieldInfos[i].label;
      //console.log(attributes[name]);
      var value=attributes[name];
      html=html+"<tr><td>"+label+"</td><td>"+value+"</td></tr>";
    }
    html+="</table>";
    dom.byId("facDiaTab").innerHTML =html;
  }
/**end排水户面图层显影**/
/**start地名搜索**///(暂弃用)
 /*   var search=new Search({
        map: map,
        sources: [],
        }, "search"
    );
    //listen for the load event and set the source properties
    search.on("load", function () {
        var sources = search.sources;
        sources.push({
           featureLayer: new FeatureLayer(ARCGISIP + "/arcgis/rest/services/POI_HZW/MapServer/0"),
        searchFields: ["F_NAME"],
        displayField: "F_NAME",
        exactMatch: false,
        outFields: ["F_NAME", "F_ADDRESS", "F_GEONUM"],
        name: "地名",
        placeholder: "吉利",
        zoomScale: 4000,
        //Create an InfoTemplate and include three fields
        infoTemplate: new InfoTemplate("属性",
          "地名: ${F_NAME}</br>地址: ${F_ADDRESS}</br>地号: ${F_GEONUM}"
        ),
        });
        //Set the sources above to the search widget
        search.set("sources", sources);
     });
     search.startup();*/
/**start地名搜索**/
/**start属性查看弹窗**/
    //属性查看按钮
    on(dom.byId("attributeBtn"), "click", function () {
        var $attributeBtn = $("#attributeBtn");
        var cLayer={};
        var color = $attributeBtn.css("background-color");
        if (color == downColor) {
            $attributeBtn.css("background-color", "");
            for(var i=0;i<mLayerInfos.length-1;i++){
              cLayer=map.getLayer(mLayerInfos[i].id);
              cLayer.infoTemplates = null;
            }
        }
        else {
            $attributeBtn.css("background-color", downColor);
            //设置弹框属性
            for(var i=0;i<mLayerInfos.length-1;i++){
              cLayer=map.getLayer(mLayerInfos[i].id);
              cLayer.infoTemplates = mSetInfoTemplate(cLayer);
            }
        }
        //domConstruct.place(popup.domNode,"popupLoc");
    });  
    //设置弹出属性框值
    function mSetInfoTemplate(mlayers){
      var mLayerInfos=mlayers.layerInfos
      var mInfoTemplates={};
      var mDescription='';
      var mFieldInfos=''
      for(var i=0;i<mLayerInfos.length;i++){
        if(mLayerInfos[i].name.indexOf('管段')!=-1){
          mDescription=line_description;
          mFieldInfos=line_fieldInfos;
        }
        else{
          mDescription=points_description;
          mFieldInfos=points_fieldInfos;
        }
       var mInfoTemplate=new PopupTemplate({
          "title":mLayerInfos[i].name,
          "description":mDescription,
          "fieldInfos":mFieldInfos,
          "showAttachments":true
        });
        mInfoTemplates[i]={'infoTemplate':mInfoTemplate};
      }
      return mInfoTemplates; 
    }
/**end属性查看弹窗**/ 
/**start自定义图例**/ 

    //添加图例1.0(原始控件)
   /* var mLegend = new Legend({
        "map": map,
        "title": "图例",
        "autoUpdate":true,
        "respectCurrentMapScale":true,
        "layerInfos":mLayerInfos
    }, "legend");
    mLegend.startup();*/
    //添加图例
    //jq
    /*$.ajax({url:"http://localhost:6080/arcgis/rest/services/YS_PIPE/MapServer/legend?f=json",asyn:true,dataType:"json",success:function(result){console.dir(result);}});*/
    //dojo ajax(dojo/request),/script跨域请求数据
    var ps_legendUrl=ps_pipeUrl+serverType2+"/"+"legend?f=json";
    var js_legendUrl=js_pipeUrl+serverType2+"/"+"legend?f=json";
    script.get(ps_legendUrl,{
      jsonp: 'callback'
    }).then(function(result) {//获取图例信息,绘制图例表
      //console.dir(result);
      var html="<table id='legendTable' class='altrowstable' title='图例'>";
      for(var i=0;i<result.layers.length;i++){
        var lyrName=result.layers[i].layerName;
        var legendImg="data:image/png;base64,"+result.layers[i].legend[0].imageData;
        html+="<tr><td>"+lyrName+"</td><td><img src='"+legendImg+"'></td></tr>";
      }
      html+="</table>";
      domConstruct.place(html,"legend");
    });
    //domConstruct.place("",)
    //图例显示隐藏
    on(dom.byId("legendBtn"), "click", function () {
      dom.byId("legendDiv").style.display=dom.byId("legendDiv").style.display=="block"?"none":"block";
      dom.byId("legendBtn").style.backgroundColor=dom.byId("legendBtn").style.backgroundColor==downColor ? '' : downColor;
        /*document.getElementById('legendDiv').style.display = document.getElementById('legendDiv').style.display == 'block' ? 'none' : 'block';
        document.getElementById('legendBtn').style.backgroundColor = document.getElementById('legendBtn').style.backgroundColor == downColor ? '' : downColor;*/
    });
/**end自定义图例**/ 
/**start测量工具**/ 
    //测量工具响应函数
    on(dom.byId("measureBtn"), "click", function () {
        var $measureBtn = $("#measureBtn");
        var color = $measureBtn.css("background-color");
        //按钮按下和按回
        if (color == downColor) {
          //按钮按回，除去蓝底，隐藏测量工具，除去绘制结果，关闭功能
            $measureBtn.css("background-color", "");
            measurement.hide();
            measurement.clearResult();
            measurement.setTool("location",false);
            measurement.setTool("distance",false);
            measurement.setTool("area",false);
        }
        else {
            $measureBtn.css("background-color", downColor);
            measurement.show();
        }
    });
    //添加测量功能
    var snapManager = map.enableSnapping({
        snapKey: has("mac") ? keys.META : keys.CTRL
    });
    //按住ctrl根据layerInfos开启点提示
    snapManager.setLayerInfos(mLayerInfos);
    var measurement = new Measurement({
        "map": map,
        "defaultAreaUnit": Units.SQUARE_METERS,
        "defaultLengthUnit": Units.METERS,       
    }, dom.byId("measurementDiv"));
    measurement.startup();
    //面积单位
    measurement._areaUnitStrings=["平方千米","平方米","公顷"];
    measurement._areaUnitStringsLong=["esriSquareKilometers","esriSquareMeters","esriHectares"];
    //距离单位
    measurement._distanceUnitStrings=["千米","米"];
    measurement._distanceUnitStringsLong=["esriKilometers","esriMeters"];
    measurement.hide();
/**end测量工具**/
/**start流向查询**/ 
  //给绘图工具绑定绘图完成事件
  var DrawPolygonQ = new Draw(map);
    //流向查询响应绘制面/点
    on(dom.byId("flowDirection"), "click", function (){
      DrawPolygonQ.activate(Draw.POLYGON);
      DrawPointQ2.deactivate();
    });
    on(DrawPolygonQ, "draw-complete", function (result)
    {
        //获得绘图得到的图形
        var geometry=result.geometry;
        //关闭绘图工具
        DrawPolygonQ.deactivate();
        //执行空间查询
        identifyFlowQuery(geometry);
    });      
    function identifyFlowQuery(geometry) {
      //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
      var identifyTask = new IdentifyTask(ps_lineUrl+serverType2);
      //定义空间查询参数对象
      var params = new IdentifyParameters();
      //容差
      params.tolerance = 3;
      //是否返回几何信息
      params.returnGeometry = true;
      //空间查询的图层，此时是两个图层
      var cLayers=mLayerList.layers;
      if(cLayers[0].visibility==false && cLayers[1].visibility==false){
        alert("请至少打开一个图层");
        return;
      }else if(cLayers[0].visibility==false && cLayers[1].visibility!=false){
        params.layerIds = [1];
      }else if(cLayers[0].visibility!=false && cLayers[1].visibility==false){
        params.layerIds = [0];
      }else{
        params.layerIds = [0,1];
      }      
      //空间查询的条件
      //params.layerOption = IdentifyParameters.LAYER_OPTION_ALL;//所有图层
      params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;//可见图层
      params.width = map.width;
      params.height = map.height;
      //空间查询的几何对象
      params.geometry = geometry;
      params.mapExtent = map.extent;
      //执行空间查询
      identifyTask.execute(params,showFlowIdentifyResult);
    }
    //属性查询完成之后，用showFlowIdentifyResult来处理返回的结果
    function showFlowIdentifyResult(idResults){
        //创建线符号
        var lineSymbol=new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 3);
        var arrowSymbol=new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2);
        // var lineSymbol = new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID, new Color([255,0,0]), 10, CartographicLineSymbol.CAP_ROUND, CartographicLineSymbol.JOIN_MITER, 3);        
        //var mPolylines = new Polyline;
        if(idResults.length == 0){
          alert("未选中，请重新绘制");
        }
        var resultsName=[];
        var resultsSlope=[];
        if (idResults.length > 0) {
           for (var i = 0; i < idResults.length; i++) {
                        var result = idResults[i];
                        //获得图形graphic
                        var graphic = result.feature;
                        //设置图形的符号
                        graphic.setSymbol(lineSymbol);
                        ResultLayer.add(graphic);
                        var mPolyline = new Polyline();
                        mPolyline = graphic.geometry;
                        //addArrow(mPolyline); 
                        //mPolylines.addPath(mPolyline.paths);
                        a = addArrow(mPolyline,0.00004,Math.PI/15);
                        var mGraphics = new Graphic(a,arrowSymbol);
                        ResultLayer.add(mGraphics);
                    }
                    // var a =addArrow(mPolylines,30,Math.PI/7);
                    // var mGraphics = new Graphic(a,lineSymbol);
                    // map.graphics.add(mGraphics);
        }
        //图表显示
        // dom.byId("slopeChartsD").style.visibility="visible";
        // chartsMaker();
    }
    //添加箭头
    function addArrow(mPolyline,length,angleValue) {
        var linePoints=mPolyline.paths;//线的坐标串
        var arrowCount=linePoints.length;
        for(var i =0;i<arrowCount;i++){ 
            var pixelStart = new Point(linePoints[i][0],mSpatialReference); 
            //var pixelEnd = new Point(linePoints[i][1],mSpatialReference);
            // x = (pixelStart.x+pixelEnd.x)/2;
            // y = (pixelStart.y+pixelEnd.y)/2;
            // var centerPoint = new Point([x,y]);
            // centerPoint.spatialReference = mSpatialReference;
            //pixelEnd = centerPoint;
           var pixelEnd = mPolyline.getExtent().getCenter();
            var angle=angleValue;//箭头和主线的夹角
            var r=length; // r/Math.sin(angle)代表箭头长度
            var delta=0; //主线斜率，垂直时无斜率
            var param=0; //代码简洁考虑
            var pixelTemX,pixelTemY;//临时点坐标
            var pixelX,pixelY,pixelX1,pixelY1;//箭头两个点
            if(pixelEnd.x-pixelStart.x==0){ //斜率不存在是时
                pixelTemX=pixelEnd.x;
                if(pixelEnd.y>pixelStart.y)
                {
                pixelTemY=pixelEnd.y-r;
                }
                else
                {
                pixelTemY=pixelEnd.y+r;
                }    
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX=pixelTemX-r*Math.tan(angle); 
                pixelX1=pixelTemX+r*Math.tan(angle);
                pixelY=pixelY1=pixelTemY;
            }
            else  //斜率存在时
            {
                delta=(pixelEnd.y-pixelStart.y)/(pixelEnd.x-pixelStart.x);
                param=Math.sqrt(delta*delta+1);
                if((pixelEnd.x-pixelStart.x)<0) //第二、三象限
                {
                pixelTemX=pixelEnd.x+ r/param;
                pixelTemY=pixelEnd.y+delta*r/param;
                }
                else//第一、四象限
                {
                pixelTemX=pixelEnd.x- r/param;
                pixelTemY=pixelEnd.y-delta*r/param;
                }
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX=pixelTemX+ Math.tan(angle)*r*delta/param;
                pixelY=pixelTemY-Math.tan(angle)*r/param;


                pixelX1=pixelTemX- Math.tan(angle)*r*delta/param;
                pixelY1=pixelTemY+Math.tan(angle)*r/param;
            }
            var pointArrow=[pixelX,pixelY];
            var pointArrow1=[pixelX1,pixelY1];
            var arrowTop = [pixelEnd.x,pixelEnd.y];
            // var ArrowJson = {
            //     "paths":[[pointArrow,linePoints[i][1],pointArrow1]],
            //     "spatialReference":{"wkid":4490}
            //   };
            var Arrow = new Polyline([[pointArrow,arrowTop,pointArrow1]]);
            Arrow.spatialReference = mSpatialReference;
            return Arrow;
        }  
    }
    function chartsMaker(){

    }
/**end流向查询**/ 
/**start连通管线统一展示**///（弃用）
/**end连通管线统一展示**/
/**start管线溯源**/
    //给绘图工具绑定绘图完成事件
    var DrawPointQ2 = new Draw(map);
    //连通展示查询响应绘制点
    on(dom.byId("lineSourceBtn"), "click", function (){
      DrawPointQ2.activate(Draw.POINT);
      DrawPolygonQ.deactivate();
    });
    on(DrawPointQ2, "draw-complete", function (result)
    {
        $("#loadgif").show();
        //获得绘图得到的点
        var geometry=result.geometry;
        //关闭绘图工具
        DrawPointQ2.deactivate();
        //执行空间查询
        identifyLineSourQuery(geometry);
    });      
    //
    function identifyLineSourQuery(geometry){
      //定义空间查询对象，注意他的参数是整个地图服务，而不是单个图层
      var identifyTask = new IdentifyTask(ps_lineUrl+serverType2);
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
      var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3);
      if (idResults.length==0){
         alert("请重新选择");
         $("#loadgif").hide();
      }else{
        var idResult=idResults[0];
        //var attributes=idResults[0].feature.attributes;
        //var id=idResults[0].feature.attributes.OBJECTID;
        //var PID=idResults[0].feature.attributes.PID;
        var SNODEID=idResults[0].feature.attributes.SNODEID;
        if(idResults[0].feature.geometry.type=="polyline"){
          lineSourceAjax(SNODEID);
          //获得图形graphic
          var graphic = idResult.feature;
          //设置图形的符号
          graphic.setSymbol(lineSymbol);
          ResultLayer.add(graphic);
        }
      }
    }  
/**end管线溯源**/
/**start分类查询**/
    //获取管点管线分类，用FilteringSelect展示,（addLayers:添加两个核心图层到地图map触发事件）
    function layerQuery(layerInfo){
      var layerArray = [];
      for (var i = 0; i < layerInfo.length; i++) {
        var alyr = layerInfo[i].layerInfos;
        //截取最后一个"/"前的所有字符（"MapServer"前的字符串）
        //根据登录用户类型确定,使用FeatureServer还是MapServer
        var aUrl = layerInfo[i].url.slice(0,-9)+serverType;
        var amType = layerInfo[i].mType;
        for (var j = 0; j < alyr.length; j++) {
          alyr[j].url = aUrl;
          alyr[j].mType = amType;
        }
        alyr.url = aUrl;
        alyr.mType = amType;
        layerArray.push(alyr);
      }
      //将layerArray数据存储在全局变量中
      layerSelectArr = layerArray;
      //排水管线总图层PS_PIPE
      var ps_pipeLayer = new ArcGISDynamicMapServiceLayer(ps_pipeUrl + serverType2, {
        id: "PS_PIPE"
      });
      //排水管线ps_pipeLayer图层"load"事件
      ps_pipeLayer.on('load', function() {
        var layerArray2 = ps_pipeLayer.layerInfos;
        layerArray2.mType = "all";
        //var aUrl2=ps_pipeLayer.url;
        var aUrl2=ps_pipeUrl+serverType;
        layerArray2.url = aUrl2;
        for(var i=0;i<layerArray2.length;i++){
          layerArray2[i].url=aUrl2;
          layerArray2[i].mType="all";
        }
        layerSelectArr.push(layerArray2);
        //默认0，1，2分别为雨水，污水，全部（由layerSelectArr决定）
        if ($('#iChooseYS').attr('checked')) {

          var layerStore = new Memory({
            data: layerSelectArr[0]
          });
          var mfilteringSelect = new FilteringSelect({
            id: "layerSelect",
            name: "layer",
            store: layerStore,
            searchAttr: "name",
            style: "width:150px"
          }, "pipeType").startup();
        } else if ($('#iChooseWS').attr('checked')) {
          var layerStore = new Memory({
            data: layerSelectArr[1]
          });
          var mfilteringSelect = new FilteringSelect({
            id: "layerSelect",
            name: "layer",
            store: layerStore,
            searchAttr: "name",
            style: "width:150px"
          }, "pipeType").startup();
        } else if($('#iChooseJS').attr('checked')){
          var layerStore = new Memory({
            data: layerSelectArr[2]
          });
          var mfilteringSelect = new FilteringSelect({
            id: "layerSelect",
            name: "layer",
            store: layerStore,
            searchAttr: "name",
            style: "width:150px"
          }, "pipeType").startup();
        }else if ($('#iChooseALL').attr('checked')) {
          var layerStore = new Memory({
            data: layerSelectArr[3]
          });
          var mfilteringSelect = new FilteringSelect({
            id: "layerSelect",
            name: "layer",
            store: layerStore,
            searchAttr: "name",
            style: "width:150px"
          }, "pipeType").startup();
        }
      });
    }
    //radio切换选中事件，雨水，污水，全部（默认全部）
    on(query('.typeChoose'),"change",function() {  
        if (dom.byId('iChooseYS').checked) {  
          dijit.byId("layerSelect").store=new Memory({data:layerSelectArr[0]});
        }else if(dom.byId('iChooseWS').checked){  
          dijit.byId("layerSelect").store=new Memory({data:layerSelectArr[1]});    
        }else if(dom.byId('iChooseJS').checked){  
          dijit.byId("layerSelect").store=new Memory({data:layerSelectArr[2]});
        }else if(dom.byId('iChooseALL').checked){
          dijit.byId("layerSelect").store=new Memory({data:layerSelectArr[3]});  
        }  
    });
    dom.byId("footer_splitter").style.display='none';
    on(dom.byId("QueryResetBtn"),"click",function(){
        dom.byId("roadText").value='';
        dom.byId("widthText").value='';
        dom.byId("materialText").value='';
    });
    //触发点击事件后是splitter和footer一起显示
    on(dom.byId("mFindBtn"), "click", function () {
        if(dijit.byId("layerSelect").valueNode.value==""){
          alert("请输入要查询的类型");
          return;
        }
        dom.byId("closeOpenTable").style.display="block";    
        var footer = dom.byId("footer");
        domStyle.set(footer, "display", "block");
        footer_splitter= dom.byId("footer_splitter");
        domStyle.set(footer_splitter, "display", "block");
        closeOpenSw();
        //父节点调整子节点尺寸
        dijit.byId(footer.parentNode.id).resize();
        if (registry.byId("divShowResultQ")) {
            registry.byId("divShowResultQ").destroy();
            $("#mTableContentPane").append("<div id='divShowResultQ' style='height:100%'></div>");
        }
        var outFilelds;
        var fieldInfos;
        var selectionSymbol;
        var selUrl;
        // set a selection symbol for the featurelayer(点)
        var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 1,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 197, 0.7])));
        //创建线符号
        var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3);
        var selLayerInfo=dijit.byId("layerSelect").item; 
        //按道路，材质，管径查询
        var roadTextValue = dom.byId("roadText").value.trim();
        var widthTextValue = dom.byId("widthText").value.trim();
        var materialTextValue = dom.byId("materialText").value.trim();
        exPROAD="PROAD Like '%"+roadTextValue+"%'";
        expMaterial="MATERIAL Like '%"+materialTextValue+"%'";
        expWidth="PWIDHT='"+widthTextValue+"'";
        if(roadTextValue=='')exPROAD="1=1";
        if(widthTextValue=='')expWidth="1=1";
        if(materialTextValue=='')expMaterial="1=1";
         //设置过滤图层文本
        var exp='';
        if(exPROAD==''&&expMaterial==''&&expWidth=='')exp='';
        //根据点、线划分
        if(selLayerInfo.name.indexOf("管段")!=-1){
            outFields=line_outFields;
            fieldInfos=lineFieldInfosT;
            selectionSymbol = lineSymbol;
            selUrl=selLayerInfo.url;
            //
            //dijit.byId("widthText").disabled=false;
            //dom.byId("widthText").disabled=false;
            //dijit.byId("widthText").reset();
            dom.byId("widthText").value="";
            exp=exPROAD+" and "+expMaterial+" and "+expWidth;
        }
        else{
            outFields=points_outFields;
            fieldInfos=pointsFieldInfosT;
            selectionSymbol = pointSymbol;
            selUrl=selLayerInfo.url;
            //
            //dijit.byId("materialText").reset();
            //dijit.byId("widthText").reset();
            //dom.byId("widthText").value="";
            //dom.byId("materialText").value="";
            dijit.byId("widthText").disabled=true;
            dom.byId("widthText").disabled=true;
            exp=exPROAD+" and "+expMaterial;
        }
        removeOtherGly();
        var selLayer=new FeatureLayer(selUrl+"/"+selLayerInfo.id,{
          id:"SelectLayer",
          outFields:["*"]
        });
        selLayer.setDefinitionExpression(exp);
        selLayer.setSelectionSymbol(selectionSymbol);
        map.addLayer(selLayer);
        var myFeatureTable = new FeatureTable({
            featureLayer: selLayer,
            map: map,
            batchCount:1000,
            showAttachments: true,
            showStatistics:true,
            // only allows selection from the table to the map 
            syncSelection: true,//表与地图交互Enables an interaction between the map and the feature table
            zoomToSelection: true,
            showRelatedRecords: true,
            gridMenu: true,
            gridOptions: {
                allowSelectAll: true,
                allowTextSelection: true,
                //pagination:true
            },
            editable: true,
            dateOptions: {
                // set date options at the feature table level 
                // all date fields will adhere this 
                datePattern: "MMMM d, y"
            },
            // define order of available fields. If the fields are not listed in 'outFields'
            // then they will not be available when the table starts. 
            outFields: outFields,
            // use fieldInfos property to change field's label (column header), 
            // the editability of the field, and to format how field values are displayed
            fieldInfos: fieldInfos
        }, 'divShowResultQ');
        myFeatureTable.startup();
        myFeatureTable.on("row-select", function(evt){
          //console.log("666", evt);
          //map.setScale(18);
         });
        myFeatureTable.on("load",function(evt){
          //console.log("666",evt);
          //console.dir(myFeatureTable);
        });
      });    
/**end分类查询**/
/**start排水户情况查询**/
  on(dom.byId("factoryQbtn"), "click", function() {
    // if(dom.byId("clearFeaturetable")==null){
    //   var a='<a id="clearFeaturetable" href="javascript:void(0);" onclick ="clearFeaturetable()">清除查询结果</a>';
    //   domConstruct.place(a,"clearFeaturetableDiv","first");
    // }
    //将footer和相关dom的display属性设为"block"
    dom.byId("closeOpenTable").style.display="block";
    var footer = dom.byId("footer");
    domStyle.set(footer, "display", "block");
    footer_splitter= dom.byId("footer_splitter");
    domStyle.set(footer_splitter, "display", "block");
    closeOpenSw();
    //父节点调整子节点尺寸
    dijit.byId(footer.parentNode.id).resize();
    if (registry.byId("divShowResultQ")) {
      registry.byId("divShowResultQ").destroy();
      $("#mTableContentPane").append("<div id='divShowResultQ' style='height:100%'></div>");
    }
    //企业（排水户）图层
    removeOtherGly();
    var selLayer_f = new FeatureLayer(factoryUrl+ serverType+ "/0",{id:"SelectLayer",outFields:["*"]});
    selLayer_f.on('load', function(){
    var relationships=selLayer_f.relationships;
    //根据名字
    for(var i=0;i<relationships.length;i++){
        if(relationships[i].name=="sde.DBO.PS_POINTS"){
          relationships[i].name="管点";
        }else if(relationships[i].name=="sde.DBO.PS_LINE"){
          relationships[i].name="管段";
        }else if(relationships[i].name=="sde.DBO.WaterCheck"){
          relationships[i].name="水质检测信息";
        }
      }
    });    
    //过滤参数
    var searchTextValue_f = dom.byId(factoryQ).value;
    var exp_f="TextString Like'"+"%"+searchTextValue_f+"%"+"'";
    selLayer_f.setDefinitionExpression(exp_f);
    //创建线符号
    var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0, 0.8]), 3);
    //创建面符号
    var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new dojo.Color([0, 255, 0, 0.1]), 3);
    //设定面符号
    selLayer_f.setSelectionSymbol(fill);
    selLayer_f.infoTemplate=new PopupTemplate({
          "title":"排水户信息",
          "description":factories_description,
          "fieldInfos":factories_fieldInfos,
          "showAttachments":true
        });
    map.addLayer(selLayer_f);
    //设置factories表中条目，和relateTo相关信息
    //outFields_f=["OBJECTID","TextString"];
    outFields_f=factories_outFields;
    var myFeatureTable_f = new FeatureTable({
      featureLayer: selLayer_f,
      map: map,
      batchCount:1000,
      showAttachments: true,
      showStatistics: true,
      // only allows selection from the table to the map 
      syncSelection: true,
      zoomToSelection: true,
      //
      showRelatedRecords: true,
      //showCyclicalRelationships:true,
      gridOptions: {
        allowSelectAll: true,
        allowTextSelection: true,
        //pagination:true
      },
      editable: true,
      dateOptions: {
        // set date options at the feature table level 
        // all date fields will adhere this 
        //datePattern: "MMMM d, y",
        timeEnabled: false,
        datePattern: "y/M/d",
        
      },
      outFields: outFields_f,
      // use fieldInfos property to change field's label (column header), 
      // the editability of the field, and to format how field values are displayed
      fieldInfos: factoryFieldInfosT
    }, 'divShowResultQ');
    myFeatureTable_f.startup();
    myFeatureTable_f.on("load",function(evt){
        //console.log("666",evt);

        //console.dir(myFeatureTable);
    });
    myFeatureTable_f.on("row-select", function(evt){
        //console.log("666");
    });
  });
/**end排水户情况查询（queryTask空间查询）**/
/**start部分ajax调用**/
    //lineConnection相连管线集体显示
    function lineConnAjax(id){
       var urlStr = encodeURI("Handler.ashx?method=lineConn&oper=line&id=" + id + "&" + Math.random());
        // Using xhr.get, as very little information is being sent
        xhr.get({
            // The URL of the request
            url: urlStr,
            // The success callback with result from server
            load: function(result) {
            alert("The message is: " + result);
            },
            // The error handler
            error: function() {
                // Do nothing -- keep old content there
            }
        });
    }
    //管线溯源
    function lineSourceAjax(id) {
      var urlStr = encodeURI("Handler.ashx?method=getSourceT&oper=line&id=" + id + "&" + Math.random());
      // Using xhr.get, as very little information is being sent
      xhr.get({
        // The URL of the request
        url: urlStr,
        handleAs: "json",
        // The success callback with result from server
        load: function(result) {
          $("#loadgif").hide();
          //console.dir("The message is: " + result);
          for(var i=0;i<result.length;i++){
            var pl=new Polyline(result[i]);
            var sls=new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 3);
            //var attr ={};
            //var infoTemplate = new InfoTemplate();
            var gra = new Graphic(pl,sls);
            ResultLayer.add(gra);
          }
        },
        // The error handler
        error: function() {
          // Do nothing -- keep old content there
        }
      });
    }
/**end部分ajax调用**/
//清除功能相关按钮
  on(dom.byId("clearResults"), "click", function() {
    map.graphics.clear();
    map.infoWindow.hide();
    //facResultList已舍弃，暂时保留
    facRl = dom.byId("facResultList");
    if(facRl!=null){
      domConstruct.empty(facRl);
    }
    ResultLayer.clear();
    if(map.getLayer("SelectLayer")){
           map.removeLayer(map.getLayer("SelectLayer"));
        }
  });
 /* //清除查询结果：包括去掉footer和打开和关闭切换按钮
  function clearFeaturetable(){
    dom.byId("footer").style.display=="none";
    dom.byId("closeOpenTable").src="/images/open.png";
    dom.byId("closeOpenTable").style.display="none";
    dom.byId("clearFeaturetable").destroy();
    map.graphics.clear();
     for(i=0;i<map.graphicsLayerIds.length;i++){
      lyr= map.getLayer(map.graphicsLayerIds[0]);
      map.removeLayer(lyr); 
      i=0;  
    }
  }*/
  //清除图形和
  function removeOtherGly(){
     map.graphics.clear();
     ResultLayer.clear();
     if(map.getLayer("SelectLayer")){
           map.removeLayer(map.getLayer("SelectLayer"));
        }
  }
  //footer打开和关闭切换按钮
  function closeOpenSw(){
     dom.byId("closeOpenTable").src="/images/close.png";
  }    
  on(dom.byId("closeOpenTable"),"click",function(){
    if(dom.byId("footer").style.display=="block"){
      dom.byId("footer").style.display="none";
      dom.byId("footer_splitter").style.display='none';
      dijit.byId( dom.byId("footer").parentNode.id).resize();
      dom.byId("closeOpenTable").src="/images/open.png";
    }
    else if(dom.byId("footer").style.display=="none"){
      dom.byId("footer").style.display="block";
      dom.byId("footer_splitter").style.display='block';
      dijit.byId( dom.byId("footer").parentNode.id).resize();
      dom.byId("closeOpenTable").src="/images/close.png";
    } 
  });
//按钮间干扰逻辑

//监听点击地图图层事件

//取消画图（点线面）
function cancelDraw(){
  DrawPolygonQ.deactivate();//管线流向画面取消
  DrawPointQ2.deactivate();//管线溯源画点取消  
}
//编号转名字    
    function TypeChangeWords(type)
    {
        switch (type)
        {
            case "5202201":
                type = "污水管段";
                break;
            case "5201201":
                type = "雨水管段";
                break;
            case "5299101":
                type = "非普";
                break;
            case "5299102":
                type = "弯头";
                break;
            case "5299103":
                type = "直通";
                break;
            case "5299104":
                type = "三通";
                break;
            case "5299105":
                type = "四通";
                break;
            case "5299106":
                type = "多通";
                break;
            case "5299107":
                type = "变径";
                break;
            case "5299108":
                type = "进水口";
                break;
            case "5299109":
                type = "出水口";
                break;
            case "5299110":
                type = "预留口";
                break;
            case "5299111":
                type = "出地";
                break;
            case "5299112":
                type = "拐点";
                break;
            case "5299113":
                type = "特征点";
                break;
            case "5299114":
                type = "井边点";
                break;
            case "5299115":
                type = "井内点";
                break;
            case "5299116":
                type = "污水检修井";
                break;
            case "5299117":
                type = "雨水检修井";
                break;
            case "5299118":
                type = "雨篦";
                break;
            case "5299119":
                type = "污篦";
                break;
            case "5299120":
                type = "阀门";
                break;
            case "5299121":
                type = "阀门井";
                break;
            case "5299122":
                type = "溢流井";
                break;
            case "5299123":
                type = "跌水井";
                break;
            case "5299124":
                type = "通风井";
                break;
            case "5299125":
                type = "冲洗井";
                break;
            case "5299126":
                type = "沉泥井";
                break;
            case "5299127":
                type = "渗水井";
                break;
            case "5299128":
                type = "水封井";
                break;
            case "5299129":
                type = "出气井";
                break;
            case "5299130":
                type = "闸门井";
                break;
            case "5299131":
                type = "倒虹井";
                break;
            case "5299132":
                type = "泵站";
                break;
            case "5299133":
                type = "化粪池";
                break;
            case "5299134":
                type = "净化池";
                break;
            case "5299135":
                type = "暗沟地面出口";
                break;
            case "5299136":
                type = "沉淀池";
                break;
            case "5299137":
                type = "排气阀";
                break;
            case "5299138":
                type = "隔油池";
                break;
            case "5299139":
                type = "酸碱中和池";
                break;
            default: break;
        }
        return type;
    }
    //工具条搜索按钮（暂时废弃）
   /*on(dom.byId("searchBtn"),"click",function(){
      var searchBtn=dom.byId("searchBtn");
      //var color = searchBtn.style["backgroundColor"];
      document.getElementById('searchDiv').style.display = document.getElementById('searchDiv').style.display == 'block' ? 'none' : 'block';
      document.getElementById('searchBtn').style.backgroundColor = document.getElementById('searchBtn').style.backgroundColor == downColor ? '' : downColor;
    });*/
});