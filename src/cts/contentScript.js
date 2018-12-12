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

var CTS ={}, i18n ={};
var favnum ={}, favrect ={};
var hashSearch, septr;
var keywords, enc, enckeywords;
var favindex, pos, stype, prkw, urltf;
var whmargin, msovered =0;

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
		){
			favindex = i;
			urltf =favlist[i].urltf;
			prkw =favlist[i].prkw;
			stype =favlist[i].type;
			break;
		}
	}
		
	/*transfer link?*/
	if (thisurl.indexOf("/link?")!=-1) return;
	if (!prkw) return;
	
	/*action for keywords*/
	if (nohslist.containOf(hostname)) {
		septr ="/";
		var href =thisurl;
		hashSearch =href.substr(href.indexOf("://")+3);
		if (urltf!=".") hashSearch =hashSearch.replace(/\%25(26|2B|2d|2E)/g, "%$1");
		hashSearch =hashSearch.replace(/\+/g, " ");
		CTS.getKeywords(hashSearch, septr);
	}
	else septr ="&";
    //console.log("urltf=" + urltf + " prkw=" + prkw + " septr=" + septr + " kws=" + keywords + " hs=" + hashSearch);
	/*location hash | search*/
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
	
	/*hash change listener ,but while history.pushState was invoked use ajax in HTML5, it will donot work*/
	/*
	window.addEventListener('hashchange', function () {
		CTS.runUrlChange();
	}, false);
	*/
	var url1 =thisurl, url2;
	setInterval(
		function(){
			url2 =document.location.href;
			if (url1!=url2) {
				url1 =url2;
				CTS.runUrlChange();
			}
		},100
	);
	
};

CTS.ready =function(start){	
	//cssdiv
	var cssdiv =document.documentElement.insertBefore(document.createElement("div"), document.documentElement.firstChild);
	cssdiv.id ='search2Head';
	CTS.loadCss(cssdiv, "css/pull.css", "search2PulldownCSS", null);
	
	//original doc position
	whmargin =18;
	if (i18n.chrome_nls!="zh_CN" && pos=="left") whmargin =34;
	if (!config.autohide) {
		document.documentElement.style.position='absolute';
		if (pos=="left") {
			document.documentElement.style.marginLeft=whmargin +"px";
			document.documentElement.style.width=(document.documentElement.clientWidth-whmargin-whmargin) +"px";
			//resize listener
			window.onresize =function(event) {
				document.documentElement.style.width=(document.documentElement.clientWidth-whmargin) +"px";
			};
		}
		else {
			if (pos=="top") document.documentElement.style.marginTop=whmargin +"px";
			if (pos=="bottom") document.documentElement.style.paddingBottom=whmargin +"px";
			document.documentElement.style.width='100%';
		}
	}
	CTS.loadCss(cssdiv, "css/css.css", "search2BarCss", start);

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
		console.log("search2: url encoding is not utf-8 and change to :" +enc);
		COM.decodeURL(CTS.runNotUTF, enc, keywords);
	}
};

CTS.createBar =function(bgc){
	var ah =config.autohide;
	var bdc =config.bdcolor;
	var bl =config.borderline;
	var rret =config.rightindentdistance;
	var marginpx ="-" +(whmargin-2) +"px";
	
	var bar =document.createElement("div");
	document.documentElement.insertBefore(bar,document.head);
	bar.id ="search2";
	bar.className ="search2Skin search2_At" +pos +(ah && pos !="RIGHT" ? " search2AutoHide_At" +pos : "");
	var barstyle ="display:none;background:" +bgc +" !important;";
	
	if(pos=="left") barstyle +=(bl ? "border-right:1px solid " +bdc +" !important;" : "") +(ah ? "left:" +marginpx : "");
	else if(pos=="top") barstyle +=(bl ? "border-bottom:1px solid " +bdc +" !important;" : "") +(ah ? "top:" +marginpx : "");
	else if(pos=="bottom") barstyle +=(bl ? "border-top:1px solid " +bdc +" !important;" : "") +(ah ? "bottom:" +marginpx : "");
	else if(pos=="right") barstyle +=bl ? "border:1px solid " +bdc +" !important;" : "";
	
	bar.setAttribute("style",barstyle);
	if (pos=="left") bar.style.width =whmargin +"px";
	else if (pos=="right") bar.style.right=rret + "%";
	
	return bar;
};

CTS.createPullmenu =function(bgc,fgc) {
	var gdt =COM.getContrastColor(bgc,10);
	var bgc2 =COM.getContrastColor(bgc,0)[1];
	var pulldowndiv =document.createElement("div");
	pulldowndiv.id ="search2_pulldowndiv";
	pulldowndiv.style.display ="none";
	document.documentElement.insertBefore(pulldowndiv,document.head);
	var ul =pulldowndiv.appendChild(document.createElement("ul"));
	if(pos=="left" || pos =="right") ul.style.width ="60px";
	for(var t in favtypes) {
		if(t ==stype) continue;
		var li =ul.appendChild(document.createElement("li"));
		var a =li.appendChild(document.createElement("a"));
		a.innerText =favtypes[t];
		a.style.background =bgc2;
		a.onmouseover =function(){this.setbg(gdt)};
		a.onmouseout =function(){this.style.background =bgc2};
		a.style.color =fgc;
		var ul2 =li.appendChild(document.createElement("ul"));
		ul2.id ="pulldown_category" +t;
		ul2.style.background =bgc;
		ul2.style.color =fgc;
		//ul2.style.opacity =0.95;
		if(pos=="left") ul2.style.marginLeft ="60px";
		else if(pos=="right") ul2.style.marginLeft ="-102px";
	}
};

CTS.createConfigbtn =function(td){
	var ret =config.indentdistance;
	
	var configBtn = td.appendChild(document.createElement("a"));
	configBtn.id ="search2_configbtn";
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
};

CTS.rightHideTable =function(bar,tb) {
	var tr =tb.appendChild(document.createElement("tr"));
	var td =tr.appendChild(document.createElement("td"));
	td.id ="search2_subtd";
	td.style.display ="none";
	bar.onmouseover =function() {document.getElementById("search2_subtd").style.display ="";};
	bar.onmouseout =function(){document.getElementById("search2_subtd").style.display ="none"};
	
	var stb =td.appendChild(document.createElement("table"));
	stb.id ="search2_sublist";
	return stb;
};

CTS.favMainLoop =function(stb,tr,sp,fn,bgc,fgc){
	var gdt =COM.getContrastColor(bgc,10);
	var host,url,enc;
	var pdcg,li,pullItem,searchItem;
	for (var i = 0; i < favlist.length; i++) {
		host =favlist[i].host;
		url =favlist[i].url;
		urltf =favlist[i].urltf;
		enc =favlist[i].enc?favlist[i].enc:"";
		
		/*pull down 2th item*/
		pdcg =document.getElementById("pulldown_category" +favlist[i].type);
		if(pdcg && favlist[i].on && favlist[i].url.indexOf("%p")==-1) {
			li =pdcg.appendChild(document.createElement("li"));
			pullItem =li.appendChild(document.createElement("a"));
			pullItem.innerText =favlist[i].name;
			pullItem.style.background =bgc;
			pullItem.setAttribute("style","color:" +fgc +" !important");
			pullItem.setAttribute("host",host);
			pullItem.setAttribute("url",url);
			pullItem.setAttribute("urltf",urltf);
			pullItem.setAttribute("enc", enc);
			/*mouse event*/
			pullItem.onmouseover =function(){this.setbg(gdt)};
			pullItem.onmouseout =function(){this.style.background =bgc};
			pullItem.onmousedown =CTS.clickAslink;
		}
		
		/*search2 bar item*/
		if (favlist[i].on != 1 || favlist[i].type != stype || favlist[i].url.indexOf("%s")==-1) continue;
		if (pos =="left" || pos =="right") tr =stb.appendChild(document.createElement("tr"));
		td =tr.appendChild(document.createElement("td"));
		if (pos =="top" || pos =="bottom") td.style.paddingLeft =td.style.paddingRight =sp +"px";
		else td.style.paddingTop =td.style.paddingBottom =sp +"px";
		/*engines*/
		searchItem = td.appendChild(document.createElement("a"));
		searchItem.charset ="UTF-8";
		searchItem.className =(i==favindex) ? "search2HrefSkin search2HrefSkin2" : "search2HrefSkin";
		searchItem.setAttribute("style","color:" +fgc +" !important");
		searchItem.setAttribute("host",host);
		searchItem.setAttribute("url",url);
		searchItem.setAttribute("urltf",urltf);
		searchItem.setAttribute("enc", enc);
		searchItem.title = favlist[i].name;
		searchItemImg = searchItem.appendChild(document.createElement("img"));
		searchItemImg.src =icondatas[favlist[i].icon];
		searchItemText =searchItem.appendChild(document.createElement("span"));
		searchItemText.innerText =(fn!="onlyicon")?(((fn=="auto" && pos!="left") || fn=="fullname") ? favlist[i].name : favtypes[stype]):"";
		searchItemText.className="search2Text_At" +pos;
		/*add listener as same as url link*/
		searchItem.onmousedown =CTS.clickAslink;
	}
};

CTS.run =function(){
	var fn=config.searchnamedisplay;
	var tld =config.searchlisttiled;
	var sp =(tld && pos!="right")?0:config.intervaldistance;
	var bgc =config.bgcolor;
	var fgc =config.fgcolor;
	
	/*triggered more than once ?*/
	if (document.getElementById("search2")) return;
	
	/*create bar*/
	var bar =CTS.createBar(bgc);
		
	/*more pull down list*/
	CTS.createPullmenu(bgc,fgc);
	
	/*table layout*/
	var tb =bar.appendChild(document.createElement("table"));
	if (tld) {
		if (pos=="left") tb.style.height ="100%";
		if (pos=="top" || pos=="bottom") tb.style.width ="100%";
	}
	var tr =tb.appendChild(document.createElement("tr"));
	var td =tr.appendChild(document.createElement("td"));;
	
	/*config button*/
	CTS.createConfigbtn(td);
	
	/*auto hide and at right ?*/
	var stb =(pos=="right" && config.autohide) ? CTS.rightHideTable(bar,tb) : tb;
	
	/*fill search engines*/
	CTS.favMainLoop(stb,tr,sp,fn,bgc,fgc);
	
	/*more search*/
	if (pos =="left" || pos =="right") tr =stb.appendChild(document.createElement("tr"));
	CTS.createMoreSearch(tr,sp,fn);
	
	/*now display the search2 bar*/
	bar.style.display ="block";
};

CTS.createMoreSearch =function(tr,sp,fn){
	var td =tr.appendChild(document.createElement("td"));
	var more =td.appendChild(document.createElement("a"));
	var moreImg = more.appendChild(document.createElement("img"));
	var moreText =more.appendChild(document.createElement("span"));
	
	if (pos =="top" || pos =="bottom") td.style.paddingLeft =sp +"px";
	else if(pos =="left") td.style.paddingTop =sp +"px";
	more.id ="search2_moresearch";
	more.title =i18n.__cts_more_tip;
	more.className ="search2HrefSkin";
	more.setAttribute("style","color:" +config.fgcolor +" !important");
	moreImg.src =icondatas.more_icon;
	/*moreText.innerText =(fn!="onlyicon")?i18n.__com_moresearch :"";*/
	
	more.onmouseover =CTS.pullMore;
	more.onmousedown =CTS.popMore;
};

CTS.pullMore =function() {
	if(msovered) return;
	var e =this;
	var athd =config.autohide;
	if(athd && pos =="right") e =document.getElementById("search2_configbtn");
	var pdiv =document.getElementById("search2_pulldowndiv");
	var dw =document.documentElement.clientWidth;
	var dh =document.documentElement.clientHeight;
	var x,y;
	var rect =e.getBoundingClientRect();
	if(rect){
		x =rect.left;
		y =rect.top +rect.height;
	}
	else{
		x =e.offsetLeft;
		y =e.offsetTop;
		var current = e.offsetParent;
		while (current !==null) {
			x +=current.offsetLeft;
			y +=current.offsetTop;
			current =current.offsetParent;
		}
		y =y +e.offsetHeight;
	}
	//console.log(dw +"," +dh +"||" +x +"," +y +"||" +event.clientX +"," +event.clientY);	
	
	/*position:pdiv*/
	if(pos =="top" || pos =="bottom") {
		pdiv.style.right =dw -x +"px";
		pos=="top" ? pdiv.style.top ="0px" : pdiv.style.bottom ="0px";
	}
	else if(pos =="left") {
		pdiv.style.left =x +whmargin +"px";
		pdiv.style.bottom =dh -y +"px";
	}
	else {
		pdiv.style.left =x +(athd?-50:2) +"px";
		pdiv.style.bottom =dh -(athd?event.clientY:y-16) +"px";
		//pdiv.style.bottom =dh -y -(athd?(config.intervaldistance*2+18)*favnum[stype] +44:0) +16 +"px";
		msovered =1;
	}
	/*position:second menu list*/
	var uls =pdiv.getElementsByTagName("ul");
	for(var i=0;i<uls.length;i++) 
		if(uls[i].id.indexOf("pulldown_category")!=-1) {
			if(pos =="top") {
				uls[i].style.top ="18px";
				uls[i].style.borderRadius ="0px 0px 6px 6px";
			}
			else if(pos =="bottom") {
				uls[i].style.bottom ="18px";
				uls[i].style.borderRadius ="6px 6px 0px 0px";
			}
			else {
				uls[i].style.bottom ="0px";
				if(pos =="left") uls[i].style.borderRadius ="0px 6px 6px 0px";
				if(pos =="right") uls[i].style.borderRadius ="6px 0px 0px 6px";
			}
		}
	
	pdiv.style.display ="block";
	document.body.onmouseover =function(){
		pdiv.style.display ="none";
		document.body.onmouseover =undefined;
		msovered =0;
	}
};

CTS.popMore =function() {
	var morediv =document.getElementById("search2more");
	if(!morediv) {
		morediv =document.documentElement.insertBefore(document.createElement("div"), document.documentElement.firstChild);
		morediv.id ="search2more";
	}
	CTS.loadCss(morediv,"more/more.css","search2MoreCSS",null);
	
	var w =favrect.rectw * 85, h =favrect.recth * 50 +65;
	var pbl =config.morecartoon;
	var ctrd =config.morecartoonrandom;
	var stxt =COM.getSelectedText();
	var kw =(config.searchselected && stxt!="")? stxt : (keywords?keywords:"");
	COM.removeObjdata();
	CTS.colorBox(i18n.__more_title, null, kw, w, h, true, pbl, ctrd);
	
	/*hide pull down menu*/
	var pdiv =document.getElementById("search2_pulldowndiv");
	if(pdiv) pdiv.style.display ="none";
};

CTS.colorBox =function(title, url, kw, w, h, cartoon, parabola, cartoonrandom) {
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
	var x =(document.documentElement.clientWidth-w)/3;
	var y =(document.documentElement.clientHeight-h)/2;
	box.style.width =(cartoon ? 0 : w) +"px";
	box.style.height =(cartoon ? 0 : h+24) +"px";
	box.style.left =(x >0 ? x : 0) +"px";
	box.style.top =(y >0 ? y : 0) +"px";
	var tb =box.appendChild(document.createElement("table"));
	tb.id ="search2boxbody";
	var boxhead =tb.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
	boxhead.id ="search2boxhead";
	boxhead.style.height ="24px";
	var boxtitle =boxhead.appendChild(document.createElement("label"));
	boxtitle.style.float ="left";
	boxtitle.innerText =title
	var boxclose =boxhead.appendChild(document.createElement("label"));
	boxclose.id ="search2boxclose";
	boxclose.innerText ="X";/*i18n.__com_close*/
	boxcontent =tb.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
	boxcontent.id ="search2boxcontent";
	
	if(!url) boxcontent.appendChild(CTS.makeMore(kw));
	else{
		var iframe =boxcontent.appendChild(document.createElement("iframe"));
		iframe.id ="search2boxiframe";
		iframe.src =url;
	}
	
	boxhead.onmousedown =function(){box.domove()};
	boxclose.onclick =CTS.removeOverlay;
	
	//box.style.width =width +"px";
	//box.style.height =height +"px";
	if (!cartoon) {
		iframe.style.width =w +"px";
		iframe.style.height =h +"px";
	}
	var vectors =["TB","BT","LR","RL","TR","BR","TL","BL","CE"];
	var vt;
	if (!parabola && !cartoonrandom)  vt ="CE";
	else if (parabola && !cartoonrandom) vt ="BL";
	else vt =vectors[parseInt(Math.random()*9)];
	if(cartoon) box.dopopup(w, h+24, vt, cartoonrandom, parabola);
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
	div.onclick =CTS.moreRemember;
	
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
		td.setAttribute("atmore", "true");
		td.setAttribute("host", favlist[i].host);
		td.setAttribute("url", favlist[i].url);
		td.setAttribute("urltf", favlist[i].urltf);
		td.setAttribute("enc", (favlist[i].enc?favlist[i].enc:""));
		searchItemImg = searchItem.appendChild(document.createElement("img"));
		searchItemImg.src =icondatas[favlist[i].icon];
		searchItemText =searchItem.appendChild(document.createElement("span"));
		searchItemText.innerText =favlist[i].name;
		td.onclick =CTS.clickAslink;
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
	}
};

CTS.runNotUTF =function(){
	var kwdiv =document.getElementById("search2kwdiv");
	keywords =kwdiv.innerText;
	kwdiv.parentNode.removeChild(kwdiv);
	CTS.run();
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
				CTS.setFavrect();
				CTS.initI18n();
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
			
			pos =config.searchposition.toLowerCase();
			
			CTS.runLsnr();
			CTS.init();
			if (!keywords) return;
			
			CTS.initI18n();
			CTS.tunePos();
			CTS.setFavrect();
			
			CTS.ready(CTS.start);
		}
	);
};

CTS.loadCss =function(e, f, id, cb) {
	var css =document.getElementById(id);
	if(!css) {
		css =document.createElement("link");
		css.id=id;
		css.type ="text/css";
		css.rel ="stylesheet";
		css.charset ="utf8";
		css.href = chrome.extension.getURL(f);
		e.appendChild(css);
		if(cb) css.onload= cb;
	}
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
	else if("/"==septr){
		if(hashSearch.indexOf('search.suning.com') >=0) keywords =hashSearch.split(prkw)[1].split("/")[1].split("?")[0].split("#")[0];
        else if(hashSearch.indexOf('so.iqiyi.com') >=0) keywords =hashSearch.split(prkw)[1].split("?")[0];
        else keywords =hashSearch.split(prkw)[1].split("/")[1];
	}
};

CTS.clickAslink =function(){
	var kw,nw;
	var host =this.getAttribute("host");
	var url =this.getAttribute("url");
	var urltf =this.getAttribute("urltf");
	var enc =this.getAttribute("enc");
	var stxt =COM.getSelectedText();
	if(this.getAttribute("atmore")){
		nw =document.getElementById("search2_more_newwindow").checked;
		kw =document.getElementById("search2_more_searchInput").value.trim();
		if(document.getElementById("search2_more_autoclose").checked) CTS.removeOverlay();
	}else{
		kw =(config.searchselected && stxt!="")? stxt : (keywords?keywords:"");
		nw =config.newwindow;
	}
	if(!enc) CTS.openURL(host,url,encodeURIComponent(kw),urltf,nw);
	else {
		chrome.extension.sendMessage(
			{action:"search2encodekw", enc:enc, kw:kw},
			function(response) {CTS.openURL(host,url,response.enckw,urltf,nw)}
		);
	}
};

CTS.openURL =function(host,url,ekw,urltf,nw){
	if(nohslist.containOf(host) && urltf!=".") ekw =ekw.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
	url =url.replace("%s", ekw);
    //console.log("urltf=" + urltf + " url=" + url);
	window.open(url, (nw)?"_blank":"_top");
};

CTS.moreRemember =function() {
	config.morenewwindow =document.getElementById("search2_more_newwindow").checked ? 1 : 0;
	config.moreautoclose =document.getElementById("search2_more_autoclose").checked ? 1 : 0;
	chrome.storage.local.set({search2_config : config});
	alert(i18n.__more_savesuccess);
};

CTS.removeOverlay =function(){
	document.documentElement.style.overflow ="auto";
	var morediv =document.getElementById("search2more");
	var overlay =document.getElementById("search2overlay");
	var colorbox =document.getElementById("search2colorbox");
	morediv.removeChild(overlay);
	morediv.removeChild(colorbox);
};

CTS.setFavrect =function() {
	var rectw =recth =0;
	favnum ={};
	for(var i =0; i<favlist.length; i++){
		if(favlist[i].on ==1 && favlist[i].url.indexOf("%s")!=-1) favnum[favlist[i].type] =favnum[favlist[i].type] ? favnum[favlist[i].type] +1 : 1;
	}
	/*calculate lines and columns*/
	for (n in favnum) {
		rectw =rectw>favnum[n] ? rectw : favnum[n];
		recth +=1;
	}
	favrect.rectw =rectw;
	favrect.recth =recth;
	favrect.checkboxspan =(rectw-rectw%3)/3;
	favrect.rememberspan =rectw -favrect.checkboxspan*2;
};

CTS.main();
