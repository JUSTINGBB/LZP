require(["dojo/request/xhr", "dojo/dom", "dojo/on", "dojo/domReady!"],
	function(xhr2, dom, on) {
		//排水户详细信息弹窗
		window.editFacInfos=function() {
		var facDialog = dijit.byId("FactoriesDialog")
		facDialog.show();
		};
	});