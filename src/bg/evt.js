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
 *     bg/evt.js                                                                   *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * evt.js works when search2's context menu trigged                                *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

var EVT ={};
var cmstate;

EVT.msgListener =function(){
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	  	if (request.action =="search2-createcm") {
	  		EVT.createCM();
	  		return true;
	  	}
	  	if (request.action =="search2-initcm") {
	  		EVT.initCM();
	  		return true;
	  	}
	    if (request.action == "search2-encode-keyword") {
				EVT.encodeURL(sendResponse,request.enc, request.kw).submit();
				return true;
	    }
	    else{
	      sendResponse({});
	    }
	    
	});
	
};

EVT.createCM =function() {
	chrome.storage.local.get(
		function(storages){
			let config =storages.search2_config;
			if(!config) config =IDATA.search2_config;
			if(!config.cmenu) {
				chrome.contextMenus.removeAll();
				return;
			}
			let favlist =storages.search2_favlist;
			if(!favlist) favlist =IDATA.search2_favlist;
			
			chrome.contextMenus.removeAll();
			chrome.contextMenus.create({
			    "title" : "Search2"
			    ,"id" : "search2cmenu"
			    ,"contexts" :["all"]
			});
	
			for(let i=0; i<favlist.length; i++) {
				if(favlist[i].on!=1 || !favlist[i].cm || favlist[i].cm!=1) continue;
				let ctxtype;
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

EVT.initCM =function() {
	if (cmstate) return;
	chrome.contextMenus.onClicked.addListener(
		function(info, tab){
			let url, params =info.menuItemId.split("_");
			let esckw, kw;
			if (info.menuItemId =="search2cmenu") chrome.tabs.sendMessage(tab.id, {action : "pop-search-box"});
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
				for(let i =0; i<favlist.length; i++) {
					if (favlist[i].cm==1 && favlist[i].type==parseInt(params[2]) && favlist[i].sno==parseInt(params[3]) && favlist[i].on==1) {
						if (!favlist[i].enc) {
							url =favlist[i].url.replace(esckw, kw);
							if (url) chrome.tabs.create({"url": url}); //window.open(url, "_blank");
						}
						else {
							EVT.encodeURL(
								function(response){
									url =favlist[i].url.replace(esckw, response.enckw);
									if (url) chrome.tabs.create({"url": url}); //window.open(url, "_blank");
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

EVT.encodeURL = function(cb, charset, str){
	let iframeId ="search2enc_iframe", formId ="search2enc_form", inputName ="search2enc_input";
	let iframe = document.getElementById(iframeId);
	if(!iframe){
		iframe = document.createElement("iframe");
		iframe.id =iframeId;
		iframe.name =iframeId;
		iframe.src ="/oth/blank.html";
		iframe.style.display ="none";
		document.documentElement.appendChild(iframe);
	}
	
	iframe.onload =function(){
		//console.log("url: " +iframe.contentWindow.location);
		let enckw =iframe.contentWindow.location.search.split("=")[1];
		cb({enckw:enckw});
		document.documentElement.removeChild(iframe);
		document.documentElement.removeChild(form);
	}
	
	let form = document.getElementById(formId);
	if(form){
		document.getElementById("search2enc_textinput").value =str;
		return form;
	}
	form = document.createElement("form");
	form.acceptCharset =charset;
	form.id =formId;
	form.method = "get";
	//form.action =chrome.runtime.getURL("/oth/blank.html");
	form.target = iframeId;
	form.style.display = "none";
	let input = document.createElement("input");
	input.id ="search2enc_textinput";
	input.type = "hidden";
	input.name = inputName;
	input.value = str;
	form.appendChild(input);
	document.documentElement.appendChild(form);
	
	return form;
};

EVT.main =function() {
	EVT.msgListener();
	EVT.createCM();
};

EVT.main();
