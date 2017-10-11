$('document').ready(function () {

    $('.form_input_block').on({
        focus: function () {

            var hintText = $(this).data('hint');

            if( hintText !== "" ){
                var parent = $(this).parent('.form_block');
                var hintBlock = '<div class="form_input_hint">' + hintText + '</div>';
                parent.append(hintBlock);
            }

        },

        blur: function () {
            var parent = $(this).parent('.form_block');
            parent.find('.form_input_hint').addClass('slideOutDown').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
               parent.find('.form_input_hint').remove();
            })
        }

    });

    

});
