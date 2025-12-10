define([
    "jquery",
    "matchMedia"
], function ($, mediaCheck) {
    "use strict";

    // só aplica o comportamento em mobile
    mediaCheck({
        media: "(max-width: 767px)",
        entry: function () {
            // executa o accordion após o DOM estar pronto
            $(initAccordion);
        },

        // saindo do mobile...
        exit: function () {
            // eeseta estados e estilos inline para evitar bugs no layout
            $(".footer-accordion")
                .removeClass("is-open")
                .find("ul")
                .attr("style", "");

            // remove os eventos de click do título que estavam no mobile  
            $(".footer-accordion h4").off("click.footerAccordion")
        },
    });

    function initAccordion() {
        // busca todos os elementos que tem a classe '.footer-accordion' e coloca eles dentro de um objeto jQuery (como se fosse um array de elementos)
        var $accordions = $(".footer-accordion");

        // se não existir nenhum bloco, não faz nada
        if (!$accordions.length) {
            console.log("footer-accordion: nenhum bloco encontrado");
            return;
        }

        // percorre cada bloco individualmente
        $accordions.each(function () {
            var $block = $(this);
            var $title = $block.find("h4").first();
            var $list = $title.next().find("ul").first();

            // se não tiver lista, retorna uma messagem no console para debug
            if (!$list.length) {
                console.log(
                    "footer-accordion: bloco sem <ul> logo após o <h4>"
                );
                return;
            }

            // estado inicial: fechado
            $block.removeClass("is-open");

            // deixa o título de cada accordion como gatilho para abrir a lista ao clicar
            $title
                .off("click.footerAccordion") // evita duplicar eventos
                .on("click.footerAccordion", function () {
                    // permite apenas um accordion aberto por vez
                    $accordions
                        .not($block)
                        .removeClass("is-open")
                        .find("ul")
                        .slideUp(250);

                    // alterna entre adicionar e remover a clase is-open do .footer-accordion
                    $block.toggleClass("is-open");

                    // alterna entre mostrar e não mostrar o conteúdo da lista do .footer-accordion
                    $list.slideToggle(250);
                    toggle;
                });
        });
    }
});
