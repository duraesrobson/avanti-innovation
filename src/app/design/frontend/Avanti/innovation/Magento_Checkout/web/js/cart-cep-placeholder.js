define(['jquery'], function ($) {
    'use strict';

    var interval = setInterval(function () {
        var $cep = $('input[name="postcode"]');

        if ($cep.length) {

            function ensurePlaceholder() {
                $cep.attr('placeholder', '88000-000');
            }

            // aplica ao carregar
            ensurePlaceholder();

            // reaplica se o KO recriar ou limpar
            $cep.on('input blur', function () {
                if (!this.value) {
                    ensurePlaceholder();
                }
            });

            clearInterval(interval);
        }
    }, 300);
});
