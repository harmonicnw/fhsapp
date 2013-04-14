/*
<img class="appPic" width="80px" height="80px" src="http://www.pps.k12.or.us/schools/franklin/template/franklin_logo.gif">
<iframe class="screen" width="100%" height="75%" style="border:0px;" src="http://www.fhsapp.com"></iframe>
var iframeSlid = false;

function iframeHide() {
	$(".appIframe").hide();
	$(".appPic").toggle(
		function() {
			if(iframeSlid === false) {
				$(this).next(".appIframe").slideDown(750);
			}
			iframeSlid = true;
		},
		
		function() {
			if(iframeSlid === true) {
				$(this).next(".appIframe").slideUp(750);
			}
			iframeSlid = false;
		}
	);	
}*/