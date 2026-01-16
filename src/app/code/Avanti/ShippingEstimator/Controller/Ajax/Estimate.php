<?php

namespace Avanti\ShippingEstimator\Controller\Ajax;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Quote\Model\QuoteFactory;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\DataObject;
use Magento\Framework\Pricing\Helper\Data as PriceHelper;

class Estimate extends Action
{
    private JsonFactory $resultJsonFactory;
    private ProductRepositoryInterface $productRepository;
    private QuoteFactory $quoteFactory;
    private StoreManagerInterface $storeManager;
    private PriceHelper $priceHelper;

    public function __construct(
        Context $context,
        JsonFactory $resultJsonFactory,
        ProductRepositoryInterface $productRepository,
        QuoteFactory $quoteFactory,
        StoreManagerInterface $storeManager,
        PriceHelper $priceHelper
    ) {
        parent::__construct($context);
        $this->resultJsonFactory = $resultJsonFactory;
        $this->productRepository = $productRepository;
        $this->quoteFactory = $quoteFactory;
        $this->storeManager = $storeManager;
        $this->priceHelper = $priceHelper;
    }

    public function execute()
    {
        $result = $this->resultJsonFactory->create();

        try {
            $params = $this->getRequest()->getParams();
            $productId = (int)($params['product_id'] ?? 0);
            $postcode = (string)($params['postcode'] ?? '');
            
            if (!$productId || !$postcode) {
                return $result->setData([
                    'success' => false,
                    'message' => __('Product ID and Postcode are required.')
                ]);
            }

            $store = $this->storeManager->getStore();
            $product = $this->productRepository->getById($productId, false, $store->getId());

            $quote = $this->quoteFactory->create();
            $quote->setStore($store);
            $quote->setIsActive(false);
            $quote->setCheckoutMethod('guest');

            // Criamos o request com TODOS os parâmetros (incluindo super_attribute)
            $request = new DataObject($params);
            $quote->addProduct($product, $request);

            $shippingAddress = $quote->getShippingAddress();
            $shippingAddress->setCountryId('BR');
            $shippingAddress->setPostcode($postcode);

            // Coleta as taxas
            $shippingAddress->setCollectShippingRates(true);
            $quote->collectTotals();
            $rates = $shippingAddress->getAllShippingRates();

            $dataRates = [];
            foreach ($rates as $rate) {
                if ($rate->getErrorMessage()) continue;

                $price = (float)$rate->getPrice();
                // se o preço for 0, vira "GRÁTIS"
                $priceFormatted = ($price <= 0) ? 'GRÁTIS' : $this->priceHelper->currency($price, true, false);

                $dataRates[] = [

                    'carrier' => $rate->getCarrier(),
                    'method'  => $rate->getMethod(),
                    'title'   => trim($rate->getCarrierTitle() . $rate->getMethodTitle()),
                    'price'   => $priceFormatted,
                ];
            }

            return $result->setData([
                'success' => true,
                'rates' => $dataRates
            ]);
        } catch (\Throwable $e) {
            return $result->setData([
                'success' => false,
                'message' => __('Error: %1', $e->getMessage())
            ]);
        }
    }
}
