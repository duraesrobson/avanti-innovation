define([
    'uiComponent',
    'Magento_Checkout/js/model/step-navigator',
    'ko'
], function (Component, stepNavigator, ko) {
    'use strict';

    return Component.extend({
        initialize: function () {
            this._super();

            this.isCartActive = ko.observable(false);
            this.isShippingActive = ko.observable(false);
            this.isPaymentActive = ko.observable(false);

            // cart (fora do checkout SPA)
            if (window.location.pathname.indexOf('/checkout/cart') !== -1) {
                this.isCartActive(true);
                return this;
            }

            // ko reativo
            ko.computed(function () {
                const index = stepNavigator.getActiveItemIndex();

                this.isCartActive(false);
                this.isShippingActive(false);
                this.isPaymentActive(false);

                if (index === 0) {
                    this.isShippingActive(true);
                }

                if (index === 1) {
                    this.isPaymentActive(true);
                }
            }, this);

            return this;
        },

        /* ========= AÇÕES DE CLICK ========= */

        goToCart: function () {
            window.location.href = '/checkout/cart';
        },

        // uso de isProcessed para evitar erro de fluxo
        goToShipping: function () {
            if (stepNavigator.isProcessed('shipping')) {
                stepNavigator.navigateTo('shipping');
            }
        },

        goToPayment: function () {
            if (stepNavigator.isProcessed('payment')) {
                stepNavigator.navigateTo('payment');
            }
        }
    });
});