/***************************************** MODEL *****************************************/

var xmlURL = [	'Fjernvarme.xml', 
				'OLIE.xml', 
				'GAS.xml', 
				'Varmepumpe.xml', 
				'Bio.xml',
				'Elvarme.xml']


var userWhich = '';
var userHousing = '';

function getXML(which, housing)
{
	if((parseFloat(which) == 3 || parseFloat(which) == 0) && parseFloat(housing) == 1)	
	{
		$('.page0 .zr-tooltip').show();

		$(document).on('click', function()
		{
			$('.page0 .zr-tooltip').hide();
			$(document).off('click');		
		})

		return;
	}



	if(userWhich == which && userHousing == housing)
	{
		nextPage();			
	}
	else
	{
		var xmlfile;
		userWhich = which;
		userHousing = housing;

		if(parseFloat(housing) == 1)	xmlfile = 'data/sommerhus/' + xmlURL[which];
		else							xmlfile = 'data/villa/' + xmlURL[which];

		
		$.ajax({
		type: "GET",
		url: xmlfile,
		dataType: "xml",
			success: function(xml) 
			{
			 	handleXML(xml);
			 	
			}
		});	

		nextPage();
	}
}



function handleXML(xml)
{
	//Fill the list with data
	var list = "";
	var kr = $(xml).find("improvements").attr('kr');
	var grantid = 0;
	var counter = 100;

	$(xml).find("improvement").each(function()
	{
		list += '<section class="improvement-list">';
		list += '<p class="header"><span class="header-txt">' + $(this).find("title").eq(0).text() + '</span>';
		list += '<span class="pull-right">Tilskud</span>';
		list += '</p>';
			
			$(this).find("grant").each(function()
			{
				list += '<div class="grant" data-grantid="' + grantid + '">';
				list += '<div class="title"><table style="width:100%"><tr><td class="subtitle">' + $(this).find("title").eq(0).text() + '</td>';
				list += '<td class="zr-nowrap"><span class="total-amount input-wrap" data-total-amount="0"></span></td></tr></table></div>';
				++grantid;

					$(this).find("option").each(function()
					{
						var multiply = ($(this).find("multiply").text() == "" || $(this).find("multiply").text() == 0) ? 1 : $(this).find("multiply").text();
						var type = $(this).attr('type');
						var prefix = $(this).find('title').attr("prefix");
						var unit = ($(this).find("unit").text() == 'm2') ? 'm<sup>2</sup>' : $(this).find("unit").text();
						var body = $(this).find("body").text().replace(/(ft|m)2/g,"$1<sup>2</sup>");
						var input = (type == 'stk') ? '<div class="checkbox-radio-wrap clearfix"><span class="checkbox styled" style="background-position: 0px 0px;"></span><input type="checkbox" name="cbinput" class="styled cbinput" id="cbinput' + counter + '" data-unique="' + counter + '" data-kr="' + kr + '"data-prefix="' + prefix + '" data-multiply="' + multiply + '" data-kwh="' + $(this).find("kwh").text() + '" data-type="' + type + '" ><label class="cbinput-label" for="cbinput' + counter + '"> 1 ' + $(this).find("unit").text() + '</label></div>' : '<input type="text" class="option-input" name="inp-option" data-unique="' + counter + '" data-kr="' + kr + '" data-multiply="' + multiply + '" data-kwh="' + $(this).find("kwh").text() + '" data-type="' + type + '"data-prefix="' + prefix + '" placeholder="Indtast her ..."> ' + unit; 
						
						list += '<div class="option">';
						list += '<h3 class="option-title">' + $(this).find("title").text() + '</h3>';
						list += '<p>' + body + '</p>';
						list += input;
						list += '<div class="calculated-amount" data-calculated-amount="0"></div>';
						list += '</div>';

						++counter;
					});

				list += '</div>';
			});

		list += "</section>"
	});
	

	$('#improvements_list').html(list);

	//Clear the list of what the user has chosen prior
	$(document).trigger( "LIST_AMOUT_CHANGED" );

	// Throw an event
	$(document).trigger( "XML_HAS_LOADED" );
}





