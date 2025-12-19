<?php

namespace Avanti\BackToTop\Block;


use Magento\Framework\View\Element\Template;
use Magento\Store\Model\ScopeInterface;


class BackToTop extends Template
{
    const XML_PATH_ENABLED  = 'avanti_backtotop/general/enabled';
    const XML_PATH_POSITION = 'avanti_backtotop/general/position';
    const XML_PATH_COLOR    = 'avanti_backtotop/general/color';


    protected $scopeConfig;


    public function __construct(
        Template\Context $context,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        array $data = []
    ) {
        $this->scopeConfig = $scopeConfig;
        parent::__construct($context, $data);
    }


    public function isEnabled()
    {
        return (bool) $this->getConfig(self::XML_PATH_ENABLED);
    }


    public function getPosition()
    {
        return $this->getConfig(self::XML_PATH_POSITION);
    }


    public function getColor()
    {
        return $this->getConfig(self::XML_PATH_COLOR);
    }


    private function getConfig($path)
    {
        return $this->scopeConfig->getValue($path, ScopeInterface::SCOPE_STORE);
    }
}
