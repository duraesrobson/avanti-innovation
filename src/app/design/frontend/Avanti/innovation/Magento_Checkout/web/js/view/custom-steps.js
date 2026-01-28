define([
    'uiComponent',
    'Magento_Checkout/js/model/step-navigator',
    'ko'
], function (Component, stepNavigator, ko) {
    'use strict';

    return Component.extend({
        initialize: function () {
            this._super();

            // observáveis para controlar os estados dos passos do checkout
            this.isCartActive = ko.observable(false);
            this.isShippingActive = ko.observable(false);
            this.isPaymentActive = ko.observable(false);

            // verifica se está na página do carrinho (fora do checkout spa)
            if (window.location.pathname.indexOf('/checkout/cart') !== -1) {
                this.isCartActive(true);
                return this;
            }

            // lógica reativa com knockout para monitorar o passo ativo no checkout
            ko.computed(function () {
                // obtém o índice do passo ativo no step navigator
                const index = stepNavigator.getActiveItemIndex();

                // reseta os estados dos passos
                this.isCartActive(false);
                this.isShippingActive(false);
                this.isPaymentActive(false);

                // ativa o estado correspondente ao passo atual
                if (index === 0) {
                    this.isShippingActive(true);
                }

                if (index === 1) {
                    this.isPaymentActive(true);
                }
            }, this);

            return this;
        },

        /* ========= ações de clique ========= */

        // redireciona para a página do carrinho
        goToCart: function () {
            window.location.href = '/checkout/cart';
        },

        // navega para o passo de envio, se já estiver processado
        goToShipping: function () {
            if (stepNavigator.isProcessed('shipping')) {
                stepNavigator.navigateTo('shipping');
            }
        },

        // navega para o passo de pagamento, se já estiver processado
        goToPayment: function () {
            if (stepNavigator.isProcessed('payment')) {
                stepNavigator.navigateTo('payment');
            }
        }
    });
});