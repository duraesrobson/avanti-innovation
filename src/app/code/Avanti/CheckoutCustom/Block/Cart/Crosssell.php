<?php
namespace Avanti\CheckoutCustom\Block\Cart;

class Crosssell extends \Magento\Checkout\Block\Cart\Crosssell
{
    protected $_maxItemCount = 16; // altera o limite de produtos do crossell
}