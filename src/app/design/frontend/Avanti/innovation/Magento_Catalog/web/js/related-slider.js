define([
    'jquery',
    'slick'
], function ($) {
    'use strict';
    // garante que o código só execute após o DOM estar carregado
    $(document).ready(function () {

        // seleciona o elemento que será transformado em slider
        var $slider = $('.products-related .product-items, .products-upsell .product-items');

        // função responsável por controlar quando o Slick é iniciado ou destruído
        function handleSlider() {

            // se a largura da tela for maior ou igual a 768px (desktop)
            if ($(window).width() >= 768) {

                // só inicializa o slick se ele ainda não tiver sido iniciado
                if (!$slider.hasClass('slick-initialized')) {
                    $slider.slick({
                        infinite: false,        // não faz loop infinito
                        slidesToShow: 5,        // quantos slides aparecem por vez
                        slidesToScroll:5,      // quantos slides avançam por vez
                        dots: true,            // remove os indicadores (bolinhas)
                        arrows: true            // mostra setas de navegação
                    });
                }

            } else {

                // se for mobile e o Slick estiver ativo
                if ($slider.hasClass('slick-initialized')) {
                    // remove o Slick e volta o HTML ao estado original
                    $slider.slick('unslick');
                }
            }
        }

        // executa a verificação assim que a página carrega
        handleSlider();

        // reexecuta a verificação sempre que a tela for redimensionada
        $(window).on('resize', handleSlider);
    });
});