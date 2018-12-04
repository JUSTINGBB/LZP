require(["dojo/request/xhr", "dojo/dom", "dojo/on", "dojo/domReady!"],
	function(xhr2, dom, on) {
		on(dom.byId("pipeFix"),"click",function(){
			var fixContentP = dom.byId("fixContentP");
			dom.byId("fixContentP").style.display=dom.byId("fixContentP").style.display=="block"?"none":"block";
			dijit.byId(fixContentP.parentNode.id).resize();
		});
		esri.config.defaults.io.proxyUrl="http://localhost/DotNet/proxy.ashx ";
		esri.config.defaults.io.alwaysUseProxy=false;
		on(dom.byId("fixPipeAdd"),"click",function(){

		});

		//var html='<span class="tag">'+pipeID+'&nbsp;&nbsp;<a href="#" title="Removing tag">x</a></span>';

	});