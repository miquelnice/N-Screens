/**
** Copyright (c) 2013 NicePeopleAtWork
** Author: Adrià Gil
** Configuration files for LG NetCast Platform.
**/

(function($){
	
window.Workspace = {};

Workspace.nice264PluginUsername = "";
Workspace.subscription_ok = false;

Workspace.onIME = false;
Workspace.afterIME = false;

Workspace.onLoad = function()
{
	Workspace.enableKeys();
};

////////////////////////////////
// Keys & Navigation Management
////////////////////////////////
Workspace.enableKeys = function()
{	
	//if (NScreens.vkEnabled == false){
		document.onkeydown = Workspace.keyHandler;
	//}else{
		lgKb.onKeyDown = Workspace.vkOnKeyDown;
	//}
};

Workspace.setPage = function(page)
{
	//console.log("PAGE"+page);
	NScreens.NavigationMap.page = page;
};

Workspace.setFocus = function(target)
{	
	// internal vars
	NScreens.NavigationMap.focus = target;

	// add visual styles
	switch (target){
	case "userLogin":
		$("#loginAction").addClass("login_button_selected");
		break;
	case "userPassword":
		$("#userPassword").addClass("input_selected");
		break;
	case "loginAction":
		$("#userLogin").addClass("input_selected");
		break;
	case "trailer":
		$("#trailer .video_img").addClass("video_img_selected");
		$("#trailer .play_big").addClass("play_big_selected");
		break;
	case "register":
		$("#register").addClass("register_bt_selected");
		break;
	case "remember":
		$("#remember").addClass("remember_selected");
		break;
	case "ch_item_0":
	case "ch_item_1":
	case "ch_item_2":
	case "ch_item_3":
	case "ch_item_4":
	case "ch_item_5":
		$("#"+target).addClass("active");
		break;
	case "video":
		$("#video .video_img").addClass("video_img_selected");
		$("#video .play_big").addClass("play_big_selected");
		$("#video .video_img_in").addClass("video_img_in_selected");
		$("#video .play_big_in").addClass("play_big_in_selected");
		break;
	case "detail_back":
		$("#detail_back").addClass("bt_back_selected");
		break;
	case "bdtest":
		$("#bdtest").addClass("test_selected");
		break;
	case "registerName":
		$("#registerName").addClass("input_selected");
		break;
	case "registerLastname":
		$("#registerLastname").addClass("input_selected");
		break;
	case "registerEmail":
		$("#registerEmail").addClass("input_selected");
		break;
	case "registerGenderM":
		$("#registerGenderM").prop("checked", true);
		$("#registerGenderF").prop("checked", false);
		break;
	case "registerGenderF":
		$("#registerGenderF").prop("checked", true);
		$("#registerGenderM").prop("checked", false);
		break;
	case "registerCountry":
		$("#registerCountry").addClass("input_selected");
		break;
	case "registerCP":
		$("#registerCP").addClass("input_selected");
		break;
	case "registerPwd":
		$("#registerPwd").addClass("input_selected");
		break;
	case "registerRPwd":
		$("#registerRPwd").addClass("input_selected");
		break;
	case "registerAction":
		$("#registerAction").addClass("send_register_selected");
		break;
	case "accept_avisolegal":
		$("#accept_avisolegal").addClass("modal_legal_bt_selected");
		break;
	case "rechazar_avisolegal":
		$("#rechazar_avisolegal").addClass("modal_legal_bt_selected");
		break;
	case "up_avisolegal":
		$("#up_avisolegal").addClass("modal_legal_bt_selected");
		break;
	case "down_avisolegal":
		$("#down_avisolegal").addClass("modal_legal_bt_selected");
		break;
	case "accept_age":
		$("#accept_age").addClass("modal_bt_age_selected");
		break;
	case "rechazar_age":
		$("#rechazar_age").addClass("modal_bt_age_selected");
		break;
	/*case "log":
		$("#log").addClass("log_selected");
		break;
	case "reg":
		$("#reg").addClass("reg_selected");
		break;*/
	case "user":
		$("#user").addClass("user_selected");
		break;
	case "accessAction":
		$("#accessAction").addClass("send_access_selected");
		break;
	case "rememberAction":
		$("#rememberAction").addClass("send_remember_selected");
		break;
	case "recuperarPassword":
		$("#recuperarPassword").addClass("input_selected");
		break;
	case "modifyAction":
		$("#modifyAction").addClass("send_modify_selected");
		break;
	case "modify_accessAction":
		$("#modify_accessAction").addClass("send_modify_access_selected");
		break;
	case "bt_accept_popup":
		$("bt_accept_popup").addClass("bt_accept__selected");
		break;
	//player footer navigation
	case "qmenu":
		$("#qmenu").addClass("f_qmenu_selected");
		$("#player_play").removeClass("f_play_selected");
		$("#player_pause").removeClass("f_pause_selected");
		$("#player_stop").removeClass("f_stop_selected");
		break;
	case "player_play":
		$("#player_play").addClass("f_play_selected");
		$("#player_pause").removeClass("f_pause_selected");
		$("#player_stop").removeClass("f_stop_selected");
		$("#qmenu").removeClass("f_qmenu_selected");
		break;
	case "player_pause":
		$("#player_pause").addClass("f_pause_selected");
		$("#player_play").removeClass("f_play_selected");
		$("#player_stop").removeClass("f_stop_selected");
		$("#qmenu").removeClass("f_qmenu_selected");
		break;
	case "player_stop":
		$("#player_stop").addClass("f_stop_selected");
		$("#player_play").removeClass("f_play_selected");
		$("#player_pause").removeClass("f_pause_selected");
		$("#qmenu").removeClass("f_qmenu_selected");
		break;
	}
};

Workspace.removeFocus = function(target)
{
	// remove visual styles
	switch (target){
	case "userLogin":
		$("#loginAction").removeClass("login_button_selected");
		break;
	case "userPassword":
		$("#userPassword").removeClass("input_selected");
		break;
	case "loginAction":
		$("#userLogin").removeClass("input_selected");
	case "trailer":
		$("#trailer .video_img").removeClass("video_img_selected");
		$("#trailer .play_big").removeClass("play_big_selected");
		break;
	case "register":
		$("#register").removeClass("register_bt_selected");
		break;
	case "remember":
		$("#remember").removeClass("remember_selected");
		break;
	case "ch_item_0":
	case "ch_item_1":
	case "ch_item_2":
	case "ch_item_3":
	case "ch_item_4":
	case "ch_item_5":
		$("#"+target).removeClass("active");
		break;
	case "video":
		$("#video .video_img").removeClass("video_img_selected");
		$("#video .play_big").removeClass("play_big_selected");
		$("#video .video_img_in").removeClass("video_img_in_selected");
		$("#video .play_big_in").removeClass("play_big_in_selected");
		break;
	case "detail_back":
		$("#detail_back").removeClass("bt_back_selected");
		break;
	case "bdtest":
		$("#bdtest").removeClass("test_selected");
		break;
	case "registerName":
		$("#registerName").removeClass("input_selected");
		break;
	case "registerLastname":
		$("#registerLastname").removeClass("input_selected");
		break;
	case "registerEmail":
		$("#registerEmail").removeClass("input_selected");
		break;
	/*case "registerGenderM":
		$("#registerGender").prop("checked", false);
		$("#registerGenderF").prop("checked", true);
		break;
	case "registerGenderF":
		$("#registerGenderF").prop("checked", false);
		$("#registerGenderM").prop("checked", true);
		break;*/
	case "registerCountry":
		$("#registerCountry").removeClass("input_selected");
		break;
	case "registerCP":
		$("#registerCP").removeClass("input_selected");
		break;
	case "registerPwd":
		$("#registerPwd").removeClass("input_selected");
		break;
	case "registerRPwd":
		$("#registerRPwd").removeClass("input_selected");
		break;
	case "registerAction":
		$("#registerAction").removeClass("send_register_selected");
		break;
	case "accept_avisolegal":
		$("#accept_avisolegal").removeClass("modal_legal_bt_selected");
		break;
	case "rechazar_avisolegal":
		$("#rechazar_avisolegal").removeClass("modal_legal_bt_selected");
		break;
	case "up_avisolegal":
		$("#up_avisolegal").removeClass("modal_legal_bt_selected");
		break;
	case "down_avisolegal":
		$("#down_avisolegal").removeClass("modal_legal_bt_selected");
		break;
	case "accept_age":
		$("#accept_age").removeClass("modal_bt_age_selected");
		break;
	case "rechazar_age":
		$("#rechazar_age").removeClass("modal_bt_age_selected");
		break;
	/*case "log":
		$("#log").removeClass("log_selected");
		break;
	case "reg":
		$("#reg").removeClass("reg_selected");
		break;*/
	case "user":
		$("#user").removeClass("user_selected");
		break;
	case "accessAction":
		$("#accessAction").removeClass("send_access_selected");
		break;
	case "rememberAction":
		$("#rememberAction").removeClass("send_remember_selected");
		break;
	case "recuperarPassword":
		$("#recuperarPassword").removeClass("input_selected");
		break;
	case "modifyAction":
		$("#modifyAction").removeClass("send_modify_selected");
		break;
	case "modify_accessAction":
		$("#modify_accessAction").removeClass("send_modify_access_selected");
		break;
	case "bt_accept_popup":
		$("bt_accept_popup").removeClass("bt_accept__selected");
		break;
	//player footer navigation
	case "qmenu":
		$("#qmenu").removeClass("f_qmenu_selected");
		break;
	case "player_play":
		$("#player_play").removeClass("f_play_selected");
		break;
	case "player_pause":
		$("#player_pause").removeClass("f_pause_selected");
		break;
	case "player_stop":
		$("#player_stop").removeClass("f_stop_selected");
		break;
	}
};

Workspace.keyHandler = function(e)
{
	var naviAction = $.grep(NScreens.NavigationMap["page_"+NScreens.NavigationMap.page], function(e){ return e.el === NScreens.NavigationMap.focus; });
	// from virtualkeyboard, user can use keys to navigate with keyboard or TRCU
	//NScreens.vkEnabled = false;
	//console.log("NScreens.vkEnabled = " + NScreens.vkEnabled);

	//if (!NScreens.vkEnabled){
		//if (!Workspace.afterIME){
			
	switch (e.keyCode){
	case VK_UP:
		if (naviAction[0].nav_up != "none" && !NScreens.vkEnabled){
			if (NScreens.NavigationMap.page == "channel" && (naviAction[0].el == "ch_item_0" || naviAction[0].el == "ch_item_1" || naviAction[0].el == "ch_item_2") ){
				//console.log("UP "+naviAction[0].nav_up);
				Workspace.setFocus(naviAction[0].nav_up);
				Workspace.removeFocus("ch_item_0");
				Workspace.removeFocus("ch_item_1");
				Workspace.removeFocus("ch_item_2");
				eval( naviAction[0].nav_up );
			} else {
				Workspace.removeFocus(NScreens.NavigationMap.focus);
				Workspace.setFocus(naviAction[0].nav_up);
			}
		} 

		if (naviAction[0].nav_up == "none" && !NScreens.vkEnabled){
			if(NScreens.NavigationMap.page == "theater"){
				Workspace.handleVideoControls('show');
				//Workspace.setFocus("qmenu");
			}
		}
		break;
	case VK_DOWN:
		if (naviAction[0].nav_down != "none" && !NScreens.vkEnabled){
			if (NScreens.NavigationMap.page == "channel" && (naviAction[0].el == "ch_item_3" || naviAction[0].el == "ch_item_4" || naviAction[0].el == "ch_item_5") ){
				//console.log("DOWN "+naviAction[0].nav_down);
				Workspace.setFocus(naviAction[0].nav_down);
				Workspace.removeFocus("ch_item_3");
				Workspace.removeFocus("ch_item_4");
				Workspace.removeFocus("ch_item_5");
				eval( naviAction[0].nav_down );
			} else {
				Workspace.removeFocus(NScreens.NavigationMap.focus);
				Workspace.setFocus(naviAction[0].nav_down);
			}
		}

		if (naviAction[0].nav_down == "none" && !NScreens.vkEnabled){
			if(NScreens.NavigationMap.page == "theater"){
				Workspace.handleVideoControls('show');
				//Workspace.setFocus("qmenu");
			}
		}
		break;
	case VK_LEFT:
		if (naviAction[0].nav_left != "none" && !NScreens.vkEnabled){
			// check if channel page for action
			if (NScreens.NavigationMap.page == "channel" && (naviAction[0].el == "ch_item_0" || naviAction[0].el == "ch_item_3") ){
				eval( naviAction[0].nav_left );
			} else if (NScreens.NavigationMap.page == "theater"){
				Workspace.handleVideoControls('show');
				Workspace.setFocus(naviAction[0].nav_left);
				eval( naviAction[0].nav_left );				
				
			} else {
				Workspace.removeFocus(NScreens.NavigationMap.focus);
				Workspace.setFocus(naviAction[0].nav_left);
			}
		}
		break;
	case VK_RIGHT:
		if (naviAction[0].nav_right != "none" && !NScreens.vkEnabled){
			// check if channel page for action
			if ( NScreens.NavigationMap.page == "channel" && (naviAction[0].el == "ch_item_2" || naviAction[0].el == "ch_item_5") ){
				eval( naviAction[0].nav_right );
			} else if (NScreens.NavigationMap.page == "theater"){
				Workspace.handleVideoControls('show'); 
				Workspace.setFocus(naviAction[0].nav_right);
				eval( naviAction[0].nav_right );				
			
			} else {
				Workspace.removeFocus(NScreens.NavigationMap.focus);
				Workspace.setFocus(naviAction[0].nav_right);
			}
		}
		break;
	case VK_ENTER:
		if (naviAction[0].action != "none" && !NScreens.vkEnabled){
			//console.log("ACTION---->"+naviAction[0].action+"---VK---->"+NScreens.vkEnabled+"-----el---->"+naviAction[0].el);
			eval( naviAction[0].action );			
		}

		//cases toggle VKs
		//login view
		if(naviAction[0].action == "NScreens.splashScreenView.loginSubView.toggleVK()"){
			$("#userPassword" ).focus(function() {
				$( "#userPassword" ).click();
				//console.log( "keydown and blur" );
			});
			$("#userLogin" ).focus(function() {
				$( "#userLogin" ).click();
				//console.log( "keydown and blur" );
			});
		}
		//register view
		if(naviAction[0].action == "NScreens.registerView.toggleVK()"){
			$("#registerName" ).focus(function() {
				$( "#registerName" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerLastname" ).focus(function() {
				$( "#registerLastname" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerEmail" ).focus(function() {
				$( "#registerEmail" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerCountry" ).focus(function() {
				$( "#registerCountry" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerPwd" ).focus(function() {
				$( "#registerPwd" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerRPwd" ).focus(function() {
				$( "#registerRPwd" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerCP" ).focus(function() {
				$( "#registerCP" ).click();
				//console.log( "keydown and blur" );
			});
		}
		//remember view
		if(naviAction[0].action == "NScreens.rememberView.toggleVK()"){
			$("#recuperarPassword" ).focus(function() {
				$( "#recuperarPassword" ).click();
				//console.log( "keydown and blur" );
			});
		}
		//modify view
		if(naviAction[0].action == "NScreens.modifyView.toggleVK()"){
			$("#registerName" ).focus(function() {
				$( "#registerName" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerLastname" ).focus(function() {
				$( "#registerLastname" ).click();
				//console.log( "keydown and blur" );
			});			
			$("#registerCountry" ).focus(function() {
				$( "#registerCountry" ).click();
				//console.log( "keydown and blur" );
			});
			$("#registerCP" ).focus(function() {
				$( "#registerCP" ).click();
				//console.log( "keydown and blur" );
			});
		}
		//end causes toggle VKs

		if(NScreens.NavigationMap.page == "theater"){
			Workspace.handleVideoControls('show');
		}
		
		break;
	case VK_BACK: //VK_BACK or 33(Re Pág)
        if (NScreens.NavigationMap.page == "theater" && !NScreens.vkEnabled){
            Player.handleStopVideo();
            Player.reset();
            //Player.hidePlayer();

            if (Player.isVOD){
                Workspace.setFooter("detail");
            } else {
                Workspace.setFooter("splashscreen");
            }
			
			//footer player navigation
			$("#qmenu").removeClass("f_qmenu_selected");
			$("#player_play").removeClass("f_play_selected");
			$("#player_pause").removeClass("f_pause_selected");
			$("#player_stop").removeClass("f_stop_selected");

        } else if (NScreens.NavigationMap.page == "splashscreen" && NScreens.vkEnabled){			
			//if(NScreens.vkEnabled){
				 if (lgKb.bShowPopupLangSel) {
					console.log("CIERRO IDIOMAS ----->");
					lgKb.resetSelLangList();
					lgKb.showPopupLangSel(false);
				} else {					
					console.log("CIERRO VK-------->"+NScreens.vkEnabled);
					NScreens.vkEnabled = false;
					lgKb.focusOut();
					//unfocus inputs. Skip virtual keyboard
					$("#userLogin").blur();
					$("#loginAction").blur();		
					$("#userPassword").blur();
				}			
				
		} else if (NScreens.NavigationMap.page == "splashscreen" && !NScreens.vkEnabled){
				console.log("SALGO APP------>"+NScreens.vkEnabled);
				//NScreens.vkEnabled = false;
				window.NetCastBack();
				
		}else if (NScreens.NavigationMap.page != "splashscreen"){		
			if(NScreens.vkEnabled){
				if (lgKb.bShowPopupLangSel) {
					console.log("CIERRO LANGUAGES ----->");
					lgKb.resetSelLangList();
					lgKb.showPopupLangSel(false);
				} else {					
					console.log("ENABLED CIERRE VK------>"+NScreens.vkEnabled);
					NScreens.vkEnabled = false;
					lgKb.focusOut();
					//remember page blur
					$("#recuperarPassword").blur();
					//register & modify page blur
					$("#registerName").blur();
					$("#registerCountry").blur();
					$("#registerLastname").blur();
					$("#registerEmail").blur();
					$("#registerCP").blur();
					$("#registerPwd").blur();
					$("#registerRPwd").blur();
				}
						
			}else{ //!NScreens.vkEnabled
				if (naviAction[0].back != "exit"){
					console.log("BACK------>"+NScreens.vkEnabled);
					eval( naviAction[0].back );
				} else {
					console.log("EXIT APP------>"+NScreens.vkEnabled);
					window.NetCastBack();
				}
			}				
        }
		break;
	case VK_PLAY:
		if(NScreens.NavigationMap.page == "splashscreen"){
			NScreens.splashScreenView.startTrailer();
		} else if (NScreens.NavigationMap.page == "detail"){
			NScreens.itemDetailView.startMovie();
		} else if (NScreens.NavigationMap.page == "theater"){
			Player.handlePlayVideo();
		}
		break;
	case VK_PAUSE:
		if (NScreens.NavigationMap.page == "theater"){
			Player.handlePauseVideo();
		}
		break;
	case VK_STOP:
		if (NScreens.NavigationMap.page == "theater"){
			Player.handleStopVideo();
			Player.reset();
			//Player.hidePlayer();

			if (Player.isVOD){
				Workspace.setFooter("detail");
			} else {
				Workspace.setFooter("splashscreen");
			}
		}
		break;
	case VK_FAST_FWD:
		if (NScreens.NavigationMap.page == "theater"){
			//Player.skipForwardVideo();
		}
        else if (naviAction[0].nav_right != "none" && !NScreens.vkEnabled)
        {
            if (NScreens.NavigationMap.page == "channel"){
                window.location.href = $("#forward a").attr("href");
            }
        }
		break;
	case VK_REWIND:
		if (NScreens.NavigationMap.page == "theater"){
			//Player.skipBackwardVideo();
		}
        else if (naviAction[0].nav_left != "none" && !NScreens.vkEnabled)
        {
            if (NScreens.NavigationMap.page == "channel"){
                window.location.href = $("#backfw a").attr("href");
            }
        }
		break;
	case VK_YELLOW:
		if (NScreens.NavigationMap.page == "channel"){
			Workspace.sessionDestroy();			
		}else if(NScreens.NavigationMap.page == "detail"){
			Workspace.sessionDestroy();			
		}else if(NScreens.NavigationMap.page == "modify"){
			Workspace.sessionDestroy();			
		}else if(NScreens.NavigationMap.page == "modifyConfirm"){
			Workspace.sessionDestroy();			
		}else if(NScreens.NavigationMap.page == "remember"){
			Workspace.sessionDestroy();			
		}
		break;
	case 9:
		NScreens.vkEnabled = true;
		e.preventDefault();
		
		if (NScreens.NavigationMap.focus == "loginAction" && NScreens.vkEnabled){
			// vk focus
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("userPassword");
			// vk focus
			$("#userPassword").focus();
		} else if (NScreens.NavigationMap.focus == "userPassword" && NScreens.vkEnabled){
			// vk focus
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("userLogin");
			$("#loginAction").focus();
		}
		//new added to register, modify and remember forms
		else if(NScreens.NavigationMap.focus == "registerName" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("registerCountry");
			$("#registerCountry").focus();
		}
		else if(NScreens.NavigationMap.focus == "registerCountry" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("registerLastname");
			$("#registerLastname").focus();
		}
		else if(NScreens.NavigationMap.focus == "registerLastname" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("registerCP");
			$("#registerCP").focus();
		}
		else if(NScreens.NavigationMap.focus == "registerCP" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			if (window.location.hash == "#register"){ // register form
				Workspace.setFocus("registerEmail");
				$("#registerEmail").focus();
			}else if(window.location.hash == "#modify"){ // modify form
				Workspace.setFocus("modifyAction");
				$("#modifyAction").focus();
			}			
		}
		else if(NScreens.NavigationMap.focus == "registerEmail" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);			
			Workspace.setFocus("registerPwd");
			$("#registerPwd").focus();			
		}
		else if(NScreens.NavigationMap.focus == "registerPwd" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("registerRPwd");
			$("#registerRPwd").focus();
		}
		else if(NScreens.NavigationMap.focus == "registerRPwd" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("registerAction");
			$("#registerAction").focus();						
		}
		// remember form
		else if(NScreens.NavigationMap.focus == "recuperarPassword" && NScreens.vkEnabled)
		{
			lgKb.focusOut();
			NScreens.vkEnabled = false;
			// focus
			Workspace.removeFocus(NScreens.NavigationMap.focus);
			Workspace.setFocus("rememberAction");
			$("#rememberAction").focus();						
		}

		break;
	}

	//}
};

///////////////////////////////
// Virtual Keyboard Management
///////////////////////////////
Workspace.vkOnKeyDown = function(event){
	if ( $("#VirtualKeyboard").css('display') == "none" && NScreens.vkEnabled ){
		if (NScreens.NavigationMap.focus == "userPassword"){
			inputItem = "userPassword";
		} else if (NScreens.NavigationMap.focus == "loginAction"){
			inputItem = "userLogin";
		} else if (NScreens.NavigationMap.focus == "registerName"){  // new added
			inputItem = "registerName";
		} else if (NScreens.NavigationMap.focus == "registerLastname"){
			inputItem = "registerLastname";
		} else if (NScreens.NavigationMap.focus == "registerEmail"){
			inputItem = "registerEmail";
		} else if (NScreens.NavigationMap.focus == "registerCountry"){
			inputItem = "registerCountry";
		} else if (NScreens.NavigationMap.focus == "registerPwd"){
			inputItem = "registerPwd";
		} else if (NScreens.NavigationMap.focus == "registerRPwd"){
			inputItem = "registerRPwd";
		} else if (NScreens.NavigationMap.focus == "registerCP"){
			inputItem = "registerCP";
		} else if (NScreens.NavigationMap.focus == "recuperarPassword"){
			inputItem = "recuperarPassword";
		} else if (NScreens.NavigationMap.focus == "rememberAction"){
			inputItem = "rememberAction";
		}
		$("#"+inputItem).blur();
		NScreens.vkEnabled = false;
		/*Workspace.afterIME = false;
		Workspace.onIME = false;*/
	}
};

/////////////////////
// Footer Management
/////////////////////
Workspace.setFooter = function(page)
{
	var footerItems = "";

	//LG_NetCastVersion to detect yearFirmware
	var userAgent = new String(navigator.userAgent);
	var yearFirmware = "";
	var parseFirmware = "";
	if (userAgent!= ''){
		
		if (userAgent.search(/LG NetCast.TV/) > -1){
			parseFirmware = userAgent.split('LG NetCast.TV-');
			parseSlash = parseFirmware[1].split('/');			
			yearFirmware = parseSlash[0];
		} else if (userAgent.search(/LG NetCast.Media/) > -1){
			parseFirmware = userAgent.split('LG NetCast.Media-');
			yearFirmware = parseFirmware[1];
		}else if (userAgent.search(/LG Browser/) > -1){
			parseFirmware = userAgent.split('LG Browser');
			yearFirmware = parseFirmware[1];
		}else{
			yearFirmware = "2014";
		}
	}

	var appversion = "";
	if(QueryString.getChannelName() == "encopa"){
		appversion = "4.0.6";
	} else if (QueryString.getChannelName() == "distancia"){
		appversion = "4.0.6";
	} else if (QueryString.getChannelName() == "know"){
		appversion = "4.0.6";
	}

	// for video playback footer add the elpased time and duration
	if (page == "theater"){
		// progress bar
		$(".footer").append("<div class='videobar'></div>");
		$(".footer").append("<div class='videoprogress'></div>");
		// time info
		$(".footer").append("<div class='timmer'><span class='tcurrent'></span> / <span class='ttotal'></span><span class='seek_speed'></span></div>");
		$(".appversion").remove();
		$(".lopd").remove();
	}else if(page == "splashscreen" || page == "avisolegal"){ // show LOPD, CdS and Privacidad for splashscreen & popup avisolegal pages
		//console.log("ENTRA EN SPLASH o AVISO LEGAL--->"+page);
		$(".appversion").hide();
		$(".lopd").hide();
		$(".footer").append("<div class='appversion'>LG"+ yearFirmware +" - v"+ appversion +"</div><div class='lopd'><a onclick='NScreens.router.loadAvisoLegal(); $(&quot;#modal_legal_text&quot;).html(&quot;"+QueryString.getLopd()+"&quot;); $(&quot;.modal_title&quot;).html(&quot;LOPD&quot;); $(&quot;#rechazar_avisolegal&quot;).html(&quot;Cerrar&quot;);'>LOPD</a> - <a onclick='NScreens.router.loadAvisoLegal(); $(&quot;#rechazar_avisolegal&quot;).html(&quot;Cerrar&quot;);'>Condiciones del Servicio</a> - <a onclick='NScreens.router.loadAvisoLegal(); $(&quot;#modal_legal_text&quot;).html(&quot;"+QueryString.getPrivacidad()+"&quot;); $(&quot;.modal_title&quot;).html(&quot;Política de privacidad&quot;); $(&quot;#rechazar_avisolegal&quot;).html(&quot;Cerrar&quot;);'>Política de privacidad</a></div>");
	}else{ // other pages don't show  LOPD, CdS and Privacidad
		//console.log("ENTRA RESTO----->"+page);
		$(".appversion").hide();
		$(".lopd").remove();
		$(".footer").append("<div class='appversion'>LG"+ yearFirmware +" - v"+ appversion +"</div>");
	}

	for (var i = 0; i < NScreens.FooterMap[page].length; i++){
			
		footerItems += "<li id='"+NScreens.FooterMap[page][i].icon+"' class='"+NScreens.FooterMap[page][i].action+"'><a>"+NScreens.FooterMap[page][i].label+"</a></li>"; // footerItems += "<li id='"+NScreens.FooterMap[page][i].icon+"' class='"+NScreens.FooterMap[page][i].action+"'>"+NScreens.FooterMap[page][i].label+"</li>";
	}

	$(".keyhelp").html(footerItems);

	//not navigable options in keyhelp
	$("#arrows").css('color','#fff');	  
	$("#ok").css('color','#fff');

	//hide cerrar sesion if user is not logged
	if(Workspace.globalName == "" || Workspace.globalName == undefined){
		if (page != "channel" || page != "detail"){
			$("#session_out").show();			
		}else{
			$("#session_out").hide();
		}
	}
	
	if(userAgent.indexOf("BDP") != -1 || userAgent.indexOf("PORTAL_KEY") == -1){
		//do nothing for TV device
	}else{
		//BluRays and SetTopBoxes
		$("li#qmenu").remove();
	}
	
	//show footer after play movie
	$(".footer").css({'display':'block', 'position':'absolute', 'bottom':'0', 'z-index':'0'});
	if (Workspace.videoControlsTimer){
		clearTimeout(Workspace.videoControlsTimer);
		Workspace.videoControlsTimer = null;
	}
};

///////////////////////
// Playback Management
///////////////////////
Workspace.setTrailer = function(trailer_url)
{
	Player.isVOD = false;
	Player.currentData = trailer_url;
};

Workspace.setWVMovie = function(movie_url, license_url)
{
	Player.isVOD = true;
	Player.currentData = movie_url;
	Player.currentLicense = license_url;
};

//////////////////////
// Session Management
//////////////////////
Workspace.sessionCheck = function()
{	
	if (document.cookie.length > 0){
		var cookieArray = document.cookie.split(";");
		var nameAndValue = cookieArray[0].split("=");
		
		// console.log("****** nameAndValue[0] = "+nameAndValue[0]+", nameAndValue[1] = "+nameAndValue[1]+", nameAndValue.length = "+nameAndValue.length);
		
		if (nameAndValue[0] == "nscreens" && nameAndValue[1] == "authenticated" && nameAndValue.length == 2){
			//console.log("2->"+nameAndValue[0]+"1->"+nameAndValue[1]);
			return true;
		} else {
			youboraData.setUsername("free");
			return false;
			// console.log("****** document.cookie.length <= 0");
		}
	}
	
};

Workspace.sessionCreate = function()
{
	// cookie
	var expireMilliseconds = 30 * 7 * 24 * 60 * 60 * 1000;
	var todayDate = new Date();
	var expireSetting = "";
	todayDate.setTime(todayDate.getTime() + expireMilliseconds); // 7 days
	expireSetting = "expires=" + todayDate.toGMTString() + ";";
	document.cookie = "nscreens=authenticated;" + expireSetting;
	// console.log("****** document.cookie = "+document.cookie);
	
	// redirect
	window.location.href = '#channel';
};

Workspace.sessionDestroy = function()
{
	// cookie
	var expireMilliseconds = -1 * 30 * 7 * 24 * 60 * 60 * 1000;
	document.cookie = "nscreens=;" + expireMilliseconds;
	// redirect
	window.location.href = '';
	
	//Plugin username free after destroyed session
	youboraData.setUsername("free");
};
})(jQuery);

/////////////
// Buffering
/////////////
Workspace.toggleBuffer = function(action)
{
	if (action == "show"){
		$(".buffer").css({'display':'block'});
		Workspace.toggleBuffer('hide');
		
	} else if (action == "hide"){
		//$(".buffer").css({'display':'none'});		
		setTimeout(function(){		
			$(".buffer").css({'display':'none'});
		}, 5000);		
	}
};

Workspace.handleVideoControls = function(action)
{
	if (action == "show"){		
		if (Workspace.videoControlsTimer){
			clearTimeout(Workspace.videoControlsTimer);
			Workspace.videoControlsTimer = null;
			Workspace.handleVideoControls('hide');
		}
		$(".footer").css({'display':'block'});		
	} else if (action == "hide"){	
		Workspace.videoControlsTimer = setTimeout(function(){		
			$(".footer").css({'display':'none'});
		}, 5000);		
	}
};

Workspace.toggleAvisoLegal = function(action)
{
	if (action == "show"){
		$(".modal_legal").css({'display':'block'});
		$(".modal_wrapper").css({'display':'block'});
		$(".popup_opacity").css({'display':'block'});
		Workspace.setPage('avisolegal');
		Workspace.setFocus('accept_avisolegal');
	} else if (action == "hide"){
		$(".modal_legal").css({'display':'none'});
		$(".modal_wrapper").css({'display':'none'});
		$(".popup_opacity").css({'display':'none'});
		Workspace.setPage('splashscreen');
		Workspace.setFocus('trailer');		
	}
};
Workspace.toggleAge = function(action)
{
	if (action == "show"){
		$(".modal_age").css({'display':'block'});
		$(".modal_wrapper_age").css({'display':'block'});
		$(".popup_opacity").css({'display':'none'}); 
		/*$(".popup_opacity").css({'display':'block'});*/
		Workspace.setPage('age');
		Workspace.setFocus('accept_age');
	} else if (action == "hide"){
		$(".modal_age").css({'display':'none'});
		$(".modal_wrapper_age").css({'display':'none'});
		$(".popup_opacity").css({'display':'none'});
		Workspace.setPage('splashscreen');
		Workspace.setFocus('trailer');		
	}
};