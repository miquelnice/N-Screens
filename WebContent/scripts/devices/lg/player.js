/**
** Copyright (c) 2013 NicePeopleAtWork
** Author: Adrià Gil
** Players for LG NetCast Platform.
**/

var Player = {
	// types
	playerType: null,
	regular: null,
	drm: null,
	currentData: null,
	currentLicense: null,
	// states
	state: -1,
	skipState: -1,
	isVOD: false,
	// controls
	STOPPED: 0,
	PLAYING: 1,
	PAUSED: 2,
	CONNECTING: 3,
	BUFFERING: 4,
	FINISHED: 5,
	ERROR: 6,
	REWIND: 1,
	FORWARD: 2,
	// seek
	seekSpeed: 0,
	maxSeekSpeed: 30,
	// display
	positionTimer: null
	//playerTipus: ""
};

Player.init = function(){
	var success = true;

	Workspace.toggleBuffer("show");
	
	if (Player.playerType == "regular"){
		
		// player ui
		video_player.data = Player.currentData;
		video_player.width = 1280;
		video_player.height = 720; //662
		// player setup
		Player.state = this.STOPPED;
		Player.regular = video_player;
		
		//Player.playerTipus = "video_player";
		
		if (!Player.regular){
			success = false;
		}
		
	} else if (Player.playerType == "drm"){
		
		// player ui
		video_player_drm.data = Player.currentData;
		video_player_drm.setWidevineDrmURL(Player.currentLicense);
		video_player_drm.setWidevinePortalID('nicepeople');
		video_player_drm.width = 1280;
		video_player_drm.height = 720; //662
		
		// player setup
		Player.state = this.STOPPED;
		Player.drm = video_player_drm;
		
		//Player.playerTipus = "video_player_drm";
		
		if (!Player.drm){
			success = false;
		}
	}

	//z-index footer
	$(".footer").css({'position':'relative', 'z-index':'1', 'top':'670px', 'display':'block'});
	Workspace.handleVideoControls('hide');
	
	// player events
	Player.setListeners();		
		
	return success;
};

Player.reset = function(){
	// player display
	clearInterval(Player.positionTimer);
	Player.positionTimer = null;
	
	$(".videobar").remove();
	$(".videoprogress").remove();
	$(".timmer").remove();

	// player ui
	$("#wrapper").css({"background-color":"#ffffff"});
	$("#header").show();
	$("#container").show();
	
	Player.hidePlayer();

	$(".footer").css({'display':'block', 'position':'absolute', 'bottom':'0', 'z-index':'0'});
	if (Workspace.videoControlsTimer){
		clearTimeout(Workspace.videoControlsTimer);
		Workspace.videoControlsTimer = null;
	}
};

Player.getActivePlayer = function(){
	if (Player.isVOD){
		return Player.drm;
	} else {
		return Player.regular;
	}
};

Player.hidePlayer = function(){
	if (Player.isVOD){
		// footer
		Workspace.setFooter('detail');
		// focus
		Workspace.setPage('detail');
		Workspace.setFocus('video');
		// clear theater view
		NScreens.theaterView.close();
		// route user to previous page
		eval("NScreens.NavigationMap['page_theater'][0].back");
	} else {
		// footer
		Workspace.setFooter('splashscreen');
		// focus
		Workspace.setPage('splashscreen');
		Workspace.setFocus('trailer');
		// clear theater view
		NScreens.theaterView.close();
		// route user to previous page
		eval("#splashscreen"); // window.location.href = "#splashscreen";
	}
	$(".footer").css({'display':'block', 'position':'absolute', 'bottom':'0', 'z-index':'0'});
	if (Workspace.videoControlsTimer){
		clearTimeout(Workspace.videoControlsTimer);
		Workspace.videoControlsTimer = null;
	}
};

///////////////////
//Player controls
///////////////////
Player.handlePlayVideo = function(){
    $(".seek_speed").html("");
    if (Player.isVOD)
    {
        $("#player_pause").show();
    }
	Player.seekSpeed = 0;
	Player.skipState = -1;
	
	switch ( Player.state ){
		case Player.STOPPED:
		case Player.PAUSED:
        case Player.FORWARD:
        case Player.REWIND:
			Player.getActivePlayer().play(1);

			Workspace.setFocus("player_play");
			break;
	}

	//change
	Workspace.handleVideoControls('show');
};

Player.handlePauseVideo = function(){
    $(".seek_speed").html("");
    if (Player.isVOD)
    {
        $("#player_pause").show();
    }
	Player.seekSpeed = 0;
	
	switch ( Player.state ){
		case Player.PLAYING:
			Player.getActivePlayer().play(0);
			Workspace.setFocus("player_pause");
			break;
	}
	
	// resume after seek
	if (Player.skipState != -1){
		Player.skipState = -1;
		Player.getActivePlayer().play(1);
		Workspace.setFocus("player_play");
	}

	//change
	Workspace.handleVideoControls('show');
};

Player.handleStopVideo = function(){
	$(".seek_speed").html("");
	Player.seekSpeed = 0;
	Player.skipState = -1;
	
	switch ( Player.state ){
		case Player.PAUSED:
		case Player.PLAYING:
		case Player.FINISHED:
		case Player.ERROR:
			Player.getActivePlayer().stop();
			break;
	}

	$(".footer").css({'display':'block', 'position':'absolute', 'bottom':'0'});
	if (Workspace.videoControlsTimer){
		clearTimeout(Workspace.videoControlsTimer);
		Workspace.videoControlsTimer = null;
	}
};

Player.skipForwardVideo = function(){
	if (Player.isVOD)
    {
        $("#player_pause").hide();
    }

    Player.getActivePlayer().play(1);

    if (Player.skipState == Player.REWIND){
		Player.seekSpeed = 1;
	}

	Player.skipState = Player.FORWARD;

	if (Player.seekSpeed < Player.maxSeekSpeed){
		if (Player.seekSpeed == 1){
			Player.seekSpeed = 0;
		}
		Player.seekSpeed += 5;
	} else {
		Player.seekSpeed = 1;
	}
		
	Player.seekTo(Player.seekSpeed, "forward");
};

Player.skipBackwardVideo = function(){
    if (Player.isVOD)
    {
        $("#player_pause").hide();
    }

    Player.getActivePlayer().play(1);

    if (Player.skipState == Player.FORWARD){
		Player.seekSpeed = 1;
	}

	Player.skipState = Player.REWIND;

	if (Player.seekSpeed < Player.maxSeekSpeed){
		if (Player.seekSpeed == 1){
			Player.seekSpeed = 0;
		}
		Player.seekSpeed += 5;
	} else {
		Player.seekSpeed = 1;
	}
	
	Player.seekTo(Player.seekSpeed, "backwards");
};

Player.seekTo = function(speed, direction){
	if (direction == "forward"){

        if (Player.isVOD)
        {
            // player
            Player.getActivePlayer().play(speed);
            // ui
            $(".seek_speed").html("x"+speed);
        }
        else
        {
            // player
            var seekTarget = Player.getActivePlayer().playPosition + 5000; // go forward 5 seconds
            Player.getActivePlayer().seek(seekTarget);
            // ui
            $(".seek_speed").html("");
        }

	} else if (direction == "backwards"){

		if (speed != 1){

            if (Player.isVOD)
            {
                // player
                Player.getActivePlayer().play(-1 * speed);
                // ui
                $(".seek_speed").html("-x"+speed);
            }
            else
            {
                // player
                var seekTarget = Player.getActivePlayer().playPosition - 5000; // go back 5 seconds
                Player.getActivePlayer().seek(seekTarget);
                // ui
                $(".seek_speed").html("");
            }

		} else {
			Player.getActivePlayer().play(speed);
		}

	}
};

/////////////////
//Player events
/////////////////
Player.setListeners = function(){
	if (Player.playerType == "regular"){
		Player.regular.onReadyStateChange = Player.checkReadyState;
		Player.regular.onBuffering = Player.checkBufferingState;
		Player.regular.onPlayStateChange = Player.checkPlayStateChange;
		Player.regular.onError = Player.checkErrorState;
	} else if (Player.playerType == 'drm'){
		Player.drm.onReadyStateChange = Player.checkReadyState;
		Player.drm.onBuffering = Player.checkBufferingState;
		Player.drm.onPlayStateChange = Player.checkPlayStateChange;
		Player.drm.onError = Player.checkErrorState;
	}
};

Player.checkReadyState = function(){
	// console.log("****** checkReadyState > state = "+this.readyState);
	// 0: not set, 1: loading, 3: loaded enough, 4: loaded all 
	
	Workspace.toggleBuffer("show");
};

Player.checkBufferingState = function(){
	// console.log("****** checkBufferingState");
	
	Workspace.toggleBuffer("show");
};

Player.checkPlayStateChange = function(){
	// console.log("****** checkPlayStateChange() > "+this.playState);
	
	Player.state = this.playState;
	
	switch (Player.state){
		case Player.PLAYING:
		case Player.PAUSED:
			Player.setTotalTime();
			if (Player.positionTimer != "null"){
				Player.positionTimer = setInterval(function(){Player.setCurTime();}, 1000);
			}
			Workspace.toggleBuffer("hide");
			break;
		case Player.FINISHED:
		case Player.STOPPED:
		case Player.ERROR:
			Player.reset();
			//SmartPlugin Youbora
			spYoubora.reload();
			break;
	}
};

Player.checkErrorState = function(){
	//console.log("****** Player.checkErrorState()");	
	Player.reset();
};

/////////////////
//Player display
/////////////////
Player.setCurTime = function(){
	// elapsed time
	var seconds = Player.getActivePlayer().playPosition / 1000;
	var numhours = Math.floor( ((seconds % 31536000) % 86400) / 3600 );
	var numminutes = Math.floor( (((seconds % 31536000) % 86400) % 3600) / 60 );
	var numseconds = Math.floor( (((seconds % 31536000) % 86400) % 3600) % 60 );

	if (numhours <= 9){
		numhours = "0" + numhours;
	}
	if (numminutes <= 9){
		numminutes = "0" + numminutes;
	}
	if (numseconds <= 9){
		numseconds = "0" + numseconds;
	}

    $(".tcurrent").html(numhours+":"+numminutes+":"+numseconds);

    // progress bar
    var percent = (Player.getActivePlayer().playPosition * 1280) / Player.getActivePlayer().playTime;
    $(".videoprogress").css({"width":percent+"px"});
};

Player.setTotalTime = function(){
	var seconds = Player.getActivePlayer().playTime / 1000;
	var numhours = Math.floor( ((seconds % 31536000) % 86400) / 3600 );
	var numminutes = Math.floor( (((seconds % 31536000) % 86400) % 3600) / 60 );
	var numseconds = Math.floor( (((seconds % 31536000) % 86400) % 3600) % 60 );

	if (numhours <= 9){
		numhours = "0" + numhours;
	}
	if (numminutes <= 9){
		numminutes = "0" + numminutes;
	}
	if (numseconds <= 9){
		numseconds = "0" + numseconds;
	}

    $(".ttotal").html(numhours+":"+numminutes+":"+numseconds);
};

document.documentElement.onmousemove = function (e) { 
	e.stopPropagation();
	Workspace.handleVideoControls('show');

	//player footer navigation
	$("#qmenu").removeClass("f_qmenu_selected");
	$("#player_play").removeClass("f_play_selected");
	$("#player_pause").removeClass("f_pause_selected");
	$("#player_stop").removeClass("f_stop_selected");
}