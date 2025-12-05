define([
    'jquery',
    'matchMedia'
], function ($, mediaCheck) {
    'use strict';

    console.log("footer-accordion: módulo carregado");

    // Só aplica o comportamento em mobile
    mediaCheck({
        media: '(max-width: 767px)',
        entry: function () {
            // Garante DOM pronto
            $(initAccordion);
        },
        exit: function () {
            // Ao sair do mobile, remove estados e estilos inline
            $('.footer-accordion')
                .removeClass('is-open')
                .find('ul')
                .attr('style', '');
        }
    });

    function initAccordion() {
        var $accordions = $('.footer-accordion');

        if (!$accordions.length) {
            console.log("footer-accordion: nenhum bloco encontrado");
            return;
        }

        $accordions.each(function () {
            var $block = $(this);
            var $title = $block.find('h4').first();
            var $list = $title.next().find("ul").first();;

            if (!$list.length) {
                console.log("footer-accordion: bloco sem <ul> logo após o <h4>");
                return;
            }

            // Estado inicial: fechado
            $block.removeClass('is-open');
            // $list.hide();

            // Evitar duplicar eventos
            $title
                .off('click.footerAccordion')
                .on('click.footerAccordion', function () {

                    // permite apenas um accordion aberto por vez
                    $accordions.not($block).removeClass('is-open');

                    $block.toggleClass('is-open');
                });
        });
    }
});
