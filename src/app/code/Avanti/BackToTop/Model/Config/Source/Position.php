<?php

namespace Avanti\BackToTop\Model\Config\Source;


use Magento\Framework\Option\ArrayInterface;


class Position implements ArrayInterface
{
    public function toOptionArray()
    {
        return [
            ['value' => 'right', 'label' => __('Right')],
            ['value' => 'left', 'label' => __('Left')],
        ];
    }
}
