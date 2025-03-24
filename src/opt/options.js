/*-------------------------------------------------------------------------
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2015, wurenny@gmail.com, All rights reserved
 *
 * IDENTIFICATION
 *     opt/options.js
 *
 * This file is part of search2 project
 * options.js is used for building the option page
 *
 *-------------------------------------------------------------------------
 */


var HTML={};
var i18n ={};
var SDATA ={};
var mnw, mac;
var iconurls, icondatas, iconloaded;

SDATA.enclist =[
	"gbk","gb18030","big5","big5-hkscs","utf-16le","shift-jis","euc-jp","iso-2022-jp","euc-kr","iso-2022-kr","macintosh","koi8-r","koi8-u",
	"windows-1250","windows-1251","windows-1252","windows-1253","windows-1254","windows-1255","windows-1256","windows-1257","windows-1258",
	"iso-8859-1","iso-8859-2","iso-8859-3","iso-8859-4","iso-8859-5","iso-8859-6","iso-8859-7","iso-8859-8","iso-8859-8-i","iso-8859-9","iso-8859-10","iso-8859-11","iso-8859-13","iso-8859-14","iso-8859-15","iso-8859-16"
];

window.onload =function(){
	HTML.initI18n();
	HTML.initEncList();
	HTML.initPageData();
	HTML.initColorPane();
	HTML.initClickEvent();
	//UTIL.getFavicon2("ico","https://www.google.com/favicon.ico");
};

HTML.initI18n =function(){
	document.getElementById("__op_title").innerText=chrome.i18n.getMessage("op_title");
	document.getElementById("__op_reset").innerText=chrome.i18n.getMessage("op_reset");
	document.getElementById("__op_import").innerText=chrome.i18n.getMessage("op_import");
	document.getElementById("__op_export").innerText=chrome.i18n.getMessage("op_export");
	document.getElementById("__op_cancel").innerText=chrome.i18n.getMessage("op_cancel");
	document.getElementById("__op_save").innerText=chrome.i18n.getMessage("op_save");
	document.getElementById("__op_close").innerText="X";/*chrome.i18n.getMessage("com_close");*/
	document.getElementById("__op_config").innerText=chrome.i18n.getMessage("op_config");
	document.getElementById("__op_config_newwindow").innerText=chrome.i18n.getMessage("op_config_newwindow");
	document.getElementById("__op_config_selected").innerText=chrome.i18n.getMessage("op_config_selected");
	document.getElementById("__op_config_cmenu").innerText=chrome.i18n.getMessage("op_config_cmenu");
	document.getElementById("__op_config_autohide").innerText=chrome.i18n.getMessage("op_config_autohide");
	document.getElementById("__op_config_tiled").innerText=chrome.i18n.getMessage("op_config_tiled");
	document.getElementById("__op_config_cartoon").innerText=chrome.i18n.getMessage("op_config_cartoon");
	document.getElementById("__op_config_cartoon_rd").innerText=chrome.i18n.getMessage("op_config_cartoon_rd");
	document.getElementById("__op_config_right_indentdistance").innerText=chrome.i18n.getMessage("op_config_right_indentdistance");
	document.getElementById("__op_config_percent").innerText=chrome.i18n.getMessage("op_config_percent");
	document.getElementById("__op_config_indentdistance").innerText=chrome.i18n.getMessage("op_config_indentdistance");
	document.getElementById("__op_config_intervaldistance").innerText=chrome.i18n.getMessage("op_config_intervaldistance");
	document.getElementById("__op_config_px1").innerText=chrome.i18n.getMessage("op_config_px");
	document.getElementById("__op_config_px2").innerText=chrome.i18n.getMessage("op_config_px");
	document.getElementById("__op_config_pos").innerText=chrome.i18n.getMessage("op_config_pos");
	document.getElementById("__op_config_pos_left").innerText=chrome.i18n.getMessage("op_config_pos_left");
	document.getElementById("__op_config_pos_right").innerText=chrome.i18n.getMessage("op_config_pos_right");
	document.getElementById("__op_config_pos_top").innerText=chrome.i18n.getMessage("op_config_pos_top");
	document.getElementById("__op_config_pos_bottom").innerText=chrome.i18n.getMessage("op_config_pos_bottom");
	document.getElementById("__op_config_display").innerText=chrome.i18n.getMessage("op_config_display");
	document.getElementById("__op_config_display_auto").innerText=chrome.i18n.getMessage("op_config_display_auto");
	document.getElementById("__op_config_display_onlytype").innerText=chrome.i18n.getMessage("op_config_display_onlytype");
	document.getElementById("__op_config_display_onlyicon").innerText=chrome.i18n.getMessage("op_config_display_onlyicon");
	document.getElementById("__op_config_display_fullname").innerText=chrome.i18n.getMessage("op_config_display_fullname");
	document.getElementById("__op_config_bgcolor").innerText=chrome.i18n.getMessage("op_config_bgcolor");
	document.getElementById("__op_config_fgcolor").innerText=chrome.i18n.getMessage("op_config_fgcolor");
	document.getElementById("__op_config_bdcolor").innerText=chrome.i18n.getMessage("op_config_bdcolor");
	document.getElementById("__op_config_borderline").innerText=chrome.i18n.getMessage("op_config_borderline");
	document.getElementById("__op_search").innerText=chrome.i18n.getMessage("op_search");
	document.getElementById("__op_search_form_url").innerText=chrome.i18n.getMessage("op_search_form_url");
	document.getElementById("__op_search_form_name").innerText=chrome.i18n.getMessage("op_search_form_name");
	document.getElementById("__op_search_form_icon").innerText=chrome.i18n.getMessage("op_search_form_icon");
	document.getElementById("__op_search_form_tf").innerText=chrome.i18n.getMessage("op_search_form_tf");
	document.getElementById("__op_search_form_prkw").innerText=chrome.i18n.getMessage("op_search_form_prkw");
	document.getElementById("__op_search_form_googleico").innerText=chrome.i18n.getMessage("op_search_form_googleico");
	document.getElementById("__op_search_form_enc").innerText=chrome.i18n.getMessage("op_search_form_enc");
	document.getElementById("__op_search_form_enc_default").innerText=chrome.i18n.getMessage("op_search_form_enc_default");
	document.getElementById("__op_search_form_pathkw").innerText=chrome.i18n.getMessage("op_search_form_pathkw");
	document.getElementById("__op_search_tip1").innerText=chrome.i18n.getMessage("op_search_tip1");
	document.getElementById("__op_search_tip2").innerText=chrome.i18n.getMessage("op_search_tip2");
	document.getElementById("__op_search_add").innerText=chrome.i18n.getMessage("op_search_add");
	document.getElementById("__op_search_tip3").innerText=chrome.i18n.getMessage("op_search_tip3");
	document.getElementById("__op_search_cancel").innerText=chrome.i18n.getMessage("op_search_cancel");
	document.getElementById("__op_search_tip4").innerText=chrome.i18n.getMessage("op_search_tip4");
	
	i18n.__op_search_addcm =chrome.i18n.getMessage("op_search_addcm");
	i18n.__op_search_edit =chrome.i18n.getMessage("op_search_edit");
	i18n.__op_search_rm =chrome.i18n.getMessage("op_search_rm");
	i18n.__op_search_on =chrome.i18n.getMessage("op_search_on");
	i18n.__op_search_off =chrome.i18n.getMessage("op_search_off");
	i18n.__op_search_add =chrome.i18n.getMessage("op_search_add");
	i18n.__op_search_cancel =chrome.i18n.getMessage("op_search_cancel");
	i18n.__op_search_confirm =chrome.i18n.getMessage("op_search_confirm");
	
	i18n.__op_tip_fom_url =chrome.i18n.getMessage("op_tip_fom_url");
	i18n.__op_tip_fom_name =chrome.i18n.getMessage("op_tip_fom_name");
	i18n.__op_tip_fom_icon =chrome.i18n.getMessage("op_tip_fom_icon");
	i18n.__op_tip_fom_icon_timeout =chrome.i18n.getMessage("op_tip_fom_icon_timeout");
	i18n.__op_tip_fom_prkw =chrome.i18n.getMessage("op_tip_fom_prkw");
	i18n.__op_tip_fom_pathkw =chrome.i18n.getMessage("op_tip_fom_pathkw");
	i18n.__op_tip_save_success =chrome.i18n.getMessage("op_tip_save_success");
	i18n.__op_tip_notallow =chrome.i18n.getMessage("op_tip_notallow");
	
	i18n.__op_mtip_pos_right =chrome.i18n.getMessage("op_mtip_pos_right");
	i18n.__op_mtip_display_auto =chrome.i18n.getMessage("op_mtip_display_auto");
	i18n.__op_mtip_right_indentdistance =chrome.i18n.getMessage("op_mtip_right_indentdistance");
	i18n.__op_mtip_intervaldistance =chrome.i18n.getMessage("op_mtip_intervaldistance");
	i18n.__op_mtip_cartoon =chrome.i18n.getMessage("op_mtip_cartoon");
	i18n.__op_mtip_cartoon_rd =chrome.i18n.getMessage("op_mtip_cartoon_rd");
	i18n.__op_mtip_borderline =chrome.i18n.getMessage("op_mtip_borderline");
	i18n.__op_mtip_form_url =chrome.i18n.getMessage("op_mtip_form_url");
	i18n.__op_mtip_form_tf =chrome.i18n.getMessage("op_mtip_form_tf");
	i18n.__op_mtip_form_prkw =chrome.i18n.getMessage("op_mtip_form_prkw");
	i18n.__op_mtip_form_enc =chrome.i18n.getMessage("op_mtip_form_enc");
	i18n.__op_mtip_form_googleico =chrome.i18n.getMessage("op_mtip_form_googleico");
	i18n.__op_mtip_form_pathkw =chrome.i18n.getMessage("op_mtip_form_pathkw");
	
	document.getElementById("__oth_readme").innerText=chrome.i18n.getMessage("oth_readme");
	document.getElementById("__oth_readme1").innerText=chrome.i18n.getMessage("oth_readme1");
	document.getElementById("__oth_readme2").innerText=chrome.i18n.getMessage("oth_readme2");
	document.getElementById("__oth_readme3").innerText=chrome.i18n.getMessage("oth_readme3");
	document.getElementById("__oth_readme4").innerText=chrome.i18n.getMessage("oth_readme4");
	document.getElementById("__oth_readme5").innerText=chrome.i18n.getMessage("oth_readme5");
	document.getElementById("__oth_readme6").innerText=chrome.i18n.getMessage("oth_readme6");
	document.getElementById("__oth_ipr1").innerText=chrome.i18n.getMessage("oth_ipr1");
	document.getElementById("__oth_ipr2").innerText=chrome.i18n.getMessage("oth_ipr2");
	document.getElementById("__oth_ipr3").innerText=chrome.i18n.getMessage("oth_ipr3");
	i18n.__oth_reset_confirm =chrome.i18n.getMessage("oth_reset_confirm");
	i18n.__oth_tab_untitled =chrome.i18n.getMessage("oth_tab_untitled");
	i18n.__oth_tab_rm_confirm =chrome.i18n.getMessage("oth_tab_rm_confirm");
	i18n.__op_import_success =chrome.i18n.getMessage("op_import_success");
	i18n.__op_import_failed =chrome.i18n.getMessage("op_import_failed");
	
};

HTML.initEncList =function() {
	var o, s =document.getElementById("att_enc");
	var enclist =SDATA.enclist;
	for (var i=0; i<enclist.length; i++) {
		o =document.createElement("option");
		o.id =o.value =enclist[i];
		o.innerText =chrome.i18n.getMessage("op_search_form_enc_" +enclist[i].replace(/-/g, "_"));
		s.appendChild(o);
	}
};

HTML.initPageData =function(){
	chrome.storage.local.get(
		function(storages){
			var config =storages.search2_config;
			var favtypes =storages.search2_favtypes;
			var favlist =storages.search2_favlist;
			iconurls =storages.search2_iconurls;
			icondatas =storages.search2_icondatas;
			
			if(!config) config =IDATA.search2_config;
			if(!favtypes) favtypes =IDATA.search2_favtypes;
			if(!favlist) favlist =IDATA.search2_favlist;
			if(!iconurls) iconurls =IDATA.search2_iconurls;
			if(!icondatas) icondatas =IDATA.search2_icondatas;
			
			mnw =config.morenewwindow;
			mac =config.moreautoclose;
			cm =config.cmenu;
			favlist.sort(UTIL.searchListComperator);
			
			HTML.initIcon();
			HTML.initConfig(config);
			
			HTML.injectSearchTab(favtypes);
			
			for(i=0; i<favlist.length; i++){
				HTML.injectSearchList(favlist[i]);
				//UTIL.getFavicon(favlist[i].url1, favlist[i].icon);
			}
			
			//if (iconflush) chrome.storage.local.set({search2_icondatas : icondatas});
			document.getElementById("search_category_tab").firstChild.onmousedown();
		}
	);
};

HTML.injectSearchTab =function(favtypes) {
	var tab =document.getElementById("search_category_tab");
	var addtab =function(k, v) {
		var li =tab.insertBefore(document.createElement("li"), tab.lastChild);
		var input =li.appendChild(document.createElement("input"));
		var xdiv =li.appendChild(document.createElement("div"));
		li.id ="search_category_" + k;
		li.setAttribute("ctype", k);
		li.setAttribute("target", "search_list_" + k);
		input.setAttribute("for", "search_category_" + k);
		input.type ="text";
		input.readOnly =true;
		input.value =v;
		xdiv.innerText ="x";
		
		li.onmousedown =HTML.searchTabSelected;
		li.ondblclick =function() {
			var input =this.firstChild;
			input.style.color ="darkred";
			input.setAttribute("oname", input.value);
			input.readOnly =!input.readOnly;
			input.setSelectionRange(0, 0);
			input.focus();
		};
		
		input.onblur =function() {
			if(this.value.trim()=="") this.value =this.getAttribute("oname");
			this.style.color ="";
			this.readOnly =true;
		};
		
		xdiv.onclick =function() {
			if (document.getElementById("search_att").getAttribute("locked")) return;
			if (!confirm(i18n.__oth_tab_rm_confirm)) return;
			var searchtab =this.parentNode;
			var searchlist =document.getElementById(searchtab.getAttribute("target"));
			searchtab.parentNode.removeChild(searchtab);
			if(searchlist) searchlist.parentNode.removeChild(searchlist);
			
			var firsttab =document.getElementById("search_category_tab").firstChild;
			if (firsttab.onmousedown) firsttab.onmousedown();
		}
		return li;
	};
	
	var tabcnt =0;
	//add category
	var addli =tab.appendChild(document.createElement("li"));
	addli.id ="search_category_add";
	addli.className ="addli";
	//addli.onclick =HTML.addCategory;
	var addlabel =addli.appendChild(document.createElement("label"));
	addlabel.id ="search_category_add_label";
	addlabel.className ="addlabe";
	addlabel.innerText ="+";
	
	addli.onclick =function() {
		if (document.getElementById("search_att").getAttribute("locked")) return;
		addtab(tabcnt, i18n.__oth_tab_untitled).onmousedown();
		HTML.injectSearchList({type:tabcnt});
		tabcnt++;
	};
	
	for (tp in favtypes) {
		addtab(tp, favtypes[tp]);
		tabcnt++;
	}
	
};

HTML.injectSearchList =function(json){
	var type =json.type;
	
	var listdiv =document.getElementById("search_list");
	var div =document.getElementById("search_list_" +type);
	if (!div) {
		div =listdiv.appendChild(document.createElement("div"));
		div.id ="search_list_" + type;
		//div.className ="search_list_item";
	}
	var ul =document.getElementById("search_list_ul_" +type);
	if (!ul) {
		ul =div.appendChild(document.createElement("ul"));
		ul.id ="search_list_ul_" + type;
	}
	if(! json.name) return;

	/*for 1.0.7-->1.0.8*/
	if (! json.cm) json.cm=0;
	if (! json.enc) json.enc="";
	
	var li =document.createElement("li");
	var img =document.createElement("img");
	var inputName =document.createElement("input");
	var inputHost =document.createElement("input");
	var addcm =document.createElement("div");
	var cmCheckbox =document.createElement("input");
	var cmLabel =document.createElement("label");
	
	var span =document.createElement("span");
	var op_rm =document.createElement("label");
	var op_edit =document.createElement("label");
	var op_onoff =document.createElement("label");
	var op_down =document.createElement("img");
	var op_up =document.createElement("img");
	
	for(var name in json) li.setAttribute(name, json[name]);
	var iconurl =iconurls[json.icon];
	var icondata =icondatas[json.icon];
	li.setAttribute("iconurl",iconurl);
	img.src =icondata?icondata:"";
	inputName.value =json.name;
	inputHost.value =json.host;
	addcm.style.cssText ="display:inline-block !important; color:#4c4c4c";
	cmCheckbox.className ="search2addcmcheckbox";
	cmCheckbox.type ="checkbox";
	cmCheckbox.checked =json.cm;
	cmLabel.innerText =i18n.__op_search_addcm;
	inputName.readOnly =true;
	inputHost.readOnly =true;
	inputName.size ="15";
	inputHost.size ="45";
	addcm.appendChild(cmCheckbox);
	addcm.appendChild(cmLabel);
	
	op_rm.innerHTML =i18n.__op_search_rm;
	op_edit.innerHTML =i18n.__op_search_edit;
	op_onoff.innerHTML =(json.on==1)?i18n.__op_search_off : i18n.__op_search_on;
	op_up.src =icondatas.opup_icon;
	op_down.src =icondatas.opdown_icon;
	span.appendChild(op_edit);
	span.appendChild(op_rm);
	span.appendChild(op_onoff);
	span.appendChild(op_down);
	span.appendChild(op_up);
	
	li.appendChild(img);
	li.appendChild(inputName);
	li.appendChild(inputHost);
	li.appendChild(addcm);
	li.appendChild(span);
	ul.appendChild(li);
	for(var node in span.children) span.children[node].className ="searchListOp";
	
	inputName.onblur =function(){this.style.border ="0";this.readOnly =true;};
	inputHost.onblur =function(){this.style.border ="0";this.readOnly =true;};
	li.onclick =HTML.searchListSelected;
	cmCheckbox.onclick =HTML.searchListAcm;
	op_edit.onclick =HTML.searchListEdit;
	op_rm.onclick =HTML.searchListRm;
	op_onoff.onclick =HTML.searchListOnoff;
	op_down.onclick =HTML.searchListDown;
	op_up.onclick =HTML.searchListUp;
		
	return li;
};

HTML.searchTabSelected =function(){
	var search_att =document.getElementById("search_att");
	if(search_att.getAttribute("locked")) return;
	search_att.setAttribute("ctype",this.getAttribute("ctype"));
	var target =this.getAttribute("target");
	search_att.setAttribute("listname", target);
	this.style.backgroundColor ="#bcd2e6";
	var lists =this.parentNode.children;
	
	for (var i =0; i<lists.length; i++) {
		if (lists[i]!=this) lists[i].style.backgroundColor ="";
	}
	
	var searchListItems =document.getElementById("search_list").childNodes;
	for(var k=0; k<searchListItems.length; k++){
		var searchItem =searchListItems[k];
		searchItem.id==target?(searchItem.style.setProperty("display","block")):(searchItem.style.setProperty("display","none"));
	}
		
};

HTML.searchListSelected =function(){
	if(document.getElementById("search_att").getAttribute("locked")) return;
	this.style.backgroundColor ="#e2e2e2";
	var lists =this.parentNode.children;
	for (var i =0; i<lists.length; i++) {
		if (lists[i]!=this) lists[i].style.backgroundColor ="";
	}
	
	var  att_url =document.getElementById("att_url");
	var  att_name =document.getElementById("att_name");
	var  att_icon =document.getElementById("att_icon");
	var  att_tf =document.getElementById("att_tf");
	var  att_prkw =document.getElementById("att_prkw");
	var  att_enc_option =document.getElementById(this.getAttribute("enc"));
	var  googleico =document.getElementById("googleico");
	var  pathkw =document.getElementById("pathkw");
	
	var url =this.getAttribute("url");
	att_url.value =url;
	att_name.value =this.getAttribute("name");
	att_icon.value =this.getAttribute("iconurl");
	att_tf.value =this.getAttribute("urltf");
	var prkw =this.getAttribute("prkw");
	att_prkw.value =prkw;
	if (att_enc_option) att_enc_option.selected =true;
	else document.getElementById("__op_search_form_enc_default").selected =true;
	document.getElementById("att_enc").style.color ="#4C4C4C";
	googleico.checked =(url.indexOf("https://www.google.com/s2/favicons?domain=")>-1);
	pathkw.checked =(prkw.substr(-1) !="=");
	
};

HTML.searchListAcm =function() {
	this.parentNode.parentNode.setAttribute("cm", this.checked?1:0);
	
};

HTML.searchListUp =function(){
	if(document.getElementById("search_att").getAttribute("locked")) return;
	var curLi =this.parentNode.parentNode;
	var ul =curLi.parentNode;
	var firstLi =ul.firstChild;
	var preLi;
	if(curLi !=firstLi){
		preLi =curLi.previousSibling
		ul.insertBefore(curLi,preLi);
		/**
		var preSno =preLi.getAttribute("sno");
		var curSno =curLi.getAttribute("sno");
		preLi.setAttribute("sno",curSno);
		curLi.setAttribute("sno",preSno);
		**/
	}
};

HTML.searchListDown =function(){
	if(document.getElementById("search_att").getAttribute("locked")) return;
	var curLi =this.parentNode.parentNode;
	var ul =curLi.parentNode;
	var lastLi =ul.lastChild;
	var nextLi;
	if(curLi !=lastLi){
		nextLi =curLi.nextSibling;
		ul.insertBefore(nextLi,curLi);
		/**
		var curSno =curLi.getAttribute("sno");
		var nextSno =nextLi.getAttribute("sno");
		curLi.setAttribute("sno",nextSno);
		nextLi.setAttribute("sno",curSno);
		**/
	}
};

HTML.searchListOnoff =function(){
	if(document.getElementById("search_att").getAttribute("locked")) return;
	var curLi =this.parentNode.parentNode;
	curLi.setAttribute("on",Math.abs(curLi.getAttribute("on")-1));
	this.innerHTML =((curLi.getAttribute("on")==1)?i18n.__op_search_off : i18n.__op_search_on);
};

HTML.searchListRm =function(){
	if(document.getElementById("search_att").getAttribute("locked")) return;
	var curLi =this.parentNode.parentNode;
	var icon =curLi.getAttribute("icon");
	curLi.onclick =null;
	curLi.parentNode.removeChild(curLi);
	
	var used, lists =document.getElementById("search_list").getElementsByTagName("li");
	for(var i=0; i<lists.length; i++) {
		if(lists[i].getAttribute("icon") ==icon) {
			used =true;
			break;
		}
	}
	if(!used) delete icondatas[icon];
};

HTML.searchListEdit =function(){
	if (this.innerHTML ==i18n.__op_search_edit) {
		if(document.getElementById("search_att").getAttribute("locked")) return;
		this.parentNode.parentNode.click();
		this.id ="current_edit";
		this.innerHTML =i18n.__op_search_confirm;
		this.style.color ="red";
		this.style.backgroundColor ="#4C4C4C";
		HTML.searchAttEditable("y");
	}
	else {
		HTML.searchListConfirm("edit",this);
	}
};

HTML.searchListAdd =function(){
	var e =this;
	var search_att =document.getElementById("search_att");
	if (e.innerHTML ==i18n.__op_search_add) {
		if(search_att.getAttribute("locked")) return;
		e.parentNode.parentNode.click();
		e.innerHTML =i18n.__op_search_confirm;
		e.style.color ="red";
		e.style.backgroundColor ="blue";
		HTML.searchAttEditable("y");
	}
	else {
		HTML.searchListConfirm("add",e);
	}
};

HTML.searchListConfirm =function(type, e) {
	var att_url =document.getElementById("att_url").value;
	var att_name=document.getElementById("att_name").value;
	var att_icon =document.getElementById("att_icon").value;
	var att_prkw =document.getElementById("att_prkw").value;
	var att_enc=document.getElementById("att_enc").value;
	var att_tf =document.getElementById("att_tf").value;
	var pathkw =document.getElementById("pathkw").checked;
	//validate
	if ((att_url.indexOf("%s")==-1 && att_url.indexOf("%p")==-1) || !UTIL.validateURL(att_url)) {
		HTML.showTip(i18n.__op_tip_fom_url);
		return;
	}
	if (!att_name || !att_name.trim()) {
		HTML.showTip(i18n.__op_tip_fom_name);
		return;
	}
	if (!UTIL.validateURL(att_icon)) {
		HTML.showTip(i18n.__op_tip_fom_icon);
		return;
	}
	if (!att_prkw || !att_prkw.trim() || att_url.indexOf(att_prkw)==-1 || (!pathkw && att_prkw.substr(-1)!="=")) {
		HTML.showTip(i18n.__op_tip_fom_prkw);
		return;
	}
	if (pathkw && att_prkw.substr(-1)=="=") {
		HTML.showTip(i18n.__op_tip_fom_pathkw);
		return;
	}
	
	//build json data
	var  json ={};
	json.on =1;
	json.type =parseInt(search_att.getAttribute("ctype"));
	json.name =att_name;
	json.prkw =att_prkw;
	json.urltf =att_tf;
	json.url =att_url;
	json.enc =att_enc;
	json.host =att_url.split("/")[2];
	json.icon =json.host.replace(/\./g, "_");
	
	var foricon =document.getElementById("foricon");
	var img =foricon.appendChild(document.createElement("img"));
	json.iconurl =iconurls[json.icon] =img.src =att_icon;
	
	/*if get icon timeout*/
	iconloaded =false;
	//icoevt =setTimeout("if(!iconloaded) {HTML.showTip(i18n.__op_tip_fom_icon_timeout, 4000);foricon.innerHTML='';}clearTimeout(icoevt);", 5000);
	setTimeout(() => {
		if(!iconloaded) {
			HTML.showTip(i18n.__op_tip_fom_icon_timeout, 4000);
			foricon.innerHTML='';
		}
	}, 5000);
	
	img.onload =function() {
		iconloaded =true;
		var li, icondata =icondatas[json.icon] =UTIL.getFavicon(img);
		if (type=="edit") {
			li =e.parentNode.parentNode;
			li.childNodes[0].src =icondata;
			for (var name in json) li.setAttribute(name, json[name]);
			li.getElementsByTagName("input")[0].value =json.name;
			li.getElementsByTagName("input")[1].value =json.host;
			e.id ="";
			e.innerHTML =i18n.__op_search_edit;
			e.style.color ="#388F73";
			
		}
		else if (type=="add") {
			li =HTML.injectSearchList(json);
			e.innerHTML =i18n.__op_search_add;
			e.style.color ="#FFA500";
		}
		e.style.backgroundColor ="";
		HTML.searchAttEditable("n");
		if (type=="edit") li.click();
		foricon.innerHTML ="";
	}
};

HTML.searchAttEditable =function(flag) {
	var search_att =document.getElementById("search_att");
	var form =search_att.getElementsByTagName("input");
	var att_enc =document.getElementById("att_enc");
	switch (flag) {
	case "y" :
		search_att.setAttribute("locked","locked");
		for(i =0; i<form.length; i++) {
			form[i].removeAttribute("disabled");
			//form[i].style.border ="1px solid #31B2B8";
		}
		att_enc.removeAttribute("disabled");
		att_enc.style.background ="transparent";
		att_enc.style.color ="#4C4C4C";
		break;
	case "n" :
		search_att.removeAttribute("locked");
		for(i =0; i<form.length; i++)	form[i].disabled ="disabled";
		att_enc.disabled ="disabled";
		att_enc.style.color =att_enc.style.background ="#EBEBE4";
		break;
	case "c" :
		search_att.removeAttribute("locked");
		for(i =0; i<form.length; i++)	{
			form[i].disabled ="disabled";
			if (form[i].type =="text") form[i].value ="";
			if (form[i].type =="checkbox") form[i].checked =false;
		}
		att_enc.disabled ="disabled";
		att_enc.style.color =att_enc.style.background ="#EBEBE4";
		document.getElementById("__op_search_form_enc_default").selected =true;
		break;
	}
};

HTML.initClickEvent =function(){
	var resetbtn =document.getElementById("__op_reset");
	var importbtn =document.getElementById("__op_import");
	var exportbtn =document.getElementById("__op_export");
	var savebtn =document.getElementById("__op_save");
	var cancelbtn =document.getElementById("__op_cancel");
	var closeoption =document.getElementById("__op_close");
	var searchlisttiled =document.getElementById("searchlisttiled");
	var searchpositions =document.getElementsByName("searchposition");
	var right_indentdistance =document.getElementById("right_indentdistance");
	var indentdistance =document.getElementById("indentdistance");
	var intervaldistance =document.getElementById("intervaldistance");
	var bgcolor_div =document.getElementById("bgcolor_div");
	var bgcolor =document.getElementById("bgcolor");
	var fgcolor_div =document.getElementById("fgcolor_div");
	var fgcolor =document.getElementById("fgcolor");
	var bdcolor_div =document.getElementById("bdcolor_div");
	var bdcolor =document.getElementById("bdcolor");
	
	var addsearch =document.getElementById("__op_search_add");
	var cancelop =document.getElementById("__op_search_cancel");
	var googleico =document.getElementById("googleico");
	var searchposition_right_tip =document.getElementById("searchposition_right_tip");
	var searchname_auto_tip =document.getElementById("searchname_auto_tip");
	var right_indentdistance_tip =document.getElementById("right_indentdistance_tip");
	var intervaldistance_tip =document.getElementById("intervaldistance_tip");
	var att_url_tip =document.getElementById("att_url_tip");
	var att_tf_tip =document.getElementById("att_tf_tip");
	var att_prkw_tip =document.getElementById("att_prkw_tip");
	var att_enc_tip =document.getElementById("att_enc_tip");
	var googleico_tip =document.getElementById("googleico_tip");
	var pathkw_tip =document.getElementById("pathkw_tip");
	var morecartoon_tip =document.getElementById("morecartoon_tip");
	var morecartoonrandom_tip =document.getElementById("morecartoonrandom_tip");
	var borderline_tip =document.getElementById("borderline_tip");
	var colorpane =document.getElementById("colorpane");
	var colorpane_close =document.getElementById("colorpane_close");
		
	resetbtn.onclick =HTML.resetOption;
	importbtn.onclick =HTML.importOption;
	exportbtn.onclick =HTML.exportOption;
	savebtn.onclick =HTML.saveOption;
	cancelbtn.onclick =HTML.cancelOption;
	closeoption.onclick =HTML.closeOption;
	bgcolor_div.onclick =fgcolor_div.onclick =bdcolor_div.onclick =function(){HTML.showColorPane(this)};
	bgcolor.ondblclick =fgcolor.ondblclick =bdcolor.ondblclick =function(){HTML.colorInputOnDblck(this)};
	bgcolor.onblur =fgcolor.onblur =bdcolor.onblur =function(){HTML.colorInputOnblur(this)};
	
	searchlisttiled.onclick =HTML.searchListtiled;
	for (var i=0; i<searchpositions.length; i++) searchpositions[i].onclick =HTML.searchPositionRight;
	right_indentdistance.onkeyup =function(){UTIL.onlyNumInput(this, 5, 50)};
	indentdistance.onkeyup =function(){UTIL.onlyNumInput(this, 5, 500)};
	intervaldistance.onkeyup =function(){UTIL.onlyNumInput(this, 5, 200)};
	addsearch.onclick =HTML.searchListAdd;
	cancelop.onclick =HTML.cancelOp;
	googleico.onclick =HTML.googleIco;
	searchposition_right_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_pos_right,6000)};
	searchname_auto_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_display_auto,4000)};
	right_indentdistance_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_right_indentdistance,2000)};
	intervaldistance_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_intervaldistance,3000)};
	morecartoon_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_cartoon,3000)};
	morecartoonrandom_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_cartoon_rd,3000)};
	borderline_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_borderline,3000)};
	att_url_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_form_url,3000)};
	att_tf_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_form_tf,8000)};
	att_prkw_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_form_prkw,6000)};
	att_enc_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_form_enc,4000)};
	googleico_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_form_googleico,8000)};
	pathkw_tip.onclick =function(){HTML.showMiniTip(this,i18n.__op_mtip_form_pathkw,8000)};
	colorpane.onblur =colorpane_close.onclick =HTML.closeColorPane;
	
	var colortable =document.getElementById('colortable').getElementsByTagName("td");
	for(var i=0;i<colortable.length;i++) colortable[i].onclick =function(){HTML.changeColor(this.style.background)};
};

HTML.closeOption =function() {
	if(document.getElementById("search_att").getAttribute("locked")) {
		HTML.showTip(i18n.__op_tip_notallow);
		return;
	}
	window.close();
};

HTML.resetOption =function() {
	if(document.getElementById("search_att").getAttribute("locked")) {
		HTML.showTip(i18n.__op_tip_notallow);
		return;
	}
	if (!confirm(i18n.__oth_reset_confirm)) return;
	chrome.storage.local.remove(
		[
			"search2_config",
			"search2_favtypes",
			"search2_favlist",
			"search2_iconurls",
			"search2_icondatas",
			"search2_nohslist"
		]
	);
	document.location.reload();
};

HTML.cancelOption =function() {
	if(document.getElementById("search_att").getAttribute("locked")) {
		HTML.showTip(i18n.__op_tip_notallow);
		return;
	}
	document.location.reload();
};

HTML.saveOption =function(){
	if(document.getElementById("search_att").getAttribute("locked")) {
		HTML.showTip(i18n.__op_tip_notallow);
		return;
	}
	
	var config =HTML.getConfig();
	
	var searchTabUl =document.getElementById("search_category_tab");
	var searchTabs =searchTabUl.getElementsByTagName("li");
	var favtypes ={};
	for(var i=0; i<searchTabs.length-1; i++) {
		favtypes[parseInt(searchTabs[i].getAttribute("ctype"))] =searchTabs[i].firstChild.value;
	}
		
	var searchListDiv =document.getElementById("search_list");
	var searchList =searchListDiv.getElementsByTagName("li");
	var favlist =[], nohslist =[];
	
	for(var i=0; i<searchList.length; i++){
		var listItem =searchList[i];
		var fields =listItem.attributes;
		var json ={};
		for(var k=0; k<fields.length; k++){
			var key =fields[k].name;
			var value =fields[k].value;
			if (key=="on" || key=="type" || key=="cm" || key=="name" || key=="host" || key=="icon" || key=="enc" || key=="prkw" || key=="urltf" || key=="url") 
				json[key] =value;
			if(key=="prkw" && value.substr(-1) !="=") nohslist.push(listItem.getAttribute("host"));
			json.sno =i+1;
		}
		json.type =parseInt(json.type);
		json.on =parseInt(json.on);
		json.cm =parseInt(json.cm);
		favlist[i] =json;
	}
	//console.log(favtypes);
	//console.log(favlist);
	//console.log(nohslist);
	
	chrome.storage.local.set(
		{
			search2_config : config,
			search2_favtypes : favtypes,
			search2_favlist : favlist,
			search2_iconurls : iconurls,
			search2_icondatas : icondatas,
			search2_nohslist : nohslist
		}
	);
	
	if (!config.cmenu) chrome.contextMenus.removeAll();
	else chrome.runtime.sendMessage({action: "search2createcm"});
		
	HTML.showTip(i18n.__op_tip_save_success);
};

HTML.initConfig =function(config) {
	document.getElementById("newwindow").checked =config.newwindow;
	document.getElementById("searchselected").checked =config.searchselected;
	document.getElementById("cmenu").checked =config.cmenu;
	document.getElementById("autohide").checked =config.autohide;
	document.getElementById("searchlisttiled").checked =config.searchlisttiled;
	document.getElementById("morecartoon").checked =config.morecartoon;
	document.getElementById("morecartoonrandom").checked =config.morecartoonrandom;
	document.getElementById("indentdistance").value =config.indentdistance;
	document.getElementById("borderline").checked =config.borderline;
	document.getElementById("bgcolor_div").style.background =document.getElementById("bgcolor").value =config.bgcolor.toUpperCase();
	document.getElementById("fgcolor_div").style.background =document.getElementById("fgcolor").value =config.fgcolor.toUpperCase();
	document.getElementById("bdcolor_div").style.background =document.getElementById("bdcolor").value =config.bdcolor.toUpperCase();
	
	var intervaldistance =document.getElementById("intervaldistance");
	intervaldistance.value =config.intervaldistance;
	intervaldistance.disabled =config.searchlisttiled;
	
	var right_indentdistance =document.getElementById("right_indentdistance");
	right_indentdistance.value =config.rightindentdistance?config.rightindentdistance:5;
	right_indentdistance.disabled =!(config.searchposition=="right");
	
	var searchposition =document.getElementsByName("searchposition");
	var searchnamedisplay =document.getElementsByName("searchnamedisplay");
	for (var i=0; i<searchposition.length; i++) if (config.searchposition==searchposition[i].value) searchposition[i].checked =true;
	for (var i=0; i<searchnamedisplay.length; i++) if (config.searchnamedisplay==searchnamedisplay[i].value) searchnamedisplay[i].checked =true;
};

HTML.getConfig =function() {
	var config ={};
	config.newwindow =document.getElementById("newwindow").checked ? 1 : 0;
	config.searchselected =document.getElementById("searchselected").checked ? 1 : 0;
	config.cmenu =document.getElementById("cmenu").checked ? 1 : 0;
	config.autohide =document.getElementById("autohide").checked ? 1 : 0;
	config.searchlisttiled =document.getElementById("searchlisttiled").checked ? 1 : 0;
	config.morecartoon =document.getElementById("morecartoon").checked ? 1 : 0;
	config.morecartoonrandom =document.getElementById("morecartoonrandom").checked ? 1 : 0;
	config.rightindentdistance =document.getElementById("right_indentdistance").value;
	config.indentdistance =document.getElementById("indentdistance").value +"";
	config.intervaldistance =document.getElementById("intervaldistance").value +"";
	config.borderline =document.getElementById("borderline").checked ? 1 : 0;
	
	config.bgcolor =HTML.getInputColor(document.getElementById("bgcolor"));
	config.fgcolor =HTML.getInputColor(document.getElementById("fgcolor"));
	config.bdcolor =HTML.getInputColor(document.getElementById("bdcolor"));
	var searchposition =document.getElementsByName("searchposition");
	var searchnamedisplay =document.getElementsByName("searchnamedisplay");
	for (var i=0; i<searchposition.length; i++) if (searchposition[i].checked) config.searchposition =searchposition[i].value +"";
	for (var i=0; i<searchnamedisplay.length; i++) if (searchnamedisplay[i].checked) config.searchnamedisplay =searchnamedisplay[i].value +"";
	config.morenewwindow =mnw;
	config.moreautoclose =mac;
	return config;
};

HTML.searchListtiled =function() {
	var intervaldistance =document.getElementById("intervaldistance").disabled =this.checked;
};

HTML.searchPositionRight =function() {
	document.getElementById("right_indentdistance").disabled =!(this.value=="right")
};

HTML.initIcon =function() {
	var mt =document.getElementsByName("minitipicon");
	for (var i=0; i<mt.length; i++) mt[i].src =icondatas.minitip_icon;
	document.getElementById("tipimgup").src=icondatas.opup_icon;
	document.getElementById("tipimgdown").src=icondatas.opdown_icon;
	document.getElementById("configicon").src=icondatas.search2_icon32;
	//document.getElementById("moreicon").src=icondatas.more_icon;
};

HTML.cancelOp =function() {
	var current_edit =document.getElementById("current_edit");
	if (current_edit) {
		current_edit.innerHTML =i18n.__op_search_edit;
		current_edit.style.color ="#388F73";
		current_edit.style.backgroundColor ="";
		current_edit.id ="";
	}
	var addsearch =document.getElementById("__op_search_add");
	if (addsearch.innerHTML !=i18n.__op_search_add)  
	{
		addsearch.innerHTML =i18n.__op_search_add;
		addsearch.style.color ="#FFA500";
		addsearch.style.backgroundColor ="";
	}
	HTML.searchAttEditable("c");
	
};

HTML.googleIco =function() {
	if(!document.getElementById("search_att").getAttribute("locked")) return;
	var att_icon =document.getElementById("att_icon");
	if (this.checked) {
		att_icon.setAttribute("oico", att_icon.value);
		var att_url =document.getElementById("att_url").value;
		att_icon.value ="https://www.google.com/s2/favicons?domain=" +att_url.split("/")[2];
	}
	else {
		att_icon.value =att_icon.getAttribute("oico");
	}
};

HTML.showTip =function(msg, sec) {
	var tip =document.getElementById("tip");
	tip.innerText =msg;
	tip.style.display ="block";
	tip.style.marginLeft =(tip.parentNode.getBoundingClientRect().width -tip.getBoundingClientRect().width) /2 +"px";
	//evt =setTimeout("tip.style.display ='none';tip.innerText='';clearTimeout(evt);", (sec?sec:2000));
	setTimeout(() => {tip.style.display ='none';tip.innerText='';}, 1000);
};

HTML.showMiniTip =function(e, msg, sec) {
	if(typeof evt !="undefined") clearTimeout(evt);
	var tip =document.getElementById("minitip");
	var tiptxt =document.getElementById("minitiptxt");
	var x,y;
	var rect =e.getBoundingClientRect();
	if (rect) { /*client rect is not correct sometime*/
		//console.log("browser support rect.");
		x =rect.left;
		y =rect.top +rect.height;
	}
	else {
		//console.log("browser not support rect.");
		x = e.offsetLeft;
		y = e.offsetTop;
		var current = e.offsetParent;
		while (current !== null) {
			x += current.offsetLeft;
			y += current.offsetTop;
			current = current.offsetParent;
		}
		y =y +e.offsetHeight;
	}
	//console.log(x +"," +y);
	tip.style.left =(x -30)<0?0:(x-30)+"px";
	tip.style.top =y +5 +"px";
	tiptxt.innerText =msg;
	tip.style.display ="block";
	//evt =setTimeout("minitip.style.display ='none';minitiptxt.innerText='';clearTimeout(evt);", (sec?sec:2000));
	setTimeout(() => {minitip.style.display ='none';minitiptxt.innerText='';}, 1000);
};

HTML.exportOption =function(){
	if(document.getElementById("search_att").getAttribute("locked")) {
		HTML.showTip(i18n.__op_tip_notallow);
		return;
	}
	chrome.storage.local.get(
		function(storages){
			if(!storages.search2_config) storages =IDATA;
			else if(!storages.search2_favtypes) {
				IDATA.search2_config =storages.search2_config;
				storages =IDATA;
			}
			UTIL.fileSaveAs(UTIL.option2str(storages,""),"search2-config.bak");
		}
	)
};

HTML.importOption =function(){
	var file =document.getElementById("importfile");
	file.onchange =function(){
		var tscript =document.body.appendChild(document.createElement("script"));
		var url =URL.createObjectURL(file.files[0]);
		tscript.src =url;
		tscript.onload =function(){
			var need_reload =false;
			if(typeof BAKDATA =="undefined") alert(i18n.__op_import_failed);
			else if(typeof BAKDATA.search2_config =="undefined" || typeof BAKDATA.search2_favtypes =="undefined"
							|| typeof BAKDATA.search2_favlist =="undefined" || typeof BAKDATA.search2_iconurls =="undefined"
							|| typeof BAKDATA.search2_icondatas =="undefined" || typeof BAKDATA.search2_nohslist =="undefined"
							) alert(i18n.__op_import_failed);
			else{
				chrome.storage.local.remove(
					[
						"search2_config",
						"search2_favtypes",
						"search2_favlist",
						"search2_iconurls",
						"search2_icondatas",
						"search2_nohslist"
					]
				);
				chrome.storage.local.set(
					{
						search2_config : BAKDATA.search2_config,
						search2_favtypes : BAKDATA.search2_favtypes,
						search2_favlist : BAKDATA.search2_favlist,
						search2_iconurls : BAKDATA.search2_iconurls,
						search2_icondatas : BAKDATA.search2_icondatas,
						search2_nohslist : BAKDATA.search2_nohslist
					}
				);
				need_reload =true;
				alert(i18n.__op_import_success);
			}
			if(!need_reload) return;
			file.value ="";
			URL.revokeObjectURL(url);
			document.body.removeChild(tscript);
			if(need_reload) document.location.reload();
		};
	};
	file.click();
};

HTML.initColorPane =function(){
	var ColorHex=new Array('00','33','66','99','CC','FF');
	var SpColorHex=new Array('FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF');
	var current=null;
	var colorTable='<table border="0" cellspacing="0" cellpadding="0" '
		+'style="border:1px #000000 solid;border-bottom:none;border-collapse:collapse;width:274px;" bordercolor="000000">'
		+'<tr height=20>'
		//+'<td><input disabled="true" type="input" id="vcolor" style="boder:0;background-color:transparent;outline:none"/></td>'
		+'<td colspan=6 bgcolor=#ffffff style="font:12px tahoma;padding-left:2px;">'
		+'<span id="colorpane_close" style="float:right;padding-right:3px;cursor:pointer;">×关闭</span>'
		+'</td>'+
		'</table>';
	colorTable +='<table id="colortable" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000" style="cursor:pointer;">';
	for (i=0;i<2;i++){
	  for (j=0;j<6;j++){
	    colorTable=colorTable+'<tr height=12>';
	    colorTable=colorTable+'<td width="12" style="background:#000000">';
	    if (i==0){
	      colorTable=colorTable+'<td width="12" style="cursor:pointer;background:#'+ColorHex[j]+ColorHex[j]+ColorHex[j]+'">';
	    }else{
	      colorTable=colorTable+'<td width="12" style="cursor:pointer;background:#'+SpColorHex[j]+'">';
	    }
	    colorTable=colorTable+'<td width="12" style="background:#000000">';
	    for (k=0;k<3;k++){ 
        for (l=0;l<6;l++){
          colorTable=colorTable+'<td width="12" style="cursor:pointer;background:#'+ColorHex[k+i*3]+ColorHex[l]+ColorHex[j]+'">';
        }
	    }
	  }
	}
	colorTable +='</table>';
	var colorpane =document.getElementById("colorpane");
	colorpane.style.display ="none";
	colorpane.innerHTML =colorTable;
};

HTML.showColorPane =function(e){
	var colorpane =document.getElementById("colorpane");
	if(colorpane.style.display !="none") return;
	colorpane_target =e;
	var x,y;
	var rect =e.getBoundingClientRect();
	if (rect) {
		x =rect.left;
		y =rect.top +rect.height;
	}
	else {
		x = e.offsetLeft;
		y = e.offsetTop;
		var current = e.offsetParent;
		while (current !== null) {
			x += current.offsetLeft;
			y += current.offsetTop;
			current = current.offsetParent;
		}
		y +=e.offsetHeight;
	}
	colorpane.style.left =x +"px";
	colorpane.style.top =y +2 +"px";
	colorpane.style.display ="block";
	colorpane.focus();
};

HTML.closeColorPane =function(){
	document.getElementById("colorpane").style.display="none";
};

HTML.changeColor =function(color){
	colorpane_target.style.background =color;
	document.getElementById(colorpane_target.getAttribute("input")).value=color.colorHex();
};

HTML.colorInputOnDblck =function(e){
	e.setAttribute("lastvalue",e.value.toUpperCase());
	e.removeAttribute("readonly");
};

HTML.colorInputOnblur =function(e){
	e.value =e.value.isColorHex() ? e.value.toUpperCase() : e.getAttribute("lastvalue");
	e.setAttribute("readonly","true");
	document.getElementById(e.getAttribute("div")).style.background=e.value;
};

HTML.getInputColor =function(e){
	return e.value.isColorHex() ? e.value.toUpperCase() : e.getAttribute("lastvalue");
};
