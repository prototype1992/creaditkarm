Filter = {
    filter_range: {
        amount: {
            min: 99999999999,
            max: 0,
            index_min: 0,
            index_max: 0
        },
        period: {
            min: 99999999999,
            max: 0,
            index_min: 0,
            index_max: 0
        }
    },
    init_values: {
        amount: {
            registration: 14,    //  15 000 руб
            zaimy: 14,    //  15 000 руб
            cards: 31,   // 40 000 руб
            credit: 48,   // 150 000 руб
            all: 14       // 15 000 руб
        },
        term: {
            registration: 1,    //  2 недели
            zaimy: 1,    //  2 недели
            cards: 1,   // 2 недели
            credit: 16,   // 2 года
            all: 1       // 2 недели
        }
    },

    check_filter: function (elm, selector) {
        value = parseFloat($('.filter_' + selector).val());

        if (!value) {
            return true;
        }

        if(selector == 'amount') {
            // this.recalculate_amount(elm);
        }

        var value_range = elm.find('.' + selector + '_range')
            .attr(selector + '_range').split('-');

        if (value >= parseFloat(value_range[0]) && value <= parseFloat(value_range[1])) {
            return true;
        } else {
            return false;
        }
    },

    recalculate_amount: function (elm) {
        var p = elm.find('.percentage').attr('percentage');
        var t = $('.filter_period').val();
        var a = parseInt($('.filter_amount').val());

        var total_to_return = Math.ceil(a + (a*(p/100)*t));
        total_to_return = total_to_return.toLocaleString().split(",").join(" ");
        elm.find('.processing_time span').text(total_to_return + ' Руб');
        elm.find('.amount-human').text(a.toLocaleString().split(",").join(" ") + ' Руб');
    },

    check_receive_methods_filter: function (elm, selector) {
        var found = false;

        if (!$('.filter.' + selector + ':checked').length)
            return true;

        var value_range = elm.find('.' + selector + '_range').attr(selector + '_range');

        $('.filter.' + selector + ':checked').each(function (i, ckb) {
            var val = $(ckb).val();

            if (value_range.indexOf(val) != -1) {
                found = true;
            }
        });

        return found;
    },

// get min and max values for filters
    set_filter_range: function (elm, selector) {
        var value_range = elm.find('.' + selector + '_range')
            .attr(selector + '_range').split('-');

        if (this.filter_range[selector].min > parseInt(value_range[0])) {
            this.filter_range[selector].min = parseInt(value_range[0]);
        }

        if (this.filter_range[selector].max < parseInt(value_range[1])) {
            this.filter_range[selector].max = parseInt(value_range[1]);
        }
    },

    check_item_for_filters: function () {
        $('.feeds_item:not(".feed_help")').each(function (i, elm) {
            elm = $(elm);

            if (!this.check_filter(elm, 'amount')
                || !this.check_filter(elm, 'period')
            //  || !this.check_receive_methods_filter(elm, 'receive_methods')
            ) {
                elm.hide();
            } else {
                elm.show();
            }
        }.bind(this))

        $('.data-offers-count').html($('.feeds_item:not(".feed_help"):visible').length);
    },

    init_filters: function () {
        $('.feeds_item:not(".feed_help")').each(function (i, elm) {
            elm = $(elm);

            this.set_filter_range(elm, 'amount');
            this.set_filter_range(elm, 'period');
        }.bind(this));

        this.filter_range.amount.index_min = moneyMapValues.indexOf(this.filter_range.amount.min);
        if (this.filter_range.amount.index_min == -1)
            this.filter_range.amount.index_min = 0;

        this.filter_range.amount.index_max = moneyMapValues.indexOf(this.filter_range.amount.max);
        if (this.filter_range.amount.index_max == -1)
            this.filter_range.amount.index_max = moneyMapValues.length - 1;


        this.filter_range.period.index_min = termMapValues.indexOf(this.filter_range.period.min);
        if (this.filter_range.period.index_min == -1)
            this.filter_range.period.index_min = 0;

        this.filter_range.period.index_max = termMapValues.indexOf(this.filter_range.period.max);
        if (this.filter_range.period.index_max == -1)
            this.filter_range.period.index_max = termMapValues.length - 1;

        $('.filter_amount').val(this.filter_range.amount.max);
        $('.filter_period').val(this.filter_range.period.max);
    }
};