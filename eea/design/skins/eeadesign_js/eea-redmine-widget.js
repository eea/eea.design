/* jslint:disable */
/*global jQuery window document setTimeout*/
var widget = "<div id='helpdesk_widget'></div>";
var captcha = "<div class='frc-captcha' data-sitekey='FCMR3DVP81RFD3ML'></div>";

// insert widget and captcha dom elements
jQuery('.helpdesk-button').parent().append(widget);
jQuery('.helpdesk-button').parent().append(captcha);

// load widget + captcha js
jQuery.when( jQuery.getScript( "https://taskman.eionet.europa.eu/helpdesk_widget/widget.js")).done(function( data ) {
    RedmineHelpdeskWidget.config({
        color: '#004B87',
        translation: {
          nameLabel: 'Enter your name here (Optional)',
          emailLabel: 'Please put your email here',
          descriptionLabel: 'What question do you have?',
          createButtonLabel: 'Submit question',
          createSuccessDescription: 'Thank you for your question!',
          createErrorLabel: 'Something went wrong :(...',
          subjectLabel: 'Subject',
          createSuccessLabel: 'Your question was successfully created'
        },
        identify: {
        //   nameValue: 'User',
        //   emailValue: 'test+1234@test.com',
        //   subjectValue: 'This is my question',
        //   trackerValue: 'Bug',
        //   projectValue: 'Support',
          customFieldValues: {
            //  this is how you set keywords
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
        var offset_height = 0;
        // reload widget on button click
        // $("#widget_button").click(function(event) {
        //     event.preventDefault();
        //      this is how you reload redmine widget
        //     RedmineHelpdeskWidget.reload = true;
        //     RedmineHelpdeskWidget.reload_form();
        //     $('#helpdesk_widget iframe').insertBefore('.frc-captcha');
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
            $('#helpdesk_ticket_container').contents().find('form').on("input", function() {
                if (once) {
                    // remove onSubmit from form
                    $('#helpdesk_ticket_container').contents().find('form').attr('onsubmit', '');

                    $('#helpdesk_ticket_container').contents().find('input#username')[0].classList = ['form-control'];
                    $('#helpdesk_ticket_container').contents().find('input#username')[0].required = false;

                    $(this).submit(function(event){
                        event.preventDefault();

                        var verified = verifyCaptcha();
                        if (verified) {
                            // continue with submit
                            var form = $(this);
                            var url = form.attr('action');
                            var data = $(this).serializeArray();

                            // refresh captcha on submit
                            var el = "<div class='frc-captcha' data-sitekey='FCMR3DVP81RFD3ML'></div>";
                            var currentCaptcha = $('#helpdesk_ticket_container').contents().find('.frc-captcha');
                            $(el).insertAfter(currentCaptcha);
                            $(currentCaptcha).remove();
                            new friendlyChallenge.WidgetInstance($('#helpdesk_ticket_container').contents().find('.frc-captcha')[0], {startMode: 'none'});

                            // email validation
                            function emailIsValid (email) {
                                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                            }
                            var mail = $(form).find('input#email').val();
                            if (! emailIsValid(mail)) {
                                $("#helpdesk_ticket_container").contents().find('.widget-submit-message').remove();
                                $("#helpdesk_ticket_container").contents().find('.captcha-invalid-message').remove();
                                var message = "<div class='portalMessage error captcha-invalid-message' i18n:translate=''>"
                                            + "Email is invalid</div>";
                                $(message).insertAfter($("#helpdesk_ticket_container").contents().find('#submit_button'));

                                // change iframe height
                                var iframe_height = parseInt($("#helpdesk_ticket_container").css('min-height'));
                                iframe_height -= offset_height;

                                offset_height = $("#helpdesk_ticket_container").contents().find('.captcha-invalid-message')[0].offsetHeight;
                                iframe_height += offset_height;
                                $("#helpdesk_ticket_container").css('min-height', iframe_height.toString() + 'px');

                                return false;
                            }

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
                            $("#helpdesk_ticket_container").contents().find('.widget-submit-message').remove();
                            $("#helpdesk_ticket_container").contents().find('.captcha-invalid-message').remove();
                            var message = "<div class='portalMessage info widget-submit-message' i18n:translate=''>"
                                        + "Your question has been submitted. You will shortly receive an acknowledgement of receipt to your provided email.</div>";
                            $(message).insertAfter($("#helpdesk_ticket_container").contents().find('#submit_button'));

                            // change iframe height
                            var iframe_height = parseInt($("#helpdesk_ticket_container").css('min-height'));
                            iframe_height -= offset_height;

                            offset_height = $("#helpdesk_ticket_container").contents().find('.widget-submit-message')[0].offsetHeight;
                            iframe_height += offset_height;
                            $("#helpdesk_ticket_container").css('min-height', iframe_height.toString() + 'px');

                        }
                        else {
                            // stop submit until captcha is verified
                            $("#helpdesk_ticket_container").contents().find('.widget-submit-message').remove();
                            $("#helpdesk_ticket_container").contents().find('.captcha-invalid-message').remove();
                            var message = "<div class='portalMessage error captcha-invalid-message' i18n:translate=''>"
                                        + "Captcha is invalid</div>";
                            $(message).insertAfter($("#helpdesk_ticket_container").contents().find('#submit_button'));

                            // change iframe height
                            var iframe_height = parseInt($("#helpdesk_ticket_container").css('min-height'));
                            iframe_height -= offset_height;

                            offset_height = $("#helpdesk_ticket_container").contents().find('.captcha-invalid-message')[0].offsetHeight;
                            iframe_height += offset_height;
                            $("#helpdesk_ticket_container").css('min-height', iframe_height.toString() + 'px');

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
            $('#helpdesk_ticket_container').css('min-height', '900px');
            $('#helpdesk_ticket_container').show();
            $('.helpdesk-button').hide();
            $('.frc-captcha').show();

            // make necessary fields required
            $('#helpdesk_ticket_container').contents().find('input#email')[0].required = true;
            $('#helpdesk_ticket_container').contents().find('input#subject')[0].required = true;
            $('#helpdesk_ticket_container').contents().find('textarea#description')[0].required = true;

            // dont add span near the privacy policy checkbox
            var inputs = $('#helpdesk_ticket_container').contents().find('form input[required]').toArray();
            inputs.pop();
            $(inputs).after('<span class="asterisk"></span>');
            $('#helpdesk_ticket_container').contents().find('form textarea[required]').after('<span class="asterisk"></span>');

            $('#helpdesk_ticket_container').contents().find('.close-button').hide();

            var message = "<span class='discreet note'><strong>Note</strong>: "
            + "Our online form is currently displayed in English since the EEA working "
            + "language is English and that most of our information and content is in "
            + "English. You may nevertheless address us in one of the 24 EU official "
            + "languages but kindly note that the time to process your enquiry might "
            + "be slightly longer. Our expected response time is 15 working days.</span>";

            var flash = $('#helpdesk_ticket_container').contents().find('#flash')[0];
            $(message).insertBefore(flash);

            var policy = $('#helpdesk_ticket_container').contents().find('#privacy_policy_fields')[0];
            message = "<p><span class='discreet'>* mandatory fields</span></p>";
            $(message).insertBefore(policy);

            $('#helpdesk_ticket_container').contents().find('span.discreet').css('color', '#666');
            $('#helpdesk_ticket_container').contents().find('span.discreet').css('font-size', '85%');
            $('#helpdesk_ticket_container').contents().find('span.discreet').css('font-weight', 'normal');
            $('#helpdesk_ticket_container').contents().find('span.discreet').css('display', 'block');

            // insert captcha in form + style
            // taken from https://github.com/gzuidhof/friendly-challenge/blob/master/src/styles.css
            var css = ".frc-captcha *{margin:0;padding:0;border:0;text-align:initial;border-radius:4px;filter:none!important;transition:none!important;font-weight:400;font-size:14px;line-height:1.35;text-decoration:none;background-color:initial;color:#222}.frc-captcha{position:relative;display:inline-block;width:280px;border:1px solid #ddd;padding-bottom:12px;background-color:#fff}.frc-container{display:flex;align-items:center;min-height:52px}.frc-icon{fill:#222;stroke:#222;flex-shrink:0;margin:8px 8px 0 8px}.frc-icon.frc-warning{fill:#c00}.frc-content{white-space:nowrap;display:flex;flex-direction:column;margin:4px 6px 0 0;overflow-x:auto;flex-grow:1}.frc-banner{position:absolute;bottom:0;right:6px}.frc-banner *{font-size:10px;opacity:.8}.frc-banner b{font-weight:700}.frc-progress{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:3px 0;height:4px;border:none;background-color:#eee;color:#222;width:100%;transition:all .5s linear}.frc-progress::-webkit-progress-bar{background:#eee}.frc-progress::-webkit-progress-value{background:#222}.frc-progress::-moz-progress-bar{background:#222}.frc-button{cursor:pointer;padding:2px 6px;background-color:#f1f1f1;border:1px solid transparent;text-align:center;font-weight:600}.frc-button:focus{border:1px solid #333}.frc-button:hover{background-color:#ddd}.dark.frc-captcha{color:#fff;background-color:#222}.dark.frc-captcha *{color:#fff}.dark .frc-icon{fill:#fff;stroke:#fff}.dark .frc-progress{background-color:#444}.dark .frc-progress::-webkit-progress-bar{background:#444}.dark .frc-progress::-webkit-progress-value{background:#ddd}.dark .frc-progress::-moz-progress-bar{background:#ddd}";
            $('.frc-captcha').insertAfter(policy);

            var styleSheet = $('#helpdesk_ticket_container').contents()[0].createElement("style");
            styleSheet.type = "text/css";
            styleSheet.id = "frc-style";
            styleSheet.innerHTML = css;
            $('#helpdesk_ticket_container').contents()[0].head.appendChild(styleSheet);

            // add additional styles for form inputs
            css = "span.asterisk{vertical-align:super}span.asterisk:after{content:'*';display:inline;vertical-align:top}#widget_form .custom_fields input,#widget_form .custom_fields select,#widget_form .custom_fields textarea,#widget_form .form-control{width:90%!important;display:inline-block}.custom_field label{display:block}#submit_button{padding:10px 50px 0 10px}.discreet.note{margin-bottom:2em}.portalMessage{color:#333;font-size:120%;margin:1em 0;padding:1em 1.5em 1em 4.5em;vertical-align:middle;border:none;background-color:#f3f3f3}.portalMessage.error{color:red}#submit_button{display:inline-block}@media (max-width:400px){.portalMessage{padding:1em}}";
            styleSheet = $('#helpdesk_ticket_container').contents()[0].createElement("style");
            styleSheet.type = "text/css";
            styleSheet.id = "form-style";
            styleSheet.innerHTML = css;
            $('#helpdesk_ticket_container').contents()[0].head.appendChild(styleSheet);

            // Type of Enquirier custom field
            var enquiry_field = '<p class="custom_field" data-error-key="Type of Enquiry" data-require="false">'
                              + '<label for="issue_custom_field_values_83">'
                              + '<span>Select what best describes your field of work</span></label>'
                              + '<select name="issue[custom_field_values][83]" id="issue_custom_field_values_83" class="user_cf">'
                              + '</select></p>'
            var enquiry_values = ['', 'Research and scientific representatives', 'Students', 'Citizens', 'Media representatives, publishing houses and portals',
                                  'Industry and private sector representatives', 'Civil society representatives (NGOs and interest groups)',
                                  'Governmental representatives National politicians, diplomats','Representatives of EU bodies and agencies',
                                  'Representatives of inter-governmental organisations'];

            $(enquiry_field).insertAfter($('#helpdesk_ticket_container').contents().find('#tracker_id'))
            $.each(enquiry_values, function (idx, item) {
                var option = '<option value="' + item + '">' + item + '</option>';
                $('#helpdesk_ticket_container').contents().find('#issue_custom_field_values_83').append(option);
            });

            // Enquiry Topics custom field
            enquiry_field = '<p class="custom_field" data-error-key="Enquiry Topics" data-require="false">'
                          + '<label for="issue_custom_field_values_82">'
                          + '<span>Select what best describes the topic of your question</span></label>'
                          + '<select name="issue[custom_field_values][82]" id="issue_custom_field_values_82" class="user_cf">'
                          + '</select></p>'
            enquiry_values = ['', 'Agriculture', 'Air', 'Biodiversity and ecosystems', 'Chemicals',
                              'Climate change adaptation', 'Climate change mitigation', 'Energy', 'Forests', 'Environment and health',
                              'Industry', 'Land use and soil', 'Water and marine environment', 'Noise',
                              'Sustainable production and consumption', 'Transport', 'Urban environment',
                              'Resource efficiency and waste', 'EMAS', 'Copernicus']

            $(enquiry_field).insertAfter($('#helpdesk_ticket_container').contents().find('#tracker_id'))
            $.each(enquiry_values, function (idx, item) {
                var option = '<option value="' + item + '">' + item + '</option>';
                $('#helpdesk_ticket_container').contents().find('#issue_custom_field_values_82').append(option);
            });

            if(document.addEventListener) {
                $('#helpdesk_ticket_container')[0].contentWindow.document.addEventListener('keyup', formatForm, false);
            }
            else {
                //for IE8
                $('#helpdesk_ticket_container')[0].contentWindow.document.attachEvent('onkeyup', formatForm);
            }
        });
    });
});


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
