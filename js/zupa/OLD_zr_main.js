//needed for IE because console is only created when dev tools is open
if (!(window.console && console.log)) {
  console = {
    log: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {}
  };
}


/***************************************** VIRES *****************************************/


var activePage = 0;
var numOfPages;
var pageIsValid = new Array(false, false, false, false);



$(document).ready(function() {
  // Throw an event
  $(document).trigger("READY_TO_INIT");
})



$(document).on("READY_TO_INIT", function(event) {
  numOfPages = $('.page').length;
  handleActivePage();

  $('.btn-nextpage').on('click', function(event) {
    nextPage();
    event.preventDefault();
  })

  $('.btn-prevpage').on('click', function(event) {
    prevPage();
    event.preventDefault();
  })
});


function nextPage() {
  // Throw an event
  $(document).trigger("NEXT_PAGE_BTN");

  if (pageIsValid[activePage] === false) return;

  activePage = (activePage < numOfPages - 1) ? ++activePage : numOfPages - 1;
  handleActivePage();
}


function prevPage() {
  activePage = (activePage > 0) ? --activePage : 0;
  handleActivePage();
}


function gotoPage(id) {
  activePage = id;
  handleActivePage();
}


function handleActivePage() {
  $('.page').removeClass('active');
  $('.page' + activePage).addClass('active');
  scrolltopIframe();
  resizeIframe();
}


function resizeIframe() {
  if ('parentIFrame' in window) {
    setTimeout(function() {
      parentIFrame.size()
    }, 1100);
  }
}


function scrolltopIframe() {
  if ('parentIFrame' in window) {
    // Send scroll event
    parentIFrame.sendMessage('scrollToIframe');
  } else {
    $(window).scrollTop(0);
  }
} /***************************************** MODEL *****************************************/

var xmlURL = ['Fjernvarme.xml?cache=v3',
  'OLIE.xml?cache=v3',
  'GAS.xml?cache=v3',
  'Varmepumpe.xml?cache=v3',
  'Bio.xml?cache=v3',
  'Elvarme.xml?cache=v3'
]


var userWhich = '';
var userHousing = '';

function getXML(which, housing) {
  if ((parseFloat(which) < 5) && parseFloat(housing) == 1) {
    $('.page0 .zr-tooltip').addClass('show');

    $(document).on('click', function() {
      $('.page0 .zr-tooltip').removeClass('show');
      $(document).off('click');
    })

    return;
  }



  if (userWhich == which && userHousing == housing) {
    nextPage();
  } else {
    var xmlfile;
    userWhich = which;
    userHousing = housing;

    // if (parseFloat(housing) == 1) xmlfile = 'data/sommerhus/' + xmlURL[which];
    // else xmlfile = 'data/villa/' + xmlURL[which];

    if (parseFloat(housing) == 0) xmlfile = 'data/villa/' + xmlURL[which];
    else if (parseFloat(housing) == 1) xmlfile = 'data/sommerhus/' + xmlURL[which];
    else xmlfile = 'data/boligforening/' + xmlURL[which];

    $.ajax({
      type: "GET",
      url: xmlfile,
      dataType: "xml",
      success: function(xml) {
        handleXML(xml, housing);

      }
    });

    nextPage();
  }
}



function handleXML(xml, housing) {
  //Fill the list with data
  var list = "";
  var unit = "";
  var kr = $(xml).find("improvements").attr('kr');
  var grantid = 0;
  var counter = 100;
  var option_container = $('<div class="option-container"/>');

  $(xml).find("improvement").each(function() {

    // Handle "Ventilation"
    if ($(this).find("title").eq(0).text() === 'Ventilation') {
      if (housing == 0) {
        $(this).find('option kwh').html('3750');
      } else if (housing == 2) {
        $(this).find('option kwh').html('2680');
      }
    }

    list += '<section class="improvement-list">';
    list += '<p class="header"><span class="header-txt">' + $(this).find("title").eq(0).text() + '</span>';
    list += '<span class="pull-right">Tilskud</span>';
    list += '</p>';

    $(this).find("grant").each(function() {
      list += '<div class="grant" data-grantid="' + grantid + '">';
      list += '<div class="title"><table style="width:100%"><tr><td class="subtitle">' + $(this).find("title").eq(0).text() + '</td>';
      list += '<td class="zr-nowrap"><span class="total-amount input-wrap" data-total-amount="0"></span></td></tr></table></div>';
      ++grantid;

      list += '<div class="option-container"><div class="option-content">';

      $(this).find("option").each(function() {
        var multiply = ($(this).find("multiply").text() == "" || $(this).find("multiply").text() == 0) ? 1 : $(this).find("multiply").text();
        var type = $(this).attr('type');
        var prefix = $(this).find('title').attr("prefix");
        var unit = ($(this).find("unit").text() == 'm2') ? 'm&sup2;' : $(this).find("unit").text().replace('m2', 'm&sup2;');
        var body = $(this).find("body").text().replace(/(ft|m)2/g, "$1<sup>2</sup>");
        var helptext = $(this).find("help").text().replace(/(ft|m)2/g, "$1<sup>2</sup>");
        var helpimg = $(this).find("help").attr("src");
        input = (type == 'stk') ? '<div class="checkbox-radio-wrap"><input type="checkbox" name="cbinput" class="cbinput" id="cbinput' + counter + '" data-unique="' + counter + '" data-kr="' + kr + '"data-prefix="' + prefix + '" data-multiply="' + multiply + '" data-kwh="' + $(this).find("kwh").text() + '" data-type="' + type + '" ><label class="cbinput-label" for="cbinput' + counter + '"> 1 ' + $(this).find("unit").text() + '</label></div>' : '<input type="text" class="option-input" name="inp-option" data-unique="' + counter + '" data-kr="' + kr + '" data-multiply="' + multiply + '" data-kwh="' + $(this).find("kwh").text() + '" data-type="' + type + '"data-prefix="' + prefix + '">';

        (type == 'stk') ? unit = '': unit;

        list += '<div class="option">';
        list += '<h3 class="option-title">' + $(this).find("title").text() + '</h3>';
        list += '<p class="option-text">' + body + '</p>';
        list += '<label data-unit="' + unit + '">' + input;
        list += '<div class="calculated-amount" data-calculated-amount="0"></div>';
        list += '</label>';
        //list += (helptext != "") ? '<div class="zr-modal-trigger" data-helptxt="' + helptext + '" data-helpimg="' + helpimg + '"><div class="zr-modal-trigger-circle"><img class="zr-modal-trigger-icon" src="images/camera.svg" alt=""></div> Husk billeddokumentation</div>' : "";
        list += '</div>';

        ++counter;
      });

      list += '</div></div></div>';
    });

    list += "</section>"
  });

  $('#improvements_list').html(list);

  // Clear the list of what the user has chosen prior
  $(document).trigger("LIST_AMOUT_CHANGED");

  // Throw an event
  $(document).trigger("XML_HAS_LOADED");

  // Handle label unit and option-
  // container height on small screens
  $(window).on('resize', function() {
    var label = $('label[data-unit]');
    var container = $('.option-container');

    container.each(function() {
      var content = $(this).find('.option-content');
      var totalHeight = parseInt(content.css('padding-top')) +
        parseInt(content.css('padding-bottom'));

      content.children().each(function() {
        totalHeight = totalHeight + $(this).outerHeight(true);
      });

      if ($(this).closest('.grant').is('.active')) {
        $(this).css('height', totalHeight);
      }
    });

    label.each(function() {
      var unit = $(this).data('unit');

      if ($(window).width() < 700) {
        $(this).attr('data-unit',
          $(this).data('unit')
          .replace('meter', 'm')
          .replace('rør', '')
          .replace('dør', '')
          .replace('ruder', '')
          .replace('vinduer', ''));
      } else {
        $(this).attr('data-unit', unit);
      }
    });
  }).resize();
}

/***************************************** CONTROLLER *****************************************/


var user_choices;
var o = {};
var user_total;
var min_grant = 310;
var activeGrant;



/***************** PAGE 0 *****************/

//Init the "Select box" on page 0
$(document).on("READY_TO_INIT", function(event) {
  var sbheating = -1;
  var sbhousing = -1;



  $('#sb-heating').on('change', function() {
    sbheating = $('#sb-heating option:selected').attr('data-id');
    if (sbheating >= 0) $(this).parent().find('.error-text').hide();
    $('.heating-type').html($('#sb-heating option:selected').val());

    // // Get value
    // var value = $(this).val();

    // if (value === 'varmepumpe' || value === 'pillefyr/biobrænsel') {
    //   $('.extra-fields').show();
    // } else {
    //   $('.extra-fields').hide();
    // }
  })


  $('#sb-housing').on('change', function() {

    sbhousing = $('#sb-housing option:selected').attr('data-id');
    if (sbhousing >= 0) $(this).parent().find('.error-text').hide();

  })



  var sb_validator = $("#selectboxes").validate({

    //errorClass: 'error-text error-below',
    errorElement: 'div',
    errorPlacement: function(error, element) {

      //error.addClass('error-text').insertAfter(element.parent().find('.sbHolder'));
      element.parent().append(error.addClass('error-text'));
    },

    submitHandler: function(form, event) {
      pageIsValid[0] = true;

      getXML(sbheating, sbhousing);

      event.preventDefault();
    },

    rules: {
      residence_heating: {
        required: true,
      },
      residence_type: {
        required: true,
      }
    },
    messages: {
      residence_heating: "Vælg venligst",
      residence_type: "Vælg venligst"
    },
    ignore: []
  });

  setTimeout(function() {
    initTooltip('.page0', 'right')
  }, 500);
});



function initTooltip(el, pos) {
  var tip = $(el).find('.zr-tooltip-btn').parent().find('.zr-tooltip');
  var btn = $(el).find('.zr-tooltip-btn').parent().find('.zr-tooltip-btn');
  var arrow = $(el).find('.zr-tooltip-btn').parent().find('.tip-arrow');

  var btnX = btn.position().left;
  var btnY = btn.position().top;
  var btnW = btn.outerWidth();
  var tipH = tip.outerHeight();
  var tipW = tip.outerWidth();

  if (pos == "right") {
    tip.css({
      'right': 9,
      'top': btnY - tipH - 20
    });
    arrow.css({
      'left': tipW - btnW / 2
    });
  }

  $(el).find('.zr-tooltip-btn').on('click', function() {
    showToolTip(el);
  });

  $(el).find('.zr-tooltip').on('click', function() {
    $(this).removeClass('show');
  });

}



function showToolTip(el) {
  if (el == '.page0') {

  }


  if (el == '.page1') {
    if (pageIsValid[1] == false) {
      $('.page1 .zr-tooltip').addClass('show');
      setTimeout(removeListenerEvent, 200);
    }
  }
}



function removeListenerEvent() {
  $(document).on('click', function() {
    $('.page1 .zr-tooltip').removeClass('show');
    $(document).off('click');
  })
}



/***************** PAGE 1 *****************/


//Input fields on page 1
$(document).on("XML_HAS_LOADED", function(event) {
  //Adds logic to the input fields on the list.
  inputsOnList();

  // Logic to open close on each grant
  listOpenClose();

  // Init inputs
  initinputs();

  // Back button
  linkArrow();

  orstedInput();

  orstedRadio();

  formHelp();

  popover();

  modal();
});



function modal() {
  $('.close-btn').on('click', function() {
    $('#zr-modal').addClass('hide');
  })

  $('.zr-modal-trigger').on('click', function() {
    var helptxt = $(this).attr('data-helptxt');
    var helpimg = $(this).attr('data-helpimg');
    var top = $(document).scrollTop();

    $('#zr-modal .zr-modal-img').attr('src', helpimg);
    $('#zr-modal .zr-modal-text').html(helptxt);
    $('#zr-modal').css({
      'top': top + 30
    })
    $('#zr-modal').removeClass('hide');
  })
}


$(document).on("NEXT_PAGE_BTN", function(event) {
  if (activePage == 0) {
    setTimeout(function() {
      initTooltip('.page1', 'right')
    }, 500);
  }
});



function shoppingCard() {
  $('#your_choices .delete-entry').on('click', function() {
    var id = $(this).closest('[data-unique]').attr('data-unique');
    var type = $(this).closest('[data-type]').attr('data-type');

    if (type == "stk") {
      $(".option").find("input[data-unique='" + id + "']").attr('checked', false)
      $(".option").find("input[data-unique='" + id + "']").parent().find('.checkbox').removeClass('active');
      $(".option").find("input[data-unique='" + id + "']").parent().parent().find(".calculated-amount").html('').attr('data-calculated-amount', '');
    } else {
      $(".option").find("input[data-unique='" + id + "']").val('');
      $(".option").find("input[data-unique='" + id + "']").parent().find(".calculated-amount").html('').attr('data-calculated-amount', '');
    }

    // Throw an event
    $(document).trigger("LIST_AMOUT_CHANGED");
  })
}

$(document).on("NEXT_PAGE_BTN", function(event) {
  if (pageIsValid[1] == false && user_total > 0) {
    if (user_total > 0) {
      $('.page1 .zr-tooltip-txt').eq(0).removeClass('zr-hide');
      $('.page1 .zr-tooltip-txt').eq(1).addClass('zr-hide');
    } else {
      $('.page1 .zr-tooltip-txt').eq(0).addClass('zr-hide');
      $('.page1 .zr-tooltip-txt').eq(1).removeClass('zr-hide');
    }
    $('.page1_tooltip').addClass('show');
  }

  $('.page1_tooltip').on('click', function() {
    $(this).removeClass('show');
  });


});



function initinputs() {
  $('.option input:checkbox').change(function() {
    if ($(this).is(':checked')) {
      $(this).prev().addClass('active');
      calculateGrant($(this), 'checked');
    } else {
      $(this).prev().removeClass('active');
      calculateGrant($(this), 'unchecked');
    }

  })
}


function listOpenClose() {
  $('.grant .title').on('click', function(e) {
    var title = $(this);
    //The ID of the grant you just clicked
    var thisGrantID = $(this).parent().attr('data-grantid');
    var container = $(this).parent().find('.option-container');
    var content = container.find('.option-content');
    var contentHeight = parseInt(content.css('padding-top')) +
      parseInt(content.css('padding-bottom'));

    // Add height of content to height of its children
    content.children().each(function() {
      contentHeight += $(this).outerHeight(true);
    });

    // Close all all grants
    $('.grant').removeClass('active');
    $('.grant .title').removeClass('active');
    $('.grant .option').removeClass('active');
    $('.grant .option-container').removeAttr('style');

    if (activeGrant != thisGrantID) {
      container.css('height', contentHeight);
      $(this).toggleClass('active');
      $(this).parent().find('.option').addClass('active');
      $(this).parent().addClass('active');
      // Scroll and set focus to first empty input after animation
      setTimeout(function() {
        title.parent().find('input:text[value=""]').first().focus();
        //scrolltopIframe(title.parent().position().top + 130);
      }, 200);

      activeGrant = thisGrantID;
    } else {
      activeGrant = -1;
      $('.grant .option-container').removeAttr('style');
    }

    /*
    if ($(this).hasClass('active')) {
    	var inp = $(this).parent().find('.option').eq(0).find('.option-input');
    	var sect = $(this).parent().parent().find('.header').position().top;
    	scrolltopIframe(sect + 130)
    	inp.focus();
    }
    */

    // Resizes the iFrame window, cause the max-height property is not beeing registered with the iframe-resizer
    resizeIframe();
  })
}



function inputsOnList() {
  $(".option-input").on('keydown', function(event) {
    var key = event.which;

    if ((key != 8 && key != 9 && key != 13 && key != 37 && key != 39) && (key < 46 || key > 58) && (key < 96 || key > 105)) event.preventDefault();
  })

  $(".option-input").on('keyup', function(event) {
    calculateGrant($(this), '');
  })
}



function calculateGrant(el, state) {
  var type = el.data('type');
  var val = parseFloat(el.data('kwh'));
  var multiply = parseFloat(el.data('multiply'));
  var kr = parseFloat(el.data('kr'));
  var user_input;

  if (type == 'stk' && state == 'checked') user_input = 1;
  else if (type == 'stk' && state == 'unchecked') user_input = 0;
  else user_input = parseFloat(el.val());

  var cal_amount
  var display_amount;

  if (type == 'stk') {
    cal_amount = Math.round(user_input * val * multiply * kr);
    cal_amount = (cal_amount > 0) ? cal_amount : 0;
    display_amount = (cal_amount > 0) ? addDots(cal_amount) + ' kr.' : '';

    // Adds the calculated value to the calculated amount div
    el.parent().parent().find('.calculated-amount').html(display_amount);
    el.parent().parent().find('.calculated-amount').attr('data-calculated-amount', cal_amount);
  } else {
    cal_amount = Math.round(user_input * val * multiply * kr);
    cal_amount = (cal_amount > 0) ? cal_amount : 0;
    display_amount = (cal_amount > 0) ? addDots(cal_amount) + ' kr.' : '';

    // Adds the calculated value to the calculated amount div
    el.parent().find('.calculated-amount').html(display_amount);
    el.parent().find('.calculated-amount').attr('data-calculated-amount', cal_amount);
  }

  // Throw an event
  $(document).trigger("LIST_AMOUT_CHANGED");
}



/***************** PAGE 2 *****************/



//Init the "Validation of the form" buttons on page 2
$(document).on("READY_TO_INIT", function(event) {
  $('#cb0, #cb1, #cb2, #cb3, #cb4').on('change', function() {
    $(this).parent().find('.error').html('');
  });

  $('select[data-init="orsted.select"], input[data-init="orsted.input"]').on('focus blur change', function() {
    $(this).closest('.input-wrap').removeClass('has-danger').find('[class*="error"]').hide();
  });

  $('#sb-createdby').on('change', function() {
    $(this).closest('.input-wrap').find('[class*="error"]').remove();
  });

  $('.zr-conditions').on('click', function() {
    scrolltopIframe();
  })


  var validator = $("#signupform").validate({

    errorClass: 'error-text error-below',
    errorElement: 'div',
    errorPlacement: function(error, element) {

      // Add red exclamation circle in input field
      if (element.is('input[data-init="orsted.input"]')) {
        element.closest('.form-group').addClass('has-danger');
      }

      if (element[0].name == 'customer' ||
        element[0].name == 'createdby') {
        // Make sure there's no error message
        element.closest('.input-wrap')
          .find('[class*="error"]').remove();
        // Append the error message
        element.closest('.input-wrap')
          .append('<small class="error error-text">' + error.text() + '</small>');
      } else if (
        element[0].name == 'condition_0' ||
        element[0].name == 'condition_1' ||
        element[0].name == 'condition_2' ||
        element[0].name == 'condition_3' ||
        element[0].name == 'condition_4') {
        element.parent().find('.error').html(error.text());
      } else {
        error.insertAfter(element);
      }
    },
    highlight: function(element, errorClass, validClass) {

    },
    unhighlight: function(element, errorClass, validClass) {

    },

    submitHandler: function(form, event) {
      event.preventDefault();

      // Check if the user has uploaded files
      var uploader = $.fileuploader.getInstance($('.uploader input[type="file"]'))
      var files = uploader.getFiles()
      var uploaded = true

      $.each(files, function(i, item) {
        uploaded = !!uploaded && item.uploaded
      })

      if (!files.length) {
        alert('Inden du kan fuldføre din ansøgning, skal du uploade mindst ét billede af din nuværende installation.')
        return
      }

      if (!uploaded) {
        alert('En eller flere filer uploader stadig. Vent venligst til de er færdige.')
        return
      }

      validateAddress($('#address-input').val())
    },

    rules: {
      firstname: {
        required: true,
        minlength: 2
      },
      lastname: {
        required: true,
        minlength: 2
      },
      street: {
        required: true,
        minlength: 2
      },
      phone: {
        required: true,
        minlength: 8,
        maxlength: 8
      },
      email: {
        required: true,
        email: true
      },
      craftsmanEmail: {
        required: false,
        email: true
      },
      housingYear: {
        required: true,
        minlength: 4,
        maxlength: 4
      },
      createdby: {
        required: true,
      },
      customer: {
        required: true,
      },
      condition_0: {
        required: true,
      },
      condition_1: {
        required: true,
      },
      condition_2: {
        required: true,
      },
      /* Newsletter
      			condition_3: {
      				required: true,
      			},*/
      condition_4: {
        required: true,
      }
    },
    messages: {
      firstname: "Hvad er dit fornavn?",
      lastname: "Hvad er dit efternavn?",
      street: "Hvad er adressen?",
      phone: "Hvad er dit telefonnummer (8 tal)?",
      email: "Hvad er din e-mailadresse?",
      customer: "Vælg venligst",
      housingYear: "Hvornår er huset fra?",
      createdby: "Vælg venligst",
      condition_0: "Udfyld venligst",
      condition_1: "Udfyld venligst",
      condition_2: "Udfyld venligst",
      //condition_3: "Udfyld venligst",
      condition_4: "Udfyld venligst"
    },
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
      q: string
    },
    success: function(data) {
      if (data.length == 1 && $('#address-input').val() != '') {
        prepareSubmission();
      } else {
        $('#address-input').parent().append('<div id="address-input-error-2" class="error-text error-below">Hvad er adressen?</div>');
      }
    }
  });
}


function prepareSubmission() {
  submitData($('form').serializeObject(), function() {
    pageIsValid[2] = true;
    nextPage();
    imageTheme();
  });
}



//Input fields on page 2
$(document).on("LIST_AMOUT_CHANGED", function(event) {

  //Each "grant" section is caluclated to a total
  user_choices = new Array();
  var grant_len = $('.grant').length;

  for (var i = 0; i < grant_len; i++) {
    var grant = $('.grant').eq(i);
    var options_len = grant.find('.option').length;
    var total_amount = 0;
    var type = grant.parent().find('.header-txt').text();
    var subtype = grant.find('.title .subtitle').text();


    for (var k = 0; k < options_len; k++) {
      var data_attr = grant.find('.option').eq(k).find('.calculated-amount').attr('data-calculated-amount');
      data_attr = (data_attr > 0) ? data_attr : 0;
      total_amount += parseFloat(data_attr);

      if (data_attr > 0) {

        var txt = grant.find('.option').eq(k).find('.option-title').text();
        var orsted_txt = grant.find('.option').eq(k).find('input').attr('data-prefix') + ' ' + txt;
        var input_type = grant.find('.option').eq(k).find('input').attr('data-type');
        var amount = (input_type == 'stk') ? '1' : grant.find('.option').eq(k).find('input[name="inp-option"]').val();
        var id = grant.find('.option').eq(k).find('input').attr('data-unique');
        var val = addDots(data_attr);
        user_choices.push({
          'txt': txt,
          'dong_txt': orsted_txt,
          'amount': amount,
          'type': type,
          'subtype': subtype,
          'val': data_attr,
          'id': id,
          'input_type': input_type
        });
      }
    };

    grant.find('.total-amount').attr('data-total-amount', total_amount);

    total_amount = (total_amount > 0) ? addDots(total_amount) + ' kr.' : '';
    grant.find('.total-amount').html(total_amount);
  }



  // Result at the bottom is filled
  user_total = 0;
  $('.user_choices').html('');
  $.each(user_choices, function(index, value) {
    user_total += parseFloat(value.val);
    $('.user_choices').append('<div data-type="' + value.input_type + '" data-unique="' + value.id + '"><table><tr><td class="zr-delete"><span class="delete-entry"></span></td><td class="zr-alignleft"><span class="entry-text">' + value.type + ' - ' + value.subtype + '</span></td><td class="zr-nowrap"><span class="entry-value">' + addDots(value.val) + ' kr.</span></td></table></div>');
  });

  $('.user_result').find('.amount').html('<h2>' + addDots(user_total) + ' kr.</h2>');

  // Remove all delete buttons except first
  $('.user_choices:not(:first)').each(function() {
    $(this).find('.zr-delete').remove();
  });

  //Show/hide user result field on page 2
  if (user_choices.length > 0) {
    $('#your_choices').removeClass('zr-hide');
    $('.zr-responsibility').addClass('zr-hide');
  } else {
    $('#your_choices').addClass('zr-hide');
    $('.zr-responsibility').removeClass('zr-hide');
  }

  // Show ekstra fields?
  var extraFields = false;
  $.each(user_choices, function(i, choice) {
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
  if (user_total > min_grant) pageIsValid[1] = true;
  else pageIsValid[1] = false;

  //Add delete events to the shopping card
  shoppingCard();
});



function submitData(values, callback) {
  // Prepare API-base
  var api_base = 'https://api.de-dynamisk.dk/api/';

  var uploader = $.fileuploader.getInstance($('.uploader input[type="file"]'))
  var files = uploader.getUploadedFiles()
  var items = ''

  $.each(files, function(i, item) {
    var url = item.data.file
    items += '<li>' + url + '</li>'
  })

  values.city = '<ul>' + items + '</ul>';

  $.ajax({
    url: api_base + 'grantregistration',
    type: "post",
    data: JSON.stringify(values),
    contentType: 'text/plain',
    processData: false,
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
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
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {}
  });
}


function initCustomerField() {
  $('.iscustomer input[name="customer"]').change(function() {
    if (this.value == 'ja') $('.iscustomer .customer-input').removeClass('zr-hide');
    else $('.iscustomer .customer-input').addClass('zr-hide');

    $(this).closest('.input-wrap').find('.error').remove();
  })


  $('.iscustomer input[name="customerKey"]').on('keyup', function() {
    var val = $(this).val();

    if (val.length > 0) {
      $('.thanks-remember').removeClass('zr-hide');
    } else {
      $('.thanks-remember').addClass('zr-hide');

    }

  })
}



//Init the "Numeric input fields" on page 2
$(document).on("READY_TO_INIT", function(event) {
  $(".numeric").on('keydown', function(event) {
    var k = event.keyCode;
    if (k == 8 || k == 9 || k == 13 || k == 35 || k == 36 || k == 37 || k == 39 || (k > 45 && k < 58) || (k > 95 && k < 106)) {} else {
      event.preventDefault();
    }
  });
});



//Init the "Address Look Up" autocompletion field on page 2
$(document).on("READY_TO_INIT", function(event) {

  $("#address-input").autocomplete({

    source: function(request, response) {
      $.ajax({
        url: 'https://dawa.aws.dk/adresser/autocomplete',
        dataType: "json",
        data: {
          q: request.term
        },
        success: function(data) {

          response($.map(data, function(item) {

            return {
              label: item.tekst,
              value: item.tekst,
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
    focus: function(event, ui) {
      return false;
    },
    select: function(event, ui) {
      $('#street-input').val(ui.item.road + ' ' + ui.item.nr + ui.item.floor + ui.item.door);
      $('#address-input').val(ui.item.label);
      $('#zip-input').val(ui.item.postnr);
      $('#city-input').val(ui.item.city);

      return false;
    },
    open: function() {
      $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function() {
      $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }
  }).on('keydown', function() {
    $('.ui-autocomplete li a').each(function() {
      if ($(this).is('.ui-state-focus')) {
        $('#address-input').val($(this).text());
        $(this).parent().addClass('ui-state-selected');
      } else {
        $(this).parent().removeClass('ui-state-selected');
      }
    });
  });
});



//Init the "Boligoplysninger" buttons on page 2
$(document).on("READY_TO_INIT", function(event) {
  $('.residence-btn').on('click', function(event) {
    $('.residence-btn').removeClass('active');
    $('input[name="residence"]').attr('value', $(this).text());
    $(this).addClass('active');

    event.preventDefault();
  })



  $('.year-of-construction').on('click', function(event) {
    $('.year-of-construction').removeClass('active');
    $('input[name="year_of_construction"]').attr('value', $(this).text());
    $(this).addClass('active');

    event.preventDefault();
  })


  $('.build-by-btn').on('click', function(event) {
    $('.build-by-btn').removeClass('active');
    $('input[name="build_by"]').attr('value', $(this).text());
    $(this).addClass('active');

    event.preventDefault();
  })


});

$.fn.serializeObject = function() {
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
  $('form').each(function(i, form) {
    form.reset();
  });
});

$(document).on("NEXT_PAGE_BTN", function(e) {
  // Scroll to top
  if ('parentIFrame' in window) {
    // Send scroll event
    parentIFrame.sendMessage('scrollToIframe');
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

setTimeout(function() {
  if (typeof $netminers !== 'undefined') {
    // Perform initial tracking
    $netminers.push(['postPageView', 'beregner/tilskudsberegner/Step 1 - Forside tilskudsberegner']);
  }
  if (typeof ga !== 'undefined') {
    ga('send', 'pageview', 'beregner/tilskud_privat/Step 1 - Forside tilskudsberegner');
  }
}, 1500);
//Convert number (1000000) to e.g. 1.000.000
function addDots(num) {
  return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  //return parseFloat(num, 10).toFixed(2).replace(/\./g, ",").toString().replace(/(\d)(?=(\d{3})+\,)/g, "$1.").toString()
}

// Tooltip for form elements
function formHelp() {
  $('.form-help').each(function() {
    var $formHelp = $(this),
      $label = $formHelp.parent(),
      $text = $formHelp.data('help'),
      $input = $label.parent().find('input'),
      $labels = $('body').find('label, legend').not($label),
      $help = $('<div>', {
        class: 'form-help-text',
        html: $text
      });

    // Trigger form help and set position and width
    $formHelp.on('mouseenter click', function() {
      var $width = $(this).position().left + ($(this).width() * 2),
        $top = $(this).height() + 8;

      // Adjust width for active label
      if ($label.is('.is-active')) {
        $width += 10;
      }

      // Specifically for legend
      if ($label.is('legend')) {
        $top += 4;
        $width -= 16;
      }

      // If input is disabled
      // don't show form help
      if (!$label.is('.disabled')) {
        $label.append($help);
      }

      // Set classes and properties
      $labels.addClass('below');
      $help.css({
        'top': $top,
        'min-width': $width + 'px'
      });
      $formHelp.addClass('on');

      return false;
    }).on('mouseleave', function() {
      // Remove classes and properties
      $help.remove();
      $labels.removeClass('below');
      $formHelp.removeClass('on');
    });
  });
}

// Popover/popunder (terms, help and tooltip)
function popover() {
  $('.popover, .popunder').each(function() {
    var $pop = $(this),
      $popcon = $pop.find('[class*="-content"]'),
      $closex = $('<span class="close"/>').prependTo($popcon),
      $trigger = $pop.parent().find('[class*="-trigger"]'),
      $parent = $pop.parents().filter(function() {
        return $(this).css('position') == 'relative'
      }).eq(2);

    // There can be only one close X
    if (!$closex.is(':only-of-type')) {
      $closex.siblings('span').remove();
    }

    /*
    // Remove close X if not needed
    if ($pop.is('.no-x') || $trigger.is('.hover-in-out')) {
    	$closex.remove();
    }
    */

    // Handle close X click
    $closex.on('click touchstart', function() {
      $pop.removeClass('show').blur();
    });

    // Three ways to trigger pop box
    // Hover-in
    if ($trigger.is('[class*="hover-in"]')) {
      $trigger.on('mouseenter click', popBox);
      // Hover-in-out
      if ($trigger.is('[class*="-out"]')) {
        $trigger.on('mouseleave', function() {
          $pop.removeClass('show').blur();
        });
      }
    } else { // Click
      $trigger.on('click', popBox);
    }

    // Calculate and set position of the box
    function popBox() {
      var $popover = $(this).siblings('.popover'),
        $popunder = $(this).siblings('.popunder'),
        $parentLeft = $parent.position().left,
        $parentRight = $parent.width(),
        $triggerLeft = $trigger.position().left,
        $popoverWidth = $pop.outerWidth(),
        $triggerWidth = $trigger.outerWidth(),
        $widthDiff = ($popoverWidth - $triggerWidth) / 2,
        $popoverLeft = $triggerLeft - $widthDiff,
        $popoverRight = $popoverLeft + $popoverWidth,
        $popunderTop = $trigger.position().top + ($trigger.height() + 6);

      // Hide all other popover or popunder boxes
      $('.popover, .popunder').removeClass('show');

      // If left boundary exceeded
      if ($popoverLeft <= $parentLeft) {
        $popoverLeft = $parentLeft;
      }

      // If right boundary exceeded
      if ($popoverRight >= $parentRight) {
        $popoverLeft = $parentRight - $popoverWidth;
      }

      // Set popover position
      $popover.css({
        'left': $popoverLeft,
      }).addClass('show').focus();

      // Set popunder position
      $popunder.css({
        'top': $popunderTop,
        'left': $popoverLeft,
      }).addClass('show').focus();

      return false;
    }

    // Hide box when click anywhere but trigger
    $(document).on('click tap', function() {
      $pop.removeClass('show').blur();
    });
  }).on('click tap', function() {
    return false;
  });
}

// Handle image theme background
function imageTheme() {
  $('[class*="theme-image"][data-image]').each(function() {
    var $theme = $(this),
      $size = $theme.data('size'),
      $image = $theme.data('image'),
      $position = $theme.data('position'),
      $background = $('<div/>'),
      $class = $theme.is('[class*="-circle"]') ?
      'theme-image-circle-background' :
      'theme-image-background';

    // Set background css properties
    $background.css({
      'background-image': 'url(' + $image + ')',
      'background-position': $position,
      'background-size': $size
    }).addClass($class);

    // Insert background image
    $theme.prepend($background);

    // Make sure there is only one background
    if (!$background.is(':only-child')) {
      $background.siblings().remove();
    }
  });
}

// Wrap last word in arrow span
function linkArrow() {
  $('[class*="link-arrow"]')
    .not('.link-arrow-back')
    .each(function() {
      var $link = $(this).html().split(' ');

      // Wrap the last word + arrow in span
      $link = $link.slice(0, -1).join(' ') +
        ' <span class="arrow">' +
        $link.pop() + '</span>';

      // Insert span tag
      $(this).html($link);
    });
}

// Handle input fields
function orstedInput() {
  $('[data-init="orsted.input"]').each(function() {
    var $input = $(this),
      $label = $input.parent().find('label'),
      $group = $input.parents('.form-group'),
      $content = $group.find('.form-group-content'),
      $mandatory = $content.attr('class').match(/mandatory/) ? true : false;

    // Handle input focus/blur on label click
    $label.on('mousedown touchstart', function() {
      $label.data('focus', $input.is(':focus'));
    }).click(function() {
      $label.data('focus') ? $input.blur() : $input.focus();
    });

    // Handle active state
    $input.on('focus', function() {
      $label.activeLabel('animate');
    }).on('blur change focusout', function() {
      if ($input.val() || $group.is('.has-danger')) {
        $label.activeLabel();
      } else if (!$label.find('.form-help-text').length) {
        $label.activeLabel('off');
      }
    });

    // Handle disabled state
    if ($label.is('.disabled')) {
      $input.prop('disabled', true);
      $content.removeClass('mandatory');
      // Make sure the input value is empty
      setTimeout(function() {
        $input.val('');
        $label.activeLabel('off');
      }, 100);
    }

    // Init label state
    $input.trigger('blur');
  });
}

// Handle radiobuttons
function orstedRadio() {
  $('[data-init="orsted.radiobutton"]').each(function() {
    var $radio = $(this),
      $label = $radio.closest('label'),
      $text = $('<span>', {
        text: $label.text()
      });

    // Wrap the label text inside a span tag
    $label.append($text).html($label.children());

    // Make sure there's only on span
    if (!$text.is(':only-of-type')) {
      $text.siblings('span').remove();
    }

    // Custom handling of customer input
    // Exclusively for Tilskudsberegner
    $(this).change(function() {
      if ($(this).is('[name="customer"]')) {
        if (this.value == 'ja') {
          $('.iscustomer .customer-input').removeClass('zr-hide');
        } else {
          $('.iscustomer .customer-input').addClass('zr-hide');
        }
        $(this).closest('.input-wrap').find('.error').hide();
      }
    });
  });
}