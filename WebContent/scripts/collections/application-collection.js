/**
** Copyright (c) 2013 NicePeopleAtWork
** Author: Adrià Gil
** Define application collections of models.
**/

(function($){

NScreens.Collections.ChannelItems = Backbone.Collection.extend({

	url: NScreens.ApiPath + "api?channelid=" + NScreens.ChannelId + "&action=content&country=" + NScreens.ChannelCountry,

	model: NScreens.Models.ChannelItem,

	count: 0,
	page: 0,
	total_pages: 0,
	per_page: 6,

	initialize: function(){
		// console.log("[COLLECTION] ChannelItems initialization");
	},

	// override "parse" method because api is returning the array of items inside "resp.content"
	parse: function(resp){
		// set the Channel Banner image
		$(".banner").css({"background":"url('http://nscreens.omatech.com"+resp.period_banner_tv+"') no-repeat scroll 0 0 transparent"});

		var nuresp = [];
		NScreens.NavigationMap["page_channel"] = [];

		// pagination
		this.count = resp.content.length;
		this.total_pages = Math.ceil(this.count / this.per_page); // this.count % this.per_page
		this.setPagination();

		// select the correct range of items depending on current page
		var rangeIn = this.page * this.per_page;
		var rangeOut = rangeIn + 6;
		if (this.page == this.total_pages-1){
			rangeOut = this.count;
		}

		// console.log("--------- count = "+this.count+", total_pages = "+this.total_pages+", per_page = "+this.per_page);
		// console.log("--------- rangeIn = "+rangeIn+", rangeOut = "+rangeOut);

		// add the render index and id for a correct layout
		var j = 0;
		for (var i = rangeIn; i < rangeOut; i++)
		{
			nuresp.push(resp.content[i]);

			if ( (i+1) % 3 === 0 ){
				nuresp[j].clearfix = true;
				nuresp[j].navindex = "ch_item_"+j;
			} else {
				nuresp[j].clearfix = false;
				nuresp[j].navindex = "ch_item_"+j;
			}
			
			// nav_up + nav_down
			//var nav_up_down = "";
			var nav_up = "";
			var nav_down = "";

			if (j <= 2){
				// limits
				if ( (j+3) < (rangeOut-rangeIn) ){
					//nav_up_down = "ch_item_"+(j+3);
					
					nav_up = "user";
					nav_down = "ch_item_"+(j+3);
					//console.log("1NAV UP"+nav_up+" DOWN "+nav_down);
				} else {
					//nav_up_down = "none";
					//console.log("NONE");
					nav_up = "none";
					nav_down = "none";
				}
			} else if (j <= 5 && j >= 3){
				
				//nav_up_down = "ch_item_"+(j-3);
				
				nav_up = "ch_item_"+(j-3);
				nav_down = "user";
				//console.log("2NAV UP"+nav_up+" DOWN "+nav_down+" J "+j);
			}


			// nav_left
			var nav_left = "";
			if (this.page <= 0 && (j == 0 || j == 3) ){
				nav_left = "none";
			} else if (this.page > 0 && (j == 0 || j == 3) ){
				nav_left = "window.location.href = '#channel/page/"+(this.page-1)+"';";
			} else if (j != 0 && j != 3){
				nav_left = "ch_item_"+(j-1);
			}
			// nav_right
			var nav_right = "";
			if (this.page < this.total_pages-1 && (j == 2 || j== 5) ){
				nav_right = "window.location.href = '#channel/page/"+(this.page+1)+"';";
			} else if (this.page >= this.total_pages-1 && (j == 2 || j == 5) ){
				nav_right = "none";
			} else if (j != 2 && j != 5){
				// limits
				if ( j < (rangeOut-rangeIn)-1 ){
					nav_right = "ch_item_"+(j+1);
				} else {
					nav_right = "none";
				}
			}
			// create the navigation object
			NScreens.NavigationMap["page_channel"].push({
				el: "ch_item_"+j,
				action: "window.location.href = '#channel/item/"+nuresp[j].id+"';",
				back: "window.NetCastBack()", //"Workspace.sessionDestroy()",
				nav_up: nav_up, //nav_up_down,
				nav_down: nav_down, //nav_up_down,
				nav_left: nav_left,
				nav_right: nav_right
			},{
				el: "user",
				action: "window.location.href = '#modify';",
				back: "window.location.href = '#channel';",
				nav_up: "ch_item_"+(j+3),
				nav_down: "ch_item_"+(j),
				nav_left: "none",
				nav_right: "none"
			});

			j++;
		}

		return nuresp;
	},

	setPagination: function(){
		// pagination - previous
		if (this.page > 0){
			// arrows
			$("#prev_page").attr("href", "#channel/page/"+(this.page-1));
			$("#prev_page").show();
			// footer
			$("#backfw a").attr("href", "#channel/page/"+(this.page-1));
			$("#backfw").show();
		} else {
			// arrows
			$("#prev_page").attr("href", "#channel");
			$("#prev_page").hide();
			// footer
			$("#backfw a").attr("href", "#channel");
			$("#backfw").hide();
		}
		// pagination - next
		if (this.page < this.total_pages-1){
			// arrows
			$("#next_page").attr("href", "#channel/page/"+(this.page+1));
			$("#next_page").show();
			// footer
			$("#forward a").attr("href", "#channel/page/"+(this.page+1));
			$("#forward").show();
		} else {
			// arrows
			$("#next_page").attr("href", "#channel");
			$("#next_page").hide();
			// footer
			$("#forward a").attr("href", "#channel");
			$("#forward").hide();
		}
	}

});

})(jQuery);