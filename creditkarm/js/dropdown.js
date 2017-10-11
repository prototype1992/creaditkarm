$('document').ready(function () {
    //Payment Choose

    var payContainer = $('#drop_list_block');
    var payList = $('#drop_list_wrap');
    var paySelect = $('#payment_select');
    var payBtn = $('#payment_btn');

    var toggleView = function () {
        if (payList.is(':visible')) {
            payContainer.removeClass('active');
        } else {
            payContainer.addClass('active');
        }
    };

    paySelect.on('click', function () {
        toggleView();
    });
    payBtn.on('click', function () {
        toggleView();
    });

    $(document).mouseup(function (e) {
        var container = payContainer;
        if (
            !container.is(e.target)
            && !payBtn.is(e.target)
            && container.has(e.target).length === 0
            && payBtn.has(e.target).length === 0
        ) {
            payContainer.removeClass('active');
        }
    });

    payList.find('input[type="checkbox"]').on('change', function(){
        var chLength = payList.find('input[type="checkbox"]:checked').length;
        var idArr = [];
        $('.drop_list_item').removeClass('active');
        if( chLength > 0  ){
            payList.find('input[type="checkbox"]:checked').each(function(){
                idArr.push($(this).attr('id'));
                //console.log(idArr);
                $(this).parents('.drop_list_item').addClass('active');
            });
            //console.log(idArr);
            paySelect.find('span[data-pay]').hide();
            $('.drop_hint').hide();
            $.each(idArr, function(index, value){
                //console.log( value );
                paySelect.find('span[data-pay=' + value + ']').show();
            })
        }else {
            paySelect.find('span[data-pay]').hide();
            $('.drop_hint').show();
        }
    });
});
