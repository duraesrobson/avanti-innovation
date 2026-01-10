define(['jquery'], function ($) {
    'use strict';

    return function (config, element) {
        var $root = $(element);
        var title = config.title || document.title;
        var url = config.url || window.location.href;

        var $btn = $root.find('.share-native');
        var $feedback = $root.find('.share-feedback');

        function showFeedback() {
            if (!$feedback.length) return;
            $feedback.stop(true, true).fadeIn(150);
            setTimeout(function () {
                $feedback.fadeOut(150);
            }, 2000);
        }

        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                showFeedback();
            } catch (e) {
                // fallback bem simples (casos antigos)
                var $temp = $('<input>');
                $('body').append($temp);
                $temp.val(text).select();
                document.execCommand('copy');
                $temp.remove();
                showFeedback();
            }
        }

        $btn.on('click', function () {
            if (navigator.share) {
                navigator.share({ title: title, url: url })
                    .catch(function () {
                        // usuário cancelou ou falhou: faz fallback copiando
                        copyToClipboard(url);
                    });
            } else {
                copyToClipboard(url);
            }
        });
    };
});
