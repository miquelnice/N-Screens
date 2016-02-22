var ctx = document.getElementById("niceCanvas").getContext("2d");



var base_image = new Image();
var big_arrow = new Image();
var small_arrow = new Image();
var btn_start_img = new Image();
var intervalPpal=0;
var btn_start = new Object();
btn_start.x = 297;
btn_start.y = 409;
btn_start.width = 163;
btn_start.height = 49;
btn_start.img = btn_start_img;				

var ready = 0;
var smallAngle=496;				   
var multi2 = -1;
var endSmallAngle = 0;				   
var counter=0;	 
var bigAngle=223;
var endBigAngle = 0;
var multi = 1;

				

base_image.src = 'http://bwcheck.com/img/background.jpg';

base_image.onload = function(){
       big_arrow.src = 'http://bwcheck.com/img/bigArrow.png';
       small_arrow.src = 'http://bwcheck.com/img/smallArrow.png';
       btn_start.img.src = 'http://bwcheck.com/img/btn.jpg';
       big_arrow.onload = small_arrow.onload = btn_start.img.onload = function(){
              ready++;
              if(ready==3){
                     startupDraw(true);	
              }
       }		   	
}
				   

				   
function checkIfInsideButtonCoordinates(buttonObj, mouseX, mouseY)
{
       if(((mouseX > buttonObj.x) && (mouseX < (buttonObj.x + buttonObj.width))) && ((mouseY > buttonObj.y) && (mouseY < (buttonObj.y + buttonObj.height)))){
    	   	  return true;
       } else {
              return false;
       }
}

function checkIfInsideButtonCoordinatesClick(buttonObj, mouseX, mouseY)
{
       if(((mouseX > buttonObj.x) && (mouseX < (buttonObj.x + buttonObj.width))) && ((mouseY > buttonObj.y) && (mouseY < (buttonObj.y + buttonObj.height)))){
    	   	  return true;
       } else {
              return false;
       }
}
				   
$("#niceCanvas").click(function(eventObject) {
       mouseX = eventObject.pageX - this.offsetLeft;
       mouseY = eventObject.pageY - this.offsetTop;
 							
       if(checkIfInsideButtonCoordinatesClick(btn_start, mouseX, mouseY))
       {
              startupDraw(true);
              $(this).removeAttr('onclick');
              startTesting();
              intervalPpal = setInterval(drawSmall,34);
       }
});
				   
$("#niceCanvas").mousemove(function(eventObject) {
       mouseX = eventObject.pageX - this.offsetLeft;
       mouseY = eventObject.pageY - this.offsetTop;

       if(checkIfInsideButtonCoordinates(btn_start, mouseX, mouseY)){
              $(this).css("cursor","pointer");
       }else{
              $(this).css("cursor","auto");
       }
});
				   
					
				   

function startupDraw(btnOver){
       ready = 0;
       smallAngle=496;				   
       multi2 = -1;
       endSmallAngle = 0;				   
       counter=0;	 
       bigAngle=223;
       endBigAngle = 0;
       multi = 1;

       ctx.clearRect ( 0 , 0 , 776 , 481 );
       ctx.drawImage(base_image, 0, 0);
							
       ctx.save();
       if(btnOver){					   	
              ctx.scale(1, 1);
              ctx.drawImage(btn_start.img, btn_start, btn_start);
       }else{
              ctx.drawImage(btn_start.img, btn_start, btn_start);
       }
					   	
       ctx.restore();
					   	
       ctx.save();
       ctx.translate( 385, 212 );
       ctx.rotate( (223*Math.PI)/180 );
       ctx.drawImage( big_arrow, -4, -112 );
       ctx.restore();
							 
       ctx.save();
       ctx.translate( 120, 370 );
       ctx.rotate( (496*Math.PI)/180 );
       ctx.drawImage( small_arrow, -2, -61 );
       ctx.restore();
       drawNumbersPing(0);
       drawNumbersDown(0);
}				   
				   
					

function drawSmall(){
				   
				   				
							
       ctx.drawImage(base_image, 0, 0);
       ctx.save();
				   		
       ctx.translate( 385, 212 );
       ctx.rotate( (223*Math.PI)/180 );
       ctx.drawImage( big_arrow, -4, -112 );
							
       ctx.restore();
							
       ctx.save();
							
       if(smallAngle>=496)
              multi2 = -1;
       if(smallAngle<=223)
              multi2 = 1;
				   			
       smallAngle = smallAngle+3*multi2;
							
       ctx.translate( 120, 370 );
       ctx.rotate( (smallAngle*Math.PI)/180 );
       ctx.drawImage( small_arrow, -2, -61 );
						   
       ctx.restore();
							
									   
       drawNumbersPing(counter);
       counter++;
       if(counter>999) counter = 0;
						   
       if( smallAngle+3>endSmallAngle && smallAngle-3<endSmallAngle && endSmallAngle!=0){
              clearInterval(intervalPpal);
              intervalPpal=0;
              drawPing(ping,1);
              drawNumbersPing(ping);
              calculateband(0);
              intervalPpal = setInterval(drawBig,34);
       }						   
						   
       drawIp(ip,1);
       drawIsp(isp,1);
       drawCity(city,1);
       drawCountry(country,1);
							
       drawNumbersDown(0);
       drawBand(band,1);
}
					

					
					
function drawBig(){
       counter=0;
								
       ctx.drawImage(base_image, 0, 0);
       ctx.save();
				   		
       if(bigAngle>=496)
              multi = -1;
       if(bigAngle<=223)
              multi = 1;
       bigAngle = bigAngle+3*multi;
				   		
       ctx.translate( 385, 212 );
       /*ctx.rotate( (bigAngle*Math.PI)/180 );
							ctx.drawImage( big_arrow, -4, -112 );*/
							
       if( bigAngle+3>endBigAngle && bigAngle-3<endBigAngle && endBigAngle!=0){
              clearInterval(intervalPpal);
								
              intervalPpal=0;
              ctx.rotate( (endBigAngle*Math.PI)/180 );
              ctx.drawImage( big_arrow, -4, -112 );
              
								
       }else{
              ctx.rotate( (bigAngle*Math.PI)/180 );
              ctx.drawImage( big_arrow, -4, -112 );
       }
			
       ctx.restore();
       ctx.save();
							
       ctx.translate( 120, 370 );
       ctx.rotate( (endSmallAngle*Math.PI)/180 );
       ctx.drawImage( small_arrow, -2, -61 );
						   
       ctx.restore();
						   
       drawNumbersPing(ping);
       drawPing(ping,1);
						   
       drawIp(ip,1);
       drawIsp(isp,1);
       drawCity(city,1);
       drawCountry(country,1);
							
							
       if(intervalPpal==0){
              drawBand(band+" Mbps",1);
              drawNumbersDown(band);
              ctx.save();
              ctx.drawImage(btn_start.img, btn_start, btn_start);
              ctx.restore();
              
       }else{
              drawNumbersDown(counter);
              counter +=0.15;
              if(counter>99.99) counter = 0;
								
       }
							
							
}					
					
function drawPing(ping,alpha){
       ctx.save();
       ctx.globalAlpha = alpha;
       ctx.shadowColor = '#efa409';
       ctx.shadowOffsetX = 0;
       ctx.shadowOffsetY = 0;
       ctx.shadowBlur = 0;
							
       ctx.font = '16pt Century Gothic';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#efa409";
       ctx.fillText(ping+" ms", 670, 105);
							
       ctx.restore();
}
					
function drawBand(band,alpha){
       ctx.save();
       ctx.globalAlpha = alpha;
       ctx.shadowColor = '#efa409';
       ctx.shadowOffsetX = 0;
       ctx.shadowOffsetY = 0;
       ctx.shadowBlur = 0;
							
       ctx.font = '16pt Century Gothic';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#efa409";
       ctx.fillText(band, 670, 195);
							
       ctx.restore();
}
					
function drawIp(ip,alpha){
       ctx.save();
       ctx.globalAlpha = alpha;
       ctx.shadowColor = '#efa409';
       ctx.shadowOffsetX = 0;
       ctx.shadowOffsetY = 0;
       ctx.shadowBlur = 0;
							
       ctx.font = '16pt Century Gothic';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#efa409";
       ctx.fillText(ip, 670, 285);
							
       ctx.restore();
}
					
function drawIsp(isp,alpha){
       ctx.save();
       ctx.globalAlpha = alpha;
							
       ctx.shadowOffsetX = 0;
       ctx.shadowOffsetY = 0;
       ctx.shadowBlur = 4;
							
       ctx.font = '12pt Century Gothic';
       ctx.textAlign = 'right';
       ctx.fillStyle = "#666666";
       ctx.fillText(isp, 750, 355);
							
       ctx.restore();
}
function drawCity(city,alpha){
       ctx.save();
       ctx.globalAlpha = alpha;
							
       ctx.shadowOffsetX = 0;
       ctx.shadowOffsetY = 0;
       ctx.shadowBlur = 4;
							
       ctx.font = '12pt Century Gothic';
       ctx.textAlign = 'right';
       ctx.fillStyle = "#666666";
       ctx.fillText(city, 750, 385);
							
       ctx.restore();
}
function drawCountry(country,alpha){
       ctx.save();
       ctx.globalAlpha = alpha;
							
       ctx.shadowOffsetX = 0;
       ctx.shadowOffsetY = 0;
       ctx.shadowBlur = 4;
							
       ctx.font = '12pt Century Gothic';
       ctx.textAlign = 'right';
       ctx.fillStyle = "#666666";
       ctx.fillText(country, 750, 415);
							
       ctx.restore();
}
					
function drawNumbersPing(value){
       var number = value.toString();
       while(number.length!=3){
              number = "0"+number;					
       }
       number = number.split("")
						
       ctx.save();
       ctx.font = '10pt Century Gothic';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#FFFFFF";
       ctx.fillText(number[0], 108, 405);
       ctx.restore();
						
       ctx.save();
       ctx.font = '10pt Century Gothic';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#FFFFFF";
       ctx.fillText(number[1], 121, 405);
       ctx.restore();
						
       ctx.save();
       ctx.font = '10pt Century Gothic';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#FFFFFF";
       ctx.fillText(number[2], 134, 405);
       ctx.restore();
}
					
function drawNumbersDown(value){
					   
       value = value*100;
       var number = value.toString();
       while(number.length!=4){
              number = "0"+number;					
       }
       number = number.split("");
						
       ctx.save();
       ctx.font = '12pt Verdana';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#FFFFFF";
       ctx.fillText(number[0], 350, 275);
       ctx.restore();
						
       ctx.save();
       ctx.font = '12pt Verdana';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#FFFFFF";
       ctx.fillText(number[1], 370, 275);
       ctx.restore();
						
       ctx.save();
       ctx.font = '12pt Verdana';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#FFFFFF";
       ctx.fillText(number[2], 407, 275);
       ctx.restore();
						
       ctx.save();
       ctx.font = '12pt Verdana';
       ctx.textAlign = 'center';
       ctx.fillStyle = "#FFFFFF";
       ctx.fillText(number[3], 426, 275);
       ctx.restore();
}