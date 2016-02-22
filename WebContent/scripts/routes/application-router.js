/**
** Copyright (c) 2013 NicePeopleAtWork
** Author: Adrià Gil
** Define application states.
**/

(function($){

NScreens.Routers.ApplicationRouter = Backbone.Router.extend({

	routes: {
		""						: "loadApplication",
		"splashscreen"			: "loadSplashScreen",
		"channel"				: "loadChannel",
		"channel/page/*page"	: "loadChannelPage",
		"channel/item/*id"		: "loadDetails",
		"theater"				: "loadTheater",
		"age"					: "loadAge",
		"avisoLegal"			: "loadAvisoLegal",
		"register"				: "loadRegister",
		"registerConfirm"		: "loadRegisterConfirm",
		"remember"	            : "loadRemember",
		"modify"				: "loadModify",
		"modifyConfirm"			: "loadModifyConfirm"
	},

	loadApplication: function(params){
		// console.log("[ROUTER] state loadApplication");
		Workspace.toggleBuffer("show");

		// check user session
		if (Workspace.sessionCheck()){
			NScreens.router.loadChannel();
			NScreens.router.navigate('channel');
		} else {
			NScreens.router.loadSplashScreen();
			NScreens.router.navigate('splashscreen');
		}
	},

	loadSplashScreen: function(params){
		// console.log("[ROUTER] state loadSplashScreen");
		Workspace.toggleBuffer("show");

		// view
		NScreens.splashScreenView = new NScreens.Views.SplashScreen();
	},

	loadChannel: function(params){
		// console.log("[ROUTER] state loadChannel");
		Workspace.toggleBuffer("show");

		// view
		NScreens.channelView = new NScreens.Views.Channel();
		NScreens.channelItemsView = new NScreens.Views.ChannelItems();
	},

	loadChannelPage: function(params){
		// console.log("[ROUTER] state loadChannelPage > page = "+params);
		Workspace.toggleBuffer("show");

		// check for entry point and navigate to loadChannel if no collection found
		try {
			// pagination
			NScreens.channelItemsView.collection.page = Number(params);

			// collection
			NScreens.channelItemsView.collection.reset();

			// view
			NScreens.channelItemsView.collection.fetch();
		} catch (e) {
			NScreens.router.loadChannel();
			NScreens.router.navigate('channel');
		}
	},

	loadDetails: function(params){
		// console.log("[ROUTER] state loadDetails > id = "+params);
		Workspace.toggleBuffer("show");

		if (NScreens.itemDetailView !== null){
			NScreens.itemDetailView.update({itemIdUpdate: params});
		} else {
			NScreens.itemDetailView = new NScreens.Views.Detail({itemId: params});
		}
	},

	loadTheater: function(params){
		// console.log("[ROUTER] state loadTheater");
		Workspace.toggleBuffer("show");

		NScreens.theaterView = new NScreens.Views.Theater();
	},
	
	loadAvisoLegal: function(params){
		Workspace.toggleBuffer("show");

		NScreens.avisoLegalView = new NScreens.Views.AvisoLegal();
	},

	loadAge: function(params){
		Workspace.toggleBuffer("show");

		NScreens.ageView = new NScreens.Views.Age();
	},

	loadRegister: function(params){
		Workspace.toggleBuffer("show");

		NScreens.registerView = new NScreens.Views.Register();
	},

	loadRegisterConfirm: function(params){
		Workspace.toggleBuffer("show");

		NScreens.registerConfirmView = new NScreens.Views.RegistAcces();
	},

	loadRemember: function(params){
		Workspace.toggleBuffer("show");

		NScreens.rememberView = new NScreens.Views.Remember();
	},

	loadModify: function(params){
		Workspace.toggleBuffer("show");

		NScreens.modifyView = new NScreens.Views.Modify();
	},
	
	loadModifyConfirm: function(params){
		Workspace.toggleBuffer("show");

		NScreens.modifyConfirmView = new NScreens.Views.ModifyAcces();
	}

});

})(jQuery);