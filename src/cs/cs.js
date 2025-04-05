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
 *     cs/cs.js                                                                    *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * contentScript is the core runtime content script of search2                     *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

CS.listen =function(){
	// listen url change for inner push state
	//COMM.startUrlChangeListener(); /* not work for some website eg: google earth */
	COMM.urlChangeListener(thisurl, 0, 0, 100);

	// right click build search2 context menu
	if (config.cmenu) {
		document.oncontextmenu =function(){
			chrome.runtime.sendMessage({action: "search2-initcm"});
		};
	}
  // open more search box on click context menu of search2
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.action == "pop-search-box") {
				COMM.setFavrect();
				CS.initI18n();
				MSBOX.popMoreSearchBox();
	    }
	    else{
	      sendResponse({});
	    }
		} 
	);
};

CS.initkw =function(){
	let prkwinurl = false;

	/*transfer link?*/
	if (thisurl.indexOf("/link?")!=-1) return;

	/* match favlist? */
	for (i = 0; i < favlist.length; i++) {
		prkwinurl = thisurl.match(new RegExp(favlist[i].prkw.replace(/\//g, '\\/'))) ? true : false;
		if (favlist[i].on != 1 || favlist[i].url.indexOf("%s")==-1 || !prkwinurl) continue;
		if (hostname.indexOf(favlist[i].host) != -1) {
			if (!favlist[i].urltf) {
				favindex = i;
				urltf =favlist[i].urltf;
				prkw =favlist[i].prkw;
				stype =favlist[i].type;
				continue;
			}
			else if (favlist[i].urltf && thisurl.indexOf(favlist[i].urltf) !=-1) {
				favindex = i;
				urltf =favlist[i].urltf;
				prkw =favlist[i].prkw;
				stype =favlist[i].type;
				break;
			}
		}
	}
	//console.log(`==> ${favlist.length}, i=${i}, fav=${favlist[i]}, url=${thisurl}`);
	if (!prkw) return;
	
	/*action for keywords*/
	ispathkw = prkw.substr(-1) != "=";
	if (ispathkw) {
		septr ="/";
		var href =thisurl;
		hashSearch =href.substr(href.indexOf("://")+3);
		if (urltf!=".") hashSearch =hashSearch.replace(/\%25(26|2B|2d|2E)/g, "%$1");
		hashSearch =hashSearch.replace(/\+/g, " ");
		COMM.getKeywords(hashSearch, septr);
	}
	else septr ="&";
    //console.log("urltf=" + urltf + " prkw=" + prkw + " septr=" + septr + " kws=" + keywords + " hs=" + hashSearch);
	/*location hash | search*/
	if (!keywords) {
		hashSearch =document.location.search.slice(1);
		hashSearch =hashSearch.replace(/\+/g, " ");
		COMM.getKeywords(hashSearch, septr);
	}
	if (!keywords) {
		hashSearch =document.location.hash.slice(1);
		hashSearch =hashSearch.replace(/\+/g, " ");
		COMM.getKeywords(hashSearch, septr);
	}
	if (!keywords) return;
	
	/*url change listener, include history state change and hashchange*/
	//COMM.startUrlChangeListener();
};

CS.ready =function(start){	
	//cssdiv
	var cssdiv =document.documentElement.insertBefore(document.createElement("div"), document.documentElement.firstChild);
	cssdiv.id ='search2Head';
	COMM.loadCSS(cssdiv, "mod/more-search-menu.css", "search2MoreSearchMenuCSS", null);
	
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
	COMM.loadCSS(cssdiv, "css/cs.css", "search2BarCss", start);
};

CS.start =function(){
	enc =favlist[favindex].enc;
	if (!enc) {
		try{
			//decode twice for '%25xx%25xx%25xx'
			keywords = decodeURIComponent(decodeURIComponent(keywords));
		}catch(e){
			enc ='gbk';
		}
	}
	if(enc) {
		keywords = keywords.decodeURI(enc);
		console.log(`search2: keywords decoding(${enc}) to: ${keywords}`);
	}
	CS.run();
	//UTIL.decodeURL(CS.runNotUTF, enc, keywords);
};

CS.run =function(){
	var fn=config.searchnamedisplay;
	var tld =config.searchlisttiled;
	var sp =(tld && pos!="right")?0:config.intervaldistance;
	var fgh =COMM.getDiffColor(config.fgcolor, 0, 0, -100);
	var cch =COMM.getContrastColor(config.bgcolor,5);
	var ccb =COMM.getContrastColor(config.bgcolor,0);

	/*color palette*/
	SB.palette = {};
	SB.palette.bgc = config.bgcolor;
	SB.palette.fgc = config.fgcolor;
	SB.palette.fgh = fgh; //for hover
	SB.palette.bgh = cch; //for hover
	SB.palette.bgc1 = ccb[1];
	SB.palette.bgc2 = ccb[2];
	
	/*triggered more than once ?*/
	if (document.getElementById("search2")) return;
	
	/*create bar*/
	var bar =SB.createBar(config.bgcolor);
		
	/*table layout*/
	var tb =bar.appendChild(document.createElement("table"));
	if (tld) {
		if (pos=="left") tb.style.height ="100%";
		if (pos=="top" || pos=="bottom") tb.style.width ="100%";
	}
	var tr =tb.appendChild(document.createElement("tr"));
	var td =tr.appendChild(document.createElement("td"));;
	
	/*config button*/
	SB.createConfigButton(td);
	
	/*table body: auto hide and at right ?*/
	var stb =(pos=="right" && config.autohide) ? SB.rightHideTable(bar,tb) : tb;
	
	/*more search menu layout: L1 and L2*/
	MSMENU.createMoreSearchMenu(SB.palette);
	
	/*fill search engines and  L2 more search menu*/
	SB.createSearchItem(stb,tr,sp,fn, SB.palette);
	
	/*more search button: listen and display menu + box*/
	if (pos =="left") tr =stb.appendChild(document.createElement("tr"));
	SB.createMoreSearchButton(tr,sp,fn);
	
	/*now display the search2 bar*/
	SB.flushSearchItem(bar, fn, 1);
	bar.style.visibility ="visible";

	/* listen resize if hide the search text */
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => SB.flushSearchItem(bar, fn, 1), 500);
	});
};

CS.runNotUTF =function(){
	var kwdiv =document.getElementById("search2kwdiv");
	keywords =kwdiv.innerText;
	kwdiv.parentNode.removeChild(kwdiv);
	CS.run();
};

CS.main =function() {
	if (!UTIL.chromeCompatible()) return;
	chrome.storage.local.get(
		function(storages){
			optdata = storages.search2;
			if(!optdata) optdata = OPT.data;
			config =optdata.config;
			favtypes =optdata.favtypes;
			favlist =optdata.favlist;
			iconurls =optdata.iconurls;
			icondatas =optdata.icondatas;
			//nohslist =optdata.nohslist; /* removed from v2.3.2 */
			
			icondatas.search2_icon32 = OPT.data.icondatas.search2_icon32;
			icondatas.more_icon = OPT.data.icondatas.more_icon;
			pos =config.searchposition.toLowerCase();
			
			thisurl = document.location.href;
			hostname = document.location.host;
			CS.listen();
			CS.initkw();
			if (!keywords) return;
			
			CS.initI18n();
			COMM.tunePos();
			COMM.setFavrect();
			
			CS.ready(CS.start);
		}
	);
};

CS.main();
