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
            var productId = $('input[name="product"]').val();
            var postcode = $cep.val();

            // Objeto para armazenar Cor, Tamanho, etc.
            var superAttr = {};

            // Busca todos os selects ou inputs de swatches que começam com 'super_attribute'
            $('[name^="super_attribute"]').each(function () {
                var name = $(this).attr('name'); // Ex: super_attribute[93]
                var id = name.match(/\[(\d+)\]/)[1]; // Extrai apenas o ID (93)
                var value = $(this).val();

                if (value) {
                    superAttr[id] = value;
                }
            });

            return {
                product_id: productId,
                qty: 1,
                postcode: postcode,
                super_attribute: superAttr // Enviamos o objeto com as escolhas
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