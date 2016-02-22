/**
** Copyright (c) 2013 NicePeopleAtWork
** Author: Adrià Gil
** Define application models.
**/

(function($){

NScreens.Models.Session = Backbone.Model.extend({

	url: NScreens.ApiPath + "api?channelid=" + NScreens.ChannelId + "&action=loginnew&force200=true", //&force200=true para status

	initialize: function(){
		// console.log("[MODEL] Session initialization");
	},

	checkAuthenticaiton: function(response){
		if (response.result == "ok"){
			Workspace.sessionCreate();

			//Save user data when logged in to show in all the application
			//console.log(response.data.name);
			Workspace.globalName = response.data.name;
			Workspace.globalSurname = response.data.surname;
			Workspace.globalCP = response.data.cp;
			Workspace.globalCountry = response.data.country;
			Workspace.globalUserId = response.data.id;
			
			//Plugin username after created session
			console.log("USERNAME----->"+response.data.email);
			youboraData.setUsername(response.data.email);

			//obtain date
			var f = new Date();
			var subscription_data = f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate() + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
			//console.log("DATA------------>"+ subscription_data);

			//subscription
			if (response.data.subscription.message || response.data.subscription.end_date < subscription_data){ 
				//console.log("page model USER NOT SUBSCRIBED "+response.data.subscription.message);
				//console.log("SUBSCRIPTION FALSE");
				Workspace.subscription_ok = false;
			}else{
				//console.log("page model USER SUBSCRIBED "+response.data.subscription.id);
				//console.log("SUBSCRIPTION TRUE");
				Workspace.subscription_ok = true;
			}

		} else {
			NScreens.splashScreenView.loginSubView.togglePopup(true);
		}
	}
});

NScreens.Models.SplashScreen = Backbone.Model.extend({

	url: NScreens.ApiPath + "api?channelid=" + NScreens.ChannelId + "&action=splashscreen&country=" + NScreens.ChannelCountry,

	initialize: function(){
		// console.log("[MODEL] SplashScreen initialization");
	}

});

NScreens.Models.LogReg = Backbone.Model.extend({

	url: NScreens.ApiPath +"api",

	initialize: function(){
		// console.log("[MODEL] LogReg initialization");
	}

});

NScreens.Models.ChannelItem = Backbone.Model.extend({

	initialize: function(){
		// console.log("[MODEL] ChannelItem initialization");
	}

});

NScreens.Models.ItemDetail = Backbone.Model.extend({

	url: NScreens.ApiPath +"api",

	contentId: 0,

	initialize: function(options){
		// console.log("[MODEL] ItemDetail initialization");
		this.contentId = options.contentId;
		NScreens.currentDetailId = this.contentId; // for retrieving VODMovie Model
	},

	// override "fetch" method to set a dynamic ID for retrieving the current model
	fetch: function(options){
		options || (options = {});
		var data = (options.data || {});
		options.data = {
			contentId: this.contentId,
			action: "contentdetail",
			device: "LG",
			country: NScreens.ChannelCountry
		};

		return Backbone.Model.prototype.fetch.call(this, options);
	},

	// override "parse" method because api is returning the array of items inside "resp"
	parse: function(resp){
		var new_resp = resp[0];
		if (new_resp.sinopsis.length > 650){
			new_resp.sinopsis = new_resp["sinopsis"].substr(0, 650) + "...";
		}
		
		return new_resp;
	}

});

NScreens.Models.Trailer = Backbone.Model.extend({

	url : NScreens.ApiPath + "api",

	initialize: function(){
		// alert("[MODEL] Trailer initialization");
	},

	// override "fetch" method to set dynamic CONTENT for retrieving the current model
	fetch: function(options){
		options || (options = {});
		var data = (options.data || {});
		options.data = {
			channelId: NScreens.ChannelId,
			contentId: NScreens.splashScreenModel.get('trailers')[0].id,
			action: "gettrailer",
			country: NScreens.ChannelCountry
		};

		return Backbone.Model.prototype.fetch.call(this, options);
	}

});

NScreens.Models.VODMovie = Backbone.Model.extend({

	url: NScreens.ApiPath + "api",

	initialize: function(){
		// alert("[MODEL] VODMovie initialization");
	},

	// override "fetch" method to set dynamic CONTENT for retrieving the current model
	fetch: function(options){
		var currentTransactionTime = this.getTransactionTime();

		options || (options = {});
		var data = (options.data || {});
		options.data = {
			channelId: NScreens.ChannelId,
			contentId: NScreens.currentDetailId,
			action: "getcontent",
			time: currentTransactionTime,
			token: this.getTransactionToken(currentTransactionTime),
			country: NScreens.ChannelCountry
		};

		return Backbone.Model.prototype.fetch.call(this, options);
	},

	getTransactionTime: function(){
		var now = new Date();
		return now.getTime();
	},

	getTransactionToken: function(transaction_time){
		var rawString = "";
		rawString = NScreens.currentDetailId + NScreens.ChannelId + transaction_time + NScreens.ChannelPassword;
		return md5(rawString);
	}

});
})(jQuery);