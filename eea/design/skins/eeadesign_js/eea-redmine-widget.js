/* jslint:disable */
/*global jQuery window document setTimeout*/
var widget = "<div id='helpdesk_widget'></div>";
var captcha = "<div class='frc-captcha' data-sitekey='FCMR3DVP81RFD3ML'></div>";

// insert widget and captcha dom elements
jQuery('.helpdesk-button').parent().append(widget);
jQuery('.helpdesk-button').parent().append(captcha);

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
            // 'Keywords': 'test',
            // 'MPS Year': 2020
          }
        },
        attachment: false
        // title: 'How can we help you?'
    });
    jQuery('#widget_button').click();

    jQuery(document).ready(function($) {
        var once = true;

        // reload widget on button click
        // $("#widget_button").click(function(event) {
        //     event.preventDefault();
        //      this is how you reload redmine widget
        //     RedmineHelpdeskWidget.reload = true;
        //     RedmineHelpdeskWidget.reload_form();
        //     $('#helpdesk_widget iframe').insertBefore('.frc-captcha');

        //     // reinitialize event listener
        //     once = true;
        //     if(document.addEventListener){
        //         $('#helpdesk_ticket_container')[0].contentWindow.document.addEventListener('keyup', formatForm, false);
        //     }
        //     else{
        //         //for IE8
        //         $('#helpdesk_ticket_container')[0].contentWindow.document.attachEvent('onkeyup', formatForm);
        //     }
        // });
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
                                    if (item.value === "") {
                                        data[idx].value = data[idx + 1].value;
                                    }
                                    else {
                                        var splitted = item.value.split(" ");
                                        var firstname = splitted.slice(0, 1)[0] + " ";
                                        var secondname = splitted.slice(1, splitted.lenth).join('_');
                                        data[idx].value = firstname + secondname;
                                    }
                                }
                            });                    
                            // When trying to use key/value list we get the following error
                            // "Type of Enquirier is not included in the list"
                            data.push({
                                name: 'issue[custom_field_values][71]',
                                value: 'tracasa-Habides -070202/2019/805189/SER/ENV.D.3'
                            });

                            // refresh captcha on submit
                            var el = "<div class='frc-captcha' data-sitekey='FCMR3DVP81RFD3ML'></div>";
                            var currentCaptcha = $('#helpdesk_ticket_container').contents().find('.frc-captcha');
                            $(el).insertAfter(currentCaptcha);
                            $(currentCaptcha).remove();
                            new friendlyChallenge.WidgetInstance($('#helpdesk_ticket_container').contents().find('.frc-captcha')[0], {startMode: 'none'});

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
                            // added form submit message
                            $('.widget-submit-message').remove();
                            $('.captcha-invalid-message').remove();
                            var message = "<div class='portalMessage info widget-submit-message' i18n:translate=''>"
                                        + "Question submitted</div>";
                            $(message).insertBefore("#helpdesk_ticket_container");
                        }
                        else {
                            // stop submit until captcha is verified
                            $('.widget-submit-message').remove();
                            $('.captcha-invalid-message').remove();
                            var message = "<div class='portalMessage error captcha-invalid-message' i18n:translate=''>"
                                        + "Captcha is invalid</div>";
                            $(message).insertBefore("#helpdesk_ticket_container");
                            return false;
                        }
                    });
                }
                once = false;
            });
        }
        $('#helpdesk_widget').hide();
        $('#helpdesk_ticket_container').hide();
        $('.frc-captcha').hide();

        $('.helpdesk-button').click(function(event){
            event.preventDefault();
            $('#helpdesk_ticket_container').show();
            $('.helpdesk-button').hide();
            $('.frc-captcha').show();

            // make necessary fields required
            $('#helpdesk_ticket_container').contents().find('input#email')[0].required = true;
            $('#helpdesk_ticket_container').contents().find('input#subject')[0].required = true;
            $('#helpdesk_ticket_container').contents().find('textarea#description')[0].required = true;

            $('#helpdesk_ticket_container').contents().find('.close-button').hide();

            var message = "<span class='discreet'><strong>Note</strong>:"
            + "Our expected response time is 15 working days. However, we are committed "
            + "to replying to your enquiries thoroughly and in the briefest time "
            + "possible. Note that the EEA working language is English and that"
            + "most of our information and content is in English. Nevertheless, you"
            + "may address us in one of the 24 EU official languages. Kindly note that"
            + "the time to process your enquiry might be slightly longer.</span>";

            var policy = $('#helpdesk_ticket_container').contents().find('#privacy_policy_fields')[0];
            $(message).insertAfter(policy);

            $('#helpdesk_ticket_container').contents().find('span.discreet').css('color', '#666');
            $('#helpdesk_ticket_container').contents().find('span.discreet').css('font-size', '85%');
            $('#helpdesk_ticket_container').contents().find('span.discreet').css('font-weight', 'normal');
            $('#helpdesk_ticket_container').contents().find('span.discreet').css('display', 'block');

            $('#helpdesk_ticket_container').contents().find('#submit_button').css('display', 'inline-block');
            $('#helpdesk_ticket_container').contents().find('#submit_button').css('float', 'right');

            // insert captcha in form + style
            var css = ".frc-captcha *{margin:0;padding:0;border:0;text-align:initial;border-radius:4px;filter:none!important;transition:none!important;font-weight:400;font-size:14px;line-height:1.35;text-decoration:none;background-color:initial;color:#222}.frc-captcha{position:relative;display:inline-block;width:280px;border:1px solid #ddd;padding-bottom:12px;background-color:#fff}.frc-container{display:flex;align-items:center;min-height:52px}.frc-icon{fill:#222;stroke:#222;flex-shrink:0;margin:8px 8px 0 8px}.frc-icon.frc-warning{fill:#c00}.frc-content{white-space:nowrap;display:flex;flex-direction:column;margin:4px 6px 0 0;overflow-x:auto;flex-grow:1}.frc-banner{position:absolute;bottom:0;right:6px}.frc-banner *{font-size:10px;opacity:.8}.frc-banner b{font-weight:700}.frc-progress{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:3px 0;height:4px;border:none;background-color:#eee;color:#222;width:100%;transition:all .5s linear}.frc-progress::-webkit-progress-bar{background:#eee}.frc-progress::-webkit-progress-value{background:#222}.frc-progress::-moz-progress-bar{background:#222}.frc-button{cursor:pointer;padding:2px 6px;background-color:#f1f1f1;border:1px solid transparent;text-align:center;font-weight:600}.frc-button:focus{border:1px solid #333}.frc-button:hover{background-color:#ddd}.dark.frc-captcha{color:#fff;background-color:#222}.dark.frc-captcha *{color:#fff}.dark .frc-icon{fill:#fff;stroke:#fff}.dark .frc-progress{background-color:#444}.dark .frc-progress::-webkit-progress-bar{background:#444}.dark .frc-progress::-webkit-progress-value{background:#ddd}.dark .frc-progress::-moz-progress-bar{background:#ddd}";
            $('.frc-captcha').insertAfter($('#helpdesk_ticket_container').contents().find('span.discreet'));

            const styleSheet = $('#helpdesk_ticket_container').contents()[0].createElement("style");
            styleSheet.type = "text/css";
            styleSheet.id = "frc-style";
            styleSheet.innerHTML = css;
            $('#helpdesk_ticket_container').contents()[0].head.appendChild(styleSheet);
        });
    });
});

// API KEY A1RNAEPKC7VFTMCLNC2265OAIU7JQHEQ9KB9LQ6N6438BGK80HL50M86PJ
function verifyCaptcha() {
    var url = "https://friendlycaptcha.com/api/v1/siteverify";
    var sitekey = "FCMR3DVP81RFD3ML";
    var secret = "A1RNAEPKC7VFTMCLNC2265OAIU7JQHEQ9KB9LQ6N6438BGK80HL50M86PJ";
    var solution = jQuery('#helpdesk_ticket_container').contents().find('.frc-captcha-solution')[0].value;

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