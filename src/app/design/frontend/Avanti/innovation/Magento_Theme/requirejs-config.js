var config = {
    paths: {
        slick: 'Magento_Theme/js/lib/slick.min'
    },
    shim: {
        slick: {
            deps: ['jquery']
        }
    },
    map: {
        '*': {
            footerAccordion: 'Magento_Theme/js/footer-accordion',
            slickSlider: 'Magento_Theme/js/slick-slider'
        }
    },
    deps: [
        'footerAccordion',
        'slickSlider'
    ]
};
