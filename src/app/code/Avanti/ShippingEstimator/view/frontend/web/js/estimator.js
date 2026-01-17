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
        var $results = $el.find('.results');

        function getProductData() {
            var productId = $('input[name="product"]').val();
            var postcode = $cep.val();
            var superAttr = {};
            var allSelected = true; // Declarada sem $

            var $swatches = $('[name^="super_attribute"]');

            $swatches.each(function () {
                var name = $(this).attr('name');
                var idMatch = name.match(/\[(\d+)\]/);
                var value = $(this).val();

                if (idMatch) {
                    var id = idMatch[1];
                    // CORREÇÃO: Removido o $ de $allSelected
                    if (!value || value === "") {
                        allSelected = false;
                    } else {
                        superAttr[id] = value;
                    }
                }
            });

            // Se houver opções e nem todas foram marcadas, retorna falso
            if ($swatches.length > 0 && !allSelected) {
                return false;
            }

            return {
                product_id: productId,
                qty: 1,
                postcode: postcode,
                super_attribute: superAttr
            };
        }

        $btn.on('click', function (e) {
            e.preventDefault();

            var productData = getProductData();

            // Validação de opções
            if (productData === false) {
                $results.html('<div class="message warning">Por favor, selecione as opções do produto (cor, tamanho, etc).</div>');
                return;
            }

            // Validação de CEP
            if (!$cep.val() || $cep.val().length < 8) {
                $results.html('<div class="message warning">Preencha um CEP válido.</div>');
                return;
            }

            $results.html('<div class="loading">Calculando...</div>');

            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                dataType: 'json',
                data: productData
            }).done(function (res) {
                if (!res.success) {
                    $results.html('<div class="message error">' + (res.message || 'Erro no cálculo.') + '</div>');
                    return;
                }

                if (!res.rates || !res.rates.length) {
                    $results.html('<div class="message notice">Não há frete disponível para as opções selecionadas.</div>');
                    return;
                }

                var html = '<ul>';
                res.rates.forEach(function (r) {
                    // Verifica se o preço é a string "GRÁTIS" (exatamente como definido no PHP)
                    var isFree = (r.price === 'GRÁTIS');
                    var priceClass = isFree ? 'frete-gratis' : 'frete-normal';

                    html += '<li>';
                    html += '<strong>' + r.title + '</strong>';
                    html += '<strong class="' + priceClass + '">' + r.price + '</strong>';
                    html += '</li>';
                });
                html += '</ul>';

                $results.html(html);
            }).fail(function () {
                $results.html('<div class="message error">Falha ao conectar com o servidor.</div>');
            });
        });
    };
});