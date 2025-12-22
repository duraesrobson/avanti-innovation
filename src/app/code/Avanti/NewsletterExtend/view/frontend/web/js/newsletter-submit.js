require([
    'jquery',
    'mage/validation'
], function ($) {
    'use strict';

    $(document).on('submit', '#newsletter-validate-detail', function (e) {
        e.preventDefault();

        // referência ao formulário da newsletter
        var $form = $(this);

        // se o formulário não existir na página, não executa nada
        if (!$form.length) {
            return;
        }

        // validação padrão do Magento (mage/validation)
        if (!$form.validation('isValid')) {
            return;
        }

        // envio do formulário via AJAX
        $.ajax({
            // action definida no form (controller de newsletter)
            url: $form.attr('action'),
            type: 'POST',
            // serializa todos os campos do formulário
            data: $form.serialize()

        }).done(function () {
            // renderiza mensagem de sucesso dentro do bloco da newsletter
            renderNewsletterMessage('success', window.newsletterSuccessMessage);

            // limpa os campos do formulário após sucesso
            $form.trigger('reset');

        }).fail(function () {
            // renderiza mensagem de erro dentro do bloco da newsletter
            renderNewsletterMessage('error', window.newsletterErrorMessage);
        });
    });

    // função para renderizar a mensagem de sucesso ou erro dentro do bloco da newsletter
    function renderNewsletterMessage(type, text) {
        // html base da mensagem
        var html =
            '<div class="message message-' + type + '">' +
            '<div>' + text + '</div>' +
            '</div>';

        // insere a mensagem no container da newsletter
        $('.block.newsletter .newsletter-messages')
            .html(html)
            .hide()
            .fadeIn();
    }
}
);

