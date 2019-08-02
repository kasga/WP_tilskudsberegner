//needed for IE because console is only created when dev tools is open
if (!(window.console && console.log)) {console = {log: function() {},debug: function() {},info: function () { },warn: function () { },error: function () { }};}


/***************************************** VIRES *****************************************/


var activePage = 0;
var numOfPages;
var pageIsValid = new Array(false, false, false, false);



$(document).ready(function()
{
	// Throw an event
	$(document).trigger( "READY_TO_INIT" );
	
})




$( document ).on( "READY_TO_INIT", function( event ) 
{
	numOfPages = $('.page').length;	
	handleActivePage();

	$('.btn-nextpage').on('click', function(event)
	{
		nextPage();
		event.preventDefault();
	})

	$('.btn-prevpage').on('click', function(event)
	{
		prevPage();
		event.preventDefault();
	})
});


function nextPage()
{
	// Throw an event
	$(document).trigger( "NEXT_PAGE_BTN" );

	if(pageIsValid[activePage] === false) return;

	activePage = (activePage < numOfPages-1) ? ++activePage	: numOfPages-1;
	handleActivePage();
}


function prevPage()
{
	activePage = (activePage > 0) ? --activePage : 0;
	handleActivePage();
}


function gotoPage(id)
{
	activePage = id;
	handleActivePage();
}


function handleActivePage()
{
	$('.page').removeClass('active');
	$('.page' + activePage).addClass('active');

	scrolltopIframe(0)
}



function resizeIframe(){
    if ('parentIFrame' in window) 
    {
		setTimeout(function(){	parentIFrame.size() }, 1100);
    }
}



function scrolltopIframe(y)
{
	if ('parentIFrame' in window) 
    {
		parentIFrame.scrollTo(0, y);
	}
}