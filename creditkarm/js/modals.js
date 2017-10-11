$('document').ready(function () {

    function addEvent(obj, evt, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(evt, fn, false);
        }
        else if (obj.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        }
    }

    $(window).scroll( function(){
        // показываем попап для подписку на рассылку, после того, как человек проскролил 9% страницы 
        if($(window).scrollTop() / $(document).height() > 0.09) {
            if (!$.cookie('exit_popup_closed')) {
                $('#exitPopup').fadeIn(300, function () {
                    try {
                        yaCounter41781994.reachGoal('subscription_popup_show');
                    } catch (e) {
                        console.log(e);
                    }
                })
            }                   
        }
    } );

    $('#exitPopupClose').on('click', function() {
	    $.cookie('exit_popup_closed', true, {expires: 3, path: '/'});
        try {
            yaCounter41781994.reachGoal('subscription_popup_close');
        } catch (e) {
            console.log(e);
        }
        $('#exitPopup').fadeOut(300)
    });

    $('.exit_popup_step_1').on('submit', function(e) {
        e.preventDefault();

        $('#exitPopupToStep2').prop('disabled', true);
        
        $.ajax({
            url: '/api/v1/user/popup/registration',
            type: 'post',
            dataType: 'json',
            data: {
                data: {'email': $('#exitPopup .exit_popup_input').val()}
            },
            success: function(data) {
                // высталяем куку, чтобы не показывать попап пользователю в следующий раз
	            $.cookie('exit_popup_closed', true, {expires: 365*5, path: '/'});
                  
                // вызываем достижение цели для метрики
                try {
                    yaCounter41781994.reachGoal('subscribed_from_popup');
                } catch (e) {
                    console.log(e);
                }

                $('.exit_popup_step_2').fadeIn(100);
                setTimeout(function(){
                    $('#exitPopup').fadeOut(200);
                }, 5000);
            },
            error: function(data) {
                $('#exitPopupToStep2').prop('disabled', false);
                $('#exitPopup .exit_popup_input').addClass('error').effect("highlight", {color: "#FFD6D6"}, 300);
            }
        })
    });

    $('#exitPopup .exit_popup_input').keypress(function() {
        $(this).removeClass('error');
    });

   // var urlRegStr = window.location.pathname;

   // function callMainModal() {
   //     // Не показываем модальку на странице подтверждения регистрации /registration/* и отписки /unsubscribe/*
   //     if ( (urlRegStr.indexOf("registration") < 0) && (urlRegStr.indexOf("unsubscribe") < 0)) {
   //         $('#modal_window_main').addClass('active');
   //         $('body').css({
   //             'overflow': 'hidden'
   //         });
   //     }
   // }

   // //calling of Modal in 1 minute

   // setTimeout(callMainModal, 60000)

   // var mouse = {x: 0, y: 0};

   // function cursorPosition(e) {
   //     mouse.x = e.clientX || e.pageX;
   //     mouse.y = e.clientY || e.pageY
   //     //console.log(mouse.x);
   //     //console.log(mouse.y);

   //     if (mouse.y <= 15) {
   //         callMainModal();
   //     }
   // }

   // document.addEventListener('mousemove', cursorPosition, false);


   // $('.toggleModal').on('click', function () {
   //     $(this).parents('.modal_fader').removeClass('active');
   //     $('body').css({
   //         'overflow': 'scroll'
   //     })
   //     document.removeEventListener('mousemove', cursorPosition);
   // });


   // $('#main_modal_popup_btn').click(function(e){
   //     console.log("Main popup click");
   //     e.preventDefault();
   //     yaCounter30184049.reachGoal("MAIN_POPUP_BTN_CLICK");
   //     window.location.href = $(this).attr('href');
   // });

   // $('#seo_modal_popup_btn').click(function (e) {
   //     console.log("Seo popup click");
   //     e.preventDefault();
   //     yaCounter30184049.reachGoal("KEYWORD_POPUP_BTN_CLICK");
   //     window.location.href = $(this).attr('href');
   // });
});
