/**
** Copyright (c) 2013 NicePeopleAtWork
** Author: Adrià Gil
** Navigation structure & device controller.
**/

/*
 * Available pages:
 * - splashscreen
 * - channel
 * - detail
 * - theater
 *
 * Navigable object:
 * el: "",			-> DOM id
 * action: "",		-> ENTER button
 * nav_up: "",		-> UP button
 * nav_down: "",	-> DOWN button
 * nav_left: "",	-> LEFT button
 * nav_right: ""	-> RIGHT button
 */

NScreens.NavigationMap = {
	page: "",
	focus: "",
	page_splashscreen: [{
		el: "userLogin",
		action: "NScreens.splashScreenView.loginSubView.login()",
		back: "window.NetCastBack()", //"window.NetCastBack()",
		nav_up: "trailer",
		nav_down: "remember",
		nav_left: "userPassword",
		nav_right: "register"
	},{
		el: "userPassword",
		action: "NScreens.splashScreenView.loginSubView.toggleVK()",
		back: "window.NetCastBack()", //"window.NetCastBack()",
		nav_up: "trailer",
		nav_down: "trailer",
		nav_left: "loginAction",
		nav_right: "userLogin"
	},{
		el: "loginAction",
		action: "NScreens.splashScreenView.loginSubView.toggleVK()",
		back: "window.NetCastBack()", //"window.NetCastBack()",
		nav_up: "trailer",
		nav_down: "trailer",
		nav_left: "register",
		nav_right: "userPassword"
	},{
		el: "register",
		action: "NScreens.splashScreenView.avisoLegal()", /*"window.location.href = '#avisoLegal';",*/
		back: "window.NetCastBack()", //"window.NetCastBack()",
		nav_up: "none",
		nav_down: "none",
		nav_left: "userLogin",
		nav_right: "loginAction"
	},{
		el: "trailer",
		action: "NScreens.splashScreenView.startTrailer()",
		back: "window.NetCastBack()", //"window.NetCastBack()",
		nav_up: "remember",
		nav_down: "userLogin",
		nav_left: "none",
		nav_right: "none"
	},{
		el: "remember",
		action: "window.location.href = '#remember';",
		back: "window.NetCastBack()", //"window.NetCastBack()",
		nav_up: "userLogin",
		nav_down: "trailer",
		nav_left: "none",
		nav_right: "register"
	}],
	page_popup:[{
		el: "bt_accept_popup",
		action: "NScreens.splashScreenView.loginSubView.togglePopup(false)",
		back: "NScreens.splashScreenView.loginSubView.togglePopup(false)",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_avisolegal:[{
		el: "accept_avisolegal",
		action: "window.location.href = '#age';",
		back: "NScreens.avisoLegalView.rechazarAvisoLegal()",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "rechazar_avisolegal"
	},{
		el: "rechazar_avisolegal",
		action: "NScreens.avisoLegalView.rechazarAvisoLegal()",
		back: "NScreens.avisoLegalView.rechazarAvisoLegal()",
		nav_up: "none",
		nav_down: "none",
		nav_left: "accept_avisolegal",
		nav_right: "up_avisolegal" /* up_avisolegal, none */
	},{
		el: "up_avisolegal",
		action: "NScreens.avisoLegalView.upAvisoLegal()",
		back: "NScreens.avisoLegalView.rechazarAvisoLegal()",
		nav_up: "none",
		nav_down: "none",
		nav_left: "rechazar_avisolegal",
		nav_right: "down_avisolegal" /* down_avisolegal, none */
	},{
		el: "down_avisolegal",
		action: "NScreens.avisoLegalView.downAvisoLegal()",
		back: "NScreens.avisoLegalView.rechazarAvisoLegal()",
		nav_up: "none",
		nav_down: "none",
		nav_left: "up_avisolegal",
		nav_right: "none"
	}],
	page_age:[{
		el: "accept_age",
		action: "window.location.href = '#register';",
		back: "window.location.href = '#splashscreen';",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "rechazar_age"
	},{
		el: "rechazar_age",
		action: "NScreens.ageView.rechazarAge()",
		back: "NScreens.ageView.rechazarAge()",
		nav_up: "none",
		nav_down: "none",
		nav_left: "accept_age",
		nav_right: "none"
	}],
	page_register: [{
		el: "registerName",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "none",
		nav_down: "registerLastname",
		nav_left: "registerCountry",
		nav_right: "registerCountry"
	},{
		el: "registerCountry",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "none",
		nav_down: "registerCP",
		nav_left: "registerName",
		nav_right: "registerName"
	},{
		el: "registerLastname",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerName",
		nav_down: "registerEmail",
		nav_left: "registerCP",
		nav_right: "registerCP"
	},{
		el: "registerCP",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerCountry",
		nav_down: "registerPwd",
		nav_left: "registerLastname",
		nav_right: "registerLastname"
	},{
		el: "registerEmail",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerLastname",
		nav_down: "registerGenderM",
		nav_left: "registerPwd",
		nav_right: "registerPwd"
	},{
		el: "registerPwd",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerCP",
		nav_down: "registerRPwd",
		nav_left: "registerEmail",
		nav_right: "registerEmail"
	},{
		el: "registerGenderM",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerEmail",
		nav_down: "registerGenderF",
		nav_left: "registerRPwd",
		nav_right: "registerRPwd"
	},{
		el: "registerGenderF",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerGenderM",
		nav_down: "registerAction",
		nav_left: "registerRPwd",
		nav_right: "registerRPwd"
	},{
		el: "registerRPwd",
		action: "NScreens.registerView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerPwd",
		nav_down: "registerAction",
		nav_left: "registerGenderM",
		nav_right: "registerGenderM"
	},{
		el: "registerAction",
		action: "NScreens.registerView.registrar()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "registerGenderF",			
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_registerConfirm:[{
		el: "accessAction",
		action: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_channel: [],
	page_detail: [{
		el: "video",
		action: "NScreens.itemDetailView.startMovie()",
		back: "window.location.href = '#channel';",
		nav_up: "none",
		nav_down: "none",
		nav_left: "detail_back",
		nav_right: "detail_back"
	},{
		el: "detail_back",
		action: "window.location.href = '#channel';",
		back: "window.location.href = '#channel';",
		nav_up: "user", // log, none, bdtest
		nav_down: "user", // log, none, bdtest
		nav_left: "video",
		nav_right: "video"
	},{
		el: "bdtest",
		action: "NScreens.itemDetailView.startTest()",
		back: "window.location.href = '#channel';",
		nav_up: "detail_back",
		nav_down: "detail_back",
		nav_left: "video",
		nav_right: "video"
	},/*{
		el: "log",
		action: "window.location.href = '#splashscreen';",
		back: "window.location.href = '#channel';",
		nav_up: "detail_back",
		nav_down: "detail_back",
		nav_left: "reg",
		nav_right: "reg"
	},{
		el: "reg",
		action: "window.location.href = '#avisoLegal';",
		back: "window.location.href = '#channel';",
		nav_up: "detail_back",
		nav_down: "detail_back",
		nav_left: "log",
		nav_right: "log"
	}*/{
		el: "user",
		action: "window.location.href = '#modify';",
		back: "window.location.href = '#channel';",
		nav_up: "detail_back",
		nav_down: "detail_back",
		nav_left: "none",
		nav_right: "none"
	}],
	page_theater: [{
		el: "videoPlayerControls",
		action: "Workspace.handleVideoControls('show');",
		back: "",
		nav_up: "none",
		nav_down: "none",
		nav_left: "qmenu",
		nav_right: "qmenu"
	},{
		el: "qmenu",
		action :"NScreens.footerView.actionLaunchQMENU()",
		back: "",
		nav_up: "none",
		nav_down: "none",
		nav_left: "player_pause",
		nav_right: "player_play"
	},{
		el: "player_play",
		action: "NScreens.footerView.actionPlay()",
		back: "",
		nav_up: "none",
		nav_down: "none",
		nav_left: "qmenu",
		nav_right: "player_stop"
	},{
		el: "player_stop",
		action: "NScreens.footerView.actionStop()",
		back: "",
		nav_up: "none",
		nav_down: "none",
		nav_left: "player_play",
		nav_right: "player_pause"
	},{
		el: "player_pause",
		action: "NScreens.footerView.actionPause()",
		back: "",
		nav_up: "none",
		nav_down: "none",
		nav_left: "player_stop",
		nav_right: "qmenu"
	},],
	page_bwcheck: [{
		el: "bwcheck",
		action: "NScreens.itemDetailView.doTest()",
		back: "NScreens.itemDetailView.closeTest()",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_remember: [{
		el: "rememberAction",
		action: "NScreens.rememberView.recuperar()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "recuperarPassword",
		nav_down: "recuperarPassword",
		nav_left: "none",
		nav_right: "none"
	},{
		el: "recuperarPassword",
		action: "NScreens.rememberView.toggleVK()",
		back: "Workspace.sessionDestroy()", //"window.location.href = '#splashscreen';",
		nav_up: "rememberAction",
		nav_down: "rememberAction",
		nav_left: "none",
		nav_right: "none"
	}],
	page_popup_remember: [{
		el: "bt_accept_popup",
		action: "NScreens.rememberView.togglePopup(false)",
		back: "NScreens.rememberView.togglePopup(false)",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_popup_register: [{
		el: "bt_accept_popup",
		action: "NScreens.registerView.togglePopup(false)",
		back: "NScreens.registerView.togglePopup(false)",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_modify: [{
		el: "registerName",
		action: "NScreens.modifyView.toggleVK()",
		back: "window.location.href = '#channel';",
		nav_up: "none",
		nav_down: "registerLastname",
		nav_left: "registerCountry",
		nav_right: "registerCountry"
	},{
		el: "registerCountry",
		action: "NScreens.modifyView.toggleVK()",
		back: "window.location.href = '#channel';",
		nav_up: "none",
		nav_down: "registerCP",
		nav_left: "registerName",
		nav_right: "registerName"
	},{
		el: "registerLastname",
		action: "NScreens.modifyView.toggleVK()",
		back: "window.location.href = '#channel';",
		nav_up: "registerName",
		nav_down: "modifyAction",
		nav_left: "registerCP",
		nav_right: "registerCP"
	},{
		el: "registerCP",
		action: "NScreens.modifyView.toggleVK()",
		back: "window.location.href = '#channel';",
		nav_up: "registerCountry",
		nav_down: "modifyAction",
		nav_left: "registerLastname",
		nav_right: "registerLastname"
	},{
		el: "modifyAction",
		action: "NScreens.modifyView.modify()",
		back: "window.location.href = '#channel';",
		nav_up: "registerLastname",			
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_popup_modify: [{
		el: "bt_accept_popup",
		action: "NScreens.modifyView.togglePopup(false)",
		back: "NScreens.modifyView.togglePopup(false)",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_modifyConfirm:[{
		el: "modify_accessAction",
		action: "window.location.href = '#channel';",
		back: "window.location.href = '#channel';",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}],
	page_popup_subscription: [{
		el: "bt_accept_popup",
		action: "NScreens.itemDetailView.togglePopup(false)",
		back: "NScreens.itemDetailView.togglePopup(false)",
		nav_up: "none",
		nav_down: "none",
		nav_left: "none",
		nav_right: "none"
	}]
};