/**
 * Created by Vitalik on 26.04.2015.
 */

(function (window) {

    'use strict';

    var moneyMapValues = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000, 240000, 250000, 260000, 270000, 280000, 290000, 300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000, 525000, 550000, 575000, 600000, 625000, 650000, 675000, 700000, 725000, 750000, 775000, 800000, 1000000, 1200000, 1400000, 1600000, 1800000, 2000000, 2200000, 2400000, 2600000, 2800000, 3000000];
    var termMapValues = [7, 14, 21, 28, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365, 730, 1095, 1460, 1825, 2190, 2555, 2920, 3285, 3650];
    var moneyMap = window.sliderNamespace.moneyMap;
    var termMap = window.sliderNamespace.termMap;

    /**
     * Настройка плагина валидации
     */
    $.validator.setDefaults({
        highlight: function (element) {
            $(element).parents('.form_block').addClass("invalid");
        },
        unhighlight: function (element) {
            $(element).parents('.form_block').removeClass("invalid");
        },
        errorPlacement: function (error, element) {
        }
    });

    $.validator.addMethod("regx", function (value, element, regexpr) {
        return this.optional(element) || regexpr.test(value);
    });

    /**
     * Paydayru Form Object
     * @type {{lid: number, urls: {lead_post: string, syncCashalotUrl: string}, data: {userid: Number, subaccount: (*|jQuery), client_ip: string, template: (string|string), product: string, form_page: string, referer: (string|*), amount: *, term: *, agree_with_term: Number}, steps: {step_1: {id: string, rules: {amount: {required: boolean}, term: {required: boolean}, first_name: {required: boolean}, last_name: {required: boolean}, father_name: {required: boolean}, email: {required: boolean}, phone: {required: boolean}, sex: {required: boolean}, birth_date: {required: boolean}, city: {required: boolean}, agree_with_terms: {required: boolean}}}, step_2: {id: string}, step_3: {id: string, rules: {pas_s: {required: boolean}, pas_n: {required: boolean}, pas_p: {required: boolean}, pas_d: {required: boolean}, pas_c: {required: boolean}, birth_place: {required: boolean}, region_r: {required: boolean}, city_r: {required: boolean}, street: {required: boolean}, house: {required: boolean}, radioDependencies: {}, add_region_r: {required: boolean}, add_city_r: {required: boolean}, add_street: {required: boolean}, add_house: {required: boolean}}}, step_4: {id: string, rules: {employee: {required: boolean}, salary: {}, stage: {required: boolean}, company_name: {required: boolean}, w_phone: {required: boolean}, w_region: {}, w_city: {required: boolean}, w_street: {required: boolean}, w_house_col: {required: boolean}, add_pers: {required: boolean}, add_pers_phone: {required: boolean}, add_pers_who: {required: boolean}, d_type: {required: boolean}, n_doc: {required: boolean}}}, step_5: {id: string}}, initialize: form.initialize, init_step_1: form.setup_step_1_handler, init_step_3: form.setup_step_3_micro_credit_handler, init_step_4: form.setup_step_4_micro_credit_handler, checkAmountAndTermLimits: form.checkAmountAndTermLimits, initSliderValues: form.setupSliderValues, runFindLoanSlider: form.runFindLoanSlider, restoreFormDataFromCookie: form.restoreFormDataFromCookie, disableNextStepButton: form.disableNextStepButton, enableNextStepButton: form.enableNextStepButton, sendData: form.sendDataToCloudDBFor, syncLeadWithCashalot: form.syncLeadWithCashalot, setSliderValue: form.setSliderValue}}
     */
    var MobilePaydayForm = {

        STEP_ONE: 1,
        STEP_TWO: 2,
        STEP_THREE: 3,
        STEP_FOUR: 4,

        /**
         * Credit Form Strategies
         **/
        CONSUMER_STRATEGY: 'consumer',
        MICRO_CREDIT_STRATEGY: 'micro',

        /**
         * Form flow strategy
         **/
        strategy: 'micro',

        /**
         * Lead ID in cloud service
         */
        lid: 0,

        /**
         *
         */
        currentStep: 0,

        /**
         *
         */
        postMessagesConfig: {
            targetOrigin: ['http://cashalot.su']
        },

        /**
         * Services URI's
         */
        urls: {
            lead_post: 'https://api.cloudleadia.com/api/v1/leadia/payday-sendlead',
            syncCashalotUrl: 'https://creditkarm.ru/api/v1/user/registration'
        },

        /**
         * Form Model
         *
         */
        data: {
            userid: parseInt(window.paydayru.userid),
            subaccount: $('<div>').html(window.paydayru.subaccount).text(),
            client_ip: window.paydayru.client_ip,
            template: window.paydayru.template,
            product: window.paydayru.product,
            form_page: window.paydayru.form_page,
            referer: window.paydayru.referer,
            amount: window.paydayru.amount == '' ? 10000 : parseInt(window.paydayru.amount),
            term: window.paydayru.term == '' ? 30 : parseInt(window.paydayru.term),
            agree_with_terms: parseInt(window.paydayru.ag),
            host: window.paydayru.host
        },

        /**
         * Шаги формы, правила валидации, id'ки формы
         */
        steps: {
            step_1: {
                id: '#step_1',
                rules: {
                    amount: {
                        required: true
                    },
                    term: {
                        required: true
                    },
                    first_name: {
                        required: true,
                        regx: /^[А-Яа-яЁё]{3,}$/,
                        maxlength: 32
                    },
                    last_name: {
                        required: true,
                        regx: /^[А-Яа-яЁё]{3,}$/,
                        maxlength: 32
                    },
                    father_name: {
                        required: true,
                        regx: /^[А-Яа-яЁё]{3,}$/,
                        maxlength: 32
                    },
                    email: {
                        required: true
                    },
                    phone: {
                        required: true
                    },
                    birth_date_year: {
                        required: true
                    },
                    birth_date_month: {
                        required: true
                    },
                    birth_date_day: {
                        required: true
                    },
                    city: {
                        required: true,
                        maxlength: 255
                    },
                    credit_history: {
                        required: true
                    },
                    agree_with_terms: {
                        required: true
                    }
                }
            },
            // step_2: {
            //     id: '#step_2'
            // },
            step_3_micro: {
                id: '#step_3_micro',
                rules: {
                    pas_s: {
                        required: true
                    },
                    pas_n: {
                        required: true
                    },
                    pas_p: {
                        required: true
                    },
                    pas_d_day: {
                        required: true
                    },
                    pas_d_month: {
                        required: true
                    },
                    pas_d_year: {
                        required: true
                    },
                    pas_c: {
                        required: true
                    },
                    birth_place: {
                        required: true,
                        regx: /^[0-9А-Яа-яЁё,\. -_\\]{3,}$/,
                        maxlength: 255
                    },
                    region_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\\]{3,}$/,
                        maxlength: 255
                    },
                    city_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\\]{3,}$/,
                        maxlength: 255
                    },
                    street: {
                        required: true,
                        regx: /^[0-9А-Яа-яЁё,\. -_\\]{3,}$/,
                        maxlength: 255
                    },
                    house: {
                        required: true,
                        regx: /^[0-9А-Яа-яЁё,\. -_\\]{1,}$/,
                        maxlength: 255
                    },
                    radioDependencies: {},
                    add_region_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    add_city_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    add_street: {
                        required: true,
                        regx: /^[0-9А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    add_house: {
                        required: true,
                        regx: /^[0-9А-Яа-яЁё,\. -_\/\\]{1,}$/,
                        maxlength: 255
                    }
                }
            },
            step_4_micro: {
                id: '#step_4_micro',
                rules: {
                    employee: {
                        required: true
                    },
                    salary: {
                        required: true
                    },
                    stage: {
                        required: true
                    },
                    company_name: {
                        required: true,
                        maxlength: 255
                    },
                    w_phone: {
                        required: true
                    },
                    w_region: {
                        required: true
                    },
                    w_city: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    w_street: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    w_house_col: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{1,}$/,
                        maxlength: 255
                    },
                    add_pers: {
                        required: false,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    add_pers_phone: {
                        required: false
                    },
                    add_pers_who: {
                        required: false,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    d_type: {
                        required: true
                    },
                    n_doc: {
                        required: true,
                        maxlength: 255
                    }
                }
            },
            step_3_consumer: {
                id: '#step_3_consumer',
                rules: {
                    consumer_pas_s: {
                        required: true
                    },
                    consumer_pas_n: {
                        required: true
                    },
                    consumer_pas_p: {
                        required: true
                    },
                    consumer_pas_d_day: {
                        required: true
                    },
                    consumer_pas_d_month: {
                        required: true
                    },
                    consumer_pas_d_year: {
                        required: true
                    },
                    consumer_pas_c: {
                        required: true
                    },
                    consumer_birth_place: {
                        required: true
                    },
                    consumer_region_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_city_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_street_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_house_r: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{1,}$/,
                        maxlength: 25
                    },
                    consumer_reg_type: {
                        required: true
                    },
                    radioDependencies: {},
                    consumer_add_region: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_add_city: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_add_street: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_add_house: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{1,}$/,
                        maxlength: 25
                    }
                }
            },
            step_4_consumer: {
                id: '#step_4_consumer',
                rules: {
                    consumer_employee: {
                        required: true
                    },
                    consumer_salary: {
                        required: true
                    },
                    consumer_stage: {
                        required: true
                    },
                    consumer_company_name: {
                        required: true,
                        maxlength: 255
                    },
                    consumer_w_phone: {
                        required: true
                    },
                    w_region: {
                        //required: true
                    },
                    w_city: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_w_street: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_w_house_col: {
                        required: true,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{1,}$/,
                        maxlength: 25
                    },
                    consumer_add_pers: {
                        required: false,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{2,}$/,
                        maxlength: 255
                    },
                    consumer_add_pers_phone: {
                        required: false
                    },
                    consumer_add_pers_who: {
                        required: false,
                        regx: /^[А-Яа-яЁё,\. -_\/\\]{3,}$/,
                        maxlength: 255
                    },
                    consumer_d_type: {
                        required: true
                    },
                    consumer_n_doc: {
                        required: true
                    },
                    consumer_registration_type: {
                        required: true
                    },
                    consumer_income_confirmation: {
                        required: true
                    },
                    consumer_gage_property: {
                        required: true
                    },
                    consumer_gage_realty_type: {
                        required: true
                    },
                    consumer_gage_realty_cost: {
                        required: true
                    },
                    consumer_gage_realty_region: {
                        required: true
                    },
                    consumer_gage_realty_city: {
                        required: true
                    },
                    consumer_gage_auto_brand: {
                        required: true
                    },
                    consumer_gage_auto_model: {
                        required: true
                    },
                    consumer_gage_auto_year: {
                        required: true
                    },
                    consumer_gage_auto_owners_quant: {
                        required: true
                    },
                    consumer_gage_auto_region: {
                        required: true
                    },
                    consumer_gage_auto_has_casco: {
                        required: true
                    },
                    consumer_gage_auto_not_gaged: {
                        required: true
                    }
                }
            },
            step_5: {
                id: '#step_5'
            }
        },

        configHost: function () {
            if (typeof this.data.host != "undefined" && this.data.host.trim().length) {
                this.urls.syncCashalotUrl = this.data.host + "/api/v1/user/registration"
            }
        },

        initialize: function () {
            this.configHost();
            this.checkAmountAndTermLimits();
            this.hasFormDataInACookie() && this.restoreFormDataFromCookie();

            this.setupSliderValues();
            this.setupInputElementsAndPlugins();
            this.preventDefaultSubmitForms();

            this.setup_step_1_handler();
            this.setup_step_3_micro_credit_handler();
            this.setup_step_4_micro_credit_handler();
            this.setup_step_3_consumer_credit_handler();
            this.setup_step_4_consumer_credit_handler();

            this.listenMoneyAmountSliderAndChooseFormStrategy();

            // this.sendPostMessage('iframe:connected', {});
        },

        /**
         * Form strategy depends on credit money amount
         *
         **/
        listenMoneyAmountSliderAndChooseFormStrategy: function () {
            var $this = this;
            $("#money_slider").on("slidechange", function (event, ui) {
                $this.selectFormFlowStrategy(ui.value);
            });
        },

        /**
         **/
        selectFormFlowStrategy: function (value) {
            this.strategy = value > 33 ? this.CONSUMER_STRATEGY : this.MICRO_CREDIT_STRATEGY;
        },


        /**
         * Обработка первого шага формы
         *
         **/
        setup_step_1_handler: function () {
            var $this = this;
            $($this.steps.step_1.id).validate({
                ignore: "input:hidden, select:hidden",
                rules: $this.steps.step_1.rules,
                submitHandler: function (form) {
                    $this.export_step_1_to_data().disableNextStepButton('#to_step_2').sendDataToCloudDBFor($this.STEP_ONE)
                        .then(function () {
                            try {
                                $this.syncLeadWithCashalot(_.extend($this.data, {external_lead_id: $this.lid}));
                            } catch (e) {
                                console.log(e);
                            }
                        })./*then(function () {
                     $this.buildPartnerLinks(_.extend($this.data, {external_lead_id: $this.lid}));
                     }).*/then(function () {
                        $('[data-step="1"]').hide();
                        $('[data-step="3"][data-step-strategy="' + $this.strategy + '"]').animate({
                            opacity: "toggle"
                        }, 0, "swing", function () {
                            $('html, body').scrollTop(0);
                            // window.change_height();
                        });
                    }).then(function () {
                        // $this.runFindLoanSlider();
                    })
                        .always(function () {
                            $this.enableNextStepButton('#to_step_2');
                        });
                }
            });
        },

        /**
         * Обработка третьего шага формы
         *
         **/
        setup_step_3_micro_credit_handler: function () {
            var $this = this;
            $($this.steps.step_3_micro.id).validate({
                rules: $this.steps.step_3_micro.rules,
                submitHandler: function (form) {
                    $this.export_micro_step_3_to_data()
                        .disableNextStepButton('#to_step_4')
                        .sendDataToCloudDBFor($this.STEP_TWO)
                        .then(function () {
                            $('[data-step="3"][data-step-strategy="micro"]').hide();
                            $('[data-step="4"][data-step-strategy="micro"]').show();
                            $('html, body').scrollTop(0);
                            // window.change_height();
                        }).always(function () {
                        $this.enableNextStepButton('#to_step_4');
                    });
                }
            });
        },

        /**
         * Обработка четвертого шага формы
         *
         **/
        setup_step_4_micro_credit_handler: function () {
            var $this = this;
            $($this.steps.step_4_micro.id).validate({
                rules: $this.steps.step_4_micro.rules,
                submitHandler: function (form) {
                    $this.export_micro_step_4_to_data()
                        .disableNextStepButton('#to_step_5')
                        .sendDataToCloudDBFor($this.STEP_THREE)
                        .then(function () {
                            // $this.sendPostMessage('complete:lead:was:send', {
                            //     external_lead_id: $this.lid
                            // });
                        }).then(function () {
                        $('[data-step="4"][data-step-strategy="micro"]').hide();
                        $('[data-step="5"]').show();
                        $('html, body').scrollTop(0);
                        // window.change_height();
                    }).always(function () {
                        $this.enableNextStepButton('#to_step_5');
                    });
                }
            });
        },

        /**
         * Обработка третьего шага формы
         *
         **/
        setup_step_3_consumer_credit_handler: function () {
            var $this = this;
            $($this.steps.step_3_consumer.id).validate({
                rules: $this.steps.step_3_consumer.rules,
                submitHandler: function (form) {
                    $this.export_consumer_step_3_to_data()
                        .disableNextStepButton('#consumer_to_step_4')
                        .sendDataToCloudDBFor($this.STEP_TWO)
                        .then(function () {
                            $('[data-step="3"][data-step-strategy="consumer"]').hide();
                            $('[data-step="4"][data-step-strategy="consumer"]').show();
                            $('html, body').scrollTop(0);
                            // window.change_height();
                        }).always(function () {
                        $this.enableNextStepButton('#consumer_to_step_4');
                    });
                }
            });
        },

        /**
         * Обработка четвертого шага формы
         *
         **/
        setup_step_4_consumer_credit_handler: function () {
            var $this = this;
            $($this.steps.step_4_consumer.id).validate({
                rules: $this.steps.step_4_consumer.rules,
                submitHandler: function (form) {
                    $this.export_consumer_step_4_to_data()
                        .disableNextStepButton('#consumer_to_step_5')
                        .sendDataToCloudDBFor($this.STEP_THREE)
                        .then(function () {
                            // $this.sendPostMessage('complete:lead:was:send', {
                            //     external_lead_id: $this.lid
                            // });
                        }).then(function () {
                        $('[data-step="4"][data-step-strategy="consumer"]').hide();
                        $('[data-step="5"]').show();
                        $('html, body').scrollTop(0);
                        // window.change_height();
                    }).always(function () {
                        $this.enableNextStepButton('#consumer_to_step_5');
                    });
                }
            });
        },

        /**
         *
         * @returns {number}
         */
        moneyAmount: function () {
            var amount_value_index = _.indexOf(moneyMap, $('[name="amount"]').val());
            if (amount_value_index == -1) {
                amount_value_index = 0;
            }
            return moneyMapValues[amount_value_index];
        },

        /**
         *
         * @returns {number}
         */
        term: function () {
            var term_value_index = _.indexOf(termMap, $('[name="term"]').val());

            if (term_value_index == -1) {
                term_value_index = 0;
            }
            return termMapValues[term_value_index];
        },

        /**
         *
         */
        paymentMethods: function () {
            var payment_methods = _.map($('input[type="checkbox"][data-value]:checked'),
                function (checkbox) {
                    return $(checkbox).data('value');
                });

            if (payment_methods.length == 0) {
                payment_methods = ['Способ не важен'];
            }

            return payment_methods;
        },

        /**
         *
         */
        export_step_1_to_data: function () {
            this.data.amount = this.moneyAmount();
            this.data.term = this.term();
            this.data.first_name = $('[name="first_name"]').val();
            this.data.last_name = $('[name="last_name"]').val();
            this.data.father_name = $('[name="father_name"]').val();
            this.data.email = $('[name="email"]').val();
            this.data.phone = $('[name="phone"]').val();
            this.data.sex = $('[name="sex"]').val();
            this.data.birth_date = $('[name="birth_date_year"]').val() + '-' + $('[name="birth_date_month"]').val() + '-' + $('[name="birth_date_day"]').val();
            this.data.city = $('[name="city"]').val();
            this.data.payment_methods = this.paymentMethods().join(', ');
            this.data.credit_history = $('[name="credit_history"]').val();
            this.data.agree_with_terms = $('[name="agree_with_terms"]').is(':checked') ? 1 : 0;

            return this;
        },

        /**
         *
         */
        export_micro_step_3_to_data: function () {
            this.data.pas_s = $('[name="pas_s"]').val();
            this.data.pas_n = $('[name="pas_n"]').val();
            this.data.pas_p = $('[name="pas_p"]').val();
            this.data.pas_d = $('[name="pas_d_year"]').val() + '-' + $('[name="pas_d_month"]').val() + '-' + $('[name="pas_d_day"]').val();
            this.data.pas_c = $('[name="pas_c"]').val();
            this.data.birth_place = $('[name="birth_place"]').val();
            this.data.region_r = $('[name="region_r"]').val();
            this.data.city_r = $('[name="city_r"]').val();
            this.data.street = $('[name="street"]').val();
            this.data.house = $('[name="house"]').val();
            this.data.registration_place_equal = $('[name="registration_place_equal"]:checked').val();
            this.data.add_region_r = $('[name="add_region_r"]').val();
            this.data.add_city_r = $('[name="add_city_r"]').val();
            this.data.add_street = $('[name="add_street"]').val();
            this.data.add_house = $('[name="add_house"]').val();

            return this;
        },

        /**
         *
         */
        export_micro_step_4_to_data: function () {
            this.data.employee = $('[name="employee"]').val();
            this.data.salary = $('[name="salary"]').val();
            this.data.stage = $('[name="stage"]').val();
            this.data.company_name = $('[name="company_name"]').val();
            this.data.w_phone = $('[name="w_phone"]').val();
            this.data.w_region = $('[name="w_region"]').val();
            this.data.w_city = $('[name="w_city"]').val();
            this.data.w_street = $('[name="w_street"]').val();
            this.data.w_house_col = $('[name="w_house_col"]').val();
            this.data.add_pers = $('[name="add_pers"]').val();
            this.data.add_pers_phone = $('[name="add_pers_phone"]').val();
            this.data.add_pers_who = $('[name="add_pers_who"]').val();
            this.data.d_type = $('[name="d_type"]').val();
            this.data.n_doc = $('[name="n_doc"]').val();

            return this;
        },

        export_consumer_step_3_to_data: function () {
            this.data.pas_s = $('[name="consumer_pas_s"]').val();
            this.data.pas_n = $('[name="consumer_pas_n"]').val();
            this.data.pas_p = $('[name="consumer_pas_p"]').val();
            this.data.pas_d = $('[name="consumer_pas_d_year"]').val() + '-' + $('[name="consumer_pas_d_month"]').val() + '-' + $('[name="consumer_pas_d_day"]').val();
            this.data.pas_c = $('[name="consumer_pas_c"]').val();
            this.data.birth_place = $('[name="consumer_birth_place"]').val();
            this.data.region_r = $('[name="consumer_region_r"]').val();
            this.data.city_r = $('[name="consumer_city_r"]').val();
            this.data.street = $('[name="consumer_street_r"]').val();
            this.data.house = $('[name="consumer_house_r"]').val();
            this.data.registration_place_equal = $('[name="consumer_registration_place_equal"]:checked').val();
            this.data.add_region_r = $('[name="consumer_add_region"]').val();
            this.data.add_city_r = $('[name="consumer_add_city"]').val();
            this.data.add_street = $('[name="consumer_add_street"]').val();
            this.data.add_house = $('[name="consumer_add_house"]').val();
            this.data.registration_type = $('[name="consumer_reg_type"]').val();
            // this.data.has_rf_registration = $('[name="consumer_has_rf_registration"]').val();

            return this;
        },

        export_consumer_step_4_to_data: function () {
            this.data.employee = $('[name="consumer_employee"]').val();
            this.data.salary = $('[name="consumer_salary"]').val();
            this.data.stage = $('[name="consumer_stage"]').val();
            this.data.company_name = $('[name="consumer_company_name"]').val();
            this.data.w_phone = $('[name="consumer_w_phone"]').val();
            this.data.w_street = $('[name="consumer_w_street"]').val();
            this.data.w_house_col = $('[name="consumer_w_house_col"]').val();
            this.data.add_pers = $('[name="consumer_add_pers"]').val();
            this.data.add_pers_phone = $('[name="consumer_add_pers_phone"]').val();
            this.data.add_pers_who = $('[name="consumer_add_pers_who"]').val();
            this.data.d_type = $('[name="consumer_d_type"]').val();
            this.data.n_doc = $('[name="consumer_n_doc"]').val();
            this.data.income_confirmation = $('[name="consumer_income_confirmation"]').val();
            this.data.gage_property = $('[name="consumer_gage_property"]').val();
            this.data.gage_realty_type = $('[name="consumer_gage_realty_type"]').val();
            this.data.gage_realty_cost = $('[name="consumer_gage_realty_cost"]').val();
            this.data.gage_realty_region = $('[name="consumer_gage_realty_region"]').val();
            this.data.gage_realty_city = $('[name="consumer_gage_realty_city"]').val();
            this.data.gage_auto_brand = $('[name="consumer_gage_auto_brand"]').val();
            this.data.gage_auto_model = $('[name="consumer_gage_auto_model"]').val();
            this.data.gage_auto_year = $('[name="consumer_gage_auto_year"]').val();
            this.data.gage_auto_owners_quant = $('[name="consumer_gage_auto_owners_quant"]').val();
            this.data.gage_auto_region = $('[name="consumer_gage_auto_region"]').val();
            this.data.gage_auto_has_casco = $('[name="consumer_gage_auto_has_casco"]:checked').val();
            this.data.gage_auto_not_gaged = $('[name="consumer_gage_auto_not_gaged"]:checked').val();
            this.data.w_region = this.data.region_r;
            this.data.w_city = this.data.city_r;

            return this;
        },

        /**
         *
         */
        checkAmountAndTermLimits: function () {
            if (this.data.amount > 3000000) this.data.amount = 3000000;
            if (this.data.amount < 1000) this.data.amount = 1000;
            if (this.data.term < 7 || this.data.term > 3650) this.data.term = 3650;
        },

        /**
         *
         */
        setupSliderValues: function () {
            if (this.data.amount) {
                var newValue = this.setSliderValue(this.data.amount, moneyMap, moneyMapValues, '#money_slider', '#money_amount', '#money_box');
                this.selectFormFlowStrategy(newValue);
                window.sliderNamespace.hintSliderFunction(newValue);
                // this.initCreditAndPaymentInput();
            }
            if (this.data.term) {
                this.setSliderValue(this.data.term, termMap, termMapValues, "#term_slider", '#term_amount', '#term_box');
            }
        },

        // initCreditAndPaymentInput: function () {
        //     var credit = $('#credit_story');
        //     var payment = $('#select_payment');
        //     if ( this.strategy == this.MICRO_CREDIT_STRATEGY ){
        //         credit.hide();
        //         payment.show();
        //     }else {
        //         credit.show();
        //         payment.hide();
        //     }
        // },

        /**
         *
         */
        setupInputElementsAndPlugins: function () {
            if (this.data.agree_with_terms == 1) {
                $('[name="agree_with_terms"]').attr('checked', true);
            }
            // this.setupGeoCompletes();
            this.setupInputsMasks();
            this.setupRegistrationAddressEqualsPlacementAddressToggle();
            this.setupEmployerInputToggle();
        },

        /**
         *
         */
        setupGeoCompletes: function () {
            $('[name="city"]').geocomplete()
                .bind("geocode:result");
        },

        /**
         *
         */
        setupEmployerInputToggle: function () {
            $('[name="employee"]').on('change', function () {
                var employType = $(this).val();
                var employ_depended_inputs = [
                    $('[name="salary"]'), $('[name="stage"]'), $('[name="company_name"]'),
                    $('[name="w_phone"]'), $('[name="w_region"]'), $('[name="w_city"]'),
                    $('[name="w_street"]'), $('[name="w_house_col"]')
                ];
                if (employType == 'Учусь' || employType == 'Пенсионер' || employType == 'Не трудоустроен') {
                    $.each(employ_depended_inputs, function (ind, input) {
                        input.attr('disabled', true);
                        input.parents('.form_block').removeClass('invalid');
                    });
                } else {
                    $.each(employ_depended_inputs, function (ind, input) {
                        input.removeAttr('disabled');
                    });
                }
            });

            $('[name="consumer_employee"]').on('change', function () {
                var employType = $(this).val();
                var employ_depended_inputs = [
                    $('[name="consumer_salary"]'),
                    $('[name="consumer_stage"]'),
                    $('[name="consumer_income_confirmation"]'),
                    $('[name="consumer_company_name"]'),
                    $('[name="consumer_w_phone"]'),
                    $('[name="consumer_w_street"]'),
                    $('[name="consumer_w_house_col"]')
                ];
                if (employType == 'Учусь' || employType == 'Пенсионер' || employType == 'Не трудоустроен') {
                    $.each(employ_depended_inputs, function (ind, input) {
                        input.attr('disabled', true);
                        input.parents('.form_block').removeClass('invalid');
                    });
                } else {
                    $.each(employ_depended_inputs, function (ind, input) {
                        input.removeAttr('disabled');
                    });
                }
            });
        },

        /**
         *
         */
        setupRegistrationAddressEqualsPlacementAddressToggle: function () {
            $('[name="registration_place_equal"]').change(function () {
                if ($(this).val() == 1) {
                    $('[name="add_region_r"]').parent().removeClass("invalid");
                    $('[name="add_city_r"]').parent().removeClass("invalid");
                    $('[name="add_street"]').parent().removeClass("invalid");
                    $('[name="add_house"]').parent().removeClass("invalid");
                }
            });
            $('[name="consumer_registration_place_equal"]').on('change', function (e) {
                if ($(e.target).val() == 1) {
                    $('[name="consumer_add_region_r"]').parent().removeClass("invalid");
                    $('[name="consumer_add_city"]').parent().removeClass("invalid");
                    $('[name="consumer_add_street"]').parent().removeClass("invalid");
                    $('[name="consumer_add_house"]').parent().removeClass("invalid");
                }
            });
        },

        /**
         *
         */
        setupInputsMasks: function () {

            var phoneInputMask = {
                clearIfNotMatch: true,
                translation: {
                    '0': {pattern: /\d/},
                    '9': ''
                }
            };

            $('[name="phone"]').mask("+7 (900) 0000-000", phoneInputMask);
            $('[name="w_phone"], [name="consumer_w_phone"]').mask("+7 (000) 0000-000", phoneInputMask);
            $('[name="add_pers_phone"], [name="consumer_add_pers_phone"]').mask("+7 (000) 0000-000", phoneInputMask);

            $('[name="pas_s"], [name="consumer_pas_s"]').mask("0000", {clearIfNotMatch: true});
            $('[name="pas_n"], [name="consumer_pas_n"]').mask('000000', {clearIfNotMatch: true});
            $('[name="pas_c"], [name="consumer_pas_c"]').mask('000-000', {clearIfNotMatch: true});
        },

        /**
         *
         */
        preventDefaultSubmitForms: function () {
            var forms = [this.steps.step_1.id, this.steps.step_3_micro.id, this.steps.step_4_micro.id, this.steps.step_3_consumer.id, this.steps.step_4_consumer.id];
            $(forms).submit(function (e) {
                e.preventDefault();
            });
        },

        /**
         *
         */
        runFindLoanSlider: function () {
            var vm = this;
            $('.dial').each(function () {
                var $this = $(this);
                var myVal = $this.attr("rel");
                $this.knob({
                    "fgColor": "#01a7e5",
                    "bgColor": "#eaedf4"
                });

                $({value: 0}).animate({
                    value: myVal
                }, {
                    duration: 0, // switch off step_2
                    easing: 'swing',
                    step: function () {
                        $this.val(Math.ceil(this.value)).trigger('change');
                    },
                    complete: function () {
                        $('[data-step="2"]').animate({
                            opacity: "toggle"
                        }, 0, "swing", function () {
                            $('[data-step="3"][data-step-strategy="' + vm.strategy + '"]').animate({
                                opacity: "toggle"
                            }, 0, "swing", function () {
                                window.change_height();
                            });
                        });
                    }
                })
            });
        },

        /**
         *
         * @param syncLead
         */
        // buildPartnerLinks: function (syncLead) {
        //     var $this = this;
        //     try {
        //         // изменяем utm_medium=EXTERNAL_ID для партнера oneclickmoney
        //         var listLink = [
        //             {
        //                 id: "#partner_oneclick",
        //                 url: "http://partner539.oneclickmoney.ru/?utm_source=leadia&utm_medium=" + syncLead.external_lead_id + "&utm_term=" + $this.data.userid
        //             },
        //             // {
        //             //     id: "#partner_mili",
        //             //     url: "https://mili.ru/?utm_source=Leadia&amp;utm_medium=cpa&amp;utm_campaign=Leadia&amp;utm_term=" + syncLead.external_lead_id
        //             // },
        //             // {
        //             //     id: "#partner_4slovo",
        //             //     url: "https://n.4slovo.ru/?aprt159=ba12e107101fddcf3cd0c78cf2853bae&utm_source=leadia.ru&utm_campaign=" + syncLead.external_lead_id
        //             // },
        //             // {
        //             //     id: "#partner_moneyman",
        //             //     url: "https://moneyman.ru?partner=leadiaru&utm_source=leadia.ru&utm_term=" + syncLead.external_lead_id
        //             // },
        //             // {
        //             //     id: "#partner_kredito24",
        //             //     // url: "http://www.kredito24.ru/?kt_aff=" + syncLead.external_lead_id + "&utm_campaign=42172&utm_content=" + syncLead.external_lead_id + "&utm_term=" + $this.data.userid +  "&utm_medium=AFFILIATES&utm_source=LEADIA&amc=aff.kreditech.42172.49484.24355&smc=" + syncLead.external_lead_id,
        //             //     url: "http://www.kredito24.ru/?kt_aff=" + $this.data.userid + "&utm_campaign=42172&utm_content=" + $this.data.userid + "&utm_term=[admedia_id]&utm_medium=AFFILIATES&utm_source=LEADIA&amc=aff.kreditech.42172.49484.24355&smc="+ $this.data.userid +"&smc1=" + syncLead.external_lead_id
        //             // },
        //             // {
        //             //     id: "#partner_ekapusta",
        //             //     url: "https://ekapusta.ru/?utm_source=leadia&utm_medium=lead&utm_campaign=" + $this.data.userid + "&click_id=" + syncLead.external_lead_id
        //             // },
        //             {
        //                 id: "#shop_front",
        //                 url: "http://creditkarm.ru/registration/" + syncLead.external_lead_id
        //             },
        //             {
        //                 id: "#partner_zaymer",
        //                 url: "https://www.zaymer.ru/?utm_source=leadia&utm_medium=cpa&utm_campaign=home&wmid=" + $this.data.userid + "&transaction_id=" + syncLead.external_lead_id
        //             }
        //         ];
        //         for (var oneLink in listLink) {
        //             if ($(listLink[oneLink].id).size() > 0){
        //                 $(listLink[oneLink].id).attr('href', listLink[oneLink].url);
        //                 // $(listLink[oneLink].id).on('click', function(e){
        //                 //     try {
        //                 //         yaCounter41781994.reachGoal($(e.target).attr('yandex-goal'));
        //                 //     } catch (e) {
        //                 //         console.log(e);
        //                 //     }
        //                 // });
        //             }
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     }
        // },

        /**
         *
         * @returns {boolean}
         */
        hasFormDataInACookie: function () {
            return Cookies.get('lid') != undefined && Cookies.get('step') != undefined;
        },

        /**
         *
         */
        restoreFormDataFromCookie: function () {
            var cookie_data = JSON.parse(Cookies.get('step'));
            this.lid = Cookies.get('lid');
            this.data = cookie_data.data;

            if (cookie_data.step > 0) {
                this.fill_step_1_input_elements();
            }

            if (cookie_data.step > 1) {
                if (this.strategy == this.MICRO_CREDIT_STRATEGY) {
                    this.fill_micro_step_3_input_elements();
                } else {
                    this.fill_consumer_step_3_input_elements();
                }
            }
        },

        /**
         *
         */
        fill_step_1_input_elements: function () {
            this.setupSliderValues();

            $('[name="first_name"]').val(this.data.first_name);
            $('[name="last_name"]').val(this.data.last_name);
            $('[name="father_name"]').val(this.data.father_name);
            $('[name="email"]').val(this.data.email);
            $('[name="phone"]').val(this.data.phone);
            $('[name="sex"]').val(this.data.sex);

            var birth_date = this.data.birth_date.split('-');
            $('select[name="birth_date_day"] option, select[name="birth_date_month"] option, select[name="birth_date_year"] option').removeAttr('selected');
            $('select[name="birth_date_day"] option[value="' + birth_date[2] + '"]').attr('selected', true);
            $('select[name="birth_date_month"] option[value="' + birth_date[1] + '"]').attr('selected', true);
            $('select[name="birth_date_year"] option[value="' + birth_date[0] + '"]').attr('selected', true);

            $('[name="city"]').val(this.data.city);

            if (this.data.credit_history && this.data.credit_history.length > 0) {
                $('select[name="credit_history"] option').removeAttr('selected');
                $('select[name="credit_history"] option[value="' + this.data.credit_history + '"]').attr('selected', true);
            }

            $('[name="agree_with_terms"]').attr('checked', true);
        },

        /**
         *
         */
        fill_micro_step_3_input_elements: function () {
            $('[name="pas_s"]').val(this.data.pas_s);
            $('[name="pas_n"]').val(this.data.pas_n);
            $('[name="pas_p"]').val(this.data.pas_p);

            var pas_d = this.data.pas_d.split('-');
            $('select[name="pas_d_day"] option, select[name="pas_d_month"] option, select[name="pas_d_year"] option').removeAttr('selected');
            $('select[name="pas_d_day"] option[value="' + pas_d[2] + '"]').attr('selected', true);
            $('select[name="pas_d_month"] option[value="' + pas_d[1] + '"]').attr('selected', true);
            $('select[name="pas_d_year"] option[value="' + pas_d[0] + '"]').attr('selected', true);

            $('[name="pas_c"]').val(this.data.pas_c);
            $('[name="birth_place"]').val(this.data.birth_place);
            $('[name="region_r"]').val(this.data.region_r);
            $('[name="city_r"]').val(this.data.city_r);
            $('[name="street"]').val(this.data.street);
            $('[name="house"]').val(this.data.house);
            $('[name="add_region_r"]').val(this.data.add_region_r);
            $('[name="add_city_r"]').val(this.data.add_city_r);
            $('[name="add_street"]').val(this.data.add_street);
            $('[name="add_house"]').val(this.data.add_house);

            $('input[value="' + this.data.registration_place_equal + '"][name="registration_place_equal"]').attr('checked', true);
            if (this.data.registration_place_equal == 0) {
                $('#js_addition_place').find('input, select').removeAttr('disabled');
            }
        },


        fill_consumer_step_3_input_elements: function () {
            $('[name="consumer_pas_s"]').val(this.data.pas_s);
            $('[name="consumer_pas_n"]').val(this.data.pas_n);
            $('[name="consumer_pas_p"]').val(this.data.pas_p);
            $('[name="consumer_pas_c"]').val(this.data.pas_c);
            $('[name="consumer_birth_place"]').val(this.data.birth_place);
            $('[name="consumer_region_r"]').val(this.data.region_r);
            $('[name="consumer_city_r"]').val(this.data.city_r);
            $('[name="consumer_street_r"]').val(this.data.street);
            $('[name="consumer_house_r"]').val(this.data.house);
            $('[name="consumer_add_region"]').val(this.data.add_region_r);
            $('[name="consumer_add_city"]').val(this.data.add_city_r);
            $('[name="consumer_add_street"]').val(this.data.add_street);
            $('[name="consumer_add_house"]').val(this.data.add_house);

            var pas_d = this.data.pas_d.split('-');
            $('select[name="consumer_pas_d_day"] option, select[name="consumer_pas_d_month"] option, select[name="consumer_pas_d_year"] option').removeAttr('selected');
            $('select[name="consumer_pas_d_day"] option[value="' + pas_d[2] + '"]').attr('selected', true);
            $('select[name="consumer_pas_d_month"] option[value="' + pas_d[1] + '"]').attr('selected', true);
            $('select[name="consumer_pas_d_year"] option[value="' + pas_d[0] + '"]').attr('selected', true);

            if (this.data.registration_type && this.data.registration_type.length > 0) {
                $('select[name="consumer_reg_type"] option').removeAttr('selected');
                $('select[name="consumer_reg_type"] option[value="' + this.data.registration_type + '"]').attr('selected', true);
            }

            $('input[name="consumer_registration_place_equal"][value="' + this.data.registration_place_equal + '"]').attr('checked', true);
            if (this.data.registration_place_equal == 0) {
                $('#consumer_registration_place').find('input, select').removeAttr('disabled');
            }
        },

        /**
         *
         * @param id
         */
        disableNextStepButton: function (id) {
            $(id).attr('disabled', 'disabled');
            return this;
        },

        /**
         *
         * @param id
         */
        enableNextStepButton: function (id) {
            $(id).removeAttr('disabled');
        },

        /**
         *
         * @param step
         * @returns {*}
         */
        sendDataToCloudDBFor: function (step) {
            var request_data = {
                step: step,
                data: JSON.stringify(this.data)
            };

            if (this.lid != undefined) request_data.lid = this.lid;
            this.currentStep = step;

            var $this = this;
            var $defer = $.post($this.urls.lead_post, request_data).done(
                function (data) {
                    $this.lid = data.id;
                    $this.storeLeadIdInACookie()
                        .storeCurrentStepAndFormDataInACookie()
                        .removeCookieIfAllStepsWasCompleted();
                }).fail(function () {
                alert('На сервере произошла ошибка, повторите попытку');
            });

            if ($this.currentStep == 3) {
                try {
                    fbq('track', 'Lead');
                } catch (e) {
                    console.log(e);
                }
            }
            try {
                yaCounter41781994.reachGoal('step' + $this.currentStep);
            } catch (e) {
                console.log(e);
            }

            return $defer;
        },

        /**
         *
         * @returns this
         */
        storeLeadIdInACookie: function () {
            if (Cookies.get('lid') == undefined) {
                var date = new Date();
                date.setTime(date.getTime() + 15 * 60 * 1000);
                Cookies.set('lid', this.lid, {expires: date});
            }
            return this;
        },

        /**
         *
         * @returns this
         */
        storeCurrentStepAndFormDataInACookie: function () {
            var date = new Date();
            date.setTime(date.getTime() + 15 * 60 * 1000);

            Cookies.set('step', JSON.stringify({
                step: this.currentStep,
                data: this.data
            }, {expires: date}));
            return this;
        },

        /**
         *
         * @returns this
         */
        removeCookieIfAllStepsWasCompleted: function () {
            if (this.currentStep == 3) {
                Cookies.remove('lid');
                Cookies.remove('step');
            }
            return this;
        },

        /**
         *
         * @param value
         * @param map
         * @param valuesMap
         * @param slider
         * @param input
         * @param box
         */
        setSliderValue: function (value, map, valuesMap, slider, input, box) {
            var index = _.indexOf(valuesMap, value);

            if (index == -1) {
                index = moneyMapValues.length - 1;
            }

            window.sliderNamespace.replaceValueFunction($(input), map, index);
            window.sliderNamespace.fillBoxFunction(input, box);

            $(slider).slider("value", index);

            return index;
        },

        /**
         *
         * @param lead
         * @returns {*}
         */
        syncLeadWithCashalot: function (lead) {
            var $this = this;
            return $.post($this.urls.syncCashalotUrl, {
                data: lead
            });
        },

        /**
         *
         * @param eventName
         * @param data
         */
        sendPostMessage: function (eventName, data) {
            var event = {
                eventName: eventName,
                data: data
            };

            parent.postMessage(
                JSON.stringify(event), this.postMessagesConfig.targetOrigin
            );
        }
    };

    /**
     * Инициализация формы
     */
    $(document).ready(function () {
        MobilePaydayForm.initialize();
        window.pd = MobilePaydayForm;
    });
})(window);