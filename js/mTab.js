require(["dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/domReady!"], function(TabContainer, ContentPane) {
    var tc = new TabContainer({
        style: "height: 100%; width: 100%;"
    }, "tc1-prog");
    var cp1 = new ContentPane({
        title: "First Tab",
        content: "We offer amazing food"
    });
    tc.addChild(cp1);
    var cp2 = new ContentPane({
        title: "Second Tab",
        content: "We are known for our drinks."
    });
    tc.addChild(cp2);
    var cp3 = new ContentPane({
        title: "Third Tab",
        content: "This Tab has the attribute 'selected: true' set.",
        selected: true
    });
    tc.addChild(cp3);
    tc.startup();
});
['八塘路', '北汽路', '北湾路', '滨海八路', '滨海大道', '滨海二路', '滨海九路', '滨海六路', '滨海七路', '滨海三路', '滨海四路', '滨海五路', '滨海一路', '滨江大道', '博华路', '博智路', '辰山路', '瓷洲路', '电镀中新支路', '纺织路', '福轩路', '福州路', '广场二路', '广场路', '广场支路', '规划二路', '规划支二路', '规划支路', '贵安路', '海川大道', '海达路', '海富路', '海兴路', '海洋二路', '海洋一路', '杭州湾大道', '合金路', '合轸路', '华轩路', '汇轸路', '机电路', '金慈路', '金合路', '金溪东路', '金溪路', '金溪西路', '金溪支路', '金源大道', '经三路', '九塘路', '连江路', '芦汀路', '芦苇路', '芦扬路', '罗源路', '名仕路', '南慈路', '南吉路', '南祥路', '漂印北路', '漂印染支路', '漂印支路', '浦东路', '热电路', '仁祥路', '实验路', '水厂路', '天宝路', '拓湾路', '香樟路', '晓塘路', '兴慈八路', '兴慈大道', '兴慈二路', '兴慈六路', '兴慈七路', '兴慈七路西边路', '兴慈三路', '兴慈四路', '兴慈五路', '兴慈一路', '玉海东路', '元兴路', '越合路', '职教西支路', '中心一路', '中兴一路', '众汽路']