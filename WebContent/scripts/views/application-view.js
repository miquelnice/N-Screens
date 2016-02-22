/**
** Copyright (c) 2013 NicePeopleAtWork
** Author: Adrià Gil
** Define application views.
**/

(function($){
	
/**
** HEADER and FOOTER
**/
NScreens.Views.Header = Backbone.View.extend({

	el: "#header",

	template: new EJS({url: 'scripts/templates/header.ejs'}),

	initialize: function(){
		// models (will be used for SplashScreen View too)
		NScreens.splashScreenModel = new NScreens.Models.SplashScreen();
		NScreens.splashScreenModel.fetch();
		this.model = NScreens.splashScreenModel;

		_.bindAll(this, "render");
		this.model.on("change", this.render, this);
	},

	render: function(){
		this.$el.append( this.template.render(this.model.toJSON()) );
		return this;
	}

});

NScreens.Views.Footer = Backbone.View.extend({

	el: "#footer",

	template: new EJS({url: 'scripts/templates/footer.ejs'}),

	events: {
		"click .f_logout":			"actionLogout",
		"click .f_exit":			"actionExit",
		"click .f_back":			"actionBack",
		"click .f_startTrailer":	"actionStartTrailer",
		"click .f_startMovie": 		"actionStartMovie",
		"click .f_play":			"actionPlay",
		"click .f_pause":			"actionPause",
		"click .f_stop":			"actionStop",
		"click .f_qmenu":		    "actionLaunchQMENU"
		//"click .f_ff":			"actionForward",
		//"click .f_rw":			"actionRewind"
	},

	initialize: function(){
		_.bindAll(this, "render");
		this.render();
	},

	render: function(){
		this.$el.html( this.template.render() );
		return this;
	},

	// actions fired by (mouse) events
	actionLogout: function(){
		Workspace.sessionDestroy();
	},
	actionExit: function(){
		window.NetCastBack();
	},
	actionBack: function(){
		if (NScreens.NavigationMap.page == "bwcheck"){
			NScreens.itemDetailView.closeTest();
		} else if(NScreens.NavigationMap.page == "register"){ //news added
			//NScreens.router.loadSplashScreen();
			//NScreens.router.navigate("splashscreen");
			Workspace.sessionDestroy();
		} else if(NScreens.NavigationMap.page == "channel"){
			//NScreens.router.loadChannel();
			//NScreens.router.navigate("channel");
			window.NetCastBack();
		} else if(NScreens.NavigationMap.page == "registerConfirm"){
			//NScreens.router.loadSplashScreen();
			//NScreens.router.navigate("splashscreen");
			Workspace.sessionDestroy();
		} else if(NScreens.NavigationMap.page == "remember"){
			//NScreens.router.loadSplashScreen();
			//NScreens.router.navigate("splashscreen");
			Workspace.sessionDestroy();
		} else if(NScreens.NavigationMap.page == "modify"){
			NScreens.router.loadChannel();
			NScreens.router.navigate("channel");
		} else if(NScreens.NavigationMap.page == "modifyConfirm"){
			NScreens.router.loadChannel();
			NScreens.router.navigate("channel");
		} else if(NScreens.NavigationMap.page == "detail"){
			NScreens.router.loadChannel();
			NScreens.router.navigate("channel");
		}
	},
	actionStartTrailer: function(){
		NScreens.splashScreenView.startTrailer();
	},
	actionStartMovie: function(){
		NScreens.itemDetailView.startMovie();
	},
	actionPlay: function(){
		Player.handlePlayVideo();
	},
	actionPause: function(){
		Player.handlePauseVideo();
	},
	actionStop: function(){
		Player.handleStopVideo();
		Player.reset();
		//Player.hidePlayer();

		if (Player.isVOD){
			Workspace.setFooter("detail");
		} else {
			Workspace.setFooter("splashscreen");
		}

	},
	actionLaunchQMENU: function(){		
		window.NetCastLaunchQMENU();
	}
	/*actionForward: function(){
		Player.skipForwardVideo();
	},
	actionRewind: function(){
		Player.skipBackwardVideo();
	}*/

});

/**
** SPLASH SCREEN
**/
NScreens.Views.SplashScreen = Backbone.View.extend({

	el: "#container",

	template: new EJS({url: 'scripts/templates/splashscreen.ejs'}),

	loginSubView: null,

	trailerModel: null, // TODO: delete

	events: {
		"click #trailer": "startTrailer",
		"mouseenter #loginAction": "focused",
		"mouseleave #loginAction": "unfocused",
		"mouseenter #userPassword": "focused",
		"mouseleave #userPassword": "unfocused",
		"mouseenter #userLogin": "focused",
		"mouseleave #userLogin": "unfocused",
		"mouseenter #trailer": "focused",
		"mouseleave #trailer": "unfocused",
		"mouseenter #register": "focused",
		"mouseleave #register": "unfocused",
		"mouseenter #remember": "focused",
		"mouseleave #remember": "unfocused",
		"click #register": "avisoLegal"
	},

	initialize: function(){
		// models
		this.model = NScreens.splashScreenModel;

		// subviews
		this.loginSubView = new NScreens.Views.Login({
			model: new NScreens.Models.Session()
		});

		_.bindAll(this, "render");
		this.model.bind("change", this.render, this);
		this.model.bind("change", this.fetchTrailer, this);
	},

	render: function(){
        this.$el.html( this.template.render(this.model.toJSON()) );
		
		//maquetacion chustera
		$(".logo").css({"visibility":"hidden"});
		$(".header").css({"visibility":"hidden"});
		//fin maquetacion chustera

		// subviews
		this.assign(this.loginSubView, "#login");

		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("hide");

		// footer
		Workspace.setFooter("splashscreen");
		
		// focus
		Workspace.setPage("splashscreen");
		Workspace.setFocus("trailer");

		Workspace.toggleBuffer("hide");
		
		return this;
	},

	assign: function(view, selector){
		view.setElement(this.$(selector)).render();
	},
	
	focused: function(e){
		this.removeFocus();
		
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "loginAction"){
			$("#loginAction").addClass("login_button_selected");
		} else if (elem.attr("id") == "userPassword"){
			$("#userPassword").addClass("input_selected");
		} else if (elem.attr("id") == "userLogin"){
			$("#userLogin").addClass("input_selected");
		} else if (elem.attr("id") == "trailer"){
			$("#trailer .video_img").addClass("video_img_selected");
			$("#trailer .play_big").addClass("play_big_selected");
		} else if (elem.attr("id") == "register"){
			$("#register").addClass("register_bt_selected");
		} else if (elem.attr("id") == "remember"){
			$("#remember").addClass("remember_selected");
		}
	},
	
	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "loginAction"){
			$("#loginAction").removeClass("login_button_selected");
		} else if (elem.attr("id") == "userPassword"){
			$("#userPassword").removeClass("input_selected");
		} else if (elem.attr("id") == "userLogin"){
			$("#userLogin").removeClass("input_selected");
		} else if (elem.attr("id") == "trailer"){
			$("#trailer .video_img").removeClass("video_img_selected");
			$("#trailer .play_big").removeClass("play_big_selected");
		} else if (elem.attr("id") == "register"){
			$("#register").removeClass("register_bt_selected");
		} else if (elem.attr("id") == "remember"){
			$("#remember").removeClass("remember_selected");
		}
	},
	
	removeFocus: function(){
		$("#loginAction").removeClass("login_button_selected");
		$("#userPassword").removeClass("input_selected");
		$("#userLogin").removeClass("input_selected");
		$("#trailer .video_img").removeClass("video_img_selected");
		$("#trailer .play_big").removeClass("play_big_selected");
		$("#register .register_bt").removeClass("register_bt_selected");
		$("#remember").removeClass("remember_selected");
	},

	fetchTrailer: function(){
		this.trailerModel = new NScreens.Models.Trailer();
		this.trailerModel.fetch();
	},

	startTrailer: function(){
		//if (Workspace.subscription_ok == true){
			Player.playerType = "regular";
			Workspace.setTrailer(this.trailerModel.get("movie"));
			NScreens.router.loadTheater();
			NScreens.router.navigate("theater");
		/*}else{
			alert("NO ESTAS SUBSCRITO!!!!");
		}*/
	},
	
	avisoLegal: function(){
		NScreens.router.loadAvisoLegal();
		NScreens.router.navigate("avisoLegal");
	}

});

NScreens.Views.Login = Backbone.View.extend({

	el: "#login",

	template: new EJS({url: 'scripts/templates/login.ejs'}),

	events: {
		"click #loginAction": "login",
		"click #userLogin": "focusLogin",
		"click #userPassword": "focusPassword",
		"click #remember": "remember"
	},

	initialize: function(){
		_.bindAll(this, "render");

		$("#bt_accept_popup").click(function(){
			NScreens.splashScreenView.loginSubView.togglePopup(false);
		});
	},

	render: function(){
		this.$el.html( this.template.render() );
		return this;
	},

	login: function(){
		var userLogin = $("#userLogin").val();
		var userPassword = $("#userPassword").val();		
			
		this.model.fetch({
			data: {
				email: userLogin,
				pwd: userPassword
			},
			// use Underscore _.bind for having "this" (NScreens.Views.Login) within the scope
			success: _.bind(function(model, response) {
				this.model.checkAuthenticaiton(response);
				Workspace.globalName = response.data.name;
			}, this)
		});
	},
	
	toggleVK: function(){
		var inputItem = "";
		if (NScreens.NavigationMap.focus == "userPassword"){
			inputItem = "userPassword";
		} else if (NScreens.NavigationMap.focus == "loginAction"){
			inputItem = "userLogin";
		}
		
		if (NScreens.vkEnabled){
			NScreens.vkEnabled = false;
			$("#"+inputItem).blur();
		} else {
			//NScreens.vkEnabled = true;
			$("#"+inputItem).focus();
		}		
	},
	
	togglePopup: function(showPopup){
		if (showPopup){
			// focus
			Workspace.setPage('popup');
			Workspace.setFocus('bt_accept_popup');
			// popup
			$(".popup_text").html("Lo sentimos, el nombre de usuario o la contraseña no son correctos.<br />Vuelve a intentarlo más tarde.");
			$(".popup_opacity").css({'display':'block'});
			$(".popup").css({'display':'block'});
			$(":input").css({'visibility':'hidden'});
		} else {
			// focus
			Workspace.setPage('splashscreen');
			Workspace.setFocus('userLogin');
			// popup
			$(".popup_text").html("Lo sentimos, el nombre de usuario o la contraseña no son correctos.<br />Vuelve a intentarlo más tarde.");
			$(".popup_opacity").css({'display':'none'});
			$(".popup").css({'display':'none'});
			$(":input").css({'visibility':'visible'});
		}
	},

	focusLogin: function(){
		Workspace.removeFocus("trailer");
		Workspace.removeFocus("userLogin");
		Workspace.removeFocus("userPassword");
		
		Workspace.setFocus("loginAction");
			
		NScreens.vkEnabled = true;
		//Workspace.afterIME = true;
	},
	
	focusPassword: function(){
		Workspace.removeFocus("trailer");
		Workspace.removeFocus("userLogin");
		Workspace.removeFocus("loginAction");
		
		Workspace.setFocus("userPassword");
		
		NScreens.vkEnabled = true;
		//Workspace.afterIME = true;
	},
	
	remember: function(){
		NScreens.router.loadRemember();
		NScreens.router.navigate("remember");
	}

});

/**
** CHANNEL
**/
NScreens.Views.Channel = Backbone.View.extend({

	el: "#container",

	logRegSubView: null,
	
	events: {
		"mouseenter #next_page": "focused",
		"mouseleave #next_page": "unfocused",
		"mouseenter #prev_page": "focused",
		"mouseleave #prev_page": "unfocused"
	},
	
	focused: function(e){
		if ($(e.currentTarget).attr("id") == "next_page"){
			$(e.currentTarget).addClass("right_arrow_selected");
		} else if ($(e.currentTarget).attr("id") == "prev_page"){
			$(e.currentTarget).addClass("left_arrow_selected");
		}
	},
	
	unfocused: function(e){
		if ($(e.currentTarget).attr("id") == "next_page"){
			$(e.currentTarget).removeClass("right_arrow_selected");
		} else if ($(e.currentTarget).attr("id") == "prev_page"){
			$(e.currentTarget).removeClass("left_arrow_selected");
		}
	},

	template: new EJS({url: 'scripts/templates/channel.ejs'}),

	initialize: function(){

		// subviews
		this.logRegSubView = new NScreens.Views.LogReg({
			model: new NScreens.Models.LogReg()
		});

		_.bindAll(this, "render");
		this.render();
	},

	render: function(){

		// view
		this.$el.html( this.template.render() );

		// subviews
		this.assign(this.logRegSubView, "#log_reg");
		
		//maquetacion chustera
		$(".logo_home").css({"visibility":"hidden"});
		$(".header").css({"visible":"visible"});
		$(".logo").css({"visibility":"visible"});
		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("hide");
		//fin maquetacion chustera

		// footer
		Workspace.setFooter("channel");
		
		return this;
	},
	
	assign: function(view, selector){
		view.setElement(this.$(selector)).render();
	}

});

/**
** LOG/REGISTER
**/
NScreens.Views.LogReg = Backbone.View.extend({

	el: "#log_reg",

	template: new EJS({url: 'scripts/templates/log_reg.ejs'}),

	events: {
		/*"click #log": "logear",
		"click #reg": "registrar",
		"mouseenter #log": "focused",
		"mouseleave #log": "unfocused",
		"mouseenter #reg": "focused",
		"mouseleave #reg": "unfocused",*/
		"mouseenter #user": "focused",
		"mouseleave #user": "unfocused",
		"click #user_icon": "modificar"
	},

	initialize: function(){
		_.bindAll(this, "render");
	},

	render: function(){
		this.$el.html( this.template.render() );
		$("#user_name").html(Workspace.globalName);
		/*$.ajax({
			type: "POST",
			url: NScreens.ApiPath + "api?channelid=" + NScreens.ChannelId + "&action=loginnew&force200=true&email=fperez@nicepeopleatwork.com&pwd=nice",
			data: {				
			},
			success: function(response){			
				console.log("DATA SERVED="+response.data.name+" - "+Workspace.dada);
				Workspace.globalName = response.data.name;
				$("#user_name").html(Workspace.globalName);				
			},
			dataType: "json"
		});*/

		return this;
	},

	/*logear: function(){
		window.location.href = '#splashscreen';
	},
	
	registrar: function(){
		window.location.href = '#avisoLegal';
	},*/
	
	focused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "log"){
			$("#log").addClass("log_selected");
		} else if (elem.attr("id") == "reg"){
			$("#reg").addClass("reg_selected");
		} else if (elem.attr("id") == "user"){
			$("#user").addClass("user_selected");
		}
	},
	
	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "log"){
			$("#log").removeClass("log_selected");
		} else if (elem.attr("id") == "reg"){
			$("#reg").removeClass("reg_selected");
		} else if (elem.attr("id") == "user"){
			$("#user").removeClass("user_selected");
		}
	},
	
	modificar: function(){
		NScreens.router.loadModify();
		NScreens.router.navigate("modify");
	}
});

NScreens.Views.ChannelItems = Backbone.View.extend({

	el: "#items",

	initialize: function(){
		_.bindAll(this, "renderItem");

		this.collection = new NScreens.Collections.ChannelItems();
		this.collection.bind("all", this.render, this);
		this.collection.fetch();
	},

	renderItem: function(model, index){
		var itemView = new NScreens.Views.ChannelItem({model: model});
		itemView.render();
		$(this.el).append(itemView.el);
		
		if (index == this.collection.length-1){
			// focus
			Workspace.setPage("channel");
			Workspace.setFocus("ch_item_0");
			
			Workspace.toggleBuffer("hide");
		}
	},

	render: function(){
		$(this.el).html(""); // empty the view for pagination before adding new items
		this.collection.each(function(model, index){
			this.renderItem(model, index);
		}, this);
	}

});

NScreens.Views.ChannelItem = Backbone.View.extend({

	events: {
		"click": "loadItem",
		"mouseenter": "focused",
		"mouseleave": "unfocused"
	},
	
	loadItem: function(e){
		var elem = $(e.currentTarget).children().attr("navigate");
		window.location.href = elem;
	},

	focused: function(e){
		this.removeCurrentFocus();
		
		e.preventDefault();
		var elem = $(e.currentTarget).children();
		elem.addClass("active");
		
		// change navigaiton index
		NScreens.NavigationMap.focus = $(e.currentTarget).children().attr('id');
	},

	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget).children();
		elem.removeClass("active");
	},
	
	removeCurrentFocus: function(){
		var totalItems = $("#items").children().length;
		for (var i = 0; i < totalItems; i++){
			$("#ch_item_"+i).removeClass("active");
		}
	},

	render: function(){
		var template = new EJS({url: 'scripts/templates/channel_items.ejs'});
		var html = template.render( this.trim_title(this.model.toJSON()) );
		$(this.el).append(html);
	},

    trim_title: function(jsonModel)
    {
        if (jsonModel.title.length >= 40)
        {
            jsonModel.title = jsonModel.title.substr(0, 37) + "...";
        }

        if (jsonModel.meta.length >= 22)
        {
            jsonModel.meta = jsonModel.meta.substr(0, 19) + "...";
        }

        return jsonModel;
    }

});

/**
** DETAIL
**/
NScreens.Views.Detail = Backbone.View.extend({

	el: "#container",

	logRegSubView: null,

	template: new EJS({url: 'scripts/templates/detail.ejs'}),

	movieModel: null,

	events: {
		"click #video": "startMovie",
		"click #bdtest": "startTest",
		"mouseenter #detail_back": "focused",
		"mouseleave #detail_back": "unfocused",
		"mouseenter #bdtest": "focused",
		"mouseleave #bdtest": "unfocused",
		"mouseenter #video": "focused",
		"mouseleave #video": "unfocused",
		"mouseenter #user": "focused",
		"mouseleave #user": "unfocused",
		"click #user_icon": "modificar"
	},

	initialize: function(){

		// subviews
		this.logRegSubView = new NScreens.Views.LogReg({
			model: new NScreens.Models.LogReg()
		});

		_.bindAll(this, "render");

		// model
		this.model = new NScreens.Models.ItemDetail({contentId: this.options.itemId});
		this.model.bind("change", this.render, this);
		this.model.bind("change", this.fetchMovie, this);
		this.model.fetch();

		$("#bt_accept_popup").click(function(){
			NScreens.itemDetailView.togglePopup(false);
		});
	},

	render: function(){
		// view
		this.$el.html( this.template.render(this.model.toJSON()) );

		// subviews
		this.assign(this.logRegSubView, "#log_reg");

		// footer
		Workspace.setFooter("detail");
		
		// focus
		Workspace.setPage('detail');
		Workspace.setFocus('video');

		// save if for 'back' action in 'theater' view
		NScreens.NavigationMap["page_theater"][0].back = "#channel/item/"+this.model.id;
		
		Workspace.toggleBuffer("hide");
		
		//maquetacion chustera
		$(".col_left").css({"marginTop":"0px"});
		$(".col_right").css({"marginTop":"0px"});
		
		var nice264PluginModel = this.model.toJSON();
		
		//Youbora SmartPlugin
		youboraData.setProperties({
			filename: nice264PluginModel.video,
			content_id: nice264PluginModel.id, 
			content_metadata: { 
				title: nice264PluginModel.title, 
				genre: nice264PluginModel.meta, 
				language: nice264PluginModel.language, 
				year: nice264PluginModel.year, 
				cast: nice264PluginModel.actors, 
				director: nice264PluginModel.director, 
				owner: "NScreens", 
				duration: nice264PluginModel.duration, 
				parental: "", 
				price: "Subscription",
				rating: "",
				audioType: "", 
				audioChannels: ""
			},
			transaction_type: "Subscription", 
			quality: nice264PluginModel.video, 
			content_type: nice264PluginModel.category, 
			device: { 
				manufacturer: "LG", 
				type: Workspace.productType, 
				year: Workspace.yearFirmware, 
				firmware: Workspace.yearFirmware 
			}
		});

		return this;
	},

	assign: function(view, selector){
		view.setElement(this.$(selector)).render();
	},

	update: function(params){
		this.model = new NScreens.Models.ItemDetail({contentId: params.itemIdUpdate});
		this.model.bind("change", this.render, this);
		this.model.bind("change", this.fetchMovie, this);
		this.model.fetch();
	},
	
	focused: function(e){
		this.removeFocus();
		
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr('id') == "video"){
			$("#video .video_img_in").addClass("video_img_in_selected");
			$("#video .play_big_in").addClass("play_big_in_selected");
		} else if (elem.attr('id') == "detail_back"){
			$("#detail_back").addClass("bt_back_selected");
		} else if (elem.attr('id') == "bdtest"){
			$("#bdtest").addClass("test_selected");
		} else if (elem.attr('id') == "user"){
			$("#user").addClass("user_selected");
		}
	},
	
	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr('id') == "video"){
			$("#video .video_img_in").removeClass("video_img_in_selected");
			$("#video .play_big_in").removeClass("play_big_in_selected");
		} else if (elem.attr('id') == "detail_back"){
			$("#detail_back").removeClass("bt_back_selected");
		} else if (elem.attr('id') == "bdtest"){
			$("#bdtest").removeClass("test_selected");
		} else if (elem.attr('id') == "user"){
			$("#user").removeClass("user_selected");
		}
	},
	
	removeFocus: function(){
		$("#detail_back").removeClass("bt_back_selected");
		$("#bdtest").removeClass("test_selected");
		$("#video .video_img_in").removeClass("video_img_in_selected");
		$("#video .play_big_in").removeClass("play_big_in_selected");
		$("#user").removeClass("user_selected");
	},

	fetchMovie: function(){
		this.movieModel = new NScreens.Models.VODMovie();
		this.movieModel.fetch();
	},

	startMovie: function(){
		if(Workspace.subscription_ok == false){
			//no subscribed, open popup
			NScreens.itemDetailView.togglePopup(true);
		}else{
			Player.playerType = "drm";
			Workspace.setWVMovie(this.movieModel.get("movie"), this.movieModel.get("license"));
			NScreens.router.loadTheater();
			NScreens.router.navigate('theater');
		}
		
	},
	
	startTest: function(){
		// load bandwidth & ui
		$("#bwcheck").css({'visibility':'visible'});
		$("#bwcheck").load("bwcheck/index.html?system=encopa"); // http://nicespeedtest.com/embed/white/index.html?system=encopa - bwcheck/index.html?system=encopa
		// focus
		Workspace.setFooter('bwcheck');
		Workspace.setPage('bwcheck');
		Workspace.setFocus('bwcheck');
	},
	
	doTest: function(){
		startupDraw(true);
        $(this).removeAttr('onclick');
        startTesting();
        intervalPpal = setInterval(drawSmall,34);
	},
	
	closeTest: function(){
		// bandwidth & ui
		$("#bwcheck").css({'visibility':'hidden'});
		$("#bwcheck").html("");
		// focus
		Workspace.setFooter('detail');
		Workspace.setPage('detail');
		Workspace.setFocus('bdtest');
	},
	
	modificar: function(){
		NScreens.router.loadModify();
		NScreens.router.navigate("modify");
	},

	togglePopup: function(showPopup){
		if (showPopup){
			// focus
			Workspace.setPage('popup_subscription');
			Workspace.setFocus('bt_accept_popup');
			// popup
			$(".popup_text").html("Este es un contenido de pago. Subscríbete o renueva tu subscripción en http://"+QueryString.getChannelName()+".tv para visualizarlo.");
			$(".popup_opacity").css({'display':'block'});
			$(".popup").css({'display':'block'});
			$(":input").css({'visibility':'hidden'});
		} else {
			// focus
			Workspace.setPage('detail');
			Workspace.setFocus('video');
			// popup
			$(".popup_text").html("Este es un contenido de pago. Subscríbete o renueva tu subscripción en http://"+QueryString.getChannelName()+".tv para visualizarlo.");
			$(".popup_opacity").css({'display':'none'});
			$(".popup").css({'display':'none'});
			$(":input").css({'visibility':'visible'});
		}
	}

});

/**
** PLAYBACK
**/
NScreens.Views.Theater = Backbone.View.extend({

	el: "#videoPlayer",

	template: new EJS({url: 'scripts/templates/theater.ejs'}),

	initialize: function(){
		_.bindAll(this, "render");
		this.render();
	},

	render: function(){
		// object pluginPlayer is always below the content
		// hide all layers except the ones that belongs to Theater view
		$("#wrapper").css({"background-color":"transparent"});
		$("#header").hide();
		$("#container").hide();
		// render the view
		this.$el.html( this.template.render({playerType: Player.playerType}) );
		// footer
		Workspace.setFooter("theater");
		// focus
		Workspace.setPage('theater');
		Workspace.setFocus('videoPlayerControls');
		// start video playback
		Player.init();
		Player.handlePlayVideo();

		Workspace.toggleBuffer("hide");
		
		return this;
	},
	
	close: function(){
		$("#videoPlayerControls").remove();
		$("#video_player").remove();
		$("#video_player_drm").remove();
	}

});
/**
** AGE POPUP
**/
NScreens.Views.Age = Backbone.View.extend({

	el: "#modal_age",

	template: new EJS({url: 'scripts/templates/age.ejs'}),
	
	events: {
		"click #accept_age": "aceptarAge",
		"click #rechazar_age": "rechazarAge",
		"mouseenter #accept_age": "focused",
		"mouseleave #accept_age": "unfocused",
		"mouseenter #rechazar_age": "focused",
		"mouseleave #rechazar_age": "unfocused"	
	},


	initialize: function(){
		_.bindAll(this, "render");
		this.render();
	},

	focused: function(e){
		//this.removeFocus();
		
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "accept_age"){
			$("#accept_age").addClass("modal_bt_age_selected");
		} else if (elem.attr("id") == "rechazar_age"){
			$("#rechazar_age").addClass("modal_bt_age_selected");
		}
	},

	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "accept_age"){
			$("#accept_age").removeClass("modal_bt_age_selected");
		} else if (elem.attr("id") == "rechazar_age"){
			$("#rechazar_age").removeClass("modal_bt_age_selected");
		}
	},

	render: function(){
		// object pluginPlayer is always below the content
		// hide all layers except the ones that belongs to age view

		// render the view
		this.$el.html( this.template.render() );

		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("show");

		// footer
		Workspace.setFooter("age");
		// focus
		Workspace.setPage('age');
		Workspace.setFocus('accept_age');
		
		Workspace.toggleBuffer("hide");
				
		return this;
	},
	
	aceptarAge: function(){
		window.location.href = '#register';
		Workspace.toggleAge("hide");
	},
	
	rechazarAge: function(){
		//it comes from splashscreen or channel
		//console.log("DONDE VA="+history.go(-1));	
		//window.location.href = '#channel';
		//window.location.href = '#splashscreen';
		Workspace.toggleAge("hide");
	}
});
/**
** LEGAL ADVICE
**/
NScreens.Views.AvisoLegal = Backbone.View.extend({

	el: "#modal_aviso",

	template: new EJS({url: 'scripts/templates/avisoLegal.ejs'}),
	
	events: {
		"click #accept_avisolegal": "aceptarAvisoLegal",
		"click #rechazar_avisolegal": "rechazarAvisoLegal",
		"mouseenter #accept_avisolegal": "focused",
		"mouseleave #accept_avisolegal": "unfocused",
		"mouseenter #rechazar_avisolegal": "focused",
		"mouseleave #rechazar_avisolegal": "unfocused",		
		"click #up_avisolegal": "upAvisoLegal",
		"click #down_avisolegal": "downAvisoLegal",
		"mouseenter #up_avisolegal": "focused",
		"mouseleave #up_avisolegal": "unfocused",
		"mouseenter #down_avisolegal": "focused",
		"mouseleave #down_avisolegal": "unfocused",
		
	},

	initialize: function(){
		_.bindAll(this, "render");
		this.render();
	},

	focused: function(e){
		//this.removeFocus();
		
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "accept_avisolegal"){
			$("#accept_avisolegal").addClass("modal_legal_bt_selected");
		} else if (elem.attr("id") == "rechazar_avisolegal"){
			$("#rechazar_avisolegal").addClass("modal_legal_bt_selected");
		} else if (elem.attr("id") == "up_avisolegal"){
			$("#up_avisolegal").addClass("modal_legal_bt_selected");
		} else if (elem.attr("id") == "down_avisolegal"){
			$("#down_avisolegal").addClass("modal_legal_bt_selected");
		}
		
	},

	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "accept_avisolegal"){
			$("#accept_avisolegal").removeClass("modal_legal_bt_selected");
		} else if (elem.attr("id") == "rechazar_avisolegal"){
			$("#rechazar_avisolegal").removeClass("modal_legal_bt_selected");
		} else if (elem.attr("id") == "up_avisolegal"){
			$("#up_avisolegal").removeClass("modal_legal_bt_selected");
		} else if (elem.attr("id") == "down_avisolegal"){
			$("#down_avisolegal").removeClass("modal_legal_bt_selected");
		}
		
	},

	render: function(){
		// object pluginPlayer is always below the content
		// hide all layers except the ones that belongs to AvisoLegal view

		// render the view
		this.$el.html( this.template.render() );

		Workspace.toggleAvisoLegal("show");
		Workspace.toggleAge("hide");

		// footer
		Workspace.setFooter("avisolegal");
		// focus
		Workspace.setPage('avisolegal');
		Workspace.setFocus('accept_avisolegal');	

		$("#register").removeClass("register_bt_selected");

		Workspace.toggleBuffer("hide");		
		
		return this;
	},
	
	aceptarAvisoLegal: function(){
		if(QueryString.getChannelName() == "encopa"){
			window.location.href = '#age';
		}else{
			window.location.href = '#register';	
		}
	},
	
	rechazarAvisoLegal: function(){
		//it comes from splashscreen or channel
		//console.log("DONDE VA="+history.go(-1));	
		//window.location.href = '#channel';
		//window.location.href = '#splashscreen';
		Workspace.toggleAvisoLegal("hide");
	}, 
	
	upAvisoLegal: function(){
		NScreens.alto = NScreens.alto - 100;
		$(".modal_legal_text").animate({scrollTop:NScreens.alto+"px"});			
		if (NScreens.alto <= 0)
		{
			NScreens.alto = 0;
		}
		//console.log("SUBIR---->"+NScreens.alto);
	
	},

	downAvisoLegal: function(){
		NScreens.alto = NScreens.alto + 100;
		$(".modal_legal_text").animate({scrollTop:NScreens.alto+"px"});			
		if (NScreens.alto >= modal_legal_text.scrollHeight - modal_legal_text.clientHeight)
		{
			NScreens.alto = modal_legal_text.scrollHeight - modal_legal_text.clientHeight;
		}
		//console.log("ALTO SUMANDO---->"+NScreens.alto+" SCROLL HEIGHT "+modal_legal_text.scrollHeight+" CLIENT HEIGHT "+modal_legal_text.clientHeight);
	}
});
/**
** USER REGISTRATION
**/
NScreens.Views.Register = Backbone.View.extend({
	el: "#container",
	
	template: new EJS({url: 'scripts/templates/register.ejs'}),

	events: {
		"click #registerAction": "registrar",
		//"submit form": "registrar",
		"mouseenter #registerName": "focused",
		"mouseleave #registerName": "unfocused",
		"mouseenter #registerLastname": "focused",
		"mouseleave #registerLastname": "unfocused",
		"mouseenter #registerEmail": "focused",
		"mouseleave #registerEmail": "unfocused",
		//"mouseenter #registerGender": "focused",
		"mouseenter #registerGenderM": "focused",
		"mouseleave #registerGenderM": "unfocused",
		"mouseenter #registerGenderF": "focused",
		"mouseleave #registerGenderF": "unfocused",
		"mouseenter #registerCountry": "focused",
		"mouseleave #registerCountry": "unfocused",
		"mouseenter #registerCP": "focused",
		"mouseleave #registerCP": "unfocused",
		"mouseenter #registerPwd": "focused",
		"mouseleave #registerPwd": "unfocused",
		"mouseenter #registerRPwd": "focused",
		"mouseleave #registerRPwd": "unfocused",
		"mouseenter #registerAction": "focused",
		"mouseleave #registerAction": "unfocused",
		"click #registerName": "onfocusregisterName",
		"click #registerLastname": "onfocusregisterLastname",
		"click #registerEmail": "onfocusregisterEmail",
		//"focus #registerGender": "onfocusregisterGender",
		"click #registerGenderM": "onfocusregisterGenderM",
		"click #registerGenderF": "onfocusregisterGenderF",
		"click #registerCountry": "onfocusregisterCountry",
		"click #registerCP": "onfocusregisterCP",
		"click #registerPwd": "onfocusregisterPwd",
		"click #registerRPwd": "onfocusregisterRPwd"
	},

	initialize: function(){
		_.bindAll(this, "render");
		this.render();

		$("#bt_accept_popup").click(function(){
			NScreens.registerView.togglePopup(false);
		});
		
	},
	
	focused: function(e){
		//this.removeFocus();
		
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "registerName"){
			$("#registerName").addClass("input_selected");
		} else if (elem.attr("id") == "registerLastname"){
			$("#registerLastname").addClass("input_selected");
		} else if (elem.attr("id") == "registerEmail"){
			$("#registerEmail").addClass("input_selected");
			//
		} else if (elem.attr("id") == "registerGenderM"){
			$("#registerGenderM").prop("checked", true);
		} else if (elem.attr("id") == "registerGenderF"){
			$("#registerGenderF").prop("checked", true);
			//
		} else if (elem.attr("id") == "registerCountry"){
			$("#registerCountry").addClass("input_selected");
		} else if (elem.attr("id") == "registerCP"){
			$("#registerCP").addClass("input_selected");
		} else if (elem.attr("id") == "registerPwd"){
			$("#registerPwd").addClass("input_selected");
		} else if (elem.attr("id") == "registerRPwd"){
			$("#registerRPwd").addClass("input_selected");
		} else if (elem.attr("id") == "registerAction"){
			$("#registerAction").addClass("send_register_selected");
		}
	},
	
	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "registerName"){
			$("#registerName").removeClass("input_selected");
		} else if (elem.attr("id") == "registerLastname"){
			$("#registerLastname").removeClass("input_selected");
		} else if (elem.attr("id") == "registerEmail"){
			$("#registerEmail").removeClass("input_selected");
		/*} else if (elem.attr("id") == "registerGenderM"){
			$("#registerGenderM").prop("checked", false);
		} else if (elem.attr("id") == "registerGenderF"){
			$("#registerGenderF").prop("checked", false);*/
		} else if (elem.attr("id") == "registerCountry"){
			$("#registerCountry").removeClass("input_selected");
		} else if (elem.attr("id") == "registerCP"){
			$("#registerCP").removeClass("input_selected");
		} else if (elem.attr("id") == "registerPwd"){
			$("#registerPwd").removeClass("input_selected");
		} else if (elem.attr("id") == "registerRPwd"){
			$("#registerRPwd").removeClass("input_selected");
		} else if (elem.attr("id") == "registerAction"){
			$("#registerAction").removeClass("send_register_selected");
		}
	},

	render: function(){
		Workspace.toggleBuffer("hide");		

		this.$el.html( this.template.render() );

		//maquetacion chustera
		$(".logo_home").css({"visibility":"visible"});
		$(".header").css({"visible":"visible"});
		$(".logo").css({"visibility":"visible"});
		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("hide");
		//fin maquetacion chustera

		// focus
		Workspace.setFooter("register");		
		Workspace.setPage('register');
		Workspace.setFocus('registerName');

		//focus gender
		$("#registerGenderM").attr("checked", true);
		$("#registerGenderF").attr("checked", false);

		return this;
	},
	
	onfocusregisterName: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerEmail");
		//Workspace.removeFocus("registerGenderM");
		//Workspace.removeFocus("registerGenderF");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerName");
			
		NScreens.vkEnabled = true;
	},
	
	onfocusregisterLastname: function(){
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerEmail");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerLastname");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterEmail: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerName");
		if($("#registerGenderM").checked){
			$("#registerGenderF").prop("checked", false);
		}else{
			$("#registerGenderM").prop("checked", false)
			$("#registerGenderF").prop("checked", true);
		}

		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerEmail");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterGenderM: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerEmail");
		if($("#registerGenderM").checked){
			$("#registerGenderF").prop("checked", false);
		}else{
			$("#registerGenderM").prop("checked", false)
			$("#registerGenderF").prop("checked", true);
		}

		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerGenderM");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterGenderF: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerEmail");
		if($("#registerGenderM").checked){
			$("#registerGenderF").prop("checked", false);
		}else{
			$("#registerGenderM").prop("checked", false)
			$("#registerGenderF").prop("checked", true);
		}
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerGenderF");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterCountry: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerEmail");
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerCountry");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterCP: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerEmail");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerCP");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterPwd: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerEmail");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerRPwd");
		Workspace.removeFocus("registerAction");
		
		Workspace.setFocus("registerPwd");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterRPwd: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerEmail");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("registerPwd");
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerAction");

		Workspace.setFocus("registerRPwd");
			
		NScreens.vkEnabled = true;
	},
	
	toggleVK: function(){
		var inputItem = "";
		if (NScreens.NavigationMap.focus == "registerName"){
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
		}
		
		if (NScreens.vkEnabled){
			NScreens.vkEnabled = false;
			$("#"+inputItem).blur();
		} else {
			//NScreens.vkEnabled = true;
			$("#"+inputItem).focus();
		}
		
	},
	
	registrar: function(){
	//onSubmit: function(e) {
		var registerName = $("#registerName").val();
		var registerLastname = $("#registerLastname").val();
		var registerEmail = $("#registerEmail").val();

		if($("#registerGenderM").attr("checked")== true){
			var registerGender = $("#registerGenderM").val();
		}else{
			var registerGender = $("#registerGenderF").val();
		}

		var registerCountry = $("#registerCountry").val();
		var registerCP = $("#registerCP").val();
		var registerPwd = $("#registerPwd").val();
		var registerRPwd = $("#registerRPwd").val();

		//console.log("SEND FORM ====>"+registerName+" "+registerGender+" "+registerLastname+" "+registerEmail+" "+registerCountry+" "+registerCP+" "+registerPwd+" "+registerRPwd);

		$.ajax({
			type: "POST",
			url: NScreens.ApiPath + "api_registration",
			data: {				
				name: $.trim(registerName),
				surname: $.trim(registerLastname),
				cp: $.trim(registerCP),				
				country: $.trim(registerCountry),
				channel_id: QueryString.getChannelId(),
				email: $.trim(registerEmail),
				password: $.trim(registerPwd),
				password2: $.trim(registerRPwd),
				sexo : registerGender,	
				accept: "1",
				checkedad: "1"
			},
			success: function(data){			
				//console.log("USER CREATED OK!!");
				window.location.href = '#registerConfirm';
			},
			error: function(data){
				//console.log($.parseJSON(data.responseText).message);				
				var dataResponse = $.parseJSON(data.responseText).message[0];
				$(".popup_text").html(dataResponse);
				Workspace.setPage('popup_register');
				Workspace.setFocus('bt_accept_popup');
				$(".popup_opacity").css({'display':'block'});
				$(".popup").css({'display':'block'});
				$(":input").css({'visibility':'hidden'});
			},
			dataType: "json"
		});
	},
	
	togglePopup: function(showPopup){
		if (showPopup){
			// focus
			Workspace.setPage('popup_register');
			Workspace.setFocus('bt_accept_popup');
			// popup
			$(".popup_text").html("Debes rellenar todos los campos del formulario.");
			$(".popup_opacity").css({'display':'block'});
			$(".popup").css({'display':'block'});
			$(":input").css({'visibility':'hidden'});
		} else {
			// focus
			Workspace.setPage('register');
			Workspace.setFocus('registerName');
			// popup
			$(".popup_text").html("Debes rellenar todos los campos del formulario.");
			$(".popup_opacity").css({'display':'none'});
			$(".popup").css({'display':'none'});
			$(":input").css({'visibility':'visible'});
			$("#registerAction").removeClass('send_register_selected');

			$("#registerLastname").removeClass('input_selected');
			$("#registerCP").removeClass('input_selected');
			$("#registerCountry").removeClass('input_selected');
			$("#registerEmail").removeClass('input_selected');
			$("#registerregisterPwd").removeClass('input_selected');
			$("#registerregisterRPwd").removeClass('input_selected');
		}
	}
});

/**
** AGE POPUP
**/
NScreens.Views.RegistAcces = Backbone.View.extend({

	el: "#container",
	
	template: new EJS({url: 'scripts/templates/register_confirm.ejs'}),
	
	events: {
		"click #accessAction": "acceder",
		"mouseenter #accessAction": "focused",
		"mouseleave #accessAction": "unfocused"	
	},


	initialize: function(){
		_.bindAll(this, "render");
		this.render();
	},

	focused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "accessAction"){
			$("#accessAction").addClass("send_access_selected");
		}
	},

	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "accessAction"){
			$("#accessAction").removeClass("send_access_selected");
		} 
	},

	render: function(){
		// render the view
		this.$el.html( this.template.render() );

		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("hide");

		// footer
		Workspace.setFooter("register");		
		Workspace.setPage('registerConfirm');
		Workspace.setFocus('accessAction');

		Workspace.toggleBuffer("hide");
		
		return this;
	},
	
	acceder: function(){
		Workspace.sessionDestroy();
		//window.location.href = '#splashscreen';
	}
});

/**
** REMEMBER PASSWORD
**/
NScreens.Views.Remember = Backbone.View.extend({

	el: "#container",
	
	template: new EJS({url: 'scripts/templates/remember.ejs'}),
	
	events: {
		"click #rememberAction": "recuperar",
		"mouseenter #rememberAction": "focused",
		"mouseleave #rememberAction": "unfocused",
		"mouseenter #recuperarPassword": "focused",
		"mouseleave #recuperarPassword": "unfocused",
		"click #recuperarPassword": "clickRecuperarPassword"
	},


	initialize: function(){
		//_.bindAll(this, "render");
		this.render();

		$("#bt_accept_popup").click(function(){
			NScreens.rememberView.togglePopup(false);
		});
	},

	focused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "rememberAction"){
			$("#rememberAction").addClass("send_remember_selected");
			$("#recuperarPassword").removeClass("input_selected");
		} else if(elem.attr("id") == "recuperarPassword"){
			$("#recuperarPassword").addClass("input_selected");
			$("#rememberAction").removeClass("send_remember_selected");
		}
	},

	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "rememberAction"){
			$("#rememberAction").removeClass("send_remember_selected");
		} else if(elem.attr("id") == "recuperarPassword"){
			$("#recuperarPassword").removeClass("input_selected");
		}
	},
	
	clickRecuperarPassword: function(e){
		Workspace.removeFocus("rememberAction");		
		Workspace.setFocus("recuperarPassword");				
		NScreens.vkEnabled = true;
	},

	render: function(){
		// render the view
		this.$el.html( this.template.render() );
		
		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("hide");

		// footer
		Workspace.setFooter("remember");		
		Workspace.setPage('remember');
		Workspace.setFocus('recuperarPassword');	

		Workspace.toggleBuffer("hide");

		//maquetacion chustera
		$(".logo_home").css({"visibility":"hidden"});
		$(".header").css({"visible":"visible"});
		$(".logo").css({"visibility":"visible"});
		//fin maquetacion chustera
		
		return this;
	},

	toggleVK: function(){
		var inputItem = "";
		if (NScreens.NavigationMap.focus == "recuperarPassword"){
			inputItem = "recuperarPassword";
		} else if (NScreens.NavigationMap.focus == "rememberAction"){
			inputItem = "rememberAction";
		}
		
		if (NScreens.vkEnabled){
			NScreens.vkEnabled = false;
			$("#"+inputItem).blur();
		} else {
			//NScreens.vkEnabled = true;
			$("#"+inputItem).focus();
		}
		
	},
	
	recuperar: function(){
		var recuperarPassword = $("#recuperarPassword").val();
		
		$.ajax({
			type: "POST",
			url: NScreens.ApiPath + "api_forgotpassword",
			data: {				
				channel_id: QueryString.getChannelId(),
				email: $.trim(recuperarPassword)
			},
			success: function(data){
				//function
				if(recuperarPassword != ""){
					//console.log("RECUPERAR PASSWORD OK!!");
					//window.location.href = '#splashscreen';
					Workspace.sessionDestroy();
				}else{
					NScreens.rememberView.togglePopup(true);
				}
			},
			error: function(data){				
				var dataResponse = $.parseJSON(data.responseText).message; //message[0]
				$(".popup_text").html(dataResponse);
				Workspace.setPage('popup_remember');
				Workspace.setFocus('bt_accept_popup');
				$(".popup_opacity").css({'display':'block'});
				$(".popup").css({'display':'block'});
				$(":input").css({'visibility':'hidden'});
			},
			dataType: "json"
		});
	},

	togglePopup: function(showPopup){
		if (showPopup){
			// focus
			Workspace.setPage('popup_remember');
			Workspace.setFocus('bt_accept_popup');
			// popup
			$(".popup_text").html("Debes introducir una dirección de correo.");
			$(".popup_opacity").css({'display':'block'});
			$(".popup").css({'display':'block'});
			$(":input").css({'visibility':'hidden'});
		} else {
			// focus
			Workspace.setPage('remember');
			Workspace.setFocus('recuperarPassword');
			// popup
			$(".popup_text").html("Debes introducir una dirección de correo.");
			$(".popup_opacity").css({'display':'none'});
			$(".popup").css({'display':'none'});
			$(":input").css({'visibility':'visible'});
			$("#rememberAction").removeClass('send_remember_selected');
		}
	}
});

/**
** USER MODIFICATION
**/
NScreens.Views.Modify = Backbone.View.extend({
	el: "#container",
	
	template: new EJS({url: 'scripts/templates/modify.ejs'}),

	events: {
		"click #modifyAction": "modify",
		"mouseenter #registerName": "focused",
		"mouseleave #registerName": "unfocused",
		"mouseenter #registerLastname": "focused",
		"mouseleave #registerLastname": "unfocused",
		"mouseenter #registerCountry": "focused",
		"mouseleave #registerCountry": "unfocused",
		"mouseenter #registerCP": "focused",
		"mouseleave #registerCP": "unfocused",		
		"mouseenter #modifyAction": "focused",
		"mouseleave #modifyAction": "unfocused",
		"click #registerName": "onfocusregisterName",
		"click #registerLastname": "onfocusregisterLastname",
		"click #registerCountry": "onfocusregisterCountry",
		"click #registerCP": "onfocusregisterCP"
	},

	initialize: function(){
		_.bindAll(this, "render");
		this.render();

		$("#bt_accept_popup").click(function(){
			NScreens.modifyView.togglePopup(false);
		});
		
	},
	
	focused: function(e){
		//this.removeFocus();
		
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "registerName"){
			$("#registerName").addClass("input_selected");
		} else if (elem.attr("id") == "registerLastname"){
			$("#registerLastname").addClass("input_selected");		
		} else if (elem.attr("id") == "registerCountry"){
			$("#registerCountry").addClass("input_selected");
		} else if (elem.attr("id") == "registerCP"){
			$("#registerCP").addClass("input_selected");
		} else if (elem.attr("id") == "modifyAction"){
			$("#modifyAction").addClass("send_modify_selected");
		}
	},
	
	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "registerName"){
			$("#registerName").removeClass("input_selected");
		} else if (elem.attr("id") == "registerLastname"){
			$("#registerLastname").removeClass("input_selected");
		} else if (elem.attr("id") == "registerCountry"){
			$("#registerCountry").removeClass("input_selected");
		} else if (elem.attr("id") == "registerCP"){
			$("#registerCP").removeClass("input_selected");
		} else if (elem.attr("id") == "modifyAction"){
			$("#modifyAction").removeClass("send_modify_selected");
		}
	},

	render: function(){
		Workspace.toggleBuffer("hide");		

		this.$el.html( this.template.render() );

		//maquetacion chustera
		$(".logo_home").css({"visibility":"visible"});
		$(".header").css({"visible":"visible"});
		$(".logo").css({"visibility":"visible"});
		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("hide");
		//fin maquetacion chustera

		// focus
		Workspace.setFooter("modify");		
		Workspace.setPage('modify');
		Workspace.setFocus('registerName');

		//obtain data and show in modify form
		$("#registerName").val(Workspace.globalName);
		$("#registerLastname").val(Workspace.globalSurname);
		$("#registerCP").val(Workspace.globalCP);
		$("#registerCountry").val(Workspace.globalCountry);

		return this;
	},
	
	onfocusregisterName: function(){
		Workspace.removeFocus("registerLastname");		
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("modifyAction");		
		Workspace.setFocus("registerName");
			
		NScreens.vkEnabled = true;
	},
	
	onfocusregisterLastname: function(){
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("modifyAction");		
		Workspace.setFocus("registerLastname");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterCountry: function(){
		Workspace.removeFocus("registerLastname");		
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("registerCP");
		Workspace.removeFocus("modifyAction");
		
		Workspace.setFocus("registerCountry");
			
		NScreens.vkEnabled = true;
	},
	onfocusregisterCP: function(){
		Workspace.removeFocus("registerLastname");
		Workspace.removeFocus("registerCountry");
		Workspace.removeFocus("registerName");
		Workspace.removeFocus("modifyAction");
		
		Workspace.setFocus("registerCP");
			
		NScreens.vkEnabled = true;
	},
		
	toggleVK: function(){
		var inputItem = "";
		if (NScreens.NavigationMap.focus == "registerName"){
			inputItem = "registerName";
		} else if (NScreens.NavigationMap.focus == "registerLastname"){
			inputItem = "registerLastname";		
		} else if (NScreens.NavigationMap.focus == "registerCountry"){
			inputItem = "registerCountry";
		} else if (NScreens.NavigationMap.focus == "registerCP"){
			inputItem = "registerCP";
		}
		
		if (NScreens.vkEnabled){
			NScreens.vkEnabled = false;
			$("#"+inputItem).blur();
		} else {
			//NScreens.vkEnabled = true;
			$("#"+inputItem).focus();
		}
		
	},
	
	modify: function(){
		var registerName = $("#registerName").val();
		var registerLastname = $("#registerLastname").val();		
		var registerCountry = $("#registerCountry").val();
		var registerCP = $("#registerCP").val();

		//save data modified to update in the view
		Workspace.globalName = registerName;
		Workspace.globalSurname = registerLastname;
		Workspace.globalCP = registerCP;
		Workspace.globalCountry = registerCountry;

		//console.log("DATOS LLEGAN OK="+Workspace.globalUserId+" "+Workspace.globalName+" "+Workspace.globalSurname+" "+Workspace.globalCP+" "+Workspace.globalCountry);
		$.ajax({
			type: "POST",
			url: NScreens.ApiPath + "changeuserdata",
			data: {				
				userid: Workspace.globalUserId,
				name:$.trim(registerName),
				surname: $.trim(registerLastname),
				cp: $.trim(registerCP),
				country:$.trim(registerCountry)
			},
			success: function(data){			
				//console.log("USER MODIFIED OK!!");
				window.location.href = '#modifyConfirm';
			},
			error: function(data){
				//console.log($.parseJSON(data.responseText).message);				
				var dataResponse = $.parseJSON(data.responseText).message;
				$(".popup_text").html(dataResponse);
				Workspace.setPage('popup_modify');
				Workspace.setFocus('bt_accept_popup');
				$(".popup_opacity").css({'display':'block'});
				$(".popup").css({'display':'block'});
				$(":input").css({'visibility':'hidden'});
			},
			dataType: "json"
		});
	},
	
	togglePopup: function(showPopup){
		if (showPopup){
			// focus
			Workspace.setPage('popup_modify');
			Workspace.setFocus('bt_accept_popup');
			// popup
			$(".popup_text").html("Debes rellenar todos los campos del formulario.");
			$(".popup_opacity").css({'display':'block'});
			$(".popup").css({'display':'block'});
			$(":input").css({'visibility':'hidden'});
		} else {
			// focus
			Workspace.setPage('modify');
			Workspace.setFocus('registerName');
			// popup
			$(".popup_text").html("Debes rellenar todos los campos del formulario.");
			$(".popup_opacity").css({'display':'none'});
			$(".popup").css({'display':'none'});
			$(":input").css({'visibility':'visible'});
			$("#modifyAction").removeClass('send_modify_selected');
		}
	}
});

NScreens.Views.ModifyAcces = Backbone.View.extend({

	el: "#container",
	
	template: new EJS({url: 'scripts/templates/modify_confirm.ejs'}),
	
	events: {
		"click #modify_accessAction": "acceder",
		"mouseenter #modify_accessAction": "focused",
		"mouseleave #modify_accessAction": "unfocused"	
	},


	initialize: function(){
		_.bindAll(this, "render");
		this.render();
	},

	focused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "modify_accessAction"){
			$("#modify_accessAction").addClass("send_modify_access_selected");
		}
	},

	unfocused: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget);
		if (elem.attr("id") == "modify_accessAction"){
			$("#modify_accessAction").removeClass("send_modify_access_selected");
		} 
	},

	render: function(){
		// render the view
		this.$el.html( this.template.render() );

		Workspace.toggleAvisoLegal("hide");
		Workspace.toggleAge("hide");

		// footer
		Workspace.setFooter("modify");		
		Workspace.setPage('modifyConfirm');
		Workspace.setFocus('modify_accessAction');

		Workspace.toggleBuffer("hide");
		
		return this;
	},
	
	acceder: function(){
		//window.location.href = '#channel';
		NScreens.router.loadChannel();
		NScreens.router.navigate("channel");
	}
});

})(jQuery);