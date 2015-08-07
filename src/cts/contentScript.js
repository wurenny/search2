/*-------------------------------------------------------------------------
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2015, wurenny@gmail.com, All rights reserved
 *
 * IDENTIFICATION
 *     cts/contentScript.js
 *
 * This file is part of search2 project
 * contentScript is the core runtime content script of search2
 *
 *-------------------------------------------------------------------------
 */

var CTS ={}, i18n ={}, favrect ={};
var hashSearch, septr;
var keywords, enc, enckeywords;
var favindex, pos, stype, prkw;
var itv;

CTS.initI18n =function(){
	i18n.chrome_nls =chrome.i18n.getMessage("@@ui_locale");
	
	i18n.__com_close =chrome.i18n.getMessage("com_close");
	i18n.__com_moresearch =chrome.i18n.getMessage("com_moresearch");
	i18n.__cts_more_tip =chrome.i18n.getMessage("cts_more_tip");
	i18n.__cts_config_tip =chrome.i18n.getMessage("cts_config_tip");
	i18n.__more_title =chrome.i18n.getMessage("more_title");
	
	i18n.__com_typename_news =chrome.i18n.getMessage("com_typename_news");
	i18n.__com_typename_web =chrome.i18n.getMessage("com_typename_web");
	i18n.__com_typename_picture =chrome.i18n.getMessage("com_typename_picture");
	i18n.__com_typename_video =chrome.i18n.getMessage("com_typename_video");
	i18n.__com_typename_music =chrome.i18n.getMessage("com_typename_music");
	i18n.__com_typename_shopping =chrome.i18n.getMessage("com_typename_shopping");
	
	i18n.__more_autoclose =chrome.i18n.getMessage("more_autoclose");
	i18n.__more_newwindow =chrome.i18n.getMessage("more_newwindow");
	i18n.__more_remember =chrome.i18n.getMessage("more_remember");
	i18n.__more_savesuccess =chrome.i18n.getMessage("more_savesuccess");
	
};

CTS.init =function(){
	var thisurl = document.location.href;
	var hostname = document.location.host;
	for (i = 0; i < favlist.length; i++) {
		if (favlist[i].on != 1 || favlist[i].url.indexOf("%s")==-1) continue;
		if( (hostname.indexOf(favlist[i].host) != -1) && 
			(
				(!favlist[i].urltf) || 
				(favlist[i].urltf && (thisurl.indexOf(favlist[i].urltf) !=-1)) ||
				(favlist[i].urltf=='&tbm=web' && (thisurl.indexOf('&tbm=') ==-1))
			)
		) {
			favindex = i;
			prkw =favlist[i].prkw;
			stype =favlist[i].type;
			
			/*hash change listener ,but while history.pushState invoked for ajax in HTML5, it will donot work*/
			/*
			window.addEventListener('hashchange', function () {
				console.log("hash change.");
				CTS.runUrlChange();
			}, false);
			*/
			if (!itv) {
				var url1 =thisurl, url2;
				itv =setInterval(function(){
					url2 =document.location.href;
					if (url1!=url2) {
						//console.log(">>>location.href change, " +location.href);
						url1 =url2;
						CTS.runUrlChange();
					}
				}, 100);
			}
			break;
		}
	}
		
	/*transfer link?*/
	if (thisurl.indexOf("/link?")!=-1) return;
	
	if(!prkw) return;
	
	//action for keywords
	if (nohslist.containOf(hostname)) {
		septr ="/";
		var href =thisurl;
		hashSearch =href.substr(href.indexOf("://")+3).replace(/\%25(26|2B|2d|2E)/g, "%$1");
		hashSearch =hashSearch.replace(/\+/g, " ");
		CTS.getKeywords(hashSearch, septr);
	}
	else septr ="&";
	//location hash | search
	if (!keywords) {
		hashSearch =document.location.search.slice(1);
		hashSearch =hashSearch.replace(/\+/g, " ");
		CTS.getKeywords(hashSearch, septr);
	}
	if (!keywords) {
		hashSearch =document.location.hash.slice(1);
		hashSearch =hashSearch.replace(/\+/g, " ");
		CTS.getKeywords(hashSearch, septr);
	}
	
};

CTS.ready =function(start){	
	//topdiv
	var topdiv =document.documentElement.insertBefore(document.createElement("div"), document.documentElement.firstChild);
	topdiv.id ='search2Head';
	//style
	var margin =18;
	if (i18n.chrome_nls!="zh_CN" && pos=="left") margin =32;
	var css = document.createElement("link");
	css.id='search2CSS';
	css.type ='text/css';
	css.rel ='stylesheet';
	css.charset ='utf8';
	css.href = chrome.extension.getURL("css/css.css");
	topdiv.appendChild(css);
	//css frame
	if (config.autohide) return;
	document.documentElement.style.position='absolute';
	if (pos=="left") {
		document.documentElement.style.marginLeft=margin +'px';
		document.documentElement.style.width=(document.documentElement.clientWidth-margin-margin) +'px';
		//resize listener
		window.onresize =function(event) {
			document.documentElement.style.width=(document.documentElement.clientWidth-margin) +'px';
		};
	}
	else {
		if (pos=="top") document.documentElement.style.marginTop=margin +'px';
		if (pos=="bottom") document.documentElement.style.paddingBottom=margin +'px';
		document.documentElement.style.width='100%';
	}
	css.onload =start;
	
};

CTS.run =function(){
	var nw =config.newwindow;
	var ss =config.searchselected;
	var fn=config.searchnamedisplay;
	var tld =config.searchlisttiled;
	var ret =config.indentdistance;
	var rret =config.rightindentdistance;
	var sp =(tld && pos!="right")?0:config.intervaldistance;
	var ah =config.autohide;
	var bl =config.borderline;
	var bgc =config.bgcolor;
	var fgc =config.fgcolor;
	var bdc =config.bdcolor;
	

	/*create bar*/
	var bar =document.getElementById("search2");
	if (bar) return;
	bar =document.createElement("div");
	document.documentElement.insertBefore(bar,document.head);
	bar.id ="search2";
	bar.className ="search2Skin search2_At" +pos.toUpperCase() 
							+((config.autohide && pos!="right")?(" search2AutoHide_At" +pos.toUpperCase()):"")
	var barstyle ="background:" +bgc +" !important;";
	if(bl){
		pos =pos.toLowerCase();
		if(pos=="left") barstyle +="border-right:1px solid " +bdc +" !important";
		if(pos=="top") barstyle +="border-bottom:1px solid " +bdc +" !important";
		if(pos=="bottom") barstyle +="border-top:1px solid " +bdc +" !important";
		if(pos=="right") barstyle +="border:1px solid " +bdc +" !important";
	}
	bar.setAttribute("style",barstyle);
	bar.style.display ="none";
	if (pos=="right") bar.style.right=rret + "%";
	if (pos=="left") {
		if (i18n.chrome_nls=="zh_CN") bar.style.width ="18px";
		else bar.style.width ="32px";
	}else if (pos=="right") bar.style.width ="";
	
	/*table layout*/
	var tb =bar.appendChild(document.createElement("table"));
	if (tld) {
		if (pos=="left") tb.style.height ="100%";
		if (pos=="top" || pos=="bottom") tb.style.width ="100%";
	}
	var tr =tb.appendChild(document.createElement("tr"));
	var td =tr.appendChild(document.createElement("td"));;
	
	/*config box*/
	var configBtn = td.appendChild(document.createElement("a"));
	configBtn.id ="configbtn";
	if (pos=="top" || pos=="bottom") {
		td.style.paddingLeft ="4px";
		td.style.paddingRight =ret +"px";
	}
	if (pos=="left" || pos=="right") {
		td.style.paddingTop ="4px";
		if (pos=="left") td.style.paddingBottom =ret +"px";
	}
	var configBtnImg = configBtn.appendChild(document.createElement("img"));
	configBtnImg.src =icondatas.config_icon;
	configBtn.title =i18n.__cts_config_tip;
	configBtn.target ="_blank";
	
	configBtn.addEventListener("click", 
		function() {
			var url =chrome.extension.getURL("opt/options.html") +"?s=cts";
			window.open(url, "_blank");
		},
	false);
	
	/*search engine*/
	var currTypeName =favtypes[favlist[favindex].type]; /*COM.getTypeName(favlist[favindex].type);*/
	var stb =tb;
	if (pos=="right" && config.autohide) {
		stb =tb.appendChild(document.createElement("tbody"));
		stb.id ="search2Body";
		stb.style.display ="none";
		bar.onmouseover =function(){stb.style.display ="block"};
		bar.onmouseout =function(){stb.style.display ="none"};
	}
	
	for (var i = 0; i < favlist.length; i++) {
		if (favlist[i].on != 1 || favlist[i].type != stype || favlist[i].url.indexOf("%s")==-1) continue;
		
		if (pos =="left" || pos =="right") tr =stb.appendChild(document.createElement("tr"));
		td =tr.appendChild(document.createElement("td"));
		if (pos =="top" || pos =="bottom") td.style.paddingLeft =td.style.paddingRight =sp +"px";
		else td.style.paddingTop =td.style.paddingBottom =sp +"px";
		/*links*/
		var searchItem = td.appendChild(document.createElement("a"));
		searchItem.charset ="UTF-8";
		searchItem.className =(i==favindex) ? "search2HrefSkin search2HrefSkin2" : "search2HrefSkin";
		searchItem.setAttribute("style","color:" +fgc +" !important");
		searchItem.setAttribute("host",favlist[i].host);
		searchItem.setAttribute("url",favlist[i].url);
		searchItem.setAttribute("enc", (favlist[i].enc?favlist[i].enc:""));
		searchItem.title = favlist[i].name;
		searchItemImg = searchItem.appendChild(document.createElement("img"));
		searchItemImg.src =icondatas[favlist[i].icon];
		searchItemText =searchItem.appendChild(document.createElement("span"));
		searchItemText.innerText =(fn!="onlyicon")?(((fn=="auto" && pos!="left") || fn=="fullname") ? favlist[i].name : currTypeName):"";
		searchItemText.className="search2Text_At" +pos.toUpperCase();
		
		searchItem.onmousedown =function(){
			var selectedtext =window.getSelection().toString().replace(/\n/g," ").trim().substr(0, 64);
			var host =this.getAttribute("host");
			var url =this.getAttribute("url");
			var enc =this.getAttribute("enc");
			var kw =(!ss || selectedtext=="")?keywords : selectedtext;
			
			if(!enc) {
				enckeywords =encodeURIComponent(kw);
				enckeywords_nhs =enckeywords.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
				url =url.replace("%s", nohslist.containOf(host) ? enckeywords_nhs : enckeywords);
				window.open(url, (nw)?"_blank":"_top");
			}
			else {
				chrome.extension.sendMessage(
					{action:"search2encodekw", enc:enc, kw:kw},
					function(response) {
						enckeywords =response.enckw;
						//console.log(enc +": " +enckeywords);
						enckeywords_nhs =enckeywords.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
						url =url.replace("%s", nohslist.containOf(host) ? enckeywords_nhs : enckeywords);
						window.open(url, (nw)?"_blank":"_top");
					}
				);
			}
		};
	}
	
	/*more*/
	if (pos =="left" || pos =="right") tr =stb.appendChild(document.createElement("tr"));
	td =tr.appendChild(document.createElement("td"));
	if (pos =="top" || pos =="bottom") td.style.paddingLeft =sp +"px";
	else td.style.paddingTop =sp +"px";
	var more =td.appendChild(document.createElement("a"));
	more.id ="moresearch";
	more.title =i18n.__cts_more_tip;
	more.setAttribute("style","color:" +fgc +" !important");
	var moreImg = more.appendChild(document.createElement("img"));
	moreImg.src =icondatas.more_icon;
	var moreText =more.appendChild(document.createElement("span"));
	moreText.innerText =(fn!="onlyicon")?i18n.__com_moresearch:"";

	more.onmousedown =CTS.popMore;
	
};

CTS.popMore =function() {
	var ss =config.searchselected;
	var selectedtext =window.getSelection().toString().replace(/\n/g," ").trim().substr(0, 64);
	var kw =(ss && selectedtext!="")?selectedtext:(keywords?keywords:"");
	
	var morediv =document.getElementById("search2more");
	if(!morediv) {
		morediv =document.documentElement.insertBefore(document.createElement("div"), document.documentElement.firstChild);
		morediv.id ="search2more";
	}
	var css =document.getElementById("search2MoreCSS");
	if(!css) {
		css =document.createElement("link");
		css.id='search2MoreCSS';
		css.type ='text/css';
		css.rel ='stylesheet';
		css.charset ='utf8';
		css.href = chrome.extension.getURL("more/more.css");
		morediv.appendChild(css);
	}
	/*
	if (!ss || selectedtext=="") enckeywords =encodeURIComponent(keywords);
	else enckeywords =encodeURIComponent(selectedtext);
	var url =chrome.extension.getURL("more/more.html?kw=" +enckeywords);
	*/
	var width =favrect.rectw * 85, height =favrect.recth * 50 +65;
	var pbl =config.morecartoon;
	var ctrd =config.morecartoonrandom;
	COM.alterObj();
	CTS.colorBox(i18n.__more_title, null, kw, width, height, true, pbl, ctrd);
	
};

CTS.colorBox =function(title, url, kw, width, height, cartoon, parabola, cartoonrandom) {
	var box =document.getElementById("search2colorbox");
	if(box) return;
	
	//cover layer
	document.documentElement.style.overflow ="hidden";
	var overlay =document.getElementById("search2more").appendChild(document.createElement("div"));
	overlay.id ="search2overlay";
	overlay.onmousedown =function(){return false};
	overlay.style.cssText="top:0;left:0;position:fixed;z-index:999999998;width:100%;height:100%;background:rgba(0,0,0,0.9);";
	
	//popup layer
	box =document.getElementById("search2more").appendChild(document.createElement("div"));
	box.id ="search2colorbox";
	box.style.display =cartoon ? "none" : "block";
	var left =(document.documentElement.clientWidth-width)/3;
	var top =(document.documentElement.clientHeight-height)/2;
	box.style.width =(cartoon ? 0 : width) +"px";
	box.style.height =(cartoon ? 0 : height+24) +"px";
	box.style.left =(left>0 ? left : 0) +"px";
	box.style.top =(top>0 ? top : 0) +"px";
	var tb =box.appendChild(document.createElement("table"));
	tb.id ="search2boxbody";
	var boxhead =tb.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
	boxhead.id ="search2boxhead";
	boxhead.style.height ="24px";
	var boxtitle =boxhead.appendChild(document.createElement("label"));
	boxtitle.innerText =title
	var boxclose =boxhead.appendChild(document.createElement("label"));
	boxclose.id ="search2boxclose";
	boxclose.innerText =i18n.__com_close;
	boxcontent =tb.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
	boxcontent.id ="search2boxcontent";
	
	if(!url) boxcontent.appendChild(CTS.makeMore(kw));
	else{
		var iframe =boxcontent.appendChild(document.createElement("iframe"));
		iframe.id ="search2boxiframe";
		iframe.src =url;
	}
	
	boxhead.onmousedown =function(){box.domove()};
	
	var closeCB =function(){
		document.documentElement.style.overflow ="auto";
		var morediv =document.getElementById("search2more");
		morediv.removeChild(overlay);
		morediv.removeChild(box);
	};
	boxclose.onclick =closeCB;
	
	//box.style.width =width +"px";
	//box.style.height =height +"px";
	if (!cartoon) {
		iframe.style.width =width +"px";
		iframe.style.height =height +"px";
	}
	
	var vectors =["TB","BT","LR","RL","TR","BR","TL","BL","CE"];
	var vt;
	if (!parabola && !cartoonrandom)  vt ="CE";
	else if (parabola && !cartoonrandom) vt ="BL";
	else vt =vectors[parseInt(Math.random()*9)];
	if(cartoon) box.dopopup(width, height+24, vt, cartoonrandom, parabola);
		
};

CTS.makeMore =function(kw) {
	var t =document.createElement("table");
	t.id ="search2_more";
	var tbd =t.appendChild(document.createElement("tbody"));
	tbd.id ="search2_more_moreinput";
	var tr =tbd.appendChild(document.createElement("tr"));
	var td =tr.appendChild(document.createElement("td"));
	td.setAttribute("colspan", favrect.rectw);
	/*search input*/
	var input =td.appendChild(document.createElement("input"));
	input.type ="text";
	input.id ="search2_more_searchInput";
	input.value =kw;
	
	/*checkbox config*/
	/*new window*/
	tr =tbd.appendChild(document.createElement("tr"));
	td =tr.appendChild(document.createElement("td"));
	td.setAttribute("colspan", favrect.checkboxspan);
	var div =td.appendChild(document.createElement("div"));
	input =div.appendChild(document.createElement("input"));
	input.type ="checkbox";
	input.id ="search2_more_newwindow";
	input.className ="search2morecheckbox";
	input.checked =config.morenewwindow;
	var label =div.appendChild(document.createElement("label"));
	label.setAttribute("for", "search2_more_newwindow");
	label.innerText =i18n.__more_newwindow;
	/*auto close*/
	td =tr.appendChild(document.createElement("td"));
	td.setAttribute("colspan", favrect.checkboxspan);
	var div =td.appendChild(document.createElement("div"));
	input =div.appendChild(document.createElement("input"));
	input.type ="checkbox";
	input.id ="search2_more_autoclose";
	input.className ="search2morecheckbox";
	input.checked =config.moreautoclose;
	var label =div.appendChild(document.createElement("label"));
	label.setAttribute("for", "search2_more_autoclose");
	label.innerText =i18n.__more_autoclose;
	/*remember*/
	td =tr.appendChild(document.createElement("td"));
	td.setAttribute("colspan", favrect.rememberspan);
	var div =td.appendChild(document.createElement("div"));
	div.id ="search2_more_remember";
	div.innerText =i18n.__more_remember;
	
	div.onclick =function() {
		config.morenewwindow =document.getElementById("search2_more_newwindow").checked ? 1 : 0;
		config.moreautoclose =document.getElementById("search2_more_autoclose").checked ? 1 : 0;
		chrome.storage.local.set({search2_config : config});
		alert(i18n.__more_savesuccess);
	};
	
	/*full favorate search list*/
	tbd =t.appendChild(document.createElement("tbody"));
	tbd.id ="search2_more_morelist";
	var trs =[];
	//tr
	for(tp in favtypes) trs[tp] =tbd.appendChild(document.createElement("tr"));
	var searchItem;
	for(var i =0; i<favlist.length; i++){
		if(!favlist[i].on || favlist[i].url.indexOf("%s")==-1) continue;
		td =trs[favlist[i].type].appendChild(document.createElement("td"));
		searchItem = td.appendChild(document.createElement("a"));
		searchItem.title = favlist[i].name;
		td.setAttribute("host", favlist[i].host);
		td.setAttribute("url", favlist[i].url);
		td.setAttribute("enc", (favlist[i].enc?favlist[i].enc:""));
		searchItemImg = searchItem.appendChild(document.createElement("img"));
		searchItemImg.src =icondatas[favlist[i].icon];
		searchItemText =searchItem.appendChild(document.createElement("span"));
		searchItemText.innerText =favlist[i].name;
		
		td.onclick=function(){
			var target =document.getElementById("search2_more_newwindow").checked ? "_blank" : "_top";
			var kw =document.getElementById("search2_more_searchInput").value.trim();
			if(kw=="") return;
			var host =this.getAttribute("host");
			var url =this.getAttribute("url");
			var enc =this.getAttribute("enc");
			
			if(!enc) {
				enckeywords =encodeURIComponent(kw);
				enckeywords_nhs =enckeywords.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
				url =url.replace("%s", nohslist.containOf(host) ? enckeywords_nhs : enckeywords);
				COM.openMoreURL(url, target);
			}
			else {
				chrome.extension.sendMessage(
					{action:"search2encodekw", enc:enc, kw:kw},
					function(response) {
						enckeywords =response.enckw;
						//console.log(enc +": " +enckeywords);
						enckeywords_nhs =enckeywords.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
						url =url.replace("%s", nohslist.containOf(host) ? enckeywords_nhs : enckeywords);
						COM.openMoreURL(url, target);
					}
				);
			}
		};
		
	}
	
	return t;
	
};

CTS.runUrlChange =function(){
	var bar =document.getElementById("search2");
	if(!bar) CTS.main();
	else {
		var kw =keywords;
		keywords =null;
		CTS.getKeywords(document.location.hash.slice(1).replace(/\+/g, " "), septr);
		if (!keywords) CTS.getKeywords(document.location.search.slice(1).replace(/\+/g, " "), septr);
		if (!keywords) {
			keywords =kw;
			return;
		}
		//console.log("kw: " +keywords);
		keywords =(septr=="/")?decodeURIComponent(keywords).replace(/\%25(26|2B|2d|2E)/g, "%$1"):decodeURIComponent(keywords);
		
		/*
		enckeywords =encodeURIComponent(decodeURIComponent(keywords));
		if(kw==enckeywords) return;
		var enckeywords_nhs =enckeywords.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
		for(var i =0; i<links.length; i++){
			var host =links[i].getAttribute("host");
			var url =links[i].getAttribute("url");
			if(host && url) links[i].href =url.replace("%s", nohslist.containOf(host) ? enckeywords_nhs : enckeywords);
		}
		*/
	}
};

CTS.runNotUTF =function(){
	var kwdiv =document.getElementById("search2kwdiv");
	keywords =kwdiv.innerText;
	kwdiv.parentNode.removeChild(kwdiv);
	
	//CTS.getKeywords(hashSearch, septr);
	CTS.run();
	
};

CTS.start =function(){
	enc =favlist[favindex].enc;
	if (!enc) {
		try{
			keywords =decodeURIComponent(keywords);
		}catch(e){
			enc ='gbk';
		}
	}
	if(!enc) CTS.run();
	else {
		console.log("search2: url encoding is not utf-8 and auto changed to :" +enc);
		COM.decodeURL(CTS.runNotUTF, enc, keywords);
	}
	
};

CTS.runLsnr =function(){
	if (config.cmenu) {
		document.oncontextmenu =function(){
			chrome.extension.sendMessage({action: "search2initcm"});
		};
	}
	
	chrome.extension.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.action == "search2popmore") {
				CTS.popMore();
	    }
	    else{
	      sendResponse({});
	    }
	    
	});
		
};

CTS.main =function() {
	if (!COM.chromeCompatible()) return;
    
	chrome.storage.local.get(
		function(storages){
			config =storages.search2_config;
			favtypes =storages.search2_favtypes;
			favlist =storages.search2_favlist;
			iconurls =storages.search2_iconurls;
			icondatas =storages.search2_icondatas;
			nohslist =storages.search2_nohslist;
			
			if(!config) config =IDATA.search2_config;
			if(!favtypes) favtypes =IDATA.search2_favtypes;
			if(!favlist) favlist =IDATA.search2_favlist;
			if(!iconurls) iconurls =IDATA.search2_iconurls;
			if(!icondatas) icondatas =IDATA.search2_icondatas;
			if(!nohslist) nohslist =IDATA.search2_nohslist;
			
			pos =config.searchposition;
			
			CTS.runLsnr();
			CTS.init();
			if (!keywords) return;
			
			CTS.initI18n();
			CTS.tunePos();
			CTS.setFavrect();
			
			CTS.ready(CTS.start());
		}
	);
};

CTS.tunePos =function(){
	if ((pos!="left" && pos!="right" && pos!="top" && pos!="bottom") 
		|| (pos=="right" && (stype==2 || stype==5))) 
	pos ="left";
};

CTS.getKeywords =function(hashSearch, septr){
	if("&"==septr) {
		var params = hashSearch.split(septr);
		for (var k = 0; k < params.length; k++) {
			if (params[k].indexOf(prkw) == 0) {
				keywords =params[k].substring(prkw.length);
				break;
			}
		}
	}
	else if("/"==septr) keywords =hashSearch.split(prkw)[1].split("/")[1].split("?")[0].split("#")[0];
};

CTS.setFavrect =function() {
	var rectw =recth =0;
	for(var i =0; i<favlist.length; i++){
		if(favlist[i].on ==1 && favlist[i].url.indexOf("%s")!=-1) favrect[favlist[i].type] =favrect[favlist[i].type] ? favrect[favlist[i].type] +1 : 1;
	}
	/*calculate lines and columns*/
	for (n in favrect) {
		rectw =rectw>favrect[n] ? rectw : favrect[n];
		recth +=1;
	}
	favrect.rectw =rectw;
	favrect.recth =recth;
	favrect.checkboxspan =(rectw-rectw%3)/3;
	favrect.rememberspan =rectw -favrect.checkboxspan*2;
};

CTS.main();
