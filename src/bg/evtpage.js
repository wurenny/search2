var EVPG ={};
var favlist;
var cmstate;

EVPG.msgLsnr =function(){
	chrome.extension.onMessage.addListener(
	  function(request, sender, sendResponse) {
	  	if (request.action =="search2createcm") {
	  		EVPG.createCM();
	  		return true;
	  	}
	  	if (request.action =="search2initcm") {
	  		EVPG.initCM();
	  		return true;
	  	}
	    if (request.action == "search2encodekw") {
			UTIL.encodeURL(sendResponse,request.enc, request.kw).submit();
			return true;
	    }
	    else{
	      sendResponse({});
	    }
	    
	});
		
};

EVPG.createCM =function() {
	chrome.storage.local.get(
		function(storages){
			var config =storages.search2_config;
			if(!config) config =IDATA.search2_config;
			if(!config.cmenu) {
				chrome.contextMenus.removeAll();
				return;
			}
			favlist =storages.search2_favlist;
			if(!favlist) favlist =IDATA.search2_favlist;
			
			chrome.contextMenus.removeAll();
			chrome.contextMenus.create({
			    "title" : "Search2"
			    ,"id" : "search2cmenu"
			    ,"contexts" :["all"]
			});
	
			for(var i=0; i<favlist.length; i++) {
				if(favlist[i].on!=1 || !favlist[i].cm || favlist[i].cm!=1) continue;
				var ctxtype;
				if (favlist[i].url.indexOf("%p")!=-1) ctxtype ="image";
				else ctxtype ="selection";
				chrome.contextMenus.create(
					{
						"title": favlist[i].name
						,"id": "search2cmenu_" + ctxtype + "_" + favlist[i].type +"_" + favlist[i].sno
						,"parentId": "search2cmenu"
						,"contexts": [ctxtype]
					}
				);
			}
		}
	);
	
};

EVPG.initCM =function() {
	if (cmstate) return;
	chrome.contextMenus.onClicked.addListener(
		function(info, tab){
			var url, params =info.menuItemId.split("_");
			var esckw, kw;
			if (info.menuItemId =="search2cmenu") chrome.tabs.sendMessage(tab.id, {action : "search2popmore"});
			else {
				if (params[0] =="search2cmenu" && params[1]=="image") {
					esckw ="%p";
					if(info.srcUrl.substr(0,4)=="http") kw =info.srcUrl;
				}
				else if(params[0] =="search2cmenu" && params[1]=="selection") {
					esckw ="%s";
					kw=info.selectionText.replace(/\n/g, " ").trim().substr(0, 64);
				}
				if (!kw || kw=="") return;
				for(var i =0; i<favlist.length; i++) {
					if (favlist[i].cm==1 && favlist[i].type==parseInt(params[2]) && favlist[i].sno==parseInt(params[3]) && favlist[i].on==1) {
						if (!favlist[i].enc) {
							url =favlist[i].url.replace(esckw, kw);
							if (url) window.open(url, "_blank");
						}
						else {
							UTIL.encodeURL(
								function(response){
									url =favlist[i].url.replace(esckw, response.enckw);
									if (url) window.open(url, "_blank");
								},
								favlist[i].enc,
								kw
							).submit();
						}
						break;
					}
				}
				
			}
			
		}
	);
	cmstate =1;
};

EVPG.main =function() {
	EVPG.msgLsnr();
	EVPG.createCM();

};

EVPG.main();
