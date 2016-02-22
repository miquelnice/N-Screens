/**
 * Created for NicePeopleAtWork.
 * User: Miquel Fradera
 * Date: 11/12/13
 * Time: 16:48
 */

var Nice264AnalyticsEvents = {
    BUFFER_BEGIN: 1,
    BUFFER_END: 0
};

var Nice264AnalyticsError = {
    0: {
        id: "FORMAT_NOT_SUPPORTED",
        message: "A/V format not supported"
    },
    1: {
        id: "NETWORK_ERROR",
        message: "Cannot connect to server or connection lost"
    },
    2: {
        id: "UNKNOWN_ERROR",
        message: "Unidentified error"
    },
    1000: {
        id: "FILE_NOT_FOUND",
        message: "File is not found"
    },
    1001: {
        id: "INVALID_PROTOCOL",
        message: "Invalid protocol"
    },
    1002: {
        id: "DRM_FAILURE",
        message: "DRM failure"
    },
    1003: {
        id: "EMPTY_PLAYLIST",
        message: "Playlist is empty"
    },
    1004: {
        id: "INVALID_PLAYLIST",
        message: "Unrecognized playlist"
    },
    1005: {
        id: "INVALID_ASK",
        message: "Invalid ASX format"
    },
    1006: {
        id: "UNRECEIVED_PLAYLIST",
        message: "Error in downloading playlist"
    },
    1007: {
        id: "OUT_OF_MEMORY",
        message: "Out of memory"
    },
    1008: {
        id: "INVALID_URL",
        message: "Invalid url list format"
    },
    1009: {
        id: "NOT_PLAYABLE",
        message: "Not playable in playlist"
    },
    1100: {
        id: "UNKNOWN_DRM_ERROR",
        message: "Unidentified WM-DRM error"
    },
    1101: {
        id: "INVALID_LICENSE",
        message: "Incorrect license in local license store"
    },
    1102: {
        id: "UNRECEIVED_LICENSE",
        message: "Fail in receiving correct license from server"
    },
    1103: {
        id: "EXPIRED_LICENSE",
        message: "Stored license expired"
    }
};

/**
 * Plugin definition.
 * @param playerId
 * @param system
 * @param service
 * @param playInfo
 */
function Nice264Analytics(playerId, system, service, playInfo)
{

    this.oldFunction = null;
    /**
     * Attributes.
     */
    this.playerId = playerId;
    this.system = system;
    this.service = service;
    this.playInfo = playInfo;

    // player reference
    this.player = null;
    this.playStateCallback = "";

    // configuration
    this.pluginVersion = "2.0.1_lgtv";
    this.targetDevice = "LG_NetCast";
    this.outputFormat = "xml";
    this.xmlHttp = null;
    this.isXMLReceived = false;

    // events queue
    this.resourcesQueue = [];
    this.eventsQueue = [];
    this.eventsTimer = null;

    // events
    this.isStartEventSent = false;
    this.isJoinEventSent = false;
    this.isStopEventSent = false;
    this.isBufferRunning = false;
    this.isPauseEventSent = false;

    // properties
    this.assetMetadata = {};
    this.isLive = false;
    this.bufferTimeBegin = 0;

    // urls
    this.pamBufferUnderrunUrl = "";
    this.pamJoinTimeUrl = "";
    this.pamStartUrl = "";
    this.pamStopUrl = "";
    this.pamPauseUrl = "";
    this.pamResumeUrl = "";
    this.pamPingUrl = "";
    this.pamErrorUrl = "";

    // code
    this.pamCode = "";
    this.pamCodeOrig = "";
    this.pamCodeCounter = 0;

    // ping
    this.pamPingTime = 0;
    this.lastPingTime = 0;
    this.diffTime = 0;
    this.pingTimer = null;

    /**
     * Initialization.
     */
    this.init();
};

/**
 * Plugin setup.
 */
Nice264Analytics.prototype.init = function()
{
    var context = this;
    this.player = document.getElementById(this.playerId);
    this.oldFunction = this.player.onPlayStateChange;
    this.player.onPlayStateChange = function(){ context.myCheckPlayState(); context.oldFunction.call(this); };

    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.context = this;
    this.xmlHttp.addEventListener("load", function(httpEvent){ this.context.loadAnalytics(httpEvent); }, false);
    this.xmlHttp.open("GET", this.service + "/data?system=" + this.system + "&pluginVersion=" + this.pluginVersion + "&targetDevice=" + this.targetDevice + "&outputformat=" + this.outputFormat, true);
    this.xmlHttp.send();
};

/**
 * Plugin methods.
 */
Nice264Analytics.prototype.loadAnalytics = function(httpEvent)
{
    if (httpEvent.target.readyState == 4)
    {
        var response = httpEvent.target.responseXML;
        var pamUrl = response.getElementsByTagName("h")[0].childNodes[0].nodeValue;

        this.pamBufferUnderrunUrl = "http://" + pamUrl + "/bufferUnderrun";
        this.pamJoinTimeUrl = "http://" + pamUrl + "/joinTime";
        this.pamStartUrl = "http://" + pamUrl + "/start";
        this.pamStopUrl = "http://" + pamUrl + "/stop";
        this.pamPauseUrl = "http://" + pamUrl + "/pause";
        this.pamResumeUrl = "http://" + pamUrl + "/resume";
        this.pamPingUrl = "http://" + pamUrl + "/ping";
        this.pamErrorUrl = "http://" + pamUrl + "/error";

        this.pamCode = response.getElementsByTagName("c")[0].childNodes[0].nodeValue;
        this.pamCodeOrig = this.pamCode;
        this.pamPingTime = response.getElementsByTagName("pt")[0].childNodes[0].nodeValue * 1000;

        this.isXMLReceived = true;
    }
};

Nice264Analytics.prototype.sendAnalytics = function(url, data, hasResponse)
{
    // console.log("%%%%%%%%% sendAnalytics() to: " + url + data);

    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.context = this;
    if (hasResponse)
    {
        this.xmlHttp.addEventListener("load", function(httpEvent){ this.context.parseAnalyticsResponse(httpEvent); }, false);
        this.xmlHttp.addEventListener("error", function(){ this.context.setPing(); }, false);
    }
    this.xmlHttp.open("GET", url + data, true);
    this.xmlHttp.send();
};

Nice264Analytics.prototype.parseAnalyticsResponse = function(httpEvent)
{
    if (httpEvent.target.readyState == 4)
    {
        var response = httpEvent.target.responseText;
        var d = new Date();

        if (response.length > 0 || response != "" || !typeof(undefined))
        {
            this.pamPingTime = response;
        }

        this.setPing();
        this.lastPingTime = d.getTime();
    }
};

Nice264Analytics.prototype.updateCode = function()
{
    this.pamCodeCounter++;
    this.pamCode = this.pamCodeOrig + "_" + this.pamCodeCounter;
};

Nice264Analytics.prototype.reset = function()
{
    this.isStartEventSent = false;
    this.isJoinEventSent = false;
    this.isBufferRunning = false;
    this.isPauseEventSent = false;
    this.bufferTimeBegin = 0;

    clearTimeout(this.pingTimer);
    this.pingTimer = null;
    this.lastPingTime = 0;
    this.diffTime = 0;

    this.updateCode();
};

/**
 * Plugin methods. Getters and Setters.
 */
Nice264Analytics.prototype.setPlayerStateCallback = function(callback)
{
    this.playStateCallback = callback;
};

Nice264Analytics.prototype.setUsername = function(username)
{
    this.playInfo.username = username;
};

Nice264Analytics.prototype.setMetadata = function(metadata)
{
    this.assetMetadata = metadata;
};

Nice264Analytics.prototype.getMetadata = function()
{
    var jsonObj = JSON.stringify(this.assetMetadata);
    var metadata = encodeURI(jsonObj);

    return metadata;
};

Nice264Analytics.prototype.setLive = function(value)
{
    this.isLive = value;
};

Nice264Analytics.prototype.setTransactionCode = function(trans)
{
    this.playInfo.transaction = trans;
};

Nice264Analytics.prototype.getBitrate = function()
{
    try
    {
        var playInfo = this.player.mediaPlayInfo();
    }
    catch (err)
    {
        return 0;
    }

    return playInfo.bitrateInstant;
};

Nice264Analytics.prototype.setPing = function()
{
    var context = this;

    this.pingTimer = setTimeout(function(){ context.ping(); }, this.pamPingTime);
};

/**
 * Plugin events. Analytics.
 */
Nice264Analytics.prototype.start = function()
{
    var d = new Date();

    var params = "?pluginVersion=" + this.pluginVersion +
        "&pingTime=" + this.pamPingTime +
        "&totalBytes=0" +
		"&code=" + this.pamCode +
        "&referer=" + encodeURIComponent(window.location.href) +
        "&user=" + this.playInfo.username +
        "&properties=" + this.getMetadata() +
        "&live=" + this.isLive +
        "&transcode=" + this.playInfo.transaction + 
        "&system=" + this.system +
        "&resource=" + encodeURIComponent(this.player.data);        

    this.sendAnalytics(this.pamStartUrl, params, false);

    this.setPing();
    this.lastPingTime = d.getTime();
};

Nice264Analytics.prototype.ping = function()
{
    var d = new Date();

    clearTimeout(this.pingTimer);
    this.pingTimer = null;

    if (this.lastPingTime != 0)
    {
        this.diffTime = d.getTime() - this.lastPingTime;
    }
    this.lastPingTime = d.getTime();

    var params = "?diffTime=" + this.diffTime +
        "&bitrate=" + this.getBitrate() +
        "&pingTime=" + (this.pamPingTime / 1000) +
        "&dataType=0" +
        "&code=" + this.pamCode;

    this.sendAnalytics(this.pamPingUrl, params, true);
};

Nice264Analytics.prototype.buffer = function(bufferState)
{
    var d = new Date();
    var bufferTimeEnd = 0;
    var bufferTimeTotal = 0;
    var params = null;

    if (bufferState == Nice264AnalyticsEvents.BUFFER_BEGIN)
    {
        this.bufferTimeBegin = d.getTime();
    }
    else if (bufferState == Nice264AnalyticsEvents.BUFFER_END)
    {
        bufferTimeEnd = d.getTime();
        bufferTimeTotal = bufferTimeEnd - this.bufferTimeBegin;

        if (!this.isJoinEventSent)
        {
            this.isJoinEventSent = true;

            params = "?time=" + bufferTimeTotal +
                "&code=" + this.pamCode;

            this.sendAnalytics(this.pamJoinTimeUrl, params, false);
        }
        else
        {
            params = "?time=" + this.player.playPosition +
                "&duration=" + bufferTimeTotal +
                "&code=" + this.pamCode;

            this.sendAnalytics(this.pamBufferUnderrunUrl, params, false);
        }
    }
};

Nice264Analytics.prototype.resume = function()
{
    var params = "?code=" + this.pamCode;

    this.sendAnalytics(this.pamResumeUrl, params, false);
};

Nice264Analytics.prototype.pause = function()
{
    var params = "?code=" + this.pamCode;

    this.sendAnalytics(this.pamPauseUrl, params, false);
};

Nice264Analytics.prototype.stop = function()
{
    var params = "?diffTime=" + this.diffTime +
        "&code=" + this.pamCode;

    this.sendAnalytics(this.pamStopUrl, params, false);

    clearTimeout(this.pingTimer);
    this.pingTimer = null;

    this.reset();
};

Nice264Analytics.prototype.error = function()
{
    var params = "?errorCode=" + this.player.error +
        "&msg=" + Nice264AnalyticsError[this.player.error].id + ": " + Nice264AnalyticsError[this.player.error].message +
        "&code=" + this.pamCode;

    this.sendAnalytics(this.pamErrorUrl, params, false);

    clearTimeout(this.pingTimer);
    this.pingTimer = null;
};

/**
 * Plugin events. Player.
 */
Nice264Analytics.prototype.myCheckPlayState = function()
{
    switch (this.player.playState)
    {
        case 0:     // stopped
            if (!this.isStopEventSent)
            {
                this.isStopEventSent = true;
                this.stop();
            }
            break;
        case 1:     // playing
            if (this.isStopEventSent)
            {
                this.isStopEventSent = false;
            }

            if (!this.isStartEventSent)
            {
                this.isStartEventSent = true;
                this.start();
            }
            else if (this.isPauseEventSent)
            {
                this.isPauseEventSent = false;
                this.resume();
            }

            if (!this.isJoinEventSent && !this.isBufferRunning)
            {
                this.buffer(Nice264AnalyticsEvents.BUFFER_BEGIN);
                this.buffer(Nice264AnalyticsEvents.BUFFER_END);
            }

            if (this.isBufferRunning)
            {
                this.isBufferRunning = false;
                this.buffer(Nice264AnalyticsEvents.BUFFER_END);
            }
            break;
        case 2:     // paused
            this.isPauseEventSent = true;
            this.pause();
            break;
        case 3:     // connecting
            break;
        case 4:     // buffering
            this.isBufferRunning = true;
            this.buffer(Nice264AnalyticsEvents.BUFFER_BEGIN);
            break;
        case 5:     // finished
            if (!this.isStopEventSent)
            {
                this.isStopEventSent = true;
                this.stop();
            }
            break;
        case 6:     // error
            this.error();
            if (!this.isStopEventSent)
            {
                this.isStopEventSent = true;
                this.stop();
            }
            break;
    }
    
};

// TODO: add events queue logic