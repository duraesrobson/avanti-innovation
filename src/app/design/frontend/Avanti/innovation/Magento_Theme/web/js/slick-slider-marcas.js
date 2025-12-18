define([
    'jquery',
    'slick'
], function ($) {
    'use strict';

    $(document).ready(function () {
        var $slider = $('.slider-marcas-home .pagebuilder-column-line');

            $slider.slick({
                infinite: false,
                slidesToShow: 6,
                slidesToScroll: 6,
                dots: true,
                arrows: true
            });
    });
});
