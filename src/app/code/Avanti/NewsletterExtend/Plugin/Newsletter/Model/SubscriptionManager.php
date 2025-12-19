<?php

namespace Avanti\NewsletterExtend\Plugin\Newsletter\Model;

use Magento\Framework\App\Request\Http;
use Magento\Newsletter\Model\SubscriberFactory;
use Magento\Store\Model\StoreManagerInterface;

class SubscriptionManager
{
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

        if ($name && $privacy) {
            $websiteId = (int) $this->storeManager->getStore($storeId)->getWebsiteId();
            $subscriber = $this->subscriberFactory->create()->loadBySubscriberEmail($email, $websiteId);

            if ($subscriber->getId()) {
                if ($name) {
                    $subscriber->setSubscriberName($name);
                }

                $privacyValue = ($privacy == '1') ? 1 : 0;
                $subscriber->setSubscriberPrivacy($privacyValue);

                $subscriber->save();
            }
        }

        return $result;
    }
}
