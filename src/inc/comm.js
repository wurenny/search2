/*-------------------------------------------------------------------------
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2015, wurenny@gmail.com, All rights reserved
 *
 * IDENTIFICATION
 *     inc/comm.js
 *
 * This file is part of search2 project
 * comm is the commonly used for any other invoker, including some prototype
 * functions and small tools
 *
 *-------------------------------------------------------------------------
 */


var COM={};
var config, favtypes, favlist, iconurls, icondatas, nohslist;

HTMLElement.prototype.domove =function() {
	var moveobj =this;
	var evt = arguments.callee.caller.arguments[0];
	var moveX = evt.clientX;
	var moveY = evt.clientY;
	var moveTop = parseInt(moveobj.style.top);
	var moveLeft = parseInt(moveobj.style.left);
	var objwidth =parseInt(moveobj.style.width);
	var objheight =parseInt(moveobj.style.height);
	var maxwidth = document.documentElement.clientWidth; 
	var maxheight = document.documentElement.clientHeight;
	if (!objwidth) objwidth =64;
	if (!objheight) objheight =32;
	
	window.onmousedown =function(){return false};
	
	window.onmousemove =function() {
		var evt = arguments[0];
		var x = moveLeft + evt.clientX - moveX;
		var y = moveTop + evt.clientY - moveY;
		if ( x + objwidth - 64 > 0 &&( x + 64 < maxwidth) && y > 0 && (y + 32 < maxheight) ) {
			moveobj.style.left = x + "px";
			moveobj.style.top = y + "px";
		}
	};
	
	window.onmouseup =function () {
		window.onmousedown =undefined;
		window.onmousemove =undefined;
		window.onmouseup =undefined;
	};
};

HTMLElement.prototype.dopopup =function(width, height, vector, rotate, cartoon){
	/*caller*/
	var e =this;
	//var f =e.getElementsByTagName("iframe")[0];
	var vt =vector ? vector.replace("->", "") : "CE";
	
	/*for velocity of setp margin: while CE=2X else 1X*/
	var divisor =(vt=="CE" ? 2 : 1);
	
	/*window size*/
	doch =document.documentElement.clientHeight;
	docw =document.documentElement.clientWidth;
	
	/*step*/
	var stepW =2.5 * favrect.rectw, stepH =2 * favrect.recth;
	var n =2;
	var stepD =n * 360 * stepW / width;
	var stepT =doch / 5 *stepW / width;
	var radius =Math.max(width, height);
	var stepR =Math.max(stepW, stepH);
	var baseW =stepW>stepH ? 1 : 0;
	
	/*interval event*/
	var itv;
	
	/*init position*/
	var init =function(){
		if (!width || !height) return false;
		if (!e.style.left || cartoon) e.style.left ="0px"; 
		if (!e.style.top || cartoon) e.style.top ="0px";
		if (!e.style.width) e.style.width ="0px";
		if (!e.style.height) e.style.height ="0px";
		if (!e.style.borderRadius) e.style.borderRadius ="0px";
		if (!e.style.webkitTransform) e.style.webkitTransform ="rotate(0deg)";
		return true;
	};
	
	/*parabla function*/
	var Fparabola =function(yn) {
		var k =yn=='Y' ? 1 : -1;
		var y =parseFloat(e.style.top)+stepT*k;
		e.style.top =y +"px";
		e.style.left =(Math.pow(y,2)/10 - doch/50*y) *k +docw /2 -width +"px";
	};
	
	/*recover shape position rotate*/
	var cls =function(){
		e.style.width =e.style.height =e.style.marginLeft =e.style.marginTop ="0px";
		e.style.left =e.getAttribute("l");
		e.style.top =e.getAttribute("t");
		e.style.borderRadius =e.getAttribute("r");
		e.style.webkitTransform ="rotate(0deg)";
		e.style.display="none";
		clearInterval(itv);
	};
	
	/*alter shape position rotate*/
	var aspr =function(yn) {
		var w =parseInt(e.style.width);
		var h =parseInt(e.style.height);
		switch (yn) {
			case "Y" :
				if(w<width || h<height) {
					if (w<width) {
						if(vt != "TB" && vt != "BT") e.style.width =(w+stepW) +"px";
						if (vt=="CE" || vt=="RL" || vt=="TL" || vt=="BL") e.style.marginLeft =parseInt(e.style.marginLeft) -stepW/divisor +"px";
					}
					if (h<height) {
						if (vt != "LR" && vt != "RL") {e.style.height =(h+stepH) +"px";}
						if (vt=="CE" || vt=="BT" || vt=="BR" || vt=="BL") e.style.marginTop =parseInt(e.style.marginTop) -stepH/divisor +"px";
					}
					if (rotate && vt != "TB" && vt != "BT" & vt != "LR" && vt != "RL") {
						e.style.webkitTransform ="rotate(" +(parseFloat(e.style.webkitTransform.match("[0-9]+(.{1}[0-9]+)?")[0])+stepD) +"deg)";
						e.style.borderRadius =(radius -(baseW?w:h)-stepR) +"px";
					}
					if (cartoon) Fparabola("Y");
				}
				else {
					e.style.borderRadius =e.getAttribute("r");
					e.style.webkitTransform ="rotate(" +(n*360) +"deg)";
					clearInterval(itv);
					document.getElementById("search2_more_searchInput").focus();
				}
			break;
			case "N" :
				if(w>=stepW || h>=stepH) {
					if (w>=stepW) {
						if (vt != "TB" && vt != "BT") {
							e.style.width =(w-stepW) +"px";
							if (vt=="CE" || vt=="RL" || vt=="TL" || vt=="BL") e.style.marginLeft =parseInt(e.style.marginLeft) +stepW/divisor +"px";
						}
						else if (h<stepH) {cls(); return;}
					}
					if (h>=stepH) {
						if (vt != "LR" && vt != "RL") {
							e.style.height =(h-stepH) +"px";
							if (vt=="CE" || vt=="BT" || vt=="BR" || vt=="BL") e.style.marginTop =parseInt(e.style.marginTop) +stepH/divisor +"px";
						}
						else if (w<stepW) {cls(); return;}
					}
					if (rotate && vt != "TB" && vt != "BT" && vt != "LR" && vt != "RL") {
						e.style.webkitTransform ="rotate(" +(parseFloat(e.style.webkitTransform.match("[0-9]+(.{1}[0-9]+)?")[0])-stepD) +"deg)";
						e.style.borderRadius =((baseW?w:h)-stepR) +"px";
					}
					if (cartoon) Fparabola("N");
				}
				else cls();
			break;
		}
	};
	
	if (!init()) return;
	if (e.style.width=="0px" && e.style.height=="0px"){
		if (vt=="TB" || vt=="BT") e.style.width=width +"px";
		if (vt=="LR" || vt=="RL") e.style.height =height +"px";
		if (vt=="CE" || vt=="RL" || vt=="TL" || vt=="BL") e.style.marginLeft =width/divisor +"px";
		if (vt=="CE" || vt=="BT" || vt=="BR" || vt=="BL") e.style.marginTop =height/divisor +"px";
		e.setAttribute("l", e.style.left);
		e.setAttribute("t", e.style.top);
		e.setAttribute("r", e.style.borderRadius);
		if (cartoon) e.style.top ="0px";
		e.style.display="block";
		itv=setInterval(function(){aspr("Y")}, 2);
	}
	else {
		itv=setInterval(function(){aspr("N")}, 2);
	}
	
};

Array.prototype.containOf =function(e){
	if(this.constructor!=Array) return;
	for(var i =0; i<this.length; i++) if(e ==this[i]) return true;
	return false;
};

COM.chromeCompatible =function(){
	var chromeVersion = navigator.userAgent.toLowerCase().match(/chrome\/(\d+)/);
	if ((typeof chrome == 'object') && (typeof chrome.extension == 'object')
		&& chromeVersion.length > 1 && chromeVersion[1] >=21)
		return true;
	return false;
};

COM.getTypeName =function(type){
	switch (type) {
		case 0 : return i18n.__com_typename_news;
		case 1 : return i18n.__com_typename_web;
		case 2 : return i18n.__com_typename_picture;
		case 3 : return i18n.__com_typename_video;
		case 4 : return i18n.__com_typename_music;
		case 5 : return i18n.__com_typename_shopping;
	}
	
};

COM.decodeURL =function(cb, charset, str){
	var script = document.documentElement.appendChild(document.createElement("script"));
	var div = document.documentElement.appendChild(document.createElement("div"));
	script.id = "search2kwscript";
	div.id ="search2kwdiv";
	div.style.display ="none";
	script.onload = cb;
	var src ="data:text/javascript;charset=" + charset + ",";
	src +="document.getElementById('search2kwdiv').innerText='"+str+"';";
	src += 'document.getElementById("search2kwscript").parentNode.removeChild(document.getElementById("search2kwscript"));';
	script.src = src;
	
};

COM.removeObjdata =function() {
	if(document.location.host.indexOf("bing.com")==-1) return;
	var objs =document.getElementsByTagName("object");
	if(!objs) return;
	for(var i =0; i<objs.length; i++) { 
		if(objs[i].getAttribute("data")) objs[i].removeAttribute("data");
	}
};

String.prototype.colorHex = function(){
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	var that = this;
	if(/^(rgb|RGB)/.test(that)){
		var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
		var strHex = "#";
		for(var i=0; i<aColor.length; i++){
			var hex = Number(aColor[i]).toString(16);
			if(hex === "0"){
				hex += hex;	
			}
			strHex += hex;
		}
		if(strHex.length !== 7){
			strHex = that;	
		}
		return strHex.toUpperCase();
	}else if(reg.test(that)){
		var aNum = that.replace(/#/,"").split("");
		if(aNum.length === 6){
			return that;	
		}else if(aNum.length === 3){
			var numHex = "#";
			for(var i=0; i<aNum.length; i+=1){
				numHex += (aNum[i]+aNum[i]);
			}
			return numHex;
		}
	}else{
		return that;	
	}
};

String.prototype.colorRgba = function(a){
	return "rgba(" +parseInt("0x" +this.substr(1,2)) +"," +
		parseInt("0x" +this.substr(3,2)) +"," +
		parseInt("0x" +this.substr(5,2)) +
		(a&&a>=0&&a<=1?(","+a):"") +")";
};

String.prototype.isColorHex =function(){
	return /^#([0-9a-fA-f]{6})$/.test(this);
};

COM.getContrastColor =function(color,factor) {
	var HX=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
	var n, rcolor =["#","#","#"];
	for(var i=1; i<7; i++){
		n =color.substr(i,1);
		n =parseInt("0x" +(n ? n : i));
	  n =(n +factor*i)%16;
	  rcolor[0] +=HX[n];
	  rcolor[1] +=HX[n+2>15?15:n+2];
	  rcolor[2] +=HX[n+4>15?15:n+4];
	}
	return rcolor;
};


COM.getSelectedText =function(){
	return selectedtext =window.getSelection().toString().replace(/\n/g," ").trim().substr(0, 64);
};

HTMLElement.prototype.setbg =function(gdt){
	this.style.background =this.style.background ="-webkit-gradient(linear,left bottom,left top," +
		"color-stop(0.15," +gdt[0] +
		"),color-stop(0.5," +gdt[1] +
		"),color-stop(1," +gdt[2] +"))";
};
