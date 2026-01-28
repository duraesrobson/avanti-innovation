define([
    'domReady',
    'Magento_Ui/js/lib/view/utils/dom-observer',
    'jquery',
    'mage/validation', 'Avanti_CheckoutCustom/js/jquery.inputmask.min',
    'Avanti_CheckoutCustom/js/validation/telephone-br'
], function (
    domReady,
    domObserver,
    $
) {
    'use strict';


    domReady(function () {
        domObserver.get('input[name="telephone"]', function (el) {
            var $el = $(el);


            // 1) máscara
            $el.inputmask("(99) 99999-9999", {
                clearIncomplete: true
            });


            // 2) garante que o form do checkout tenha validator
            // (no shipping geralmente é #co-shipping-form)
            var $form = $el.closest('form');
            if ($form.length && !$form.data('validator')) {
                $form.validation(); // ✅ inicializa jquery.validate no form
            }


            // 3) garante que o input tenha a rule aplicada
            // (mesmo que o UI component ainda não tenha injetado data-validate do jeito esperado)
            if ($el.rules) {
                $el.rules('add', {
                    'validate-telephoneBR': true
                });
            }


            // 4) força validação no blur (para aparecer imediatamente)
            $el.on('blur', function () {
                // valid() só funciona se tiver validator
                $el.valid();
            });
        });
    });
});