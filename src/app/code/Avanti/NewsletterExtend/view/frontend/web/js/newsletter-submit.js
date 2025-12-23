require([
    'jquery',
    'mage/validation'
], function ($) {
    'use strict';

    // captura o evento de 'submit' do formulário com o ID especificado
    $(document).on('submit', '#newsletter-validate-detail', function (e) {

        // impede o comportamento padrão do navegador (que seria recarregar a página ao enviar)
        e.preventDefault();

        // referência ao formulário da newsletter
        var $form = $(this);
        // referência ao button do form
        var $submitButton = $form.find('button[type="submit"]');

        // se o formulário não existir na página, não executa nada
        if (!$form.length) {
            return;
        }

        // validação padrão do Magento (mage/validation)
        if (!$form.validation('isValid')) {
            return;
        }

        // inicia o estado de carregamento
        $form.trigger('processStart');
        // axdiciona o loader ao formulário e desabilita o botão
        $submitButton.prop('disabled', true);

        // envio do formulário via AJAX
        $.ajax({
            // action definida no form (controller de newsletter)
            url: $form.attr('action'),
            type: 'POST',
            // serializa todos os campos do formulário
            data: $form.serialize(),
            dataType: 'json'

        }).done(function (response) {
            var msg = response.message || window.newsletterSuccessMessage;

            // renderiza mensagem de sucesso dentro do bloco da newsletter
            renderNewsletterMessage('success', msg);

            // limpa os campos do formulário após sucesso
            $form.trigger('reset');

        }).fail(function () {
            // renderiza mensagem de erro dentro do bloco da newsletter
            renderNewsletterMessage('error', window.newsletterErrorMessage);
        }).always(function () {
            // finaliza o estado de carregamento (sucesso ou erro)
            $form.trigger('processStop');
            // ativa o botão novamente
            $submitButton.prop('disabled', false);
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

        // remove a mensagem após 5 segundos
        setTimeout(function () { $('.newsletter-messages').fadeOut(); }, 5000);
    }
}
);

