define([
    'jquery',
    'slick'
], function ($) {
    'use strict';

    $(document).ready(function () {
        var $slider = $('.slider-marcas-home .pagebuilder-column-line');

        function handleSlider() {
            if ($(window).width() >= 768) {
                if (!$slider.hasClass('slick-initialized')) {
                    $slider.slick({
                        infinite: false,
                        slidesToShow: 6,
                        slidesToScroll: 6,
                        dots: true,
                        arrows: true
                    });
                }
            } else {
                if ($slider.hasClass('slick-initialized')) {
                    $slider.slick('unslick');
                }
            }
        }

        handleSlider();
        $(window).on('resize', handleSlider);
    });
});
