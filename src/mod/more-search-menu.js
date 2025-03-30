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
 *     mod/more-search-menu.js                                                     *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * more-search-menu.js create more search menu for search2                         *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

MSMENU.createSearchMenu =function(bgc,fgc) {
	var gdt =COMM.getContrastColor(bgc,10);
	var bgc2 =COMM.getContrastColor(bgc,0)[1];
	var pulldowndiv =document.createElement("div");
	pulldowndiv.id ="more_search_menu";
	pulldowndiv.style.display ="none";
	document.documentElement.insertBefore(pulldowndiv,document.head);
	var ul =pulldowndiv.appendChild(document.createElement("ul"));
	if(pos=="left" || pos =="right") ul.style.width ="60px";
	else if(pos=="top") ul.classList.add("moreSearchMenuTop");
	else if(pos=="bottom") ul.classList.add("moreSearchMenuBottom");
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
		if(pos=="left") ul2.style.marginLeft ="100px";
		else if(pos=="right") ul2.style.marginLeft ="-122px";
	}
};

MSMENU.popSearchMenu =function(e) {
	if(msovered) return;
	var athd =config.autohide;
	//if(athd && pos =="right") e =document.getElementById("search2_configbtn");
	var pdiv =document.getElementById("more_search_menu");
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
		//pdiv.style.right =dw -x +"px";
		pdiv.style.left =x + 15 +"px";
		pos=="top" ? pdiv.style.top ="0px" : pdiv.style.bottom ="0px";
	}
	else if(pos =="left") {
		pdiv.style.left =x +whmargin +"px";
		pdiv.style.bottom =dh -y +"px";
	}
	else {
		pdiv.style.left =x +(athd?-50:-50) +"px";
		pdiv.style.top = y + 4 + "px";
		//pdiv.style.bottom =dh -(athd?event.clientY:y-16) +"px";
		//pdiv.style.bottom =dh -y -(athd?(config.intervaldistance*2+18)*favnum[stype] +44:0) +16 +"px";
		msovered =1;
	}
	/*position:second menu list*/
	var uls =pdiv.getElementsByTagName("ul");
	for(var i=0;i<uls.length;i++) 
		if(uls[i].id.indexOf("pulldown_category")!=-1) {
			if(pos =="top") {
				uls[i].style.top ="28px";
				uls[i].style.borderRadius ="0px 0px 6px 6px";
			}
			else if(pos =="bottom") {
				uls[i].style.bottom ="28px";
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
