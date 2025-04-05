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
 *     inc/var.js                                                                  *
 *                                                                                 *
 * This file is part of search2 project                                            *
 * var.js define content script share variables                                    *
 *                                                                                 *
 *---------------------------------------------------------------------------------*
 */

// public vars
var UTIL = {};
var COMM = {};
var i18n = {};
var optdata = {};
var config, favlist, favtypes;
var iconurls, icondatas; //, nohslist;
var favnum ={}, favrect ={};
var hashSearch, septr;
var keywords, enc, enckeywords;
var favindex, pos, stype, prkw, urltf, ispathkw;
var whmargin, msovered =0;
var thisurl, hostname;

// content script vars
var CS ={};

// search bar vars
var SB ={};

// more search vars
var MSMENU = {};
var MSBOX = {};