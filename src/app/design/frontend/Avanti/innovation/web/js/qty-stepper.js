define(['jquery'], function ($) {
   'use strict';


   return function (config, element) {
       var $root = $(element);
       var inputSelector = config.inputSelector || 'input.qty';
       var $input = $(inputSelector);


       // Se não achou pelo seletor específico, tenta achar dentro do componente
       if (!$input.length) {
           $input = $root.find('input.qty');
       }


       if (!$input.length) {
           return;
       }


       var getNumberAttr = function (attrName, fallback) {
           var val = $input.attr(attrName);
           if (val === undefined || val === null || val === '') {
               return fallback;
           }
           var num = Number(val);
           return Number.isFinite(num) ? num : fallback;
       };


       var getStep = function () {
           return getNumberAttr('step', 1);
       };


       var getMin = function () {
           return getNumberAttr('min', 1);
       };


       var getMax = function () {
           // se não tiver max, devolve null
           var val = $input.attr('max');
           if (val === undefined || val === null || val === '') {
               return null;
           }
           var num = Number(val);
           return Number.isFinite(num) ? num : null;
       };


       var clamp = function (value) {
           var min = getMin();
           var max = getMax();
           var v = value;


           if (v < min) v = min;
           if (max !== null && v > max) v = max;


           return v;
       };


       var setValue = function (next) {
           var v = clamp(next);
           $input.val(v);


           // importante: dispara eventos para validação e possíveis listeners do Magento
           $input.trigger('change');
           $input.trigger('input');
       };


       $root.on('click', '.qty-plus', function () {
           var current = Number($input.val()) || getMin();
           setValue(current + getStep());
       });


       $root.on('click', '.qty-minus', function () {
           var current = Number($input.val()) || getMin();
           setValue(current - getStep());
       });
   };
});