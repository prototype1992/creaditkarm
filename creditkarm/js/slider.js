var moneyMap = ['1.000 рублей', '2.000 рублей', '3.000 рублей', '4.000 рублей', '5.000 рублей', ' 6.000 рублей', ' 7.000 рублей', ' 8.000 рублей', ' 9.000 рублей', ' 10.000 рублей', ' 11.000 рублей', ' 12.000 рублей', ' 13.000 рублей', ' 14.000 рублей', ' 15.000 рублей', ' 16.000 рублей', ' 17.000 рублей', ' 18.000 рублей', ' 19.000 рублей', ' 20.000 рублей', ' 21.000 рублей', ' 22.000 рублей', ' 23.000 рублей', ' 24.000 рублей', ' 25.000 рублей', ' 26.000 рублей', ' 27.000 рублей', ' 28.000 рублей', ' 29.000 рублей', ' 30.000 рублей', ' 35.000 рублей', ' 40.000 рублей', ' 45.000 рублей', ' 50.000 рублей', ' 55.000 рублей', ' 60.000 рублей', ' 65.000 рублей', ' 70.000 рублей', ' 75.000 рублей', ' 80.000 рублей', ' 85.000 рублей', ' 90.000 рублей', ' 95.000 рублей', ' 100.000 рублей', ' 110.000 рублей', ' 120.000 рублей', ' 130.000 рублей', ' 140.000 рублей', ' 150.000 рублей', ' 160.000 рублей', ' 170.000 рублей', ' 180.000 рублей', ' 190.000 рублей', ' 200.000 рублей', ' 210.000 рублей', ' 220.000 рублей', ' 230.000 рублей', ' 240.000 рублей', ' 250.000 рублей', ' 260.000 рублей', ' 270.000 рублей', ' 280.000 рублей', ' 290.000 рублей', ' 300.000 рублей', '  325.000 рублей', ' 350.000 рублей', ' 375.000 рублей', ' 400.000 рублей', ' 425.000 рублей', ' 450.000 рублей', ' 475.000 рублей', ' 500.000 рублей', ' 525.000 рублей', ' 550.000 рублей', ' 575.000 рублей', ' 600.000 рублей', ' 625.000 рублей', ' 650.000 рублей', ' 675.000 рублей', ' 700.000 рублей', ' 725.000 рублей', ' 750.000 рублей', ' 775.000 рублей', ' 800.000 рублей', ' 1.000.000 рублей', ' 1.200.000 рублей', ' 1.500.000 рублей'];
var termMap = ['1 неделя', '2 недели', '3 недели', '4 недели', '1 месяц', '2 месяца', '3 месяца', '4 месяца', '5 месяцев', '6 месяцев', '7 месяцев', '8 месяцев', '9 месяцев', '10 месяцев', '11 месяцев', '1 год', '2 года', '3 года', '4 года', '5 лет', '6 лет', '7 лет', '8 лет', '9 лет', '10 лет'];

var moneyMapValues = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000, 240000, 250000, 260000, 270000, 280000, 290000, 300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000, 525000, 550000, 575000, 600000, 625000, 650000, 675000, 700000, 725000, 750000, 775000, 800000, 1000000, 1200000, 1500000, 1600000, 1800000, 2000000, 2200000, 2400000, 2600000, 2800000, 3000000];
var termMapValues = [7, 14, 21, 28, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365, 730, 1095, 1460, 1825, 2190, 2555, 2920, 3285, 3650];

/**
 * Получить числовые значения суммы и срока в днях
 *
 * @param name
 * @returns {number}
 */
var formatSliderValue = function (name) {
    var index = _.indexOf(name == 'amount' ? moneyMap : termMap, $('[name="'+ name +'"]').val());
    if (index == -1){
        index = 0;
    }
    if (name=="amount") {
        return moneyMapValues[index];
    } else if (name=="term") {
        return termMapValues[index];
    }
}

var replaceValue = function (obj, arr, index) {
    obj.val(arr[index]);
};

var fillTheBox = function (input, box) {
    var boxVal = $(input).val();
    $(box).html(boxVal);
};
var hintSlider = function(val){
    var sliderHead = $('.credit_notification, .color_switcher');
    // var moneyBox = $('#money_box');
    var percentRate = $('.percent_rate');
    var creditHint = $('#credit_hint, .g_credit_hint');
    var creditTitleWrap = $('#credit_title_wrap');
    var creditHintWrap = $('#credit_hint_wrap');

    creditTitleWrap.hide();
    creditHintWrap.show();
    // sliderHead.css({padding: '0', 'border-bottom': 'transparent'})

    // sliderHead Colors
    if ( val >=0 && val <=14 ){
        sliderHead.addClass('green');
        sliderHead.removeClass('yellow');
        sliderHead.removeClass('red');
        // moneyBox.css({color:'#81bc42'});
    }
    if ( val >=15 && val <= 33 ){
        sliderHead.addClass('yellow');
        sliderHead.removeClass('green');
        sliderHead.removeClass('red');
        // moneyBox.css({color:'#ffa72e'});
    }
    if ( val >33 ){
        sliderHead.addClass('red');
        sliderHead.removeClass('yellow');
        sliderHead.removeClass('green');
        // moneyBox.css({color:'#ce4947'});
    }


    //sliderHead Texts
    if ( val >=0 && val <=6 /*от 1 до 7000*/){
        percentRate.html('97%');
        creditHint.html(' Автоматическое одобрение');
    }
    if ( val >=7 && val <=14 /*от 8000 до 15000*/ ){
        percentRate.html('94%');
        creditHint.html(' Может понадобиться паспорт');
    }
    if ( val >=15 && val <=29 /*от 16000 до 30000*/ ){
        percentRate.html('84%');
        creditHint.html(' Нужен только паспорт ');

    }
    if ( val >=30 && val <=33 /*от 31000 до 50000*/ ){
        percentRate.html('72%');
        creditHint.html('  Может понадобиться подтверждение места работы  ');
    }
    if ( val >=34 && val <=43 /*от 51000 до 100000*/ ){
        percentRate.html('64%');
        creditHint.html('   Может понадобиться справка о доходах (или под залог)  ');
    }
    if ( val >=44 && val <=63 /*от 101000 до 300000*/ ){
        percentRate.html('51%');
        creditHint.html('   Необходима справка о доходах (или под залог) ');
    }
    if ( val >=64 && val <=84 /*от 301000 до 1000000*/ ){
        percentRate.html('37%');
        creditHint.html('   Нужна справка 2-ндфл  (или под залог) ');
    }
    // if ( val >=85 /*от 1001000 до 3000000*/ ){
    //     percentRate.html('99%');
    //     creditHint.html('   Требуется обеспечение кредита (залог)');
    // }
};

window.sliderNamespace = {
    replaceValueFunction: replaceValue,
    fillBoxFunction: fillTheBox,
    hintSliderFunction: hintSlider,
    moneyMap: moneyMap,
    termMap: termMap
};




$('document').ready(function () {
    var moneySlider = $('#money_slider');
    var moneyAmount = $('#money_amount');

    var termSlider = $('#term_slider');
    var termAmount = $('#term_amount');

    var filterSlider = $('#filter_slider');
    var filterAmount = $('#filter_amount');

    var filterTermSlider = $('#filter_term_slider');
    var filterTermAmount = $('#filter_term_amount');

    // var changeInput = function (sliderValue) {
    //     var credit = $('#credit_story');
    //     var payment = $('#select_payment');
    //     if ( sliderValue <= 33 ){
    //         credit.hide();
    //         payment.show();
    //     }else if( sliderValue >= 34 ) {
    //         credit.show();
    //         payment.hide();
    //     }
    // };

    var nextVal = function () {
        var curVal = moneySlider.slider("value");
        if (curVal >= moneyMap.length - 1) {
            return false
        } else {
            moneySlider.slider("value", ++curVal);
            moneyAmount.val(moneyMap[curVal]);
            // changeInput(moneyAmount.val());
            fillTheBox('#money_amount', '#money_box');
            // changeInput(curVal);
        }

    };
    var prevVal = function () {
        var curVal = moneySlider.slider("value");
        if (curVal <= 0) {
            return false
        } else {
            moneySlider.slider("value", --curVal);
            // console.log(curVal);
            moneyAmount.val(moneyMap[curVal]);
            fillTheBox('#money_amount', '#money_box');
            // changeInput(curVal);
        }
    };

    var nextTerm = function () {
        var curVal = termSlider.slider("value");
        if (curVal >= termMap.length - 1) {
            return false
        } else {
            termSlider.slider("value", ++curVal);
            termAmount.val(termMap[curVal]);
            fillTheBox('#term_amount', '#term_box');
        }
    };
    var prevTerm = function () {
        var curVal = termSlider.slider("value");
        if (curVal <= 0) {
            return false
        } else {
            termSlider.slider("value", --curVal);
            termAmount.val(termMap[curVal]);
            fillTheBox('#term_amount', '#term_box');
        }
    };


    ////////////////////////////////////////////////////////
    moneySlider.slider({
        range: "min",
        value: moneyMap.length - 1,
        min: 0,
        animate: true,
        max: moneyMap.length - 1,
        slide: function (event, ui) {
            replaceValue(moneyAmount, moneyMap, ui.value);
            fillTheBox('#money_amount', '#money_box');
            // changeInput(ui.value);
            hintSlider( ui.value);
        }
    });

    moneyAmount.val(moneyMap[moneyMap.length - 1]);
    fillTheBox('#money_amount', '#money_box');

    $('[data-change="money"]').on('click', function () {
        if ($(this).data('action') === 'plus') {
            nextVal();
        } else {
            prevVal();
        }
    });
    ////////////////////////////////////////////////////////
    termSlider.slider({
        range: "min",
        value: termMap.length - 1,
        min: 0,
        animate: true,
        max: termMap.length - 1,

        slide: function (event, ui) {
            replaceValue(termAmount, termMap, ui.value);
            fillTheBox('#term_amount', '#term_box');
        }
    });

    termAmount.val(termMap[termMap.length - 1]);
    fillTheBox('#term_amount', '#term_box');


    $('[data-change="term"]').on('click', function () {
        if ($(this).data('action') === 'plus') {
            nextTerm();
        } else {
            prevTerm();
        }
    });

    $("#advertiser-form").submit(function (e) {
        e.preventDefault();
        window.location.href = '/form?amount=' + formatSliderValue('amount') + '&term=' + formatSliderValue('term');
    });


    ////////////////////////////////////////////////////////

    if ($('.filter_amount').length && window.location.pathname.split('/')[1] != 'cards') {
        Filter.init_filters();

        filterSlider.slider({
            range: "min",
            value: Filter.init_values.amount[window.location.pathname.split('/')[1]], // default: 6 000 рублей
            min: Filter.filter_range.amount.index_min,
            max: Filter.filter_range.amount.index_max,
            animate: true,

            slide: function (event, ui) {
                replaceValue(filterAmount, moneyMap, ui.value);
                fillTheBox('#filter_amount', '#filter_box');
                // changeInput(ui.value);

                $('.filter_amount').val(moneyMapValues[ui.value]);
                Filter.check_item_for_filters();
            }
        });

        filterAmount.val(moneyMap[Filter.init_values.amount[window.location.pathname.split('/')[1]]]); // default: 6 000 рублей
        fillTheBox('#filter_amount', '#filter_box');
        $('.filter_amount').val(moneyMapValues[Filter.init_values.amount[window.location.pathname.split('/')[1]]]);

        filterTermSlider.slider({
            range: "min",
            animate: true,

            value: Filter.init_values.term[window.location.pathname.split('/')[1]], // default: 2 недели
            min: Filter.filter_range.period.index_min,
            max: Filter.filter_range.period.index_max,

            slide: function (event, ui) {
                replaceValue(filterTermAmount, termMap, ui.value);
                fillTheBox('#filter_term_amount', '#filter_term_box');
                // changeInput(ui.value);

                $('.filter_period').val(termMapValues[ui.value]);
                Filter.check_item_for_filters();
            }
        });

        filterTermAmount.val(termMap[Filter.init_values.term[window.location.pathname.split('/')[1]]]); // default: 2 недели
        fillTheBox('#filter_term_amount', '#filter_term_box');
        $('.filter_period').val(termMapValues[Filter.init_values.term[window.location.pathname.split('/')[1]]]);


        Filter.check_item_for_filters();
    } else {
        $('.credit_filter').remove();
    }
});