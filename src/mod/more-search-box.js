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
 *     mod/more-search-box.js                                                      *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * more-search-box.js create search box for search2                                *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

MSBOX.popMoreSearchBox =function() {
	var morediv =document.getElementById("search2more");
	if(!morediv) {
		morediv =document.documentElement.insertBefore(document.createElement("div"), document.documentElement.firstChild);
		morediv.id ="search2more";
	}
	COMM.loadCSS(morediv,"mod/more-search-box.css","search2MoreCSS",null);
	
	var w =favrect.rectw * 85, h =favrect.recth * 50 +65;
	var pbl =config.morecartoon;
	var ctrd =config.morecartoonrandom;
	var stxt =COMM.getSelectedText();
	var kw =(config.searchselected && stxt!="")? stxt : (keywords?keywords:"");
	COMM.removeObjdata();
	MSBOX.createMoreSearchBox(i18n.__more_title, null, kw, w, h, true, pbl, ctrd);
	
	/*hide search menu*/
	var pdiv =document.getElementById("more_search_menu");
	if(pdiv) pdiv.style.display ="none";
};

MSBOX.createMoreSearchBox =function(title, url, kw, w, h, cartoon, parabola, cartoonrandom) {
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
	
	if(!url) boxcontent.appendChild(MSBOX.createMoreSearchBoxContent(kw));
	else{
		var iframe =boxcontent.appendChild(document.createElement("iframe"));
		iframe.id ="search2boxiframe";
		iframe.src =url;
	}
	
	boxhead.onmousedown =function(){box.domove()};
	boxclose.onclick =COMM.removeOverlay;
	
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

MSBOX.createMoreSearchBoxContent =function(kw) {
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
	input.id ="search2_more_searchBox";
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
	div.onclick =COMM.moreRemember;
	
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
		td.onclick =COMM.clickAslink;
	}
	return t;
};

MSBOX.loadBoxNOTUSE =function(){
//window.onload =function(){
	/**
	chrome.runtime.sendRequest(
		{action: "getkw"},
		function(response){
			var kw =response.utfkw;
			
		}
	);
	**/
	let kw =document.location.search.substr(4);
	if(!kw) kw ="";
	
	Array.prototype.containOf =function(e){
		if(this.constructor!=Array) return;
		for(var i =0; i<this.length; i++) if(e ==this[i]) return true;
		return false;
	};

	var searchInput =document.getElementById("search2_more_searchBox");
	searchInput.value=decodeURIComponent(kw);
	MSBOX.initI18n();
	
	chrome.storage.local.get(
		function(storages){
			var favtypes =storages.search2_favtypes;
			var favlist =storages.search2_favlist;
			var icondatas =storages.search2_icondatas;
			var nohslist =storages.search2_nohslist;
			
			if(!favtypes) favtypes =IDATA.search2_favtypes;
			if(!favlist) favlist =IDATA.search2_favlist;
			if(!icondatas) icondatas =IDATA.search2_icondatas;
			if(!nohslist) nohslist =IDATA.search2_nohslist;
			
			/*config */
			chrome.runtime.sendRequest(
				{action: "xCorlorBox"},
				function(rep) {console.log(rep.overlay);}
			);
			
			var morelist =document.getElementById("search2_more_morelist");
			var trs =[];
			//tr
			for(tp in favtypes){
				trs[tp] =morelist.appendChild(document.createElement("tr"));
			}
			//td
			for(var i =0; i<favlist.length; i++){
				if(!favlist[i].on) continue;
				var td =trs[favlist[i].type].appendChild(document.createElement("td"));
				var searchItem = td.appendChild(document.createElement("a"));
				searchItem.title = favlist[i].name;
				td.setAttribute("host", favlist[i].host);
				td.setAttribute("url", favlist[i].url);
				searchItemImg = searchItem.appendChild(document.createElement("img"));
				searchItemImg.src =icondatas[favlist[i].icon];
				searchItemText =searchItem.appendChild(document.createElement("span"));
				searchItemText.innerText =favlist[i].name;
				
				td.onclick=function(){
					var target =document.getElementById("search2_more_newwindow").checked ? "_blank" : "_top";
					var utfkeywords =encodeURIComponent(searchInput.value);
					var utfkeywords_nhs=utfkeywords.replace(/\%(26|2B|2d|2E)/g,"%25$1").replace(/-/g, "%252d").replace(/\./g, "%252E");
					//console.log(utfkeywords);
					//console.log(utfkeywords_nhs);
					var host =this.getAttribute("host");
					var url =this.getAttribute("url");
					var url =url.replace("%s", nohslist.containOf(host) ? utfkeywords_nhs : utfkeywords);
					//console.log(url);
					window.open(url,target);
				};
			}
			
		}
	);
};