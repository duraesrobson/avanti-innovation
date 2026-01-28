define(['jquery', 'mage/translate', 'mage/validation'], function ($) {
    'use strict';


    function onlyDigits(value) {
        return (value || '').replace(/\D/g, '');
    }


    /**
     * Regra BR prática:
     * - DDD obrigatório (2 dígitos)
     * - 10 dígitos (fixo) ou 11 (celular)
     * - se 11 dígitos, 3º dígito = 9 (celular)
     */
    $.validator.addMethod(
        'validate-telephoneBR',
        function (value, element) {
            var digits = onlyDigits(value);


            // se o campo não for obrigatório, deixa o required cuidar disso
            if (this.optional(element)) {
                return true;
            }


            // (DD) + número: 10 ou 11 dígitos no total
            if (!(digits.length === 10 || digits.length === 11)) {
                return false;
            }


            // DDD: não pode começar com 0
            var ddd = digits.substring(0, 2);
            if (!/^[1-9][0-9]$/.test(ddd)) {
                return false;
            }


            // celular: geralmente começa com 9 depois do DDD
            if (digits.length === 11 && digits.charAt(2) !== '9') {
                return false;
            }


            return true;
        },
        $.mage.__('Informe um telefone válido com DDD. Ex: (11) 91234-5678')
    );


    return function () { };
});