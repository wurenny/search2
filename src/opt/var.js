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
 *     opt/var.js                                                                  *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * var.js define option share variables                                            *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

var UTIL = {};
var COMM = {};
var HTML= {};
var i18n = {};
var mnw, mac;
var optdata;
var config, favtypes, favlist;
var iconurls, icondatas, iconloaded;

const enclist =[
	"gbk","gb18030","big5","big5-hkscs","utf-16le","shift-jis","euc-jp","iso-2022-jp","euc-kr","iso-2022-kr","macintosh","koi8-r","koi8-u",
	"windows-1250","windows-1251","windows-1252","windows-1253","windows-1254","windows-1255","windows-1256","windows-1257","windows-1258",
	"iso-8859-1","iso-8859-2","iso-8859-3","iso-8859-4","iso-8859-5","iso-8859-6","iso-8859-7","iso-8859-8","iso-8859-8-i","iso-8859-9","iso-8859-10","iso-8859-11","iso-8859-13","iso-8859-14","iso-8859-15","iso-8859-16"
];
