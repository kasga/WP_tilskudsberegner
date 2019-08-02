

/***************************************** CONTROLLER *****************************************/


var user_choices;
var o = {};
var user_total;
var min_grant = 310;
var activeGrant;



/***************** PAGE 0 *****************/

//Init the "Select box" on page 0
$( document ).on( "READY_TO_INIT", function( event ) 
{
	var sbheating = -1;
	var sbhousing = -1;



	$('#sb-heating').on('change', function()
	{
		sbheating = $('#sb-heating option:selected').attr('data-id');
		if(sbheating >= 0)		$(this).parent().find('.error-text').hide();	
		$('.heating-type').html($('#sb-heating option:selected').val());

    // // Get value
    // var value = $(this).val();
    
    // if (value === 'varmepumpe' || value === 'pillefyr/biobrænsel') {
    //   $('.extra-fields').show();
    // } else {
    //   $('.extra-fields').hide();
    // }
	})


	$('#sb-housing').on('change', function()
	{
		
		sbhousing = $('#sb-housing option:selected').attr('data-id');
		if(sbhousing >= 0)		$(this).parent().find('.error-text').hide();	

	})


	


	var sb_validator = $("#selectboxes").validate(
	{

		errorClass:'error-text error-below',
        errorElement: 'div',
        errorPlacement: function(error, element) {
        				
        	error.insertAfter(element.parent().find('.sbHolder'));       		
            
        },  

        submitHandler: function(form, event)
        {
        	pageIsValid[0] = true;

        	getXML(sbheating, sbhousing);	

		   	event.preventDefault();
        },   
        
        rules: {
            residence_heating: 
            {
            	required:true,
            },
            residence_type: 
            {
            	required:true,
            }
        },
        messages: {
            residence_heating: "Vælg venligst",
            residence_type: "Vælg venligst"
        } ,
        ignore: []
	});


	initTooltip('.page0', 'right');	
});




function initTooltip(el, pos)
{
	var tip = $(el).find('.zr-tooltip-btn').parent().find('.zr-tooltip');
	var btn = $(el).find('.zr-tooltip-btn').parent().find('.zr-tooltip-btn');
	var arrow = $(el).find('.zr-tooltip-btn').parent().find('.tip-arrow');
	
	var btnX = btn.position().left;
	var btnY = btn.position().top;
	var btnW = btn.outerWidth();
	var tipH = tip.outerHeight();
	var tipW = tip.outerWidth();
	
	if(pos == "right")
	{		
		tip.css({'right':9, 'top':btnY - tipH - 20});
		arrow.css({'left':tipW - btnW/2});
	}	


	$(el).find('.zr-tooltip-btn').on('click', function()
	{
		showToolTip(el);		
	});



	$(el).find('.zr-tooltip').on('click', function()
	{
		$(this).hide();
	});

}



function showToolTip(el)
{
	if(el == '.page0')
	{
		
	}	


	if(el == '.page1')
	{
		if(pageIsValid[1] == false)
		{
			$('.page1 .zr-tooltip').show();	
			setTimeout(removeListenerEvent, 200);
		}	
	}		
}




function removeListenerEvent()
{
	$(document).on('click', function()
	{
		$('.page1 .zr-tooltip').hide();
		$(document).off('click');		
	})			
}



/***************** PAGE 1 *****************/


//Input fields on page 1
$( document ).on( "XML_HAS_LOADED", function( event ) 
{
	//Adds logic to the input fields on the list.
	inputsOnList();	

	// Logic to open close on each grant
	listOpenClose();

	//Init inputs
	initinputs();

		
});






$( document ).on( "NEXT_PAGE_BTN", function( event ) 
{
	if(activePage == 0)
	{
		setTimeout(function(){initTooltip('.page1', 'right')}, 500);	
	}
});




function shoppingCard()
{
	$('#your_choices .delete-entry').on('click', function()
	{
		var id = $(this).parent().parent().parent().parent().attr('data-unique');
		var type = $(this).parent().parent().parent().parent().attr('data-type');
		
		if(type == "stk")
		{
			$(".option").find("input[data-unique='" + id + "']").attr('checked', false)
			$(".option").find("input[data-unique='" + id + "']").parent().find('.checkbox').removeClass('active');
			$(".option").find("input[data-unique='" + id + "']").parent().parent().find(".calculated-amount").html('').attr('data-calculated-amount', '');
		}
		else
		{
			$(".option").find("input[data-unique='" + id + "']").val('');
			$(".option").find("input[data-unique='" + id + "']").parent().find(".calculated-amount").html('').attr('data-calculated-amount', '');	
		}
		



		// Throw an event
		$(document).trigger( "LIST_AMOUT_CHANGED" );
	})
}

$( document ).on( "NEXT_PAGE_BTN", function( event ) 
{
	if(pageIsValid[1] == false && user_total > 0)
	{
		if(user_total > 0)
		{
			$('.page1 .zr-tooltip-txt').eq(0).removeClass('zr-hide');
			$('.page1 .zr-tooltip-txt').eq(1).addClass('zr-hide');
		}	
		else
		{
			$('.page1 .zr-tooltip-txt').eq(0).addClass('zr-hide');
			$('.page1 .zr-tooltip-txt').eq(1).removeClass('zr-hide');
		}
		$('.page1_tooltip').show();
	}

	$('.page1_tooltip').on('click', function()
	{
		$(this).hide();
	});	
	
		
});








function initinputs()
{
	$('.option input:checkbox').change(function()
	{
		if ($(this).is(':checked')) 
		{
			$(this).prev().addClass('active');
			calculateGrant($(this), 'checked');
		}
		else
		{
			$(this).prev().removeClass('active');	
			calculateGrant($(this), 'unchecked');
		}
		
	})
}









function listOpenClose()
{
	$('.grant .title').on('click', function()
	{
		//The ID of the grant you just clicked
		var thisGrantID = $(this).parent().attr('data-grantid');

		//Close all all grants
		$('.grant .title').removeClass('active');
		$('.grant .option').removeClass('active');
		$('.grant').removeClass('active');

		if(activeGrant != thisGrantID)	
		{
			$(this).toggleClass('active');
			$(this).parent().find('.option').addClass('active');	
			$(this).parent().addClass('active');	
		
			activeGrant = thisGrantID;
		}
		else
		{
			activeGrant = -1;
		}

		if($(this).hasClass('active'))
		{
			var inp = $(this).parent().find('.option').eq(0).find('.option-input');
			var sect = $(this).parent().parent().find('.header').position().top;
			scrolltopIframe(sect +130)
			inp.focus();
		}


		//Resizes the iFrame window, cause the max-height property is not beeing registered with the iframe-resizer
		resizeIframe();		
	})
}





function inputsOnList()
{
	$(".option-input").on('keydown', function(event)
	{
		var key = event.which;

		if((key != 8 && key != 9 && key != 13 && key != 37 && key != 39  ) && (key < 46 || key > 58) && (key < 96 || key > 105))	event.preventDefault();
	})

	$(".option-input").on('keyup', function(event)
	{
		calculateGrant($(this), '');	
	})
}



function calculateGrant(el, state)
{
	var type = el.data('type');
	var val = parseFloat(el.data('kwh'));
	var multiply = parseFloat(el.data('multiply'));
	var kr = parseFloat(el.data('kr'));
	var user_input;

	if(type == 'stk' && state == 'checked')		user_input = 1; 
	else if(type == 'stk' && state == 'unchecked')	user_input = 0; 
	else										user_input = parseFloat(el.val());
	
	
	
	var cal_amount
	var display_amount;

	if(type == 'stk')
	{
		cal_amount = Math.round(user_input * val * multiply * kr);
		cal_amount = (cal_amount > 0) ? cal_amount : 0;
		display_amount = (cal_amount > 0) ? addDots(cal_amount) + ' kr.' : '';

		// Adds the calculated value to the calculated amount div
		el.parent().parent().find('.calculated-amount').html(display_amount );
		el.parent().parent().find('.calculated-amount').attr('data-calculated-amount', cal_amount);
	}
	else
	{
		cal_amount = Math.round(user_input * val * multiply * kr);
		cal_amount = (cal_amount > 0) ? cal_amount : 0;
		display_amount = (cal_amount > 0) ? addDots(cal_amount) + ' kr.' : '';

		// Adds the calculated value to the calculated amount div
		el.parent().find('.calculated-amount').html(display_amount );
		el.parent().find('.calculated-amount').attr('data-calculated-amount', cal_amount);
		
		
	}
	
	

	
	

	// Throw an event
	$(document).trigger( "LIST_AMOUT_CHANGED" );
}















/***************** PAGE 2 *****************/



//Init the "Validation of the form" buttons on page 2
$( document ).on( "READY_TO_INIT", function( event ) 
{
	$('#cb0, #cb1, #cb2').on('change', function()
	{
		$(this).parent().find('.error').html('');
	})


	$('#sb-createdby').on('change', function()
	{
		if($('#sb-createdby').val() != null)
		{

			$(this).parent().parent().find('.error-text').remove();
		}		
	})



	$('.zr-conditions').on('click', function()
	{
		scrolltopIframe(0);
	})


	var validator = $("#signupform").validate(
	{

		errorClass:'error-text error-below',
        errorElement: 'div',
        errorPlacement: function(error, element) {
        		
        	
        	if(element[0].name == 'customer')																						$(".iscustomer .error").html( error.text() );          		
        	else if(element[0].name == 'condition_0' || element[0].name == 'condition_1' || element[0].name == 'condition_2')		element.parent().find('.error').html( error.text() );						
        	else if(element[0].name == 'createdby')																					error.insertAfter(element.parent().find('.sbHolder'));
        	else																										       		error.insertAfter(element);	
        	
            
        },
        highlight: function (element, errorClass, validClass) { 
            
        },      
        unhighlight: function (element, errorClass, validClass) { 
            
        },   

        submitHandler: function(form, event)
        {
        	event.preventDefault();

        	// console.log(JSON.stringify($('form').serializeObject()));
        	// $('form').serializeObject();
        	
        	validateAddress($('#address-input').val());        	
        },   
        
        rules: {
            firstname: 
            {
            	required:true,
            	minlength: 2
            },
            lastname: 
            {
            	required:true,
            	minlength: 2
            },
            address: 
            {
            	required:true,
            	minlength: 2
            },
            phone: 
            {
            	required:true,
            	minlength: 8,
            	maxlength: 8
            },
            email: 
            {
            	required:true,
            	email:true
            },
            craftsmanEmail: 
            {
              required:false,
              email:true
            },
            housingYear:
            {
            	required:true,
            	minlength: 4,
            	maxlength: 4		
            },
            createdby:
            {
            	required:true,            
            },
            customer: 
            {
            	required:true,
            },
            condition_0: 
            {
            	required:true,
            },
            condition_1: 
            {
            	required:true,
            },

            condition_2: 
            {
            	required:true,
            }
        },
        messages: {
            firstname: "Hvad er dit fornavn?",
            lastname: "Hvad er dit efternavn?",
            address: "Hvad er adressen?",
            phone: "Hvad er dit telefonnummer (8 tal)?",
            email: "Hvad er din e-mailadresse?",
            customer: "Vælg venligst",
            housingYear: "Hvornår er huset fra?",
            createdby: "Vælg venligst",
            condition_0: "Udfyld venligst",
            condition_1: "Udfyld venligst",
            condition_2: "Udfyld venligst"
        } ,
        ignore: []
	});


	

	initCustomerField();
});













function validateAddress(string) {
    prepareSubmission();
    return;

	$.ajax({
      url: 'https://dawa.aws.dk/adresser/autocomplete',
      dataType: "json",
      data: {
        q:string
      },
      success: function( data ) {
      	if(data.length == 1 && $('#address-input').val() != '')
      	{
      		prepareSubmission();
      	}
      	else
      	{
      		$('#address-input').parent().parent().append('<div id="address-input-error-2" class="error-text error-below">Hvad er adressen?</div>');
      	}
      }
    });	
}


function prepareSubmission()
{
	submitData($('form').serializeObject(), function(){
        pageIsValid[2] = true;
        nextPage();
    });
}












	


//Input fields on page 2
$(document).on( "LIST_AMOUT_CHANGED", function( event ) 
{

	//Each "grant" section is caluclated to a total
	user_choices = new Array();
	var grant_len = $('.grant').length;

	for(var i=0; i<grant_len; i++)
	{
		var grant = $('.grant').eq(i);
		var options_len = grant.find('.option').length;		
		var total_amount = 0; 
		var type = grant.parent().find('.header-txt').text();
		var subtype = grant.find('.title .subtitle').text();

		
			for (var k = 0; k < options_len; k++) 
			{
				var data_attr = grant.find('.option').eq(k).find('.calculated-amount').attr('data-calculated-amount');
				data_attr = (data_attr > 0) ? data_attr : 0;
				total_amount += parseFloat(data_attr);

				if(data_attr > 0)
				{

					var txt = grant.find('.option').eq(k).find('.option-title').text();
					var orsted_txt = grant.find('.option').eq(k).find('input').attr('data-prefix') + ' ' + txt;
					var input_type = grant.find('.option').eq(k).find('input').attr('data-type');
					var amount = (input_type == 'stk') ? '1' : grant.find('.option').eq(k).find('input[name="inp-option"]').val();
					var id = grant.find('.option').eq(k).find('input').attr('data-unique');					
					var val = addDots(data_attr);
					user_choices.push({'txt':txt, 'orsted_txt':orsted_txt, 'amount':amount, 'type':type, 'subtype':subtype, 'val':data_attr, 'id':id, 'input_type':input_type});	
				} 
			};

			grant.find('.total-amount').attr('data-total-amount', total_amount);	
			
			total_amount = (total_amount > 0) ? addDots(total_amount) + ' kr.' : '';
			grant.find('.total-amount').html(total_amount);	
	}

	

	// Result at the bottom is filled
	user_total = 0;
	$('.user_choices').html('');
	$.each(user_choices, function(index, value)
	{
		user_total += parseFloat(value.val);
		$('.user_choices').append('<h4 data-type="' + value.input_type + '" data-unique="' + value.id + '"><table><tr><td class="delete-entry"><img src="images/delete_icon.png" alt=""></td><td class="zr-alignleft">' + value.type + ' - ' + value.subtype + '</td><td class="zr-nowrap"><span>' + addDots(value.val) + ' kr.</span></td></table></h4>');		
		
	})

	$('.user_result').find('.amount').html('<h1>' + addDots(user_total) + ' kr.</h1>');


	//Show/hide user result field on page 2
	if(user_choices.length > 0)
	{
		$('#your_choices').removeClass('zr-hide');
		$('.zr-responsibility').addClass('zr-hide');		
	}	
	else{
		$('#your_choices').addClass('zr-hide');
		$('.zr-responsibility').removeClass('zr-hide');		
	}

  // Show ekstra fields?
  var extraFields = false; $.each(user_choices, function(i, choice) {
    if ($.inArray(choice.type.toLowerCase(), ['træpillefyr', 'varmepumper', 'kedler']) !== -1) {
      extraFields = true;
      return false;
    }
  });

  if (extraFields) {
    $('.extra-fields').show();
  } else {
    $('.extra-fields').hide();
  }

	//Updates the hidden input field
	if(user_total > min_grant)	pageIsValid[1] = true;
	else 						pageIsValid[1] = false;

	//Add delete events to the shopping card
	shoppingCard();
});




function submitData(values, callback) {
    // Prepare API-base
    var api_base = 'https://api.de-dynamisk.dk/api/';

	$.ajax({
        url: api_base + 'grantregistration',
        type: "post",
        data: JSON.stringify(values),
        contentType: 'text/plain',
        processData: false,
        xhrFields: { withCredentials: true },
        success: function(data){
            // Set ID
            $('.orsted-number').html(data.id);

            // Callback / Next page
            callback();
        }
    });

    // Handle newsletter - skip if condition is not set
    if (typeof values.condition_3 === 'undefined') {
        return;
    }

    // Prepare data
    var newsletter = {
        name: values.firstname,
        surName: values.lastname,
        address: values.street,
        isCustomer: ((values.customer === 'ja') ? '1' : '0'),
        phone: values.phone,
        email: values.email,
        customerId: values.customerKey,
        source: 'tilskud'
    };

    // Handle newsletter signup
    $.ajax({
        url: api_base + 'newsletter',
        type: "post",
        data: JSON.stringify(newsletter),
        contentType: 'text/plain',
        processData: false,
        xhrFields: { withCredentials: true },
        success: function(data){ }
    });    
}


function initCustomerField()
{
	$("input[name='rb-customer1']").change(function()
	{
		if(this.value == 'ja')	$('.iscustomer .customer-input').removeClass('zr-hide');
		else					$('.iscustomer .customer-input').addClass('zr-hide');

        $(this).closest('.input-wrap').find('.error').hide();
	})


	$('.iscustomer input[name="customerKey"]').on('keyup', function()
	{
		var val = $(this).val();

		if(val.length > 0)	
		{
			$('.thanks-remember').removeClass('zr-hide');			
		}
		else
		{
			$('.thanks-remember').addClass('zr-hide');
				
		}
		
	})
}



//Init the "Numeric input fields" on page 2
$( document ).on( "READY_TO_INIT", function( event ) 
{
	$(".numeric").on('keydown', function(event) 
	{
		var k = event.keyCode;
		if( k == 8 || k == 9 || k == 13 || k == 35 || k == 36 || k == 37 || k == 39 || (k > 45 && k < 58) || (k > 95 && k < 106)){}
		else{	event.preventDefault();		}		
	});
});









//Init the "Address Look Up" autocompletion field on page 2
$( document ).on( "READY_TO_INIT", function( event ) 
{

	$( "#address-input" ).autocomplete({

      source: function( request, response ) {
        $.ajax({
          url: 'https://dawa.aws.dk/adresser/autocomplete',
          dataType: "json",
          data: {
            q: request.term
          },
          success: function( data ) {
          	
          	 response( $.map( data, function( item ) {
             	
              return {
                label: item.tekst,
                value:  item.tekst,
                road: item.adresse.vejnavn,
				nr: item.adresse.husnr,
				postnr: item.adresse.postnr,
				city: item.adresse.postnrnavn,
				floor: (item.adresse.etage) ? ', ' + item.adresse.etage + '.' : '',
				door: (item.adresse.dør) ? ' ' + item.adresse.dør + '.' : ''		
              }
            }));
          }
        });
      },
      minLength: 3,
      focus: function( event, ui ) {
        return false;
      },
      select: function( event, ui ) {
      	$('#street-input').val(ui.item.road + ' ' + ui.item.nr + ui.item.floor + ui.item.door);
		$('#address-input').val(ui.item.label);
		$('#zip-input').val(ui.item.postnr);
		$('#city-input').val(ui.item.city);    
 
        return false;
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    })
});







//Init the "Boligoplysninger" buttons on page 2
$( document ).on( "READY_TO_INIT", function( event ) 
{
	$('.residence-btn').on('click', function(event)
	{
		$('.residence-btn').removeClass('active');
		$('input[name="residence"]').attr('value', $(this).text());
		$(this).addClass('active');

		event.preventDefault();
	})



	$('.year-of-construction').on('click', function(event)
	{
		$('.year-of-construction').removeClass('active');
		$('input[name="year_of_construction"]').attr('value', $(this).text());
		$(this).addClass('active');

		event.preventDefault();
	})


	$('.build-by-btn').on('click', function(event)
	{
		$('.build-by-btn').removeClass('active');
		$('input[name="build_by"]').attr('value', $(this).text());
		$(this).addClass('active');

		event.preventDefault();
	})

	
});

$.fn.serializeObject = function()
{
    o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    delete o['inp-option'];
    o['improvements_list'] = user_choices;
    o['total'] = user_total;
    
    return o;
};


$(window).load(function() {
    $('form').each(function(i,form){
        form.reset();
    });
});

$( document ).on( "NEXT_PAGE_BTN", function(e) {
    // Scroll to top
    if ('parentIFrame' in window) {
        // Send scroll event
        parentIFrame.scrollTo(0, 0);
    } else {
        $(window).scrollTop(0);
    }

    // Skip if tracking isn't available
    if (typeof $netminers === 'undefined') {
        return;
    }

    // Prepare base
    var base = 'beregner/tilskud_privat/';

    // Handle tracking
    var path = '';
    switch (activePage) {
        case 0:
            path = 'Step 2 - Tilskudsmuligheder';
            break;
        case 1:
            path = 'Step 3 - Ansøgning';
            break;
        case 2:
            path = 'Step 4 - Kvitteringsside';
            break;
    }

    // Perform tracking
    $netminers.push(['postPageView', base + path]);
    if (typeof ga !== 'undefined') {
        ga('send', 'pageview', base + path);
    }
});

setTimeout(function(){
    if (typeof $netminers !== 'undefined') {
        // Perform initial tracking
        $netminers.push(['postPageView', 'beregner/tilskudsberegner/Step 1 - Forside tilskudsberegner']);
    }
    if (typeof ga !== 'undefined') {
        ga('send', 'pageview', 'beregner/tilskud_privat/Step 1 - Forside tilskudsberegner');
    }
}, 1500);