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
 *     opt/util.js                                                                 *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * util.js is general functions for option                                         *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

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
	setTimeout(() => {tip.style.display ='none';tip.innerText='';}, 2000);
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
	setTimeout(() => {minitip.style.display ='none';minitiptxt.innerText='';}, 2000);
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
