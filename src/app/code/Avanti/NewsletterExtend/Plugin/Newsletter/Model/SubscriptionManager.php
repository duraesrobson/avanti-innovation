<?php

namespace Avanti\NewsletterExtend\Plugin\Newsletter\Model;

use Magento\Framework\App\Request\Http;
use Magento\Newsletter\Model\SubscriberFactory;
use Magento\Store\Model\StoreManagerInterface;

class SubscriptionManager
{
    // injeção de dependências
    protected $request;
    protected $subscriberFactory;
    protected $storeManager;

    public function __construct(
        Http $request,
        SubscriberFactory $subscriberFactory,
        StoreManagerInterface $storeManager
    ) {
        $this->request = $request;
        $this->subscriberFactory = $subscriberFactory;
        $this->storeManager = $storeManager;
    }

    //  "around" plugin no método subscribe do SubscriptionManager
    //  permite adicionar campos extras como 'name' e 'privacy' ao subscriber
    public function aroundSubscribe(
        \Magento\Newsletter\Model\SubscriptionManager $subject,
        callable $proceed,
        $email,
        $storeId
    ) {
        // Primeiro, deixa o Magento fazer o fluxo normal
        $result = $proceed($email, $storeId);

        // Depois, intercepta os dados extras do request
        $name = $this->request->getParam('name');
        $privacy = $this->request->getParam('privacy');

        // só continua se ambos existirem
        if ($name && $privacy) {
            // obtém o websiteId correspondente ao store
            $websiteId = (int) $this->storeManager->getStore($storeId)->getWebsiteId();

            // carrega o subscriber pelo email e website
            $subscriber = $this->subscriberFactory->create()->loadBySubscriberEmail($email, $websiteId);

            // se existir subscriber
            if ($subscriber->getId()) {
                // define o nome
                if ($name) {
                    $subscriber->setSubscriberName($name);
                }

                // define o valor do campo de privacidade
                $privacyValue = ($privacy == '1') ? 1 : 0;
                $subscriber->setSubscriberPrivacy($privacyValue);

                // salva as alterações no subscriber
                $subscriber->save();
            }
        }

        // retorna o resultado original do subscribe
        return $result;
    }
}
