//* All comments with "//*" next to them mean that they explain how the code works. Otherwise, it's probably just commented out code or something.

$(document).ready( function() {
	//*Adds link to the Calendar
	$("#calLink").click( function(e) {
		e.preventDefault();
		$(this).blur();
		embedCal();     //*See near bottom
		slideLeft2();
	});
	
	//*Adds link to the Settings
	$("#settingsLink").click( function(e) {
		e.preventDefault();
		$(this).blur();
		loadSettings(); //*See near bottom
		slideLeft2();
	});
	
	//*Adds link to the Resources
	$(".pageLink").click( function(e) {
		e.preventDefault(); //*prevents loading page
		$(this).blur();     //*subtle niceties
		showLoader();
		$("#dContent").load( $(this).attr("href") ); //*loads in the resources dynamically -- dContent = right side goodies
		setTitle( $(this).text() );                  //*topTitle = header bar goodies
		slideLeft2();
	});
	
	//*Adds link to the Survey
	$("#surveyLink").click( function(e) {
		e.preventDefault();
		$(this).blur();
		slideLeft();
		embedSurvey();
	});
	
	//*Adds link to the HowTo
	$(".howToLink").click( function(e) {
		e.preventDefault(); //*prevents loading page
		$(this).blur();     //*subtle niceties
		showLoader();
		$("#dContent").load( $(this).attr("href") ); //*loads in the howTo dynamically -- dContent = right side goodies
		setTitle( $(this).text() );                  //*topTitle = header bar goodies 
		slideLeft2();
	});
});

/** SHARED ***************************************************************************************************************************************************/

var userData;
//*feedData is an array for more arrays
var feedData = {
	'entries': [],
		//*
		/* 'entries' contains a list of announcements. These announcements come with this information:
		{
		"title" : "",                //*The Title of the Announcement
		"id" : "",                   //*A number used in identification
		"summary" : "",              //*Not used
		"content" : "",              //*The Content; The stuff that drops down.
		"startDate" : "",            //*When it starts running
		"expirationDate" : "",       //*When it stops 
		"eventDate" : "",            //*Optional stuff, part of ".specs" Self-explanatory
		"eventTime" : "",            //*Optional stuff, part of ".specs" Self-explanatory 
		"eventLocation" : "",        //*Optional stuff, part of ".specs" Self-explanatory
		"author" : {"name" : "",}	 //*Who made it	(not used (but may be used soon???))		
		},
		This is all used in the displayAnnouncements function (see line ~403)
		*/
	'feedList': [],      //*Becomes the location of all your selected categories. Used with "addFeedsToList" function.
	'allCats': [],       //*Lists all the top categories (the big four): General, Classes, Clubs, and Sports
	'allTeachers': [],   //*Lists all the teachers
};

var feedListItemsTotal;
var feedListItemsLoaded;

//*These two urls are used with the ajaxFeed() function (see below) to get the information with all the announcements.
var annoListUrl= "http://www.fhsapp.com/host/feed/annolist/";   //*This Url goes to all the announcement lists.
var annoQueryUrl= "http://www.fhsapp.com/host/feed/annoquery/"; //*This Url works with the catIds. When appended with ?catids="#", "#", "#"... it goes an gets all those categories with those catId numbers.

//*These are the loaders
var LoadWB = $("<img class='loading' src='Images/LoadWB.gif' width='32' height='32' />"); 
var LoadBB = $("<img class='loading' src='Images/LoadBB.gif' width='32' height='32' />"); 

//*Ajax stands for asynchronous javascript and XML. This ajax is what is getting all the stuff from the site. 
//*The feeds are in a system called "json," thus the "dataType."
function ajaxFeed(url,callback) {
	$.ajax( {
		url: url,
		dataType: 'jsonp',
		type: 'get',
		success: function(data) {
			callback(data);
		}
	} );
}

var cookieOptions = {
	'expires' : 999999999,              //* This is when the cookie ends (basically never)
	'domain' : window.location.hostname //* This means the cookie's only useable in FHS app
}

function getUserData() {                    //*Retrieves the data from the cookie
	var ud = $.cookie("userData");          //*grabs the cookie -- IF IT EXISTS
	if (ud && ud.hasOwnProperty("feeds")) { //*double checks existence of the user data cookie
		return ud;                          //*returns the cookie (user) data
	} else {                                //*if not, sends you nothing
		return false;
	}
}

function showLoader() {                    //*Shows the cool loader thingy
	$('#dContent').empty().append(LoadWB); //*This clears out the list on top each time so it doesn't double up
	
	//*This centers the loader
	LoadWB.css({ 
		'margin-top' : "50px",
		'margin-left' : ( ($(".over").width() - LoadWB.width() ) / 2) +"px"
	});
}

function setTitle(title) {
	//MAKE DYNAMIC //**//
	//Probably take width of screen and divide by a certain number to get max characters.
	
	var maxChars = 17; //*This is the max number of characters that shows up on top before cutting off
	
	if (title.length > maxChars) {
		title = title.slice(0, maxChars) + "&hellip;"; //*slices and adds a dot dot dot through dicing
	}
	$("#topTitle").html(title); //*Puts it back in the title
}

function makeQueryUrlString(feeds) { //*This makes the "lump" of catIds that the user has
	var q = "?catids="; //*This is appended to the "annoQueryUrl" url to get all the catIds. You can use this with the url and list some catIds to get the entries in your web browser. Makes more sense when you try it. Example: http://www.fhsapp.com/host/feed/annoquery/?catids=16
	for (var i=0; i < feeds.length; i++) {
		if (i>0) q += ",";
		q += feeds[i];
	}
	////console.log(q);
	return q; //*returns the string of catids
}
/** UI *******************************************************************************************************************************************************/

var slideLeft;
var slideRight;
var isSlid = false;
var L3isSlid = false;
var L2isSlid = false;

$(document).ready( function() {
	//*For sliding right
	 slideRight = function() {
		over.animate({
		'left': ($(document).width()*.7) + 'px'
		}, 250);
		isSlid = true;
		over.bind('touchmove', function(e) {
			e.preventDefault();
		});
	}
	//*For sliding left
	 slideLeft = function() {
		over.animate({
		'left': '0px'
		}, 250);
		isSlid = false;
		over.unbind('touchmove');
	}
	
	slideLeft2 = function() { //*A hideous hack that prevents the background from changing back to grey everytime you slide back over from the survey. Don't worry about it.
		over.animate({
		'left': '0px'
		}, 250);
		isSlid = false;
		over.unbind('touchmove');
		$(".over").removeClass("SurveyBG");
	}
	
	$(".under .acontent").hide();
	
	var over = $(".over");
	var body = $("body");

	//*This is for sliding right
	over.swiperight(
		function() {
		if (isSlid === false) {
				slideRight(); //*Calls above functions
			}
		}
	);
		
	//*This is for sliding left
	over.swipeleft(	
		function() {
		if (isSlid === true) {
				slideLeft(); //*Calls above functions
			}
		}
	);
	//*For the button
	var btnSlide = $(".btnSlide");
	btnSlide.click(
		function(e) {
			if (isSlid === true) {
				slideLeft();
			} else {
				slideRight();
			}
		}
	) 
		
	setAppHeight(); //*sets the height (see below)
	$(window).bind("orientationchange",setAppHeight);  //*This detects orientation changes and "reloads" the height with each change so the things doesn't get thrown off.
} );

function setAppHeight() {
	var timeout = setTimeout( //*There is a timeout here for it takes a little while for the orientation change to occur, thus this code must be delayed until after the orientation change, otherwise, the height isn't set properly.
		function() {
			var docHeight = window.innerHeight;
			$(".wrapper").css("height", docHeight + "px"); //*dynamically makes the document bigger or smaller 
			$(".under").css("height", docHeight + "px");
			$(".over").css("height", docHeight + "px");
			$("body").css("height", docHeight + "px"); //*Attempted to fix scrolling problem for android version 2, didn't work.
			if (isSlid === true) { 
				$(".over").css({'left': ($(document).width()*.7) + 'px'});
			}	
			},
		250 //*Time for delay
	);	
}

var annHide;
function initializeHide() {//*Function for announcement list items toggle
	$(".ans .content").hide(); //*Starts out by hiding everything

	$(".ans .title").toggle(   //*on clicking the title, fun the below function
		function() {
			if (!isSlid) {
				$(".ans .content:visible").slideUp(750); // May need Fixing //*Slides up the previous announcement
					/*annHide = $(this).next(".content");
					setTimeout(
						function() {
							annHide.stop(true,true).hide();
						}, 740
					);*/
					/*var body = $('body'); body.css('height', 'auto'); body.css('height', body.height());*/
				$(this).next(".content").slideDown(750); //*Slides down the announcement you just clicked
			}
		},
		
		function() {
			if (!isSlid) {
				$(this).next(".content").slideUp(750);
					annHide = $(this).next(".content");
					setTimeout( //*This function below fixes a weird glitch in the look.
						function() {
							annHide.stop(true,true).hide();
						}, 740
					);
			}
		}	
	);
}

//*L2 is the first list dropdown in the settings for Classes, Clubs, and Sports.
function initializeL2Hide() {
	$(".L2").hide();
	
	$(".L1 h1").toggle(
		function() {
			if(!L2isSlid) {
				$(this).next(".L2").slideDown(750);
			}
		},
		
		function() {
			if(!L3isSlid) {
				$(this).next(".L2").slideUp(750);
					annHide = $(this).next(".L2");
					setTimeout(
						function() {
							annHide.stop(true,true).hide();
						}, 740
					);
			}
		}
	);
} 

//*L3 is for the dropdown with teacher names.
function initializeL3Hide() {
	$(".L3").hide();
	
	$(".L2 h2").toggle(
		function() {
			if(!L3isSlid) {
				$(this).next(".L3").slideDown(750);
					/*annHide = $(this).next(".L3");
					setTimeout(
						function() {
							annHide.stop(true,true).show();
						}, 400
					); */
			}
		},
		
		function() {
			if(!L3isSlid) {
				$(this).next(".L3").slideUp(750);
					annHide = $(this).next(".L3");
					setTimeout(
						function() {
							annHide.stop(true,true).hide();
						}, 740
					);
			}
		}
	);
} 

//*This is for dropdowns in the slideout menu
function initializeSlideoutHide() {
	//slideoutMenuDropDown
	$(".under .acontent").hide();
	$(".under .atitle").toggle(
		function() {
			$(this).next(".acontent").slideDown(750);
			$(this).removeClass("closed");
			$(this).addClass("open");
		},
		
		function() {
			$(this).next(".acontent").slideUp(750);
				annHide = $(this).next(".acontent");
				setTimeout(
					function() {
						annHide.stop(true,true).hide();
					}, 740
				);
			$(this).removeClass("open");
			$(this).addClass("closed");
		}
	);
	$(".under .dd .atitle").addClass("closed");
}

//*This function is so that you can click the title of a setting and it checks
function initializeEasyCheck()
{
	$(".bottom").each( function() {
		var cb = $(this).find("input");
		
		$(this).click(function(){
			if (cb.is(":checked")){
				cb.prop("checked",false);  //*turns the bottom into a button!
			} else {
				cb.prop("checked","checked");
			}
			updateUserDataFromSettings();
		});	
	});
}

/** ANNOUNCEMENTS ********************************************************************************************************************************************/

var feedListExists = false;
//*//
//*This function runs at the very beginning. It's found in the index html file. It starts up everything.
function fhsIndex(){
	userData = getUserData();
	if (userData && userData.hasOwnProperty("feeds")) { //*checks if the userData cookie has been set
		if(userData.feeds.length > 0) {           //*this makes sure that there are feeds the user is subscribed to
			////console.log("side is loaded");
			loadFeedList(userData.feeds);         //*loads the slideout menu
			loadAnnouncements(userData.feeds, "Your Announcements"); //*loads the "over", all the announcements
		} else {
			loadHowTo(); //*The HowTo is the getting started page. Loads if there aren't any feeds.
		}
	} else {
		loadHowTo();     //*Again, loads if there aren't any feeds.
	}
}

function loadAnnouncements(feeds, title) {       //*The parameter "feeds" comes in as a string of catIds, which are passed to makeQueryUrlString (see below).
	showLoader();
	slideLeft2();
	//*feedData is an object that holds a ton of stuff (see line ~49)	
	feedData.entries = [] //*Clears out the entries
	var queryString = makeQueryUrlString(feeds); //*See the function (line ~132)
	var queryUrl = annoQueryUrl + queryString;   //*This makes that URL with the catIds
	ajaxFeed(queryUrl, addAnnouncements);        //*Ajaxes the url, then runs addAnnouncements (below).
	setTitle(title);
}

//**// Confused about where "data" parameter comes in. I know it's in the ajax callback(data) parameter somewhere...
function addAnnouncements(data) {
	for (var i = 0; i < data.feed.entries.length; i++){
		var  alreadyAdded = false //*checks for dupes by ID and refuses to add those that match 
		for (var j=0; j < feedData.entries.length; j++) {
			if (feedData.entries[j].id == data.feed.entries[i].id) {
				alreadyAdded = true;
			}
		}
		if (!alreadyAdded){
			feedData.entries.push(data.feed.entries[i]);      //*adds entries (announcements) to 'feeds' array in feedData in loadAnnouncements() (see above)
		}
	}
	displayAnnouncements(sortAnnouncements(feedData));        //*same thing as above but better
	
}

//*For the dates (don't worry about it).
var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec");

function displayAnnouncements(data){ //*This WRITES the page
	
	var html = "<ul class='ans'>";
	
	if (feedData.entries.length == 0) { //If there are no entries (announcements), then it displays "No Current Announcements"
		html += "<li><p class='title'>No Current Announcements</p></li>";
	} else {
		//*this loop generates each announcement
		for(var i = 0; i < feedData.entries.length; i++) {
			//*these are the objects we are pulling from the feed. Look back at the feedData array at the top (line ~49)
			var title = feedData.entries[i]['title'];
			var content = feedData.entries[i]['content'];
			var category = feedData.entries[i]['category'];
			var topCategory = feedData.entries[i]['topCategory'];
			var eventDate = feedData.entries[i]['eventDate'];
			if (eventDate != ""){
				eventDate = new Date(eventDate);
				var d = eventDate.getUTCDate();
				var m = m_names[eventDate.getMonth()];
				eventDate = m + " 	" + d;
			}
			var eventTime = feedData.entries[i]['eventTime'];
			var eventLocation = feedData.entries[i]['eventLocation'];
		
			//this is writing the html for each announcement using the objects from above
			html += "<li class='" + topCategory + "'>";
				html += "<p class='title'>" + title + "</p>";
				html += "<div class='content'>";
					html += "<div class='details'>";
						html += "<p>" + content + "</p>";
					html += "</div>";
					html += "<div class='specs'>";
						html += "<p>";
							html += "<span class='info'><span class='tspecs'>Category: </span>" + category + "</span>";
							if (eventDate != "") html += "<span class='info'><span class='tspecs'>Date: </span>" + eventDate + "</span>";
							if (eventTime != "") html += "<span class='info'><span class='tspecs'>Time: </span>" + eventTime + "</span>";	
							if (eventLocation != "") html += "<span class='info'><span class='tspecs'>Where: </span>" + eventLocation + "</span>"; 
						html += "</p>";
					html += "</div>";
				html += "</div>";
			html += "</li>"
		}
	}
	html += "</ul>";
	$("#dContent").html(html); //Puts the stuff on the page
    $("#dContent").fitVids();  //fits videos 
	initializeHide();          //activates the toggle ability (see line ~233)	
}

//*This is for sorting the announcements
function sortAnnouncements(fd) {
	var feeds = fd.entries;
	feeds.sort(function(a,b) {
		var dateA = new Date( a['expirationDate'] );
		var dateB = new Date( b['expirationDate'] );
		if (dateA < dateB) {
			return -1;
		} else if (dateA > dateB) {
			return 1;
		} else {
			return 0;
		}
	});	
	fd.entries = feeds;
	return fd;
}

/** SLIDEOUT!MENU (aka FeedList) *********************************************************************************************************************/
function addFeedsToList(data) {
	for(var i=0; i < data.feed.feeds.length; i++){
		//*feedData.feedList is up in the feeds array (line ~67)
		feedData.feedList.push({
			'feedTitle':data.feed.feeds[i].title,
			'feedCategory':data.feed.feeds[i].topCategory,
			'feedCatId':data.feed.feeds[i].catId
		});
	}
	displayFeedList();
}

function loadFeedList(feeds){   //*this runs everytime a setting is changed or the app is initially loaded.
	feedData.feedList = []; 	//*location of all your categories. Clears everytime.
	var queryString = makeQueryUrlString(feeds); //*makes the string (the lump). The "makeQueryUrlString" returns a string of catIds, which the variable gets set to.
	ajaxFeed(annoQueryUrl + queryString, addFeedsToList); //*Purges the old feeds in a ritualistic culling. (Translation: Everytime a setting is changed (checked), the ajaxFeed function runs and the "feedData.feedList" array is filled up with a new set of data.
	//console.dir(feedData.feedList);
}

//*This is for the SLIDEOUT MENU (the feedList). It generates the lists so you can select from them.
function displayFeedList() {
	if (feedData.allCats.length == 0) { //*Safeguard. Manually gets all the categories.
		ajaxFeed(annoListUrl, function(data) {
			feedData.allCats = data.allcats;
			feedData.allTeachers = data.allteachers;
			feedData.surveyUrl = data.surveyUrl;
			displayFeedList();
		});
		return;
	}
	
	$(".getStart").hide(); //*Hides the getting started page.
	
	var allCatIds = [];
	var html ="";
	
	for (var i=0; i< feedData.feedList.length; i++) {
		if (feedData.feedList[i].feedCategory != "General") { //*If a feed doesn't have the category general, push it into the allCatIds array.
			allCatIds.push("'" + feedData.feedList[i].feedCatId + "'" ); //*feedCatId is created above in "addFeedsToList"
		}
	}
	
	//*This writes the big "Your Announcements".                         // Here in "onclick", it takes allCatIds, joins them into a string, and passes them to "loadAnnouncements", which then writes the page with these catIds.
	html += "<li class=\"atypes dynamic\"><div class=\"atitle personal\"><a href='#' onclick=\"loadAnnouncements([" + allCatIds.join() + "], 'Your Announcements'); return false;\">Your Announcements</a></div></li>";
	
	for (var i = 0; i < feedData.allCats.length; i++) { //*This makes categories
		var feedArr = [];   		//*Container for adding feeds that are in the category
		for (var j = 0; j < feedData.feedList.length; j++) { //*This loop runs for each top category
			if (feedData.feedList[j].feedCategory == feedData.allCats[i]) { //*This checks if the feed falls under the categories listed in allCats. feedCategory is in the object from the feed.
				feedArr.push( feedData.feedList[j] );        //*If true, pushes to array
			}
		}
		
		if (feedArr.length > 0) { //*This checks if there is anything in the category
			feedArr.sort( //*This sorts everything
				function(a,b){
					if(a.feedTitle < b.feedTitle) {
						return -1;
					} else if (a.feedTitle > b.feedTitle) {
						return 1;
					} else {
						return 0;
					}
				}
			);
			
			var iconClass = feedData.allCats[i].toLowerCase().replace(" ", "-"); //*contingency plan for titles with spaces and uppercases 
			html += "<li class='atypes dynamic dd'>";
			html += "<div class='atitle "+ iconClass +"'><a>" + feedData.allCats[i]+ "</a></div>"; //*this is the category title(-ish)
			html += "<ul class='acontent'>";
			var allCatIdsArray = []; //*This holds all the names of the classes, clubs, etc. for the "All"
			var liString = ""; //*This temporarily holds all the individual classes, clubs, etc.
			for (var k = 0; k < feedArr.length; k++) { //Below here is again the onclick, except the loadAnnouncemets is only being passed 1 catId to load.
				liString += "<li><a href='#'onclick=\"loadAnnouncements(['" + feedArr[k].feedCatId + "'], '" + feedArr[k].feedTitle + "'); return false;\">" + feedArr[k].feedTitle + "</a></li>"; //*This is the title of the category w/ the link
				allCatIdsArray.push(feedArr[k].feedCatId); //*This array is used to contain the catIds for one top category (like "Clubs") for the "all" option.
			}
			var allCatIdsString = allCatIdsArray.join(); //*This joins the array into a string for the "all" category
			html += "<li><a href='#'onclick=\"loadAnnouncements(["+ allCatIdsString +"], 'All " + feedData.allCats[i] + "'); return false;\">All " + feedData.allCats[i] + "</a></li>" //*This is for "all classes", etc
			html += liString;
			html += "</ul>";
			html += "</li>";
		}
		
	}
	$('.under ul .dynamic').remove(); //clears out the old
	$('.under ul').prepend(html);     //adds in the new
	loadFeedListGeneral();
	initializeSlideoutHide();
}	

////////////This is everything above, but for General////////////////////
//////////////////////FIX FIX FIX FIX////////////////////////////////////
//Maybe make a master function for all this so it may all be passed in?//
function addFeedsToListGeneral(data) {
	for(var i=0; i < data.feed.feeds.length; i++){
		feedData.generalFeedList.push({
			'feedTitle':data.feed.feeds[i].title,
			'feedCategory':data.feed.feeds[i].topCategory,
			'feedCatId':data.feed.feeds[i].catId
		});
	}
	displayFeedListGeneral();
}

function loadFeedListGeneral(){ //this runs everytime a setting is changed or the app is initially loaded.
	////console.log("This is Loopy.");
	////console.dir(userData);
	feedData.generalFeedList = []; 	//location of all general categories. Clears everytime.
	var queryString = makeQueryUrlString(userData.generalFeeds); //makes the string(the lump)
	ajaxFeed(annoQueryUrl + queryString, addFeedsToListGeneral); //purges the old feeds in a ritualistic culling -- whenever a setting is changed
}

function displayFeedListGeneral() {		
	var allCatIds = [];
	var html ="";
	
	////console.dir(feedData.generalFeedList);
	
	//for (var i = 0; i < feedData.allCats.length; i++) { //This was the old loop that is not necessary for General. All the things with i iterators should be out, like feedData.allCats[i], and replaced with "General". 
	var feedArr = [];   		//Container for adding feeds that are in the category	
	for (var j = 0; j < feedData.generalFeedList.length; j++) { 
		if(feedData.generalFeedList[j].feedCategory == "General") { 		
		feedArr.push( feedData.generalFeedList[j] );       //If true, pushes to array
		}
	}
	if (feedArr.length > 0) { //*This checks if there is anything in the category
		feedArr.sort( //This sorts everything
			function(a,b){
				if(a.feedTitle < b.feedTitle) {
					return -1;
				} else if (a.feedTitle > b.feedTitle) {
					return 1;
				} else {
					return 0;
				}
			}
		);

		//var iconClass = feedData.allCats[i].toLowerCase().replace(" ", "-"); //contingency plan for titles with spaces and uppercases (left in in case we want to do Today's Announcements)
		html += "<li class='atypes dynamic dd'>";
		html += "<div class='atitle general closed'><a>Today's Announcements</a></div>"; //this is the category title(-ish)
		html += "<ul class='acontent'>";
		var allCatIdsArray = []; //This holds all the names of the classes, clubs, etc for the "All"
		var liString = ""; //This temporarily holds all the individual classes, clubs, etc.
		for (var k = 0; k < feedArr.length; k++) {
			liString += "<li><a href='#'onclick=\"loadAnnouncements(['" + feedArr[k].feedCatId + "'], '" + feedArr[k].feedTitle + "'); return false;\">" + feedArr[k].feedTitle + "</a></li>"; //This is the title of the category w/ the link
			allCatIdsArray.push(feedArr[k].feedCatId);
		}
		var allCatIdsString = allCatIdsArray.join(); //This joins the array into a string
		html += "<li><a href='#'onclick=\"loadAnnouncements([" + allCatIdsString + "], 'Today&#8217;s Announcements'); return false;\">All of Today&#8217;s Announcements</a></li>" //This is for "all general"
		html += liString;
		html += "</ul>";
		html += "</li>";
	}
	// Close for old loop
	$('.under ul li:first').after(html);     //adds in the new
	initializeSlideoutHide();
}

/** SETTINGS *************************************************************************************************************************************************/

var feedCbs;

//*Function that runs when the link is clicked (see above line~ 12)
function loadSettings() {
	showLoader();
	setTitle("Settings");
	fhsSettings();
	//initializeL3Hide();
}

function fhsSettings() {
	ajaxFeed(annoListUrl, initSettingsList); //*Ajaxes the list of all the announcements (see the Url)
}

//*writes out all the checkboxes on the settings page
//*Note: "cb" stands for checkbox
function initSettingsList(data) {	
	var wrapper = $("<form id='feedSelections' class='settingsWrapper' />");
	var container = $("<ul class='L1' />"); //*Container for adding feeds that are in the category
	var html = '<div style="margin:.25em;"><p style="text-align:center;padding:.5em;font-style:italic;font-weight:bold;border:3px solid rgb(200,200,200);">Set your announcements here!</p></div>'; //*A nice little box that says "Set your announcements here!"
	var cbCount= 0; //*The current number of checkboxes
	feedData.allCats = data.allcats; //*allcats is the list of the big four "general, classes, clubs, and sports"
	feedData.allTeachers = data.allteachers; //*All the teachers
	feedData.surveyUrl = data.surveyUrl;
	
	for (var i = 0; i < feedData.allCats.length; i++) {//*This loop sifts through each of the big four categories in allcats and finds the categories that fit under it. Once it finds a category that fits under allcats, it pushes it into the feedArr.
		var feedArr = [];
		
		for (var j = 0; j < data.feed.entries.length; j++) {
			if (data.feed.entries[j].category == feedData.allCats[i]) { //*This checks if the feed falls under the categories listed in allCats.feedCategory (the big four).
				feedArr.push(data.feed.entries[j]); //*If true, pushes to array "feedArr" at top
			}
		}
		
		if (feedArr.length > 0) { //*This checks if there's something in the category
			feedArr.sort( //*This sorts everything
				function(a,b){
					if(a.title < b.title) {
						return -1;
					} else if (a.title > b.title) {
						return 1;
					} else {
						return 0;
					}
				}
			);
			
			if (feedData.allCats[i] == "General") {
				var generalClass = " general"; //*sets certain feeds as "General announcements." General announcements are important and cannot be unsubscribed from
			} else {
				var generalClass = "";
			}
			
			html += "<li class='" + generalClass + "'>";
			html += "<h1>" + feedData.allCats[i] + "</h1>";
			html += "<ul class='L2'>";
			
			if (feedData.allCats[i] == "Classes") { //*Checks to see if the category falls under "Classes". If it does, we start making L3s (the teachers).
				for (var k = 0; k < feedData.allTeachers.length; k++) { //*Loop runs to make each list for the teachers
					var feedArr2 = []; //*Container for teachers
					for (var l=0; l < feedArr.length; l++) {
						if (feedArr[l].teacher == feedData.allTeachers[k]) { //*If the teacher matches, push it into the array
							feedArr2.push( feedArr[l] );
						}
					}
					
					if (feedArr2.length > 0) { 
						feedArr2.sort(function(a,b){ //*This sorts the teachers.
							if (a.title<b.title) {
								return -1;
							} else if(a.title>b.title) {
								return 1;
							} else {
								return 0;
							}
						});
					
						html += "<h2>" + feedData.allTeachers[k] + "</h2>"; //*This makes the heading for each teacher
						html += "<ul class='L3'>"; //*This is the list of individual classes
					
						for (var l = 0; l < feedArr2.length; l++) {
							html += "<li class='bottom'><label for='cb" + cbCount + "'>" + feedArr2[l].title + "</label><input id='cb" + cbCount + "' type='checkbox' value='" + feedArr2[l].catId + "' /></li>"; //*Writes the checkbox
							cbCount++;  //assigns classes their label and whether or not they should be checkbox'd
						}
					
						html += "</ul>";
					}
				}
			
			} else { //*If it's NOT a class category feed, just make it a normal checkbox
				for (var k = 0; k < feedArr.length; k++) {
					//This makes each checkbox
					html += "<li class='bottom'><label for='cb" + cbCount + "'>" + feedArr[k].title + "</label><input id='cb" + cbCount + "' type='checkbox' value='" + feedArr[k].catId + "' /></li>";
					///////////This "for" ^ up here lets you click on the words and it checks
					cbCount++;
				}
			}
			
			html += "</ul>";
			html += "</li>";
		}	
	}
	
	container.html(html);
	feedCbs = container.find('input[type=checkbox]');
	
	updateSettingsFromUserData();  //*Rechecks checkboxes based on data in the cookie
	
	feedCbs.change( function(e) {  //*Runs the cookie updating function whenever a box is clicked/unclicked
		updateUserDataFromSettings(); //*Updates the cookie
	});
	wrapper.append(container); //*Sticks this container in the wrapper
	$("#dContent").empty().append(wrapper); //*Sticks the wrapper into dContent (the page)
	
	$("#dContent .general").each(function() {  //*Find the Generals
		var cb = $(this).find("input[type=checkbox]"); //*Checks the checkbox
		cb.prop("checked", true);
		$(this).hide() //*hides the general -- to prevent unchecking
	});
	
	updateUserDataFromSettings();
	
	//*Activates dropdowns
	initializeL3Hide(); 
	initializeL2Hide();
}

//*Rechecks the checkboxes
function updateSettingsFromUserData() { //*this cycles through the cookie to figure out which things were checked and rechecks thems on the page.
	userData = getUserData();
	
	if (userData) {
		for (var i = 0; i < userData.feeds.length; i++) {
			feedCbs.each(function(j){
				if ( $(this).val() == userData.feeds[i]) {
					$(this).attr('checked', 'checked')
				}
			});
		}
	}
}

//*initializes feed choices from JSON user data cookie
//*This updates the cookie
function updateUserDataFromSettings() {
	var feedsArr =[];
	var generalFeedsArr = [];
	
	//if a feed is checked, add it to the cookie
	feedCbs.each( function(i) {
		if ( $(this).is(":checked") && $(this).parents("li.general").length > 0 ) { //checks if it does have a ancestor called General
			generalFeedsArr.push($(this).val() );
		} else if ( $(this).is(":checked") ) {
			feedsArr.push( $(this).val() ); //pushes it into the porthole """porthole = feeds""" list if it's checked!
		}
	});
	
	userData = { 
		'feeds' : feedsArr,
		'generalFeeds' : generalFeedsArr
	};
	feedData.feedList = feedsArr
	feedData.generalFeeds = generalFeedsArr;
	
	$.cookie( "userData", userData, cookieOptions ); //*makin' cookies or overwriting them 
	loadFeedList(feedData.feedList);
} 


/** CALENDAR *********************************************************************************************************************************/
function embedCal() {
var gWidth = $(document).width() - 20;                               //*How wide the calendar shall be
var gHeight = $(document).height() - 20 - $(".top").outerHeight();   //*How high the calendar shall be

//*Embeds the thing.
var gIFrame = '<iframe width="' + gWidth + '" scrolling="no" height="' + gHeight + '" frameborder="0" src="https://www.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;showCalendars=0&amp;showTz=0&amp;mode=AGENDA&amp;height=' + gHeight + '&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=ib30j629l0s3qv0help912kc4o%40group.calendar.google.com&amp;color=%23705770&amp;src=b4li8fjv8vbus7delh6q4or5b8%40group.calendar.google.com&amp;color=%234E5D6C&amp;ctz=America%2FLos_Angeles" style="border-width: 0px;"/>';

$("#dContent").html(gIFrame);
setTitle("Calendar");

}

/** SURVEY ***********************************************************************************************************************************/
function embedSurvey() {
var sWidth = $(document).width() - 20;                              //*How wide the survey shall be
var sHeight = $(document).height() - 20 - $(".top").outerHeight();  //*How high the survey shall be
//
var sIFrame = $('<div class="sIFrame" width="' + sWidth + '" height="' + sHeight + '"><iframe id="sIFrame" width="' + sWidth + '" scrolling="yes" height="' + sHeight + '" frameborder="0" src="' + feedData.surveyUrl + '" style="border-width: 0px;margin: 10px 0 0 10px;overflow-y:auto;"/></div>');

//*This is part of fixing the problems in the UI where the dimensions weren't changing dynamically upon orientation changes. Don't worry about it.
sIFrame.bind("orientationchange", //*This is for detecting orientation change in Survey. When it detects it, it runs the below function.
	function(){
		setTimeout(
			function() { 
				var sWidth2 = $(document).width() - 20;
				var sHeight2 = $(document).height() - 20 - $(".top").outerHeight();
				$("#sIFrame").prop("width", sWidth2);   //*This makes the actual iframe's width change back
				$("#sIFrame").prop("height", sHeight2); //*Changes height of actual iframe
				$(".sIFrame").prop("width", sWidth2);   //*Changes the div on the thing (kind of an insurance policy)
				$(".sIFrame").prop("height", sHeight2);
			}, 
		300)
	}
);
$(".over").addClass("SurveyBG");
$("#dContent").empty().append(sIFrame);
setTitle("Feedback"); //*Change to "feedback"
}

/** HOW-TO ***********/

function loadHowTo() {
	$("#dContent").load("howTo.html");
	setTitle("Getting Started");  
	slideLeft2();
}