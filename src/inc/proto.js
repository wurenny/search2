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
 *     inc/proto.js                                                                *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * proto.js is the custom function for dom or javascript object                    *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

HTMLElement.prototype.setbg =function(gdt){
	this.style.background =this.style.background ="-webkit-gradient(linear,left bottom,left top," +
		"color-stop(0.15," +gdt[0] +
		"),color-stop(0.5," +gdt[1] +
		"),color-stop(1," +gdt[2] +"))";
};

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
					document.getElementById("search2_more_searchBox").focus();
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
