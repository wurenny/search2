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
 *     inc/comm.js                                                                 *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * comm is the commonly used for any other invoker functions and small tools       *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

COMM.getTypeName =function(type){
	switch (type) {
		case 0 : return i18n.__com_typename_news;
		case 1 : return i18n.__com_typename_web;
		case 2 : return i18n.__com_typename_picture;
		case 3 : return i18n.__com_typename_video;
		case 4 : return i18n.__com_typename_tv;
		case 5 : return i18n.__com_typename_music;
		case 6 : return i18n.__com_typename_shopping;
	}
	
};

COMM.removeObjdata =function() {
	if(document.location.host.indexOf("bing.com")==-1) return;
	var objs =document.getElementsByTagName("object");
	if(!objs) return;
	for(var i =0; i<objs.length; i++) { 
		if(objs[i].getAttribute("data")) objs[i].removeAttribute("data");
	}
};

COMM.getContrastColor =function(color,factor) {
	var HX=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
	var n, rcolor =["#","#","#"];
	for(var i=1; i<7; i++){
		n =color.substr(i,1);
		n =parseInt("0x" +(n ? n : i));
	  n =(n +factor*i)%16;
	  rcolor[0] +=HX[n];
	  rcolor[1] +=HX[n+2>15?15:n+1];
	  rcolor[2] +=HX[n+4>15?15:n+2];
	}
	return rcolor;
};

COMM.getDiffColor =function(hexcolor, r1, g1, b1) {
    let r = parseInt(hexcolor.substring(1, 3), 16);
    let g = parseInt(hexcolor.substring(3, 5), 16);
    let b = parseInt(hexcolor.substring(5, 7), 16);
    r = Math.max(0, Math.min(255, r + r1));
    g = Math.max(0, Math.min(255, g + g1));
    b = Math.max(0, Math.min(255, b + b1));
    return "#" +
			r.toString(16).padStart(2, "0") +
			g.toString(16).padStart(2, "0") +
			b.toString(16).padStart(2, "0");
};

COMM.getSelectedText =function(){
	return selectedtext =window.getSelection().toString().replace(/\n/g," ").trim().substr(0, 64);
};

COMM.loadCSS =function(e, f, id, cb) {
	var css =document.getElementById(id);
	if(!css) {
		css =document.createElement("link");
		css.id=id;
		css.type ="text/css";
		css.rel ="stylesheet";
		css.charset ="utf8";
		css.href = chrome.runtime.getURL(f);
		e.appendChild(css);
		if(cb) css.onload= cb;
	}
};

COMM.tunePos =function(){
	if ((pos!="left" && pos!="right" && pos!="top" && pos!="bottom") 
		|| (pos=="right" && (stype==2 || stype==5))) 
	pos ="left";
};

COMM.getKeywords =function(hashSearch, septr){
	//console.log(`septr:${septr}, prkw:${prkw}, hashSearch:${hashSearch}`);
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
		//if(hashSearch.indexOf('search.suning.com') >=0) keywords =hashSearch.split(prkw)[1].split("/")[1].split("?")[0].split("#")[0];
		//else if(hashSearch.indexOf('so.iqiyi.com') >=0) keywords =hashSearch.split(prkw)[1].split("?")[0];
		//else {
			//keywords =hashSearch.split(prkw)[1].split("/")[1];
			let regex = new RegExp(prkw.replace(/\//g, '\\/'));
			//console.log('==>', hashSearch, regex);
			let match = hashSearch.match(regex);
			if (match) keywords = match[1];
		//}
	}
};

COMM.urlChangeListener = function(thisurl, count, delay) {
	//console.log(`===> url change time: ${count}， current delay：${delay}ms， septr=${septr}, keyword=${keywords}`);
	if (count >= 30) return;
	let url2 =document.location.href;
	if (thisurl!=url2) { COMM.runUrlChange(); count++; }
	if (count === 10) {
			delay = 1000;
	} else if (count === 20) {
			delay = 2000;
	}
	setTimeout(() => COMM.urlChangeListener(url2, count, delay), delay);
}

COMM.runUrlChange =function(){
	var bar =document.getElementById("search2");
	if(!bar) CS.main();
	else {
		var kw =keywords;
		keywords =null;
		COMM.getKeywords(document.location.hash.slice(1).replace(/\+/g, " "), septr);
		if (!keywords) COMM.getKeywords(document.location.search.slice(1).replace(/\+/g, " "), septr);
		if (!keywords) {
			keywords =kw;
			return;
		}
		//console.log("kw: " +keywords);
		keywords =(septr=="/")?decodeURIComponent(keywords).replace(/\%25(26|2B|2d|2E)/g, "%$1"):decodeURIComponent(keywords);
	}
};

COMM.clickAslink =function(){
	var kw,nw;
	var host =this.getAttribute("host");
	var url =this.getAttribute("url");
	var urltf =this.getAttribute("urltf");
	var enc =this.getAttribute("enc");
	var stxt =COMM.getSelectedText();
	if(this.getAttribute("atmore")){
		nw =document.getElementById("search2_more_newwindow").checked;
		kw =document.getElementById("search2_more_searchBox").value.trim();
		if(document.getElementById("search2_more_autoclose").checked) COMM.removeOverlay();
	}else{
		kw =(config.searchselected && stxt!="")? stxt : (keywords?keywords:"");
		nw =config.newwindow;
	}
	if(!enc) COMM.openURL(host,url,encodeURIComponent(kw),urltf,nw);
	else {
		chrome.runtime.sendMessage(
			{action:"search2-encode-keyword", enc:enc, kw:kw},
			function(response) {COMM.openURL(host,url,response.enckw,urltf,nw)}
		);
	}
};

COMM.openURL =function(host,url,ekw,urltf,nw){
	if(nohslist.containOf(host) && urltf!=".") ekw =ekw.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
	url =url.replace("%s", ekw);
    //console.log("urltf=" + urltf + " url=" + url);
	window.open(url, (nw)?"_blank":"_top");
};

COMM.moreRemember =function() {
	config.morenewwindow =document.getElementById("search2_more_newwindow").checked ? 1 : 0;
	config.moreautoclose =document.getElementById("search2_more_autoclose").checked ? 1 : 0;
	chrome.storage.local.set({search2_config : config});
	alert(i18n.__more_savesuccess);
};

COMM.removeOverlay =function(){
	document.documentElement.style.overflow ="auto";
	var morediv =document.getElementById("search2more");
	var overlay =document.getElementById("search2overlay");
	var colorbox =document.getElementById("search2colorbox");
	morediv.removeChild(overlay);
	morediv.removeChild(colorbox);
};

COMM.setFavrect =function() {
	var rectw =recth =0;
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
