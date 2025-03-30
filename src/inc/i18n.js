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
 *     inc/i18n.js                                                                 *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * i18n init for locale vars of search2                                            *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

CS.initI18n =function(){
	i18n.chrome_nls =chrome.i18n.getMessage("@@ui_locale");
	
	i18n.__com_close =chrome.i18n.getMessage("com_close");
	i18n.__com_moresearch =chrome.i18n.getMessage("com_moresearch");
	i18n.__cts_more_tip =chrome.i18n.getMessage("cts_more_tip");
	i18n.__cts_config_tip =chrome.i18n.getMessage("cts_config_tip");
	i18n.__more_title =chrome.i18n.getMessage("more_title");
	
	i18n.__com_typename_news =chrome.i18n.getMessage("com_typename_news");
	i18n.__com_typename_web =chrome.i18n.getMessage("com_typename_web");
	i18n.__com_typename_picture =chrome.i18n.getMessage("com_typename_picture");
	i18n.__com_typename_video =chrome.i18n.getMessage("com_typename_video");
	i18n.__com_typename_shot_video =chrome.i18n.getMessage("com_typename_tv");
	i18n.__com_typename_music =chrome.i18n.getMessage("com_typename_music");
	i18n.__com_typename_shopping =chrome.i18n.getMessage("com_typename_shopping");
	
	i18n.__more_autoclose =chrome.i18n.getMessage("more_autoclose");
	i18n.__more_newwindow =chrome.i18n.getMessage("more_newwindow");
	i18n.__more_remember =chrome.i18n.getMessage("more_remember");
	i18n.__more_savesuccess =chrome.i18n.getMessage("more_savesuccess");
	
};

MSBOX.initI18n =function(){
	document.getElementById("__more_autoclose").innerText =chrome.i18n.getMessage("more_autoclose");
	document.getElementById("__more_newwindow").innerText =chrome.i18n.getMessage("more_newwindow");
	document.getElementById("search2_more_remember").innerText =chrome.i18n.getMessage("more_remember");
};
