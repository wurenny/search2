/*---------------------------------------------------------------------------------*
 *                                                                                 *
 * This Source Code is subject to the Proprietary Software License.                *
 * You shall use it only in accordance with the terms of the license agreement.    *
 * You can contribute the source code by submitting pull request on Github:        *
 * https://github.com/wurenny/search2                                              *
 * But unauthorized copying, modification, distribution, or publication of this    *
 * software, in whole or in part, is strictly prohibited.                          *
 *                                                                                 *
 * Copyright (c) 2014-2025, wurenny@gmail.com, All rights reserved                 *
 *                                                                                 *
 * IDENTIFICATION                                                                  *
 *     mod/main-search-bar.js                                                      *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * this create main search bar on web search engine page                           *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

SB.createBar =function(bgc){
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

SB.favMainLoop =function(stb,tr,sp,fn,bgc,fgc){
	var gdt =COMM.getContrastColor(bgc,10);
	var host,url,enc;
	var pdcg,li,pullItem,searchItem;
	for (var i = 0; i < favlist.length; i++) {
		host =favlist[i].host;
		url =favlist[i].url;
		urltf =favlist[i].urltf;
		enc =favlist[i].enc?favlist[i].enc:"";
		
		/*more search menu 2th level menu*/
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
			pullItem.onclick =COMM.clickAslink;
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
		searchItem.onclick =COMM.clickAslink;
	}
};

SB.createConfigbtn =function(td){
	var ret =config.indentdistance;
	
	var configBtn = td.appendChild(document.createElement("a"));
	configBtn.id ="search2_configbtn";
	if (pos=="top" || pos=="bottom") {
		td.style.paddingLeft ="4px";
		td.style.paddingRight =ret +"px";
	}
	if (pos=="left" || pos=="right") {
		td.style.paddingTop ="4px";
		td.style.paddingBottom ="4px";
		if (pos=="left") td.style.paddingBottom =ret +"px";
	}
	var configBtnImg = configBtn.appendChild(document.createElement("img"));
	configBtnImg.src =icondatas.search2_icon32;
	configBtn.title =i18n.__cts_config_tip;
	configBtn.target ="_blank";
	
	configBtn.addEventListener("click", 
		function() {
			var url =chrome.runtime.getURL("opt/opt.html") +"?s=cts";
			window.open(url, "_blank");
		},
	false);
};

SB.createMoreSearch =function(tr,sp,fn){
	let td;
	if (pos == "right") {
		td =tr.firstElementChild;
		td.style.display = "flex";
		td.style.minWidth = "70px";
	} else td = tr.appendChild(document.createElement("td"));
	var more =td.appendChild(document.createElement("a"));
	var moreImg = more.appendChild(document.createElement("img"));
	var moreText =more.appendChild(document.createElement("span"));
	var hoverTimer;
	
	if (pos =="top" || pos =="bottom") td.style.paddingLeft =sp +"px";
	else if(pos =="left") td.style.paddingTop =sp +"px";
	more.id ="search2_moresearch";
	more.title =i18n.__cts_more_tip;
	more.className ="search2HrefSkin";
	more.setAttribute("style","color:" +config.fgcolor +" !important");
	moreImg.src =icondatas.more_icon;
	/*moreText.innerText =(fn!="onlyicon")?i18n.__com_moresearch :"";*/
	
	//more.onmouseover =MSMENU.popSearchMenu;
	more.onmouseover = function() { hoverTimer = setTimeout(() => { MSMENU.popSearchMenu(this); }, 500); }
	more.onmouseout = function() { clearTimeout(hoverTimer); }
	more.onclick = function() { clearTimeout(hoverTimer); MSBOX.popSearchBox(); }
};

SB.rightHideTable =function(bar,tb) {
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
