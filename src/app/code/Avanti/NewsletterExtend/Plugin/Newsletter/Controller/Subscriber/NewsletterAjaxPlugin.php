<?php

namespace Avanti\NewsletterExtend\Plugin\Newsletter\Controller\Subscriber;

use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Message\ManagerInterface;
use Magento\Framework\App\RequestInterface;

class NewsletterAjaxPlugin
{
    // injeção de dependências
    protected $resultJsonFactory; // para criar resposta JSON
    protected $messageManager; // para gerenciar mensagens do Magento
    protected $request; // para detectar AJAX

    public function __construct(
        JsonFactory $resultJsonFactory,
        ManagerInterface $messageManager,
        RequestInterface $request
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->messageManager = $messageManager;
        $this->request = $request;
    }

    // "after" plugin no execute do controller NewAction
    // retorna JSON em vez de recarregar a página se for requisição AJAX
    public function afterExecute($subject, $result)
    {
        // Verifica se é uma requisição AJAX (comum no jQuery do Magento)
        if ($this->request->isXmlHttpRequest()) {
            // Remove as mensagens que o controller acabou de adicionar à sessão
            // Isso evita que elas apareçam no próximo reload
            $this->messageManager->getMessages(true);

            // cria o objeto JSON de resposta
            $resultJson = $this->resultJsonFactory->create();

            // retorna resposta JSON
            return $resultJson->setData([
                'success' => true,
                'message' => __('Thank you for your subscription.')
            ]);
        }

        // se não for AJAX, retorna o resultado original do controller
        return $result;
    }
}
