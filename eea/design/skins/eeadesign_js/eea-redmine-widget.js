/* jslint:disable */
/*global jQuery window document setTimeout*/
var widget = "<div id='helpdesk_widget'></div>";
var captcha = "<div class='frc-captcha' data-sitekey='FCMR3DVP81RFD3ML'></div>";

// insert widget and captcha dom elements
jQuery('.content-core').append(widget);
jQuery('.content-core').append(captcha);

// load widget + captcha js
jQuery.when( jQuery.getScript( "https://taskman.devel4cph.eea.europa.eu/helpdesk_widget/widget.js"), jQuery.getScript("https://unpkg.com/friendly-challenge@0.5.1/widget.min.js")).done(function( data1, data2 ) {
    RedmineHelpdeskWidget.config({
        color: '#004B87',
        translation: {
          nameLabel: 'Enter First Name Last Name here',
          emailLabel: 'Please put your email here',
          descriptionLabel: 'What question do you have?',
          createButtonLabel: 'Ask question',
          createSuccessDescription: 'Thank you for your question!',
          createErrorLabel: 'Something goes wrong :(...',
          subjectLabel: 'Subject',
          createSuccessLabel: 'Your question successfully created'
        },
        identify: {
        //   nameValue: 'User',
        //   emailValue: 'test+1234@test.com',
        //   subjectValue: 'This is my question',
        //   trackerValue: 'Bug',
        //   projectValue: 'Support',
          customFieldValues: {
            // this is how you set keywords
            'Keywords': 'test',
            'MPS Year': 2020
          }
        },
        attachment: true,
        title: 'How can we help you?'
    });
    jQuery('#widget_button').click();

    jQuery(document).ready(function($) {
        var once = true;

        // reload widget on button click
        $("#widget_button").click(function(event) {
            event.preventDefault();
            RedmineHelpdeskWidget.reload = true;
            RedmineHelpdeskWidget.reload_form();
            $('#helpdesk_widget iframe').insertBefore('.frc-captcha');

            // reinitialize event listener
            once = true;
            if(document.addEventListener){
                $('#helpdesk_ticket_container')[0].contentWindow.document.addEventListener('keyup', formatForm, false);
            }
            else{
                //for IE8
                $('#helpdesk_ticket_container')[0].contentWindow.document.attachEvent('onkeyup', formatForm);
            }
        });
        $('#helpdesk_widget iframe').insertBefore('.frc-captcha');

        if(document.addEventListener){
            $('#helpdesk_ticket_container')[0].contentWindow.document.addEventListener('keyup', formatForm, false);
        }
        else{
            //for IE8
            $('#helpdesk_ticket_container')[0].contentWindow.document.attachEvent('onkeyup', formatForm);
        }
    
        function formatForm() {
            // remove onSubmit from form
            $('#helpdesk_ticket_container').contents().find('form').attr('onsubmit', '');
            
            $('#helpdesk_ticket_container').contents().find('form').on("input", function() {
                if (once) {
                    $(this).submit(function(event){
                        event.preventDefault();
    
                        var verified = verifyCaptcha();
                        if (verified) {
                            // continue with submit
                            var form = $(this);
                            var url = form.attr('action');
                            var data = $(this).serializeArray();

                            $.each(data, function (idx, item) {
                                if (item.name === 'username') {
                                    var splitted = item.value.split(" ");
                                    var firstname = splitted.slice(0, 1)[0] + " ";
                                    var secondname = splitted.slice(1, splitted.lenth).join('_');
                                    data[idx].value = firstname + secondname;
                                }
                            });                    
                            // When trying to use key/value list we get the following error
                            // "Type of Enquirier is not included in the list"
                            data.push({
                                name: 'issue[custom_field_values][77]',
                                value: 'patru'
                            }, {
                                name: 'issue[custom_field_values][71]',
                                value: 'tracasa-Habides -070202/2019/805189/SER/ENV.D.3'
                            });
                            
                            // refresh captcha on submit
                            var el = "<div class='frc-captcha' data-sitekey='FCMR3DVP81RFD3ML'></div>";
                            var currentCaptcha = $('.frc-captcha');
                            $(el).insertAfter(currentCaptcha);
                            $(currentCaptcha).remove();
                            new friendlyChallenge.WidgetInstance($('.frc-captcha')[0]);
                            
                            // create ticket
                            $.ajax({
                                   type: "POST",
                                   url: url,
                                   data: data, // serializes the form's elements
                                   success: function(data)
                                   {
                                       console.log(data);
                                   }
                            });
                        }
                        else {
                            // stop submit until captcha is verified
                            var message = "<div class='portalMessage error' i18n:translate=''>"
                                        + "Captcha is invalid</div>";
                            $(message).insertBefore("#helpdesk_ticket_container");
                            return false;
                        }
                    });
                }
                once = false;
            });
        }
    });
});

// API KEY A1RNAEPKC7VFTMCLNC2265OAIU7JQHEQ9KB9LQ6N6438BGK80HL50M86PJ
function verifyCaptcha() {
    var url = "https://friendlycaptcha.com/api/v1/siteverify";
    var sitekey = "FCMR3DVP81RFD3ML";
    var secret = "A1RNAEPKC7VFTMCLNC2265OAIU7JQHEQ9KB9LQ6N6438BGK80HL50M86PJ";
    var solution = jQuery('.frc-captcha-solution')[0].value;

    var captchaData = {
        'secret': secret,
        'solution': solution,
        'sitekey': sitekey
    }
    
    var result = jQuery.ajax({
        type: "POST",
        url: url,
        async: false,
        data: captchaData,
        success: function(data) {
            if (data.success === false) {
                // captcha failed
                console.log(data.errors);
                return false;
            }
            else {
                // captcha passed
                console.log(data)
                return true;
            }
        }
    });
    return result.responseJSON.success;
}