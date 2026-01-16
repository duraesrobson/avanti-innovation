define([
    'jquery',
    'slick'
], function ($) {
    'use strict';

    $(document).ready(function () {
        var $slider = $('.products-related .product-items, .products-upsell .product-items');

        if ($slider.length) {
            $slider.slick({
                infinite: false,
                slidesToShow: 5,        // Padrão Desktop
                slidesToScroll: 5,      // Padrão Desktop
                dots: true,
                arrows: true,
                responsive: [
                    {
                        // Até 767px (Mobile)
                        breakpoint: 768, 
                        settings: {
                            slidesToShow: 2,   // Mostra 2 slides
                            slidesToScroll: 2, // Move de 2 em 2
                            arrows: false,      // Geralmente em mobile usa-se apenas dots
                            dots: true
                        }
                    }
                ]
            });
        }
    });
});