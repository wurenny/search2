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

MSMENU.createMoreSearchMenu =function(palette) {
	let msmenudiv =document.createElement("div");
	msmenudiv.id ="more_search_menu";
	msmenudiv.style.display ="none";
	document.documentElement.insertBefore(msmenudiv,document.head);
	let ul =msmenudiv.appendChild(document.createElement("ul"));
	ul.style.width ="100px";
	ul.classList.add("moreSearchMenu_" +pos);
	for(let t in favtypes) {
		if(t ==stype) continue;
		let li =ul.appendChild(document.createElement("li"));
		let a =li.appendChild(document.createElement("a"));
		a.innerText =favtypes[t];
		/*style*/
		a.style.background =palette.bgc1;
		a.style.color =palette.fgc;
		let ul2 =li.appendChild(document.createElement("ul"));
		ul2.id ="more_search_menu_L2_" +t;
		ul2.style.background =palette.bgc2;
		ul2.style.color =palette.fgc;
		/*mouse event*/
		a.onmouseover =function(){
			this.style.color = palette.fgh;
			this.setbg(palette.bgh)
			let ra = this.getBoundingClientRect();
			let ru = ul2.getBoundingClientRect();
			let dh = document.documentElement.clientHeight; // window height
			//console.log("dh a+h u+h r:", dh, ra.y+ru.height, ru.y+ru.height, ru);
			if (pos == "bottom") {
				if (ru.y + ru.height + 18 > dh) ul2.style.bottom = 0;
			}
			else {
				if (pos == "left" && ra.y + ru.height > dh) ul2.style.bottom = 0;
				else ul2.style.top = this.offsetTop - (this.offsetTop < 28 ? 0 : 28) + "px";
			}
		};
		a.onmouseout =function(){
			this.style.color = palette.fgc;
			this.style.background =palette.bgc1
		};
	}
};

MSMENU.popMoreSearchMenu =function(e) {
	if(msovered) return;
	let athd =config.autohide;
	//if(athd && pos =="right") e =document.getElementById("search2_configbtn");
	let pdiv =document.getElementById("more_search_menu");
	let dw =document.documentElement.clientWidth;  // window width
	let dh =document.documentElement.clientHeight; // window height
	let x,y;
	let rect =e.getBoundingClientRect();
	if(rect){
		x =rect.left;
		y =rect.top +rect.height;
	} else{
		x =e.offsetLeft;
		y =e.offsetTop;
		let current = e.offsetParent;
		while (current !==null) {
			x +=current.offsetLeft;
			y +=current.offsetTop;
			current =current.offsetParent;
		}
		y =y +e.offsetHeight;
	}
	let isXoverflow = (x + 100 > dw);
	//console.log("xoverflow, dw dh morex morey:", isXoverflow, dw, "||", dh, "||", x, "||", y);
	
	/*position:L1 menu*/
	if(pos =="top" || pos =="bottom") {
		//pdiv.style.right =dw -x +"px";
		if (isXoverflow) pdiv.style.right ="0px";
		else pdiv.style.left =x - 30 +"px";
		pos=="top" ? pdiv.style.top ="18px" : pdiv.style.bottom ="18px";
	}
	else if(pos =="left") {
		pdiv.style.left =x +whmargin +"px";
		pdiv.style.bottom =dh -y +"px";
	}
	else if(pos =="right") {
		pdiv.style.left =x - 50 +"px";
		pdiv.style.top = y + 4 + "px";
		//pdiv.style.bottom =dh -(athd?event.clientY:y-16) +"px";
		//pdiv.style.bottom =dh -y -(athd?(config.intervaldistance*2+18)*favnum[stype] +44:0) +16 +"px";
		msovered =1;
	}

	/*position:L2 menu*/
	let ul2s =pdiv.querySelectorAll('[id^="more_search_menu_L2_"]');
	for(let i=0;i<ul2s.length;i++) {
		let ul2 = ul2s[i];
		if(pos =="top" || pos =="bottom") {
			//right overflow ?
			if (isXoverflow) {
				ul2.style.right ="100px";
				ul2.style.borderRadius ="6px 0px 0px 6px";
			}
			else {
				ul2.style.marginLeft ="100px";
				ul2.style.borderRadius ="0px 6px 6px 0px";
			}
		}
		//position
		if(pos =="left") {
			ul2.style.marginLeft ="100px";
			ul2.style.borderRadius ="0px 6px 6px 0px";
		}
		else if(pos =="right") {
			ul2.style.marginLeft ="-120px";
			ul2.style.borderRadius ="6px 0px 0px 6px";
		}
		else if(pos =="top") ul2.style.top ="0px";
		//bottom need Real-time computing when mouseover
	}
	
	pdiv.style.display ="block";
	document.onclick =function(){
		pdiv.style.display ="none";
		document.onclick =undefined;
		msovered =0;
	}
};
