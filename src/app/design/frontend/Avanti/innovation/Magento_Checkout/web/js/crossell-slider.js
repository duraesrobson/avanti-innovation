define([
    'jquery',
    'slick'
], function ($) {
    'use strict';
    // garante que o código só execute após o DOM estar carregado
    $(document).ready(function () {

        // seleciona o elemento que será transformado em slider
        var $slider = $('.page-layout-checkout .product-items');

        // função responsável por controlar quando o Slick é iniciado ou destruído
        function handleSlider() {

            // se a largura da tela for maior ou igual a 768px (desktop)
            if ($(window).width() >= 768) {

                // só inicializa o slick se ele ainda não tiver sido iniciado
                if (!$slider.hasClass('slick-initialized')) {
                    $slider.slick({
                        infinite: false,
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        dots: true,
                        arrows: true,
                        variableWidth: true
                    });
                }

            } else {

                // se for mobile e o Slick estiver ativo
                if (!$slider.hasClass('slick-initialized')) {
                    $slider.slick({
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,   // permite variação de width
                        dots: true,
                        arrows: false,
                        centerMode: false      // garante que comece alinhado à esquerda
                    });
                }
            }
        }

        // executa a verificação assim que a página carrega
        handleSlider();

        // reexecuta a verificação sempre que a tela for redimensionada
        $(window).on('resize', handleSlider);
    });
});