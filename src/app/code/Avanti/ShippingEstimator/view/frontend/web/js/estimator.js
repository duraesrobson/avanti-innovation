define([
    'jquery',
    'mage/url'
], function ($, urlBuilder) {
    'use strict';

    return function (config, element) {
        var $el = $(element);
        var data = $el.data('estimator') || {};
        var ajaxUrl = data.ajaxUrl || urlBuilder.build('avanti-estimator/ajax/estimate');

        var $btn = $el.find('.estimate');
        var $cep = $el.find('.input-text.cep');
        var $qty = 1;
        var $results = $el.find('.results');

        function getProductData() {
            // pega productId da PDP (forma simples)
            var productId = $('input[name="product"]').val();

            // Se tiver configurable/swatch, você pode coletar os super_attribute aqui também.
            // Exemplo: var superAttr = {};
            // $('[name^="super_attribute"]').each(function(){ ... });

            return {
                product_id: productId,
                qty: 1,
                postcode: $cep.val()
                // super_attribute: superAttr,
                // options: ...
            };
        }

        $btn.on('click', function () {
            $results.html('...');

            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                dataType: 'json',
                data: getProductData()
            }).done(function (res) {
                if (!res.success) {
                    $results.html('<div class="message error">' + (res.message || 'Error') + '</div>');
                    return;
                }

                if (!res.rates || !res.rates.length) {
                    $results.html('<div class="message notice">No shipping methods available.</div>');
                    return;
                }

                var html = '<ul>';
                res.rates.forEach(function (r) {
                    html += '<li><strong>' + r.title + '</strong> — ' + r.price + '</li>';
                });
                html += '</ul>';

                $results.html(html);
            }).fail(function () {
                $results.html('<div class="message error">Request failed.</div>');
            });
        });
    };
});