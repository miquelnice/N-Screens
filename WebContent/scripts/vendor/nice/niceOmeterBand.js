var iterator = 0;
var images = new Array();
var total_latency = 9000;
var total_band = 0;
var testCounter= 0; 
var ip="",country="",city="",isp="",ping="",band=""; 
var imagesCounter = 0;
var latencies = new Array();
var bandwidths = new Array();
var genericIndex = 0;
var totalBandwidhtFiles = 0;
var username,system;


function startTesting(){
       iterator = 0;
       images = new Array();
       total_latency = 9000;
       total_band = 0;
       testCounter= 0; 
       ip="";
       country="";
       city="";
       isp="";
       ping="";
       band=""; 
       imagesCounter = 0;
       latencies = new Array();
       bandwidths = new Array();
       genericIndex = 0;
       totalBandwidhtFiles = 0;
       var Url = $('#speedthml5').attr("src").split("?")[1];

       
       if( Url!=undefined ){
              var vars = Url.split["&"];
              for( var i=0; i<vars.length; i++){
                     var elements = vars[i].split("=");
                     if( elements[0]=="usr" ){
                            username = elements[1];
                     }else if( elements[0]=="system" ){
                            system = elements[1];
                     }
              }
       }
       
       $.ajax({
              url: "http://stage.nws.nice264.com/analytics/bandwidth?outputformat=jsonp",
              data: "costumerId=",
              dataType: 'jsonp',
              jsonp: false,
              jsonpCallback: "fjsonp",
              cache: false,
              success: function(data){
                     totalBandwidhtFiles = data.bandwidth.tests[0].files.length;
		         			
                     for (var i=0;i<data.bandwidth.tests.length;i++)
                     {
                            //latency
                            images[i] = new Array();                
                            images[i][0] = new Array();
                            images[i][0].url = data.bandwidth.tests[i].latencyFile;
                            images[i][0].size = data.bandwidth.tests[i].latencyFileBytes;
                            images[i][0].end = "not set";
		                
                            //test images
		                
                            for( var i2 = 1; i2<=data.bandwidth.tests[i].files.length; i2++){
		                	  
                                   images[i][i2] = new Array();
		                    
                                   images[i][i2].url = data.bandwidth.tests[i].files[i2-1];
                                   images[i][i2].size = data.bandwidth.tests[i].fileBytes;
                                   images[i][i2].end = "not set";
                                   images[i][i2].start = "";
                            }   
		                  
                            //cdncode
                            images[i].cdnCode = data.bandwidth.tests[i].cdnCode;
                            //fileCode
                            images[i].fileCode = data.bandwidth.tests[i].fileCode;                
                     }            
                     //trackingUrl
                     images['trackingUrl'] = data.bandwidth.trackingUrl;
                     images['costumerId'] = data.bandwidth.ipcustomerId;
                     images['testId'] = data.bandwidth.code;
		            
                     //write ip
                     ip = data.bandwidth.ip;
                     drawIp(ip,1);
                     city = data.bandwidth.city;
                     drawCity(city);
                     country = data.bandwidth.country;
                     drawCountry(country);
                     isp = data.bandwidth.isp;
                     drawIsp(isp);
		            
                     imagesCounter = 	images.length;	            
		            
                     calculateLatency(0);
              //start test 1
              //calculate(images[iterator]);
              },
              error: function(XMLHttpRequest, textStatus, errorThrown){
                     alert(errorThrown);
              }
       });
}
      
function calculateLatency(index){
        
       var numTrys = 1;
       var minNumberNow = 9000;
       var diff = 0;
       var startTime,endTime;
			
       var img = new Image;
		  		  
       try{
              startTime = new Date;  
              img.src = images[index][0].url;
              img.onload = img.onerror = function(){
                     endTime = new Date;
                     diff = endTime - startTime;
                     if(minNumberNow>diff && diff!=0){
                            minNumberNow = diff;
                     }
                     numTrys--;
							
                     if(numTrys!=0){
                            startTime = new Date;  
                            img.src = null;
                            img.src = images[index][0].url;
                     }else{
                            latencies[index] = Math.round(minNumberNow);
							  
                            if(imagesCounter-1!=index){
                                   calculateLatency(index+1);	
                            }else{
                                   writePing();
                            }
                     }					   	
              };
       }catch(e){ 
              alert('error');
       }
}

function writePing(){
	
       for(var i=0;i<latencies.length; i++){
              if( total_latency>latencies[i]){
                     total_latency = latencies[i];
              }
       }
       endSmallAngle = 496-total_latency*0.285;
       ping = total_latency;	
}

function calculateband(index){
	
       var img = new Image;
       var startTime = 0;
       var diff = new Array();
		  
       genericIndex = images[index].length-1; 
		 
       for (var i=1;i<images[index].length;i++)
       {
				              
              var img = new Image();                      
              if( startTime==0 ){				  
                     startTime = new Date;
              }                             
              try{
                     img.src=images[index][i].url;
                     img.onload = img.onerror = function(){
						  			
                     };
                     eval("img.onload = img.onerror = function(){ genericValues(startTime,"+index+") };");                                         
              }catch(e){ 
                     alert( e );
              }                               
       }
}

function genericValues(value,index){
		
       genericIndex--;
		
       if( genericIndex==0 ){
              //alert((new Date- value)+" - "+latencies[index]+"/1000");
              var actualSeconds = (new Date - value - latencies[index])/1000;
              var actualSize = ( images[index][1].size * totalBandwidhtFiles )/( 1024*1024 );
              var actualBand = ((8*actualSize) / actualSeconds);
              //alert("8* "+actualSize+" / "+actualSeconds+" = "+((8*actualSize) / actualSeconds));
              bandwidths[index] = Math.round(actualBand*100)/100;
				
				
              if(imagesCounter-1!=index){
                     calculateband(index+1);	
              }else{
                     saveResult();
              }
       }
}

function saveResult(){

       for(var i=0;i<latencies.length; i++){
              if( total_band<bandwidths[i] ){
                     total_band = bandwidths[i];
              }
              Trackingdata =  'ping='+(latencies[i]/1000)+'&concurrency=1&cdncode='+images[i].cdnCode+'&bandWidth='+bandwidths[i]+"&fileCode="+images[i].fileCode+"&username="+username+"&testId="+images['testId'];
       
              $.ajax({
                     type: "GET",
                     url: images['trackingUrl'],   
                     data:  Trackingdata,
                     success: function(data) {
                            switch( data ){
                                   case true:
                                          break;
                                   case false:
                                          break;
                                   default:
                                          break;
                            }                   
                     }
              });	
       }
		
       var value = total_band*100;
       var nextAngle = 0;
		
       if( value<100 && value!=0 ){
								
              nextAngle = (61*value)/100;
			
       }else if( value>=100 && value<700 ){
			
              value= value-100;
              nextAngle =  ((92*value) / 600)+61 ;
			
       }else if( value>=700 && value<1000 ){
			
              value = value-700;
              nextAngle = ((31*value) / 300)+92+61;
			
       }else if( value>=1000 && value<2000 ){
			
              value = value-1000;
              nextAngle = ((28*value) / 1000)+92+61+31 ;
			
       }else if( value>=2000 && value<5000 ){
			
              value = value-2000;
              nextAngle = ((31*value) / 3000)+92+61+31+28;
			
       }else if( value>=5000 && value<10000 ){
			
              value = value-5000;
              nextAngle = ((30*value) / 5000)+92+61+31+28+31 ;
       }	
		
       endBigAngle = 223+nextAngle;
       //alert(total_band)
       band = total_band;
}