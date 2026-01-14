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
            $productId = (int)$this->getRequest()->getParam('product_id');
            $qty = (float)$this->getRequest()->getParam('qty', 1);
            $postcode = (string)$this->getRequest()->getParam('postcode');

            if (!$productId || !$postcode) {
                return $result->setData([
                    'success' => false,
                    'message' => 'Product and postcode are required.'
                ]);
            }

            $store = $this->storeManager->getStore();
            $product = $this->productRepository->getById($productId, false, $store->getId());

            $quote = $this->quoteFactory->create();
            $quote->setStore($store);
            $quote->setIsActive(false);
            $quote->setCheckoutMethod('guest');

            $request = new DataObject(['qty' => $qty]);
            $quote->addProduct($product, $request);

            $shippingAddress = $quote->getShippingAddress();
            $shippingAddress->setCountryId('BR');
            $shippingAddress->setPostcode($postcode);

            // para forçar o recálculo do zero
            $shippingAddress->setCollectShippingRates(true);
            $quote->getShippingAddress()->setCollectShippingRates(true);

            $shippingAddress->setCollectShippingRates(true);
            $shippingAddress->collectShippingRates();

            $rates = $shippingAddress->getAllShippingRates();

            $dataRates = [];
            foreach ($rates as $rate) {
                $price = (float)$rate->getPrice();
                $dataRates[] = [
                    'carrier' => $rate->getCarrier(),
                    'method'  => $rate->getMethod(),
                    'title'   => trim($rate->getCarrierTitle() . ' - ' . $rate->getMethodTitle()),
                    'price'   => $this->priceHelper->currency($price, true, false),
                ];
            }

            return $result->setData([
                'success' => true,
                'rates' => $dataRates
            ]);
        } catch (\Throwable $e) {
            return $result->setData([
                'success' => false,
                'message' => 'Error estimating shipping: ' . $e->getMessage()
            ]);
        }
    }
}
