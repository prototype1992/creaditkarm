$('document').ready(function(){
    $('#place_equal, #place_inequal ').on('change', function(){
        if( $("#place_equal").is(":checked") ){
            $('#js_addition_place').find('input, select').attr('disabled', true);
        }else if ( $("#place_inequal").is(":checked") ){
            $('#js_addition_place').find('input, select').removeAttr('disabled');
        }
    });

    $('[name="consumer_registration_place_equal"]').on('change', function (e) {
        if ($(e.target).val() == 0) {
            $('#consumer_registration_place').find('input, select').removeAttr('disabled');
        } else {
            $('#consumer_registration_place').find('input, select').attr('disabled', true);
        }
    });

    $('#consumer_gage_property').on('change', function(){
        var propertyType =  $(this).find('option:checked').data('property-type');

        var propertyNone = $('#property_none');
        var propertyEstate = $('#property_estate');
        var propertyAuto = $('#property_auto');

        propertyNone.find('.form_block').removeClass('invalid');
        propertyEstate.find('.form_block').removeClass('invalid');
        propertyAuto.find('.form_block').removeClass('invalid');

        if ( propertyType == 'property_none' ){
            propertyNone.show();
            propertyEstate.hide();
            propertyAuto.hide();
            window.change_height();
        }
        else if ( propertyType == 'property_estate' ){
            propertyNone.hide();
            propertyEstate.show();
            propertyAuto.hide();
            window.change_height();
        }
        else if ( propertyType == 'property_auto' ){
            propertyNone.hide();
            propertyEstate.hide();
            propertyAuto.show();
            window.change_height();
        }
    });
});
